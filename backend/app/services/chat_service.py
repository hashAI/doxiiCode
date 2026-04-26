"""
Complete Chat Service with all original functionality preserved.

This version includes ALL the original streaming logic and functionality
while still using the extracted components for better organization.
"""

import os
import shutil
import json
import logging
import asyncio
import random
import time
import re
from typing import List, Optional, Dict, Any, AsyncGenerator, Tuple
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.models.chat import Chat, ChatCreate, ChatResponse, ChatUpdate
from app.models.message import Message, MessageCreate, MessageResponse
from app.config import settings
from app.services.cms_service import cms_service
import httpx

# Import refactored components
from .utils import RateLimitHandler, FileUtils
from .agent import ToolExecutor
from .tools import ToolSchemas
from .prompts import SystemPrompts

logger = logging.getLogger(__name__)


class ChatService:
    """
    Complete Chat Service with all original functionality preserved.
    Uses extracted components but maintains full streaming logic.
    """

    def __init__(self):
        self.chats_dir = "chats"
        os.makedirs(self.chats_dir, exist_ok=True)
        self._openai_client = None

        # Configuration
        self._default_max_bytes: int = 200_000
        self._default_max_results: int = 500
        self._default_max_steps: int = 20

        # Initialize extracted components
        self.rate_limit_handler = RateLimitHandler(
            initial_delay=1.0,
            exponential_base=2.0,
            jitter=True,
            max_retries=6,
            max_delay=60.0
        )

        self.tool_executor = ToolExecutor(self.chats_dir)

        # In-memory TODO management - each chat has its own TODO list
        self._chat_todos: Dict[str, List[Dict[str, Any]]] = {}

    def _get_openai_client(self):
        """Get or create OpenAI client."""
        if self._openai_client is None:
            from openai import AsyncOpenAI
            self._openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        return self._openai_client

    # File system utility methods needed by preview router
    def _canonicalize(self, path: str) -> str:
        """Canonicalize a path by resolving symlinks and expanding user home."""
        return os.path.realpath(os.path.expanduser(path))

    def _is_path_within_chat_root(self, chat_id: str, target: str) -> bool:
        """Check if a target path is within the chat root directory."""
        chat_root = os.path.join(self.chats_dir, chat_id)
        root_c = self._canonicalize(chat_root)
        target_c = self._canonicalize(target)
        try:
            common = os.path.commonpath([root_c, target_c])
        except ValueError:
            return False
        return common == root_c

    def _ensure_within_chat_root_or_raise(self, chat_id: str, target: str) -> None:
        """Ensure a path is within the chat root, raise PermissionError if not."""
        if not self._is_path_within_chat_root(chat_id, target):
            raise PermissionError(f"Path outside chat root not allowed: {target}")

    def _normalize_rel_path(self, chat_id: str, rel_path: str) -> str:
        """Normalize a relative path and ensure it stays within chat root."""
        chat_root = self._canonicalize(os.path.join(self.chats_dir, chat_id))
        rel_path = rel_path.strip().lstrip("/\\")

        # Strip accidental 'chats/{chat_id}/' prefix
        accidental_prefix = os.path.join(self.chats_dir, chat_id) + os.sep
        if rel_path.startswith(accidental_prefix):
            rel_path = rel_path[len(accidental_prefix):]

        # If absolute path is passed, convert to rel if within chat root
        if os.path.isabs(rel_path):
            abs_path = self._canonicalize(rel_path)
            if not self._is_path_within_chat_root(chat_id, abs_path):
                raise PermissionError(f"Path outside chat root not allowed: {rel_path}")
            return os.path.relpath(abs_path, chat_root)

        # Collapse any .. or . segments
        normalized = os.path.normpath(rel_path)
        # Prevent escaping above root
        abs_candidate = self._canonicalize(os.path.join(chat_root, normalized))
        self._ensure_within_chat_root_or_raise(chat_id, abs_candidate)
        return os.path.relpath(abs_candidate, chat_root)

    def _read_text_safely(self, path: str, max_bytes: int) -> Tuple[str, bool]:
        """Read text file safely with size limit."""
        with open(path, "rb") as f:
            data = f.read(max_bytes + 1)
        truncated = len(data) > max_bytes
        return data[:max_bytes].decode("utf-8", errors="replace"), truncated

    def _write_text_safely(self, path: str, content: str, create_dirs: bool, overwrite: bool) -> None:
        """Write text file safely with proper error handling."""
        dirpath = os.path.dirname(path)
        if dirpath and create_dirs and not os.path.exists(dirpath):
            os.makedirs(dirpath, exist_ok=True)
        if os.path.exists(path) and not overwrite:
            raise FileExistsError(f"File exists and overwrite=False: {path}")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

    def _get_gitignore_aware_file_list(self, chat_id: str, max_files: int = 100) -> List[str]:
        """Get a list of files respecting .gitignore patterns and common exclusions."""
        chat_root = os.path.join(self.chats_dir, chat_id)
        if not os.path.exists(chat_root):
            return []

        # Common patterns to exclude (like .gitignore)
        exclude_patterns = [
            "node_modules",
            "dist",
            "build",
            ".git",
            ".DS_Store",
            "*.log",
            "*.lock",
            "coverage",
            ".env*",
            "*.tmp",
            "*.temp",
        ]

        # Try to read .gitignore if it exists
        gitignore_path = os.path.join(chat_root, ".gitignore")
        if os.path.exists(gitignore_path):
            try:
                with open(gitignore_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#"):
                            exclude_patterns.append(line)
            except Exception:
                pass  # Continue with default patterns

        files = []
        try:
            for root, dirs, files_in_dir in os.walk(chat_root):
                # Remove excluded directories from dirs list to prevent walking into them
                dirs[:] = [
                    d
                    for d in dirs
                    if not d.startswith(".")
                    and not any(
                        pattern in os.path.join(root, d) or pattern == d or pattern == os.path.basename(d)
                        for pattern in exclude_patterns
                    )
                ]

                for file in files_in_dir:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, chat_root)

                    # Exclude hidden files or any path segment starting with '.'
                    if file.startswith(".") or any(seg.startswith(".") for seg in rel_path.split(os.sep)):
                        continue

                    # Check if file should be excluded by patterns
                    if any(
                        pattern in rel_path
                        or pattern == file
                        or (pattern.startswith("*") and rel_path.endswith(pattern[1:]))
                        for pattern in exclude_patterns
                    ):
                        continue

                    files.append(rel_path)
                    if len(files) >= max_files:
                        return files
        except Exception:
            pass  # Return what we have so far

        return files[:max_files]

    def _read_file(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Read a text file with size limit and return content and truncation flag."""
        rel_path = self._normalize_rel_path(chat_id, args["path"])  # ensure strictly relative
        max_bytes = int(args.get("max_bytes") or self._default_max_bytes)
        chat_root = os.path.join(self.chats_dir, chat_id)
        abs_path = self._canonicalize(os.path.join(chat_root, rel_path))
        self._ensure_within_chat_root_or_raise(chat_id, abs_path)

        logger.info("read_file: %s (max_bytes=%s) for chat %s", rel_path, max_bytes, chat_id)

        if not os.path.exists(abs_path):
            return {"error": f"File not found: {rel_path}"}
        if os.path.isdir(abs_path):
            return {"error": f"Path is a directory: {rel_path}"}

        text, truncated = self._read_text_safely(abs_path, max_bytes)
        return {"path": rel_path, "content": text, "truncated": truncated}

    def _write_file(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Write (or overwrite) a text file. Creates parent dirs if requested."""
        rel_path = self._normalize_rel_path(chat_id, args["path"])  # ensure strictly relative
        content = args["content"]
        create_dirs = bool(args.get("create_dirs", True))
        overwrite = bool(args.get("overwrite", True))

        chat_root = os.path.join(self.chats_dir, chat_id)
        abs_path = self._canonicalize(os.path.join(chat_root, rel_path))
        self._ensure_within_chat_root_or_raise(chat_id, abs_path)

        logger.info("write_file: %s (bytes=%d overwrite=%s) for chat %s", rel_path, len(content), overwrite, chat_id)

        try:
            # Write to disk
            self._write_text_safely(abs_path, content, create_dirs=create_dirs, overwrite=overwrite)
        except Exception as e:
            return {"error": str(e)}

        # Always return a normalized path relative to the chat root
        safe_rel_path = os.path.relpath(abs_path, chat_root)
        return {"path": safe_rel_path, "bytes_written": len(content)}

    def _get_tool_schemas(self) -> List[Dict[str, Any]]:
        """Tool schemas compatible with the Responses API (no nested `function`)."""
        # Import design search if available
        try:
            from design_search import design_search_tool_func, SEMANTIC_SEARCH_AVAILABLE
            DESIGN_SEARCH_AVAILABLE = SEMANTIC_SEARCH_AVAILABLE
        except ImportError:
            DESIGN_SEARCH_AVAILABLE = False

        return ToolSchemas.get_all_schemas(design_search_available=DESIGN_SEARCH_AVAILABLE)

    def _safe_json_loads(self, json_str: str) -> Dict[str, Any]:
        """Safely parse JSON string with control character handling."""
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            logger.warning(f"⚠️ JSON decode error: {e}, attempting to clean control characters")
            # Clean common control characters that cause JSON parsing issues
            cleaned = (
                json_str.replace("\\n", "\\\\n")
                .replace("\\t", "\\\\t")
                .replace("\\r", "\\\\r")
                .replace("\\b", "\\\\b")
                .replace("\\f", "\\\\f")
            )
            try:
                return json.loads(cleaned)
            except json.JSONDecodeError as e2:
                logger.error(f"❌ Failed to parse JSON even after cleaning: {e2}")
                logger.error(f"📍 Raw JSON string: {repr(json_str)}")
                raise e2

    def _run_tool(self, name: str, arguments: Dict[str, Any], chat_id: str) -> Dict[str, Any]:
        """Dispatch tool call using ToolExecutor."""
        return self.tool_executor.run_tool(name, arguments, chat_id)

    def _build_tool_status_message(self, function_name: Optional[str], args: Dict[str, Any]) -> str:
        """Return a status line identical to prior inline logic."""
        if not function_name:
            return "Processing…"
        if function_name == "write_file":
            return f"Write {args.get('path', 'file')}…"
        if function_name == "modify_file":
            return f"Edit {args.get('path', 'file')}…"
        if function_name == "read_file":
            return f"Read {args.get('path', 'file')}…"
        if function_name == "list_files":
            return "List files…"
        if function_name == "delete_file":
            return f"Delete {args.get('path', 'file')}…"
        if function_name == "copy_file":
            return f"Copy {args.get('source', 'file')}…"
        if function_name == "move_file":
            return f"Move {args.get('source', 'file')}…"
        if function_name == "create_directory":
            return f"Create directory {args.get('path', '')}…"
        if function_name == "list_directory_tree":
            return "List directory tree…"
        if function_name == "list_processes":
            return "Listing processes…"
        if function_name == "kill_process":
            return f"Killing process {args.get('pid', '')}…"
        return "Processing…"

    def _build_tool_completion_summary(
        self, function_name: Optional[str], args: Dict[str, Any], result: Dict[str, Any]
    ) -> Tuple[str, Optional[str], Optional[Dict[str, Any]]]:
        """Build the exact same summary strings and optional files_changed entry used previously."""
        summary = "Completed"
        path_for_summary: Optional[str] = None

        if isinstance(result, dict):
            path_for_summary = result.get("path") or args.get("path")

        if function_name == "write_file":
            bytes_written = result.get("bytes_written", 0) if isinstance(result, dict) else 0
            estimated_lines = max(1, bytes_written // 50)
            if path_for_summary:
                summary = f"Write {path_for_summary} (+{estimated_lines} lines)"
                return summary, path_for_summary, {
                    "path": path_for_summary,
                    "action": "created",
                    "lines_added": estimated_lines,
                    "lines_removed": 0,
                }
            else:
                summary = f"Write (+{estimated_lines} lines)"
                return summary, path_for_summary, None

        if function_name == "modify_file":
            replacements = int(result.get("replacements", 0) if isinstance(result, dict) else 0)
            added = replacements
            removed = max(0, replacements - 1)
            if path_for_summary:
                summary = f"Edit {path_for_summary} (+{added} -{removed})"
                return summary, path_for_summary, {
                    "path": path_for_summary,
                    "action": "edited",
                    "lines_added": added,
                    "lines_removed": removed,
                }
            else:
                summary = f"Edit (+{added} -{removed})"
                return summary, path_for_summary, None

        if function_name == "read_file":
            if path_for_summary:
                summary = f"Read {path_for_summary}"
            else:
                summary = "Read file"
            return summary, path_for_summary, None

        if function_name == "list_files":
            file_count = 0
            if isinstance(result, dict):
                if isinstance(result.get("files"), list):
                    file_count = len(result.get("files"))
                else:
                    file_count = int(result.get("file_count", 0))
            summary = f"List files ({file_count})"
            return summary, path_for_summary, None

        if function_name == "delete_file":
            if path_for_summary:
                deleted_type = result.get("deleted", "item") if isinstance(result, dict) else "item"
                summary = f"Delete {path_for_summary} ({deleted_type})"
                return summary, path_for_summary, {
                    "path": path_for_summary,
                    "action": "deleted",
                    "lines_added": 0,
                    "lines_removed": 1,
                }
            else:
                summary = "Delete item"
                return summary, path_for_summary, None

        if function_name in ["copy_file", "move_file"]:
            action = "copied" if function_name == "copy_file" else "moved"
            source = args.get("source", "")
            dest = result.get("destination", args.get("destination", "")) if isinstance(result, dict) else ""
            if source and dest:
                summary = f"{action.title()} {source} → {dest}"
                return summary, dest, {
                    "path": dest,
                    "action": action,
                    "lines_added": 1,
                    "lines_removed": 0,
                }
            else:
                summary = f"File {action}"
                return summary, path_for_summary, None

        if function_name == "create_directory":
            if path_for_summary:
                summary = f"Create directory {path_for_summary}"
                return summary, path_for_summary, {
                    "path": path_for_summary,
                    "action": "created",
                    "lines_added": 1,
                    "lines_removed": 0,
                }
            else:
                summary = "Create directory"
                return summary, path_for_summary, None

        if function_name in ["list_processes", "kill_process"]:
            if function_name == "list_processes":
                count = result.get("count", 0) if isinstance(result, dict) else 0
                summary = f"List processes ({count})"
            else:  # kill_process
                pid = args.get("pid", "")
                success = result.get("success", False) if isinstance(result, dict) else False
                summary = f"Kill process {pid} {'✓' if success else '✗'}"
            return summary, path_for_summary, None

        if function_name == "list_directory_tree":
            summary = "Directory tree listed"
            return summary, path_for_summary, None

        return summary, path_for_summary, None

    async def _is_first_message(self, chat_id: str) -> bool:
        """Check if this is the first message by inspecting the first assistant message's files summary."""
        db = await get_database()
        first_files_summary = await db.messages.find_one(
            {"chat_id": ObjectId(chat_id), "role": "assistant", "message_type": "files_summary"}, sort=[("_id", 1)]
        )
        if not first_files_summary:
            return True
        content = first_files_summary.get("content", "")
        if not content or (isinstance(content, str) and content.strip() == ""):
            return True
        try:
            files_changed = json.loads(content)
            if isinstance(files_changed, list) and len(files_changed) == 0:
                return True
        except Exception:
            pass
        return False

    def _get_system_prompt(self, chat_id: str, is_first_message: bool = False) -> str:
        """Return system prompt optimized for first vs subsequent messages."""
        # Check for design search availability
        try:
            from design_search import SEMANTIC_SEARCH_AVAILABLE
            design_search_available = SEMANTIC_SEARCH_AVAILABLE
        except ImportError:
            design_search_available = False

        # Get file list for context
        try:
            chat_root = os.path.join(self.chats_dir, chat_id)
            files = FileUtils.get_gitignore_aware_file_list(chat_root, max_files=50)
        except Exception as e:
            logger.warning(f"Could not get file list for chat {chat_id}: {e}")
            files = []

        return SystemPrompts.build_system_prompt(
            chat_id=chat_id,
            is_first_message=is_first_message,
            design_search_available=design_search_available,
            chats_dir=self.chats_dir,
            file_list=files
        )

    async def _start_turn(self, chat_id: str, user_message: str) -> Dict[str, str]:
        """Create the user's message and set its turn_id to itself to start a new turn."""
        user_msg = await self.add_message(
            chat_id,
            MessageCreate(content=user_message, role="user", message_type="text"),
        )

        db = await get_database()
        user_oid = ObjectId(user_msg.id)
        await db.messages.update_one({"_id": user_oid}, {"$set": {"turn_id": user_oid}})

        return {"turn_id": user_msg.id, "user_message_id": user_msg.id}

    async def _create_stub_message(
        self,
        chat_id: str,
        role: str,
        message_type: str,
        turn_id: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> MessageResponse:
        """Create a placeholder message for streaming content so order is preserved by _id."""
        return await self.add_message(
            chat_id,
            MessageCreate(
                content="",
                role=role,
                message_type=message_type,
                turn_id=ObjectId(turn_id),
                metadata=metadata or None,
            ),
        )

    async def _update_message_content(self, message_id: str, content: str) -> None:
        """Update the content of an existing message (used for streaming deltas)."""
        db = await get_database()
        await db.messages.update_one({"_id": ObjectId(message_id)}, {"$set": {"content": content}})

    async def _execute_single_step_with_retry(self, client, request_params: Dict[str, Any]) -> AsyncGenerator[Dict[str, Any], None]:
        """Execute a single OpenAI API step with comprehensive rate limiting."""

        async def _execute_step():
            stream = await client.responses.create(**request_params)
            events = []
            async for event in stream:
                events.append(event)
            return events

        events = await self.rate_limit_handler.execute_with_backoff(_execute_step)

        for event in events:
            yield event

    async def generate_message_with_agent(
        self, chat_id: str, user_message: str
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Generate streaming response using Responses API with tool calling (COMPLETE ORIGINAL LOGIC)."""
        logger.info(f"🚀 Starting agent generation for chat {chat_id} with message: {user_message[:100]}...")
        client = self._get_openai_client()

        # Ensure chat exists and start a new turn
        chat_data = await self.get_chat_with_messages(chat_id)
        if not chat_data:
            logger.error(f"❌ Chat not found: {chat_id}")
            yield {"chunk_type": "error", "content": "Chat not found"}
            return

        logger.info("💾 Starting new turn and saving user message")
        turn_info = await self._start_turn(chat_id, user_message)
        turn_id = turn_info["turn_id"]
        logger.info("✅ Turn started: %s", turn_id)

        # Check if this is the first message to optimize prompt
        is_first_message = await self._is_first_message(chat_id)
        instructions = self._get_system_prompt(chat_id, is_first_message)
        logger.debug(f"Instructions: {instructions}")
        logger.info(f"Is first message: {is_first_message}")

        # If this is the first message, trigger CSV generation in background
        if is_first_message:
            logger.info(f"🔄 First message detected - triggering CSV generation for chat {chat_id}")
            asyncio.create_task(self.generate_and_upload_csv_background(chat_id, user_message))

        user_input: Any = user_message
        previous_response_id: Optional[str] = None
        steps_taken = 0
        max_steps = self._default_max_steps

        assistant_messages: Dict[str, List[str]] = {
            "text": [],
            "thinking": [],
            "code": [],
            "design_inspiration": [],
            "tool_call_start": [],
            "tool_status": [],
            "tool_call_complete": [],
        }

        # Track files changed during this conversation turn for summary
        files_changed: List[Dict[str, Any]] = []

        # Track live streaming message ids and buffers
        assistant_text_msg_id: Optional[str] = None
        assistant_text_buffer: str = ""
        assistant_thinking_msg_id: Optional[str] = None
        assistant_thinking_buffer: str = ""

        # Track if we've completed any tool calls to detect when to create new text messages
        tool_calls_completed: bool = False

        try:
            while steps_taken < max_steps:
                steps_taken += 1
                logger.info(f"🧠 Responses step {steps_taken}")

                request_params: Dict[str, Any] = {
                    "model": "gpt-5",  # Use reasoning model to get thinking streams
                    "tools": self._get_tool_schemas(),
                    "tool_choice": "auto",
                    "parallel_tool_calls": True,
                    "store": True,
                    "truncation": "auto",
                    "stream": True,  # Enable streaming for real-time responses
                    # Use SDK-compatible reasoning configuration
                    "reasoning": {"effort": "low"},
                }

                if previous_response_id is None:
                    request_params["input"] = user_input
                    request_params["instructions"] = instructions
                else:
                    request_params["instructions"] = instructions
                    request_params["previous_response_id"] = previous_response_id
                    if user_input:
                        request_params["input"] = user_input

                # Execute step with comprehensive rate limiting (creation + iteration)
                tool_results: List[Dict[str, Any]] = []
                current_tool_calls: Dict[str, Dict[str, Any]] = {}
                response_completed = False

                # Process streaming events with rate limiting - COMPLETE ORIGINAL LOGIC
                async for event in self._execute_single_step_with_retry(client, request_params):
                    event_type = getattr(event, "type", None)
                    if event_type in ["response.function_call_arguments.done", "response.completed"]:
                        logger.info(f"📡 Stream event: {event_type}")
                    elif event_type != "response.function_call_arguments.delta":
                        logger.info(f"📡 Stream event: {event_type}")

                    if event_type == "response.created":
                        # Response started - capture response ID for next iteration
                        response_obj = getattr(event, "response", None)
                        if response_obj:
                            previous_response_id = getattr(response_obj, "id", None)
                        logger.info(f"🆔 Response created: {previous_response_id}")

                    elif event_type == "response.output_item.added":
                        # Output item added - capture function call info and stream to frontend immediately
                        item = getattr(event, "item", None)
                        if item:
                            item_type = getattr(item, "type", None)

                            if item_type == "function_call":
                                item_id = getattr(item, "id", None)
                                function_name = getattr(item, "name", None)
                                call_id = getattr(item, "call_id", None)

                                if call_id not in current_tool_calls:
                                    current_tool_calls[call_id] = {
                                        "name": function_name or "",
                                        "arguments": "",
                                        "call_id": call_id,
                                        "item_id": item_id,
                                    }
                                else:
                                    current_tool_calls[call_id]["name"] = function_name or ""
                                    current_tool_calls[call_id]["item_id"] = item_id

                                logger.info(f"🔧 Function call added: {function_name} (call_id: {call_id})")

                                # Stream tool call start to frontend immediately (Cursor IDE style)
                                tool_start_msg = f"🔧 {function_name or 'tool'}"
                                yield {
                                    "chunk_type": "tool_call_start",
                                    "content": tool_start_msg,
                                    "call_id": call_id,
                                    "tool_name": function_name,
                                }
                                assistant_messages["tool_call_start"].append(
                                    f"{call_id}|{function_name}|{tool_start_msg}"
                                )

                            elif item_type == "message" and getattr(item, "role", None) == "assistant":
                                # Assistant message item added - could contain reasoning
                                item_id = getattr(item, "id", None)
                                logger.info(f"📝 Assistant message item added: {item_id}")

                    elif event_type == "response.reasoning_text.delta":
                        # Stream reasoning/thinking content (like Cursor IDE)
                        delta = getattr(event, "delta", "")
                        item_id = getattr(event, "item_id", "")
                        content_index = getattr(event, "content_index", 0)
                        if delta:
                            # Create stub on first delta to preserve order in DB
                            if not assistant_thinking_msg_id:
                                stub = await self._create_stub_message(chat_id, "assistant", "thinking", turn_id)
                                assistant_thinking_msg_id = stub.id
                            # Update buffer and DB
                            assistant_thinking_buffer += delta
                            await self._update_message_content(assistant_thinking_msg_id, assistant_thinking_buffer)
                            yield {
                                "chunk_type": "thinking",
                                "content": delta,
                                "item_id": item_id,
                                "content_index": content_index,
                                "turn_id": turn_id,
                                "message_id": assistant_thinking_msg_id,
                            }

                    elif event_type == "response.reasoning_text.done":
                        # Reasoning text completed
                        item_id = getattr(event, "item_id", "")
                        text = getattr(event, "text", "")
                        content_index = getattr(event, "content_index", 0)
                        logger.info(f"🧠 Reasoning text completed: {len(text)} chars")
                        # Ensure stub exists and DB has final content
                        if not assistant_thinking_msg_id:
                            stub = await self._create_stub_message(chat_id, "assistant", "thinking", turn_id)
                            assistant_thinking_msg_id = stub.id
                        assistant_thinking_buffer = text or assistant_thinking_buffer
                        await self._update_message_content(assistant_thinking_msg_id, assistant_thinking_buffer)
                        yield {
                            "chunk_type": "thinking_complete",
                            "content": text,
                            "item_id": item_id,
                            "content_index": content_index,
                            "turn_id": turn_id,
                            "message_id": assistant_thinking_msg_id,
                        }

                    elif event_type == "response.reasoning_summary_text.delta":
                        # Stream reasoning summary content
                        delta = getattr(event, "delta", "")
                        item_id = getattr(event, "item_id", "")
                        summary_index = getattr(event, "summary_index", 0)
                        if delta:
                            yield {
                                "chunk_type": "thinking_summary",
                                "content": delta,
                                "item_id": item_id,
                                "summary_index": summary_index,
                            }

                    elif event_type == "response.reasoning_summary_text.done":
                        # Reasoning summary completed
                        item_id = getattr(event, "item_id", "")
                        text = getattr(event, "text", "")
                        summary_index = getattr(event, "summary_index", 0)
                        logger.info(f"🧠 Reasoning summary completed: {len(text)} chars")
                        yield {
                            "chunk_type": "thinking_summary_complete",
                            "content": text,
                            "item_id": item_id,
                            "summary_index": summary_index,
                        }

                    elif event_type == "response.output_text.delta":
                        # Stream text content character by character
                        delta = getattr(event, "delta", "")
                        if delta:
                            # If we've completed tool calls and this is new text, create a new message
                            if tool_calls_completed and assistant_text_msg_id is not None:
                                # Reset text message tracking to create a new message for post-tool text
                                assistant_text_msg_id = None
                                assistant_text_buffer = ""
                                tool_calls_completed = False  # Reset for potential future tool calls

                            if not assistant_text_msg_id:
                                stub = await self._create_stub_message(chat_id, "assistant", "text", turn_id)
                                assistant_text_msg_id = stub.id
                            assistant_text_buffer += delta
                            await self._update_message_content(assistant_text_msg_id, assistant_text_buffer)
                            yield {
                                "chunk_type": "text",
                                "content": delta,
                                "turn_id": turn_id,
                                "message_id": assistant_text_msg_id,
                            }

                    elif event_type == "response.function_call_arguments.delta":
                        # Accumulate function call arguments
                        call_id = getattr(event, "call_id", None)
                        delta = getattr(event, "delta", "")

                        if call_id not in current_tool_calls:
                            current_tool_calls[call_id] = {"name": "", "arguments": "", "call_id": call_id}

                        current_tool_calls[call_id]["arguments"] += delta

                    elif event_type == "response.function_call_arguments.done":
                        # Function arguments complete - execute tool
                        call_id = getattr(event, "call_id", None)
                        item_id = getattr(event, "item_id", None)
                        arguments_str = getattr(event, "arguments", "")

                        # Find the tool call by item_id or call_id
                        target_call_id = None
                        for stored_call_id, tool_data in current_tool_calls.items():
                            if (call_id and stored_call_id == call_id) or (
                                item_id and tool_data.get("item_id") == item_id
                            ):
                                target_call_id = stored_call_id
                                break

                        logger.info(f"🔍 Tool done - call_id: {call_id}, item_id: {item_id}, found: {target_call_id}")

                        if target_call_id and target_call_id in current_tool_calls:
                            current_tool_calls[target_call_id]["arguments"] = arguments_str
                            function_name = current_tool_calls[target_call_id]["name"]

                            if function_name:  # Only execute if we have a function name
                                # Execute the tool
                                try:
                                    args = json.loads(arguments_str) if arguments_str else {}
                                except json.JSONDecodeError:
                                    args = {}

                                logger.info(f"🔧 Executing tool: {function_name}")

                                # Stream tool execution status (more detailed than just the start)
                                tool_status_msg = self._build_tool_status_message(function_name, args)

                                yield {
                                    "chunk_type": "tool_status",
                                    "content": tool_status_msg,
                                    "call_id": target_call_id,
                                    "tool_name": function_name,
                                }
                                assistant_messages["tool_status"].append(
                                    f"{target_call_id}|{function_name}|{tool_status_msg}"
                                )

                                try:
                                    result = self._run_tool(function_name, args, chat_id)
                                except Exception as e:
                                    result = {"error": str(e)}

                                # Stream tool completion event with a concise summary
                                summary, path_for_summary, change_entry = self._build_tool_completion_summary(
                                    function_name, args, result
                                )
                                # Track file change for summary (if applicable)
                                if change_entry:
                                    files_changed.append(change_entry)

                                tool_complete_msg = f"✓ {summary}"
                                # Persist the tool completion first (with turn_id and metadata)
                                tool_content = json.dumps(
                                    {
                                        "content": tool_complete_msg,
                                        "call_id": target_call_id,
                                        "tool_name": function_name,
                                        "display_content": tool_complete_msg,
                                        "path": path_for_summary,
                                    }
                                )
                                tool_resp = await self.add_message(
                                    chat_id,
                                    MessageCreate(
                                        content=tool_content,
                                        role="assistant",
                                        message_type="tool_call_complete",
                                        turn_id=ObjectId(turn_id),
                                        metadata={
                                            "call_id": target_call_id,
                                            "tool_name": function_name,
                                            "path": path_for_summary,
                                        },
                                    ),
                                )
                                # Then stream SSE with message id so UI can reconcile
                                yield {
                                    "chunk_type": "tool_call_complete",
                                    "content": tool_complete_msg,
                                    "call_id": target_call_id,
                                    "tool_name": function_name,
                                    "success": "error" not in result,
                                    "turn_id": turn_id,
                                    "message_id": tool_resp.id,
                                }
                                assistant_messages["tool_call_complete"].append(
                                    f"{target_call_id}|{function_name}|{tool_complete_msg}"
                                )

                                # Mark that we've completed tool calls
                                tool_calls_completed = True

                                # Handle design inspiration
                                if function_name == "design_search_tool" and "inspiration" in result:
                                    yield {"chunk_type": "design_inspiration", "content": result["inspiration"]}
                                    assistant_messages["design_inspiration"].append(result["inspiration"])

                                    # Save design_inspiration immediately to preserve order
                                    await self.add_message(
                                        chat_id,
                                        MessageCreate(
                                            content=result["inspiration"],
                                            role="assistant",
                                            message_type="design_inspiration",
                                        ),
                                    )

                                # Prepare for next turn
                                tool_results.append(
                                    {
                                        "type": "function_call_output",
                                        "call_id": target_call_id,
                                        "output": json.dumps(result),
                                    }
                                )

                    elif event_type == "response.completed":
                        # Response completed
                        response_completed = True
                        response_obj = getattr(event, "response", None)
                        if not previous_response_id and response_obj:
                            previous_response_id = getattr(response_obj, "id", None)
                        logger.info(f"✅ Response completed: {previous_response_id}")
                        break

                    elif event_type == "error":
                        error_obj = getattr(event, "error", None)
                        if error_obj:
                            error_msg = getattr(error_obj, "message", "Unknown error")
                        else:
                            error_msg = "Unknown error"
                        logger.error(f"❌ Stream error: {error_msg}")
                        yield {"chunk_type": "error", "content": f"Error: {error_msg}"}
                        return

                # If there were tool calls, continue the conversation
                if tool_results:
                    user_input = tool_results
                    continue

                # Otherwise, we're done with this conversation turn
                if response_completed:
                    break

                # If no tool results and response completed, we're done
                user_input = None  # Clear input for next iteration

            # Persist assistant messages that weren't saved immediately during streaming
            for msg_type, contents in assistant_messages.items():
                # Skip message types that were already saved immediately during streaming to preserve order
                if msg_type in [
                    "tool_call_start",
                    "tool_status",
                    "tool_call_complete",
                    "design_inspiration",
                    "text",
                    "thinking",
                ]:
                    continue

                if msg_type == "code":
                    # Save each code blob as its own message so the UI shows separate bubbles per file
                    for code_blob in contents:
                        if code_blob.strip():  # Only save non-empty code blocks
                            logger.info("💾 Saving code message: %d characters", len(code_blob))
                            await self.add_message(
                                chat_id, MessageCreate(content=code_blob, role="assistant", message_type="code")
                            )
                    continue

                # Save text and thinking messages (these come as deltas so need to be combined)
                full_content = "".join(contents) if msg_type == "text" else "\n".join(contents)

                # Save even empty messages for text (to show assistant responded) but skip empty thinking
                if full_content.strip() or msg_type == "text":
                    logger.info("💾 Saving %s message: %d characters", msg_type, len(full_content))
                    await self.add_message(
                        chat_id, MessageCreate(content=full_content, role="assistant", message_type=msg_type)
                    )

            # Send files summary if any files were changed
            if files_changed:
                yield {"chunk_type": "files_summary", "content": files_changed}
                logger.info(f"📁 Files summary sent: {len(files_changed)} files changed")

                # Persist files summary to database for history
                files_summary_content = json.dumps(files_changed)
                files_msg = await self.add_message(
                    chat_id,
                    MessageCreate(
                        content=files_summary_content,
                        role="assistant",
                        message_type="files_summary",
                        turn_id=ObjectId(turn_id),
                    ),
                )
                # Emit an update with message id for completeness
                yield {
                    "chunk_type": "files_summary_persisted",
                    "content": files_changed,
                    "turn_id": turn_id,
                    "message_id": files_msg.id,
                }

            yield {"chunk_type": "done", "content": "", "turn_id": turn_id}
            logger.info(f"✅ Agent generation completed for chat {chat_id}")

        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            logger.error(f"❌ Agent generation error: {e}")
            import traceback
            logger.error(f"📍 Traceback: {traceback.format_exc()}")
            yield {"chunk_type": "error", "content": error_msg}

    async def generate_and_upload_csv_background(self, chat_id: str, chat_title: str):
        """Background task to trigger sample data generation via external CMS API"""
        try:
            logger.info(f"🔄 Starting background sample data generation for chat {chat_id}")

            # Trigger sample data generation via external CMS API
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.CMS_BASE_URL}/admin/tenant/{chat_id}/sample-data/generate",
                    headers={"accept": "application/json", "Content-Type": "application/json"},
                    json={
                        "query": chat_title,
                        "options": {
                            "num_products": 10,
                            "num_categories": 5,
                            "include_variants": True,
                            "clear_existing": True,
                        },
                    },
                )

                if response.status_code == 200:
                    result = response.json()
                    logger.info(f"✅ Background sample data generation started for chat {chat_id}: {result.get('message', 'Started')}")
                else:
                    logger.error(f"❌ Background sample data generation failed for chat {chat_id}: HTTP {response.status_code}")

        except Exception as e:
            logger.error(f"❌ Background sample data generation error for chat {chat_id}: {e}")

    # CRUD Operations

    async def create_chat(self, chat_data: ChatCreate) -> ChatResponse:
        """Create a new chat."""
        db = await get_database()

        chat = Chat(title=chat_data.title)
        result = await db.chats.insert_one(chat.dict(by_alias=True))

        chat_id = str(result.inserted_id)
        chat_folder = os.path.join(self.chats_dir, chat_id)
        os.makedirs(chat_folder, exist_ok=True)

        # Initialize CMS database and sample data for new chat project
        try:
            logger.info(f"🏗️ Setting up CMS database for chat {chat_id}")

            # Check if database already exists
            db_exists = await cms_service.check_database_exists(chat_id)

            if not db_exists:
                logger.info(f"📊 Creating new CMS database for chat {chat_id}")
                # Create database synchronously
                db_result = await cms_service.create_database(chat_id)

                if db_result["success"]:
                    logger.info(f"✅ Database created successfully for chat {chat_id}")
                    # Note: CSV generation and upload will happen in background
                    logger.info(f"📝 CSV generation scheduled for background processing")
                else:
                    logger.warning(f"⚠️ Failed to create database for chat {chat_id}: {db_result['error']}")
            else:
                logger.info(f"📊 Database already exists for chat {chat_id}")

        except Exception as e:
            logger.error(f"❌ Error setting up CMS for chat {chat_id}: {e}")
            # Continue with chat creation even if CMS setup fails

        return ChatResponse(
            id=chat_id,
            title=chat.title,
            created_at=chat.created_at,
            updated_at=chat.updated_at,
            file_count=chat.file_count,
        )

    async def update_chat(self, chat_id: str, chat_update: ChatUpdate) -> Optional[ChatResponse]:
        """Update a chat."""
        db = await get_database()
        chat_doc = await db.chats.find_one({"_id": ObjectId(chat_id)})
        if not chat_doc:
            return None
        update_fields: Dict[str, Any] = {"updated_at": datetime.utcnow()}
        if chat_update.title is not None:
            update_fields["title"] = chat_update.title
        await db.chats.update_one({"_id": ObjectId(chat_id)}, {"$set": update_fields})
        new_doc = await db.chats.find_one({"_id": ObjectId(chat_id)})
        return ChatResponse(
            id=str(new_doc["_id"]),
            title=new_doc["title"],
            created_at=new_doc["created_at"],
            updated_at=new_doc["updated_at"],
            file_count=new_doc.get("file_count", 0),
        )

    async def get_chats(self) -> List[ChatResponse]:
        """Get all chats."""
        db = await get_database()
        chats = await db.chats.find().sort("updated_at", -1).to_list(length=None)
        return [
            ChatResponse(
                id=str(chat["_id"]),
                title=chat["title"],
                created_at=chat["created_at"],
                updated_at=chat["updated_at"],
                file_count=chat["file_count"],
            )
            for chat in chats
        ]

    async def get_chat_with_messages(self, chat_id: str) -> Optional[dict]:
        """Get a chat with its messages grouped by turns."""
        db = await get_database()

        chat = await db.chats.find_one({"_id": ObjectId(chat_id)})
        if not chat:
            return None

        # Fetch all messages ordered by natural insertion (_id) to preserve exact streaming order
        raw_messages = await db.messages.find({"chat_id": ObjectId(chat_id)}).sort("_id", 1).to_list(length=None)

        # Group by turn_id (default to own _id if missing)
        from collections import defaultdict

        turns: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        for m in raw_messages:
            turn_oid = m.get("turn_id") or m.get("_id")
            turn_key = str(turn_oid)
            turns[turn_key].append(m)

        # Build grouped response with events ordered by insertion
        grouped = []
        # Preserve turn ordering by first message's _id
        for turn_id in sorted(turns.keys(), key=lambda k: str(turns[k][0]["_id"])):
            # Sort events within each turn by _id to preserve exact streaming order
            events = sorted(turns[turn_id], key=lambda msg: msg["_id"])
            grouped.append(
                {
                    "id": turn_id,
                    "messages": [
                        MessageResponse(
                            id=str(msg["_id"]),
                            chat_id=str(msg["chat_id"]),
                            content=msg.get("content", ""),
                            role=msg.get("role"),
                            message_type=msg.get("message_type"),
                            timestamp=msg.get("timestamp"),
                            turn_id=str(turn_id),
                            turn_index=None,
                            event_index=None,
                            metadata=msg.get("metadata"),
                        )
                        for msg in events
                    ],
                }
            )

        return {
            "chat": ChatResponse(
                id=str(chat["_id"]),
                title=chat["title"],
                created_at=chat["created_at"],
                updated_at=chat["updated_at"],
                file_count=chat["file_count"],
            ),
            "messages": grouped,
        }

    async def delete_chat(self, chat_id: str) -> bool:
        """Delete a chat and its associated data."""
        db = await get_database()

        chat = await db.chats.find_one({"_id": ObjectId(chat_id)})
        if not chat:
            return False

        await db.messages.delete_many({"chat_id": ObjectId(chat_id)})
        await db.files.delete_many({"chat_id": ObjectId(chat_id)})
        await db.chats.delete_one({"_id": ObjectId(chat_id)})

        chat_folder = os.path.join(self.chats_dir, chat_id)
        if os.path.exists(chat_folder):
            shutil.rmtree(chat_folder)

        return True

    async def add_message(self, chat_id: str, message_data: MessageCreate) -> MessageResponse:
        """Add a message to a chat."""
        db = await get_database()

        message = Message(
            chat_id=ObjectId(chat_id),
            content=message_data.content,
            role=message_data.role,
            message_type=message_data.message_type,
            turn_id=message_data.turn_id,
            turn_index=message_data.turn_index,
            event_index=message_data.event_index,
            metadata=message_data.metadata,
        )

        result = await db.messages.insert_one(message.dict(by_alias=True))

        # Update chat updated_at, and if this is the first user message and title is a default,
        # generate a concise title suggestion from content.
        await db.chats.update_one({"_id": ObjectId(chat_id)}, {"$set": {"updated_at": datetime.utcnow()}})

        try:
            chat_doc = await db.chats.find_one({"_id": ObjectId(chat_id)})
            existing_title: str = chat_doc.get("title", "")
            # Heuristic: if title starts with "New Chat" or is very short/placeholder, rename using first words of message
            if message_data.role == "user" and (existing_title.lower().startswith("new chat") or len(existing_title.strip()) < 3):
                # Count total messages for the chat
                total = await db.messages.count_documents({"chat_id": ObjectId(chat_id)})
                if total <= 2:  # first turn (user + maybe assistant pending)
                    content = message_data.content.strip()
                    # Build a short title (max ~50 chars) using first sentence/phrase
                    candidate = re.split(r"[\.!?\n]", content)[0][:50].strip()
                    # Normalize
                    candidate = candidate or "Untitled"
                    await db.chats.update_one({"_id": ObjectId(chat_id)}, {"$set": {"title": candidate, "updated_at": datetime.utcnow()}})
        except Exception:
            pass

        return MessageResponse(
            id=str(result.inserted_id),
            chat_id=chat_id,
            content=message.content,
            role=message.role,
            message_type=message.message_type,
            timestamp=message.timestamp,
            turn_id=str(message.turn_id) if message.turn_id else None,
            turn_index=message.turn_index,
            event_index=message.event_index,
            metadata=message.metadata,
        )


# Create the service instance
chat_service = ChatService()

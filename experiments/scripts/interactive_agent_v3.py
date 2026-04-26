#!/usr/bin/env python3
"""
Interactive Agent V3 - Architect V3 (60% Faster)

Enhanced version using Architect V3 with optimized 3-phase workflow.

Key Improvements over V2:
- 60% faster generation (18-28 min vs 48-58 min)
- Documentation on-demand (no PLAN.md overhead)
- Batch execution with doc caching
- Tiered validation strategy
- Todo-only state management

Usage:
    # Interactive mode
    python interactive_agent_v3.py

    # Single command mode
    python interactive_agent_v3.py --message "Create a luxury jewelry store"

    # With specific chat ID
    python interactive_agent_v3.py --chat-id my_project_123

    # As a module
    from experiments.scripts.interactive_agent_v3 import run_agent_streaming
    async for chunk in run_agent_streaming(chat_id, message):
        print(chunk)
"""

import os
import sys
import asyncio
import argparse
import json
import shutil
import time
from pathlib import Path
from typing import AsyncGenerator, Dict, Any, Optional
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents import Runner
from doxii_agents.context import DoxiiContext
from doxii_agents.architect_v3 import create_architect_v3_agent


# ============================================================================
# Scaffold Template Initialization
# ============================================================================

def copy_scaffold_infrastructure(chat_root: str) -> bool:
    """
    Copy the universal infrastructure files to the project directory.

    Architect V3 uses these pre-built infrastructure files and generates
    custom components using the documentation on-demand system.

    Args:
        chat_root: Target directory for the project

    Returns:
        True if infrastructure was copied, False if already exists
    """
    # Check if infrastructure already exists
    router_path = os.path.join(chat_root, "assets", "router.js")
    if os.path.exists(router_path):
        print(f"⚠️  Infrastructure already exists in {chat_root}", file=sys.stderr)
        return False

    # Find scaffold_infrastructure directory
    script_dir = Path(__file__).parent.parent.parent  # Go up to project root
    infra_source = script_dir / "scaffold_infrastructure"

    if not infra_source.exists():
        # Try alternate location
        infra_source = Path(__file__).parent.parent / "scaffold_infrastructure"

    if not infra_source.exists():
        raise FileNotFoundError(
            f"scaffold_infrastructure not found. Searched:\n"
            f"  - {script_dir / 'scaffold_infrastructure'}\n"
            f"  - {Path(__file__).parent.parent / 'scaffold_infrastructure'}"
        )

    # Copy infrastructure to chat_root
    print(f"📋 Copying infrastructure files from {infra_source}", file=sys.stderr)
    print(f"   to {chat_root}", file=sys.stderr)

    try:
        shutil.copytree(infra_source, chat_root, dirs_exist_ok=True)
        print(f"✅ Infrastructure copied successfully", file=sys.stderr)
        print(f"   (router, utils, cart, wishlist, filters, base-component)\n", file=sys.stderr)
        return True
    except Exception as e:
        raise RuntimeError(f"Failed to copy infrastructure: {e}")


# ============================================================================
# Core Streaming Function (Production-Ready)
# ============================================================================

async def run_agent_streaming(
    chat_id: str,
    user_message: str,
    cms_base_url: str = "https://api.example.com",
    chat_root: Optional[str] = None,
    max_turns: int = 500,
    on_event: Optional[callable] = None,
    init_scaffold: bool = True
) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Run Architect V3 agent with streaming responses.

    This version uses Architect V3 with optimized 3-phase workflow:
    - Phase 1: PLAN (todo-only, no PLAN.md)
    - Phase 2: EXECUTE (batch docs, quick validation)
    - Phase 3: VALIDATE (full ESLint, fixes)

    Args:
        chat_id: Unique chat/project identifier
        user_message: User's message/request
        cms_base_url: CMS API base URL
        chat_root: Root directory for project files (auto-generated if None)
        max_turns: Maximum turns for agent execution
        on_event: Optional callback for event processing
        init_scaffold: If True, automatically copy scaffold template to project

    Yields:
        Event dictionaries with streaming content:
        - chunk_type: "text", "thinking", "tool_call", "agent_handoff", "done", "error"
        - content: Text content to display
        - Additional metadata based on chunk_type

    Example:
        async for chunk in run_agent_streaming("my_chat", "Create a store"):
            if chunk["chunk_type"] == "text":
                print(chunk["content"], end="", flush=True)
            elif chunk["chunk_type"] == "tool_call":
                print(f"\\n🔧 {chunk['tool_name']}")
    """
    # Setup context - use absolute path for clarity
    if chat_root is None:
        # Create in experiments/test_output_v3 for easy access
        base_dir = Path(__file__).parent.parent / "test_output_v3"
        chat_root = str(base_dir / chat_id)

    # Ensure chat_root directory exists
    os.makedirs(chat_root, exist_ok=True)

    # Initialize infrastructure if requested
    if init_scaffold:
        try:
            infra_copied = copy_scaffold_infrastructure(chat_root)
            if infra_copied:
                print(f"✅ Infrastructure initialized\n", file=sys.stderr)
                print(f"   Architect V3 will generate custom components\n", file=sys.stderr)
        except Exception as e:
            print(f"⚠️  Warning: Could not copy scaffold: {e}\n", file=sys.stderr)

    # Print project location for user visibility
    print(f"📁 Project location: {os.path.abspath(chat_root)}\n", file=sys.stderr)

    context = DoxiiContext(
        chat_id=chat_id,
        chat_root=chat_root,
        cms_base_url=cms_base_url,
        project_initialized=_check_project_initialized(chat_root)
    )

    # Create Architect V3 agent
    agent = create_architect_v3_agent()
    print(f"🏗️  Running ARCHITECT V3 (60% Faster)\n", file=sys.stderr)
    print(f"   • Documentation on-demand\n", file=sys.stderr)
    print(f"   • Batch execution\n", file=sys.stderr)
    print(f"   • Expected time: 18-28 minutes\n", file=sys.stderr)

    # Track metrics
    start_time = time.time()
    tool_calls = 0
    phase_start = start_time
    current_phase = "Phase 1: PLAN"

    try:
        # Run with streaming
        result = Runner.run_streamed(
            agent,
            user_message,
            context=context,
            max_turns=max_turns
        )

        # Stream events
        async for event in result.stream_events():
            # Transform event to frontend-compatible format
            chunk = _transform_event(event, context)

            if chunk:
                # Track metrics
                if chunk["chunk_type"] == "tool_call":
                    tool_calls += 1

                    # Detect phase transitions (heuristic based on tool calls)
                    tool_name = chunk.get("tool_name", "")
                    if "write_todos" in tool_name and current_phase == "Phase 1: PLAN":
                        # Still in Phase 1
                        pass
                    elif "write_file" in tool_name or "edit_file" in tool_name:
                        if current_phase == "Phase 1: PLAN":
                            elapsed = time.time() - phase_start
                            print(f"\n\n⏱️  Phase 1 complete ({elapsed/60:.1f} min)\n", file=sys.stderr)
                            current_phase = "Phase 2: EXECUTE"
                            phase_start = time.time()
                    elif "validate_project" in tool_name:
                        if current_phase == "Phase 2: EXECUTE":
                            elapsed = time.time() - phase_start
                            print(f"\n\n⏱️  Phase 2 complete ({elapsed/60:.1f} min)\n", file=sys.stderr)
                            current_phase = "Phase 3: VALIDATE"
                            phase_start = time.time()

                # Call callback if provided
                if on_event:
                    on_event(chunk)

                yield chunk

        # Send completion event with stats
        elapsed = time.time() - start_time

        context.update_file_index()

        yield {
            "chunk_type": "done",
            "content": "✓ Complete",
            "stats": {
                "elapsed_seconds": round(elapsed, 2),
                "elapsed_minutes": round(elapsed / 60, 1),
                "tool_calls": tool_calls,
                "files_created": context.get_file_count(),
                "final_phase": current_phase,
                "performance_vs_v2": f"{((48 - elapsed/60) / 48 * 100):.0f}% faster"
            }
        }

    except Exception as e:
        # Send error event
        yield {
            "chunk_type": "error",
            "content": f"Error: {str(e)}",
            "error": str(e),
            "error_type": type(e).__name__
        }


def _check_project_initialized(chat_root: str) -> bool:
    """Check if a project is already initialized (has index.html)."""
    index_path = os.path.join(chat_root, "index.html")
    return os.path.exists(index_path)


def _transform_event(event, context: DoxiiContext) -> Optional[Dict[str, Any]]:
    """
    Transform Agents SDK events to frontend-compatible format.

    Returns event dict with:
    - chunk_type: Event type
    - content: Display content
    - Additional metadata
    """
    try:
        # Text delta streaming
        if event.type == "raw_response_event":
            if hasattr(event.data, 'delta') and event.data.delta:
                return {
                    "chunk_type": "text",
                    "content": event.data.delta
                }

            # Tool call started
            if hasattr(event.data, 'type') and 'output_item.added' in str(event.data.type):
                if hasattr(event.data, 'item'):
                    item = event.data.item
                    if hasattr(item, 'name'):
                        return {
                            "chunk_type": "tool_call",
                            "content": f"🔧 {item.name}",
                            "tool_name": item.name
                        }

        # Agent handoff (shouldn't happen in V3, but keep for compatibility)
        elif event.type == "agent_updated_stream_event":
            if hasattr(event, 'new_agent'):
                agent_name = event.new_agent.name
                return {
                    "chunk_type": "agent_handoff",
                    "content": f"\n→ {agent_name} agent",
                    "agent_name": agent_name
                }

        # Tool completed
        elif event.type == "run_item_stream_event":
            if hasattr(event, 'item') and hasattr(event.item, 'type'):
                if 'tool_call' in str(event.item.type):
                    return {
                        "chunk_type": "tool_complete",
                        "content": " ✓"
                    }

    except Exception as e:
        print(f"Warning: Error transforming event: {e}", file=sys.stderr)

    return None


# ============================================================================
# Interactive CLI Interface
# ============================================================================

class InteractiveAgentV3:
    """Interactive CLI for Architect V3 agent."""

    def __init__(self, chat_id: str = None, cms_base_url: str = "https://api.example.com"):
        self.chat_id = chat_id or f"interactive_v3_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.cms_base_url = cms_base_url
        self.message_count = 0
        self.total_time = 0

    def print_header(self):
        """Print welcome header."""
        chat_root = self._get_chat_root()
        print("=" * 80)
        print("DOXII ARCHITECT V3 - Optimized E-commerce Store Generator")
        print("=" * 80)
        print()
        print(f"Chat ID: {self.chat_id}")
        print(f"Project Root: {os.path.abspath(chat_root)}")
        print()
        print("🚀 ARCHITECT V3 - Performance Optimized")
        print("  • 60% faster than V2 (18-28 min vs 48-58 min)")
        print("  • Documentation on-demand (no PLAN.md overhead)")
        print("  • Batch execution with doc caching")
        print("  • Tiered validation (quick check → full ESLint)")
        print("  • Todo-only state management")
        print()
        print("📋 3-Phase Workflow:")
        print("  Phase 1: PLAN    - Create detailed todos (5-8 min)")
        print("  Phase 2: EXECUTE - Batch implementation (12-20 min)")
        print("  Phase 3: VALIDATE - Full validation & fixes (3-5 min)")
        print()
        print("Commands:")
        print("  /help    - Show this help")
        print("  /status  - Show project status")
        print("  /files   - List project files")
        print("  /tree    - Show directory tree")
        print("  /todos   - Show current todos")
        print("  /cat <file> - Show file contents")
        print("  /open    - Open project folder")
        print("  /quit    - Exit")
        print()
        print("=" * 80)
        print()

    def _get_chat_root(self) -> str:
        """Get the absolute path to the chat root directory."""
        base_dir = Path(__file__).parent.parent / "test_output_v3"
        return str(base_dir / self.chat_id)

    async def handle_command(self, command: str) -> bool:
        """Handle special commands. Returns True if should continue."""
        parts = command.split(maxsplit=1)
        cmd = parts[0].lower()
        arg = parts[1] if len(parts) > 1 else None

        if cmd == "/help":
            self.print_header()
            return True

        elif cmd == "/status":
            chat_root = self._get_chat_root()
            if os.path.exists(chat_root):
                context = DoxiiContext(chat_id=self.chat_id, chat_root=chat_root)
                context.update_file_index()

                print("\n📊 Project Status:")
                print(f"  Location: {os.path.abspath(chat_root)}")
                print(f"  Project Initialized: {'Yes' if context.project_initialized else 'No'}")
                print(f"  Total Files: {context.get_file_count()}")
                print(f"  Messages Sent: {self.message_count}")
                print(f"  Agent Version: Architect V3 (Optimized)")
                print(f"  Total Generation Time: {self.total_time:.1f} min")

                # Show todo summary
                if context.architect_todos:
                    total = len(context.architect_todos)
                    completed = sum(1 for t in context.architect_todos if t.status == "completed")
                    in_progress = sum(1 for t in context.architect_todos if t.status == "in_progress")
                    pending = sum(1 for t in context.architect_todos if t.status == "pending")
                    print(f"\n  📝 Todos: {completed}/{total} completed")
                    print(f"     Completed: {completed}, In Progress: {in_progress}, Pending: {pending}")

                print()
            else:
                print("\n⚠️  No project created yet. Send a message to get started!")
                print()
            return True

        elif cmd == "/files":
            chat_root = self._get_chat_root()
            if os.path.exists(chat_root):
                context = DoxiiContext(chat_id=self.chat_id, chat_root=chat_root)
                context.update_file_index()

                if context.file_index:
                    print(f"\n📁 Project Files ({len(context.file_index)}):")
                    for file in sorted(context.file_index):
                        full_path = os.path.join(chat_root, file)
                        size = os.path.getsize(full_path) if os.path.exists(full_path) else 0
                        print(f"  • {file} ({size:,} bytes)")
                    print()
                else:
                    print("\n📁 No files yet.")
                    print()
            else:
                print("\n⚠️  No project created yet.")
                print()
            return True

        elif cmd == "/tree":
            chat_root = self._get_chat_root()
            if os.path.exists(chat_root):
                print(f"\n🌳 Directory Tree: {chat_root}\n")
                self._print_tree(chat_root, prefix="")
                print()
            else:
                print("\n⚠️  No project created yet.")
                print()
            return True

        elif cmd == "/todos":
            chat_root = self._get_chat_root()
            context = DoxiiContext(chat_id=self.chat_id, chat_root=chat_root)

            if context.architect_todos:
                print(f"\n📝 Todos ({len(context.architect_todos)}):\n")

                for todo in context.architect_todos:
                    status_icon = {
                        "completed": "✅",
                        "in_progress": "🔄",
                        "pending": "⏳"
                    }.get(todo.status, "❓")

                    print(f"  {status_icon} [{todo.category}] {todo.content}")
                    if todo.status == "in_progress":
                        print(f"      → {todo.activeForm}")

                print()
            else:
                print("\n📝 No todos yet. Send a message to create a project!\n")
            return True

        elif cmd == "/cat":
            if not arg:
                print("\n⚠️  Usage: /cat <filename>")
                print()
                return True

            chat_root = self._get_chat_root()
            file_path = os.path.join(chat_root, arg)

            if not os.path.exists(file_path):
                print(f"\n⚠️  File not found: {arg}")
                print()
                return True

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                print(f"\n{'─' * 80}")
                print(f"📄 {arg}")
                print(f"{'─' * 80}")
                print(content)
                print(f"{'─' * 80}\n")
            except Exception as e:
                print(f"\n⚠️  Error reading file: {e}\n")
            return True

        elif cmd == "/open":
            chat_root = self._get_chat_root()
            if os.path.exists(chat_root):
                abs_path = os.path.abspath(chat_root)
                print(f"\n📂 Opening: {abs_path}")
                # Try to open in file explorer
                import platform
                system = platform.system()
                try:
                    if system == "Darwin":  # macOS
                        os.system(f'open "{abs_path}"')
                    elif system == "Windows":
                        os.system(f'explorer "{abs_path}"')
                    else:  # Linux
                        os.system(f'xdg-open "{abs_path}"')
                    print("✓ Opened in file explorer\n")
                except Exception as e:
                    print(f"⚠️  Could not open automatically: {e}\n")
            else:
                print("\n⚠️  No project created yet.")
                print()
            return True

        elif cmd == "/quit":
            return False

        else:
            print(f"\n⚠️  Unknown command: {cmd}")
            print("   Type /help for available commands\n")

        return True

    def _print_tree(self, directory: str, prefix: str = "", is_last: bool = True):
        """Print a directory tree structure."""
        try:
            items = sorted(os.listdir(directory))
            # Filter out hidden files
            items = [item for item in items if not item.startswith('.')]

            for i, item in enumerate(items):
                is_last_item = (i == len(items) - 1)
                item_path = os.path.join(directory, item)

                # Print current item
                connector = "└── " if is_last_item else "├── "
                print(f"{prefix}{connector}{item}")

                # Recurse for directories
                if os.path.isdir(item_path):
                    extension = "    " if is_last_item else "│   "
                    self._print_tree(item_path, prefix + extension, is_last_item)
        except PermissionError:
            pass

    async def process_message(self, message: str):
        """Process a user message and stream the response."""
        self.message_count += 1

        print(f"\n{'─' * 80}")
        print(f"Message #{self.message_count}: {message}")
        print(f"{'─' * 80}\n")

        # Stream response
        current_line = ""
        message_start = time.time()

        async for chunk in run_agent_streaming(
            chat_id=self.chat_id,
            user_message=message,
            cms_base_url=self.cms_base_url
        ):
            chunk_type = chunk["chunk_type"]
            content = chunk["content"]

            if chunk_type == "text":
                # Print text inline
                print(content, end="", flush=True)
                current_line += content

                # Track newlines for formatting
                if "\n" in content:
                    current_line = ""

            elif chunk_type == "tool_call":
                # Print tool call on new line
                if current_line:
                    print()
                    current_line = ""
                print(f"\n{content}", end="", flush=True)

            elif chunk_type == "tool_complete":
                print(content, end="", flush=True)

            elif chunk_type == "agent_handoff":
                if current_line:
                    print()
                    current_line = ""
                print(f"\n{content}", end="", flush=True)

            elif chunk_type == "done":
                # Print completion stats
                if current_line:
                    print()

                stats = chunk.get("stats", {})
                elapsed_min = stats.get('elapsed_minutes', 0)
                self.total_time += elapsed_min

                print("\n")
                print(f"{'─' * 80}")
                print(f"✓ Completed in {stats.get('elapsed_minutes', 0)} minutes ({stats.get('elapsed_seconds', 0)}s)")
                print(f"  Tool calls: {stats.get('tool_calls', 0)}")
                print(f"  Files in project: {stats.get('files_created', 0)}")
                print(f"  Performance: {stats.get('performance_vs_v2', 'calculating...')}")
                print(f"{'─' * 80}\n")

            elif chunk_type == "error":
                if current_line:
                    print()
                print(f"\n❌ Error: {content}\n")

    async def run(self):
        """Run the interactive CLI."""
        self.print_header()

        while True:
            try:
                # Get user input
                user_input = input("You: ").strip()

                if not user_input:
                    continue

                # Handle commands
                if user_input.startswith("/"):
                    should_continue = await self.handle_command(user_input)
                    if not should_continue:
                        print("\n👋 Goodbye!")
                        break
                    continue

                # Process message
                await self.process_message(user_input)

            except KeyboardInterrupt:
                print("\n\n⚠️  Interrupted. Type /quit to exit or continue with another message.")

            except EOFError:
                print("\n\n👋 Goodbye!")
                break

            except Exception as e:
                print(f"\n❌ Unexpected error: {e}")
                import traceback
                traceback.print_exc()


# ============================================================================
# CLI Entry Point
# ============================================================================

async def main():
    """Main entry point for CLI."""
    parser = argparse.ArgumentParser(
        description="DOXII Architect V3 - Optimized E-commerce Store Generator (60% Faster)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Interactive mode
  python interactive_agent_v3.py

  # Single message mode
  python interactive_agent_v3.py --message "Create a luxury jewelry store"

  # Specify chat ID
  python interactive_agent_v3.py --chat-id my_project

  # Specify CMS URL
  python interactive_agent_v3.py --cms-url https://cms.example.com/api
        """
    )

    parser.add_argument(
        "--message", "-m",
        help="Send a single message (non-interactive mode)"
    )

    parser.add_argument(
        "--chat-id", "-c",
        help="Chat ID for the session (auto-generated if not provided)"
    )

    parser.add_argument(
        "--cms-url",
        default="https://api.example.com",
        help="CMS API base URL (default: https://api.example.com)"
    )

    args = parser.parse_args()

    # Check for API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ ERROR: OPENAI_API_KEY environment variable not set")
        print()
        print("Please set your OpenAI API key:")
        print("  export OPENAI_API_KEY='your-key-here'")
        return 1

    # Create interactive agent
    agent = InteractiveAgentV3(
        chat_id=args.chat_id,
        cms_base_url=args.cms_url
    )

    # Single message mode
    if args.message:
        print("DOXII Architect V3 - Single Message Mode (60% Faster)")
        print(f"Chat ID: {agent.chat_id}")
        print()

        await agent.process_message(args.message)

        # Show final status
        print()
        await agent.handle_command("/status")
        return 0

    # Interactive mode
    await agent.run()
    return 0


# ============================================================================
# Module Usage Example
# ============================================================================

async def example_usage():
    """
    Example of using this module in another application.
    """
    chat_id = "example_v3"
    user_message = "Create a modern tech electronics store"

    print("Example: Using run_agent_streaming() V3 as a module")
    print("=" * 60)
    print()

    # Custom event handler
    def on_event(chunk):
        """Custom event handler for processing chunks."""
        if chunk["chunk_type"] == "tool_call":
            print(f"\n[Event] Tool called: {chunk['tool_name']}")

    # Stream responses
    async for chunk in run_agent_streaming(
        chat_id=chat_id,
        user_message=user_message,
        on_event=on_event
    ):
        # Handle different chunk types
        if chunk["chunk_type"] == "text":
            print(chunk["content"], end="", flush=True)

        elif chunk["chunk_type"] == "done":
            stats = chunk.get("stats", {})
            print(f"\n\nCompleted in {stats['elapsed_minutes']} minutes")
            print(f"Files created: {stats['files_created']}")
            print(f"Performance: {stats['performance_vs_v2']}")


if __name__ == "__main__":
    # Run CLI
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

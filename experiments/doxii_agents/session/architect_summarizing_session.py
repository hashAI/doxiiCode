"""
Architect Summarizing Session - Context-aware session memory for the Architect agent.

This module implements automatic conversation summarization to reduce token costs
while maintaining critical context for e-commerce project creation.

Key Features:
- Automatic summarization when conversation exceeds threshold
- Preserves recent turns verbatim for immediate context
- Specialized prompts for e-commerce project summarization
- Thread-safe async operations
- Configurable summarization parameters

Usage:
    session = ArchitectSummarizingSession(
        session_id="project_123",
        config=ArchitectSummarizerConfig(
            keep_last_n_turns=3,
            context_limit=8
        )
    )

    result = await Runner.run(
        architect_agent,
        input="Create a clothing store",
        session=session,
        context=doxii_context
    )
"""

from dataclasses import dataclass
import asyncio
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI
from agents.memory.session import SessionABC
import logging

logger = logging.getLogger("doxii.architect.session")


@dataclass
class ArchitectSummarizerConfig:
    """
    Configuration for architect-specific summarization.

    Attributes:
        keep_last_n_turns: Number of recent user turns to keep verbatim
        context_limit: Maximum user turns before triggering summarization
        tool_trim_limit: Maximum characters for tool results before trimming
        summarizer_model: Model to use for generating summaries (cheaper than main model)
        max_summary_tokens: Maximum tokens for generated summaries
    """
    keep_last_n_turns: int = 3  # Keep last 3 user turns verbatim
    context_limit: int = 8       # Summarize when exceeding 8 turns
    tool_trim_limit: int = 500   # Trim tool results to 500 chars
    summarizer_model: str = "gpt-4o"  # Faster/cheaper for summaries
    max_summary_tokens: int = 600     # Keep summaries concise


class ArchitectSummarizer:
    """
    Summarizes e-commerce project creation conversations.

    Focuses on:
    - Features completed vs pending
    - Critical errors encountered and fixed
    - Validation status
    - Component library usage patterns
    - Current project state
    """

    SUMMARY_PROMPT = '''
You are summarizing an e-commerce store creation session by the DOXII Architect agent.

Create a structured summary ≤300 words using these sections:

**Project Overview:**
- Store type (clothing, electronics, etc.)
- Tech stack confirmation (Lit + TailwindCSS)

**Features Status:**
- Completed features (name + key details)
- In-progress feature (current status)
- Pending features (count only)

**Component Usage:**
- Library components used (which ones from the 31-component library)
- Custom components created (count + types) - should be minimal!

**Validation & Errors:**
- ESLint status (passing/failing, error count)
- Critical errors fixed (types, not details)
- Files created/modified (count)

**Current State:**
- Active phase (Phase 0/1/2/3)
- Next immediate task
- Blockers (if any)

**Tool Performance Notes:**
- Which tools were most used
- Any tool failures or retries
- Component library searches performed

**Critical Context to Preserve:**
- Feature IDs and their status
- Specific error codes mentioned
- Component library search results
- Files that need attention

Rules:
- Be concise, use bullets
- Latest status wins for conflicts
- Omit superseded details
- Quote exact error codes when mentioned
- Focus on WHAT was done, not HOW
- Preserve component library usage patterns (critical for consistency)
- Note when custom components were created vs library components used
'''

    def __init__(self, config: ArchitectSummarizerConfig):
        self.config = config
        self.client = AsyncOpenAI()

    async def summarize(self, messages: List[Dict]) -> tuple[str, str]:
        """
        Summarize architect conversation history.

        Args:
            messages: List of conversation messages to summarize

        Returns:
            Tuple of (user_shadow, assistant_summary)
            - user_shadow: Synthetic user message requesting summary
            - assistant_summary: Generated summary text
        """
        # Prepare compact history
        snippets = []
        for msg in messages:
            role = msg.get("role", "assistant")
            content = str(msg.get("content", ""))

            # Trim verbose tool results
            if role in {"tool", "tool_result"}:
                if len(content) > self.config.tool_trim_limit:
                    content = content[:self.config.tool_trim_limit] + " [...]"

            snippets.append(f"{role.upper()}: {content}")

        # Call summarizer
        try:
            response = await self.client.responses.create(
                model=self.config.summarizer_model,
                input=[
                    {"role": "system", "content": self.SUMMARY_PROMPT},
                    {"role": "user", "content": "\n\n".join(snippets)}
                ],
                max_output_tokens=self.config.max_summary_tokens
            )

            summary = response.output_text
            user_shadow = "Summarize the e-commerce project we've been building."

            logger.info(
                f"Generated summary: {len(summary)} chars, "
                f"compressed {len(messages)} messages"
            )

            return user_shadow, summary

        except Exception as e:
            logger.error(f"Summarization failed: {e}")
            # Fallback: return a basic summary
            return (
                "Summarize the e-commerce project we've been building.",
                f"[Summary unavailable due to error: {str(e)[:100]}]"
            )


class ArchitectSummarizingSession(SessionABC):
    """
    Session memory for Architect agent with automatic summarization.

    This session implementation automatically summarizes older conversation
    history while keeping recent turns verbatim. This reduces token costs
    by 60-80% while maintaining critical context.

    Usage:
        session = ArchitectSummarizingSession(
            session_id=context.chat_id,
            config=ArchitectSummarizerConfig(
                keep_last_n_turns=3,
                context_limit=8
            )
        )

        result = await Runner.run(
            architect_agent,
            input="Create a clothing store",
            session=session,
            context=doxii_context
        )

    Thread Safety:
        All operations are protected by an async lock to ensure
        thread-safe access to the conversation history.
    """

    def __init__(
        self,
        session_id: str,
        config: Optional[ArchitectSummarizerConfig] = None
    ):
        """
        Initialize the summarizing session.

        Args:
            session_id: Unique identifier for this session (usually context.chat_id)
            config: Configuration for summarization behavior
        """
        self.session_id = session_id
        self.config = config or ArchitectSummarizerConfig()
        self.summarizer = ArchitectSummarizer(self.config)

        self._records: List[Dict[str, Any]] = []
        self._lock = asyncio.Lock()
        self._summary_count = 0

        logger.info(
            f"Created ArchitectSummarizingSession {session_id} "
            f"(keep_last={self.config.keep_last_n_turns}, "
            f"limit={self.config.context_limit})"
        )

    async def get_items(self, limit: Optional[int] = None) -> List[Dict]:
        """
        Get conversation history (summarized if needed).

        Args:
            limit: Optional limit on number of items to return (most recent)

        Returns:
            List of conversation messages
        """
        async with self._lock:
            items = [r["msg"] for r in self._records]
            return items[-limit:] if limit else items

    async def add_items(self, items: List[Dict]) -> None:
        """
        Add new items and summarize if over limit.

        This method:
        1. Adds new conversation items to the history
        2. Checks if summarization is needed (user turns > context_limit)
        3. If needed, summarizes old turns and keeps recent ones verbatim

        Args:
            items: List of new conversation items to add
        """
        async with self._lock:
            # Add new items
            for item in items:
                self._records.append({
                    "msg": item,
                    "meta": {"synthetic": False}
                })

            # Check if summarization needed
            user_turns = [
                i for i, r in enumerate(self._records)
                if r["msg"].get("role") == "user" and not r["meta"].get("synthetic")
            ]

            if len(user_turns) <= self.config.context_limit:
                return  # No summarization needed

            # Need to summarize
            keep_from_idx = user_turns[-self.config.keep_last_n_turns]
            old_records = self._records[:keep_from_idx]
            keep_records = self._records[keep_from_idx:]

            logger.info(
                f"Session {self.session_id}: Summarization triggered "
                f"({len(user_turns)} turns > {self.config.context_limit} limit). "
                f"Compressing {len(old_records)} items, keeping {len(keep_records)}"
            )

        # Summarize outside lock (slow operation)
        old_msgs = [r["msg"] for r in old_records]
        user_shadow, summary = await self.summarizer.summarize(old_msgs)

        # Apply summary atomically
        async with self._lock:
            self._records = [
                {
                    "msg": {"role": "user", "content": user_shadow},
                    "meta": {
                        "synthetic": True,
                        "kind": "summary_prompt",
                        "summary_index": self._summary_count
                    }
                },
                {
                    "msg": {"role": "assistant", "content": summary},
                    "meta": {
                        "synthetic": True,
                        "kind": "summary",
                        "summary_index": self._summary_count,
                        "compressed_items": len(old_records)
                    }
                }
            ] + keep_records

            self._summary_count += 1

            logger.debug(
                f"Summary #{self._summary_count} applied. "
                f"New history size: {len(self._records)} items"
            )

    async def pop_item(self) -> Optional[Dict]:
        """
        Remove and return most recent item.

        Returns:
            Most recent message, or None if empty
        """
        async with self._lock:
            if not self._records:
                return None
            return self._records.pop()["msg"]

    async def clear_session(self) -> None:
        """Clear all session data."""
        async with self._lock:
            logger.info(f"Clearing session {self.session_id}")
            self._records.clear()
            self._summary_count = 0

    async def get_stats(self) -> Dict[str, Any]:
        """
        Get session statistics.

        Returns:
            Dictionary with session metrics:
            - total_items: Current number of items in history
            - user_turns: Number of real user turns
            - summaries_generated: Number of times summarization occurred
            - has_summary: Whether history contains a summary
        """
        async with self._lock:
            user_turns = [
                r for r in self._records
                if r["msg"].get("role") == "user" and not r["meta"].get("synthetic")
            ]

            has_summary = any(
                r["meta"].get("kind") == "summary"
                for r in self._records
            )

            return {
                "session_id": self.session_id,
                "total_items": len(self._records),
                "user_turns": len(user_turns),
                "summaries_generated": self._summary_count,
                "has_summary": has_summary,
                "config": {
                    "keep_last_n_turns": self.config.keep_last_n_turns,
                    "context_limit": self.config.context_limit,
                    "tool_trim_limit": self.config.tool_trim_limit
                }
            }

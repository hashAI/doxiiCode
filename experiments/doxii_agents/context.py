"""
Shared context type for all DOXII agents.
"""

import os
from dataclasses import dataclass, field
from typing import List, Optional, TYPE_CHECKING, Literal

if TYPE_CHECKING:
    from .models import DesignSystem, DeveloperResult


@dataclass
class Feature:
    """High-level feature for long-term planning (replaces PLAN.md)."""
    id: str
    name: str
    description: str
    status: Literal["pending", "in_progress", "completed"]
    priority: Literal["high", "medium", "low"] = "medium"
    estimated_tasks: int = 0
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


@dataclass
class Task:
    """Low-level task for short-term execution within a feature."""
    id: str
    feature_id: str
    content: str
    activeForm: str
    status: Literal["pending", "in_progress", "completed"]
    priority: Literal["high", "medium", "low"] = "medium"


@dataclass
class TodoItem:
    """Legacy task item - deprecated, use Task instead."""
    id: str
    content: str
    activeForm: str
    status: Literal["pending", "in_progress", "completed"]
    category: Literal["setup", "page", "component", "validation", "integration"]


@dataclass
class DoxiiContext:
    """Shared context across all agents."""

    # Identity
    chat_id: str
    user_id: Optional[str] = None

    # Project info
    chat_root: str = ""
    project_initialized: bool = False

    # File system
    file_index: List[str] = field(default_factory=list)

    # CMS integration
    cms_base_url: str = ""
    tenant_id: str = ""  # Same as chat_id typically

    # State tracking
    last_agent: Optional[str] = None
    handoff_count: int = 0

    # Two-agent architecture fields
    design_system: Optional["DesignSystem"] = None  # Created by Architect, used by Developer
    task_results: List["DeveloperResult"] = field(default_factory=list)  # Track Developer task results

    # Dual planning tools (long-term + short-term)
    features: List["Feature"] = field(default_factory=list)
    """High-level features for long-term planning (replaces PLAN.md)"""

    tasks: List["Task"] = field(default_factory=list)
    """Short-term tasks for current feature implementation"""

    current_feature_id: Optional[str] = None
    """ID of the feature currently being implemented"""

    # Legacy todo tracking (deprecated)
    architect_todos: List[TodoItem] = field(default_factory=list)
    """Legacy list of tasks - deprecated, use features + tasks instead"""

    current_phase: str = "planning"
    """Current workflow phase: planning|setup|development|validation|integration"""

    completed_pages: List[str] = field(default_factory=list)
    """List of completed page IDs"""

    validation_history: List[dict] = field(default_factory=list)
    """History of validation results for debugging"""

    debug: bool = False
    """Enable debug mode - writes planning data to disk (.doxii/features.json, tasks.json)"""

    # Token tracking for cost monitoring
    total_input_tokens: int = 0
    """Total input tokens used across all turns"""

    total_output_tokens: int = 0
    """Total output tokens generated across all turns"""

    turns_count: int = 0
    """Number of conversation turns"""

    summaries_generated: int = 0
    """Number of times conversation was summarized"""

    def __post_init__(self):
        """Initialize derived fields."""
        if not self.tenant_id:
            self.tenant_id = self.chat_id
        if not self.chat_root:
            self.chat_root = f"./test_output/{self.chat_id}"

    def update_file_index(self):
        """Refresh file index from disk."""
        if not os.path.exists(self.chat_root):
            self.file_index = []
            return

        file_list = []
        for root, dirs, files in os.walk(self.chat_root):
            # Skip hidden directories and common excludes
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', 'dist', '__pycache__']]

            for file in files:
                if file.startswith('.'):
                    continue
                rel_path = os.path.relpath(os.path.join(root, file), self.chat_root)
                file_list.append(rel_path)

        self.file_index = sorted(file_list)

    def mark_initialized(self):
        """Mark project as initialized."""
        self.project_initialized = True
        self.update_file_index()

    def get_file_count(self) -> int:
        """Get count of files in project."""
        return len(self.file_index)

    def file_exists(self, rel_path: str) -> bool:
        """Check if a file exists in the project."""
        full_path = os.path.join(self.chat_root, rel_path)
        return os.path.exists(full_path)

    def record_turn_tokens(self, input_tokens: int, output_tokens: int):
        """
        Track tokens per turn for cost monitoring.

        Args:
            input_tokens: Tokens in the input prompt
            output_tokens: Tokens in the model's output
        """
        self.total_input_tokens += input_tokens
        self.total_output_tokens += output_tokens
        self.turns_count += 1

    def get_average_tokens_per_turn(self) -> dict:
        """
        Calculate token efficiency metrics.

        Returns:
            Dictionary with:
            - avg_input: Average input tokens per turn
            - avg_output: Average output tokens per turn
            - total_cost_usd: Estimated total cost in USD
        """
        if self.turns_count == 0:
            return {"avg_input": 0, "avg_output": 0, "total_cost_usd": 0.0}

        return {
            "avg_input": self.total_input_tokens // self.turns_count,
            "avg_output": self.total_output_tokens // self.turns_count,
            "total_turns": self.turns_count,
            "summaries": self.summaries_generated,
            "total_cost_usd": (
                (self.total_input_tokens / 1_000_000) * 3.0 +  # gpt-5-codex input
                (self.total_output_tokens / 1_000_000) * 15.0   # gpt-5-codex output
            )
        }

    def get_token_stats(self) -> str:
        """
        Get formatted token usage statistics.

        Returns:
            Human-readable string with token stats
        """
        stats = self.get_average_tokens_per_turn()
        return (
            f"Token Usage Stats:\n"
            f"  Turns: {stats['total_turns']}\n"
            f"  Summaries: {stats['summaries']}\n"
            f"  Avg Input: {stats['avg_input']:,} tokens/turn\n"
            f"  Avg Output: {stats['avg_output']:,} tokens/turn\n"
            f"  Total Input: {self.total_input_tokens:,} tokens\n"
            f"  Total Output: {self.total_output_tokens:,} tokens\n"
            f"  Est. Cost: ${stats['total_cost_usd']:.2f}"
        )

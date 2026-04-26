"""
Task planning tools for DOXII agents (Short-Term Planning).

Enables agents to break down features into specific implementation tasks.
Works in conjunction with feature_planning_tools for hierarchical planning.
"""

import os
import json
from typing import Optional, List, Literal
from dataclasses import asdict
from pydantic import BaseModel, ConfigDict
from agents import function_tool, RunContextWrapper
from ..context import DoxiiContext, Task


class TaskInput(BaseModel):
    """Pydantic model for task input validation."""
    model_config = ConfigDict(extra='forbid')

    id: str
    feature_id: str
    content: str
    activeForm: str
    status: Literal["pending", "in_progress", "completed"] = "pending"
    priority: Literal["high", "medium", "low"] = "medium"


@function_tool
async def write_tasks(
    ctx: RunContextWrapper[DoxiiContext],
    tasks: List[TaskInput]
) -> str:
    """
    Create or update task list for current feature implementation.

    This is the SHORT-TERM PLANNING TOOL for breaking down features into tasks.
    Use this in Phase 2 when implementing each feature.

    WHEN TO USE:
    ✅ Phase 2: Break down current feature into implementation tasks
    ✅ After marking feature as in_progress
    ✅ When discovering sub-tasks during implementation
    ✅ For validation and error-fixing tasks

    WHEN NOT TO USE:
    ❌ For high-level feature planning (use write_features instead)
    ❌ For single-step operations
    ❌ For trivial file reads/writes

    HIERARCHY:
    Feature (f1) → Tasks (f1-t1, f1-t2, f1-t3, ...)
    - One feature has many tasks
    - Tasks are cleared after feature completes

    TASK STATE RULES:
    - pending: Not started yet (default for new tasks)
    - in_progress: Currently working (ONLY ONE at a time)
    - completed: Finished successfully (mark IMMEDIATELY after completion)

    CRITICAL RULES:
    1. Mark task as in_progress BEFORE starting work
    2. Mark completed IMMEDIATELY after finishing (don't batch)
    3. NEVER have more than ONE task in_progress
    4. NEVER mark completed if errors exist
    5. Create new tasks for discovered sub-work

    Args:
        tasks: List of TaskInput objects with required fields:
            - id (str): Unique identifier (e.g., "f1-t1")
            - feature_id (str): Parent feature ID (e.g., "f1")
            - content (str): Imperative description
            - activeForm (str): Present continuous form
            - status (str): "pending" | "in_progress" | "completed"
            - priority (str): "high" | "medium" | "low"

    Example:
        # Feature f1 is in_progress, now break it down
        write_tasks(ctx, [
            TaskInput(
                id="f1-t1",
                feature_id="f1",
                content="Create hero component with GSAP animations",
                activeForm="Creating hero component",
                status="pending",
                priority="high"
            ),
            TaskInput(
                id="f1-t2",
                feature_id="f1",
                content="Add responsive styling with Tailwind",
                activeForm="Adding responsive styling",
                status="pending",
                priority="high"
            ),
            TaskInput(
                id="f1-t3",
                feature_id="f1",
                content="Validate component with ESLint",
                activeForm="Validating component",
                status="pending",
                priority="medium"
            )
        ])

    Returns:
        Confirmation with task count and progress summary
    """
    # Validate input
    if not tasks or not isinstance(tasks, list):
        return json.dumps({"error": "tasks must be a non-empty list"})

    # Convert to Task dataclass objects
    try:
        task_items = [
            Task(
                id=t.id,
                feature_id=t.feature_id,
                content=t.content,
                activeForm=t.activeForm,
                status=t.status,
                priority=t.priority
            )
            for t in tasks
        ]
    except Exception as e:
        return json.dumps({"error": f"Invalid task format: {str(e)}"})

    # Validate single in_progress rule
    in_progress_count = sum(1 for t in task_items if t.status == "in_progress")
    if in_progress_count > 1:
        return json.dumps({
            "error": f"Cannot have {in_progress_count} tasks in_progress. Only ONE task can be in_progress at a time."
        })

    # Store in context (append to existing tasks or replace)
    # Strategy: Replace all tasks for this feature_id
    feature_id = task_items[0].feature_id if task_items else None
    if feature_id:
        # Remove old tasks for this feature
        ctx.context.tasks = [
            t for t in ctx.context.tasks
            if t.feature_id != feature_id
        ]
        # Add new tasks
        ctx.context.tasks.extend(task_items)
    else:
        ctx.context.tasks = task_items

    # Persist to file ONLY if debug mode enabled
    if ctx.context.debug:
        tasks_dir = os.path.join(ctx.context.chat_root, ".doxii")
        os.makedirs(tasks_dir, exist_ok=True)
        tasks_file = os.path.join(tasks_dir, "tasks.json")

        with open(tasks_file, 'w') as f:
            json.dump([asdict(t) for t in ctx.context.tasks], f, indent=2)

    # Create summary for current feature tasks
    total = len(task_items)
    pending = sum(1 for t in task_items if t.status == "pending")
    in_progress = sum(1 for t in task_items if t.status == "in_progress")
    completed = sum(1 for t in task_items if t.status == "completed")
    progress_pct = (completed / total * 100) if total > 0 else 0

    # Priority breakdown
    high_priority = sum(1 for t in task_items if t.priority == "high")
    medium_priority = sum(1 for t in task_items if t.priority == "medium")
    low_priority = sum(1 for t in task_items if t.priority == "low")

    return json.dumps({
        "success": True,
        "message": f"Created {total} tasks for feature '{feature_id}'",
        "summary": {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "progress": f"{progress_pct:.1f}%"
        },
        "priority_breakdown": {
            "high": high_priority,
            "medium": medium_priority,
            "low": low_priority
        }
    })


@function_tool
async def get_tasks(
    ctx: RunContextWrapper[DoxiiContext],
    feature_id: Optional[str] = None,
    filter_status: Optional[str] = None
) -> str:
    """
    Retrieve task list with optional filtering.

    Use this to check progress within a feature or find next task.

    COMMON USAGE:
    - get_tasks(ctx, feature_id="f1")  # Get all tasks for feature f1
    - get_tasks(ctx, feature_id="f1", filter_status="pending")  # Get next tasks
    - get_tasks(ctx, filter_status="in_progress")  # See what's being worked on

    Args:
        feature_id: Optional filter by feature ID
        filter_status: Optional filter by status (pending/in_progress/completed)

    Returns:
        JSON with tasks and progress summary
    """
    tasks = ctx.context.tasks or []

    # Apply filters
    filtered = tasks
    if feature_id:
        filtered = [t for t in filtered if t.feature_id == feature_id]
    if filter_status:
        filtered = [t for t in filtered if t.status == filter_status]

    # Calculate summary from filtered set
    total = len(filtered)
    pending = sum(1 for t in filtered if t.status == "pending")
    in_progress = sum(1 for t in filtered if t.status == "in_progress")
    completed = sum(1 for t in filtered if t.status == "completed")
    progress_pct = (completed / total * 100) if total > 0 else 0

    return json.dumps({
        "tasks": [asdict(t) for t in filtered],
        "count": len(filtered),
        "summary": {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "progress": f"{progress_pct:.1f}%"
        }
    })


class TaskUpdate(BaseModel):
    """Single task status update."""
    model_config = ConfigDict(extra='forbid')

    task_id: str
    status: Literal["pending", "in_progress", "completed"]


@function_tool
async def update_task_status(
    ctx: RunContextWrapper[DoxiiContext],
    updates: List[TaskUpdate]
) -> str:
    """
    Update status of one or multiple tasks in a single call.

    PERFORMANCE: Always use a list, even for single updates. This is the most efficient approach.

    CRITICAL RULES:
    1. Mark in_progress BEFORE starting work on the task
    2. Mark completed IMMEDIATELY after finishing the task
    3. Only ONE task can be in_progress at a time across ALL updates
    4. NEVER mark completed if errors exist or work is incomplete
    5. If blocked, keep as in_progress and create new task for blocker

    USAGE EXAMPLES:
        # Single task
        update_task_status(ctx, [
            {"task_id": "f1-t1", "status": "completed"}
        ])

        # Multiple tasks (BULK) - ALWAYS USE THIS PATTERN
        update_task_status(ctx, [
            {"task_id": "f1-t1", "status": "completed"},
            {"task_id": "f1-t2", "status": "completed"},
            {"task_id": "f1-t3", "status": "in_progress"}
        ])

        # Mixed statuses supported!
        update_task_status(ctx, [
            {"task_id": "f1-t1", "status": "completed"},
            {"task_id": "f1-t2", "status": "completed"},
            {"task_id": "f1-t3", "status": "pending"}  # Reset
        ])

    Args:
        updates: List of TaskUpdate objects, each with task_id and status

    Returns:
        Updated task(s) and summary
    """
    tasks = ctx.context.tasks or []

    if not tasks:
        return json.dumps({"error": "No tasks exist. Create tasks first with write_tasks()."})

    if not updates or not isinstance(updates, list):
        return json.dumps({"error": "updates must be a non-empty list"})

    # Build task map and validate all IDs exist
    task_map = {t.id: t for t in tasks}
    invalid_ids = [u.task_id for u in updates if u.task_id not in task_map]
    if invalid_ids:
        return json.dumps({
            "error": f"Task(s) not found: {invalid_ids}",
            "available_ids": list(task_map.keys())
        })

    # Validate single in_progress rule
    updated_ids = {u.task_id for u in updates}
    in_progress_in_updates = sum(1 for u in updates if u.status == "in_progress")

    # Check existing in_progress tasks NOT being updated
    existing_in_progress = sum(
        1 for t in tasks
        if t.status == "in_progress" and t.id not in updated_ids
    )

    total_in_progress = in_progress_in_updates + existing_in_progress
    if total_in_progress > 1:
        return json.dumps({
            "error": f"Cannot have {total_in_progress} tasks in_progress. Only ONE task can be in_progress at a time."
        })

    # Apply updates
    updated_tasks = []
    for update in updates:
        task = task_map[update.task_id]
        old_status = task.status
        task.status = update.status
        updated_tasks.append({
            "id": task.id,
            "content": task.content,
            "transition": f"{old_status} → {update.status}"
        })

    # Persist ONLY if debug mode enabled
    if ctx.context.debug:
        tasks_dir = os.path.join(ctx.context.chat_root, ".doxii")
        os.makedirs(tasks_dir, exist_ok=True)
        tasks_file = os.path.join(tasks_dir, "tasks.json")

        with open(tasks_file, 'w') as f:
            json.dump([asdict(t) for t in ctx.context.tasks], f, indent=2)

    # Calculate summary (all tasks)
    total = len(tasks)
    pending = sum(1 for t in tasks if t.status == "pending")
    in_progress = sum(1 for t in tasks if t.status == "in_progress")
    completed = sum(1 for t in tasks if t.status == "completed")
    progress_pct = (completed / total * 100) if total > 0 else 0

    return json.dumps({
        "success": True,
        "updated_count": len(updated_tasks),
        "updated_tasks": updated_tasks,
        "summary": {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "progress": f"{progress_pct:.1f}%"
        }
    })


@function_tool
async def clear_tasks(
    ctx: RunContextWrapper[DoxiiContext],
    feature_id: str
) -> str:
    """
    Clear all tasks for a completed feature.

    Use this after marking a feature as completed to clean up memory.

    WHEN TO USE:
    ✅ After feature is marked completed
    ✅ Before starting next feature
    ✅ To keep task list focused on current feature

    Args:
        feature_id: ID of the feature whose tasks should be cleared

    Returns:
        Confirmation of tasks cleared
    """
    tasks = ctx.context.tasks or []

    # Count tasks to be removed
    removed_count = sum(1 for t in tasks if t.feature_id == feature_id)

    # Remove tasks for this feature
    ctx.context.tasks = [t for t in tasks if t.feature_id != feature_id]

    # Persist ONLY if debug mode enabled
    if ctx.context.debug:
        tasks_dir = os.path.join(ctx.context.chat_root, ".doxii")
        os.makedirs(tasks_dir, exist_ok=True)
        tasks_file = os.path.join(tasks_dir, "tasks.json")

        with open(tasks_file, 'w') as f:
            json.dump([asdict(t) for t in ctx.context.tasks], f, indent=2)

    return json.dumps({
        "success": True,
        "message": f"Cleared {removed_count} tasks for feature '{feature_id}'",
        "remaining_tasks": len(ctx.context.tasks)
    })


# Export list of all task planning tools
TASK_PLANNING_TOOLS = [
    write_tasks,
    get_tasks,
    update_task_status,
    clear_tasks
]

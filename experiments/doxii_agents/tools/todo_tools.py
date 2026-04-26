"""
TodoWrite tools for DOXII agents.

Enables agents to create, track, and manage tasks throughout the e-commerce store
generation workflow.
"""

import os
import json
from typing import Optional, List, Literal
from dataclasses import asdict
from pydantic import BaseModel, ConfigDict
from agents import function_tool, RunContextWrapper
from ..context import DoxiiContext, TodoItem


class TodoInput(BaseModel):
    """Pydantic model for todo input validation."""
    model_config = ConfigDict(extra='forbid')

    id: str
    content: str
    activeForm: str
    status: Literal["pending", "in_progress", "completed"]
    category: Literal["setup", "page", "component", "validation", "integration"]


@function_tool
async def write_todos(
    ctx: RunContextWrapper[DoxiiContext],
    todos: List[TodoInput]
) -> str:
    """
    Create or update task list for current project.

    Use this tool to plan and track implementation progress.

    WHEN TO USE:
    ✅ Multi-step tasks (3+ steps)
    ✅ Complex features requiring planning
    ✅ User provides multiple requirements
    ✅ Before starting implementation
    ✅ After discovering new sub-tasks

    WHEN NOT TO USE:
    ❌ Single straightforward tasks
    ❌ Trivial operations
    ❌ Simple file reads/writes

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
        todos: List of TodoInput objects with required fields:
            - id (str): Unique identifier
            - content (str): Imperative description
            - activeForm (str): Present continuous form
            - status (str): "pending" | "in_progress" | "completed"
            - category (str): "setup" | "page" | "component" | "validation" | "integration"

    Example:
        write_todos(ctx, [
            TodoInput(
                id="setup-1",
                content="Customize assets/state.js with 12+ products",
                activeForm="Customizing assets/state.js",
                status="pending",
                category="setup"
            ),
            TodoInput(
                id="page-home",
                content="Create home page with hero and product grid",
                activeForm="Creating home page",
                status="pending",
                category="page"
            )
        ])

    Returns:
        Confirmation with todo count and progress summary
    """
    # Validate input
    if not todos or not isinstance(todos, list):
        return json.dumps({"error": "todos must be a non-empty list"})

    # Convert to TodoItem dataclass objects
    try:
        todo_items = [
            TodoItem(
                id=t.id,
                content=t.content,
                activeForm=t.activeForm,
                status=t.status,
                category=t.category
            )
            for t in todos
        ]
    except Exception as e:
        return json.dumps({"error": f"Invalid todo format: {str(e)}"})

    # Validate single in_progress rule
    in_progress_count = sum(1 for t in todo_items if t.status == "in_progress")
    if in_progress_count > 1:
        return json.dumps({
            "error": f"Cannot have {in_progress_count} tasks in_progress. Only ONE task can be in_progress at a time."
        })

    # Store in context
    ctx.context.architect_todos = todo_items

    # Persist to file
    todos_dir = os.path.join(ctx.context.chat_root, ".doxii")
    os.makedirs(todos_dir, exist_ok=True)
    todos_file = os.path.join(todos_dir, "architect_todos.json")

    with open(todos_file, 'w') as f:
        json.dump([asdict(t) for t in todo_items], f, indent=2)

    # Create summary
    total = len(todo_items)
    pending = sum(1 for t in todo_items if t.status == "pending")
    in_progress = sum(1 for t in todo_items if t.status == "in_progress")
    completed = sum(1 for t in todo_items if t.status == "completed")
    progress_pct = (completed / total * 100) if total > 0 else 0

    # Breakdown by category
    breakdown = {
        "setup": sum(1 for t in todo_items if t.category == "setup"),
        "page": sum(1 for t in todo_items if t.category == "page"),
        "component": sum(1 for t in todo_items if t.category == "component"),
        "validation": sum(1 for t in todo_items if t.category == "validation"),
        "integration": sum(1 for t in todo_items if t.category == "integration")
    }

    return json.dumps({
        "success": True,
        "message": f"Created {total} tasks",
        "summary": {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "progress": f"{progress_pct:.1f}%"
        },
        "breakdown": breakdown
    })


@function_tool
async def get_todos(
    ctx: RunContextWrapper[DoxiiContext],
    filter_status: Optional[str] = None,
    filter_category: Optional[str] = None
) -> str:
    """
    Retrieve current task list with optional filtering.

    Use this to check progress or find specific tasks.

    Args:
        filter_status: Optional filter by status (pending/in_progress/completed)
        filter_category: Optional filter by category (setup/page/component/validation/integration)

    Returns:
        JSON with todos and progress summary
    """
    todos = ctx.context.architect_todos or []

    # Apply filters
    filtered = todos
    if filter_status:
        filtered = [t for t in filtered if t.status == filter_status]
    if filter_category:
        filtered = [t for t in filtered if t.category == filter_category]

    # Calculate summary from ALL todos (not just filtered)
    total = len(todos)
    pending = sum(1 for t in todos if t.status == "pending")
    in_progress = sum(1 for t in todos if t.status == "in_progress")
    completed = sum(1 for t in todos if t.status == "completed")
    progress_pct = (completed / total * 100) if total > 0 else 0

    return json.dumps({
        "todos": [asdict(t) for t in filtered],
        "count": len(filtered),
        "summary": {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "progress": f"{progress_pct:.1f}%"
        }
    })


@function_tool
async def update_todo_status(
    ctx: RunContextWrapper[DoxiiContext],
    todo_id: str,
    status: str
) -> str:
    """
    Update status of a specific task.

    CRITICAL RULES:
    1. Mark in_progress BEFORE starting work on the task
    2. Mark completed IMMEDIATELY after finishing the task
    3. Only ONE task can be in_progress at a time
    4. NEVER mark completed if errors exist or work is incomplete
    5. If blocked, keep as in_progress and create new task for blocker

    Workflow Example:
        # Before starting
        update_todo_status(ctx, "page-home", "in_progress")

        # ... do the work ...

        # After completing (with zero errors)
        update_todo_status(ctx, "page-home", "completed")

        # Move to next task
        update_todo_status(ctx, "page-catalog", "in_progress")

    Args:
        todo_id: ID of the task to update
        status: New status value ("pending", "in_progress", or "completed")

    Returns:
        Updated todo item or error
    """
    todos = ctx.context.architect_todos or []

    if not todos:
        return json.dumps({"error": "No todos exist. Create todos first with write_todos()."})

    # Validate status
    if status not in ["pending", "in_progress", "completed"]:
        return json.dumps({"error": f"Invalid status: {status}. Must be pending, in_progress, or completed."})

    # Find todo
    todo = None
    for t in todos:
        if t.id == todo_id:
            todo = t
            break

    if not todo:
        available_ids = [t.id for t in todos]
        return json.dumps({
            "error": f"Todo '{todo_id}' not found",
            "available_ids": available_ids
        })

    # Enforce single in_progress rule
    if status == "in_progress":
        for other in todos:
            if other.id != todo_id and other.status == "in_progress":
                return json.dumps({
                    "error": f"Cannot mark '{todo_id}' as in_progress. Task '{other.id}' ({other.content}) is already in_progress. Complete it first.",
                    "current_in_progress": {
                        "id": other.id,
                        "content": other.content,
                        "activeForm": other.activeForm
                    }
                })

    # Update status
    old_status = todo.status
    todo.status = status

    # Persist
    todos_dir = os.path.join(ctx.context.chat_root, ".doxii")
    os.makedirs(todos_dir, exist_ok=True)
    todos_file = os.path.join(todos_dir, "architect_todos.json")

    with open(todos_file, 'w') as f:
        json.dump([asdict(t) for t in todos], f, indent=2)

    # Update context
    ctx.context.architect_todos = todos

    # Track completed pages
    if status == "completed" and todo.category == "page":
        if todo_id not in ctx.context.completed_pages:
            ctx.context.completed_pages.append(todo_id)

    # Calculate summary
    total = len(todos)
    pending = sum(1 for t in todos if t.status == "pending")
    in_progress = sum(1 for t in todos if t.status == "in_progress")
    completed = sum(1 for t in todos if t.status == "completed")
    progress_pct = (completed / total * 100) if total > 0 else 0

    return json.dumps({
        "success": True,
        "todo": asdict(todo),
        "transition": f"{old_status} → {status}",
        "summary": {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "progress": f"{progress_pct:.1f}%"
        }
    })


# Export list of all todo tools
TODO_TOOLS = [
    write_todos,
    get_todos,
    update_todo_status
]

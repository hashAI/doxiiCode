"""
Feature planning tools for DOXII agents (Long-Term Planning).

Enables agents to create and track high-level features throughout the e-commerce
store generation workflow. Replaces PLAN.md disk I/O with in-memory operations.
"""

import os
import json
from datetime import datetime
from typing import Optional, List, Literal
from dataclasses import asdict
from pydantic import BaseModel, ConfigDict
from agents import function_tool, RunContextWrapper
from ..context import DoxiiContext, Feature


class FeatureInput(BaseModel):
    """Pydantic model for feature input validation."""
    model_config = ConfigDict(extra='forbid')

    id: str
    name: str
    description: str
    status: Literal["pending", "in_progress", "completed"] = "pending"
    priority: Literal["high", "medium", "low"] = "medium"
    estimated_tasks: int = 0


@function_tool
async def write_features(
    ctx: RunContextWrapper[DoxiiContext],
    features: List[FeatureInput]
) -> str:
    """
    Create or update high-level feature list for the project.

    This is the LONG-TERM PLANNING TOOL that replaces PLAN.md.
    Use this in Phase 1 to define all features that need to be implemented.

    WHEN TO USE:
    ✅ Phase 1: Create initial feature list (12-15 features)
    ✅ During execution: Add newly discovered features
    ✅ When scope changes or new requirements emerge

    WHEN NOT TO USE:
    ❌ For breaking down a single feature into tasks (use write_tasks instead)
    ❌ For tracking implementation details (use task_planning_tools)
    ❌ For validation or error tracking (use validation_tools)

    FEATURE HIERARCHY:
    - Features = High-level capabilities (e.g., "Homepage Hero", "Product Catalog")
    - Tasks = Implementation steps within a feature (use write_tasks for this)

    Args:
        features: List of FeatureInput objects with required fields:
            - id (str): Unique identifier (e.g., "f1", "feature-homepage")
            - name (str): Feature name (e.g., "Homepage Hero Section")
            - description (str): Detailed description of what this feature does
            - status (str): "pending" (default) | "in_progress" | "completed"
            - priority (str): "high" | "medium" (default) | "low"
            - estimated_tasks (int): Rough estimate of tasks (optional)

    Example:
        write_features(ctx, [
            FeatureInput(
                id="f1",
                name="Homepage Hero Section",
                description="Create animated hero with CTA and product showcase",
                status="pending",
                priority="high",
                estimated_tasks=5
            ),
            FeatureInput(
                id="f2",
                name="Product Catalog Page",
                description="Grid layout with filters, sorting, and pagination",
                status="pending",
                priority="high",
                estimated_tasks=8
            )
        ])

    Returns:
        JSON with feature count and progress summary
    """
    # Validate input
    if not features or not isinstance(features, list):
        return json.dumps({"error": "features must be a non-empty list"})

    # Convert to Feature dataclass objects
    try:
        feature_items = [
            Feature(
                id=f.id,
                name=f.name,
                description=f.description,
                status=f.status,
                priority=f.priority,
                estimated_tasks=f.estimated_tasks,
                started_at=None,
                completed_at=None
            )
            for f in features
        ]
    except Exception as e:
        return json.dumps({"error": f"Invalid feature format: {str(e)}"})

    # Validate single in_progress rule
    in_progress_count = sum(1 for f in feature_items if f.status == "in_progress")
    if in_progress_count > 1:
        return json.dumps({
            "error": f"Cannot have {in_progress_count} features in_progress. Only ONE feature can be in_progress at a time."
        })

    # Store in context (in-memory, no disk I/O!)
    ctx.context.features = feature_items

    # Persist to file for debugging/recovery
    features_dir = os.path.join(ctx.context.chat_root, ".doxii")
    os.makedirs(features_dir, exist_ok=True)
    features_file = os.path.join(features_dir, "features.json")

    with open(features_file, 'w') as f:
        json.dump([asdict(f) for f in feature_items], f, indent=2)

    # Create summary
    total = len(feature_items)
    pending = sum(1 for f in feature_items if f.status == "pending")
    in_progress = sum(1 for f in feature_items if f.status == "in_progress")
    completed = sum(1 for f in feature_items if f.status == "completed")
    progress_pct = (completed / total * 100) if total > 0 else 0

    # Breakdown by priority
    high_priority = sum(1 for f in feature_items if f.priority == "high")
    medium_priority = sum(1 for f in feature_items if f.priority == "medium")
    low_priority = sum(1 for f in feature_items if f.priority == "low")

    return json.dumps({
        "success": True,
        "message": f"Created {total} features",
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
async def get_features(
    ctx: RunContextWrapper[DoxiiContext],
    filter_status: Optional[str] = None,
    filter_priority: Optional[str] = None
) -> str:
    """
    Retrieve current feature list with optional filtering.

    Use this to check overall progress or find next feature to implement.

    COMMON USAGE:
    - get_features(ctx, filter_status="pending")  # Get next features to work on
    - get_features(ctx, filter_status="completed")  # See what's done
    - get_features(ctx)  # Get all features

    Args:
        filter_status: Optional filter by status (pending/in_progress/completed)
        filter_priority: Optional filter by priority (high/medium/low)

    Returns:
        JSON with features list and progress summary
    """
    features = ctx.context.features or []

    # Apply filters
    filtered = features
    if filter_status:
        filtered = [f for f in filtered if f.status == filter_status]
    if filter_priority:
        filtered = [f for f in filtered if f.priority == filter_priority]

    # Calculate summary from ALL features (not just filtered)
    total = len(features)
    pending = sum(1 for f in features if f.status == "pending")
    in_progress = sum(1 for f in features if f.status == "in_progress")
    completed = sum(1 for f in features if f.status == "completed")
    progress_pct = (completed / total * 100) if total > 0 else 0

    return json.dumps({
        "features": [asdict(f) for f in filtered],
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
async def count_features(
    ctx: RunContextWrapper[DoxiiContext],
    filter_status: Optional[str] = None
) -> str:
    """
    Fast feature count - optimized for Phase 2 loop continuation checks.

    This is CRITICAL for Phase 2 workflow to determine if more features remain.

    USAGE IN PHASE 2:
        # After completing a feature
        result = count_features(ctx, filter_status="pending")
        remaining = result["count"]

        if remaining > 0:
            # Continue to next feature
        else:
            # Move to Phase 3

    Args:
        filter_status: Optional filter (pending/in_progress/completed)

    Returns:
        JSON with count and list of feature names
    """
    features = ctx.context.features or []

    # Apply filter
    if filter_status:
        filtered = [f for f in features if f.status == filter_status]
    else:
        filtered = features

    # Build feature name list
    feature_names = [f.name for f in filtered]

    # Overall summary
    total = len(features)
    pending = sum(1 for f in features if f.status == "pending")
    in_progress = sum(1 for f in features if f.status == "in_progress")
    completed = sum(1 for f in features if f.status == "completed")

    return json.dumps({
        "count": len(filtered),
        "features": feature_names,
        "summary": {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "remaining": pending + in_progress
        }
    })


class FeatureUpdate(BaseModel):
    """Single feature status update."""
    model_config = ConfigDict(extra='forbid')

    feature_id: str
    status: Literal["pending", "in_progress", "completed"]


@function_tool
async def update_feature_status(
    ctx: RunContextWrapper[DoxiiContext],
    updates: List[FeatureUpdate]
) -> str:
    """
    Update status of one or multiple features in a single call with automatic timestamp tracking.

    PERFORMANCE: Always use a list, even for single updates. This is the most efficient approach.

    CRITICAL RULES:
    1. Mark in_progress BEFORE starting feature implementation
    2. Mark completed IMMEDIATELY after all feature tasks are done
    3. Only ONE feature can be in_progress at a time across ALL updates
    4. NEVER mark completed if validation fails or work is incomplete

    USAGE EXAMPLES:
        # Single feature
        update_feature_status(ctx, [
            {"feature_id": "f1", "status": "completed"}
        ])

        # Multiple features (BULK) - ALWAYS USE THIS PATTERN
        update_feature_status(ctx, [
            {"feature_id": "f1", "status": "completed"},
            {"feature_id": "f2", "status": "in_progress"}
        ])

        # Mixed statuses supported!
        update_feature_status(ctx, [
            {"feature_id": "f1", "status": "completed"},
            {"feature_id": "f2", "status": "completed"},
            {"feature_id": "f3", "status": "pending"}  # Reset
        ])

    Args:
        updates: List of FeatureUpdate objects, each with feature_id and status

    Returns:
        Updated feature(s) with automatic timestamps and progress summary
    """
    features = ctx.context.features or []

    if not features:
        return json.dumps({"error": "No features exist. Create features first with write_features()."})

    if not updates or not isinstance(updates, list):
        return json.dumps({"error": "updates must be a non-empty list"})

    # Build feature map and validate all IDs exist
    feature_map = {f.id: f for f in features}
    invalid_ids = [u.feature_id for u in updates if u.feature_id not in feature_map]
    if invalid_ids:
        return json.dumps({
            "error": f"Feature(s) not found: {invalid_ids}",
            "available_ids": list(feature_map.keys())
        })

    # Validate single in_progress rule
    updated_ids = {u.feature_id for u in updates}
    in_progress_in_updates = sum(1 for u in updates if u.status == "in_progress")

    # Check existing in_progress features NOT being updated
    existing_in_progress = sum(
        1 for f in features
        if f.status == "in_progress" and f.id not in updated_ids
    )

    total_in_progress = in_progress_in_updates + existing_in_progress
    if total_in_progress > 1:
        return json.dumps({
            "error": f"Cannot have {total_in_progress} features in_progress. Only ONE feature can be in_progress at a time."
        })

    # Apply updates
    now = datetime.now().isoformat()
    updated_features = []

    for update in updates:
        feature = feature_map[update.feature_id]
        old_status = feature.status
        feature.status = update.status

        # Auto-timestamp tracking
        if update.status == "in_progress" and not feature.started_at:
            feature.started_at = now
        elif update.status == "completed" and not feature.completed_at:
            feature.completed_at = now

        # Update current feature tracking
        if update.status == "in_progress":
            ctx.context.current_feature_id = update.feature_id
        elif update.status == "completed" and ctx.context.current_feature_id == update.feature_id:
            ctx.context.current_feature_id = None

        updated_features.append({
            "id": feature.id,
            "name": feature.name,
            "transition": f"{old_status} → {update.status}"
        })

    # Persist (in-memory already updated via reference)
    features_dir = os.path.join(ctx.context.chat_root, ".doxii")
    os.makedirs(features_dir, exist_ok=True)
    features_file = os.path.join(features_dir, "features.json")

    with open(features_file, 'w') as f:
        json.dump([asdict(f) for f in features], f, indent=2)

    # Calculate summary
    total = len(features)
    pending = sum(1 for f in features if f.status == "pending")
    in_progress = sum(1 for f in features if f.status == "in_progress")
    completed = sum(1 for f in features if f.status == "completed")
    progress_pct = (completed / total * 100) if total > 0 else 0

    return json.dumps({
        "success": True,
        "updated_count": len(updated_features),
        "updated_features": updated_features,
        "summary": {
            "total": total,
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "progress": f"{progress_pct:.1f}%",
            "remaining": pending + in_progress
        }
    })


@function_tool
async def get_feature_progress(
    ctx: RunContextWrapper[DoxiiContext]
) -> str:
    """
    Get overall feature implementation progress.

    Returns comprehensive progress metrics for status reporting.

    Returns:
        JSON with detailed progress statistics
    """
    features = ctx.context.features or []

    total = len(features)
    pending = sum(1 for f in features if f.status == "pending")
    in_progress = sum(1 for f in features if f.status == "in_progress")
    completed = sum(1 for f in features if f.status == "completed")

    completion_pct = (completed / total * 100) if total > 0 else 0

    # Get current feature
    current_feature = None
    if ctx.context.current_feature_id:
        for f in features:
            if f.id == ctx.context.current_feature_id:
                current_feature = asdict(f)
                break

    # Build completed and remaining lists
    completed_list = [{"id": f.id, "name": f.name} for f in features if f.status == "completed"]
    remaining_list = [{"id": f.id, "name": f.name} for f in features if f.status != "completed"]

    return json.dumps({
        "total": total,
        "completed": completed,
        "in_progress": in_progress,
        "pending": pending,
        "remaining": total - completed,
        "completion_percentage": f"{completion_pct:.1f}%",
        "current_feature": current_feature,
        "completed_features": completed_list,
        "remaining_features": remaining_list
    })


# Export list of all feature planning tools
FEATURE_PLANNING_TOOLS = [
    write_features,
    get_features,
    update_feature_status,
]

# Note: count_features and get_feature_progress are redundant.
# get_features() already returns count and full summary with all progress metrics.

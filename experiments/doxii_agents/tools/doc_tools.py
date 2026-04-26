"""
Documentation management tools for DOXII agents.

Enables on-demand documentation loading and caching during batch execution.
"""

import os
import json
from typing import List, Dict
from pydantic import BaseModel
from agents import function_tool, RunContextWrapper
from ..context import DoxiiContext


# Documentation index mapping keys to file paths
DOC_INDEX = {
    "component-design": "docs/component-design.md",
    "page-requirements": "docs/page-requirements.md",
    "patterns-infrastructure": "docs/patterns-and-infrastructure.md",
}


def get_doc_base_path(ctx: RunContextWrapper[DoxiiContext]) -> str:
    """Get the base path for documentation files."""
    # Assuming docs are in experiments/doxii_agents/docs/
    return os.path.join(os.path.dirname(os.path.dirname(__file__)), "docs")


@function_tool
async def load_documentation(
    ctx: RunContextWrapper[DoxiiContext],
    doc_keys: List[str]
) -> str:
    """
    Load multiple documentation files in a single call.

    This is the primary documentation loading tool for Architect agents.
    Use this to load design guidance when implementing features.

    Args:
        doc_keys: List of documentation keys
                 Valid keys:
                 - "component-design": How to build components, patterns, dos/don'ts
                 - "page-requirements": Required pages and must-haves for each page type
                 - "patterns-infrastructure": Common patterns + infrastructure APIs

    Returns:
        JSON with loaded documentation content keyed by doc_key

    Example:
        # Load all docs (recommended for Phase 0)
        load_documentation(ctx, ["component-design", "page-requirements", "patterns-infrastructure"])

        # Load specific docs when needed
        load_documentation(ctx, ["component-design"])
        load_documentation(ctx, ["page-requirements"])

    Best Practice:
        - Load all 3 docs in Phase 0 (Code Understanding)
        - Reference during implementation
        - Don't call repeatedly (wasteful I/O)
    """
    if not doc_keys or not isinstance(doc_keys, list):
        return json.dumps({"error": "doc_keys must be a non-empty list"})

    doc_base = get_doc_base_path(ctx)
    loaded_docs = {}
    errors = []

    for key in doc_keys:
        if key not in DOC_INDEX:
            errors.append(f"Invalid doc key: '{key}'. Check INDEX.md for valid keys.")
            continue

        relative_path = DOC_INDEX[key]
        full_path = os.path.join(doc_base, relative_path)

        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
                loaded_docs[key] = {
                    "key": key,
                    "path": relative_path,
                    "content": content,
                    "length": len(content)
                }
        except FileNotFoundError:
            errors.append(f"Documentation file not found: {relative_path}")
        except Exception as e:
            errors.append(f"Error loading {key}: {str(e)}")

    return json.dumps({
        "success": len(errors) == 0,
        "loaded_count": len(loaded_docs),
        "docs": loaded_docs,
        "errors": errors if errors else None
    }, indent=2)


@function_tool
async def list_available_docs(
    ctx: RunContextWrapper[DoxiiContext]
) -> str:
    """
    List all available documentation keys and their descriptions.

    Use this to discover what documentation is available.

    Returns:
        JSON with all available doc keys and descriptions
    """
    available_docs = {
        "component-design": {
            "description": "How to design and build custom Lit Web Components",
            "covers": [
                "Base component pattern",
                "Component structure and lifecycle",
                "Styling with Tailwind",
                "State management",
                "Event handling",
                "Naming conventions",
                "Icons and animations",
                "Dos and Don'ts"
            ]
        },
        "page-requirements": {
            "description": "Required pages and must-have elements for each page type",
            "covers": [
                "Default pages (Home, Catalog, Product Detail, Cart, Checkout, Wishlist, 404)",
                "Page structure template",
                "Must-have elements per page",
                "Mobile navigation patterns",
                "Example implementations"
            ]
        },
        "patterns-infrastructure": {
            "description": "Common patterns and pre-built infrastructure APIs",
            "covers": [
                "Mobile-first responsive design",
                "Dark mode implementation",
                "Animations (AOS and GSAP)",
                "Images (Epicsum service)",
                "State, Cart, Wishlist, Router APIs",
                "Validation patterns",
                "Performance best practices"
            ]
        }
    }

    return json.dumps({
        "total_docs": len(DOC_INDEX),
        "docs": available_docs,
        "usage": "Use these keys in load_documentation(ctx, ['component-design', 'page-requirements', 'patterns-infrastructure'])",
        "recommendation": "Load all 3 docs in Phase 0 for complete guidance"
    }, indent=2)


# Export list of all doc tools
DOC_TOOLS = [
    load_documentation,
    list_available_docs
]

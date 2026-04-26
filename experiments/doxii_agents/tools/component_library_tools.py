"""
Component Library Tool - Ultra-simple interface to access pre-built components.

ONE function: get_component(query) - Returns component code ready to use.
"""

import json
import os
import random
import sys
from pathlib import Path
from typing import Dict, Any
from agents import function_tool, RunContextWrapper
from ..context import DoxiiContext


# ============================================================================
# Component Library Path Resolution
# ============================================================================

def get_component_library_path() -> Path:
    """Get the absolute path to the component library."""
    script_dir = Path(__file__).parent.parent.parent.parent
    component_library = script_dir / "component_library"

    if not component_library.exists():
        raise FileNotFoundError(f"Component library not found at {component_library}")

    return component_library


def load_component_catalog() -> Dict[str, Any]:
    """Load the component catalog JSON file."""
    catalog_path = get_component_library_path() / "component-catalog.json"

    if not catalog_path.exists():
        raise FileNotFoundError(f"Component catalog not found at {catalog_path}")

    with open(catalog_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def fix_import_paths(code: str) -> str:
    """
    Fix import paths in component code to match actual project structure.

    Library components live in nested dirs (heroes/, newsletters/, etc.) and use
    '../../base-component.js' to reach the library's base-component.js.

    When copied to generated project's flat components/ dir, they need './base-component.js'

    Component library structure:
        component_library/components/
        ├── base-component.js
        └── heroes/hero-gradient/hero-gradient.js  (uses ../../base-component.js)

    Generated project structure:
        components/
        ├── base-component.js
        └── hero-gradient.js  (needs ./base-component.js)

    Args:
        code: Component source code

    Returns:
        Code with corrected import paths
    """
    # Fix BaseComponent path: ../../base-component.js → ./base-component.js
    code = code.replace(
        "from '../../base-component.js'",
        "from './base-component.js'"
    )
    code = code.replace(
        'from "../../base-component.js"',
        'from "./base-component.js"'
    )

    # Also handle single ../ in case some components are only one level deep
    code = code.replace(
        "from '../base-component.js'",
        "from './base-component.js'"
    )
    code = code.replace(
        'from "../base-component.js"',
        'from "./base-component.js"'
    )

    # Fix /api/components/assets/ paths (to ../assets/)
    code = code.replace(
        "from '/api/components/assets/state.js'",
        "from '../assets/state.js'"
    )
    code = code.replace(
        "from '/api/components/assets/router.js'",
        "from '../assets/router.js'"
    )
    code = code.replace(
        "from '/api/components/assets/utils.js'",
        "from '../assets/utils.js'"
    )

    # Fix any other /api/components/assets/ variants
    code = code.replace(
        'from "/api/components/assets/state.js"',
        'from "../assets/state.js"'
    )
    code = code.replace(
        'from "/api/components/assets/router.js"',
        'from "../assets/router.js"'
    )
    code = code.replace(
        'from "/api/components/assets/utils.js"',
        'from "../assets/utils.js"'
    )

    return code


# ============================================================================
# Main Component Tool
# ============================================================================

@function_tool
def get_component(
    ctx_wrapper: RunContextWrapper[DoxiiContext],
    query: str,
    category: str = ""
) -> str:
    """
    Search for and return a component from the library with its code.

    This is your PRIMARY tool for getting UI components. Use this BEFORE
    generating custom components!

    ⚠️ CRITICAL: After calling this tool, you MUST check the result["status"] field:
    - If status == "success": Extract result["code"] and USE IT (with modifications as needed)
    - If status == "error": Then create a custom component

    DO NOT ignore successful results and create custom components anyway!

    The library has 31 pre-built components across 6 categories:
    
    **Heroes (8):** 
    - gradient-ecommerce, ai-geometric, nav-showcase, grid-gradient-network
    - noise-creator, animated-business, leaders-industry, centered-leaders
    
    **Product Detail (4):** 
    - elite (furniture/accordion), fashion (reviews/tabs)
    - sports (vertical gallery/shipping), minimal (luxury/watch)
    
    **Product Galleries (7):**
    - hover-expand, hover-simple, hover-content
    - slider-indicators, slider-buttons, grid, marquee-testimonials
    
    **Newsletters (5):**
    - gradient-purple, modal-simple, dark-simple, card-email, hero-cta
    
    **Features (4):**
    - card-grid, split-image, trusted-brands, icon-list
    
    **About (3):**
    - grid-features, split-features, video-content

    Args:
        ctx_wrapper: Context wrapper
        query: What you're looking for (e.g., "gradient hero", "newsletter modal",
               "product gallery slider", "features grid", "about video")
        category: Optional category filter (heroes, product-detail, product-gallery, 
                  newsletters, features, about)

    Returns:
        JSON string with:
        - component_id: Component identifier
        - element_tag: HTML custom element tag
        - code: Full component source code
        - description: What the component does
        - features: List of features
        - usage: How to import and use
        - dependencies: Required components

    Examples:
        get_component(ctx, "gradient hero")
        get_component(ctx, "newsletter modal")
        get_component(ctx, "product gallery with slider")
        get_component(ctx, "features grid")
        get_component(ctx, "about with video")
        get_component(ctx, "minimal product", category="product-detail")
    """
    context = ctx_wrapper.context

    try:
        catalog = load_component_catalog()
        components = catalog.get("components", [])

        query_lower = query.lower()
        category_lower = category.lower() if category else ""

        # Search for matching component
        best_matches = []
        best_score = 0
        category_components = []

        for comp in components:
            score = 0

            # Track components in the requested category (for fallback)
            if category_lower and comp.get("category", "").lower() == category_lower:
                category_components.append(comp)

            # Category filter
            if category_lower and comp.get("category", "").lower() != category_lower:
                continue

            # Score based on matches in searchable fields
            searchable_text = " ".join([
                comp.get("name", ""),
                comp.get("description", ""),
                comp.get("id", ""),
                " ".join(comp.get("features", [])),
                " ".join(comp.get("use_cases", [])),
                " ".join(comp.get("style_tags", [])),
                " ".join(comp.get("search_keywords", []))
            ]).lower()

            # Check if query words are in searchable text
            query_words = query_lower.split()
            for word in query_words:
                if word in searchable_text:
                    score += 1
                if word in comp.get("id", "").lower():
                    score += 3  # Higher weight for ID match
                if word in comp.get("name", "").lower():
                    score += 2  # Higher weight for name match

            if score > best_score:
                best_score = score
                best_matches = [comp]
            elif score == best_score and score > 0:
                best_matches.append(comp)

        # Pick a random component from best matches
        if best_matches:
            best_match = random.choice(best_matches)
        elif category_lower and category_components:
            # No match found but category specified - return random component from that category
            best_match = random.choice(category_components)
        else:
            # No match found and either no category specified or no components in category
            if category_lower:
                error_msg = f"No components found matching '{query}' in category '{category}'"
            else:
                error_msg = f"No components found matching '{query}'. Please specify a category to get a random component from that category."

            # 📊 LOG COMPONENT NOT FOUND
            print(f"\n{'='*80}", file=sys.stderr)
            print(f"❌ COMPONENT LIBRARY: NOT FOUND", file=sys.stderr)
            print(f"   Query: '{query}'", file=sys.stderr)
            print(f"   Category: '{category}'" if category else "   Category: (none specified)", file=sys.stderr)
            print(f"   Status: ERROR - No matching component", file=sys.stderr)
            print(f"   ✅ AGENT CAN NOW: Create a custom component", file=sys.stderr)
            print(f"{'='*80}\n", file=sys.stderr)

            return json.dumps({
                "status": "error",
                "error": error_msg,
                "suggestion": "Try different search terms or specify a category (heroes, product-detail, product-gallery, newsletters, features, about)"
            }, indent=2)

        # Read component source code
        library_root = get_component_library_path()
        source_file = library_root / best_match["file_path"].replace("component_library/", "")

        if not source_file.exists():
            return json.dumps({
                "error": f"Component file not found: {source_file}",
                "component_id": best_match["id"]
            })

        with open(source_file, 'r', encoding='utf-8') as f:
            component_code = f.read()

        # 🔧 FIX IMPORT PATHS AUTOMATICALLY
        # Component library has incorrect hardcoded paths - fix them before returning
        component_code = fix_import_paths(component_code)

        # 📊 LOG SUCCESSFUL COMPONENT RETRIEVAL
        print(f"\n{'='*80}", file=sys.stderr)
        print(f"✅ COMPONENT LIBRARY: Found '{best_match['name']}'", file=sys.stderr)
        print(f"   Category: {best_match['category']}", file=sys.stderr)
        print(f"   Element: <{best_match['element_tag']}>", file=sys.stderr)
        print(f"   Query: '{query}'", file=sys.stderr)
        print(f"   Status: SUCCESS - Component code is ready to use!", file=sys.stderr)
        print(f"   ⚠️  AGENT MUST: Extract result['code'] and USE IT (modify as needed)", file=sys.stderr)
        print(f"   ⚠️  AGENT MUST NOT: Ignore this and create a custom component", file=sys.stderr)
        print(f"{'='*80}\n", file=sys.stderr)

        # Prepare response with component code and usage info
        return json.dumps({
            "status": "success",
            "component_id": best_match["id"],
            "name": best_match["name"],
            "element_tag": best_match["element_tag"],
            "description": best_match["description"],
            "category": best_match["category"],
            "code": component_code,
            "features": best_match.get("features", []),
            "use_cases": best_match.get("use_cases", []),
            "style_tags": best_match.get("style_tags", []),
            "complexity": best_match.get("complexity", "medium"),
            "mobile_friendly": best_match.get("mobile_friendly", True),
            "dark_mode_support": best_match.get("dark_mode_support", True),
            "dependencies": best_match.get("dependencies", []),
            "required_imports": best_match.get("required_imports", []),
            "usage": {
                "import_statement": f"import '../components/{best_match['element_tag']}.js';",
                "html_usage": f"<{best_match['element_tag']}></{best_match['element_tag']}>",
                "file_path": f"components/{best_match['element_tag']}.js"
            },
            "next_steps": [
                f"Save the code to components/{best_match['element_tag']}.js",
                f"Import in assets/app.js: import '../components/{best_match['element_tag']}.js';",
                f"Use in HTML: <{best_match['element_tag']}></{best_match['element_tag']}>",
                "Customize colors and content as needed"
            ]
        }, indent=2)

    except Exception as e:
        return json.dumps({
            "error": str(e),
            "message": "Failed to search component library"
        })


@function_tool
def list_components(
    ctx_wrapper: RunContextWrapper[DoxiiContext],
    category: str = ""
) -> str:
    """
    List all available components from the component library catalog.

    Use this tool to browse what components are available before searching.
    Helps you understand what's in the library so you can make better queries.

    Args:
        ctx_wrapper: Context wrapper
        category: Optional filter by category (headers, heroes, product-detail,
                  product-gallery, newsletters, features, about)

    Returns:
        JSON string with:
        - total_count: Total number of components
        - categories: List of available categories
        - components: List of component summaries
          * id: Component identifier
          * name: Display name
          * category: Component category
          * element_tag: HTML custom element tag
          * description: Brief description
          * features: Key features list

    Examples:
        list_components(ctx)  # List all components
        list_components(ctx, category="heroes")  # List only hero components
        list_components(ctx, category="newsletters")  # List only newsletter components
    """
    try:
        catalog = load_component_catalog()
        components = catalog.get("components", [])

        category_lower = category.lower() if category else ""

        # Filter by category if specified
        filtered = []
        categories_set = set()

        for comp in components:
            comp_category = comp.get("category", "")
            categories_set.add(comp_category)

            if category_lower and comp_category.lower() != category_lower:
                continue

            filtered.append({
                "id": comp.get("id"),
                "name": comp.get("name"),
                "category": comp_category,
                "element_tag": comp.get("element_tag"),
                "description": comp.get("description"),
                "features": comp.get("features", [])[:5]  # First 5 features
            })

        return json.dumps({
            "total_count": len(filtered),
            "categories": sorted(list(categories_set)),
            "components": filtered
        }, indent=2)

    except Exception as e:
        return json.dumps({
            "error": str(e),
            "message": "Failed to list components from catalog"
        })


# Export list of component library tools
COMPONENT_LIBRARY_TOOLS = [
    get_component,
]

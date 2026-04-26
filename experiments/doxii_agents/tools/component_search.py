"""
Component Search Tools for Architect Agent

Provides tools to search and retrieve components from the component library.
"""

import json
import os
from pathlib import Path
from typing import List, Dict, Optional, Any


# Path to component catalog
CATALOG_PATH = Path(__file__).parent.parent.parent.parent / "component_library" / "component-catalog.json"


def load_component_catalog() -> Dict[str, Any]:
    """Load the component catalog JSON."""
    if not CATALOG_PATH.exists():
        raise FileNotFoundError(f"Component catalog not found at {CATALOG_PATH}")
    
    with open(CATALOG_PATH, 'r') as f:
        return json.load(f)


def search_components(
    query: Optional[str] = None,
    category: Optional[str] = None,
    features: Optional[List[str]] = None,
    style: Optional[str] = None,
    mobile_friendly: Optional[bool] = None,
    dark_mode_support: Optional[bool] = None
) -> List[Dict[str, Any]]:
    """
    Search component library with flexible criteria.
    
    Args:
        query: Natural language search query (searches name, description, keywords)
        category: Filter by category (headers, footers, navigation, etc.)
        features: List of required features
        style: Style preference (minimal, luxury, bold, professional, etc.)
        mobile_friendly: Must be mobile-friendly
        dark_mode_support: Must support dark mode
    
    Returns:
        List of matching components with metadata
    
    Example:
        # Search for headers
        components = search_components(category="headers")
        
        # Search for minimal components
        components = search_components(style="minimal")
        
        # Natural language search
        components = search_components(query="product card with hover effects")
    """
    catalog = load_component_catalog()
    components = catalog['components']
    results = []
    
    for component in components:
        # Category filter
        if category and component.get('category') != category:
            continue
        
        # Mobile friendly filter
        if mobile_friendly is not None and component.get('mobile_friendly') != mobile_friendly:
            continue
        
        # Dark mode filter
        if dark_mode_support is not None and component.get('dark_mode_support') != dark_mode_support:
            continue
        
        # Style filter
        if style:
            style_tags = [tag.lower() for tag in component.get('style_tags', [])]
            if style.lower() not in style_tags:
                continue
        
        # Features filter
        if features:
            component_features = [f.lower() for f in component.get('features', [])]
            if not all(feat.lower() in ' '.join(component_features) for feat in features):
                continue
        
        # Query search (name, description, keywords)
        if query:
            query_lower = query.lower()
            searchable_text = ' '.join([
                component.get('name', '').lower(),
                component.get('description', '').lower(),
                ' '.join(component.get('search_keywords', [])),
                ' '.join(component.get('features', [])),
                ' '.join(component.get('style_tags', []))
            ])
            
            # Simple relevance scoring
            query_words = query_lower.split()
            score = sum(1 for word in query_words if word in searchable_text)
            
            if score == 0:
                continue
            
            # Add relevance score
            component_copy = component.copy()
            component_copy['relevance_score'] = score
            results.append(component_copy)
        else:
            results.append(component)
    
    # Sort by relevance if query was used
    if query:
        results.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
    
    return results


def get_component_details(component_id: str) -> Optional[Dict[str, Any]]:
    """
    Get full details for a specific component.
    
    Args:
        component_id: The component ID (e.g., 'header-classic')
    
    Returns:
        Component details dictionary or None if not found
    
    Example:
        details = get_component_details('header-classic')
        print(details['file_path'])  # components/headers/header-classic.js
    """
    catalog = load_component_catalog()
    
    for component in catalog['components']:
        if component['id'] == component_id:
            return component
    
    return None


def list_component_categories() -> Dict[str, Any]:
    """
    List all available component categories with counts.
    
    Returns:
        Dictionary of categories with metadata
    
    Example:
        categories = list_component_categories()
        for cat_name, cat_info in categories.items():
            print(f"{cat_name}: {cat_info['count']} components")
    """
    catalog = load_component_catalog()
    return catalog.get('categories', {})


def get_components_by_category(category: str) -> List[Dict[str, Any]]:
    """
    Get all components in a specific category.
    
    Args:
        category: Category name (headers, footers, etc.)
    
    Returns:
        List of components in that category
    """
    return search_components(category=category)


def find_compatible_components(component_id: str) -> List[Dict[str, Any]]:
    """
    Find components that work well with the given component.
    
    Args:
        component_id: The component ID
    
    Returns:
        List of compatible/complementary components
    
    Example:
        # Find compatible components for a header
        compatible = find_compatible_components('header-classic')
        # Returns mobile menu components that work with this header
    """
    component = get_component_details(component_id)
    if not component:
        return []
    
    # Get dependencies
    dependencies = component.get('dependencies', [])
    catalog = load_component_catalog()
    
    compatible = []
    for comp in catalog['components']:
        if comp['element_tag'] in dependencies:
            compatible.append(comp)
    
    return compatible


def get_component_code(component_id: str) -> Optional[str]:
    """
    Get the actual code for a component.
    
    Args:
        component_id: The component ID
    
    Returns:
        Component code as string or None if not found
    """
    component = get_component_details(component_id)
    if not component:
        return None
    
    # Construct full path to component file
    file_path = Path(__file__).parent.parent.parent.parent / component['file_path']
    
    if not file_path.exists():
        return None
    
    with open(file_path, 'r') as f:
        return f.read()


# Tool definitions for Architect Agent
COMPONENT_SEARCH_TOOLS = [
    {
        "name": "search_components",
        "description": "Search the component library for matching components. Use natural language queries, category filters, or specific criteria like style and features.",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Natural language search query (e.g., 'product card with hover effects', 'minimal header')"
                },
                "category": {
                    "type": "string",
                    "description": "Component category: headers, footers, navigation, product-cards, product-grids, product-galleries, heroes, carts, filters, category-displays, misc",
                    "enum": ["headers", "footers", "navigation", "product-cards", "product-grids", "product-galleries", "heroes", "carts", "filters", "category-displays", "misc"]
                },
                "features": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of required features"
                },
                "style": {
                    "type": "string",
                    "description": "Style preference: minimal, luxury, bold, professional, modern, classic, etc."
                },
                "mobile_friendly": {
                    "type": "boolean",
                    "description": "Must be mobile-friendly"
                },
                "dark_mode_support": {
                    "type": "boolean",
                    "description": "Must support dark mode"
                }
            }
        }
    },
    {
        "name": "get_component_details",
        "description": "Get full details and metadata for a specific component by its ID",
        "parameters": {
            "type": "object",
            "properties": {
                "component_id": {
                    "type": "string",
                    "description": "The component ID (e.g., 'header-classic', 'product-card-standard')"
                }
            },
            "required": ["component_id"]
        }
    },
    {
        "name": "list_component_categories",
        "description": "List all available component categories and their counts",
        "parameters": {
            "type": "object",
            "properties": {}
        }
    },
    {
        "name": "get_component_code",
        "description": "Get the actual code for a component to review or customize",
        "parameters": {
            "type": "object",
            "properties": {
                "component_id": {
                    "type": "string",
                    "description": "The component ID"
                }
            },
            "required": ["component_id"]
        }
    },
    {
        "name": "find_compatible_components",
        "description": "Find components that are compatible or work well with a given component (e.g., find mobile menus that work with a header)",
        "parameters": {
            "type": "object",
            "properties": {
                "component_id": {
                    "type": "string",
                    "description": "The component ID to find compatible components for"
                }
            },
            "required": ["component_id"]
        }
    }
]


if __name__ == "__main__":
    # Test the search tools
    print("=== Testing Component Search Tools ===\n")
    
    # Test 1: List categories
    print("1. Categories:")
    categories = list_component_categories()
    for cat, info in categories.items():
        print(f"  - {cat}: {info['count']} components")
    
    # Test 2: Search by category
    print("\n2. Headers:")
    headers = search_components(category="headers")
    for h in headers:
        print(f"  - {h['name']} ({h['element_tag']})")
    
    # Test 3: Natural language search
    print("\n3. Search 'minimal':")
    minimal = search_components(query="minimal")
    for m in minimal[:3]:
        print(f"  - {m['name']} (score: {m.get('relevance_score', 0)})")
    
    # Test 4: Get component details
    print("\n4. Component details for 'header-classic':")
    details = get_component_details("header-classic")
    if details:
        print(f"  Name: {details['name']}")
        print(f"  Features: {', '.join(details['features'][:3])}...")
    
    print("\n=== Tests Complete ===")


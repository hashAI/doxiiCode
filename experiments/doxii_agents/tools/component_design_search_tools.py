"""
Component Design Search Tools for Architect Agent

Provides tools to search and retrieve design inspiration components from the API-based component library.
This tool searches external component database for design patterns and examples.
"""

import json
import random
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from agents import function_tool, RunContextWrapper
import urllib.request
import urllib.parse
from ..context import DoxiiContext


# API Configuration
API_BASE_URL = "http://localhost:8000/api/codeblocks"

# Supported tags for component search
SUPPORTED_TAGS = [
    "Tailwind CSS", "TailwindCSS", "CSS", "CSS Animation", "CSS Animations",
    "Hero", "Hero Section", "Landing Page", "Landing",
    "Navbar", "Navigation", "Navigation Menu",
    "Card", "Card Grid", "Cards", "Product Card", "Product Showcase",
    "Gallery", "Image Gallery", "Product Gallery",
    "Carousel", "Image Carousel",
    "Form", "Login Form", "Contact Form", "Authentication Form",
    "Dashboard", "Dashboard UI",
    "Pricing", "Pricing Table", "Pricing Cards",
    "Features", "Features Section", "Feature Cards",
    "Testimonials", "Testimonial",
    "Footer",
    "CTA", "Call to Action",
    "Button", "Animated Button", "Gradient Button",
    "Animation", "Animations", "Scroll Animation",
    "Gradient", "Gradient Background",
    "Glassmorphism", "Glass Effect",
    "Dark Mode", "Dark Theme",
    "Mobile-friendly", "Responsive", "Responsive Design",
    "E-commerce", "Shopping", "Product", "Cart",
    "Minimalistic", "Minimal Design",
    "Interactive", "Interactive Card", "Hover Effects",
    "3D", "3D Card Effect", "3D Animation"
]


def _make_api_request(url: str) -> dict:
    """
    Make HTTP GET request to the component API.

    Args:
        url: Full API URL

    Returns:
        Parsed JSON response
    """
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = response.read()
            return json.loads(data)
    except Exception as e:
        raise Exception(f"API request failed: {str(e)}")


@function_tool
async def component_design_search(
    ctx: RunContextWrapper[DoxiiContext],
    tag: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 20
) -> str:
    """
    Search for design inspiration components from the API-based component library.
    Returns 1 random component from the results for design inspiration.

    This tool helps find real-world component examples with HTML/CSS code that can inspire
    custom component designs. Use this when you need design patterns, layouts, or styling ideas.

    Args:
        tag: Filter by tag (e.g., "Tailwind CSS", "Hero Section", "Card Grid", "Navbar")
             See SUPPORTED_TAGS for popular options. Use specific tags for better results.
        category: Filter by category (e.g., "Web", "Mobile")
        limit: Number of results to fetch from API (default 20, max 50)
               Higher limit = more variety in random selection

    Returns:
        JSON string with a single random component including:
        - id: Component ID
        - name: Component name
        - description: What the component does
        - tags: List of associated tags
        - htmlCode: Complete HTML/CSS code
        - category: Component category

    Usage Examples:
        # Find hero section inspiration
        component_design_search(tag="Hero Section", limit=20)

        # Find card designs
        component_design_search(tag="Card Grid", limit=15)

        # Find navigation examples
        component_design_search(tag="Navbar", limit=10)

        # Find Tailwind CSS components
        component_design_search(tag="Tailwind CSS", limit=25)

    Tip: Use specific tags for more relevant results. Increase limit for more variety.
    """
    try:
        # Build query parameters
        params = {}
        if tag:
            params['tag'] = tag
        if category:
            params['category'] = category
        if limit:
            params['limit'] = min(limit, 50)  # Cap at 50

        # Build URL
        query_string = urllib.parse.urlencode(params)
        url = f"{API_BASE_URL}/?{query_string}" if query_string else f"{API_BASE_URL}/"

        # Make API request
        response_data = _make_api_request(url)

        # Check for success
        if not response_data.get('success', False):
            return json.dumps({
                "error": "API request unsuccessful",
                "details": response_data
            })

        # Get components
        components = response_data.get('data', [])

        if not components:
            return json.dumps({
                "error": "No components found",
                "tag": tag,
                "category": category,
                "suggestion": "Try different tags or remove filters. Popular tags: 'Tailwind CSS', 'Hero Section', 'Card Grid', 'Navbar'"
            })

        # Select 1 random component
        random_component = random.choice(components)

        # Return simplified component data
        return json.dumps({
            "success": True,
            "component": {
                "id": random_component.get('id'),
                "name": random_component.get('name'),
                "description": random_component.get('description'),
                "category": random_component.get('category'),
                "tags": random_component.get('tags', []),
                "htmlCode": random_component.get('htmlCode', ''),
                "status": random_component.get('status'),
                "createdAt": random_component.get('createdAt'),
                "updatedAt": random_component.get('updatedAt')
            },
            "search_params": {
                "tag": tag,
                "category": category,
                "total_found": len(components)
            }
        }, indent=2)

    except Exception as e:
        return json.dumps({
            "error": str(e),
            "tag": tag,
            "category": category
        })


@function_tool
async def get_available_component_tags(
    ctx: RunContextWrapper[DoxiiContext]
) -> str:
    """
    Get all available tags from the component library API.

    Returns:
        JSON string with complete list of available tags for filtering

    Usage:
        # Get all available tags to see what components exist
        get_available_component_tags()
    """
    try:
        url = f"{API_BASE_URL}/filters"
        response_data = _make_api_request(url)

        return json.dumps({
            "success": True,
            "tags": response_data.get('tags', []),
            "total_tags": len(response_data.get('tags', []))
        }, indent=2)

    except Exception as e:
        return json.dumps({
            "error": str(e),
            "fallback_tags": SUPPORTED_TAGS[:20]  # Return some common tags as fallback
        })


# Export list of component design search tools
COMPONENT_DESIGN_SEARCH_TOOLS = [
    component_design_search,
    get_available_component_tags
]

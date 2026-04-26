"""
Design search tools for the chat service.
"""

import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Import design search if available
try:
    from design_search import design_search_tool_func, SEMANTIC_SEARCH_AVAILABLE
    DESIGN_SEARCH_AVAILABLE = SEMANTIC_SEARCH_AVAILABLE
except ImportError:
    DESIGN_SEARCH_AVAILABLE = False

    def design_search_tool_func(query: str) -> str:
        return '{"error": "Design search functionality is not available."}'


class DesignTools:
    """Design search tools implementation."""

    def __init__(self):
        self.available = DESIGN_SEARCH_AVAILABLE

    def design_search_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Search for design inspiration from the component library."""
        if not DESIGN_SEARCH_AVAILABLE or design_search_tool_func is None:
            return {
                "error": "design_search_tool is not available. Make sure component-library-tool backend is accessible."
            }

        query = args.get("query", "")
        if not query:
            return {"error": "Query parameter is required"}

        logger.info("design_search_tool: query=%r", query)

        try:
            result = design_search_tool_func(query)
            return {"query": query, "inspiration": result}
        except Exception as e:
            logger.error("Error in design_search_tool: %s", e)
            return {"error": f"Design search failed: {str(e)}", "query": query}

    def is_available(self) -> bool:
        """Check if design search is available."""
        return self.available
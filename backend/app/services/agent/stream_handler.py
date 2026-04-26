"""
Streaming event handler for the chat service.

Note: The main streaming logic is still integrated with ChatService due to its complexity
and tight coupling with message creation and database operations. This module provides
utilities for stream event processing that could be expanded in future refactoring.
"""

import logging
from typing import Dict, Any, Optional, AsyncGenerator

logger = logging.getLogger(__name__)


class StreamHandler:
    """Handles streaming events and responses from OpenAI."""

    def __init__(self):
        pass

    def parse_stream_event(self, event) -> Dict[str, Any]:
        """Parse a streaming event from OpenAI API."""
        event_type = getattr(event, "type", None)
        return {
            "type": event_type,
            "event": event
        }

    def should_log_event(self, event_type: str) -> bool:
        """Determine if an event type should be logged."""
        # Don't log every delta to reduce noise
        return event_type != "response.function_call_arguments.delta"

    def extract_response_id(self, event) -> Optional[str]:
        """Extract response ID from stream event."""
        response_obj = getattr(event, "response", None)
        if response_obj:
            return getattr(response_obj, "id", None)
        return None

    def extract_function_call_info(self, event) -> Dict[str, Any]:
        """Extract function call information from stream event."""
        item = getattr(event, "item", None)
        if not item:
            return {}

        return {
            "item_id": getattr(item, "id", None),
            "function_name": getattr(item, "name", None),
            "call_id": getattr(item, "call_id", None),
        }

    def extract_delta_content(self, event) -> str:
        """Extract delta content from stream event."""
        return getattr(event, "delta", "")

    def extract_error_message(self, event) -> str:
        """Extract error message from stream event."""
        error_obj = getattr(event, "error", None)
        if error_obj:
            return getattr(error_obj, "message", "Unknown error")
        return "Unknown error"

    async def process_streaming_response(self, stream) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Process a streaming response and yield structured events.

        Note: This is a placeholder for future expansion. The main streaming
        logic remains in ChatService.generate_message_with_agent() due to its
        tight integration with message persistence and state management.
        """
        async for event in stream:
            event_data = self.parse_stream_event(event)
            yield event_data
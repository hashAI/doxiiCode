"""
Multi-Agent Chat Service using OpenAI Agents SDK.

This service replaces the single monolithic agent with a specialized multi-agent system:
- Orchestrator: Routes requests to appropriate specialists
- Architect: Creates new projects from scratch
- Developer: Makes precise code modifications
- Integration: Connects to CMS APIs
"""

import os
import sys
import asyncio
from typing import AsyncGenerator, Dict, Any, Optional
from pathlib import Path

# Add experiments directory to path to import agents
experiments_path = str(Path(__file__).parent.parent.parent.parent / "experiments")
sys.path.insert(0, experiments_path)

from agents import Runner
from doxii_agents.context import DoxiiContext
from doxii_agents.orchestrator import create_orchestrator_agent

from app.config import settings


class MultiAgentChatService:
    """
    Multi-agent chat service for DOXII.
    
    Uses OpenAI Agents SDK with specialized agents for different tasks:
    - Project creation (Architect)
    - Code modifications (Developer)
    - API integration (Integration)
    - Request routing (Orchestrator)
    """
    
    def __init__(self):
        """Initialize the multi-agent service."""
        self.orchestrator = create_orchestrator_agent()
        self._check_prerequisites()
    
    def _check_prerequisites(self):
        """Check that all prerequisites are met."""
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OPENAI_API_KEY environment variable not set")
    
    def _check_project_exists(self, chat_id: str) -> bool:
        """Check if a project already exists for this chat."""
        chat_root = f"./chats/{chat_id}"
        if not os.path.exists(chat_root):
            return False
        
        # Check if index.html exists (indicator of initialized project)
        index_path = os.path.join(chat_root, "index.html")
        return os.path.exists(index_path)
    
    async def generate_response(
        self,
        chat_id: str,
        user_message: str,
        cms_base_url: Optional[str] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Generate streaming response using multi-agent system.
        
        Args:
            chat_id: Unique chat/project identifier
            user_message: User's message/request
            cms_base_url: CMS API base URL (optional, uses config if not provided)
        
        Yields:
            Event dictionaries compatible with frontend expectations
        """
        # Create context
        context = DoxiiContext(
            chat_id=chat_id,
            chat_root=f"./chats/{chat_id}",
            cms_base_url=cms_base_url or settings.CMS_BASE_URL or "https://api.example.com",
            project_initialized=self._check_project_exists(chat_id)
        )
        
        # Run orchestrator with streaming
        try:
            result = await Runner.run_streamed(
                self.orchestrator,
                user_message,
                context=context,
                max_turns=50  # Allow enough turns for complex operations
            )
            
            # Stream events to frontend
            async for event in result.stream_events():
                transformed_event = self._transform_event(event)
                if transformed_event:
                    yield transformed_event
            
            # Get final result
            final_result = await result.result()
            
            # Mark project as initialized if files were created
            if context.get_file_count() > 0:
                context.mark_initialized()
            
        except Exception as e:
            # Stream error to frontend
            yield {
                "chunk_type": "error",
                "content": f"Error: {str(e)}",
                "error": str(e)
            }
    
    def _transform_event(self, event) -> Optional[Dict[str, Any]]:
        """
        Transform Agents SDK events to frontend-compatible format.
        
        The frontend expects events with:
        - chunk_type: text, thinking, tool_call_start, tool_call_complete, done
        - content: The text content to display
        - Additional metadata as needed
        """
        try:
            # Handle different event types from the SDK
            if event.type == "raw_response_event":
                # Text delta streaming
                if hasattr(event.data, 'delta') and event.data.delta:
                    return {
                        "chunk_type": "text",
                        "content": event.data.delta
                    }
                
                # Tool call started
                if hasattr(event.data, 'type') and 'output_item.added' in str(event.data.type):
                    if hasattr(event.data, 'item') and hasattr(event.data.item, 'type'):
                        if 'function_call' in str(event.data.item.type):
                            tool_name = getattr(event.data.item, 'name', 'unknown')
                            return {
                                "chunk_type": "tool_call_start",
                                "content": f"🔧 Using tool: {tool_name}",
                                "tool_name": tool_name
                            }
            
            elif event.type == "run_item_stream_event":
                # Tool completed
                if hasattr(event, 'item') and hasattr(event.item, 'type'):
                    if 'tool_call' in str(event.item.type):
                        return {
                            "chunk_type": "tool_call_complete",
                            "content": "✓ Tool completed"
                        }
            
            elif event.type == "agent_updated_stream_event":
                # Agent handoff occurred
                if hasattr(event, 'new_agent'):
                    agent_name = event.new_agent.name
                    return {
                        "chunk_type": "thinking",
                        "content": f"→ Handing off to {agent_name} agent..."
                    }
            
        except Exception as e:
            # Log error but don't break streaming
            print(f"Error transforming event: {e}")
            return None
        
        return None


# Singleton instance
_multi_agent_service = None


def get_multi_agent_service() -> MultiAgentChatService:
    """Get or create the multi-agent service singleton."""
    global _multi_agent_service
    if _multi_agent_service is None:
        _multi_agent_service = MultiAgentChatService()
    return _multi_agent_service

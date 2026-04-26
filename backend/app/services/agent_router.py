"""
Agent Router - Routes between single agent and multi-agent systems.

This module provides a unified interface that can use either:
1. The legacy single-agent system (chat_service)
2. The new multi-agent system (multi_agent_service)

The routing decision is based on feature flags and gradual rollout percentages.
"""

import hashlib
from typing import AsyncGenerator, Dict, Any
from app.config import settings
from app.services.chat_service import chat_service
from app.services.multi_agent_service import get_multi_agent_service


def should_use_multi_agent(chat_id: str) -> bool:
    """
    Determine if this chat should use the multi-agent system.
    
    Decision based on:
    1. Global feature flag (USE_MULTI_AGENT)
    2. Gradual rollout percentage (MULTI_AGENT_ROLLOUT_PERCENTAGE)
    
    Args:
        chat_id: Chat identifier
    
    Returns:
        True if should use multi-agent, False for legacy system
    """
    # If feature is disabled, always use legacy
    if not settings.USE_MULTI_AGENT:
        return False
    
    # If rollout is 100%, always use multi-agent
    if settings.MULTI_AGENT_ROLLOUT_PERCENTAGE >= 100:
        return True
    
    # If rollout is 0%, always use legacy
    if settings.MULTI_AGENT_ROLLOUT_PERCENTAGE <= 0:
        return False
    
    # Gradual rollout based on chat_id hash
    # This ensures consistent routing for the same chat_id
    chat_hash = int(hashlib.md5(chat_id.encode()).hexdigest(), 16)
    bucket = chat_hash % 100
    
    return bucket < settings.MULTI_AGENT_ROLLOUT_PERCENTAGE


async def generate_agent_response(
    chat_id: str,
    user_message: str
) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Generate agent response using either single or multi-agent system.
    
    This is a unified interface that automatically routes to the appropriate
    system based on feature flags.
    
    Args:
        chat_id: Chat identifier
        user_message: User's message
    
    Yields:
        Stream chunks compatible with frontend expectations
    """
    use_multi = should_use_multi_agent(chat_id)
    
    if use_multi:
        # Use new multi-agent system
        print(f"🔄 Using MULTI-AGENT system for chat {chat_id}")
        multi_agent_service = get_multi_agent_service()
        
        async for chunk in multi_agent_service.generate_response(chat_id, user_message):
            yield chunk
    else:
        # Use legacy single-agent system
        print(f"🔄 Using LEGACY single-agent system for chat {chat_id}")
        async for chunk in chat_service.generate_message_with_agent(chat_id, user_message):
            yield chunk


def get_agent_system_info(chat_id: str) -> Dict[str, Any]:
    """
    Get information about which agent system is being used.
    
    Useful for debugging and monitoring.
    """
    use_multi = should_use_multi_agent(chat_id)
    
    return {
        "system": "multi_agent" if use_multi else "single_agent",
        "feature_enabled": settings.USE_MULTI_AGENT,
        "rollout_percentage": settings.MULTI_AGENT_ROLLOUT_PERCENTAGE,
        "chat_id": chat_id,
        "using_multi_agent": use_multi
    }


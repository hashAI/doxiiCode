"""
Metrics API Router.

Provides endpoints for monitoring agent performance and collecting metrics.
"""

from fastapi import APIRouter, Query
from typing import Optional
from app.services.agent_metrics import get_metrics_collector

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/stats")
async def get_agent_stats():
    """
    Get aggregated agent statistics.
    
    Returns overall metrics including:
    - Total requests
    - Multi-agent vs single-agent usage
    - Average response time
    - Success rate
    - Token usage
    """
    collector = get_metrics_collector()
    return collector.get_agent_stats()


@router.get("/breakdown")
async def get_agent_breakdown():
    """
    Get detailed breakdown by agent type.
    
    Returns metrics for each agent:
    - Request count
    - Average response time
    - Average token usage
    - Success rate
    """
    collector = get_metrics_collector()
    return collector.get_agent_breakdown()


@router.get("/recent")
async def get_recent_metrics(limit: int = Query(100, ge=1, le=1000)):
    """
    Get recent metric entries.
    
    Args:
        limit: Number of recent entries to return (1-1000)
    
    Returns:
        List of recent metric entries
    """
    collector = get_metrics_collector()
    return {
        "metrics": collector.get_recent_metrics(limit),
        "count": len(collector.get_recent_metrics(limit))
    }


@router.get("/health")
async def metrics_health_check():
    """
    Health check for metrics system.
    
    Returns:
        Status of metrics collection system
    """
    collector = get_metrics_collector()
    stats = collector.get_agent_stats()
    
    return {
        "status": "healthy",
        "metrics_file": str(collector.metrics_file),
        "total_requests_tracked": stats["total_requests"],
        "cache_size": len(collector._recent_metrics)
    }


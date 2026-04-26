"""
Agent Metrics Collection and Monitoring.

Tracks performance metrics for the multi-agent system:
- Routing decisions and accuracy
- Token usage per agent
- Response times
- Error rates
- User satisfaction
"""

import time
import json
from datetime import datetime
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
from pathlib import Path


@dataclass
class AgentMetric:
    """Single metric entry."""
    timestamp: str
    chat_id: str
    user_message: str
    agent_used: str  # "single_agent", "multi_agent", or specific agent name
    tokens_used: Optional[int] = None
    response_time_seconds: Optional[float] = None
    success: bool = True
    error_message: Optional[str] = None
    tool_calls: int = 0
    files_created: int = 0
    files_modified: int = 0


class AgentMetricsCollector:
    """Collects and stores agent metrics."""
    
    def __init__(self, metrics_file: str = "./metrics/agent_metrics.jsonl"):
        self.metrics_file = Path(metrics_file)
        self.metrics_file.parent.mkdir(parents=True, exist_ok=True)
        
        # In-memory cache for quick aggregation
        self._recent_metrics: List[AgentMetric] = []
        self._max_cache_size = 1000
    
    def record_metric(self, metric: AgentMetric):
        """
        Record a single metric.
        
        Args:
            metric: AgentMetric instance to record
        """
        # Add to cache
        self._recent_metrics.append(metric)
        if len(self._recent_metrics) > self._max_cache_size:
            self._recent_metrics.pop(0)
        
        # Append to file (JSONL format)
        try:
            with open(self.metrics_file, 'a') as f:
                f.write(json.dumps(asdict(metric)) + '\n')
        except Exception as e:
            print(f"Error writing metric: {e}")
    
    def get_recent_metrics(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent metrics from cache."""
        recent = self._recent_metrics[-limit:]
        return [asdict(m) for m in recent]
    
    def get_agent_stats(self) -> Dict[str, Any]:
        """Get aggregated statistics."""
        if not self._recent_metrics:
            return {
                "total_requests": 0,
                "multi_agent_usage": 0,
                "single_agent_usage": 0,
                "avg_response_time": 0,
                "success_rate": 0,
                "avg_tokens": 0
            }
        
        total = len(self._recent_metrics)
        multi_agent_count = sum(1 for m in self._recent_metrics if m.agent_used == "multi_agent")
        single_agent_count = sum(1 for m in self._recent_metrics if m.agent_used == "single_agent")
        success_count = sum(1 for m in self._recent_metrics if m.success)
        
        response_times = [m.response_time_seconds for m in self._recent_metrics if m.response_time_seconds]
        tokens = [m.tokens_used for m in self._recent_metrics if m.tokens_used]
        
        return {
            "total_requests": total,
            "multi_agent_usage": multi_agent_count,
            "single_agent_usage": single_agent_count,
            "multi_agent_percentage": (multi_agent_count / total * 100) if total > 0 else 0,
            "success_rate": (success_count / total * 100) if total > 0 else 0,
            "avg_response_time": sum(response_times) / len(response_times) if response_times else 0,
            "avg_tokens": sum(tokens) / len(tokens) if tokens else 0,
            "total_tool_calls": sum(m.tool_calls for m in self._recent_metrics),
            "total_files_created": sum(m.files_created for m in self._recent_metrics),
            "total_files_modified": sum(m.files_modified for m in self._recent_metrics)
        }
    
    def get_agent_breakdown(self) -> Dict[str, Dict[str, Any]]:
        """Get breakdown by agent type."""
        breakdown = {}
        
        for metric in self._recent_metrics:
            agent = metric.agent_used
            if agent not in breakdown:
                breakdown[agent] = {
                    "count": 0,
                    "total_time": 0,
                    "total_tokens": 0,
                    "successes": 0
                }
            
            breakdown[agent]["count"] += 1
            if metric.response_time_seconds:
                breakdown[agent]["total_time"] += metric.response_time_seconds
            if metric.tokens_used:
                breakdown[agent]["total_tokens"] += metric.tokens_used
            if metric.success:
                breakdown[agent]["successes"] += 1
        
        # Calculate averages
        for agent, stats in breakdown.items():
            count = stats["count"]
            stats["avg_time"] = stats["total_time"] / count if count > 0 else 0
            stats["avg_tokens"] = stats["total_tokens"] / count if count > 0 else 0
            stats["success_rate"] = (stats["successes"] / count * 100) if count > 0 else 0
        
        return breakdown


# Global metrics collector
_metrics_collector: Optional[AgentMetricsCollector] = None


def get_metrics_collector() -> AgentMetricsCollector:
    """Get or create the metrics collector singleton."""
    global _metrics_collector
    if _metrics_collector is None:
        _metrics_collector = AgentMetricsCollector()
    return _metrics_collector


class MetricsContext:
    """Context manager for tracking request metrics."""
    
    def __init__(self, chat_id: str, user_message: str, agent_used: str):
        self.metric = AgentMetric(
            timestamp=datetime.utcnow().isoformat(),
            chat_id=chat_id,
            user_message=user_message[:200],  # Truncate long messages
            agent_used=agent_used
        )
        self.start_time = None
        self.collector = get_metrics_collector()
    
    def __enter__(self):
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.start_time:
            self.metric.response_time_seconds = time.time() - self.start_time
        
        if exc_type is not None:
            self.metric.success = False
            self.metric.error_message = str(exc_val)
        
        self.collector.record_metric(self.metric)
        return False  # Don't suppress exceptions
    
    def set_tokens(self, tokens: int):
        """Set token usage."""
        self.metric.tokens_used = tokens
    
    def set_tool_calls(self, count: int):
        """Set number of tool calls."""
        self.metric.tool_calls = count
    
    def set_files_created(self, count: int):
        """Set number of files created."""
        self.metric.files_created = count
    
    def set_files_modified(self, count: int):
        """Set number of files modified."""
        self.metric.files_modified = count


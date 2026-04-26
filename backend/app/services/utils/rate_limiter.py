"""
Rate limiting utilities for OpenAI API calls.
"""

import asyncio
import random
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class RateLimitHandler:
    """Handles OpenAI API rate limiting with exponential backoff and jitter."""

    def __init__(self, initial_delay: float = 1.0, exponential_base: float = 2.0,
                 jitter: bool = True, max_retries: int = 6, max_delay: float = 60.0):
        self.initial_delay = initial_delay
        self.exponential_base = exponential_base
        self.jitter = jitter
        self.max_retries = max_retries
        self.max_delay = max_delay

    async def execute_with_backoff(self, func, *args, **kwargs):
        """Execute a function with exponential backoff retry logic."""
        num_retries = 0
        delay = self.initial_delay

        while True:
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                # Check if it's a rate limit error
                if self._is_rate_limit_error(e):
                    num_retries += 1
                    if num_retries > self.max_retries:
                        logger.error(f"❌ Maximum retries ({self.max_retries}) exceeded for rate limit")
                        raise Exception(f"Maximum number of retries ({self.max_retries}) exceeded due to rate limiting. Original error: {str(e)}")

                    # Try to extract retry-after time from error message
                    retry_after = self._extract_retry_after(e)
                    if retry_after:
                        # Use the suggested retry time with some jitter
                        base_delay = retry_after
                        if self.jitter:
                            jitter_factor = 1 + (random.random() * 0.1)  # Small jitter for suggested delays
                            actual_delay = min(base_delay * jitter_factor, self.max_delay)
                        else:
                            actual_delay = min(base_delay, self.max_delay)
                    else:
                        # Use exponential backoff
                        if self.jitter:
                            jitter_factor = 1 + random.random()
                            actual_delay = min(delay * jitter_factor, self.max_delay)
                        else:
                            actual_delay = min(delay, self.max_delay)

                    logger.warning(f"⏳ Rate limit hit, retrying in {actual_delay:.2f}s (attempt {num_retries}/{self.max_retries})")
                    logger.info(f"📊 Rate limit error details: {str(e)[:200]}")

                    await asyncio.sleep(actual_delay)

                    # Increase delay for next retry (only if not using suggested retry-after)
                    if not retry_after:
                        delay *= self.exponential_base
                else:
                    # Re-raise non-rate-limit errors immediately
                    logger.error(f"❌ Non-rate-limit error encountered: {str(e)[:100]}")
                    raise e

    def _is_rate_limit_error(self, error: Exception) -> bool:
        """Check if an error is a rate limit error."""
        # Check for specific OpenAI error types first
        error_type = type(error).__name__
        if any(rate_type in error_type for rate_type in ['RateLimitError', 'APIError']):
            # For APIError, check the message content
            error_str = str(error).lower()
            if 'rate limit' in error_str or 'tokens per min' in error_str or 'requests per min' in error_str:
                return True

        # Check error message patterns for other error types
        error_str = str(error).lower()
        rate_limit_patterns = [
            'rate limit reached',
            'rate_limit_error',
            'too many requests',
            'quota exceeded',
            'requests per minute',
            'tokens per min',
            'tpm):',  # Pattern from your specific error
            'rpm):'   # Requests per minute pattern
        ]

        return any(pattern in error_str for pattern in rate_limit_patterns)

    def _extract_retry_after(self, error: Exception) -> Optional[float]:
        """Extract retry-after time from error if available."""
        try:
            error_str = str(error)
            # Look for "try again in X.XXs" pattern
            import re
            match = re.search(r'try again in ([\\d.]+)s', error_str)
            if match:
                return float(match.group(1))
        except:
            pass
        return None
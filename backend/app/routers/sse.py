import logging
from fastapi import APIRouter

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sse", tags=["sse"])

# SSE build endpoints removed - Lit projects don't require build steps
# All chat communication now uses /stream/ endpoints only

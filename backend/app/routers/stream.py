import json
import logging
import asyncio
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any

from app.services.chat_service import chat_service
from app.services.agent_router import generate_agent_response, get_agent_system_info

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/stream", tags=["stream"])


@router.get("/agent-status/{chat_id}")
async def get_agent_status(chat_id: str):
    """Get information about which agent system is being used for this chat."""
    return get_agent_system_info(chat_id)

class StreamRequest(BaseModel):
    message: str
    chat_id: str

@router.post("/{chat_id}")
async def stream_chat(chat_id: str, request: StreamRequest):
    logger.info(f"🌊 Stream request for chat {chat_id}: {request.message[:100]}...")

    # Verify chat exists
    chat_data = await chat_service.get_chat_with_messages(chat_id)
    if not chat_data:
        logger.error(f"❌ Chat not found: {chat_id}")
        raise HTTPException(status_code=404, detail="Chat not found")

    logger.info(f"✅ Chat found, starting stream generation")

    async def generate_stream():
        try:
            chunk_count = 0
            # Send initial connection confirmation
            initial_chunk = {"type": "connection", "content": "Connected"}
            # Emit proper SSE frame: data: <json>\n\n
            yield f"data: {json.dumps(initial_chunk)}\n\n".encode("utf-8")

            # Use agent router (auto-selects single or multi-agent system)
            async for chunk in generate_agent_response(chat_id, request.message):
                chunk_count += 1
                sse_data = f"data: {json.dumps(chunk)}\n\n"
                # Be robust to both 'type' and 'chunk_type' keys without raising
                chunk_type = chunk.get("type") or chunk.get("chunk_type") or "unknown"
                content_value = chunk.get("content", "")
                try:
                    content_length = len(content_value)
                except Exception:
                    content_length = len(str(content_value))
                logger.debug(f"📡 SSE chunk {chunk_count}: {chunk_type} - {content_length}")
                yield sse_data.encode("utf-8")  # Encode to bytes

            # Send completion signal
            completion_chunk = {"type": "stream_end", "content": ""}
            yield f"data: {json.dumps(completion_chunk)}\n\n".encode("utf-8")

            logger.info(f"🎯 Stream completed: {chunk_count} chunks sent")

        except Exception as e:
            logger.error(f"❌ Stream error: {e}")
            import traceback
            logger.error(f"📍 Stream traceback: {traceback.format_exc()}")
            error_chunk = {"type": "error", "content": str(e)}
            yield f"data: {json.dumps(error_chunk)}\n\n".encode("utf-8")
            await asyncio.sleep(0.001)

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Transfer-Encoding": "chunked",
        },
    )


@router.get("/get/{chat_id}")
async def stream_chat_get(chat_id: str, message: str = Query(..., description="Message to send to the AI agent")):
    """SSE streaming over GET with query parameter for EventSource compatibility.

    Note: Prefer POST when possible. This endpoint is for clients that can only use GET (EventSource).
    """
    logger.info(f"🌊 [GET] Stream request for chat {chat_id}: {message[:100]}...")

    # Verify chat exists
    chat_data = await chat_service.get_chat_with_messages(chat_id)
    if not chat_data:
        logger.error(f"❌ Chat not found: {chat_id}")
        raise HTTPException(status_code=404, detail="Chat not found")

    async def generate_stream():
        try:
            yield f"data: {json.dumps({'type': 'connection', 'content': 'Connected'})}\n\n".encode("utf-8")
            chunk_count = 0
            async for chunk in generate_agent_response(chat_id, message):
                chunk_count += 1
                yield f"data: {json.dumps(chunk)}\n\n".encode("utf-8")
            yield f"data: {json.dumps({'type': 'stream_end', 'content': ''})}\n\n".encode("utf-8")
            logger.info(f"🎯 [GET] Stream completed: {chunk_count} chunks sent")
        except Exception as e:
            logger.error(f"❌ [GET] Stream error: {e}")
            error_chunk = {"type": "error", "content": str(e)}
            yield f"data: {json.dumps(error_chunk)}\n\n".encode("utf-8")

    return StreamingResponse(
        generate_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Transfer-Encoding": "chunked",
        },
    )

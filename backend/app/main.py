from fastapi import FastAPI
import logging
import sys
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routers import chat, stream, file, preview, metrics, components


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title="Doxii API", lifespan=lifespan)

# Basic logging configuration so app logs show up in console
logger = logging.getLogger()
if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        fmt="%(asctime)s %(levelname)s [%(name)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

from app.config import settings as _settings

logger.setLevel(getattr(logging, _settings.LOG_LEVEL.upper(), logging.INFO))

# Increase verbosity for our app modules
for name in [
    "app.services.chat_service",
    "app.routers.stream",
    "app.routers.chat",
]:
    logging.getLogger(name).setLevel(getattr(logging, _settings.LOG_LEVEL.upper(), logging.INFO))

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(stream.router)
app.include_router(file.router)
app.include_router(preview.router)
app.include_router(metrics.router)
app.include_router(components.router)
try:
    from app.routers import sse as sse_router

    app.include_router(sse_router.router)
except Exception as _:
    # Keep app running if SSE router import fails (e.g., partial deployments)
    pass
# WebSocket router removed - using Socket.IO instead
# devpreview router removed - using ESBuild integration instead


@app.get("/")
async def root():
    return {"message": "Doxii API is running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


from pydantic import BaseModel


class TestStreamRequest(BaseModel):
    message: str
    chat_id: str


@app.post("/test-stream/{chat_id}")
async def test_stream(chat_id: str, request: TestStreamRequest):
    from app.services.openai_service import openai_service
    from app.services.chat_service import chat_service
    from app.models.message import MessageType

    try:
        # Test the exact same flow as the streaming endpoint
        chat_data = await chat_service.get_chat_with_messages(chat_id)
        if not chat_data:
            return {"error": "Chat not found", "chat_id": chat_id}

        # Test message type comparison
        chat_history = []
        for msg in chat_data["messages"]:
            if msg.message_type == MessageType.TEXT:
                chat_history.append({"role": msg.role.value, "content": msg.content})

        return {
            "message": "Stream test passed",
            "chat": chat_data["chat"].title,
            "chat_id": chat_id,
            "message_count": len(chat_data["messages"]),
            "text_messages": len(chat_history),
            "request_message": request.message,
        }
    except Exception as e:
        import traceback

        return {"error": str(e), "traceback": traceback.format_exc()}


@app.post("/simple-stream/{chat_id}")
async def simple_stream(chat_id: str, request: TestStreamRequest):
    import json
    from fastapi.responses import StreamingResponse

    async def generate():
        yield f"data: {json.dumps({'type': 'text', 'content': 'Hello from simple stream!'})}\n\n"
        yield f"data: {json.dumps({'type': 'code', 'content': '<html><body>Simple HTML</body></html>'})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )

# Pure FastAPI app - Socket.IO removed, using SSE at /stream/ endpoints

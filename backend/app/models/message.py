from datetime import datetime
from typing import Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from .chat import PyObjectId


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"


class MessageType(str, Enum):
    TEXT = "text"
    CODE = "code"
    THINKING = "thinking"
    FILE_OPERATION = "file_operation"
    DESIGN_INSPIRATION = "design_inspiration"
    TOOL_CALL_START = "tool_call_start"
    TOOL_STATUS = "tool_status"
    TOOL_CALL_COMPLETE = "tool_call_complete"
    FILES_SUMMARY = "files_summary"


class Message(BaseModel):
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True, json_encoders={ObjectId: str})

    chat_id: ObjectId
    content: str
    role: MessageRole
    message_type: MessageType = MessageType.TEXT
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    # Ordering fields for natural conversation order preservation
    turn_id: Optional[PyObjectId] = None
    turn_index: Optional[int] = None
    event_index: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None


class MessageCreate(BaseModel):
    content: str
    role: MessageRole
    message_type: MessageType = MessageType.TEXT
    # Optional ordering context
    turn_id: Optional[PyObjectId] = None
    turn_index: Optional[int] = None
    event_index: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None


class MessageResponse(BaseModel):
    id: str
    chat_id: str
    content: str
    role: MessageRole
    message_type: MessageType
    timestamp: datetime
    turn_id: Optional[str] = None
    turn_index: Optional[int] = None
    event_index: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

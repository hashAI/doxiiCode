from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from .chat import PyObjectId

class File(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    chat_id: PyObjectId
    filename: str
    file_path: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FileCreate(BaseModel):
    filename: str
    content: str

class FileResponse(BaseModel):
    id: str
    chat_id: str
    filename: str
    file_path: str
    created_at: datetime
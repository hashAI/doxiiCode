from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field, ConfigDict
from pydantic_core import core_schema
from bson import ObjectId

class PyObjectId(ObjectId):

    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return cls(v)
        if isinstance(v, str):
            return cls(v)
        raise ValueError("Invalid ObjectId")

    @classmethod
    def __get_pydantic_json_schema__(cls, _source_type, _handler):
        return {'type': 'string'}

class Chat(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    file_count: int = Field(default=0)

class ChatCreate(BaseModel):
    title: str

class ChatResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    file_count: int

class ChatUpdate(BaseModel):
    title: Optional[str] = None

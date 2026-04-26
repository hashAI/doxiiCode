from fastapi import APIRouter, HTTPException
from typing import List

from app.models.chat import ChatCreate, ChatResponse, ChatUpdate
from app.models.message import MessageCreate, MessageResponse
from app.services.chat_service import chat_service

router = APIRouter(prefix="/chats", tags=["chats"])

@router.post("/", response_model=ChatResponse)
async def create_chat(chat_data: ChatCreate):
    # Create chat and database only - CSV generation happens on first message
    return await chat_service.create_chat(chat_data)

@router.get("/", response_model=List[ChatResponse])
async def get_chats():
    return await chat_service.get_chats()

@router.get("/{chat_id}")
async def get_chat(chat_id: str):
    chat_data = await chat_service.get_chat_with_messages(chat_id)
    if not chat_data:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat_data

@router.delete("/{chat_id}")
async def delete_chat(chat_id: str):
    success = await chat_service.delete_chat(chat_id)
    if not success:
        raise HTTPException(status_code=404, detail="Chat not found")
    return {"message": "Chat deleted successfully"}

@router.patch("/{chat_id}", response_model=ChatResponse)
async def update_chat(chat_id: str, chat_update: ChatUpdate):
    updated = await chat_service.update_chat(chat_id, chat_update)
    if updated is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    return updated

@router.post("/{chat_id}/messages", response_model=MessageResponse)
async def add_message(chat_id: str, message_data: MessageCreate):
    return await chat_service.add_message(chat_id, message_data)
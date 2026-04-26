import os
import uuid
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.models.file import File, FileCreate, FileResponse

class FileService:
    def __init__(self):
        self.chats_dir = "chats"

    async def create_file(self, chat_id: str, file_data: FileCreate) -> FileResponse:
        db = await get_database()
        
        # Ensure filename has .html extension
        filename = file_data.filename
        if not filename.endswith('.html'):
            filename += '.html'
        
        # Create unique filename if it already exists
        chat_folder = os.path.join(self.chats_dir, chat_id)
        file_path = os.path.join(chat_folder, filename)
        
        counter = 1
        original_name = filename.replace('.html', '')
        while os.path.exists(file_path):
            filename = f"{original_name}_{counter}.html"
            file_path = os.path.join(chat_folder, filename)
            counter += 1
        
        # Save file to filesystem
        os.makedirs(chat_folder, exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(file_data.content)
        
        # Save file metadata to database
        file_doc = File(
            chat_id=ObjectId(chat_id),
            filename=filename,
            file_path=file_path
        )
        
        result = await db.files.insert_one(file_doc.dict(by_alias=True))
        
        # Update chat file count
        await db.chats.update_one(
            {"_id": ObjectId(chat_id)},
            {
                "$inc": {"file_count": 1},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return FileResponse(
            id=str(result.inserted_id),
            chat_id=chat_id,
            filename=filename,
            file_path=file_path,
            created_at=file_doc.created_at
        )

    async def get_chat_files(self, chat_id: str) -> List[FileResponse]:
        db = await get_database()
        
        files = await db.files.find({"chat_id": ObjectId(chat_id)}).sort("created_at", 1).to_list(length=None)
        
        return [
            FileResponse(
                id=str(file["_id"]),
                chat_id=str(file["chat_id"]),
                filename=file["filename"],
                file_path=file["file_path"],
                created_at=file["created_at"]
            )
            for file in files
        ]

    async def get_file_content(self, file_id: str) -> Optional[dict]:
        db = await get_database()
        
        file_doc = await db.files.find_one({"_id": ObjectId(file_id)})
        if not file_doc:
            return None
        
        try:
            with open(file_doc["file_path"], 'r', encoding='utf-8') as f:
                content = f.read()
            
            return {
                "file": FileResponse(
                    id=str(file_doc["_id"]),
                    chat_id=str(file_doc["chat_id"]),
                    filename=file_doc["filename"],
                    file_path=file_doc["file_path"],
                    created_at=file_doc["created_at"]
                ),
                "content": content
            }
        except FileNotFoundError:
            return None

    async def update_file_content(self, file_id: str, content: str) -> bool:
        db = await get_database()
        
        file_doc = await db.files.find_one({"_id": ObjectId(file_id)})
        if not file_doc:
            return False
        
        try:
            with open(file_doc["file_path"], 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception:
            return False

    async def delete_file(self, file_id: str) -> bool:
        db = await get_database()
        
        file_doc = await db.files.find_one({"_id": ObjectId(file_id)})
        if not file_doc:
            return False
        
        # Remove file from filesystem
        if os.path.exists(file_doc["file_path"]):
            os.remove(file_doc["file_path"])
        
        # Remove from database
        await db.files.delete_one({"_id": ObjectId(file_id)})
        
        # Update chat file count
        await db.chats.update_one(
            {"_id": file_doc["chat_id"]},
            {
                "$inc": {"file_count": -1},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return True

file_service = FileService()
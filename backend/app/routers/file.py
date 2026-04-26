from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
import fnmatch

from app.models.file import FileCreate, FileResponse
from app.services.file_service import file_service
from app.services.chat_service import chat_service

router = APIRouter(prefix="/files", tags=["files"])


class FileUpdateRequest(BaseModel):
    content: str


class FileWriteByPathRequest(BaseModel):
    path: str
    content: str
    create_dirs: bool | None = True
    overwrite: bool | None = True


@router.post("/chats/{chat_id}", response_model=FileResponse)
async def create_file(chat_id: str, file_data: FileCreate):
    return await file_service.create_file(chat_id, file_data)


@router.get("/chats/{chat_id}", response_model=List[FileResponse])
async def get_chat_files(chat_id: str):
    return await file_service.get_chat_files(chat_id)


@router.get("/chats/{chat_id}/list")
async def list_chat_workspace_files(
    chat_id: str,
    include_globs: Optional[List[str]] = Query(None, description="Glob patterns to include"),
    exclude_globs: Optional[List[str]] = Query(None, description="Glob patterns to exclude"),
    max_results: int = Query(500, ge=1, le=10000),
):
    """List files under the chat workspace (filesystem) using the agent's safe listing utility."""
    try:
        # Use .gitignore-aware base list
        files = chat_service._get_gitignore_aware_file_list(chat_id, max_files=max_results)

        # Apply include globs if provided
        if include_globs:
            filtered: List[str] = []
            for f in files:
                if any(fnmatch.fnmatch(f, pattern) for pattern in include_globs):
                    filtered.append(f)
            files = filtered

        # Apply exclude globs if provided
        if exclude_globs:
            files = [f for f in files if not any(fnmatch.fnmatch(f, pattern) for pattern in exclude_globs)]

        truncated = len(files) >= max_results
        return {"files": files[:max_results], "truncated": truncated}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{file_id}")
async def get_file(file_id: str):
    file_data = await file_service.get_file_content(file_id)
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found")
    return file_data


@router.get("/chats/{chat_id}/content")
async def get_chat_file_content(
    chat_id: str,
    path: str = Query(..., description="Relative path under the chat root"),
    max_bytes: int = Query(500000),
):
    """Read a file from the chat's workspace using the same safeguards as the agent tools."""
    try:
        result = chat_service._read_file(chat_id, {"path": path, "max_bytes": max_bytes})
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))


@router.post("/chats/{chat_id}/write")
async def write_chat_file_content(chat_id: str, request: FileWriteByPathRequest):
    """Write a file under the chat workspace using the agent's safe write utility.
    Supports creating parent directories and overwriting by default.
    """
    try:
        result = chat_service._write_file(
            chat_id,
            {
                "path": request.path,
                "content": request.content,
                "create_dirs": bool(request.create_dirs if request.create_dirs is not None else True),
                "overwrite": bool(request.overwrite if request.overwrite is not None else True),
            },
        )
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        # Attach current modification time for client conflict handling
        try:
            import os

            rel_path = chat_service._normalize_rel_path(chat_id, request.path)
            chat_root = os.path.join(chat_service.chats_dir, chat_id)
            abs_path = chat_service._canonicalize(os.path.join(chat_root, rel_path))
            if os.path.exists(abs_path) and not os.path.isdir(abs_path):
                result["current_mtime"] = os.path.getmtime(abs_path)
        except Exception:
            pass
        return result
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/chats/{chat_id}/path")
async def delete_chat_file_by_path(
    chat_id: str, path: str = Query(..., description="Relative path under the chat root")
):
    """Delete a file by relative path under the chat workspace."""
    try:
        # Reuse logic from chat_service helpers
        import os

        rel = chat_service._normalize_rel_path(chat_id, path)
        root = os.path.join(chat_service.chats_dir, chat_id)
        abs_path = chat_service._canonicalize(os.path.join(root, rel))
        chat_service._ensure_within_chat_root_or_raise(chat_id, abs_path)
        if os.path.exists(abs_path) and not os.path.isdir(abs_path):
            os.remove(abs_path)
            return {"success": True}
        return {"success": False, "error": "File not found or is a directory"}
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{file_id}")
async def update_file(file_id: str, request: FileUpdateRequest):
    success = await file_service.update_file_content(file_id, request.content)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File updated successfully"}


@router.delete("/{file_id}")
async def delete_file(file_id: str):
    success = await file_service.delete_file(file_id)
    if not success:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted successfully"}

"""
File operation tools for DOXII agents.

These tools are converted from the existing backend/app/services/tools/file_tools.py
to work with the OpenAI Agents SDK.
"""

import os
import sys
import json
import shutil
import re
from pathlib import Path
from typing import Optional, List, Literal
from pydantic import BaseModel, ConfigDict
from agents import function_tool, RunContextWrapper
from ..context import DoxiiContext


def _canonicalize(path: str) -> str:
    """Canonicalize a path by resolving symlinks and expanding user home."""
    return os.path.realpath(os.path.expanduser(path))


def _is_within_chat_root(target: str, chat_root: str) -> bool:
    """Check if a target path is within the chat root directory."""
    root_c = _canonicalize(chat_root)
    target_c = _canonicalize(target)
    try:
        common = os.path.commonpath([root_c, target_c])
    except ValueError:
        return False
    return common == root_c


def _normalize_rel_path(chat_root: str, rel_path: str) -> str:
    """Normalize a relative path and ensure it stays within chat root."""
    chat_root = _canonicalize(chat_root)
    rel_path = rel_path.strip().lstrip("/\\")

    # If absolute path is passed, convert to rel if within chat root
    if os.path.isabs(rel_path):
        abs_path = _canonicalize(rel_path)
        if not _is_within_chat_root(abs_path, chat_root):
            raise PermissionError(f"Path outside chat root not allowed: {rel_path}")
        return os.path.relpath(abs_path, chat_root)

    # Collapse any .. or . segments
    normalized = os.path.normpath(rel_path)
    # Prevent escaping above root
    abs_candidate = _canonicalize(os.path.join(chat_root, normalized))
    if not _is_within_chat_root(abs_candidate, chat_root):
        raise PermissionError(f"Path outside chat root not allowed: {rel_path}")
    return os.path.relpath(abs_candidate, chat_root)


@function_tool
async def write_file(
    ctx: RunContextWrapper[DoxiiContext],
    path: str,
    content: str,
    create_dirs: bool = True,
    overwrite: bool = True
) -> str:
    """
    Write text content to a file under the chat directory.

    Args:
        path: Relative path within the chat directory
        content: Text content to write
        create_dirs: Create parent directories if needed
        overwrite: Allow overwriting existing files
    """
    chat_root = ctx.context.chat_root

    try:
        rel_path = _normalize_rel_path(chat_root, path)
        full_path = os.path.join(chat_root, rel_path)

        # Create directories if needed
        if create_dirs:
            dir_path = os.path.dirname(full_path)
            if dir_path:
                os.makedirs(dir_path, exist_ok=True)

        # Check overwrite
        if os.path.exists(full_path) and not overwrite:
            return json.dumps({"error": "File exists and overwrite=False"})

        # 📊 LOG COMPONENT WRITING (for monitoring)
        is_component_file = rel_path.startswith("components/") and rel_path.endswith(".js")
        is_base_component = "base-component.js" in rel_path.lower()

        if is_component_file and not is_base_component:
            # Check if this looks like a component (has class definition)
            if "class " in content and ("extends BaseComponent" in content or "extends LitElement" in content):
                print(f"\n{'='*80}", file=sys.stderr)
                print(f"📝 COMPONENT BEING WRITTEN", file=sys.stderr)
                print(f"   File: {rel_path}", file=sys.stderr)
                print(f"   ⚠️  Agent should have called get_component() first!", file=sys.stderr)
                print(f"   ⚠️  This should be a MODIFIED library component, not from scratch", file=sys.stderr)
                print(f"   ⚠️  Ensure: get_component() → extract result['code'] → modify → write_file()", file=sys.stderr)
                print(f"{'='*80}\n", file=sys.stderr)

        # Write file
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)

        # Update context file index
        ctx.context.update_file_index()

        return json.dumps({
            "path": rel_path,
            "bytes_written": len(content),
            "status": "success"
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


@function_tool
async def read_file(
    ctx: RunContextWrapper[DoxiiContext],
    path: str,
    max_bytes: int = 200000
) -> str:
    """
    Read a text file with size limit.

    Args:
        path: Relative path within the chat directory
        max_bytes: Maximum bytes to read
    """
    chat_root = ctx.context.chat_root

    try:
        rel_path = _normalize_rel_path(chat_root, path)
        full_path = os.path.join(chat_root, rel_path)

        if not os.path.exists(full_path):
            return json.dumps({"error": f"File not found: {rel_path}"})

        if os.path.isdir(full_path):
            return json.dumps({"error": f"Path is a directory: {rel_path}"})

        # Read file with size limit
        with open(full_path, 'rb') as f:
            data = f.read(max_bytes + 1)

        truncated = len(data) > max_bytes
        content = data[:max_bytes].decode('utf-8', errors='replace')

        return json.dumps({
            "path": rel_path,
            "content": content,
            "truncated": truncated
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


@function_tool
async def edit_file(
    ctx: RunContextWrapper[DoxiiContext],
    file_path: str,
    old_string: str,
    new_string: str,
    is_regex: bool = False,
    replace_all: bool = False,
    count: Optional[int] = None
) -> str:
    """
    Edit a file by replacing text (literal or regex) with safety checks.

    Supports both exact string replacement and regex patterns with comprehensive
    safety checks and flexibility options.

    Args:
        file_path: Relative path within the chat directory
        old_string: Text or regex pattern to find
        new_string: Replacement text
        is_regex: Whether old_string is a regex pattern
        replace_all: Replace all occurrences (overrides count)
        count: Maximum number of replacements when not replace_all (None = all)

    Returns:
        JSON with file path, replacement count, and status
    """
    chat_root = ctx.context.chat_root

    try:
        rel_path = _normalize_rel_path(chat_root, file_path)
        full_path = os.path.join(chat_root, rel_path)

        if not os.path.exists(full_path):
            return json.dumps({"error": f"File not found: {file_path}"})

        if os.path.isdir(full_path):
            return json.dumps({"error": f"Path is a directory: {file_path}"})

        # Read file
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Count occurrences
        if is_regex:
            occurrences = len(re.findall(old_string, content))
        else:
            occurrences = content.count(old_string)

        # Safety checks for non-regex replacements
        if not is_regex and occurrences > 1 and not replace_all and count != 1:
            if count is None or count > 1:
                return json.dumps({
                    "error": f"String appears {occurrences} times. Use replace_all=True, count=1, or provide more context to make it unique.",
                    "occurrences": occurrences
                })

        if occurrences == 0:
            return json.dumps({"error": "Pattern not found in file", "occurrences": 0})

        # Perform replacement
        if is_regex:
            if replace_all or count is None:
                new_content = re.sub(old_string, new_string, content)
                replacements = occurrences
            else:
                new_content = re.sub(old_string, new_string, content, count=count)
                replacements = min(count, occurrences)
        else:
            if replace_all:
                new_content = content.replace(old_string, new_string)
                replacements = occurrences
            elif count is None:
                new_content = content.replace(old_string, new_string)
                replacements = occurrences
            else:
                new_content = content.replace(old_string, new_string, count)
                replacements = min(count, occurrences)

        # Write back
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        # Update context file index
        ctx.context.update_file_index()

        return json.dumps({
            "file": rel_path,
            "replacements": replacements,
            "success": True
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


@function_tool
async def glob_files(
    ctx: RunContextWrapper[DoxiiContext],
    pattern: str,
    base_path: str = "."
) -> str:
    """
    Find files matching a glob pattern.

    Supports standard glob patterns:
    - * : matches any characters in filename
    - ** : matches any directories recursively
    - ? : matches single character
    - [seq] : matches any character in seq

    Examples:
        - "**/*.js" - All JS files recursively
        - "components/*.js" - JS files in components/ only
        - "pages/page-*.js" - Pages starting with page-

    Args:
        pattern: Glob pattern to match
        base_path: Base directory to search from (default ".")

    Returns:
        JSON string with list of matching file paths
    """
    chat_root = ctx.context.chat_root

    try:
        # Normalize base path
        if base_path != ".":
            base_norm = _normalize_rel_path(chat_root, base_path)
        else:
            base_norm = "."

        search_path = os.path.join(chat_root, base_norm) if base_norm != "." else chat_root

        if not os.path.exists(search_path):
            return json.dumps({"error": f"Base path not found: {base_path}"})

        # Use Path.glob for pattern matching
        matches = []
        for file_path in Path(search_path).glob(pattern):
            if file_path.is_file():
                rel_path = os.path.relpath(file_path, chat_root)
                matches.append(rel_path)

        # Sort for consistent output
        matches.sort()

        return json.dumps({
            "pattern": pattern,
            "base_path": base_norm,
            "matches": matches,
            "count": len(matches)
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


@function_tool
async def grep_files(
    ctx: RunContextWrapper[DoxiiContext],
    pattern: str,
    path: str = ".",
    file_pattern: Optional[str] = None,
    output_mode: Literal["files", "content", "count"] = "files"
) -> str:
    """
    Search for text pattern across files.

    Args:
        pattern: Text to search (literal, not regex)
        path: Directory to search in (default ".")
        file_pattern: Glob to filter files (e.g., "*.js")
        output_mode:
            - "files": List files containing matches
            - "content": Show matching lines with context
            - "count": Show match count per file

    Examples:
        - grep_files("import", file_pattern="*.js")
        - grep_files("TODO", output_mode="content")
        - grep_files("BaseComponent", path="components")

    Returns:
        JSON string with search results
    """
    chat_root = ctx.context.chat_root

    try:
        # Normalize search path
        if path != ".":
            path_norm = _normalize_rel_path(chat_root, path)
        else:
            path_norm = "."

        search_path = os.path.join(chat_root, path_norm) if path_norm != "." else chat_root

        if not os.path.exists(search_path):
            return json.dumps({"error": f"Path not found: {path}"})

        results = []

        # Get files to search
        if file_pattern:
            files = list(Path(search_path).glob(f"**/{file_pattern}"))
        else:
            files = list(Path(search_path).rglob("*"))

        # Search each file
        for file_path in files:
            if not file_path.is_file():
                continue

            # Skip binary and large files
            try:
                if file_path.stat().st_size > 1_000_000:  # Skip files > 1MB
                    continue

                content = file_path.read_text(encoding='utf-8')
            except (UnicodeDecodeError, PermissionError):
                # Skip binary files or files we can't read
                continue

            lines = content.split('\n')
            matches = []

            for i, line in enumerate(lines, 1):
                if pattern in line:
                    matches.append({
                        "line_number": i,
                        "line": line.strip()
                    })

            if matches:
                rel_path = os.path.relpath(file_path, chat_root)

                if output_mode == "files":
                    results.append(rel_path)
                elif output_mode == "content":
                    results.append({
                        "file": rel_path,
                        "matches": matches
                    })
                elif output_mode == "count":
                    results.append({
                        "file": rel_path,
                        "count": len(matches)
                    })

        return json.dumps({
            "pattern": pattern,
            "path": path_norm,
            "file_pattern": file_pattern,
            "output_mode": output_mode,
            "results": results,
            "results_count": len(results)
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


@function_tool
async def file_exists(
    ctx: RunContextWrapper[DoxiiContext],
    path: str
) -> str:
    """
    Check if file or directory exists.

    Args:
        path: Path to check

    Returns:
        JSON with exists (bool) and type (file/directory/none)
    """
    chat_root = ctx.context.chat_root

    try:
        rel_path = _normalize_rel_path(chat_root, path)
        abs_path = os.path.join(chat_root, rel_path)

        if not os.path.exists(abs_path):
            return json.dumps({"path": rel_path, "exists": False, "type": "none"})

        if os.path.isfile(abs_path):
            return json.dumps({"path": rel_path, "exists": True, "type": "file"})

        if os.path.isdir(abs_path):
            return json.dumps({"path": rel_path, "exists": True, "type": "directory"})

        return json.dumps({"path": rel_path, "exists": True, "type": "unknown"})
    except Exception as e:
        return json.dumps({"error": str(e)})




@function_tool
async def delete_file(
    ctx: RunContextWrapper[DoxiiContext],
    path: str,
    recursive: bool = False
) -> str:
    """
    Delete a file or directory within the chat directory.

    Args:
        path: Relative path within the chat directory
        recursive: Allow recursive deletion of directories
    """
    chat_root = ctx.context.chat_root

    try:
        rel_path = _normalize_rel_path(chat_root, path)
        full_path = os.path.join(chat_root, rel_path)

        if not os.path.exists(full_path):
            return json.dumps({"error": f"Path not found: {rel_path}"})

        if os.path.isdir(full_path):
            if not recursive:
                return json.dumps({"error": "Path is a directory. Use recursive=True to delete"})
            shutil.rmtree(full_path)
            deleted_type = "directory"
        else:
            os.remove(full_path)
            deleted_type = "file"

        # Update context file index
        ctx.context.update_file_index()

        return json.dumps({
            "path": rel_path,
            "deleted": deleted_type,
            "status": "success"
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


@function_tool
async def create_directory(
    ctx: RunContextWrapper[DoxiiContext],
    path: str,
    recursive: bool = True
) -> str:
    """
    Create a directory within the chat directory.

    Args:
        path: Relative path within the chat directory
        recursive: Create parent directories if needed
    """
    chat_root = ctx.context.chat_root

    try:
        rel_path = _normalize_rel_path(chat_root, path)
        full_path = os.path.join(chat_root, rel_path)

        if os.path.exists(full_path):
            if os.path.isdir(full_path):
                return json.dumps({"path": rel_path, "status": "already_exists"})
            else:
                return json.dumps({"error": "Path exists but is a file"})

        os.makedirs(full_path, exist_ok=recursive)

        return json.dumps({
            "path": rel_path,
            "status": "created"
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


@function_tool
async def copy_file(
    ctx: RunContextWrapper[DoxiiContext],
    source: str,
    destination: str
) -> str:
    """
    Copy a file or directory within the chat directory.

    Args:
        source: Source relative path
        destination: Destination relative path
    """
    chat_root = ctx.context.chat_root

    try:
        src_rel = _normalize_rel_path(chat_root, source)
        dst_rel = _normalize_rel_path(chat_root, destination)

        src_full = os.path.join(chat_root, src_rel)
        dst_full = os.path.join(chat_root, dst_rel)

        if not os.path.exists(src_full):
            return json.dumps({"error": f"Source not found: {src_rel}"})

        if os.path.isdir(src_full):
            shutil.copytree(src_full, dst_full)
        else:
            # Create destination directory if needed
            dst_dir = os.path.dirname(dst_full)
            if dst_dir:
                os.makedirs(dst_dir, exist_ok=True)
            shutil.copy2(src_full, dst_full)

        # Update context file index
        ctx.context.update_file_index()

        return json.dumps({
            "source": src_rel,
            "destination": dst_rel,
            "status": "copied"
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


@function_tool
async def move_file(
    ctx: RunContextWrapper[DoxiiContext],
    source: str,
    destination: str
) -> str:
    """
    Move or rename a file or directory within the chat directory.

    Args:
        source: Source relative path
        destination: Destination relative path
    """
    chat_root = ctx.context.chat_root

    try:
        src_rel = _normalize_rel_path(chat_root, source)
        dst_rel = _normalize_rel_path(chat_root, destination)

        src_full = os.path.join(chat_root, src_rel)
        dst_full = os.path.join(chat_root, dst_rel)

        if not os.path.exists(src_full):
            return json.dumps({"error": f"Source not found: {src_rel}"})

        # Create destination directory if needed
        dst_dir = os.path.dirname(dst_full)
        if dst_dir:
            os.makedirs(dst_dir, exist_ok=True)

        shutil.move(src_full, dst_full)

        # Update context file index
        ctx.context.update_file_index()

        return json.dumps({
            "source": src_rel,
            "destination": dst_rel,
            "status": "moved"
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


@function_tool
async def list_directory_tree(
    ctx: RunContextWrapper[DoxiiContext],
    path: str = ".",
    max_depth: int = 3
) -> str:
    """
    Show directory tree structure.
    
    Args:
        path: Path to list (default "." for root)
        max_depth: Maximum depth to traverse (default 3)
    
    Returns:
        JSON string with tree structure
    """
    chat_root = ctx.context.chat_root
    
    try:
        if path != ".":
            path_norm = _normalize_rel_path(chat_root, path)
        else:
            path_norm = "."
        
        abs_path = os.path.join(chat_root, path_norm) if path_norm != "." else chat_root
        
        if not os.path.exists(abs_path):
            return json.dumps({"error": f"Path not found: {path}"})
        
        def build_tree(current_path: str, current_depth: int = 0) -> dict:
            if current_depth >= max_depth:
                return {"name": os.path.basename(current_path), "type": "truncated"}
            
            name = os.path.basename(current_path) or current_path
            if os.path.isfile(current_path):
                return {"name": name, "type": "file"}
            
            children = []
            try:
                for item in sorted(os.listdir(current_path)):
                    if item.startswith('.'):
                        continue
                    item_path = os.path.join(current_path, item)
                    children.append(build_tree(item_path, current_depth + 1))
            except PermissionError:
                pass
            
            return {"name": name, "type": "directory", "children": children}
        
        tree = build_tree(abs_path)
        return json.dumps({
            "path": path_norm,
            "tree": tree,
            "max_depth": max_depth
        })
    except Exception as e:
        return json.dumps({"error": str(e)})


# ============================================================================
# BULK FILE OPERATIONS
# ============================================================================

class FileWrite(BaseModel):
    """Single file write operation."""
    model_config = ConfigDict(extra='forbid')

    path: str
    content: str
    create_dirs: bool = True
    overwrite: bool = True


class FileRead(BaseModel):
    """Single file read operation."""
    model_config = ConfigDict(extra='forbid')

    path: str
    max_bytes: int = 200000


class FileDelete(BaseModel):
    """Single file delete operation."""
    model_config = ConfigDict(extra='forbid')

    path: str


@function_tool
async def bulk_write_files(
    ctx: RunContextWrapper[DoxiiContext],
    files: List[FileWrite]
) -> str:
    """
    Write multiple files in a single operation.

    PERFORMANCE: Always use this for writing multiple files. Reduces tool calls significantly.

    USAGE EXAMPLES:
        # Single file (still use list format)
        bulk_write_files(ctx, [
            {"path": "app.js", "content": "// content here"}
        ])

        # Multiple files (RECOMMENDED)
        bulk_write_files(ctx, [
            {"path": "components/header.js", "content": "..."},
            {"path": "components/footer.js", "content": "..."},
            {"path": "pages/home.js", "content": "..."}
        ])

    Args:
        files: List of FileWrite objects with path and content

    Returns:
        JSON with results for each file and summary
    """
    chat_root = ctx.context.chat_root
    results = []
    success_count = 0
    error_count = 0

    for file_op in files:
        try:
            rel_path = _normalize_rel_path(chat_root, file_op.path)
            full_path = os.path.join(chat_root, rel_path)

            # 📊 LOG COMPONENT WRITING (for monitoring)
            is_component_file = rel_path.startswith("components/") and rel_path.endswith(".js")
            is_base_component = "base-component.js" in rel_path.lower()

            if is_component_file and not is_base_component:
                if "class " in file_op.content and ("extends BaseComponent" in file_op.content or "extends LitElement" in file_op.content):
                    print(f"\n📝 COMPONENT WRITTEN (bulk): {rel_path}", file=sys.stderr)
                    print(f"   ⚠️  Should be modified library component, not from scratch", file=sys.stderr)

            # Create directories if needed
            if file_op.create_dirs:
                dir_path = os.path.dirname(full_path)
                if dir_path:
                    os.makedirs(dir_path, exist_ok=True)

            # Check overwrite
            if os.path.exists(full_path) and not file_op.overwrite:
                results.append({
                    "path": rel_path,
                    "status": "error",
                    "error": "File exists and overwrite=False"
                })
                error_count += 1
                continue

            # Write file
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(file_op.content)

            results.append({
                "path": rel_path,
                "status": "success",
                "bytes_written": len(file_op.content)
            })
            success_count += 1

        except Exception as e:
            results.append({
                "path": file_op.path,
                "status": "error",
                "error": str(e)
            })
            error_count += 1

    # Update context file index once at the end
    ctx.context.update_file_index()

    return json.dumps({
        "success": error_count == 0,
        "total": len(files),
        "success_count": success_count,
        "error_count": error_count,
        "results": results
    })


@function_tool
async def bulk_read_files(
    ctx: RunContextWrapper[DoxiiContext],
    files: List[FileRead]
) -> str:
    """
    Read multiple files in a single operation.

    PERFORMANCE: Always use this for reading multiple files. Reduces tool calls significantly.

    USAGE EXAMPLES:
        # Single file (still use list format)
        bulk_read_files(ctx, [
            {"path": "app.js"}
        ])

        # Multiple files (RECOMMENDED)
        bulk_read_files(ctx, [
            {"path": "components/header.js"},
            {"path": "components/footer.js"},
            {"path": "assets/state.js", "max_bytes": 50000}
        ])

    Args:
        files: List of FileRead objects with path and optional max_bytes

    Returns:
        JSON with content for each file and summary
    """
    chat_root = ctx.context.chat_root
    results = []
    success_count = 0
    error_count = 0

    for file_op in files:
        try:
            rel_path = _normalize_rel_path(chat_root, file_op.path)
            full_path = os.path.join(chat_root, rel_path)

            if not os.path.exists(full_path):
                results.append({
                    "path": rel_path,
                    "status": "error",
                    "error": f"File not found"
                })
                error_count += 1
                continue

            if os.path.isdir(full_path):
                results.append({
                    "path": rel_path,
                    "status": "error",
                    "error": "Path is a directory"
                })
                error_count += 1
                continue

            # Read file with size limit
            with open(full_path, 'rb') as f:
                data = f.read(file_op.max_bytes + 1)

            truncated = len(data) > file_op.max_bytes
            content = data[:file_op.max_bytes].decode('utf-8', errors='replace')

            results.append({
                "path": rel_path,
                "status": "success",
                "content": content,
                "truncated": truncated
            })
            success_count += 1

        except Exception as e:
            results.append({
                "path": file_op.path,
                "status": "error",
                "error": str(e)
            })
            error_count += 1

    return json.dumps({
        "success": error_count == 0,
        "total": len(files),
        "success_count": success_count,
        "error_count": error_count,
        "results": results
    })


@function_tool
async def bulk_delete_files(
    ctx: RunContextWrapper[DoxiiContext],
    files: List[FileDelete]
) -> str:
    """
    Delete multiple files in a single operation.

    PERFORMANCE: Always use this for deleting multiple files. Reduces tool calls significantly.

    USAGE EXAMPLES:
        # Single file (still use list format)
        bulk_delete_files(ctx, [
            {"path": "temp.js"}
        ])

        # Multiple files (RECOMMENDED)
        bulk_delete_files(ctx, [
            {"path": "temp1.js"},
            {"path": "temp2.js"},
            {"path": "old/deprecated.js"}
        ])

    Args:
        files: List of FileDelete objects with path

    Returns:
        JSON with results for each file and summary
    """
    chat_root = ctx.context.chat_root
    results = []
    success_count = 0
    error_count = 0

    for file_op in files:
        try:
            rel_path = _normalize_rel_path(chat_root, file_op.path)
            full_path = os.path.join(chat_root, rel_path)

            if not os.path.exists(full_path):
                results.append({
                    "path": rel_path,
                    "status": "error",
                    "error": "File not found"
                })
                error_count += 1
                continue

            if os.path.isdir(full_path):
                results.append({
                    "path": rel_path,
                    "status": "error",
                    "error": "Path is a directory (use delete_directory instead)"
                })
                error_count += 1
                continue

            # Delete file
            os.remove(full_path)

            results.append({
                "path": rel_path,
                "status": "success"
            })
            success_count += 1

        except Exception as e:
            results.append({
                "path": file_op.path,
                "status": "error",
                "error": str(e)
            })
            error_count += 1

    # Update context file index once at the end
    ctx.context.update_file_index()

    return json.dumps({
        "success": error_count == 0,
        "total": len(files),
        "success_count": success_count,
        "error_count": error_count,
        "results": results
    })


class FileReplacement(BaseModel):
    """Model for file replacement operation."""
    model_config = ConfigDict(extra='forbid')

    path: str  # Relative path to file
    old_string: str  # String to find
    new_string: str  # String to replace with
    replace_all: bool = True  # Replace all occurrences (default true)


@function_tool
async def batch_find_replace(
    ctx: RunContextWrapper[DoxiiContext],
    replacements: List[FileReplacement]
) -> str:
    """
    Find and replace strings across multiple files in a single operation.

    This is like running grep + sed across multiple files at once. Use this
    when you need to fix the same issue across many files (e.g., fixing import
    paths, renaming variables, adding ESLint comments).

    PERFORMANCE: Much faster than editing files one by one. Reduces tool calls.

    USAGE EXAMPLES:
        # Fix import paths in all components
        batch_find_replace(ctx, [
            {
                "path": "components/header.js",
                "old_string": "from '../base-component.js'",
                "new_string": "from './base-component.js'",
                "replace_all": True
            },
            {
                "path": "components/footer.js",
                "old_string": "from '../base-component.js'",
                "new_string": "from './base-component.js'",
                "replace_all": True
            }
        ])

        # Add ESLint comments to multiple files
        batch_find_replace(ctx, [
            {
                "path": "components/hero.js",
                "old_string": "import { BaseComponent",
                "new_string": "/* eslint-disable import/no-unresolved */\\n/* global customElements */\\nimport { BaseComponent",
                "replace_all": False  # Only replace first occurrence
            },
            {
                "path": "components/product-card.js",
                "old_string": "import { BaseComponent",
                "new_string": "/* eslint-disable import/no-unresolved */\\n/* global customElements */\\nimport { BaseComponent",
                "replace_all": False
            }
        ])

    Args:
        replacements: List of FileReplacement objects with path, old_string, new_string, replace_all

    Returns:
        JSON with results for each file:
        {
            "success": bool,
            "total": int,
            "success_count": int,
            "error_count": int,
            "results": [
                {
                    "path": str,
                    "status": "success" | "error" | "no_match",
                    "replacements": int,  // Number of replacements made
                    "error": str  // Only if status is error
                }
            ]
        }
    """
    chat_root = ctx.context.chat_root
    results = []
    success_count = 0
    error_count = 0

    for replacement in replacements:
        try:
            rel_path = _normalize_rel_path(chat_root, replacement.path)
            full_path = os.path.join(chat_root, rel_path)

            # Check file exists
            if not os.path.exists(full_path):
                results.append({
                    "path": rel_path,
                    "status": "error",
                    "error": "File not found"
                })
                error_count += 1
                continue

            if not os.path.isfile(full_path):
                results.append({
                    "path": rel_path,
                    "status": "error",
                    "error": "Path is not a file"
                })
                error_count += 1
                continue

            # Read file content
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if old_string exists
            if replacement.old_string not in content:
                results.append({
                    "path": rel_path,
                    "status": "no_match",
                    "replacements": 0,
                    "error": f"String not found in file: '{replacement.old_string[:50]}...'"
                })
                error_count += 1
                continue

            # Perform replacement
            if replacement.replace_all:
                new_content = content.replace(replacement.old_string, replacement.new_string)
                num_replacements = content.count(replacement.old_string)
            else:
                # Replace only first occurrence
                new_content = content.replace(replacement.old_string, replacement.new_string, 1)
                num_replacements = 1

            # Write updated content
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            results.append({
                "path": rel_path,
                "status": "success",
                "replacements": num_replacements
            })
            success_count += 1

        except Exception as e:
            results.append({
                "path": replacement.path,
                "status": "error",
                "error": str(e)
            })
            error_count += 1

    # Update context file index
    ctx.context.update_file_index()

    return json.dumps({
        "success": error_count == 0,
        "total": len(replacements),
        "success_count": success_count,
        "error_count": error_count,
        "results": results
    })


# Export list of all file tools
FILE_TOOLS = [
    write_file,
    read_file,
    edit_file,
    delete_file,
    create_directory,
    copy_file,
    move_file,
    list_directory_tree,
    glob_files,
    grep_files,
    bulk_write_files,
    bulk_read_files,
    bulk_delete_files,
    batch_find_replace
]

# Bulk-only tools for performance-optimized agents (e.g., Architect V2)
# Forces batch operations and prevents inefficient sequential file operations
FILE_TOOLS_BULK_ONLY = [
    # Bulk operations (primary tools)
    bulk_write_files,
    bulk_read_files,
    bulk_delete_files,
    batch_find_replace,
    # Utility tools (still needed for discovery)
    list_directory_tree,
    glob_files,
    grep_files,
    create_directory,
    copy_file,
    move_file,
    # Note: Individual write_file/read_file/edit_file are NOT included
    # Agent must use bulk operations for efficiency
]

"""
File operation tools for the chat service.
"""

import os
import shutil
import re
import fnmatch
from typing import Dict, Any, List, Optional, Tuple, Iterable
import logging

logger = logging.getLogger(__name__)


class FileTools:
    """File operation tools implementation."""

    def __init__(self, chats_dir: str, default_max_bytes: int = 200_000, default_max_results: int = 500):
        self.chats_dir = chats_dir
        self.default_max_bytes = default_max_bytes
        self.default_max_results = default_max_results

    def _canonicalize(self, path: str) -> str:
        """Canonicalize a file path."""
        return os.path.realpath(os.path.expanduser(path))

    def _is_path_within_chat_root(self, chat_id: str, target: str) -> bool:
        """Check if path is within chat root directory."""
        chat_root = os.path.join(self.chats_dir, chat_id)
        root_c = self._canonicalize(chat_root)
        target_c = self._canonicalize(target)
        try:
            common = os.path.commonpath([root_c, target_c])
        except ValueError:
            return False
        return common == root_c

    def _ensure_within_chat_root_or_raise(self, chat_id: str, target: str) -> None:
        """Ensure path is within chat root or raise PermissionError."""
        if not self._is_path_within_chat_root(chat_id, target):
            raise PermissionError(f"Path outside chat root not allowed: {target}")

    def _normalize_rel_path(self, chat_id: str, rel_path: str) -> str:
        """Normalize a provided path to be strictly relative to this chat's root."""
        chat_root = self._canonicalize(os.path.join(self.chats_dir, chat_id))
        rel_path = rel_path.strip().lstrip("/\\\\")

        # Strip accidental 'chats/{chat_id}/' prefix
        accidental_prefix = os.path.join(self.chats_dir, chat_id) + os.sep
        if rel_path.startswith(accidental_prefix):
            rel_path = rel_path[len(accidental_prefix) :]

        # If absolute path is passed, convert to rel if within chat root
        if os.path.isabs(rel_path):
            abs_path = self._canonicalize(rel_path)
            if not self._is_path_within_chat_root(chat_id, abs_path):
                raise PermissionError(f"Path outside chat root not allowed: {rel_path}")
            return os.path.relpath(abs_path, chat_root)

        # Collapse any .. or . segments
        normalized = os.path.normpath(rel_path)
        # Prevent escaping above root
        abs_candidate = self._canonicalize(os.path.join(chat_root, normalized))
        self._ensure_within_chat_root_or_raise(chat_id, abs_candidate)
        return os.path.relpath(abs_candidate, chat_root)

    def _read_text_safely(self, path: str, max_bytes: int) -> Tuple[str, bool]:
        """Read text file safely with size limit."""
        with open(path, "rb") as f:
            data = f.read(max_bytes + 1)
        truncated = len(data) > max_bytes
        return data[:max_bytes].decode("utf-8", errors="replace"), truncated

    def _write_text_safely(self, path: str, content: str, create_dirs: bool, overwrite: bool) -> None:
        """Write text file safely with directory creation."""
        dirpath = os.path.dirname(path)
        if dirpath and create_dirs and not os.path.exists(dirpath):
            os.makedirs(dirpath, exist_ok=True)
        if os.path.exists(path) and not overwrite:
            raise FileExistsError(f"File exists and overwrite=False: {path}")
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

    def _iter_files(
        self, root: str, include_globs: Optional[List[str]], exclude_globs: Optional[List[str]]
    ) -> Iterable[str]:
        """Iterate over files matching glob patterns."""
        include_globs = include_globs or ["**/*"]
        exclude_globs = exclude_globs or []
        root_c = self._canonicalize(root)
        for dirpath, dirnames, filenames in os.walk(root_c):
            # Apply dir exclude globs by modifying dirnames in-place
            pruned: List[str] = []
            for d in list(dirnames):
                full_d = os.path.join(dirpath, d)
                rel_d = os.path.relpath(full_d, root_c)
                if any(fnmatch.fnmatch(rel_d, g) for g in exclude_globs):
                    pruned.append(d)
            for d in pruned:
                dirnames.remove(d)

            for fname in filenames:
                fpath = os.path.join(dirpath, fname)
                rel = os.path.relpath(fpath, root_c)
                if not any(fnmatch.fnmatch(rel, g) for g in include_globs):
                    continue
                if any(fnmatch.fnmatch(rel, g) for g in exclude_globs):
                    continue
                yield fpath

    def _apply_regex_or_literal_replace(
        self, text: str, find: str, replace: str, is_regex: bool, count: Optional[int]
    ) -> Tuple[str, int]:
        """Apply regex or literal text replacement."""
        if is_regex:
            pattern = re.compile(find, flags=re.MULTILINE | re.DOTALL)
            new_text, num = pattern.subn(replace, text, 0 if count is None else count)
            return new_text, num
        else:
            num_replacements = 0
            if count is None:
                num_replacements = text.count(find)
                return text.replace(find, replace), num_replacements
            else:
                parts = text.split(find)
                if len(parts) == 1:
                    return text, 0
                head = parts[0]
                tail_parts = parts[1:]
                consumed = 0
                out = [head]
                for seg in tail_parts:
                    if consumed < count:
                        out.append(replace)
                        num_replacements += 1
                        consumed += 1
                    else:
                        out.append(find)
                    out.append(seg)
                return "".join(out), num_replacements

    def list_files(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """List files under the chat directory, honoring include/exclude globs."""
        chat_root = os.path.join(self.chats_dir, chat_id)
        include_globs = args.get("include_globs") or None
        if include_globs:
            if any("/" in g for g in include_globs) and "*" not in include_globs:
                include_globs = list(include_globs) + ["*"]
        exclude_globs = args.get("exclude_globs") or None
        max_results = int(args.get("max_results") or self.default_max_results)

        results: List[str] = []
        for path in self._iter_files(chat_root, include_globs, exclude_globs):
            rel = os.path.relpath(path, chat_root)
            results.append(rel)
            if len(results) >= max_results:
                break

        return {"files": results, "truncated": len(results) >= max_results}

    def read_file(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Read a text file with size limit and return content and truncation flag."""
        rel_path = self._normalize_rel_path(chat_id, args["path"])
        max_bytes = int(args.get("max_bytes") or self.default_max_bytes)
        chat_root = os.path.join(self.chats_dir, chat_id)
        abs_path = self._canonicalize(os.path.join(chat_root, rel_path))
        self._ensure_within_chat_root_or_raise(chat_id, abs_path)

        logger.info("read_file: %s (max_bytes=%s) for chat %s", rel_path, max_bytes, chat_id)

        if not os.path.exists(abs_path):
            return {"error": f"File not found: {rel_path}"}
        if os.path.isdir(abs_path):
            return {"error": f"Path is a directory: {rel_path}"}

        text, truncated = self._read_text_safely(abs_path, max_bytes)
        return {"path": rel_path, "content": text, "truncated": truncated}

    def write_file(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Write (or overwrite) a text file. Creates parent dirs if requested."""
        rel_path = self._normalize_rel_path(chat_id, args["path"])
        content = args["content"]
        create_dirs = bool(args.get("create_dirs", True))
        overwrite = bool(args.get("overwrite", True))

        chat_root = os.path.join(self.chats_dir, chat_id)
        abs_path = self._canonicalize(os.path.join(chat_root, rel_path))
        self._ensure_within_chat_root_or_raise(chat_id, abs_path)

        logger.info("write_file: %s (bytes=%d overwrite=%s) for chat %s", rel_path, len(content), overwrite, chat_id)

        try:
            self._write_text_safely(abs_path, content, create_dirs=create_dirs, overwrite=overwrite)
        except Exception as e:
            return {"error": str(e)}

        safe_rel_path = os.path.relpath(abs_path, chat_root)
        return {"path": safe_rel_path, "bytes_written": len(content)}

    def modify_file(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Apply either literal or regex-based replacements to a file's content."""
        rel_path = self._normalize_rel_path(chat_id, args["path"])
        find = args["find"]
        replace = args["replace"]
        is_regex = bool(args.get("is_regex", False))
        count = args.get("count")
        if count is not None:
            count = int(count)

        chat_root = os.path.join(self.chats_dir, chat_id)
        abs_path = self._canonicalize(os.path.join(chat_root, rel_path))
        self._ensure_within_chat_root_or_raise(chat_id, abs_path)

        logger.info("modify_file: %s (is_regex=%s count=%s) for chat %s", rel_path, is_regex, count, chat_id)

        if not os.path.exists(abs_path):
            return {"error": f"File not found: {rel_path}"}

        try:
            with open(abs_path, "r", encoding="utf-8", errors="replace") as f:
                text = f.read()

            new_text, num = self._apply_regex_or_literal_replace(text, find, replace, is_regex, count)

            with open(abs_path, "w", encoding="utf-8") as f:
                f.write(new_text)
        except Exception as e:
            return {"error": str(e)}

        return {"path": rel_path, "replacements": num}

    def delete_file(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Delete a file or directory within the chat directory."""
        rel_path = self._normalize_rel_path(chat_id, args["path"])
        recursive = bool(args.get("recursive", False))

        chat_root = os.path.join(self.chats_dir, chat_id)
        abs_path = self._canonicalize(os.path.join(chat_root, rel_path))
        self._ensure_within_chat_root_or_raise(chat_id, abs_path)

        logger.info("delete_file: %s (recursive=%s) for chat %s", rel_path, recursive, chat_id)

        if not os.path.exists(abs_path):
            return {"error": f"Path not found: {rel_path}"}

        try:
            if os.path.isdir(abs_path):
                if recursive:
                    shutil.rmtree(abs_path)
                    return {"path": rel_path, "deleted": "directory", "recursive": True}
                else:
                    os.rmdir(abs_path)
                    return {"path": rel_path, "deleted": "directory", "recursive": False}
            else:
                os.unlink(abs_path)
                return {"path": rel_path, "deleted": "file"}
        except Exception as e:
            return {"error": str(e)}

    def copy_file(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Copy a file or directory within the chat directory."""
        source_rel = self._normalize_rel_path(chat_id, args["source"])
        dest_rel = self._normalize_rel_path(chat_id, args["destination"])

        chat_root = os.path.join(self.chats_dir, chat_id)
        source_abs = self._canonicalize(os.path.join(chat_root, source_rel))
        dest_abs = self._canonicalize(os.path.join(chat_root, dest_rel))

        self._ensure_within_chat_root_or_raise(chat_id, source_abs)
        self._ensure_within_chat_root_or_raise(chat_id, dest_abs)

        logger.info("copy_file: %s -> %s for chat %s", source_rel, dest_rel, chat_id)

        if not os.path.exists(source_abs):
            return {"error": f"Source not found: {source_rel}"}

        try:
            if os.path.isdir(source_abs):
                shutil.copytree(source_abs, dest_abs, dirs_exist_ok=True)
                return {"source": source_rel, "destination": dest_rel, "type": "directory"}
            else:
                # Ensure destination directory exists
                dest_dir = os.path.dirname(dest_abs)
                if dest_dir and not os.path.exists(dest_dir):
                    os.makedirs(dest_dir, exist_ok=True)
                shutil.copy2(source_abs, dest_abs)
                return {"source": source_rel, "destination": dest_rel, "type": "file"}
        except Exception as e:
            return {"error": str(e)}

    def move_file(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Move or rename a file or directory within the chat directory."""
        source_rel = self._normalize_rel_path(chat_id, args["source"])
        dest_rel = self._normalize_rel_path(chat_id, args["destination"])

        chat_root = os.path.join(self.chats_dir, chat_id)
        source_abs = self._canonicalize(os.path.join(chat_root, source_rel))
        dest_abs = self._canonicalize(os.path.join(chat_root, dest_rel))

        self._ensure_within_chat_root_or_raise(chat_id, source_abs)
        self._ensure_within_chat_root_or_raise(chat_id, dest_abs)

        logger.info("move_file: %s -> %s for chat %s", source_rel, dest_rel, chat_id)

        if not os.path.exists(source_abs):
            return {"error": f"Source not found: {source_rel}"}

        try:
            # Ensure destination directory exists
            dest_dir = os.path.dirname(dest_abs)
            if dest_dir and not os.path.exists(dest_dir):
                os.makedirs(dest_dir, exist_ok=True)

            shutil.move(source_abs, dest_abs)
            file_type = "directory" if os.path.isdir(dest_abs) else "file"
            return {"source": source_rel, "destination": dest_rel, "type": file_type}
        except Exception as e:
            return {"error": str(e)}

    def create_directory(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Create a directory within the chat directory."""
        rel_path = self._normalize_rel_path(chat_id, args["path"])
        recursive = bool(args.get("recursive", True))

        chat_root = os.path.join(self.chats_dir, chat_id)
        abs_path = self._canonicalize(os.path.join(chat_root, rel_path))
        self._ensure_within_chat_root_or_raise(chat_id, abs_path)

        logger.info("create_directory: %s (recursive=%s) for chat %s", rel_path, recursive, chat_id)

        try:
            if recursive:
                os.makedirs(abs_path, exist_ok=True)
            else:
                os.mkdir(abs_path)
            return {"path": rel_path, "created": True, "recursive": recursive}
        except Exception as e:
            return {"error": str(e)}

    def list_directory_tree(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Show directory tree structure."""
        rel_path = args.get("path", ".")
        if rel_path != ".":
            rel_path = self._normalize_rel_path(chat_id, rel_path)
        max_depth = int(args.get("max_depth", 3))

        chat_root = os.path.join(self.chats_dir, chat_id)
        abs_path = self._canonicalize(os.path.join(chat_root, rel_path))
        self._ensure_within_chat_root_or_raise(chat_id, abs_path)

        if not os.path.exists(abs_path):
            return {"error": f"Path not found: {rel_path}"}

        def build_tree(path: str, current_depth: int = 0) -> Dict[str, Any]:
            if current_depth >= max_depth:
                return {"name": os.path.basename(path), "type": "truncated"}

            name = os.path.basename(path) or path
            if os.path.isfile(path):
                return {"name": name, "type": "file"}

            children = []
            try:
                for item in sorted(os.listdir(path)):
                    if item.startswith('.'):
                        continue
                    item_path = os.path.join(path, item)
                    children.append(build_tree(item_path, current_depth + 1))
            except PermissionError:
                pass

            return {"name": name, "type": "directory", "children": children}

        tree = build_tree(abs_path)
        return {"path": rel_path, "tree": tree, "max_depth": max_depth}
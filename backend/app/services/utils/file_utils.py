"""
File utility functions for the chat service.
"""

import os
import fnmatch
from typing import List


class FileUtils:
    """Utility functions for file operations."""

    @staticmethod
    def get_gitignore_aware_file_list(chat_root: str, max_files: int = 100) -> List[str]:
        """Get a list of files respecting .gitignore patterns and common exclusions."""
        if not os.path.exists(chat_root):
            return []

        # Common patterns to exclude (like .gitignore)
        exclude_patterns = [
            "node_modules",
            "dist",
            "build",
            ".git",
            ".DS_Store",
            "*.log",
            "*.lock",
            "coverage",
            ".env*",
            "*.tmp",
            "*.temp",
        ]

        # Try to read .gitignore if it exists
        gitignore_path = os.path.join(chat_root, ".gitignore")
        if os.path.exists(gitignore_path):
            try:
                with open(gitignore_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#"):
                            exclude_patterns.append(line)
            except Exception:
                pass  # Continue with default patterns

        files = []
        try:
            for root, dirs, files_in_dir in os.walk(chat_root):
                # Remove excluded directories from dirs list to prevent walking into them
                dirs[:] = [
                    d
                    for d in dirs
                    if not d.startswith(".")
                    and not any(
                        pattern in os.path.join(root, d) or pattern == d or pattern == os.path.basename(d)
                        for pattern in exclude_patterns
                    )
                ]

                for file in files_in_dir:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, chat_root)

                    # Exclude hidden files or any path segment starting with '.'
                    if file.startswith(".") or any(seg.startswith(".") for seg in rel_path.split(os.sep)):
                        continue

                    # Check if file should be excluded by patterns
                    if any(
                        pattern in rel_path
                        or pattern == file
                        or (pattern.startswith("*") and rel_path.endswith(pattern[1:]))
                        for pattern in exclude_patterns
                    ):
                        continue

                    files.append(rel_path)
                    if len(files) >= max_files:
                        return files
        except Exception:
            pass  # Return what we have so far

        return files[:max_files]

    @staticmethod
    def is_probably_binary(sample: bytes) -> bool:
        """Check if a file sample is likely binary."""
        if b"\\0" in sample:
            return True
        text_chars = bytearray({7, 8, 9, 10, 12, 13, 27} | set(range(0x20, 0x7F)) | set(range(0x80, 0x100)))
        nontext = sample.translate(None, text_chars)
        return float(len(nontext)) / max(1, len(sample)) > 0.30
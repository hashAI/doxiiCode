"""
Message utility functions for the chat service.
"""

from typing import Dict, Any, Tuple, Optional


class MessageUtils:
    """Utility functions for message handling."""

    @staticmethod
    def build_tool_status_message(function_name: Optional[str], args: Dict[str, Any]) -> str:
        """Return a status line for tool execution."""
        if not function_name:
            return "Processing…"
        if function_name == "write_file":
            return f"Write {args.get('path', 'file')}…"
        if function_name == "modify_file":
            return f"Edit {args.get('path', 'file')}…"
        if function_name == "read_file":
            return f"Read {args.get('path', 'file')}…"
        if function_name == "list_files":
            return "List files…"
        if function_name == "delete_file":
            return f"Delete {args.get('path', 'file')}…"
        if function_name == "copy_file":
            return f"Copy {args.get('source', 'file')}…"
        if function_name == "move_file":
            return f"Move {args.get('source', 'file')}…"
        if function_name == "create_directory":
            return f"Create directory {args.get('path', '')}…"
        if function_name == "list_directory_tree":
            return "List directory tree…"
        if function_name == "list_processes":
            return "Listing processes…"
        if function_name == "kill_process":
            return f"Killing process {args.get('pid', '')}…"
        return "Processing…"

    @staticmethod
    def build_tool_completion_summary(
        function_name: Optional[str], args: Dict[str, Any], result: Dict[str, Any]
    ) -> Tuple[str, Optional[str], Optional[Dict[str, Any]]]:
        """Build the summary strings and optional files_changed entry for tool completion.

        Returns (summary, path_for_summary, change_entry_or_none)
        """
        summary = "Completed"
        path_for_summary: Optional[str] = None

        if isinstance(result, dict):
            path_for_summary = result.get("path") or args.get("path")

        if function_name == "write_file":
            bytes_written = result.get("bytes_written", 0) if isinstance(result, dict) else 0
            estimated_lines = max(1, bytes_written // 50)
            if path_for_summary:
                summary = f"Write {path_for_summary} (+{estimated_lines} lines)"
                return summary, path_for_summary, {
                    "path": path_for_summary,
                    "action": "created",
                    "lines_added": estimated_lines,
                    "lines_removed": 0,
                }
            else:
                summary = f"Write (+{estimated_lines} lines)"
                return summary, path_for_summary, None

        if function_name == "modify_file":
            replacements = int(result.get("replacements", 0) if isinstance(result, dict) else 0)
            added = replacements
            removed = max(0, replacements - 1)
            if path_for_summary:
                summary = f"Edit {path_for_summary} (+{added} -{removed})"
                return summary, path_for_summary, {
                    "path": path_for_summary,
                    "action": "edited",
                    "lines_added": added,
                    "lines_removed": removed,
                }
            else:
                summary = f"Edit (+{added} -{removed})"
                return summary, path_for_summary, None

        if function_name == "read_file":
            if path_for_summary:
                summary = f"Read {path_for_summary}"
            else:
                summary = "Read file"
            return summary, path_for_summary, None

        if function_name == "list_files":
            file_count = 0
            if isinstance(result, dict):
                if isinstance(result.get("files"), list):
                    file_count = len(result.get("files"))
                else:
                    file_count = int(result.get("file_count", 0))
            summary = f"List files ({file_count})"
            return summary, path_for_summary, None

        if function_name == "delete_file":
            if path_for_summary:
                deleted_type = result.get("deleted", "item") if isinstance(result, dict) else "item"
                summary = f"Delete {path_for_summary} ({deleted_type})"
                return summary, path_for_summary, {
                    "path": path_for_summary,
                    "action": "deleted",
                    "lines_added": 0,
                    "lines_removed": 1,
                }
            else:
                summary = "Delete item"
                return summary, path_for_summary, None

        if function_name in ["copy_file", "move_file"]:
            action = "copied" if function_name == "copy_file" else "moved"
            source = args.get("source", "")
            dest = result.get("destination", args.get("destination", "")) if isinstance(result, dict) else ""
            if source and dest:
                summary = f"{action.title()} {source} → {dest}"
                return summary, dest, {
                    "path": dest,
                    "action": action,
                    "lines_added": 1,
                    "lines_removed": 0,
                }
            else:
                summary = f"File {action}"
                return summary, path_for_summary, None

        if function_name == "create_directory":
            if path_for_summary:
                summary = f"Create directory {path_for_summary}"
                return summary, path_for_summary, {
                    "path": path_for_summary,
                    "action": "created",
                    "lines_added": 1,
                    "lines_removed": 0,
                }
            else:
                summary = "Create directory"
                return summary, path_for_summary, None

        if function_name in ["list_processes", "kill_process"]:
            if function_name == "list_processes":
                count = result.get("count", 0) if isinstance(result, dict) else 0
                summary = f"List processes ({count})"
            else:  # kill_process
                pid = args.get("pid", "")
                success = result.get("success", False) if isinstance(result, dict) else False
                summary = f"Kill process {pid} {'✓' if success else '✗'}"
            return summary, path_for_summary, None

        if function_name == "list_directory_tree":
            summary = "Directory tree listed"
            return summary, path_for_summary, None

        # Default
        return summary, path_for_summary, None
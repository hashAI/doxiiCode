"""
OpenAI tool schemas for the chat service.
"""

from typing import List, Dict, Any


class ToolSchemas:
    """Contains all OpenAI tool schemas for the chat agent."""

    @staticmethod
    def get_file_operation_schemas() -> List[Dict[str, Any]]:
        """Get schemas for file operation tools."""
        return [
            {
                "type": "function",
                "name": "list_files",
                "description": "List files under the chat directory with optional include/exclude globs.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "include_globs": {"type": "array", "items": {"type": "string"}},
                        "exclude_globs": {"type": "array", "items": {"type": "string"}},
                        "max_results": {"type": "integer", "minimum": 1, "maximum": 10000},
                    },
                    "additionalProperties": False,
                },
            },
            {
                "type": "function",
                "name": "read_file",
                "description": "Read a file's text content relative to the chat directory with truncation.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "max_bytes": {"type": "integer", "minimum": 1, "maximum": 5000000},
                    },
                    "required": ["path"],
                    "additionalProperties": False,
                },
            },
            {
                "type": "function",
                "name": "write_file",
                "description": "Write text content to a file under the chat directory.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "content": {"type": "string"},
                        "create_dirs": {"type": "boolean"},
                        "overwrite": {"type": "boolean"},
                    },
                    "required": ["path", "content"],
                    "additionalProperties": False,
                },
            },
            {
                "type": "function",
                "name": "modify_file",
                "description": "Modify a file by replacing text (literal or regex). Returns replacement count.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "find": {"type": "string"},
                        "replace": {"type": "string"},
                        "is_regex": {"type": "boolean"},
                        "count": {"type": "integer", "minimum": 1},
                    },
                    "required": ["path", "find", "replace"],
                    "additionalProperties": False,
                },
            },
            {
                "type": "function",
                "name": "delete_file",
                "description": "Delete a file or directory within the chat directory.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "recursive": {"type": "boolean", "default": False},
                    },
                    "required": ["path"],
                    "additionalProperties": False,
                },
            },
            {
                "type": "function",
                "name": "copy_file",
                "description": "Copy a file or directory within the chat directory.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "source": {"type": "string"},
                        "destination": {"type": "string"},
                    },
                    "required": ["source", "destination"],
                    "additionalProperties": False,
                },
            },
            {
                "type": "function",
                "name": "move_file",
                "description": "Move or rename a file or directory within the chat directory.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "source": {"type": "string"},
                        "destination": {"type": "string"},
                    },
                    "required": ["source", "destination"],
                    "additionalProperties": False,
                },
            },
            {
                "type": "function",
                "name": "create_directory",
                "description": "Create a directory within the chat directory.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string"},
                        "recursive": {"type": "boolean", "default": True},
                    },
                    "required": ["path"],
                    "additionalProperties": False,
                },
            },
            {
                "type": "function",
                "name": "list_directory_tree",
                "description": "Show directory tree structure with optional depth limit.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "path": {"type": "string", "default": "."},
                        "max_depth": {"type": "integer", "minimum": 1, "maximum": 10, "default": 3},
                    },
                    "additionalProperties": False,
                },
            },
        ]

    @staticmethod
    def get_process_management_schemas() -> List[Dict[str, Any]]:
        """Get schemas for process management tools."""
        return [
            {
                "type": "function",
                "name": "list_processes",
                "description": "List running processes started in this chat session.",
                "parameters": {
                    "type": "object",
                    "properties": {},
                    "additionalProperties": False,
                },
            },
            {
                "type": "function",
                "name": "kill_process",
                "description": "Kill a process by PID (only processes started in this chat).",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "pid": {"type": "integer"},
                        "force": {"type": "boolean", "default": False},
                    },
                    "required": ["pid"],
                    "additionalProperties": False,
                },
            },
        ]

    @staticmethod
    def get_design_search_schema() -> Dict[str, Any]:
        """Get schema for design search tool."""
        return {
            "type": "function",
            "name": "design_search_tool",
            "description": "Search for design inspiration from the component library to establish a design system for the website",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query for design inspiration (e.g., 'ecommerce homepage hero section', 'modern SaaS pricing table')",
                    }
                },
                "required": ["query"],
                "additionalProperties": False,
            },
        }

    @staticmethod
    def get_todo_management_schema() -> Dict[str, Any]:
        """Get schema for TODO management tool (currently commented out)."""
        return {
            "type": "function",
            "name": "todo_manage",
            "description": "Manage TODO tasks for this chat session. Supports creating, reading, updating, deleting, and listing tasks to help with task tracking and project management.",
            "parameters": {
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string",
                        "enum": ["create", "read", "update", "delete", "list", "clear_completed"],
                        "description": "Action to perform: create (add new task), read (get specific task), update (modify task), delete (remove task), list (show all tasks), clear_completed (remove completed tasks)"
                    },
                    "task_id": {
                        "type": "string",
                        "description": "Unique identifier for the task (required for read, update, delete actions)"
                    },
                    "title": {
                        "type": "string",
                        "description": "Task title/description (required for create and update actions)"
                    },
                    "status": {
                        "type": "string",
                        "enum": ["pending", "in_progress", "completed", "blocked"],
                        "description": "Task status (optional for create, used in update)"
                    },
                    "priority": {
                        "type": "string",
                        "enum": ["low", "medium", "high", "urgent"],
                        "description": "Task priority level (optional)"
                    },
                    "notes": {
                        "type": "string",
                        "description": "Additional notes or details about the task (optional)"
                    }
                },
                "required": ["action"],
                "additionalProperties": False,
            },
        }

    @classmethod
    def get_all_schemas(cls, design_search_available: bool = False) -> List[Dict[str, Any]]:
        """
        Get all tool schemas for the chat agent.

        Args:
            design_search_available: Whether to include design search tool

        Returns:
            List of all tool schemas
        """
        schemas = []

        # Add file operation schemas
        schemas.extend(cls.get_file_operation_schemas())

        # Add process management schemas
        schemas.extend(cls.get_process_management_schemas())

        # Add design search tool if available
        if design_search_available:
            schemas.append(cls.get_design_search_schema())

        # TODO management is currently commented out in the original code
        # schemas.append(cls.get_todo_management_schema())

        return schemas
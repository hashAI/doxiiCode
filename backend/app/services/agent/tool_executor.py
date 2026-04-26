"""
Tool execution logic for the chat service.
"""

import json
import logging
from typing import Dict, Any

from ..tools.file_tools import FileTools
from ..tools.process_tools import ProcessTools
from ..tools.design_tools import DesignTools

logger = logging.getLogger(__name__)


class ToolExecutor:
    """Handles tool execution and dispatching."""

    def __init__(self, chats_dir: str):
        self.file_tools = FileTools(chats_dir)
        self.process_tools = ProcessTools()
        self.design_tools = DesignTools()

    def run_tool(self, name: str, arguments: Dict[str, Any], chat_id: str) -> Dict[str, Any]:
        """Dispatch a tool call by name with validated arguments."""
        logger.info("Tool requested: %s with args keys=%s for chat %s", name, list(arguments.keys()), chat_id)

        # File operation tools
        if name == "list_files":
            return self.file_tools.list_files(chat_id, arguments)
        if name == "read_file":
            return self.file_tools.read_file(chat_id, arguments)
        if name == "write_file":
            return self.file_tools.write_file(chat_id, arguments)
        if name == "modify_file":
            return self.file_tools.modify_file(chat_id, arguments)
        if name == "delete_file":
            return self.file_tools.delete_file(chat_id, arguments)
        if name == "copy_file":
            return self.file_tools.copy_file(chat_id, arguments)
        if name == "move_file":
            return self.file_tools.move_file(chat_id, arguments)
        if name == "create_directory":
            return self.file_tools.create_directory(chat_id, arguments)
        if name == "list_directory_tree":
            return self.file_tools.list_directory_tree(chat_id, arguments)

        # Process management tools
        if name == "list_processes":
            return self.process_tools.list_processes(chat_id, arguments)
        if name == "kill_process":
            return self.process_tools.kill_process(chat_id, arguments)

        # Design tools
        if name == "design_search_tool":
            return self.design_tools.design_search_tool(arguments)

        # TODO management (currently commented out in original)
        # if name == "todo_manage":
        #     return self._todo_manage(chat_id, arguments)

        raise ValueError(f"Unknown tool: {name}")

    def get_process_tools(self) -> ProcessTools:
        """Get the process tools instance for external access."""
        return self.process_tools
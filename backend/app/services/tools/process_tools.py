"""
Process management tools for the chat service.
"""

import psutil
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)


class ProcessTools:
    """Process management tools implementation."""

    def __init__(self):
        # Track processes started within chat sessions
        self._chat_processes: Dict[str, List[int]] = {}

    def list_processes(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """List running processes started in this chat session."""
        if chat_id not in self._chat_processes:
            return {"processes": [], "count": 0}

        active_processes = []
        pids_to_remove = []

        for pid in self._chat_processes[chat_id]:
            try:
                process = psutil.Process(pid)
                if process.is_running():
                    active_processes.append({
                        "pid": pid,
                        "name": process.name(),
                        "cmdline": " ".join(process.cmdline()),
                        "status": process.status(),
                        "cpu_percent": process.cpu_percent(),
                        "memory_percent": process.memory_percent()
                    })
                else:
                    pids_to_remove.append(pid)
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pids_to_remove.append(pid)

        # Clean up dead processes
        for pid in pids_to_remove:
            self._chat_processes[chat_id].remove(pid)

        return {"processes": active_processes, "count": len(active_processes)}

    def kill_process(self, chat_id: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Kill a process by PID (only processes started in this chat)."""
        pid = int(args["pid"])
        force = bool(args.get("force", False))

        if chat_id not in self._chat_processes or pid not in self._chat_processes[chat_id]:
            return {"error": f"Process {pid} not found in chat session or not started by this chat"}

        try:
            process = psutil.Process(pid)
            if not process.is_running():
                # Remove from tracking
                self._chat_processes[chat_id].remove(pid)
                return {"error": f"Process {pid} is not running"}

            if force:
                process.kill()  # SIGKILL
                action = "killed (SIGKILL)"
            else:
                process.terminate()  # SIGTERM
                action = "terminated (SIGTERM)"

            # Remove from tracking
            self._chat_processes[chat_id].remove(pid)

            return {
                "pid": pid,
                "action": action,
                "success": True
            }
        except psutil.NoSuchProcess:
            # Remove from tracking
            if pid in self._chat_processes[chat_id]:
                self._chat_processes[chat_id].remove(pid)
            return {"error": f"Process {pid} not found"}
        except psutil.AccessDenied:
            return {"error": f"Access denied to kill process {pid}"}
        except Exception as e:
            return {"error": str(e)}

    def add_process_to_chat(self, chat_id: str, pid: int) -> None:
        """Add a process PID to the chat's tracking list."""
        if chat_id not in self._chat_processes:
            self._chat_processes[chat_id] = []
        self._chat_processes[chat_id].append(pid)

    def get_chat_processes(self, chat_id: str) -> List[int]:
        """Get list of PIDs for a chat session."""
        return self._chat_processes.get(chat_id, [])
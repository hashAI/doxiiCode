#!/usr/bin/env python3
"""
Interactive Multi-Agent System V2 - Theme Customizer

Fast theme customization using pre-built complete themes.

Key Improvements:
- 10x faster than building from scratch
- Template discovery first (list tree + read README; no hardcoded structure)
- 3-phase workflow: Understand → Execute → Validate
- Optional task planning for complex projects
- Uses batch search/replace for quick adaptation
- Only creates custom homepage (unique per store)
- Modifies existing pages (styling only)
- Theme has everything pre-built

Usage:
    # Interactive mode (Architect V2)
    python interactive_agent_v2.py

    # Single command mode
    python interactive_agent_v2.py --message "Customize this to a luxury jewelry store"

    # With specific chat ID
    python interactive_agent_v2.py --chat-id my_project_123

    # As a module
    from experiments.scripts.interactive_agent_v2 import run_agent_streaming
    async for chunk in run_agent_streaming(chat_id, message):
        print(chunk)
"""

import os
import sys
import asyncio
import argparse
import json
import shutil
from pathlib import Path
from typing import AsyncGenerator, Dict, Any, Optional
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents import Runner
from doxii_agents.context import DoxiiContext
from doxii_agents.architect_v2 import create_architect_v2_agent
from doxii_agents.architect_v2_fast import create_architect_v2_fast_agent
from doxii_agents.architect_lightning import create_architect_lightning_agent


# ============================================================================
# Scaffold Template Initialization
# ============================================================================

def copy_theme_template(chat_root: str, theme_name: str = "visual_gallery/visual_gallery_1", use_lightning: bool = False) -> bool:
    """
    Copy a complete theme template to the project directory.

    Instead of minimal scaffold, we copy a COMPLETE working store that
    the agent will customize via batch search/replace operations.

    Args:
        chat_root: Target directory for the project
        theme_name: Name of theme to copy (default: visual_gallery_1)
        use_lightning: If True, use quick_template with placeholders

    Returns:
        True if theme was copied, False if already exists
    """
    # Override theme for lightning mode
    if use_lightning:
        theme_name = "quick_template"
    # Check if theme already exists
    index_path = os.path.join(chat_root, "index.html")
    if os.path.exists(index_path):
        print(f"⚠️  Theme already exists in {chat_root}", file=sys.stderr)
        return False

    # Find theme source directory
    # Look in project root / ecommerce_themes / {theme_name}
    script_dir = Path(__file__).parent.parent.parent  # Go up to project root
    theme_source = script_dir / "ecommerce_themes" / theme_name

    if not theme_source.exists():
        raise FileNotFoundError(
            f"Theme '{theme_name}' not found at: {theme_source}"
        )

    # Copy theme to chat_root
    print(f"📋 Copying theme '{theme_name}' from {theme_source}", file=sys.stderr)
    print(f"   to {chat_root}", file=sys.stderr)

    try:
        shutil.copytree(theme_source, chat_root, dirs_exist_ok=True)
        
        # Replace home-page.js with stub template that requires agent implementation
        stub_path = theme_source / "components" / "pages" / "home-page.js.stub"
        target_homepage = Path(chat_root) / "components" / "pages" / "home-page.js"
        
        if stub_path.exists():
            # Copy stub to replace the existing home-page.js
            shutil.copy2(stub_path, target_homepage)
            print(f"✅ Replaced home-page.js with implementation stub", file=sys.stderr)
            print(f"   Agent must implement render() method", file=sys.stderr)
        else:
            print(f"⚠️  Warning: Stub template not found at {stub_path}", file=sys.stderr)
            print(f"   Using original home-page.js (agent should still recreate it)", file=sys.stderr)
        
        print(f"✅ Theme copied successfully", file=sys.stderr)
        print(f"   Complete store ready for customization", file=sys.stderr)
        print(f"   (header, footer, pages, components, products, routing, all working!)", file=sys.stderr)
        return True
    except Exception as e:
        raise RuntimeError(f"Failed to copy theme: {e}")


# ============================================================================
# Core Streaming Function (Production-Ready)
# ============================================================================

async def run_agent_streaming(
    chat_id: str,
    user_message: str,
    cms_base_url: str = "https://api.example.com",
    chat_root: Optional[str] = None,
    max_turns: int = 50,  # Reduced from 500 - should complete in 30-40 turns
    on_event: Optional[callable] = None,
    use_architect_v2: bool = True,
    use_fast_mode: bool = True,  # Use fast agent by default
    use_lightning_mode: bool = False,  # NEW: Ultra-fast mode with full validation
    init_scaffold: bool = True,
    debug: bool = False
) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Run the multi-agent system V2 with streaming responses.

    Modes:
    - Lightning: Ultra-fast with full validation, no turn restrictions (use_lightning_mode=True)
    - Fast: 2-4 minutes, ~40 tool calls (use_fast_mode=True)
    - Quality: 5-10 minutes, thorough (use_fast_mode=False)

    Args:
        chat_id: Unique chat/project identifier
        user_message: User's message/request
        cms_base_url: CMS API base URL
        chat_root: Root directory for project files (auto-generated if None)
        max_turns: Maximum turns for agent execution (default: 50)
        on_event: Optional callback for event processing
        use_architect_v2: If True, use architect V2 (default: True)
        use_fast_mode: If True, use speed-optimized agent (default: True)
        use_lightning_mode: If True, use ultra-fast agent with full validation (no turn restrictions)
        init_scaffold: If True, automatically copy theme template to project
        debug: If True, write planning data to disk (.doxii/tasks.json)

    Yields:
        Event dictionaries with streaming content:
        - chunk_type: "text", "thinking", "tool_call", "agent_handoff", "done", "error"
        - content: Text content to display
        - Additional metadata based on chunk_type

    Example:
        async for chunk in run_agent_streaming("my_chat", "Create a store"):
            if chunk["chunk_type"] == "text":
                print(chunk["content"], end="", flush=True)
            elif chunk["chunk_type"] == "tool_call":
                print(f"\n🔧 {chunk['tool_name']}")
    """
    # Setup context - use absolute path for clarity
    if chat_root is None:
        # Create in experiments/test_output for easy access
        base_dir = Path(__file__).parent.parent / "test_output_v2"
        chat_root = str(base_dir / chat_id)

    # Ensure chat_root directory exists
    os.makedirs(chat_root, exist_ok=True)

    # Initialize theme if requested
    if init_scaffold:
        try:
            theme_copied = copy_theme_template(chat_root, use_lightning=use_lightning_mode)
            if theme_copied:
                if use_lightning_mode:
                    print(f"⚡ Lightning template initialized\n", file=sys.stderr)
                    print(f"   Agent will customize with full validation\n", file=sys.stderr)
                else:
                    print(f"✅ Theme initialized\n", file=sys.stderr)
                    print(f"   Architect V2 will customize via 3-phase workflow\n", file=sys.stderr)
        except Exception as e:
            print(f"⚠️  Warning: Could not copy theme: {e}\n", file=sys.stderr)

    # Print project location for user visibility
    print(f"📁 Project location: {os.path.abspath(chat_root)}\n", file=sys.stderr)

    context = DoxiiContext(
        chat_id=chat_id,
        chat_root=chat_root,
        cms_base_url=cms_base_url,
        project_initialized=_check_project_initialized(chat_root),
        debug=debug
    )

    # Create agent - Lightning, Fast, V2, or orchestrator
    if use_lightning_mode:
        agent = create_architect_lightning_agent()
        max_turns = 200  # No turn restriction - allow full validation and fixes
        print(f"⚡ Running ARCHITECT LIGHTNING (Ultra-Fast)\n", file=sys.stderr)
        print(f"   Target: Complete customization with full validation\n", file=sys.stderr)
    elif use_architect_v2:
        if use_fast_mode:
            agent = create_architect_v2_fast_agent()
            print(f"🚀 Running ARCHITECT V2 FAST (Speed-Optimized)\n", file=sys.stderr)
            print(f"   Target: 2-4 minutes, <40 tool calls, 30 turns max\n", file=sys.stderr)
        else:
            agent = create_architect_v2_agent()
            print(f"🎨 Running ARCHITECT V2 (Quality Mode)\n", file=sys.stderr)
            print(f"   Template discovery + 3-phase workflow + batch operations\n", file=sys.stderr)
    else:
        from doxii_agents.orchestrator import create_orchestrator_agent
        agent = create_orchestrator_agent()
        print(f"🎯 Running ORCHESTRATOR (will route to appropriate agent)\n", file=sys.stderr)

    # Track metrics
    start_time = datetime.now()
    tool_calls = 0
    agent_switches = 0

    try:
        # Run with streaming (returns RunResultStreaming, not awaitable)
        result = Runner.run_streamed(
            agent,
            user_message,
            context=context,
            max_turns=max_turns
        )

        # Stream events
        if use_lightning_mode:
            current_agent = "Architect_Lightning"
        elif use_architect_v2:
            current_agent = "Architect_V2_Fast" if use_fast_mode else "Architect_V2"
        else:
            current_agent = "Orchestrator"

        async for event in result.stream_events():
            # Transform event to frontend-compatible format
            chunk = _transform_event(event, context)

            if chunk:
                # Track metrics
                if chunk["chunk_type"] == "tool_call":
                    tool_calls += 1
                elif chunk["chunk_type"] == "agent_handoff":
                    agent_switches += 1
                    current_agent = chunk.get("agent_name", current_agent)

                # Call callback if provided
                if on_event:
                    on_event(chunk)

                yield chunk

        # Send completion event with stats
        elapsed = (datetime.now() - start_time).total_seconds()

        context.update_file_index()

        yield {
            "chunk_type": "done",
            "content": "✓ Complete",
            "stats": {
                "elapsed_seconds": round(elapsed, 2),
                "tool_calls": tool_calls,
                "agent_switches": agent_switches,
                "files_created": context.get_file_count(),
                "final_agent": current_agent
            }
        }

    except Exception as e:
        # Send error event
        yield {
            "chunk_type": "error",
            "content": f"Error: {str(e)}",
            "error": str(e),
            "error_type": type(e).__name__
        }


def _check_project_initialized(chat_root: str) -> bool:
    """Check if a project is already initialized (has index.html)."""
    # A project is initialized when the architect has generated index.html
    index_path = os.path.join(chat_root, "index.html")
    return os.path.exists(index_path)


def _transform_event(event, context: DoxiiContext) -> Optional[Dict[str, Any]]:
    """
    Transform Agents SDK events to frontend-compatible format.

    Returns event dict with:
    - chunk_type: Event type
    - content: Display content
    - Additional metadata
    """
    try:
        # Text delta streaming
        if event.type == "raw_response_event":
            if hasattr(event.data, 'delta') and event.data.delta:
                return {
                    "chunk_type": "text",
                    "content": event.data.delta
                }

            # Tool call started
            if hasattr(event.data, 'type') and 'output_item.added' in str(event.data.type):
                if hasattr(event.data, 'item'):
                    item = event.data.item
                    if hasattr(item, 'name'):
                        return {
                            "chunk_type": "tool_call",
                            "content": f"🔧 {item.name}",
                            "tool_name": item.name
                        }

        # Agent handoff
        elif event.type == "agent_updated_stream_event":
            if hasattr(event, 'new_agent'):
                agent_name = event.new_agent.name
                return {
                    "chunk_type": "agent_handoff",
                    "content": f"\n→ {agent_name} agent",
                    "agent_name": agent_name
                }

        # Tool completed
        elif event.type == "run_item_stream_event":
            if hasattr(event, 'item') and hasattr(event.item, 'type'):
                if 'tool_call' in str(event.item.type):
                    return {
                        "chunk_type": "tool_complete",
                        "content": " ✓"
                    }

    except Exception as e:
        print(f"Warning: Error transforming event: {e}", file=sys.stderr)

    return None


# ============================================================================
# Interactive CLI Interface
# ============================================================================

class InteractiveAgentV2:
    """Interactive CLI for the multi-agent system V2."""

    def __init__(self, chat_id: str = None, cms_base_url: str = "https://api.example.com", use_architect_v2: bool = True, use_fast_mode: bool = True, use_lightning_mode: bool = False, debug: bool = False):
        self.chat_id = chat_id or f"interactive_v2_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.cms_base_url = cms_base_url
        self.use_architect_v2 = use_architect_v2
        self.use_fast_mode = use_fast_mode
        self.use_lightning_mode = use_lightning_mode
        self.debug = debug
        self.message_count = 0
        self.context = None

    def print_header(self):
        """Print welcome header."""
        chat_root = self._get_chat_root()
        print("=" * 80)
        if self.use_lightning_mode:
            print("⚡ DOXII ARCHITECT LIGHTNING - Ultra-Fast Customizer")
        elif self.use_architect_v2:
            print("DOXII ARCHITECT V2 - Theme Customizer")
        else:
            print("DOXII MULTI-AGENT SYSTEM V2 - Interactive Mode")
        print("=" * 80)
        print()
        print(f"Chat ID: {self.chat_id}")
        print(f"Project Root: {os.path.abspath(chat_root)}")
        print()
        if self.use_lightning_mode:
            print("Mode: ARCHITECT LIGHTNING ⚡ (Ultra-Fast)")
            print("  • No turn restrictions - full validation and fixes")
            print("  • Pre-baked placeholders + bulk operations")
            print("  • Complete validation with checklist")
            print("  • 6-step workflow: Read → Plan → Replace → Products → Homepage → Validate")
        elif self.use_architect_v2:
            if self.use_fast_mode:
                print("Mode: ARCHITECT V2 FAST 🚀 (Speed-Optimized)")
                print("  • Target: 2-4 minutes execution time")
                print("  • Maximum 50 turns, <40 tool calls")
                print("  • Aggressive batching for efficiency")
                print("  • Single validation at end")
            else:
                print("Mode: ARCHITECT V2 (Quality Mode)")
                print("  • More thorough, 5-10 minutes")
                print("  • Multiple validation cycles")
            print("  • 3-phase workflow: Understand → Execute → Validate")
            print("  • Batch operations for theme-wide changes")
            print("  • Creates custom homepage (unique per store)")
        else:
            print("Mode: ORCHESTRATOR (automatic routing)")
            print("  • Architect V2 - Customizes themes for new projects")
            print("  • Developer - Modifies existing code")
            print("  • Integration - Connects to CMS APIs")
        print()
        if self.debug:
            print("⚠️  DEBUG MODE ENABLED")
            print("  • Planning data will be written to .doxii/ directory")
            print("  • Tasks saved to .doxii/tasks.json")
            print()
        print("Commands:")
        print("  /help    - Show this help")
        print("  /status  - Show project status")
        print("  /files   - List project files")
        print("  /tree    - Show directory tree")
        print("  /cat <file> - Show file contents")
        print("  /open    - Open project folder")
        print("  /quit    - Exit")
        print()
        print("=" * 80)
        print()

    def _get_chat_root(self) -> str:
        """Get the absolute path to the chat root directory."""
        base_dir = Path(__file__).parent.parent / "test_output_v2"
        return str(base_dir / self.chat_id)

    async def handle_command(self, command: str) -> bool:
        """Handle special commands. Returns True if should continue."""
        parts = command.split(maxsplit=1)
        cmd = parts[0].lower()
        arg = parts[1] if len(parts) > 1 else None

        if cmd == "/help":
            self.print_header()
            return True

        elif cmd == "/status":
            chat_root = self._get_chat_root()
            if os.path.exists(chat_root):
                context = DoxiiContext(chat_id=self.chat_id, chat_root=chat_root)
                context.update_file_index()

                print("\n📊 Project Status:")
                print(f"  Location: {os.path.abspath(chat_root)}")
                print(f"  Project Initialized: {'Yes' if context.project_initialized else 'No'}")
                print(f"  Total Files: {context.get_file_count()}")
                print(f"  Messages Sent: {self.message_count}")
                print(f"  Agent Version: Architect V2 (Theme Customizer)")
                print()
            else:
                print("\n⚠️  No project created yet. Send a message to get started!")
                print()
            return True

        elif cmd == "/files":
            chat_root = self._get_chat_root()
            if os.path.exists(chat_root):
                context = DoxiiContext(chat_id=self.chat_id, chat_root=chat_root)
                context.update_file_index()

                if context.file_index:
                    print(f"\n📁 Project Files ({len(context.file_index)}):")
                    for file in sorted(context.file_index):
                        full_path = os.path.join(chat_root, file)
                        size = os.path.getsize(full_path) if os.path.exists(full_path) else 0
                        print(f"  • {file} ({size} bytes)")
                    print()
                else:
                    print("\n📁 No files yet.")
                    print()
            else:
                print("\n⚠️  No project created yet.")
                print()
            return True

        elif cmd == "/tree":
            chat_root = self._get_chat_root()
            if os.path.exists(chat_root):
                print(f"\n🌳 Directory Tree: {chat_root}\n")
                self._print_tree(chat_root, prefix="")
                print()
            else:
                print("\n⚠️  No project created yet.")
                print()
            return True

        elif cmd == "/cat":
            if not arg:
                print("\n⚠️  Usage: /cat <filename>")
                print()
                return True

            chat_root = self._get_chat_root()
            file_path = os.path.join(chat_root, arg)

            if not os.path.exists(file_path):
                print(f"\n⚠️  File not found: {arg}")
                print()
                return True

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                print(f"\n{'─' * 80}")
                print(f"📄 {arg}")
                print(f"{'─' * 80}")
                print(content)
                print(f"{'─' * 80}\n")
            except Exception as e:
                print(f"\n⚠️  Error reading file: {e}\n")
            return True

        elif cmd == "/open":
            chat_root = self._get_chat_root()
            if os.path.exists(chat_root):
                abs_path = os.path.abspath(chat_root)
                print(f"\n📂 Opening: {abs_path}")
                # Try to open in file explorer
                import platform
                system = platform.system()
                try:
                    if system == "Darwin":  # macOS
                        os.system(f'open "{abs_path}"')
                    elif system == "Windows":
                        os.system(f'explorer "{abs_path}"')
                    else:  # Linux
                        os.system(f'xdg-open "{abs_path}"')
                    print("✓ Opened in file explorer\n")
                except Exception as e:
                    print(f"⚠️  Could not open automatically: {e}\n")
            else:
                print("\n⚠️  No project created yet.")
                print()
            return True

        elif cmd == "/quit":
            return False

        else:
            print(f"\n⚠️  Unknown command: {cmd}")
            print("   Type /help for available commands\n")

        return True

    def _print_tree(self, directory: str, prefix: str = "", is_last: bool = True):
        """Print a directory tree structure."""
        try:
            items = sorted(os.listdir(directory))
            # Filter out hidden files
            items = [item for item in items if not item.startswith('.')]

            for i, item in enumerate(items):
                is_last_item = (i == len(items) - 1)
                item_path = os.path.join(directory, item)

                # Print current item
                connector = "└── " if is_last_item else "├── "
                print(f"{prefix}{connector}{item}")

                # Recurse for directories
                if os.path.isdir(item_path):
                    extension = "    " if is_last_item else "│   "
                    self._print_tree(item_path, prefix + extension, is_last_item)
        except PermissionError:
            pass

    async def process_message(self, message: str):
        """Process a user message and stream the response."""
        self.message_count += 1

        print(f"\n{'─' * 80}")
        print(f"Message #{self.message_count}: {message}")
        print(f"{'─' * 80}\n")

        # Stream response
        current_line = ""

        async for chunk in run_agent_streaming(
            chat_id=self.chat_id,
            user_message=message,
            cms_base_url=self.cms_base_url,
            use_architect_v2=self.use_architect_v2,
            use_fast_mode=self.use_fast_mode,
            use_lightning_mode=self.use_lightning_mode,
            debug=self.debug
        ):
            chunk_type = chunk["chunk_type"]
            content = chunk["content"]

            if chunk_type == "text":
                # Print text inline
                print(content, end="", flush=True)
                current_line += content

                # Track newlines for formatting
                if "\n" in content:
                    current_line = ""

            elif chunk_type == "tool_call":
                # Print tool call on new line
                if current_line:
                    print()
                    current_line = ""
                print(f"\n{content}", end="", flush=True)

            elif chunk_type == "tool_complete":
                print(content, end="", flush=True)

            elif chunk_type == "agent_handoff":
                if current_line:
                    print()
                    current_line = ""
                print(f"\n{content}", end="", flush=True)

            elif chunk_type == "done":
                # Print completion stats
                if current_line:
                    print()

                stats = chunk.get("stats", {})
                print("\n")
                print(f"{'─' * 80}")
                print(f"✓ Completed in {stats.get('elapsed_seconds', 0)}s")
                print(f"  Tool calls: {stats.get('tool_calls', 0)}")
                print(f"  Agent switches: {stats.get('agent_switches', 0)}")
                print(f"  Files in project: {stats.get('files_created', 0)}")
                print(f"{'─' * 80}\n")

            elif chunk_type == "error":
                if current_line:
                    print()
                print(f"\n❌ Error: {content}\n")

    async def run(self):
        """Run the interactive CLI."""
        self.print_header()

        while True:
            try:
                # Get user input
                user_input = input("You: ").strip()

                if not user_input:
                    continue

                # Handle commands
                if user_input.startswith("/"):
                    should_continue = await self.handle_command(user_input)
                    if not should_continue:
                        print("\n👋 Goodbye!")
                        break
                    continue

                # Process message
                await self.process_message(user_input)

            except KeyboardInterrupt:
                print("\n\n⚠️  Interrupted. Type /quit to exit or continue with another message.")

            except EOFError:
                print("\n\n👋 Goodbye!")
                break

            except Exception as e:
                print(f"\n❌ Unexpected error: {e}")
                import traceback
                traceback.print_exc()


# ============================================================================
# CLI Entry Point
# ============================================================================

async def main():
    """Main entry point for CLI."""
    parser = argparse.ArgumentParser(
        description="DOXII Multi-Agent System V2 - Theme Customizer",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Interactive mode (Architect V2)
  python interactive_agent_v2.py

  # Single message mode
  python interactive_agent_v2.py --message "Create a luxury jewelry store"

  # Specify chat ID
  python interactive_agent_v2.py --chat-id my_project

  # Specify CMS URL
  python interactive_agent_v2.py --cms-url https://cms.example.com/api
        """
    )

    parser.add_argument(
        "--message", "-m",
        help="Send a single message (non-interactive mode)"
    )

    parser.add_argument(
        "--chat-id", "-c",
        help="Chat ID for the session (auto-generated if not provided)"
    )

    parser.add_argument(
        "--cms-url",
        default="https://api.example.com",
        help="CMS API base URL (default: https://api.example.com)"
    )

    parser.add_argument(
        "--architect-v2",
        action="store_true",
        default=True,
        help="Run architect V2 agent (default, theme customizer)"
    )

    parser.add_argument(
        "--fast",
        action="store_true",
        default=False,
        help="Use speed-optimized agent (default, 2-4 min target)"
    )

    parser.add_argument(
        "--quality",
        action="store_true",
        default=False,
        help="Use quality mode (slower, 5-10 min, more thorough)"
    )

    parser.add_argument(
        "--lightning",
        action="store_true",
        default=True,
        help="⚡ Ultra-fast mode with full validation (no turn restrictions)"
    )

    parser.add_argument(
        "--debug",
        action="store_true",
        help="Enable debug mode (writes task data to .doxii/tasks.json)"
    )

    args = parser.parse_args()

    # Check for API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ ERROR: OPENAI_API_KEY environment variable not set")
        print()
        print("Please set your OpenAI API key:")
        print("  export OPENAI_API_KEY='your-key-here'")
        return 1

    # Determine mode: --lightning > --quality > --fast
    use_lightning = args.lightning
    use_fast = args.fast and not args.quality and not args.lightning

    # Create interactive agent
    agent = InteractiveAgentV2(
        chat_id=args.chat_id,
        cms_base_url=args.cms_url,
        use_architect_v2=args.architect_v2,
        use_fast_mode=use_fast,
        use_lightning_mode=use_lightning,
        debug=args.debug
    )

    # Single message mode
    if args.message:
        if use_lightning:
            mode_str = "LIGHTNING ⚡"
            print(f"DOXII Architect Lightning - Single Message Mode")
            print(f"Chat ID: {agent.chat_id}")
            print("No turn restrictions - full validation and fixes")
        else:
            mode_str = "FAST 🚀" if use_fast else "Quality"
            print(f"DOXII Architect V2 - Single Message Mode ({mode_str})")
            print(f"Chat ID: {agent.chat_id}")
            if use_fast:
                print("Target: 2-4 minutes, <40 tool calls")
        print()

        await agent.process_message(args.message)

        # Show final status
        print()
        await agent.handle_command("/status")
        return 0

    # Interactive mode
    await agent.run()
    return 0


# ============================================================================
# Module Usage Example
# ============================================================================

async def example_usage():
    """
    Example of using this module in another application.

    This shows how the main project can import and use the streaming function.
    """
    chat_id = "example_integration_v2"
    user_message = "Create a luxury jewelry store called 'Aurelia Gems'"

    print("Example: Using run_agent_streaming() V2 as a module")
    print("=" * 60)
    print()

    # Custom event handler
    def on_event(chunk):
        """Custom event handler for processing chunks."""
        if chunk["chunk_type"] == "agent_handoff":
            print(f"\n[Event] Switched to {chunk['agent_name']} agent")

    # Stream responses
    async for chunk in run_agent_streaming(
        chat_id=chat_id,
        user_message=user_message,
        on_event=on_event
    ):
        # Handle different chunk types
        if chunk["chunk_type"] == "text":
            print(chunk["content"], end="", flush=True)

        elif chunk["chunk_type"] == "done":
            stats = chunk.get("stats", {})
            print(f"\n\nCompleted in {stats['elapsed_seconds']}s")
            print(f"Files created: {stats['files_created']}")


if __name__ == "__main__":
    # Run CLI
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

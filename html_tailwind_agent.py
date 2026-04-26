#!/usr/bin/env python3
"""
html_tailwind_agent.py

Standalone CLI agent that can create HTML + TailwindCSS pages and operate on files
within a specified project directory using OpenAI function/tool calling.

Features:
- Safe, sandboxed file operations within a provided project root
- Tools: list_files, read_file, grep_search, write_file, modify_file, create_html_scaffold
- OpenAI Chat Completions function-calling loop with configurable model
- Optional smoke test to validate tool behavior without hitting the OpenAI API

Usage:
  python html_tailwind_agent.py --root /path/to/project \
    --objective "Create a landing page with Tailwind under pages/landing.html" \
    --model gpt-5 --max-steps 8

  # Tools smoke test (no OpenAI call):
  python html_tailwind_agent.py --root /path/to/project --tools-smoke-test

Requires environment variable: OPENAI_API_KEY
Tested with openai>=1.0.0 library (from openai import OpenAI)
"""

from __future__ import annotations

import argparse
import dataclasses
import logging
import fnmatch
import json
import os
import re
import sys
import time
import random
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional, Tuple

logger = logging.getLogger(__name__)

# Design search functionality
try:
    from design_search import design_search_tool_func, SEMANTIC_SEARCH_AVAILABLE

    DESIGN_SEARCH_AVAILABLE = SEMANTIC_SEARCH_AVAILABLE
except ImportError as e:
    logger.warning(f"Design search functionality not available: {e}")
    DESIGN_SEARCH_AVAILABLE = False

    def design_search_tool_func(query: str) -> str:
        return json.dumps({"error": "Design search functionality is not available."})


# ------------------------------ Utility helpers ------------------------------


def canonicalize(path: str) -> str:
    return os.path.realpath(os.path.expanduser(path))


def is_path_within_root(root: str, target: str) -> bool:
    root_c = canonicalize(root)
    target_c = canonicalize(target)
    try:
        common = os.path.commonpath([root_c, target_c])
    except ValueError:
        return False
    return common == root_c


def ensure_within_root_or_raise(root: str, target: str) -> None:
    if not is_path_within_root(root, target):
        raise PermissionError(f"Path outside project root not allowed: {target}")


def read_text_safely(path: str, max_bytes: int) -> Tuple[str, bool]:
    with open(path, "rb") as f:
        data = f.read(max_bytes + 1)
    truncated = len(data) > max_bytes
    return data[:max_bytes].decode("utf-8", errors="replace"), truncated


def write_text_safely(path: str, content: str, create_dirs: bool, overwrite: bool) -> None:
    dirpath = os.path.dirname(path)
    if dirpath and create_dirs and not os.path.exists(dirpath):
        os.makedirs(dirpath, exist_ok=True)
    if os.path.exists(path) and not overwrite:
        raise FileExistsError(f"File exists and overwrite=False: {path}")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def apply_regex_or_literal_replace(
    text: str,
    find: str,
    replace: str,
    is_regex: bool,
    count: Optional[int],
) -> Tuple[str, int]:
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
            # Manual limited replacements
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


def iter_files(root: str, include_globs: Optional[List[str]], exclude_globs: Optional[List[str]]) -> Iterable[str]:
    include_globs = include_globs or ["**/*"]
    exclude_globs = exclude_globs or []
    root_c = canonicalize(root)
    for dirpath, dirnames, filenames in os.walk(root_c):
        # Apply dir exclude globs by modifying dirnames in-place
        # Ensure we don't traverse excluded directories
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


def is_probably_binary(sample: bytes) -> bool:
    if b"\0" in sample:
        return True
    # Heuristic: if a lot of bytes are non-text, consider binary
    text_chars = bytearray({7, 8, 9, 10, 12, 13, 27} | set(range(0x20, 0x7F)) | set(range(0x80, 0x100)))
    nontext = sample.translate(None, text_chars)
    return float(len(nontext)) / max(1, len(sample)) > 0.30


# ------------------------------- Tool schemas -------------------------------


def tool_schemas() -> List[Dict[str, Any]]:
    schemas = [
        {
            "type": "function",
            "name": "list_files",
            "description": "List files under the project root with optional include/exclude globs.",
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
            "description": "Read a file's text content relative to the project root with truncation.",
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
            "name": "grep_search",
            "description": "Search for a regex pattern across files under the project root.",
            "parameters": {
                "type": "object",
                "properties": {
                    "pattern": {"type": "string"},
                    "include_globs": {"type": "array", "items": {"type": "string"}},
                    "exclude_globs": {"type": "array", "items": {"type": "string"}},
                    "case_insensitive": {"type": "boolean"},
                    "multiline": {"type": "boolean"},
                    "max_matches": {"type": "integer", "minimum": 1, "maximum": 10000},
                },
                "required": ["pattern"],
                "additionalProperties": False,
            },
        },
        {
            "type": "function",
            "name": "write_file",
            "description": "Write text content to a file under the project root.",
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
    ]

    # Add design_search_tool if available
    if DESIGN_SEARCH_AVAILABLE:
        schemas.append(
            {
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
        )

    return schemas


# ------------------------------- Tool handlers ------------------------------


@dataclass
class ToolContext:
    project_root: str


class ToolRunner:
    def __init__(self, ctx: ToolContext) -> None:
        self.ctx = ctx

    def run(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Dispatch a tool call by name with validated arguments.

        All tools are sandboxed to the configured project root. Any path that
        escapes the root directory will raise a PermissionError.
        """
        logger.info("Tool requested: %s with args keys=%s", name, list(arguments.keys()))
        if name == "list_files":
            return self._list_files(arguments)
        if name == "read_file":
            return self._read_file(arguments)
        if name == "grep_search":
            return self._grep_search(arguments)
        if name == "write_file":
            return self._write_file(arguments)
        if name == "modify_file":
            return self._modify_file(arguments)
        if name == "design_search_tool":
            return self._design_search_tool(arguments)
        raise ValueError(f"Unknown tool: {name}")

    def _list_files(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """List files under the project root, honoring include/exclude globs.

        Returns a possibly truncated list to avoid huge outputs.
        """
        logger.debug(
            "list_files: include_globs=%s exclude_globs=%s", args.get("include_globs"), args.get("exclude_globs")
        )
        include_globs = args.get("include_globs") or None
        # Ensure root-level files are considered when patterns like "**/*" are used
        if include_globs:
            if any("/" in g for g in include_globs) and "*" not in include_globs:
                include_globs = list(include_globs) + ["*"]
        exclude_globs = args.get("exclude_globs") or None
        max_results = int(args.get("max_results") or 500)
        results: List[str] = []
        for path in iter_files(self.ctx.project_root, include_globs, exclude_globs):
            rel = os.path.relpath(path, self.ctx.project_root)
            results.append(rel)
            if len(results) >= max_results:
                break
        return {"files": results, "truncated": len(results) >= max_results}

    def _read_file(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Read a text file with size limit and return content and truncation flag."""
        rel_path = args["path"]
        max_bytes = int(args.get("max_bytes") or 200_000)
        abs_path = canonicalize(os.path.join(self.ctx.project_root, rel_path))
        ensure_within_root_or_raise(self.ctx.project_root, abs_path)
        logger.info("read_file: %s (max_bytes=%s)", rel_path, max_bytes)
        if not os.path.exists(abs_path):
            return {"error": f"File not found: {rel_path}"}
        if os.path.isdir(abs_path):
            return {"error": f"Path is a directory: {rel_path}"}
        text, truncated = read_text_safely(abs_path, max_bytes)
        return {"path": rel_path, "content": text, "truncated": truncated}

    def _grep_search(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Regex search across text files, returning snippet context for matches."""
        pattern = args["pattern"]
        include_globs = args.get("include_globs") or None
        exclude_globs = args.get("exclude_globs") or None
        case_insensitive = bool(args.get("case_insensitive") or False)
        multiline = bool(args.get("multiline") or False)
        max_matches = int(args.get("max_matches") or 200)
        logger.info("grep_search: pattern=%r ci=%s ml=%s", pattern, case_insensitive, multiline)

        flags = 0
        if case_insensitive:
            flags |= re.IGNORECASE
        if multiline:
            flags |= re.MULTILINE | re.DOTALL
        try:
            regex = re.compile(pattern, flags)
        except re.error as e:
            return {"error": f"Invalid regex: {e}"}

        matches: List[Dict[str, Any]] = []
        for fpath in iter_files(self.ctx.project_root, include_globs, exclude_globs):
            # Skip likely binary files
            try:
                with open(fpath, "rb") as fb:
                    sample = fb.read(2048)
                if is_probably_binary(sample):
                    continue
                with open(fpath, "r", encoding="utf-8", errors="replace") as ft:
                    content = ft.read()
            except Exception as e:
                continue  # silently skip unreadable files
            for m in regex.finditer(content):
                start = max(0, m.start() - 150)
                end = min(len(content), m.end() + 150)
                snippet = content[start:end]
                matches.append(
                    {
                        "file": os.path.relpath(fpath, self.ctx.project_root),
                        "match": m.group(0)[:500],
                        "span": [m.start(), m.end()],
                        "context": snippet,
                    }
                )
                if len(matches) >= max_matches:
                    return {"matches": matches, "truncated": True}
        return {"matches": matches, "truncated": False}

    def _write_file(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Write (or overwrite) a text file. Creates parent dirs if requested."""
        rel_path = args["path"]
        content = args["content"]
        create_dirs = bool(args.get("create_dirs") or True)
        overwrite = bool(args.get("overwrite") or False)
        abs_path = canonicalize(os.path.join(self.ctx.project_root, rel_path))
        ensure_within_root_or_raise(self.ctx.project_root, abs_path)
        logger.info("write_file: %s (bytes=%d overwrite=%s)", rel_path, len(content), overwrite)
        try:
            write_text_safely(abs_path, content, create_dirs=create_dirs, overwrite=overwrite)
        except Exception as e:
            return {"error": str(e)}
        return {"path": rel_path, "bytes_written": len(content)}

    def _modify_file(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Apply either literal or regex-based replacements to a file's content."""
        rel_path = args["path"]
        find = args["find"]
        replace = args["replace"]
        is_regex = bool(args.get("is_regex") or False)
        count = args.get("count")
        if count is not None:
            count = int(count)
        abs_path = canonicalize(os.path.join(self.ctx.project_root, rel_path))
        ensure_within_root_or_raise(self.ctx.project_root, abs_path)
        logger.info("modify_file: %s (is_regex=%s count=%s)", rel_path, is_regex, count)
        if not os.path.exists(abs_path):
            return {"error": f"File not found: {rel_path}"}
        try:
            with open(abs_path, "r", encoding="utf-8", errors="replace") as f:
                text = f.read()
            new_text, num = apply_regex_or_literal_replace(text, find, replace, is_regex, count)
            with open(abs_path, "w", encoding="utf-8") as f:
                f.write(new_text)
        except Exception as e:
            return {"error": str(e)}
        return {"path": rel_path, "replacements": num}

    def _design_search_tool(self, args: Dict[str, Any]) -> Dict[str, Any]:
        """Search for design inspiration from the component library."""
        if not DESIGN_SEARCH_AVAILABLE or design_search_tool_func is None:
            return {
                "error": "design_search_tool is not available. Make sure component-library-tool backend is accessible."
            }

        query = args.get("query", "")
        if not query:
            return {"error": "Query parameter is required"}

        logger.info("design_search_tool: query=%r", query)

        try:
            # Call the design search tool function
            result = design_search_tool_func(query)
            return {"query": query, "inspiration": result}
        except Exception as e:
            logger.error("Error in design_search_tool: %s", e)
            return {"error": f"Design search failed: {str(e)}", "query": query}

    # create_html_scaffold tool removed — use write_file for HTML creation


# ------------------------------ OpenAI agent loop ----------------------------


def get_system_prompt() -> str:
    base_prompt = (
        "You are an expert web UI agent that builds clean, accessible, design prototypes "
        "styled with TailwindCSS. Use the provided tools to read the project, plan a site "
        "structure, and write or modify files under the given project root.\n\n"
        "Operating constraints:\n"
        "- Keep all file operations strictly within the project root.\n"
        "- Before writing, inspect existing files if relevant (list_files, read_file, grep_search) to avoid duplication.\n"
        "- When creating multiple files, plan first (a bullet list of pages and assets), then implement step by step.\n"
        "- Use semantic HTML and Tailwind utility classes; minimize custom CSS.\n"
    )

    base_prompt += """## GOAL
Help users explore and build beautiful, responsive, and scalable multi-file websites by:
- Providing **inspiration** on *what to build and how to build it*.
- Generating a **reusable, token-driven design system**.
- Enforcing visual **consistency**, clean structure, and responsiveness.

## WORKFLOW

1. **Detect design-system presence**
   - Check for `design-system.css` and `design-system.html` in the working directory
2. **Smart action based on analysis**
   - If design system is **missing or incomplete**: generate a complete design system first
   - If design system is **present and complete**: extract and apply tokens throughout the website
3. **ALWAYS call design_search_tool before creating:**
   - A new design system
   - A new page or layout (e.g., homepage, contact page)
   Apply learnings from the tool results to come up with design system and website pages.
4. **Always ensure consistency** in color, typography, spacing, and component design using tokens
5. **Build website pages and components** only after validating or generating the design system
6. **Maintain a cohesive visual identity** and responsive behavior across all files
7. **As and when files are generated, write them immediately to the file system so that the user can see the changes and we dont loose the changes.**
---

## DESIGN SYSTEM REQUIREMENTS

Create two files:
- `design-system.css`: Contains all design tokens, utility classes, and component styles
- `design-system.html`: Visual documentation and showcase of all tokens and components

The design system must include:

### Design Tokens
- Full color scales (50 to 900) for:
  - Primary, Secondary, Accent, and Neutral (CSS variables in `:root`)
- Typography scale (headings, body, captions)
- Spacing system, border radii, shadow variations
- Responsive breakpoints
- Dark/light theme toggle (mandatory)

### UI Pages or Components
- Button variants (primary, secondary, outline, gradient, sizes)
- Form controls (inputs, checkboxes, selects, radios)
- Card designs (basic, featured, gradient)
- Navigation elements (header, menu, breadcrumbs)
- Status elements (badges, alerts)

### Layout & Interaction
- Grid/container layouts
- Section/hero/page patterns
- Hover, focus, active, and disabled states
- Responsive behavior across devices

---

## WEBSITE CREATION REQUIREMENTS

When creating website files:

- Use tokens from the design-system.css for all styles
- Implement navigation across pages using shared layout patterns
- Use semantic HTML5, Tailwind CSS (via CDN), and mobile-first design
- Link all HTML files to `design-system.css` in the `<head>`
- Use Google Fonts and FontAwesome via CDN
- Ensure consistency, responsiveness, and SEO-readiness

## 🔧 TECH STACK

You must strictly follow this technology stack:

- **HTML5**: Semantic, SEO-friendly markup
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Google Fonts**: Font library (via CDN)
- **Lucide Icons**: Icons (via CDN)
- **No JavaScript frameworks**: This is a static HTML/CSS implementation
- **picsum.photos**: For placeholder images via CDN
- **GSAP**: For animations via CDN
- **three.js**: For 3D animations via CDN

---

## SUCCESS CHECKLIST
- Design system created or validated
- Tokens applied across all HTML files
- **Mobile-First Responsive Design**: All pages and components must work on all screen sizes, starting from mobile
- **Dark/Light Mode Toggle**: Must be implemented in all files
- Linked to design-system.css
- Uses semantic HTML with accessible contrast and structure
"""

    if DESIGN_SEARCH_AVAILABLE:
        base_prompt += """## 🧠 DESIGN INSPIRATION TOOL — `design_search_tool`

Use this tool to search for layout/design references. **Call it once if needed.**
design_search_tool("modern SaaS pricing table")
design_search_tool("elegant hero section with 3d background")

If you use the tool, you must:

- apply patterns, typography, styling, layout to create design-systems and website pages.
- make sure to use inspiration from the tool results.
"""

    return base_prompt


DEFAULT_SYSTEM_PROMPT = get_system_prompt()


def build_openai_client():
    try:
        from openai import OpenAI  # type: ignore
    except Exception as e:  # pragma: no cover
        raise RuntimeError("The 'openai' package is required. Install with: pip install openai") from e
    return OpenAI()


@dataclass
class AgentConfig:
    model: str = "gpt-5"
    max_steps: int = 8
    tool_choice: str | Dict[str, Any] = "auto"
    parallel_tool_calls: bool = True


class HtmlTailwindAgent:
    def __init__(self, project_root: str, config: AgentConfig) -> None:
        self.project_root = canonicalize(project_root)
        if not os.path.isdir(self.project_root):
            raise ValueError(f"Project root not found: {project_root}")
        self.config = config
        self.tool_runner = ToolRunner(ToolContext(project_root=self.project_root))
        self.client = None

    def _ensure_client(self):
        if self.client is None:
            self.client = build_openai_client()

    def _tool_definitions(self) -> List[Dict[str, Any]]:
        return tool_schemas()

    def _build_system_prompt(self) -> str:
        """Construct the system prompt and embed a truncated project file index.

        Including the file index helps the model avoid calling the list_files tool
        just to understand the repository structure.
        """
        base = get_system_prompt()
        base += "**PROJECT ROOT**: " + self.project_root
        try:
            # Keep the index short to control prompt size
            index_result = self.tool_runner.run("list_files", {"max_results": 500})
            files = index_result.get("files", [])
            truncated = bool(index_result.get("truncated"))
            if files:
                base += "\n\nPROJECT FILE INDEX (first {} entries):\n".format(len(files))
                base += "\n".join(f"- {rel_path}" for rel_path in files)
                if truncated:
                    base += "\n… (truncated; call grep_search/read_file if you need specifics)"
                base += "\n\nGuidance: Prefer using the above index before calling the `list_files` tool."
        except Exception as e:  # pragma: no cover - non-critical
            base += f"\n\n[Note: Unable to embed file index: {e}]"
        return base

    def run_objective(self, objective: str) -> Dict[str, Any]:
        """Run a tool-calling loop until the model returns a final message or steps are exhausted."""
        self._ensure_client()
        assert self.client is not None

        def _to_plain_obj(obj: Any) -> Any:
            try:
                if hasattr(obj, "model_dump"):
                    return obj.model_dump()
                return json.loads(json.dumps(obj, default=lambda o: getattr(o, "__dict__", str(o))))
            except Exception:
                return {}

        def _extract_reasoning_texts(root: Any) -> List[str]:
            texts: List[str] = []

            def walk(x: Any) -> None:
                if isinstance(x, dict):
                    content_type = x.get("type")
                    if content_type in ("reasoning", "thinking"):
                        # Common fields where text may appear
                        if isinstance(x.get("text"), str):
                            texts.append(x["text"])
                        summary = x.get("summary")
                        if isinstance(summary, dict) and isinstance(summary.get("text"), str):
                            texts.append(summary["text"])
                        content = x.get("content")
                        if isinstance(content, list):
                            for part in content:
                                if (
                                    isinstance(part, dict)
                                    and part.get("type") == "text"
                                    and isinstance(part.get("text"), str)
                                ):
                                    texts.append(part["text"])
                    # Also capture message.reasoning or message.thinking objects if present
                    for key in ("reasoning", "thinking"):
                        if key in x:
                            val = x[key]
                            if isinstance(val, str):
                                texts.append(val)
                            elif isinstance(val, dict):
                                if isinstance(val.get("text"), str):
                                    texts.append(val["text"])
                                if isinstance(val.get("content"), list):
                                    for part in val["content"]:
                                        if isinstance(part, dict) and isinstance(part.get("text"), str):
                                            texts.append(part["text"])
                                if isinstance(val.get("summary"), dict) and isinstance(val["summary"].get("text"), str):
                                    texts.append(val["summary"]["text"])
                            elif isinstance(val, list):
                                for item in val:
                                    if isinstance(item, dict) and isinstance(item.get("text"), str):
                                        texts.append(item["text"])
                    for v in x.values():
                        walk(v)
                elif isinstance(x, list):
                    for y in x:
                        walk(y)

            try:
                walk(root)
            except Exception:
                pass

            # Deduplicate and trim
            seen: set[str] = set()
            out: List[str] = []
            for t in texts:
                s = t.strip()
                if s and s not in seen:
                    seen.add(s)
                    out.append(s)
            return out

        # Prepare initial input and instructions for the Responses API
        instructions = self._build_system_prompt()
        user_input = f"{objective}\n Project root: {self.project_root}"

        final_text: Optional[str] = None
        steps_taken = 0
        previous_response_id: Optional[str] = None
        logger.info("Starting agent run: model=%s max_steps=%d", self.config.model, self.config.max_steps)

        while steps_taken < self.config.max_steps:
            steps_taken += 1
            logger.info("Step %d: requesting response with tools=%d", steps_taken, len(self._tool_definitions()))

            # Build request parameters for Responses API
            request_params = {
                "model": self.config.model,
                "tools": self._tool_definitions(),
                "tool_choice": self.config.tool_choice,
                "parallel_tool_calls": self.config.parallel_tool_calls,
                "store": True,  # Enable server-side conversation storage
                "truncation": "auto",
                # Request a reasoning summary when supported by the model
                # "reasoning": {"summary": "auto"},
            }

            # For first request, include input and instructions
            if previous_response_id is None:
                request_params["input"] = user_input
                request_params["instructions"] = instructions
            else:
                # For subsequent requests, use previous_response_id for conversation continuity
                request_params["instructions"] = instructions
                request_params["previous_response_id"] = previous_response_id
                # Only include input if we have tool results to pass
                if user_input:
                    # Handle both string and structured inputs
                    if isinstance(user_input, str) and user_input.strip():
                        request_params["input"] = user_input
                    elif isinstance(user_input, list) and user_input:
                        request_params["input"] = user_input

            # Perform request with explicit 429 backoff handling
            max_rate_retries = 5

            def _parse_reset_seconds_from_headers(headers: Dict[str, Any]) -> float:
                def _to_seconds(value: Optional[str]) -> float:
                    if not value:
                        return 0.0
                    v = str(value).strip().lower()
                    try:
                        if v.endswith("ms"):
                            return max(0.0, float(v[:-2]) / 1000.0)
                        if v.endswith("s"):
                            return max(0.0, float(v[:-1]))
                        return max(0.0, float(v))
                    except Exception:
                        return 0.0

                reset_req = _to_seconds(headers.get("x-ratelimit-reset-requests")) if headers else 0.0
                reset_tok = _to_seconds(headers.get("x-ratelimit-reset-tokens")) if headers else 0.0
                return max(reset_req, reset_tok)

            def _parse_try_again_seconds_from_message(msg: str) -> float:
                # e.g., "Please try again in 4.372s"
                import re as _re

                m = _re.search(r"try again in\s+([0-9]+(?:\.[0-9]+)?)s", msg or "")
                if m:
                    try:
                        return float(m.group(1))
                    except Exception:
                        return 0.0
                return 0.0

            attempt = 0
            while True:
                try:
                    resp = self.client.responses.create(**request_params)
                    break
                except Exception as e:  # Handle 429 rate limit with backoff; re-raise others
                    # Detect 429 from SDK exceptions
                    status_code = None
                    headers = None
                    message = str(e)
                    try:
                        # httpx or OpenAI exceptions may expose response
                        resp_obj = getattr(e, "response", None)
                        if resp_obj is not None:
                            status_code = getattr(resp_obj, "status_code", None)
                            headers = getattr(resp_obj, "headers", None)
                    except Exception:
                        pass

                    if status_code == 429 and attempt < max_rate_retries:
                        reset_secs = _parse_reset_seconds_from_headers(headers or {})
                        hint_secs = _parse_try_again_seconds_from_message(message)
                        # Exponential backoff baseline (1s, 2s, 4s, 8s)
                        exp_secs = float(2**attempt)
                        # Choose the largest among hints to be safe; add small jitter
                        wait_secs = max(reset_secs, hint_secs, exp_secs)
                        wait_secs += 0.2 + random.random() * 0.6  # 0.2-0.8s jitter
                        logger.warning(
                            "429 rate limit encountered. attempt=%d wait=%.2fs (reset=%.2fs hint=%.2fs)",
                            attempt + 1,
                            wait_secs,
                            reset_secs,
                            hint_secs,
                        )
                        time.sleep(wait_secs)
                        attempt += 1
                        continue
                    # Not a 429, or retries exhausted
                    raise

            # Extract reasoning/thinking content from the new response structure
            try:
                resp_obj = _to_plain_obj(resp)
                reasoning_snippets = _extract_reasoning_texts(resp_obj)
                for snippet in reasoning_snippets:
                    # Keep logs readable
                    trimmed = snippet if len(snippet) <= 2000 else (snippet[:2000] + " …")
                    logger.info("Model thinking: %s", trimmed)
            except Exception:
                pass

            # Track conversation for context

            # Check if response failed
            if resp.status == "failed":
                error_msg = getattr(resp.error, "message", "Unknown error") if resp.error else "Unknown error"
                logger.error("Response failed: %s", error_msg)
                return {"final": f"Error: {error_msg}", "steps": steps_taken}

            # Store the response ID for conversation continuity
            previous_response_id = resp.id

            # Process output items to find tool calls and text responses
            tool_calls_found = False
            text_responses = []
            reasoning_summaries: List[str] = []
            tool_results = []

            logger.debug("Response output items: %d", len(resp.output))
            for i, output_item in enumerate(resp.output):
                logger.debug("Output item %d: type=%s", i, getattr(output_item, "type", "unknown"))

                if output_item.type == "function_call":
                    tool_calls_found = True
                    logger.info("Step %d: processing function call: %s", steps_taken, output_item.name)

                    # Execute the tool call
                    try:
                        args = output_item.arguments or {}
                        if isinstance(args, str):
                            args = json.loads(args)
                    except (json.JSONDecodeError, TypeError):
                        args = {}

                    try:
                        result = self.tool_runner.run(output_item.name, args)
                    except Exception as e:
                        result = {"error": str(e)}

                    logger.debug("Tool result keys for %s: %s", output_item.name, list(result.keys()))

                    # Extract call_id - prefer 'call_id' over 'id'
                    call_id = None
                    for attr_name in ["call_id", "id", "function_call_id"]:
                        if hasattr(output_item, attr_name):
                            call_id = getattr(output_item, attr_name)
                            if call_id:
                                break

                    if not call_id:
                        logger.error(
                            "Could not find call_id for function call. Available attributes: %s", dir(output_item)
                        )
                        # Try to extract from the object's dict representation
                        try:
                            obj_dict = output_item.__dict__ if hasattr(output_item, "__dict__") else {}
                            logger.debug("Function call object dict: %s", obj_dict)
                            call_id = obj_dict.get("id") or obj_dict.get("call_id")
                        except:
                            pass

                    if not call_id:
                        logger.error("Failed to extract call_id, skipping tool result")
                        continue

                    logger.info("Function call ID: %s, function: %s", call_id, output_item.name)

                    # Store tool result with proper structure for Responses API
                    tool_output = {"type": "function_call_output", "call_id": call_id, "output": json.dumps(result)}
                    logger.debug("Structured tool output: %s", json.dumps(tool_output)[:200])
                    tool_results.append(tool_output)

                elif output_item.type == "message" and getattr(output_item, "role", None) == "assistant":
                    # Responses API emits tool calls as separate function_call items, not within message.tool_calls.
                    # Extract only text content from assistant message items here.
                    logger.debug("Processing assistant message with %d content items", len(output_item.content))
                    for content_item in output_item.content:
                        logger.debug("Content item type: %s", getattr(content_item, "type", "unknown"))
                        if content_item.type == "output_text":
                            text_responses.append(content_item.text)
                        else:
                            # Log and ignore other assistant content types (e.g., images) for now
                            logger.debug(
                                "Ignoring assistant content type: %s", getattr(content_item, "type", "unknown")
                            )
                elif output_item.type == "reasoning":
                    # Collect reasoning summaries when present
                    summary_items = getattr(output_item, "summary", None)
                    if isinstance(summary_items, list):
                        for s in summary_items:
                            try:
                                s_type = getattr(s, "type", None) or (s.get("type") if isinstance(s, dict) else None)
                                if s_type == "summary_text":
                                    text = getattr(s, "text", None) or (s.get("text") if isinstance(s, dict) else None)
                                    if isinstance(text, str) and text.strip():
                                        reasoning_summaries.append(text.strip())
                            except Exception:
                                continue
                else:
                    logger.debug(
                        "Unhandled output item type: %s (role: %s)",
                        output_item.type,
                        getattr(output_item, "role", "none"),
                    )

            if tool_calls_found:
                # Pass tool results back using the proper Responses API structure
                if tool_results:
                    # Use tool results as input for the next API call
                    user_input = tool_results
                else:
                    user_input = []

                # Keep previous_response_id to maintain conversation continuity
                continue

            # No tool calls; collect final text response
            if text_responses:
                final_text = "\n".join(text_responses)
                if reasoning_summaries:
                    final_text += "\n\n---\nReasoning summary:\n" + "\n\n".join(reasoning_summaries)
            elif hasattr(resp, "output_text") and resp.output_text:
                # Use SDK convenience property if available
                final_text = resp.output_text
                if reasoning_summaries:
                    final_text += "\n\n---\nReasoning summary:\n" + "\n\n".join(reasoning_summaries)
            else:
                final_text = "\n\n".join(reasoning_summaries) if reasoning_summaries else ""

            logger.info("Received final assistant message (chars=%d)", len(final_text))
            break

        return {"final": final_text or "", "steps": steps_taken}


# ----------------------------------- CLI ------------------------------------


def run_tools_smoke_test(project_root: str) -> int:
    """Exercise the tool layer without calling OpenAI to ensure safe behavior and logging."""
    print("Running tools smoke test...")
    runner = ToolRunner(ToolContext(project_root=canonicalize(project_root)))
    # list_files
    lf = runner.run("list_files", {"include_globs": ["**/*.md", "**/*.py"], "max_results": 5})
    print("list_files:", json.dumps(lf)[:400])
    # grep_search (search for 'tailwind' mentions)
    gs = runner.run("grep_search", {"pattern": r"tailwind", "include_globs": ["**/*.{html,tsx,ts,js,md}"]})
    print("grep_search:", json.dumps(gs)[:400])
    # create temp html using write_file
    temp_rel = "tmp_agent_test/test_page.html"
    html = """<!doctype html>
<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n  <title>Agent Test</title>\n  <script src=\"https://cdn.tailwindcss.com\"></script>\n</head>\n<body class=\"min-h-screen bg-white text-gray-900\">\n  <main class=\"container mx-auto p-6\">\n    <h1 class=\"text-2xl font-bold\">Hello</h1>\n  </main>\n</body>\n</html>\n"""
    ch = runner.run("write_file", {"path": temp_rel, "content": html, "overwrite": True, "create_dirs": True})
    print("write_file (html):", json.dumps(ch)[:400])
    # read it back
    rf = runner.run("read_file", {"path": temp_rel, "max_bytes": 1000})
    print("read_file:", json.dumps(rf)[:400])
    # modify it
    mf = runner.run("modify_file", {"path": temp_rel, "find": "Hello", "replace": "Hello, World!", "is_regex": False})
    print("modify_file:", json.dumps(mf)[:400])
    return 0


def parse_args(argv: List[str]) -> argparse.Namespace:
    """CLI args parser for the HTML + Tailwind agent."""
    p = argparse.ArgumentParser(description="HTML + Tailwind agent using OpenAI function calling")
    p.add_argument("--root", required=True, help="Project root directory")
    p.add_argument("--objective", help="Objective/instructions for the agent")
    p.add_argument("--model", default="gpt-5", help="OpenAI model (supports tools)")
    p.add_argument("--max-steps", type=int, default=20, help="Max tool-call steps")
    p.add_argument("--tools-smoke-test", action="store_true", help="Run tool tests without calling OpenAI")
    p.add_argument(
        "--log-level",
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"],
        help="Logging verbosity",
    )
    p.add_argument(
        "--log-file",
        default=None,
        help="Optional path to write logs to a file (in addition to console)",
    )
    return p.parse_args(argv)


def main(argv: List[str]) -> int:
    """Program entrypoint. Configures logging, validates inputs, and executes the agent."""
    args = parse_args(argv)
    # Configure logging once per process
    if not logging.getLogger().handlers:
        logging.basicConfig(
            level=getattr(logging, args.log_level.upper(), logging.INFO),
            format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        )
    else:
        logging.getLogger().setLevel(getattr(logging, args.log_level.upper(), logging.INFO))

    # If a log file is requested, attach a FileHandler
    if args.log_file:
        try:
            log_dir = os.path.dirname(os.path.realpath(args.log_file))
            if log_dir and not os.path.exists(log_dir):
                os.makedirs(log_dir, exist_ok=True)
            file_handler = logging.FileHandler(args.log_file, encoding="utf-8")
            file_handler.setLevel(getattr(logging, args.log_level.upper(), logging.INFO))
            formatter = logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s")
            file_handler.setFormatter(formatter)
            logging.getLogger().addHandler(file_handler)
            logger.info("File logging enabled: %s", args.log_file)
        except Exception as e:
            logger.error("Failed to set up file logging at %s: %s", args.log_file, e)

    project_root = canonicalize(args.root)
    if not os.path.isdir(project_root):
        print(f"Project root not found: {project_root}", file=sys.stderr)
        return 2

    if args.tools_smoke_test:
        logger.info("Running tools smoke test for root: %s", project_root)
        return run_tools_smoke_test(project_root)

    if not args.objective:
        print("--objective is required unless --tools-smoke-test is used", file=sys.stderr)
        return 2

    config = AgentConfig(model=args.model, max_steps=args.max_steps)
    agent = HtmlTailwindAgent(project_root, config)
    logger.info("Initialized agent with model=%s root=%s", config.model, project_root)
    result = agent.run_objective(args.objective)
    print(result.get("final", ""))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

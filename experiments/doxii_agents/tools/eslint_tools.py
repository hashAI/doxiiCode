"""
ESLint-based validation tools for Architect Agent.

These tools provide industry-standard JavaScript/TypeScript validation
with comprehensive import/export checking using ESLint + eslint-plugin-import.
"""

from agents import function_tool, RunContextWrapper
from ..context import DoxiiContext
from ..validators.eslint_validator import (
    validate_with_eslint,
    check_imports_with_eslint
)


@function_tool
async def validate_project_with_eslint(
    ctx: RunContextWrapper[DoxiiContext]
) -> str:
    """
    Run ESLint on the entire project to find critical code errors.

    This is the PRIMARY validation tool. Use it to find:
    - Syntax errors
    - Missing imports/exports
    - Unresolved modules
    - Incorrect import paths
    - Circular dependencies
    - Critical code issues

    ⚠️ NOTE: Warnings are IGNORED (--quiet flag). Only errors are reported.

    Call this AFTER generating files to detect issues, then fix them iteratively
    until all errors are resolved.

    Args:
        None (validates entire project in chat_root)

    Returns:
        JSON string with validation results:
        {
            "is_valid": bool,
            "error_count": int,
            "errors": [
                {
                    "file": "components/product-card.js",
                    "line": 5,
                    "column": 21,
                    "message": "'formatCurrency' is not exported from '../assets/utils.js'",
                    "rule": "import/named",
                    "severity": "error"
                }
            ],
            "warnings": [],  // Always empty (ignored)
            "summary": "ESLint found X errors (warnings ignored)",
            "total_diagnostics": int
        }

    Workflow:
    1. Generate your files
    2. Call validate_project_with_eslint()
    3. If errors found, fix them one by one
    4. Call validate_project_with_eslint() again
    5. Repeat until is_valid: true and error_count: 0
    """
    project_root = ctx.context.chat_root
    return validate_with_eslint(project_root)


@function_tool
async def validate_file_imports_with_eslint(
    ctx: RunContextWrapper[DoxiiContext],
    file_path: str
) -> str:
    """
    Check imports in a specific JavaScript file using ESLint.

    Use this for focused import validation on a single file.
    ESLint will detect:
    - Missing exports in imported modules
    - Unresolved module paths
    - Incorrect import names

    Args:
        file_path: Relative path to file (e.g., "components/header.js")

    Returns:
        JSON string with import validation results:
        {
            "is_valid": bool,
            "import_errors": [
                {
                    "file": "components/product-card.js",
                    "line": 5,
                    "message": "'formatCurrency' is not exported from '../assets/utils.js'",
                    "rule": "import/named"
                }
            ],
            "import_warnings": [],
            "summary": "Found X import-related errors, Y warnings"
        }
    """
    import os
    project_root = ctx.context.chat_root
    full_path = os.path.join(project_root, file_path)
    return check_imports_with_eslint(full_path)


# Export ESLint tools
ESLINT_TOOLS = [
    validate_project_with_eslint,
    validate_file_imports_with_eslint
]

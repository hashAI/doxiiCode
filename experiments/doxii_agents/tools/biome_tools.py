"""
Biome validation function tools for architect agent.

These tools provide Rust-based JavaScript/TypeScript validation without requiring Node.js.
Biome is 25x faster than ESLint and provides excellent import/export validation.
"""

import json
from agents import function_tool, RunContextWrapper
from ..context import DoxiiContext
from ..validators.biome_validator import (
    validate_with_biome as _validate_with_biome,
    check_imports_with_biome as _check_imports_with_biome
)


@function_tool
async def validate_with_biome(
    ctx: RunContextWrapper[DoxiiContext],
    project_dir: str
) -> str:
    """
    Run Biome linter (Rust-based, extremely fast, no Node.js required) on entire project.

    **When to use this tool:**
    - After generating all files to get additional validation layer
    - To catch import errors and missing imports that Python validators might miss
    - To validate JavaScript/TypeScript syntax and code quality
    - Before declaring project complete

    **What Biome checks:**
    - Missing imports (variables used but not imported)
    - Import errors (invalid paths, unresolved modules)
    - Syntax errors (brackets, braces, semicolons)
    - Code quality issues (unused variables, dead code)
    - Export/import matching

    **Advantages over Python validators:**
    - 25x faster than ESLint
    - Industry-standard Rust-based linting
    - Catches edge cases Python regex can't detect
    - Provides detailed error messages with line numbers

    **Returns JSON with:**
    - is_valid: boolean (true if no errors)
    - errors: list of error objects with file, line, column, message, rule
    - warnings: list of warning objects
    - summary: string description of findings

    **Example usage:**
    Call this after writing all files to ensure the project is error-free.
    If errors are found, fix them and re-validate.

    Args:
        project_dir: Path to project directory to validate (e.g., '/path/to/generated/store')
    """
    try:
        result = _validate_with_biome(project_dir)
        return json.dumps(result)
    except Exception as e:
        return json.dumps({"error": str(e), "is_valid": False})


@function_tool
async def check_imports_with_biome(
    ctx: RunContextWrapper[DoxiiContext],
    file_path: str
) -> str:
    """
    Check imports in a specific JavaScript file using Biome linter.

    **When to use this tool:**
    - Before writing a file to validate import statements
    - After modifying a file to ensure imports are correct
    - When debugging import-related issues
    - To verify module resolution

    **What this checks:**
    - Missing imports (variables used but not imported)
    - Unused imports (imported but never used)
    - Invalid import paths (typos, wrong relative paths)
    - Module resolution errors (file doesn't exist)
    - Circular dependencies

    **Returns JSON with:**
    - is_valid: boolean (true if no import errors)
    - import_errors: list of import-related errors
    - import_warnings: list of import-related warnings
    - summary: string description

    **Example usage:**
    Before writing a component file, validate its imports to ensure all dependencies are correct.

    Args:
        file_path: Path to JavaScript file to check (e.g., '/path/to/component.js')
    """
    try:
        result = _check_imports_with_biome(file_path)
        return json.dumps(result)
    except Exception as e:
        return json.dumps({"error": str(e), "is_valid": False})


# Export list of biome validation tools
BIOME_TOOLS = [
    validate_with_biome,
    check_imports_with_biome
]


# Export everything
__all__ = ['validate_with_biome', 'check_imports_with_biome', 'BIOME_TOOLS']




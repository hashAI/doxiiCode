"""
Code Validation Utilities for Agent-Generated Projects

Provides automated validation of generated e-commerce stores to catch
common errors like import mismatches, missing files, and syntax issues.
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple


def extract_exports(file_path: str) -> List[str]:
    """
    Extract all exported function names from a JavaScript file.

    Args:
        file_path: Path to JavaScript file

    Returns:
        List of exported function names
    """
    if not os.path.exists(file_path):
        return []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    exports = []

    # Pattern 1: export function name()
    exports.extend(re.findall(r'export\s+function\s+(\w+)', content))

    # Pattern 2: export const name =
    exports.extend(re.findall(r'export\s+const\s+(\w+)', content))

    # Pattern 3: export class Name
    exports.extend(re.findall(r'export\s+class\s+(\w+)', content))

    # Pattern 4: export { name1, name2 }
    export_blocks = re.findall(r'export\s+\{([^}]+)\}', content)
    for block in export_blocks:
        names = [name.strip().split(' as ')[0] for name in block.split(',')]
        exports.extend(names)

    return list(set(exports))  # Remove duplicates


def extract_imports(file_path: str) -> List[Tuple[str, str]]:
    """
    Extract all imports from a JavaScript file.

    Args:
        file_path: Path to JavaScript file

    Returns:
        List of (imported_name, source_module) tuples
    """
    if not os.path.exists(file_path):
        return []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    imports = []

    # Pattern: import { name1, name2 } from 'source'
    import_pattern = r'import\s+\{([^}]+)\}\s+from\s+[\'"]([^\'"]+)[\'"]'
    matches = re.finditer(import_pattern, content)

    for match in matches:
        names = [name.strip() for name in match.group(1).split(',')]
        source = match.group(2)
        for name in names:
            imports.append((name, source))

    # Pattern: import name from 'source'
    default_import_pattern = r'import\s+(\w+)\s+from\s+[\'"]([^\'"]+)[\'"]'
    matches = re.finditer(default_import_pattern, content)
    for match in matches:
        imports.append((match.group(1), match.group(2)))

    return imports


def extract_component_imports(file_path: str) -> List[str]:
    """
    Extract component file paths imported in app.js.

    Args:
        file_path: Path to app.js

    Returns:
        List of component file paths
    """
    if not os.path.exists(file_path):
        return []

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern: import './path/to/component.js'
    # or import '../components/component.js'
    import_pattern = r'import\s+[\'"](\.\./(?:components|pages)/[^\'"]+)[\'"]'
    return re.findall(import_pattern, content)


def validate_imports(project_path: str) -> Tuple[bool, List[Dict]]:
    """
    Validate that all imports in app.js match available exports.

    Args:
        project_path: Path to project directory

    Returns:
        Tuple of (is_valid, list_of_issues)
    """
    issues = []

    app_js = os.path.join(project_path, "assets", "app.js")
    if not os.path.exists(app_js):
        issues.append({
            "type": "missing_file",
            "file": "assets/app.js",
            "message": "app.js not found"
        })
        return False, issues

    # Get imports from app.js
    imports = extract_imports(app_js)

    # Check each import source
    for imported_name, source in imports:
        # Resolve relative path
        if source.startswith('./'):
            # ./router.js -> assets/router.js
            source_path = os.path.join(project_path, "assets", source[2:])
        elif source.startswith('../'):
            # ../components/header.js -> components/header.js
            source_path = os.path.join(project_path, source[3:])
        else:
            # External import (CDN, etc.) - skip validation
            continue

        if not os.path.exists(source_path):
            issues.append({
                "type": "missing_module",
                "file": app_js,
                "imported": imported_name,
                "source": source,
                "message": f"Module '{source}' not found at {source_path}"
            })
            continue

        # Check if imported name exists in exports
        exports = extract_exports(source_path)

        if imported_name not in exports:
            issues.append({
                "type": "import_mismatch",
                "file": app_js,
                "imported": imported_name,
                "source": source,
                "available_exports": exports,
                "message": f"'{imported_name}' is not exported by '{source}'. Available: {', '.join(exports)}"
            })

    return len(issues) == 0, issues


def validate_component_files(project_path: str) -> Tuple[bool, List[Dict]]:
    """
    Validate that all imported component files exist.

    Args:
        project_path: Path to project directory

    Returns:
        Tuple of (is_valid, list_of_issues)
    """
    issues = []

    app_js = os.path.join(project_path, "assets", "app.js")
    if not os.path.exists(app_js):
        return False, [{"type": "missing_file", "message": "app.js not found"}]

    # Get component imports
    component_paths = extract_component_imports(app_js)

    for component_path in component_paths:
        # Resolve relative path (from app.js perspective)
        # ../components/header.js -> components/header.js
        resolved_path = os.path.join(project_path, component_path[3:])

        if not os.path.exists(resolved_path):
            issues.append({
                "type": "missing_component",
                "file": app_js,
                "component": component_path,
                "message": f"Component file not found: {component_path}"
            })

    return len(issues) == 0, issues


def validate_required_files(project_path: str) -> Tuple[bool, List[Dict]]:
    """
    Validate that all required files exist in the project.

    Args:
        project_path: Path to project directory

    Returns:
        Tuple of (is_valid, list_of_issues)
    """
    required_files = [
        "index.html",
        "assets/app.js",
        "assets/state.js",
        "assets/router.js",  # Infrastructure
        "assets/utils.js",   # Infrastructure
        "components/base-component.js",  # Infrastructure
        "pages/page-home.js",
        "pages/page-catalog.js",
        "pages/page-product.js",
        "pages/page-cart.js",
        "pages/page-checkout.js",
    ]

    issues = []

    for file_path in required_files:
        full_path = os.path.join(project_path, file_path)
        if not os.path.exists(full_path):
            issues.append({
                "type": "missing_required_file",
                "file": file_path,
                "message": f"Required file missing: {file_path}"
            })

    return len(issues) == 0, issues


def validate_javascript_syntax(file_path: str) -> Tuple[bool, str]:
    """
    Basic JavaScript syntax validation.

    Args:
        file_path: Path to JavaScript file

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not os.path.exists(file_path):
        return False, "File not found"

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check for common syntax errors

    # 1. Unclosed template literals
    backtick_count = content.count('`')
    if backtick_count % 2 != 0:
        return False, "Unclosed template literal (backtick)"

    # 2. Unclosed braces
    if content.count('{') != content.count('}'):
        return False, f"Mismatched braces ({{ vs }}): {content.count('{')} vs {content.count('}')}"

    # 3. Unclosed brackets
    if content.count('[') != content.count(']'):
        return False, f"Mismatched brackets ([ vs ]): {content.count('[')} vs {content.count(']')}"

    # 4. Unclosed parentheses
    if content.count('(') != content.count(')'):
        return False, f"Mismatched parentheses (( vs )): {content.count('(')} vs {content.count(')')}"

    return True, ""


def validate_all_syntax(project_path: str) -> Tuple[bool, List[Dict]]:
    """
    Validate syntax of all JavaScript files in the project.

    Args:
        project_path: Path to project directory

    Returns:
        Tuple of (is_valid, list_of_issues)
    """
    issues = []

    # Find all .js files
    project = Path(project_path)
    js_files = list(project.glob("**/*.js"))

    for js_file in js_files:
        is_valid, error = validate_javascript_syntax(str(js_file))
        if not is_valid:
            issues.append({
                "type": "syntax_error",
                "file": str(js_file.relative_to(project)),
                "message": error
            })

    return len(issues) == 0, issues


def validate_generated_project(project_path: str) -> Dict:
    """
    Run all validation checks on a generated project.

    Args:
        project_path: Path to project directory

    Returns:
        Dictionary with validation results
    """
    results = {
        "valid": True,
        "checks": {},
        "issues": [],
        "summary": ""
    }

    # Check 1: Required files
    is_valid, issues = validate_required_files(project_path)
    results["checks"]["required_files"] = {
        "pass": is_valid,
        "issues": issues
    }
    if not is_valid:
        results["valid"] = False
        results["issues"].extend(issues)

    # Check 2: Import validation
    is_valid, issues = validate_imports(project_path)
    results["checks"]["imports"] = {
        "pass": is_valid,
        "issues": issues
    }
    if not is_valid:
        results["valid"] = False
        results["issues"].extend(issues)

    # Check 3: Component files
    is_valid, issues = validate_component_files(project_path)
    results["checks"]["component_files"] = {
        "pass": is_valid,
        "issues": issues
    }
    if not is_valid:
        results["valid"] = False
        results["issues"].extend(issues)

    # Check 4: Syntax validation
    is_valid, issues = validate_all_syntax(project_path)
    results["checks"]["syntax"] = {
        "pass": is_valid,
        "issues": issues
    }
    if not is_valid:
        results["valid"] = False
        results["issues"].extend(issues)

    # Generate summary
    if results["valid"]:
        results["summary"] = "✅ All validation checks passed!"
    else:
        issue_count = len(results["issues"])
        results["summary"] = f"❌ Validation failed with {issue_count} issue(s)"

    return results


def format_validation_report(results: Dict) -> str:
    """
    Format validation results as a human-readable report.

    Args:
        results: Validation results from validate_generated_project

    Returns:
        Formatted report string
    """
    lines = []
    lines.append("=" * 60)
    lines.append("VALIDATION REPORT")
    lines.append("=" * 60)
    lines.append("")

    # Overall status
    status_icon = "✅" if results["valid"] else "❌"
    lines.append(f"Overall Status: {status_icon} {results['summary']}")
    lines.append("")

    # Individual checks
    for check_name, check_data in results["checks"].items():
        check_icon = "✅" if check_data["pass"] else "❌"
        check_label = check_name.replace("_", " ").title()
        lines.append(f"{check_icon} {check_label}: {'PASS' if check_data['pass'] else 'FAIL'}")

        if not check_data["pass"] and check_data["issues"]:
            for issue in check_data["issues"]:
                lines.append(f"   - {issue['message']}")
                if 'available_exports' in issue:
                    lines.append(f"     Available exports: {', '.join(issue['available_exports'])}")
            lines.append("")

    lines.append("=" * 60)

    return "\n".join(lines)


if __name__ == "__main__":
    # Example usage
    import sys

    if len(sys.argv) < 2:
        print("Usage: python validation.py <project_path>")
        sys.exit(1)

    project_path = sys.argv[1]

    print(f"Validating project: {project_path}\n")

    results = validate_generated_project(project_path)
    report = format_validation_report(results)

    print(report)

    # Exit with error code if validation failed
    sys.exit(0 if results["valid"] else 1)

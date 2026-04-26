"""
ESLint-based JavaScript/TypeScript validation with import/export checking.
Provides comprehensive import resolution and module validation.

ESLint with eslint-plugin-import can detect:
- Missing imports/exports
- Unresolved modules
- Incorrect import paths
- Circular dependencies
- Unused imports
"""

import subprocess
import json
import os
from pathlib import Path
from typing import Dict, List, Optional


class ESLintValidator:
    """
    Validates JavaScript/TypeScript files using ESLint with import plugin.
    """

    def __init__(self, eslint_path: Optional[str] = None):
        """
        Initialize ESLint validator.

        Args:
            eslint_path: Path to eslint executable (default: auto-detect)
        """
        if eslint_path:
            self.eslint_cmd = eslint_path.split() if isinstance(eslint_path, str) else [eslint_path]
        else:
            # Auto-detect eslint binary location
            self.eslint_cmd = self._find_eslint_binary()

        if not self.eslint_cmd:
            raise RuntimeError(
                "ESLint not found. Please install ESLint or provide path: npm install -g eslint eslint-plugin-import"
            )

    def _find_eslint_binary(self) -> Optional[List[str]]:
        """
        Auto-detect ESLint binary location.

        Returns:
            List[str]: Command list for eslint or None if not found
        """
        # Check if eslint is in PATH
        try:
            result = subprocess.run(
                ["npx", "eslint", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                return ["npx", "eslint"]
        except:
            pass

        # Fallback to just eslint if npx eslint doesn't work
        try:
            result = subprocess.run(
                ["eslint", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                return ["eslint"]
        except:
            pass

        # Check local node_modules
        local_eslint = Path("node_modules/.bin/eslint")
        if local_eslint.exists():
            return [str(local_eslint)]

        return None

    def validate_project(self, project_dir: str) -> Dict:
        """
        Run ESLint on entire project directory.

        Args:
            project_dir: Path to project directory

        Returns:
            dict: Validation results with errors only (warnings ignored)
        """
        try:
            # --quiet flag ignores warnings, only reports errors
            # Run ESLint from the project directory so it can find local config files
            project_path = Path(project_dir).resolve()
            cmd = self.eslint_cmd + ["--format=json", "--no-ignore", "--quiet", "."]
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=str(project_path),
                timeout=60
            )

            if result.stdout:
                try:
                    data = json.loads(result.stdout)
                    return self._parse_eslint_output(data, project_dir)
                except json.JSONDecodeError:
                    # ESLint might output non-JSON if no issues found
                    if result.returncode == 0:
                        return {
                            "is_valid": True,
                            "errors": [],
                            "warnings": [],
                            "summary": "No issues found by ESLint"
                        }

            return {
                "is_valid": result.returncode == 0,
                "errors": [] if result.returncode == 0 else ["ESLint validation failed"],
                "warnings": [],
                "summary": "No issues found" if result.returncode == 0 else "Validation failed"
            }

        except subprocess.TimeoutExpired:
            return {
                "is_valid": False,
                "errors": ["ESLint validation timed out after 60 seconds"],
                "warnings": [],
                "summary": "Validation timeout"
            }
        except Exception as e:
            return {
                "is_valid": False,
                "errors": [f"ESLint validation error: {str(e)}"],
                "warnings": [],
                "summary": "Validation error"
            }

    def validate_file(self, file_path: str) -> Dict:
        """
        Run ESLint on a single file.

        Args:
            file_path: Path to JavaScript/TypeScript file

        Returns:
            dict: Validation results with errors only (warnings ignored)
        """
        try:
            # --quiet flag ignores warnings, only reports errors
            cmd = self.eslint_cmd + ["--format=json", "--quiet", file_path]
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=15
            )

            if result.stdout:
                try:
                    data = json.loads(result.stdout)
                    return self._parse_eslint_output(data, str(Path(file_path).parent))
                except json.JSONDecodeError:
                    if result.returncode == 0:
                        return {
                            "is_valid": True,
                            "errors": [],
                            "warnings": [],
                            "summary": "No issues found"
                        }

            return {
                "is_valid": result.returncode == 0,
                "errors": [],
                "warnings": [],
                "summary": "No issues found"
            }

        except Exception as e:
            return {
                "is_valid": False,
                "errors": [f"ESLint validation error: {str(e)}"],
                "warnings": [],
                "summary": "Validation error"
            }

    def _parse_eslint_output(self, data: List, base_path: str) -> Dict:
        """
        Parse ESLint JSON output into standardized format.

        Args:
            data: Raw ESLint JSON output
            base_path: Base path for relative file paths

        Returns:
            dict: Standardized validation results
        """
        errors = []
        warnings = []

        for file_result in data:
            if not isinstance(file_result, dict):
                continue

            file_path = file_result.get('filePath', 'unknown')
            messages = file_result.get('messages', [])

            for message in messages:
                if not isinstance(message, dict):
                    continue

                severity = message.get('severity', 1)  # 1=warning, 2=error
                rule_id = message.get('ruleId', 'unknown')
                line = message.get('line', 0)
                column = message.get('column', 0)
                text = message.get('message', 'Unknown error')

                error_obj = {
                    "file": os.path.relpath(file_path, base_path) if os.path.isabs(file_path) else file_path,
                    "line": line,
                    "column": column,
                    "message": text,
                    "rule": rule_id,
                    "severity": "error" if severity == 2 else "warning"
                }

                if severity == 2:
                    errors.append(error_obj)
                else:
                    warnings.append(error_obj)

        return {
            "is_valid": len(errors) == 0,
            "error_count": len(errors),
            "errors": errors,
            "warnings": [],  # Warnings ignored with --quiet flag
            "summary": f"ESLint found {len(errors)} errors (warnings ignored)",
            "total_diagnostics": len(errors)
        }

    def check_imports(self, file_path: str) -> Dict:
        """
        Specifically check for import-related issues.

        Args:
            file_path: Path to JavaScript file

        Returns:
            dict: Import validation results
        """
        result = self.validate_file(file_path)

        # Filter for import-related errors
        import_keywords = ['import', 'export', 'module', 'require', 'resolve']
        import_rules = ['import/', 'no-unresolved', 'named', 'default', 'namespace']

        import_errors = [
            err for err in result.get('errors', [])
            if any(keyword in err['message'].lower() for keyword in import_keywords) or
               any(rule in err['rule'] for rule in import_rules)
        ]

        import_warnings = [
            warn for warn in result.get('warnings', [])
            if any(keyword in warn['message'].lower() for keyword in import_keywords) or
               any(rule in warn['rule'] for rule in import_rules)
        ]

        return {
            "is_valid": len(import_errors) == 0,
            "import_errors": import_errors,
            "import_warnings": import_warnings,
            "summary": f"Found {len(import_errors)} import-related errors, {len(import_warnings)} warnings"
        }

    def get_version(self) -> str:
        """
        Get ESLint version.

        Returns:
            str: ESLint version string
        """
        try:
            result = subprocess.run(
                self.eslint_cmd + ["--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.stdout.strip()
        except Exception as e:
            return f"Unknown (error: {str(e)})"


def validate_with_eslint(project_dir: str) -> str:
    """
    Function tool: Validate project using ESLint with import plugin.

    This tool provides comprehensive import/export validation.
    ESLint with eslint-plugin-import can detect:
    - Missing imports/exports
    - Unresolved modules
    - Incorrect import paths
    - Circular dependencies
    - Critical syntax errors

    ⚠️ NOTE: Uses --quiet flag to ignore warnings, only reports errors.

    Args:
        project_dir: Path to project directory

    Returns:
        str: JSON string with validation results

    Example return:
        {
            "is_valid": false,
            "error_count": 1,
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
            "warnings": [],
            "summary": "ESLint found 1 errors (warnings ignored)"
        }
    """
    try:
        validator = ESLintValidator()
        result = validator.validate_project(project_dir)
        return json.dumps(result, indent=2)
    except Exception as e:
        return json.dumps({
            "is_valid": False,
            "errors": [f"Failed to run ESLint validator: {str(e)}"],
            "warnings": [],
            "summary": "Validator initialization failed"
        }, indent=2)


def check_imports_with_eslint(file_path: str) -> str:
    """
    Function tool: Check imports in a JavaScript file using ESLint.

    Use this to specifically validate import statements in a file.
    ESLint will detect missing exports, unresolved modules, and import path issues.

    Args:
        file_path: Path to JavaScript file

    Returns:
        str: JSON string with import validation results

    Example return:
        {
            "is_valid": false,
            "import_errors": [
                {
                    "file": "components/product-card.js",
                    "line": 5,
                    "message": "'formatCurrency' is not exported from '../assets/utils.js'",
                    "rule": "import/named"
                }
            ],
            "import_warnings": [],
            "summary": "Found 1 import-related errors, 0 warnings"
        }
    """
    try:
        validator = ESLintValidator()
        result = validator.check_imports(file_path)
        return json.dumps(result, indent=2)
    except Exception as e:
        return json.dumps({
            "is_valid": False,
            "import_errors": [f"Failed to run ESLint validator: {str(e)}"],
            "import_warnings": [],
            "summary": "Validator initialization failed"
        }, indent=2)


# For testing
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Validate JavaScript/TypeScript with ESLint")
    parser.add_argument("project_dir", help="Path to project directory")
    parser.add_argument("--version", action="store_true", help="Show ESLint version")

    args = parser.parse_args()

    try:
        validator = ESLintValidator()

        if args.version:
            print(f"ESLint version: {validator.get_version()}")
            exit(0)

        print(f"🔍 Validating with ESLint: {args.project_dir}")
        result = validator.validate_project(args.project_dir)

        if result["is_valid"]:
            print("✅ ESLint validation PASSED")
        else:
            print("❌ ESLint validation FAILED")

        if result["errors"]:
            print(f"🚨 Found {len(result['errors'])} errors:")
            for error in result["errors"]:
                print(f"   🔴 {error['file']}:{error['line']}:{error['column']} - {error['message']}")

        if result["warnings"]:
            print(f"⚠️ Found {len(result['warnings'])} warnings:")
            for warning in result["warnings"]:
                print(f"   🟡 {warning['file']}:{warning['line']}:{warning['column']} - {warning['message']}")

        print("-" * 60)
        print(result["summary"])

    except Exception as e:
        print(f"❌ Error: {str(e)}")

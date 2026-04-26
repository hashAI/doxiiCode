"""
JavaScript Syntax Validator for Generated Code

This utility checks generated JavaScript code for common syntax errors
and anti-patterns, particularly focusing on issues that specialized agents
might introduce.

Primary use case: Post-generation validation to catch syntax errors before
code is written to files.
"""

import re
from typing import List, Dict, Tuple


class JavaScriptValidator:
    """Validates JavaScript code for common syntax errors and anti-patterns."""

    def __init__(self):
        self.errors: List[Dict[str, any]] = []
        self.warnings: List[Dict[str, any]] = []

    def validate(self, code: str, filename: str = "unknown") -> Dict[str, any]:
        """
        Validate JavaScript code and return results.

        Args:
            code: JavaScript code to validate
            filename: Name of the file being validated (for reporting)

        Returns:
            Dictionary with 'errors', 'warnings', and 'is_valid' keys
        """
        self.errors = []
        self.warnings = []

        # Run all validation checks
        self._check_optional_chaining_assignment(code, filename)
        self._check_template_literals_in_classes(code, filename)
        self._check_unsafe_dom_operations(code, filename)
        self._check_event_handler_binding(code, filename)

        return {
            "errors": self.errors,
            "warnings": self.warnings,
            "is_valid": len(self.errors) == 0,
            "filename": filename
        }

    def _check_optional_chaining_assignment(self, code: str, filename: str):
        """
        Check for optional chaining on the left side of assignment operators.

        This is INVALID JavaScript:
            element?.value = '';
            obj?.prop = 'value';
            this.renderRoot?.querySelector('#id').value = '';
        """
        # Pattern: optional chaining followed by assignment
        # Matches: ?.something = or ?.something.property = or ?.method().property =
        pattern = r'\?\.[a-zA-Z_$][\w$]*(?:\([^)]*\))?(?:\.[a-zA-Z_$][\w$]*)*\s*='

        lines = code.split('\n')
        for line_num, line in enumerate(lines, 1):
            # Skip comments
            if line.strip().startswith('//') or line.strip().startswith('*'):
                continue

            # Skip comparison operators (===, !==, ==, !=, <=, >=)
            if re.search(r'[=!<>]=', line):
                # Check if this is a comparison or assignment
                # If it has comparison operators, skip checking this line
                if any(op in line for op in ['===', '!==', '==', '!=', '<=', '>=']):
                    continue

            matches = re.finditer(pattern, line)
            for match in matches:
                # Extract context around the match
                start = max(0, match.start() - 20)
                end = min(len(line), match.end() + 20)
                context = line[start:end].strip()

                self.errors.append({
                    "type": "optional_chaining_assignment",
                    "severity": "error",
                    "message": "Optional chaining (?.) cannot be used on left side of assignment",
                    "line": line_num,
                    "code": context,
                    "fix": "Store reference first, check if truthy, then assign",
                    "filename": filename
                })

    def _check_template_literals_in_classes(self, code: str, filename: str):
        """
        Check for template literals in Tailwind class strings.

        Tailwind CSS won't work with template literals like:
            class="text-${color}"
            class="bg-${primaryColor}"
        """
        # Pattern: class="...${...}..." or class='...${...}...'
        pattern = r'class\s*=\s*["\'][^"\']*\$\{[^}]+\}[^"\']*["\']'

        lines = code.split('\n')
        for line_num, line in enumerate(lines, 1):
            if 'class=' in line and '${' in line:
                matches = re.finditer(pattern, line)
                for match in matches:
                    self.errors.append({
                        "type": "template_literal_in_class",
                        "severity": "error",
                        "message": "Template literals in class strings won't work with Tailwind CSS",
                        "line": line_num,
                        "code": match.group(0),
                        "fix": "Use actual static Tailwind class names instead of template literals",
                        "filename": filename
                    })

    def _check_unsafe_dom_operations(self, code: str, filename: str):
        """
        Check for potentially unsafe DOM operations without null checks.

        Warns about patterns like:
            this.querySelector('#id').value (without ?. or null check)
        """
        # This is a warning, not an error, as it might be safe in some contexts
        pattern = r'querySelector\([^)]+\)\.[a-zA-Z_$][\w$]*\s*='

        lines = code.split('\n')
        for line_num, line in enumerate(lines, 1):
            # Skip if already using optional chaining
            if '?.' in line:
                continue

            matches = re.finditer(pattern, line)
            for match in matches:
                self.warnings.append({
                    "type": "unsafe_dom_operation",
                    "severity": "warning",
                    "message": "DOM operation without null check - element might not exist",
                    "line": line_num,
                    "code": match.group(0),
                    "fix": "Store reference and check if truthy before accessing properties",
                    "filename": filename
                })

    def _check_event_handler_binding(self, code: str, filename: str):
        """
        Check for potential 'this' binding issues in event handlers.

        Warns about patterns like:
            @click=${this.handleClick}

        Should be:
            @click=${(e) => this.handleClick(e)}
        """
        # Pattern: @event=${this.method} without arrow function wrapper
        pattern = r'@[a-z]+\s*=\s*\$\{\s*this\.[a-zA-Z_$][\w$]*\s*\}'

        lines = code.split('\n')
        for line_num, line in enumerate(lines, 1):
            matches = re.finditer(pattern, line)
            for match in matches:
                # Skip if method is already defined as arrow function (we can't detect this reliably)
                # So this is just a warning
                self.warnings.append({
                    "type": "event_handler_binding",
                    "severity": "warning",
                    "message": "Event handler might lose 'this' context",
                    "line": line_num,
                    "code": match.group(0),
                    "fix": "Use arrow function wrapper: @click=${(e) => this.handleClick(e)}",
                    "filename": filename
                })


def validate_javascript_file(filepath: str) -> Dict[str, any]:
    """
    Validate a JavaScript file and return results.

    Args:
        filepath: Path to JavaScript file

    Returns:
        Validation results dictionary
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    validator = JavaScriptValidator()
    return validator.validate(code, filepath)


def validate_javascript_code(code: str, filename: str = "generated.js") -> Dict[str, any]:
    """
    Validate JavaScript code string and return results.

    Args:
        code: JavaScript code to validate
        filename: Name for reporting purposes

    Returns:
        Validation results dictionary
    """
    validator = JavaScriptValidator()
    return validator.validate(code, filename)


def format_validation_results(results: Dict[str, any]) -> str:
    """
    Format validation results into a readable string.

    Args:
        results: Results from validate()

    Returns:
        Formatted string report
    """
    lines = []

    lines.append(f"JavaScript Validation Report: {results['filename']}")
    lines.append("=" * 70)

    if results['is_valid']:
        lines.append("✅ No errors found!")
    else:
        lines.append(f"❌ Found {len(results['errors'])} error(s)")

    if results['warnings']:
        lines.append(f"⚠️  Found {len(results['warnings'])} warning(s)")

    lines.append("")

    # Show errors
    if results['errors']:
        lines.append("ERRORS:")
        lines.append("-" * 70)
        for i, error in enumerate(results['errors'], 1):
            lines.append(f"{i}. [{error['type']}] Line {error['line']}")
            lines.append(f"   {error['message']}")
            lines.append(f"   Code: {error['code']}")
            lines.append(f"   Fix: {error['fix']}")
            lines.append("")

    # Show warnings
    if results['warnings']:
        lines.append("WARNINGS:")
        lines.append("-" * 70)
        for i, warning in enumerate(results['warnings'], 1):
            lines.append(f"{i}. [{warning['type']}] Line {warning['line']}")
            lines.append(f"   {warning['message']}")
            lines.append(f"   Code: {warning['code']}")
            lines.append(f"   Fix: {warning['fix']}")
            lines.append("")

    return "\n".join(lines)


# Example usage for agents
def check_code_before_writing(code: str, filename: str) -> Tuple[bool, str]:
    """
    Convenience function for agents to check code before writing.

    Returns:
        Tuple of (is_safe_to_write, formatted_report)
    """
    results = validate_javascript_code(code, filename)
    report = format_validation_results(results)

    # Only block if there are errors (warnings are OK)
    is_safe = results['is_valid']

    return is_safe, report


if __name__ == "__main__":
    # Test the validator
    test_code = """
    class TestComponent extends BaseComponent {
        handleClick() {
            // ❌ ERROR: Optional chaining on left side
            this.renderRoot?.querySelector('#input').value = '';

            // ❌ ERROR: Template literal in class
            const color = 'blue';
            return html`<div class="text-${color}">Test</div>`;
        }

        render() {
            // ⚠️ WARNING: Event handler binding
            return html`<button @click=${this.handleClick}>Click</button>`;
        }
    }
    """

    is_safe, report = check_code_before_writing(test_code, "test-component.js")
    print(report)
    print(f"\nSafe to write: {is_safe}")

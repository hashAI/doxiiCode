"""
JavaScript Syntax Validator - Agent-Optimized

Validates JavaScript code for common syntax errors and anti-patterns that could break
e-commerce stores. Designed specifically for LLM agents with clear, actionable feedback.
"""

import re
from typing import Dict, List, Tuple
from dataclasses import dataclass


@dataclass
class ValidationIssue:
    """Represents a validation issue with context and fix suggestion."""
    severity: str  # 'error' or 'warning'
    line: int
    column: int
    message: str
    code_snippet: str
    suggested_fix: str
    rule: str


class JavaScriptValidator:
    """Validates JavaScript code with agent-friendly error messages."""

    def __init__(self):
        self.errors: List[ValidationIssue] = []
        self.warnings: List[ValidationIssue] = []

    def validate(self, code: str, filename: str = "file.js") -> Dict:
        """
        Validate JavaScript code and return structured results.

        Returns:
            {
                'is_valid': bool,  # False if any errors found
                'errors': List[Dict],  # Blocking issues
                'warnings': List[Dict],  # Non-blocking issues
                'summary': str  # Human-readable summary
            }
        """
        self.errors = []
        self.warnings = []

        lines = code.split('\n')

        # Run all validation checks
        self._check_bracket_matching(code, lines)
        self._check_optional_chaining_assignment(code, lines)
        self._check_template_literals_in_classes(code, lines)
        self._check_missing_semicolons(code, lines)
        self._check_unclosed_strings(code, lines)
        self._check_missing_imports(code, lines)
        self._check_undefined_variables(code, lines)
        self._check_event_handlers(code, lines)
        self._check_dom_operations(code, lines)

        # Build results
        errors_list = [self._issue_to_dict(e) for e in self.errors]
        warnings_list = [self._issue_to_dict(w) for w in self.warnings]

        is_valid = len(self.errors) == 0

        summary = self._build_summary(filename, is_valid, len(self.errors), len(self.warnings))

        return {
            'is_valid': is_valid,
            'errors': errors_list,
            'warnings': warnings_list,
            'summary': summary
        }

    def _issue_to_dict(self, issue: ValidationIssue) -> Dict:
        """Convert ValidationIssue to dictionary."""
        return {
            'severity': issue.severity,
            'line': issue.line,
            'column': issue.column,
            'message': issue.message,
            'code_snippet': issue.code_snippet,
            'suggested_fix': issue.suggested_fix,
            'rule': issue.rule
        }

    def _build_summary(self, filename: str, is_valid: bool, error_count: int, warning_count: int) -> str:
        """Build human-readable summary."""
        if is_valid:
            if warning_count > 0:
                return f"✅ {filename}: Valid with {warning_count} warning(s)"
            return f"✅ {filename}: All checks passed"
        return f"❌ {filename}: {error_count} error(s), {warning_count} warning(s)"

    def _check_bracket_matching(self, code: str, lines: List[str]):
        """Check if brackets, braces, and parentheses are properly matched."""
        stack = []
        pairs = {'(': ')', '[': ']', '{': '}'}
        closing = {')': '(', ']': '[', '}': '{'}

        # Remove strings and comments to avoid false positives
        cleaned_code = self._remove_strings_and_comments(code)

        line_num = 1
        col_num = 1

        for char in cleaned_code:
            if char == '\n':
                line_num += 1
                col_num = 1
                continue

            if char in pairs:
                stack.append((char, line_num, col_num))
            elif char in closing:
                if not stack:
                    self.errors.append(ValidationIssue(
                        severity='error',
                        line=line_num,
                        column=col_num,
                        message=f"Unexpected closing '{char}' with no matching opening",
                        code_snippet=self._get_line_snippet(lines, line_num),
                        suggested_fix=f"Remove '{char}' or add matching opening bracket",
                        rule='bracket-matching'
                    ))
                else:
                    opener, open_line, open_col = stack.pop()
                    expected = pairs[opener]
                    if char != expected:
                        self.errors.append(ValidationIssue(
                            severity='error',
                            line=line_num,
                            column=col_num,
                            message=f"Mismatched brackets: '{opener}' on line {open_line} closed with '{char}'",
                            code_snippet=self._get_line_snippet(lines, line_num),
                            suggested_fix=f"Change '{char}' to '{expected}' or fix opening bracket on line {open_line}",
                            rule='bracket-matching'
                        ))

            col_num += 1

        # Check for unclosed brackets
        if stack:
            for opener, line_num, col_num in stack:
                expected_closer = pairs[opener]
                self.errors.append(ValidationIssue(
                    severity='error',
                    line=line_num,
                    column=col_num,
                    message=f"Unclosed '{opener}' - expected closing '{expected_closer}'",
                    code_snippet=self._get_line_snippet(lines, line_num),
                    suggested_fix=f"Add closing '{expected_closer}' at the end of the block",
                    rule='bracket-matching'
                ))

    def _check_optional_chaining_assignment(self, code: str, lines: List[str]):
        """Check for invalid optional chaining on the left side of assignment."""
        # Pattern: something?.property = value
        pattern = r'(\w+)\?\.([\w\[\]\.]+)\s*='

        for i, line in enumerate(lines, 1):
            matches = re.finditer(pattern, line)
            for match in matches:
                self.errors.append(ValidationIssue(
                    severity='error',
                    line=i,
                    column=match.start() + 1,
                    message=f"Cannot use optional chaining (?.) on left side of assignment",
                    code_snippet=line.strip(),
                    suggested_fix=f"Change '{match.group(0)}' to '{match.group(1)}.{match.group(2)} =' (remove ?)",
                    rule='optional-chaining-assignment'
                ))

    def _check_template_literals_in_classes(self, code: str, lines: List[str]):
        """Check for template literals inside Tailwind class strings."""
        # Pattern: class="...${...}..."
        pattern = r'class\s*=\s*["\']([^"\']*\$\{[^"\']*)["\']'

        for i, line in enumerate(lines, 1):
            matches = re.finditer(pattern, line)
            for match in matches:
                self.errors.append(ValidationIssue(
                    severity='error',
                    line=i,
                    column=match.start() + 1,
                    message="Template literals inside class strings won't work in Lit templates",
                    code_snippet=line.strip(),
                    suggested_fix="Use ternary operator or compute classes separately before template",
                    rule='template-literal-in-class'
                ))

    def _check_missing_semicolons(self, code: str, lines: List[str]):
        """Check for likely missing semicolons (warning only)."""
        # Look for lines that should end with semicolon but don't
        patterns = [
            r'(const|let|var)\s+\w+\s*=\s*[^;{\n]+$',  # Variable declarations
            r'return\s+[^;{\n]+$',  # Return statements
            r'\w+\s*=\s*[^;{\n]+$',  # Assignments
        ]

        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if not stripped or stripped.startswith('//') or stripped.startswith('*'):
                continue

            for pattern in patterns:
                if re.search(pattern, stripped):
                    # Skip if it's part of a multi-line statement
                    if i < len(lines) and lines[i].strip().startswith('.'):
                        continue

                    self.warnings.append(ValidationIssue(
                        severity='warning',
                        line=i,
                        column=len(stripped),
                        message="Statement may be missing a semicolon",
                        code_snippet=stripped,
                        suggested_fix="Add ';' at the end of the line",
                        rule='missing-semicolon'
                    ))
                    break

    def _check_unclosed_strings(self, code: str, lines: List[str]):
        """Check for unclosed strings."""
        in_string = False
        string_char = None
        string_start_line = 0

        for i, line in enumerate(lines, 1):
            j = 0
            while j < len(line):
                char = line[j]

                # Check for escape
                if j > 0 and line[j-1] == '\\':
                    j += 1
                    continue

                if not in_string:
                    if char in ['"', "'", '`']:
                        in_string = True
                        string_char = char
                        string_start_line = i
                else:
                    if char == string_char:
                        in_string = False
                        string_char = None

                j += 1

            # Template literals can span multiple lines
            if in_string and string_char != '`':
                self.errors.append(ValidationIssue(
                    severity='error',
                    line=string_start_line,
                    column=1,
                    message=f"Unclosed string starting on line {string_start_line}",
                    code_snippet=self._get_line_snippet(lines, string_start_line),
                    suggested_fix=f"Add closing {string_char} at the end of the string",
                    rule='unclosed-string'
                ))
                in_string = False  # Reset to avoid cascading errors

    def _check_missing_imports(self, code: str, lines: List[str]):
        """Check if commonly used utilities are imported."""
        # Check for usage without import
        checks = [
            ('html`', 'lit', "import { html } from 'https://cdn.jsdelivr.net/npm/lit@3.2.1/+esm'"),
            ('cartStore', '../assets/state.js', "import { cartStore } from '../assets/state.js'"),
            ('navigateTo', '../assets/router.js', "import { navigateTo } from '../assets/router.js'"),
            ('showToast', '../assets/utils.js', "import { showToast } from '../assets/utils.js'"),
        ]

        for usage, source, import_statement in checks:
            if usage in code and f"from '{source}'" not in code and f'from "{source}"' not in code:
                # Find first usage line
                for i, line in enumerate(lines, 1):
                    if usage in line:
                        self.warnings.append(ValidationIssue(
                            severity='warning',
                            line=i,
                            column=line.index(usage) + 1,
                            message=f"Using '{usage}' without importing from '{source}'",
                            code_snippet=line.strip(),
                            suggested_fix=f"Add at top of file: {import_statement}",
                            rule='missing-import'
                        ))
                        break

    def _check_undefined_variables(self, code: str, lines: List[str]):
        """Check for common undefined variable patterns (warning only)."""
        # Look for this.property usage without definition
        pattern = r'this\.(\w+)'
        defined_props = set()

        # Find property definitions
        for line in lines:
            if re.search(r'this\.\w+\s*=', line):
                matches = re.finditer(r'this\.(\w+)\s*=', line)
                for match in matches:
                    defined_props.add(match.group(1))

        # Check usage
        for i, line in enumerate(lines, 1):
            matches = re.finditer(pattern, line)
            for match in matches:
                prop = match.group(1)
                # Skip if it's a definition or common properties
                if '=' in line[match.end():match.end()+2] or prop in ['constructor', 'render', 'connectedCallback', 'disconnectedCallback']:
                    continue
                if prop not in defined_props:
                    self.warnings.append(ValidationIssue(
                        severity='warning',
                        line=i,
                        column=match.start() + 1,
                        message=f"Property 'this.{prop}' used but never defined",
                        code_snippet=line.strip(),
                        suggested_fix=f"Define 'this.{prop}' in constructor or connectedCallback",
                        rule='undefined-property'
                    ))

    def _check_event_handlers(self, code: str, lines: List[str]):
        """Check for improperly bound event handlers."""
        # Pattern: @click=${functionName} without this. (if it's a method)
        pattern = r'@(\w+)\s*=\s*\$\{(\w+)\}'

        for i, line in enumerate(lines, 1):
            matches = re.finditer(pattern, line)
            for match in matches:
                handler = match.group(2)
                # Check if it looks like a method call (should have 'this.')
                if handler[0].islower() and handler != 'this' and 'this.' not in match.group(0):
                    self.warnings.append(ValidationIssue(
                        severity='warning',
                        line=i,
                        column=match.start() + 1,
                        message=f"Event handler '{handler}' may need 'this.' prefix",
                        code_snippet=line.strip(),
                        suggested_fix=f"Change to '@{match.group(1)}=${{this.{handler}}}'",
                        rule='event-handler-binding'
                    ))

    def _check_dom_operations(self, code: str, lines: List[str]):
        """Check for DOM operations without null checks."""
        # querySelector without optional chaining or null check
        pattern = r'(querySelector|querySelectorAll|getElementById)\([^)]+\)\.(\w+)'

        for i, line in enumerate(lines, 1):
            # Skip if line has optional chaining or null check
            if '?.' in line or 'if (' in line or '&& ' in line:
                continue

            matches = re.finditer(pattern, line)
            for match in matches:
                self.warnings.append(ValidationIssue(
                    severity='warning',
                    line=i,
                    column=match.start() + 1,
                    message=f"DOM query without null check - may throw error if element not found",
                    code_snippet=line.strip(),
                    suggested_fix="Use optional chaining: querySelector()?.property",
                    rule='unsafe-dom-operation'
                ))

    def _remove_strings_and_comments(self, code: str) -> str:
        """Remove strings and comments from code for cleaner parsing."""
        # Simple approach: replace strings with spaces
        result = []
        in_string = False
        string_char = None
        in_comment = False
        in_multiline_comment = False

        i = 0
        while i < len(code):
            char = code[i]
            next_char = code[i+1] if i+1 < len(code) else ''

            # Handle comments
            if not in_string:
                if char == '/' and next_char == '/':
                    in_comment = True
                    i += 2
                    continue
                elif char == '/' and next_char == '*':
                    in_multiline_comment = True
                    i += 2
                    continue
                elif in_multiline_comment and char == '*' and next_char == '/':
                    in_multiline_comment = False
                    i += 2
                    continue

            if in_comment:
                if char == '\n':
                    in_comment = False
                    result.append('\n')
                i += 1
                continue

            if in_multiline_comment:
                if char == '\n':
                    result.append('\n')
                i += 1
                continue

            # Handle strings
            if not in_string and char in ['"', "'", '`']:
                in_string = True
                string_char = char
                result.append(' ')
            elif in_string and char == string_char and (i == 0 or code[i-1] != '\\'):
                in_string = False
                string_char = None
                result.append(' ')
            elif in_string:
                if char == '\n':
                    result.append('\n')
                else:
                    result.append(' ')
            else:
                result.append(char)

            i += 1

        return ''.join(result)

    def _get_line_snippet(self, lines: List[str], line_num: int, context: int = 0) -> str:
        """Get a snippet of code around the specified line."""
        if line_num < 1 or line_num > len(lines):
            return ""
        return lines[line_num - 1].strip()


def validate_javascript(code: str, filename: str = "file.js") -> Dict:
    """
    Validate JavaScript code and return structured results.

    Convenience function for quick validation.

    Args:
        code: JavaScript code to validate
        filename: Name of file (for reporting)

    Returns:
        {
            'is_valid': bool,
            'errors': List[Dict],
            'warnings': List[Dict],
            'summary': str
        }
    """
    validator = JavaScriptValidator()
    return validator.validate(code, filename)

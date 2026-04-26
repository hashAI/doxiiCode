"""
Import/Export Validator - Agent-Optimized

Validates that all imports match available exports in the project.
"""

import os
import re
from typing import Dict, List, Set, Tuple
from pathlib import Path


class ImportValidator:
    """Validates import/export matching across JavaScript modules."""

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.exports_map = {}  # file_path -> Set[exported_names]
        self.imports_map = {}  # file_path -> List[(imported_name, from_path)]
        self.issues = []

    def validate(self) -> Dict:
        """
        Validate all imports match available exports.

        Returns:
            {
                'is_valid': bool,
                'issues': List[Dict],
                'suggestions': List[str],
                'summary': str
            }
        """
        self.exports_map = {}
        self.imports_map = {}
        self.issues = []

        # Scan all JavaScript files
        js_files = list(self.project_root.rglob('*.js'))

        # Build exports map
        for file_path in js_files:
            exports = self._extract_exports(file_path)
            rel_path = file_path.relative_to(self.project_root)
            self.exports_map[str(rel_path)] = exports

        # Build imports map and validate
        for file_path in js_files:
            imports = self._extract_imports(file_path)
            rel_path = file_path.relative_to(self.project_root)
            self.imports_map[str(rel_path)] = imports

            # Validate each import
            for imported_name, from_path, line_num in imports:
                self._validate_import(str(rel_path), imported_name, from_path, line_num)

        is_valid = len(self.issues) == 0
        suggestions = self._generate_suggestions()
        summary = self._build_summary(is_valid)

        return {
            'is_valid': is_valid,
            'issues': self.issues,
            'suggestions': suggestions,
            'summary': summary
        }

    def _extract_exports(self, file_path: Path) -> Set[str]:
        """Extract all exported names from a file."""
        exports = set()

        try:
            content = file_path.read_text()

            # Named exports: export { foo, bar }
            named_exports = re.findall(r'export\s+\{\s*([^}]+)\s*\}', content)
            for match in named_exports:
                names = [n.strip().split(' as ')[0] for n in match.split(',')]
                exports.update(names)

            # Individual exports: export const foo = ...
            individual_exports = re.findall(r'export\s+(?:const|let|var|function|class)\s+(\w+)', content)
            exports.update(individual_exports)

            # Default export
            if re.search(r'export\s+default', content):
                exports.add('default')

        except Exception:
            pass

        return exports

    def _extract_imports(self, file_path: Path) -> List[Tuple[str, str, int]]:
        """Extract all imports from a file with line numbers."""
        imports = []

        try:
            content = file_path.read_text()
            lines = content.split('\n')

            for i, line in enumerate(lines, 1):
                # Named imports: import { foo, bar } from './path'
                named_matches = re.finditer(r"import\s+\{([^}]+)\}\s+from\s+['\"]([^'\"]+)['\"]", line)
                for match in named_matches:
                    names = [n.strip().split(' as ')[0] for n in match.group(1).split(',')]
                    from_path = match.group(2)
                    for name in names:
                        imports.append((name.strip(), from_path, i))

                # Default imports: import foo from './path'
                default_matches = re.finditer(r"import\s+(\w+)\s+from\s+['\"]([^'\"]+)['\"]", line)
                for match in default_matches:
                    if '{' not in line[:match.start()]:  # Ensure it's not part of named import
                        imports.append((match.group(1), match.group(2), i))

        except Exception:
            pass

        return imports

    def _validate_import(self, importing_file: str, imported_name: str, from_path: str, line_num: int):
        """Validate a single import statement."""
        # Skip CDN imports
        if from_path.startswith('http://') or from_path.startswith('https://'):
            return

        # Resolve the import path
        resolved_path = self._resolve_import_path(importing_file, from_path)

        if not resolved_path:
            self.issues.append({
                'file': importing_file,
                'line': line_num,
                'type': 'unresolved_path',
                'message': f"Cannot resolve import path '{from_path}'",
                'imported': imported_name,
                'from': from_path,
                'suggestion': f"Check if the file exists: {from_path}"
            })
            return

        # Check if the imported name is exported
        if resolved_path in self.exports_map:
            exports = self.exports_map[resolved_path]
            if imported_name not in exports and 'default' not in exports:
                self.issues.append({
                    'file': importing_file,
                    'line': line_num,
                    'type': 'missing_export',
                    'message': f"'{imported_name}' is not exported from '{from_path}'",
                    'imported': imported_name,
                    'from': from_path,
                    'available_exports': list(exports),
                    'suggestion': f"Add 'export {{ {imported_name} }}' to {resolved_path} or check import name"
                })

    def _resolve_import_path(self, importing_file: str, from_path: str) -> str:
        """Resolve relative import path to absolute project path."""
        # Handle relative paths
        if from_path.startswith('.'):
            importing_dir = Path(importing_file).parent
            resolved = (importing_dir / from_path).resolve()

            # Add .js if not present
            if not resolved.suffix:
                resolved = resolved.with_suffix('.js')

            # Make relative to project root
            try:
                rel_path = resolved.relative_to(self.project_root.resolve())
                return str(rel_path)
            except ValueError:
                return None

        return None

    def _generate_suggestions(self) -> List[str]:
        """Generate actionable suggestions for fixing import issues."""
        suggestions = []

        unresolved = [i for i in self.issues if i['type'] == 'unresolved_path']
        missing_exports = [i for i in self.issues if i['type'] == 'missing_export']

        if unresolved:
            suggestions.append(
                f"Fix {len(unresolved)} unresolved import paths - check file paths and ensure files exist"
            )

        if missing_exports:
            suggestions.append(
                f"Fix {len(missing_exports)} missing exports - add export statements or fix import names"
            )

        return suggestions

    def _build_summary(self, is_valid: bool) -> str:
        """Build human-readable summary."""
        if is_valid:
            return "✅ All imports match available exports"

        return f"❌ Import validation failed: {len(self.issues)} issue(s) found"


def validate_imports(project_root: str) -> Dict:
    """
    Validate imports/exports in project.

    Convenience function for quick validation.

    Args:
        project_root: Path to project root directory

    Returns:
        Validation results dictionary
    """
    validator = ImportValidator(project_root)
    return validator.validate()

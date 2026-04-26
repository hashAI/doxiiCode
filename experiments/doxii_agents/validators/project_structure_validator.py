"""
Project Structure Validator - Agent-Optimized

Validates that all required files exist for a complete e-commerce project.
"""

import os
from typing import Dict, List
from pathlib import Path


class ProjectStructureValidator:
    """Validates project directory structure and file completeness."""

    # Required files for a complete e-commerce project
    REQUIRED_FILES = [
        'index.html',
        'assets/app.js',
        'assets/state.js',
        'components/base-component.js',
        'components/header.js',
        'components/footer.js',
        'components/product-card.js',
        'components/mobile-menu.js',
        'pages/page-home.js',
        'pages/page-catalog.js',
        'pages/page-product.js',
        'pages/page-cart.js',
        'pages/page-checkout.js',
    ]

    # Infrastructure files (should already exist from scaffold)
    INFRASTRUCTURE_FILES = [
        'assets/router.js',
        'assets/utils.js',
        'assets/cart.js',
        'assets/wishlist.js',
        'assets/product-filters.js',
    ]

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.missing_required = []
        self.missing_infrastructure = []
        self.extra_issues = []

    def validate(self) -> Dict:
        """
        Validate project structure.

        Returns:
            {
                'is_valid': bool,
                'missing_required': List[str],
                'missing_infrastructure': List[str],
                'suggestions': List[str],
                'summary': str
            }
        """
        self.missing_required = []
        self.missing_infrastructure = []
        self.extra_issues = []

        # Check required files
        for file_path in self.REQUIRED_FILES:
            full_path = self.project_root / file_path
            if not full_path.exists():
                self.missing_required.append(file_path)

        # Check infrastructure files
        for file_path in self.INFRASTRUCTURE_FILES:
            full_path = self.project_root / file_path
            if not full_path.exists():
                self.missing_infrastructure.append(file_path)

        # Additional checks
        self._check_directory_structure()
        self._check_index_html_content()

        is_valid = len(self.missing_required) == 0 and len(self.missing_infrastructure) == 0

        suggestions = self._generate_suggestions()
        summary = self._build_summary(is_valid)

        return {
            'is_valid': is_valid,
            'missing_required': self.missing_required,
            'missing_infrastructure': self.missing_infrastructure,
            'extra_issues': self.extra_issues,
            'suggestions': suggestions,
            'summary': summary
        }

    def _check_directory_structure(self):
        """Check if required directories exist."""
        required_dirs = ['assets', 'components', 'pages']
        for dir_name in required_dirs:
            dir_path = self.project_root / dir_name
            if not dir_path.exists():
                self.extra_issues.append(f"Missing directory: {dir_name}/")

    def _check_index_html_content(self):
        """Check if index.html has been customized."""
        index_path = self.project_root / 'index.html'
        if not index_path.exists():
            return

        try:
            content = index_path.read_text()

            # Check for uncustomized placeholders
            placeholders = [
                ('{{STORE_NAME}}', 'Store name not customized'),
                ('{{STORE_DESCRIPTION}}', 'Store description not customized'),
                ('custom-header', 'Header component not updated in index.html'),
                ('custom-footer', 'Footer component not updated in index.html'),
            ]

            for placeholder, message in placeholders:
                if placeholder in content:
                    self.extra_issues.append(message)

        except Exception as e:
            self.extra_issues.append(f"Could not read index.html: {str(e)}")

    def _generate_suggestions(self) -> List[str]:
        """Generate actionable suggestions for fixing issues."""
        suggestions = []

        if self.missing_required:
            suggestions.append(
                f"Create {len(self.missing_required)} missing required files: {', '.join(self.missing_required[:3])}"
                + (f" and {len(self.missing_required) - 3} more" if len(self.missing_required) > 3 else "")
            )

        if self.missing_infrastructure:
            suggestions.append(
                f"Infrastructure files missing - check if scaffold was copied correctly: {', '.join(self.missing_infrastructure)}"
            )

        if self.extra_issues:
            suggestions.extend([f"Fix: {issue}" for issue in self.extra_issues])

        return suggestions

    def _build_summary(self, is_valid: bool) -> str:
        """Build human-readable summary."""
        if is_valid:
            return "✅ Project structure complete - all required files present"

        parts = []
        if self.missing_required:
            parts.append(f"{len(self.missing_required)} required files missing")
        if self.missing_infrastructure:
            parts.append(f"{len(self.missing_infrastructure)} infrastructure files missing")
        if self.extra_issues:
            parts.append(f"{len(self.extra_issues)} additional issues")

        return f"❌ Project structure incomplete: {', '.join(parts)}"


def validate_project_structure(project_root: str) -> Dict:
    """
    Validate project structure.

    Convenience function for quick validation.

    Args:
        project_root: Path to project root directory

    Returns:
        Validation results dictionary
    """
    validator = ProjectStructureValidator(project_root)
    return validator.validate()

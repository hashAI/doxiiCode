"""
Quality Validator - Agent-Optimized

Validates code quality, customization, and best practices for e-commerce stores.
"""

import os
import re
from typing import Dict, List
from pathlib import Path


class QualityValidator:
    """Validates code quality and customization completeness."""

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.issues = []
        self.warnings = []

    def validate(self) -> Dict:
        """
        Validate code quality and customization.

        Returns:
            {
                'is_valid': bool,
                'issues': List[Dict],
                'warnings': List[Dict],
                'suggestions': List[str],
                'summary': str
            }
        """
        self.issues = []
        self.warnings = []

        # Run quality checks
        self._check_products_customization()
        self._check_component_registration()
        self._check_routing_configuration()
        self._check_dark_mode_support()
        self._check_mobile_responsiveness()
        self._check_image_urls()

        is_valid = len(self.issues) == 0
        suggestions = self._generate_suggestions()
        summary = self._build_summary(is_valid)

        return {
            'is_valid': is_valid,
            'issues': self.issues,
            'warnings': self.warnings,
            'suggestions': suggestions,
            'summary': summary
        }

    def _check_products_customization(self):
        """Check if products array in state.js is properly customized."""
        state_file = self.project_root / 'assets' / 'state.js'
        if not state_file.exists():
            self.issues.append({
                'type': 'missing_file',
                'file': 'assets/state.js',
                'message': 'state.js file not found',
                'suggestion': 'Create assets/state.js with customized products array'
            })
            return

        try:
            content = state_file.read_text()

            # Check if products array exists
            if 'products:' not in content and 'products =' not in content:
                self.issues.append({
                    'type': 'missing_products',
                    'file': 'assets/state.js',
                    'message': 'Products array not found in state.js',
                    'suggestion': 'Add products array with business-specific products'
                })
                return

            # Check if products array is empty
            if re.search(r'products:\s*\[\s*\]', content):
                self.issues.append({
                    'type': 'empty_products',
                    'file': 'assets/state.js',
                    'message': 'Products array is empty',
                    'suggestion': 'Add at least 12-15 business-specific products'
                })
                return

            # Count products (approximate)
            product_count = content.count('"id":') or content.count("'id':")

            if product_count < 12:
                self.warnings.append({
                    'type': 'few_products',
                    'file': 'assets/state.js',
                    'message': f'Only {product_count} products found - recommended minimum is 12',
                    'suggestion': 'Add more products to create a complete store'
                })

            # Check for Epicsum image URLs
            if 'epicsum' not in content.lower():
                self.warnings.append({
                    'type': 'missing_epicsum',
                    'file': 'assets/state.js',
                    'message': 'Products may not be using Epicsum image API',
                    'suggestion': 'Use http://194.238.23.194/epicsum/media/image/{description}?size=720 for product images'
                })

        except Exception as e:
            self.issues.append({
                'type': 'read_error',
                'file': 'assets/state.js',
                'message': f'Could not read state.js: {str(e)}',
                'suggestion': 'Check file permissions and encoding'
            })

    def _check_component_registration(self):
        """Check if all components are properly registered with customElements.define()."""
        components_dir = self.project_root / 'components'
        if not components_dir.exists():
            self.issues.append({
                'type': 'missing_directory',
                'file': 'components/',
                'message': 'Components directory not found',
                'suggestion': 'Create components directory and add component files'
            })
            return

        # Check component files
        component_files = list(components_dir.glob('*.js'))
        for component_file in component_files:
            if component_file.name == 'base-component.js':
                continue  # Skip base component

            try:
                content = component_file.read_text()

                # Check for customElements.define
                if 'customElements.define' not in content:
                    self.issues.append({
                        'type': 'missing_registration',
                        'file': str(component_file.relative_to(self.project_root)),
                        'message': 'Component not registered with customElements.define()',
                        'suggestion': "Add 'customElements.define(\"component-name\", ComponentClass)' at the end of file"
                    })

            except Exception:
                pass

    def _check_routing_configuration(self):
        """Check if routes are properly configured in app.js."""
        app_file = self.project_root / 'assets' / 'app.js'
        if not app_file.exists():
            self.issues.append({
                'type': 'missing_file',
                'file': 'assets/app.js',
                'message': 'app.js file not found',
                'suggestion': 'Create assets/app.js with route configuration'
            })
            return

        try:
            content = app_file.read_text()

            # Check for setRoutes call
            if 'setRoutes' not in content:
                self.issues.append({
                    'type': 'missing_routes',
                    'file': 'assets/app.js',
                    'message': 'setRoutes() not called in app.js',
                    'suggestion': 'Add setRoutes([...]) to configure routing'
                })

            # Check for required routes
            required_routes = ['/', '/catalog', '/product', '/cart', '/checkout']
            for route in required_routes:
                if f"'{route}'" not in content and f'"{route}"' not in content:
                    self.warnings.append({
                        'type': 'missing_route',
                        'file': 'assets/app.js',
                        'message': f'Route "{route}" not configured',
                        'suggestion': f'Add route: {{path: "{route}", component: "page-name"}}'
                    })

        except Exception:
            pass

    def _check_dark_mode_support(self):
        """Check if dark mode is properly implemented."""
        # Check if components use dark: classes
        components_dir = self.project_root / 'components'
        pages_dir = self.project_root / 'pages'

        files_checked = 0
        files_with_dark_mode = 0

        for directory in [components_dir, pages_dir]:
            if not directory.exists():
                continue

            for file_path in directory.glob('*.js'):
                try:
                    content = file_path.read_text()
                    files_checked += 1

                    if 'dark:' in content:
                        files_with_dark_mode += 1

                except Exception:
                    pass

        if files_checked > 0 and files_with_dark_mode < files_checked * 0.5:
            self.warnings.append({
                'type': 'limited_dark_mode',
                'file': 'components/pages',
                'message': f'Only {files_with_dark_mode}/{files_checked} files have dark mode support',
                'suggestion': 'Add dark: classes (e.g., dark:bg-gray-800) for dark mode styling'
            })

    def _check_mobile_responsiveness(self):
        """Check if mobile responsiveness is implemented."""
        # Check for responsive classes (sm:, md:, lg:)
        components_dir = self.project_root / 'components'
        pages_dir = self.project_root / 'pages'

        files_checked = 0
        files_with_responsive = 0

        for directory in [components_dir, pages_dir]:
            if not directory.exists():
                continue

            for file_path in directory.glob('*.js'):
                try:
                    content = file_path.read_text()
                    files_checked += 1

                    if 'sm:' in content or 'md:' in content or 'lg:' in content:
                        files_with_responsive += 1

                except Exception:
                    pass

        if files_checked > 0 and files_with_responsive < files_checked * 0.5:
            self.warnings.append({
                'type': 'limited_responsiveness',
                'file': 'components/pages',
                'message': f'Only {files_with_responsive}/{files_checked} files have responsive classes',
                'suggestion': 'Add responsive breakpoints (sm:, md:, lg:) for mobile/tablet support'
            })

        # Check for mobile menu
        mobile_menu = self.project_root / 'components' / 'mobile-menu.js'
        if not mobile_menu.exists():
            self.warnings.append({
                'type': 'missing_mobile_menu',
                'file': 'components/mobile-menu.js',
                'message': 'Mobile menu component not found',
                'suggestion': 'Create mobile-menu.js for mobile navigation'
            })

    def _check_image_urls(self):
        """Check if images use the Epicsum API correctly."""
        state_file = self.project_root / 'assets' / 'state.js'
        if not state_file.exists():
            return

        try:
            content = state_file.read_text()

            # Check for Epicsum URLs
            if 'epicsum' in content.lower():
                # Check for proper format: http://194.238.23.194/epicsum/media/image/{description}?size=720
                if '194.238.23.194' not in content:
                    self.warnings.append({
                        'type': 'wrong_image_api',
                        'file': 'assets/state.js',
                        'message': 'Using "epicsum" but not correct base URL',
                        'suggestion': 'Use: http://194.238.23.194/epicsum/media/image/{description}?size=720'
                    })

                # Check for size parameter
                if '?size=' not in content and 'epicsum' in content.lower():
                    self.warnings.append({
                        'type': 'missing_size_param',
                        'file': 'assets/state.js',
                        'message': 'Epicsum URLs missing ?size= parameter',
                        'suggestion': 'Add ?size=720 or ?size=1000 to image URLs for optimal quality'
                    })

        except Exception:
            pass

    def _generate_suggestions(self) -> List[str]:
        """Generate actionable suggestions for fixing issues."""
        suggestions = []

        # Group issues by type
        issue_types = {}
        for issue in self.issues:
            issue_type = issue['type']
            if issue_type not in issue_types:
                issue_types[issue_type] = []
            issue_types[issue_type].append(issue)

        # Generate suggestions
        for issue_type, issues_list in issue_types.items():
            if len(issues_list) == 1:
                suggestions.append(issues_list[0]['suggestion'])
            else:
                suggestions.append(f"Fix {len(issues_list)} {issue_type} issues")

        return suggestions

    def _build_summary(self, is_valid: bool) -> str:
        """Build human-readable summary."""
        if is_valid:
            if self.warnings:
                return f"✅ Quality checks passed with {len(self.warnings)} warning(s)"
            return "✅ All quality checks passed"

        return f"❌ Quality validation failed: {len(self.issues)} issue(s), {len(self.warnings)} warning(s)"


def validate_quality(project_root: str) -> Dict:
    """
    Validate code quality and customization.

    Convenience function for quick validation.

    Args:
        project_root: Path to project root directory

    Returns:
        Validation results dictionary
    """
    validator = QualityValidator(project_root)
    return validator.validate()

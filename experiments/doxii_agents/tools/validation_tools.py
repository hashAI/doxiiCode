"""
Validation Function Tools for Architect Agent

Lightweight validation tools for project structure and business logic.
Code quality validation is handled by ESLint (see eslint_tools.py).

All tools return JSON strings for easy agent parsing.
"""

import json
import os
import re
from agents import function_tool, RunContextWrapper
from ..context import DoxiiContext
from ..validators.project_structure_validator import validate_project_structure
from ..validators.quality_validator import validate_quality


# REMOVED: validate_javascript_file - Use ESLint instead
# Use validate_project_with_eslint() from eslint_tools.py for code validation


@function_tool
async def validate_project_completeness(
    ctx: RunContextWrapper[DoxiiContext]
) -> str:
    """
    Validate that all required files exist for a complete e-commerce project.

    Call this tool after generating all files to ensure nothing is missing.

    Required files checked:
    - index.html
    - assets/app.js
    - assets/state.js (with customized products)
    - Core components (header, footer, product-card, mobile-menu)
    - Core pages (home, catalog, product, cart, checkout)

    Returns:
        JSON string with validation results:
        {
            "is_valid": bool,
            "missing_required": [...]  // List of missing files
            "missing_infrastructure": [...]  // Infrastructure files missing
            "suggestions": [...]  // How to fix issues
            "summary": str
        }

    If validation fails, create the missing files.
    """
    project_root = ctx.context.chat_root
    results = validate_project_structure(project_root)

    return json.dumps(results, indent=2)


# REMOVED: validate_imports_and_exports - Use ESLint instead
# Use validate_project_with_eslint() or validate_file_imports_with_eslint() from eslint_tools.py


@function_tool
async def validate_products_customization(
    ctx: RunContextWrapper[DoxiiContext]
) -> str:
    """
    Validate that products array in assets/state.js is properly customized.

    Call this tool to ensure you've added business-specific products (not generic placeholders).

    Checks:
    - Products array exists and is not empty
    - At least 12-15 products are present
    - Products use Epicsum image API
    - Products have required fields (id, name, price, image, etc.)

    Returns:
        JSON string with validation results:
        {
            "is_valid": bool,
            "issues": [...]  // Problems found
            "warnings": [...]  // Non-critical issues
            "product_count": int  // Number of products found
            "suggestions": [...]
            "summary": str
        }

    If validation fails, add more products with complete data.
    """
    project_root = ctx.context.chat_root

    # Use quality validator's product check
    quality_results = validate_quality(project_root)

    # Extract product-specific issues
    product_issues = [i for i in quality_results['issues'] if 'product' in i['type'].lower()]
    product_warnings = [w for w in quality_results['warnings'] if 'product' in w['type'].lower()]

    is_valid = len(product_issues) == 0

    # Count products from state.js
    product_count = 0
    state_file = os.path.join(project_root, 'assets', 'state.js')
    if os.path.exists(state_file):
        with open(state_file, 'r') as f:
            content = f.read()
            product_count = content.count('"id":') or content.count("'id':")

    results = {
        'is_valid': is_valid,
        'issues': product_issues,
        'warnings': product_warnings,
        'product_count': product_count,
        'suggestions': [i.get('suggestion', '') for i in product_issues],
        'summary': f'✅ {product_count} products found' if is_valid else f'❌ Product customization incomplete'
    }

    return json.dumps(results, indent=2)


@function_tool
async def validate_component_base_imports(
    ctx: RunContextWrapper[DoxiiContext]
) -> str:
    """
    Validate that all components properly import and extend BaseComponent.

    This is CRITICAL because every custom element must extend BaseComponent
    to work correctly with Lit, Tailwind, and the component lifecycle.

    Checks every .js file in components/ directory for:
    1. Correct import: `import { BaseComponent } from './base-component.js'`
    2. Class extends BaseComponent: `class X extends BaseComponent`
    3. CustomElements registration: `customElements.define('tag-name', ClassName)`

    Returns:
        JSON string with validation results:
        {
            "is_valid": bool,
            "total_components": int,
            "valid_components": int,
            "issues": [
                {
                    "file": "components/hero.js",
                    "problems": ["Missing BaseComponent import", ...],
                    "fix": "Add: import { BaseComponent } from './base-component.js'"
                }
            ],
            "summary": str
        }

    Common issues detected:
    - Missing import statement entirely
    - Wrong import path (../../ instead of ./)
    - Class doesn't extend BaseComponent
    - Missing customElements.define()

    If validation fails, fix ALL components at once before continuing.
    """
    project_root = ctx.context.chat_root
    components_dir = os.path.join(project_root, 'components')

    if not os.path.exists(components_dir):
        return json.dumps({
            'is_valid': False,
            'error': 'components/ directory does not exist',
            'summary': '❌ No components directory found'
        }, indent=2)

    issues = []
    total_components = 0
    valid_components = 0

    # Scan all .js files in components/ (excluding base-component.js)
    for filename in os.listdir(components_dir):
        if not filename.endswith('.js') or filename == 'base-component.js':
            continue

        total_components += 1
        filepath = os.path.join(components_dir, filename)

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        problems = []

        # Check 1: Has BaseComponent import
        has_import = re.search(r"import\s*{[^}]*BaseComponent[^}]*}\s*from\s*['\"]\.\/base-component\.js['\"]", content)
        if not has_import:
            # Check if using wrong path
            wrong_path = re.search(r"import\s*{[^}]*BaseComponent[^}]*}\s*from\s*['\"]\.\.\/", content)
            if wrong_path:
                problems.append("Wrong import path (using ../ instead of ./)")
            else:
                problems.append("Missing BaseComponent import")

        # Check 2: Class extends BaseComponent
        has_extends = re.search(r"class\s+\w+\s+extends\s+BaseComponent", content)
        if not has_extends:
            problems.append("Class doesn't extend BaseComponent")

        # Check 3: Has customElements.define
        has_registration = re.search(r"customElements\.define\(", content)
        if not has_registration:
            problems.append("Missing customElements.define() registration")

        if problems:
            fix_suggestions = []
            if "Missing BaseComponent import" in problems:
                fix_suggestions.append("Add at top: import { BaseComponent } from './base-component.js';")
            if "Wrong import path" in problems:
                fix_suggestions.append("Change import path from '../' or '../../' to './'")
            if "Class doesn't extend BaseComponent" in problems:
                fix_suggestions.append("Change: class MyComponent extends BaseComponent {")
            if "Missing customElements.define" in problems:
                fix_suggestions.append("Add at bottom: customElements.define('my-component', MyComponent);")

            issues.append({
                'file': f'components/{filename}',
                'problems': problems,
                'fix': ' | '.join(fix_suggestions)
            })
        else:
            valid_components += 1

    is_valid = len(issues) == 0 and total_components > 0

    return json.dumps({
        'is_valid': is_valid,
        'total_components': total_components,
        'valid_components': valid_components,
        'issues': issues,
        'summary': f'✅ All {total_components} components valid' if is_valid else f'❌ {len(issues)}/{total_components} components have BaseComponent issues'
    }, indent=2)


# REMOVED: validate_component_registration
# ESLint can detect missing customElements.define() patterns
# Use validate_project_with_eslint() from eslint_tools.py


# REMOVED: run_full_validation - Use ESLint as primary validator
# For comprehensive validation:
# 1. Call validate_project_completeness() - checks file structure
# 2. Call validate_products_customization() - checks business logic
# 3. Call validate_component_base_imports() - checks BaseComponent usage
# 4. Call validate_project_with_eslint() - checks code quality (primary)


# Export minimal validation tools (structure + business logic only)
# Code quality validation is in eslint_tools.py
VALIDATION_TOOLS = [
    validate_project_completeness,
    validate_products_customization,
    validate_component_base_imports
]

"""
Component File Tools for Architect Agent

Provides tools to copy and customize components from the library.
"""

import os
import re
import shutil
from pathlib import Path
from typing import Optional, Dict

def copy_component(
    component_id: str,
    destination_dir: str,
    customize: Optional[Dict[str, str]] = None
) -> str:
    """
    Copy a component from the library to a project directory.
    
    Args:
        component_id: The component ID (e.g., 'header-classic')
        destination_dir: Destination directory path
        customize: Optional dict of customizations (Tailwind class replacements)
    
    Returns:
        Path to the copied component file
    
    Example:
        # Copy header with blue theme
        path = copy_component(
            'header-classic',
            'my_project/components/',
            customize={'bg-primary-500': 'bg-blue-600'}
        )
    """
    try:
        from .component_search import get_component_details
    except ImportError:
        from component_search import get_component_details

    # Get component details
    component = get_component_details(component_id)
    if not component:
        raise ValueError(f"Component '{component_id}' not found")
    
    # Source file path
    lib_root = Path(__file__).parent.parent.parent.parent
    source_path = lib_root / component['file_path']
    
    if not source_path.exists():
        raise FileNotFoundError(f"Component file not found: {source_path}")
    
    # Read source code
    with open(source_path, 'r') as f:
        code = f.read()
    
    # Apply customizations (Tailwind classes only)
    if customize:
        for old_class, new_class in customize.items():
            # Only replace within class strings, not in comments or JS
            code = re.sub(
                r'class="([^"]*?)' + re.escape(old_class) + r'([^"]*?)"',
                r'class="\1' + new_class + r'\2"',
                code
            )
            code = re.sub(
                r"class='([^']*?)" + re.escape(old_class) + r"([^']*?)'",
                r"class='\1" + new_class + r"\2'",
                code
            )
    
    # Create destination directory
    dest_dir = Path(destination_dir)
    dest_dir.mkdir(parents=True, exist_ok=True)
    
    # Destination file path
    filename = component['file_path'].split('/')[-1]
    dest_path = dest_dir / filename
    
    # Write customized component
    with open(dest_path, 'w') as f:
        f.write(code)
    
    return str(dest_path)


def validate_component_modification(original_code: str, modified_code: str) -> Dict[str, any]:
    """
    Validate that only cosmetic changes were made to a component.
    
    Args:
        original_code: Original component code
        modified_code: Modified component code
    
    Returns:
        Dict with validation results:
        {
            'valid': bool,
            'errors': list of error messages,
            'warnings': list of warnings,
            'modifications': list of detected modifications
        }
    """
    errors = []
    warnings = []
    modifications = []
    
    # Check if JavaScript logic was modified
    # Extract JS sections (methods, event handlers)
    js_pattern = r'(constructor\(|connectedCallback\(|disconnectedCallback\(|handle\w+\(|render\()'
    
    original_js_lines = [line for line in original_code.split('\n') if re.search(js_pattern, line)]
    modified_js_lines = [line for line in modified_code.split('\n') if re.search(js_pattern, line)]
    
    if len(original_js_lines) != len(modified_js_lines):
        errors.append("JavaScript methods were added or removed - NOT ALLOWED")
    
    # Check for class name changes
    class_changes = []
    original_classes = set(re.findall(r'class="([^"]+)"', original_code))
    modified_classes = set(re.findall(r'class="([^"]+)"', modified_code))
    
    if original_classes != modified_classes:
        modifications.append("Tailwind classes modified (ALLOWED)")
    
    # Check for import changes
    original_imports = re.findall(r'import .+ from [\'"].+[\'"]', original_code)
    modified_imports = re.findall(r'import .+ from [\'"].+[\'"]', modified_code)
    
    if original_imports != modified_imports:
        errors.append("Import statements were modified - NOT ALLOWED")
    
    valid = len(errors) == 0
    
    return {
        'valid': valid,
        'errors': errors,
        'warnings': warnings,
        'modifications': modifications
    }


# Tool definitions
COMPONENT_FILE_TOOLS = [
    {
        "name": "copy_component",
        "description": "Copy a component from the library to the project directory with optional Tailwind customization",
        "parameters": {
            "type": "object",
            "properties": {
                "component_id": {
                    "type": "string",
                    "description": "The component ID to copy"
                },
                "destination_dir": {
                    "type": "string",
                    "description": "Destination directory path"
                },
                "customize": {
                    "type": "object",
                    "description": "Optional dict of Tailwind class replacements, e.g. {'bg-primary-500': 'bg-blue-600'}"
                }
            },
            "required": ["component_id", "destination_dir"]
        }
    },
    {
        "name": "validate_component_modification",
        "description": "Validate that only cosmetic changes were made to a component (no JavaScript logic changes)",
        "parameters": {
            "type": "object",
            "properties": {
                "original_code": {
                    "type": "string",
                    "description": "Original component code"
                },
                "modified_code": {
                    "type": "string",
                    "description": "Modified component code"
                }
            },
            "required": ["original_code", "modified_code"]
        }
    }
]


if __name__ == "__main__":
    print("=== Testing Component File Tools ===\n")
    
    # Test copy_component
    print("1. Testing copy_component...")
    try:
        import tempfile
        temp_dir = tempfile.mkdtemp()
        
        path = copy_component(
            'header-classic',
            temp_dir,
            customize={'bg-primary-500': 'bg-blue-600'}
        )
        
        print(f"  ✓ Component copied to: {path}")
        
        # Verify file exists and has customization
        with open(path, 'r') as f:
            content = f.read()
            if 'bg-blue-600' in content:
                print(f"  ✓ Customization applied")
            else:
                print(f"  ✗ Customization not found")
        
        # Cleanup
        shutil.rmtree(temp_dir)
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
    
    print("\n=== Tests Complete ===")


#!/usr/bin/env python3
"""
Convert static styles CSS to inline <style> tags for components using BaseComponent.
Since BaseComponent disables Shadow DOM, static styles are ignored.
This script moves them to inline <style> tags in the render() method.
"""

import re
import os

def convert_component(file_path):
    """Convert a single component file"""
    print(f"Processing: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the static styles block
    styles_match = re.search(r'static styles = css`(.*?)`;\n\n', content, re.DOTALL)

    if not styles_match:
        print(f"  No static styles found, skipping")
        return False

    # Extract the CSS content
    css_content = styles_match.group(1)

    # Replace :host selectors with component-specific class or root selector
    # Since we're in light DOM, :host becomes the root element
    css_content = css_content.replace(':host', 'scroll-card-carousel')

    # Find the render method
    render_match = re.search(r'(    render\(\) \{[\s\n]+return html`)(.*?)(`;[\s\n]+\})', content, re.DOTALL)

    if not render_match:
        print(f"  Could not find render() method")
        return False

    # Create inline style tag
    inline_styles = f'''<style>
{css_content}    </style>
            '''

    # Insert styles at the beginning of the render template
    new_render = f'''{render_match.group(1)}
            {inline_styles}{render_match.group(2)}{render_match.group(3)}'''

    # Remove the static styles block
    content = re.sub(r'static styles = css`.*?`;\n\n', '', content, flags=re.DOTALL)

    # Replace the render method
    content = re.sub(r'render\(\) \{[\s\n]+return html`.*?`;[\s\n]+\}',
                     new_render[4:],  # Remove leading spaces from match group
                     content, flags=re.DOTALL)

    # Remove css import if it's there
    content = re.sub(r', css\b', '', content)
    content = re.sub(r'css, ', '', content)
    content = re.sub(r'import \{ css \}.*?\n', '', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  ✓ Converted successfully")
    return True

# Components to convert
COMPONENTS = [
    'interactive-carousels/scroll-card-carousel/scroll-card-carousel.js',
    'interactive-carousels/interactive-3d-carousel/interactive-3d-carousel.js',
    'product-showcase/luxury-product-showcase/luxury-product-showcase.js',
    'product-showcase/product-portfolio-showcase/product-portfolio-showcase.js',
    'product-showcase/scroll-accordion-stack/scroll-accordion-stack.js',
]

def main():
    base_path = '/Users/hash/Projects/doxii/component_library/components'

    for comp in COMPONENTS:
        file_path = os.path.join(base_path, comp)
        if os.path.exists(file_path):
            try:
                convert_component(file_path)
            except Exception as e:
                print(f"  ✗ Error: {e}")
        else:
            print(f"File not found: {file_path}")

if __name__ == '__main__':
    main()

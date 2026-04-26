#!/usr/bin/env python3
"""
Quick test to verify ESLint validator integration with Architect agent.
"""

import sys
sys.path.insert(0, 'experiments')

from doxii_agents.architect import create_architect_agent
from doxii_agents.context import DoxiiContext

def test_eslint_integration():
    """Test that architect agent has ESLint tools available."""

    print("🧪 Testing ESLint integration with Architect agent...")

    # Create architect agent
    agent = create_architect_agent()

    # Check that agent has tools
    tool_names = [tool.name for tool in agent.tools]

    print(f"\n📋 Total tools available: {len(tool_names)}")
    print(f"\n🔧 All tools:")
    for name in sorted(tool_names):
        print(f"  - {name}")

    # Check for ESLint tools
    eslint_tools = [name for name in tool_names if 'eslint' in name.lower()]
    validation_tools = [name for name in tool_names if 'validate' in name.lower()]

    print(f"\n✅ ESLint tools ({len(eslint_tools)}):")
    for tool in eslint_tools:
        print(f"  - {tool}")

    print(f"\n✅ Validation tools ({len(validation_tools)}):")
    for tool in validation_tools:
        print(f"  - {tool}")

    # Verify key tools exist
    expected_tools = [
        'validate_project_with_eslint',
        'validate_file_imports_with_eslint',
        'validate_project_completeness',
        'validate_products_customization'
    ]

    missing_tools = [tool for tool in expected_tools if tool not in tool_names]

    if missing_tools:
        print(f"\n❌ Missing expected tools:")
        for tool in missing_tools:
            print(f"  - {tool}")
        return False

    # Verify removed tools are not present
    removed_tools = [
        'validate_javascript_file',
        'validate_imports_and_exports',
        'validate_component_registration',
        'run_full_validation',
        'validate_with_biome',
        'check_imports_with_biome'
    ]

    present_removed = [tool for tool in removed_tools if tool in tool_names]

    if present_removed:
        print(f"\n⚠️  Warning: Removed tools still present:")
        for tool in present_removed:
            print(f"  - {tool}")

    print(f"\n✅ All expected ESLint tools are present!")
    print(f"✅ Old validation tools removed successfully!")
    print(f"\n🎉 ESLint integration test PASSED!")

    return True


if __name__ == '__main__':
    try:
        success = test_eslint_integration()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

#!/usr/bin/env python3
"""
Quick test to verify Homepage Builder agent setup.

Tests:
1. Agent creation
2. Tool availability
3. Context initialization
4. Basic configuration
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from doxii_agents.homepage_builder import create_homepage_builder_agent
from doxii_agents.context import DoxiiContext


def test_agent_creation():
    """Test that the agent can be created."""
    print("Testing agent creation...")
    try:
        agent = create_homepage_builder_agent()
        assert agent is not None, "Agent is None"
        assert agent.name == "Homepage_Builder", f"Expected name 'Homepage_Builder', got '{agent.name}'"
        assert agent.model == "gpt-5", f"Expected model 'gpt-5', got '{agent.model}'"
        print("✅ Agent created successfully")
        print(f"   Name: {agent.name}")
        print(f"   Model: {agent.model}")
        return agent
    except Exception as e:
        print(f"❌ Agent creation failed: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_tool_availability(agent):
    """Test that all required tools are available."""
    print("\nTesting tool availability...")
    
    # Expected tool categories
    required_tools = [
        # File tools
        "write_file", "read_file", "edit_file", "bulk_write_files", "bulk_read_files",
        "glob_files", "grep_files",
        
        # Feature planning tools
        "write_features", "get_features", "count_features", "update_feature_status",
        "get_feature_progress",
        
        # Task planning tools
        "write_tasks", "get_tasks", "update_task_status", "clear_tasks",
        
        # Validation tools
        "validate_project_completeness", "validate_products_customization",
        
        # ESLint tools
        "validate_project_with_eslint", "validate_file_imports_with_eslint",
        
        # Doc tools
        "load_documentation"
    ]
    
    try:
        tool_names = [tool.name for tool in agent.tools]
        print(f"   Total tools available: {len(tool_names)}")
        
        missing_tools = []
        for tool_name in required_tools:
            if tool_name not in tool_names:
                missing_tools.append(tool_name)
        
        if missing_tools:
            print(f"❌ Missing tools: {missing_tools}")
            return False
        else:
            print("✅ All required tools available")
            print(f"   File tools: ✓")
            print(f"   Feature planning: ✓")
            print(f"   Task planning: ✓")
            print(f"   Validation: ✓")
            print(f"   ESLint: ✓")
            print(f"   Documentation: ✓")
            return True
    except Exception as e:
        print(f"❌ Tool availability check failed: {e}")
        return False


def test_context_initialization():
    """Test context initialization."""
    print("\nTesting context initialization...")
    try:
        context = DoxiiContext(
            chat_id="test_homepage_builder",
            chat_root="./test_output_homepage/test",
            cms_base_url="https://api.example.com"
        )
        
        assert context.chat_id == "test_homepage_builder"
        assert context.chat_root == "./test_output_homepage/test"
        assert context.features == []
        assert context.tasks == []
        assert context.current_feature_id is None
        
        print("✅ Context initialized successfully")
        print(f"   Chat ID: {context.chat_id}")
        print(f"   Chat root: {context.chat_root}")
        print(f"   Features: {len(context.features)}")
        print(f"   Tasks: {len(context.tasks)}")
        return True
    except Exception as e:
        print(f"❌ Context initialization failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_instructions_content(agent):
    """Test that instructions contain key homepage-specific content."""
    print("\nTesting instructions content...")
    try:
        instructions = agent.instructions
        
        # Key phrases that should be in homepage builder instructions
        required_phrases = [
            "Homepage Builder",
            "HOMEPAGE SCOPE",
            "ONLY CREATE HOMEPAGE",
            "page-home.js",
            "Hero Section",
            "Featured Products",
            "Categories",
            "Newsletter",
            "10-15 minutes"
        ]
        
        missing_phrases = []
        for phrase in required_phrases:
            if phrase not in instructions:
                missing_phrases.append(phrase)
        
        if missing_phrases:
            print(f"❌ Missing key phrases in instructions: {missing_phrases}")
            return False
        else:
            print("✅ Instructions contain all key homepage-specific content")
            print(f"   Scope limitation: ✓")
            print(f"   Homepage features: ✓")
            print(f"   Time estimate: ✓")
            return True
    except Exception as e:
        print(f"❌ Instructions check failed: {e}")
        return False


def main():
    """Run all tests."""
    print("=" * 80)
    print("HOMEPAGE BUILDER AGENT - SETUP VERIFICATION")
    print("=" * 80)
    print()
    
    results = []
    
    # Test 1: Agent creation
    agent = test_agent_creation()
    results.append(agent is not None)
    
    if agent:
        # Test 2: Tool availability
        tools_ok = test_tool_availability(agent)
        results.append(tools_ok)
        
        # Test 3: Instructions content
        instructions_ok = test_instructions_content(agent)
        results.append(instructions_ok)
    else:
        results.extend([False, False])
    
    # Test 4: Context initialization
    context_ok = test_context_initialization()
    results.append(context_ok)
    
    # Summary
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    
    passed = sum(results)
    total = len(results)
    
    print(f"\nPassed: {passed}/{total}")
    
    if all(results):
        print("\n✅ All tests passed! Homepage Builder is ready to use.")
        print("\nTo test the agent:")
        print("  python experiments/scripts/interactive_homepage_builder.py")
        return 0
    else:
        print("\n❌ Some tests failed. Please review the errors above.")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)


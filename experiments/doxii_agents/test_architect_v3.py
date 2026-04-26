#!/usr/bin/env python3
"""
Interactive test script for Architect V3 agent.

Usage:
    python test_architect_v3.py

This script allows you to test the Architect V3 agent with sample
e-commerce store prompts and measure performance improvements.
"""

import os
import sys
import time
import asyncio
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from agents import run_agent
from experiments.doxii_agents.architect_v3 import create_architect_v3_agent
from experiments.doxii_agents.context import DoxiiContext


# Sample prompts for testing
SAMPLE_PROMPTS = {
    "1": {
        "name": "Tech Electronics Store",
        "prompt": """
Create a modern e-commerce store for high-end electronics and gadgets.

Business Type: Electronics & Tech
Style: Modern, sleek, tech-focused
Target Audience: Tech enthusiasts, professionals

Key Features:
- Product catalog with laptops, smartphones, tablets, accessories
- Advanced filtering (brand, price, specs)
- Product comparison feature
- Dark mode support
- Mobile-first responsive design
"""
    },
    "2": {
        "name": "Fashion Boutique",
        "prompt": """
Create an elegant e-commerce store for a fashion boutique.

Business Type: Fashion & Apparel
Style: Elegant, minimalist, high-end
Target Audience: Fashion-conscious shoppers, 25-45 age range

Key Features:
- Product catalog with clothing, accessories, shoes
- Size and color filters
- Wishlist functionality
- Style guides and lookbooks
- Instagram-style product grid
"""
    },
    "3": {
        "name": "Sports & Fitness Store",
        "prompt": """
Create an energetic e-commerce store for sports and fitness equipment.

Business Type: Sports & Fitness
Style: Bold, energetic, motivational
Target Audience: Athletes, fitness enthusiasts

Key Features:
- Product catalog with equipment, apparel, supplements
- Category-based browsing (running, gym, yoga, etc.)
- Product reviews and ratings
- Beginner guides
- Mobile-friendly workout plans
"""
    },
    "4": {
        "name": "Minimalist Home Goods",
        "prompt": """
Create a clean, minimalist e-commerce store for home goods and decor.

Business Type: Home & Living
Style: Minimalist, Scandinavian-inspired, clean
Target Audience: Home owners, interior design enthusiasts

Key Features:
- Product catalog with furniture, decor, kitchenware
- Room-based categories (living room, bedroom, kitchen)
- Product bundles and sets
- Interior design inspiration gallery
- Sustainable/eco-friendly product filters
"""
    },
    "5": {
        "name": "Custom Prompt",
        "prompt": None  # Will prompt user for input
    }
}


def print_banner():
    """Print welcome banner."""
    print("\n" + "="*70)
    print("  DOXII ARCHITECT V3 - Interactive Test Script")
    print("  Optimized E-commerce Store Generator")
    print("="*70 + "\n")


def print_menu():
    """Print sample prompt menu."""
    print("\nSelect a sample prompt to test:\n")
    for key, value in SAMPLE_PROMPTS.items():
        print(f"  [{key}] {value['name']}")
    print()


def get_user_choice():
    """Get user's prompt selection."""
    while True:
        choice = input("Enter choice (1-5): ").strip()
        if choice in SAMPLE_PROMPTS:
            return choice
        print("Invalid choice. Please enter 1-5.")


def get_custom_prompt():
    """Get custom prompt from user."""
    print("\n" + "-"*70)
    print("Enter your custom e-commerce store requirements:")
    print("(Press Ctrl+D or Ctrl+Z when done)\n")
    lines = []
    try:
        while True:
            line = input()
            lines.append(line)
    except EOFError:
        pass
    return "\n".join(lines)


def get_output_directory():
    """Get output directory from user."""
    default_dir = os.path.join(os.getcwd(), "test_output")
    print(f"\nOutput directory (default: {default_dir}): ", end="")
    user_dir = input().strip()
    return user_dir if user_dir else default_dir


async def run_test(prompt: str, output_dir: str):
    """
    Run the Architect V3 agent with the given prompt.

    Args:
        prompt: The user prompt describing the e-commerce store
        output_dir: Directory to save generated files
    """
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    # Create context
    context = DoxiiContext(chat_root=output_dir)

    # Create agent
    print("\n" + "="*70)
    print("Creating Architect V3 agent...")
    print("="*70 + "\n")

    agent = create_architect_v3_agent()

    # Start timer
    start_time = time.time()

    print("Starting agent execution...")
    print("This will take approximately 18-28 minutes (60% faster than V2)")
    print("-"*70 + "\n")

    # Run agent
    try:
        result = await run_agent(
            agent=agent,
            context=context,
            input_message=prompt
        )

        # End timer
        end_time = time.time()
        elapsed_minutes = (end_time - start_time) / 60

        # Print results
        print("\n" + "="*70)
        print("EXECUTION COMPLETE")
        print("="*70)
        print(f"\n⏱️  Total Time: {elapsed_minutes:.1f} minutes")
        print(f"📁 Output Directory: {output_dir}")

        # Print performance comparison
        print("\n" + "-"*70)
        print("PERFORMANCE COMPARISON")
        print("-"*70)
        print(f"Architect V2 (average):  48 minutes")
        print(f"Architect V3 (this run): {elapsed_minutes:.1f} minutes")
        improvement = ((48 - elapsed_minutes) / 48) * 100
        print(f"Improvement:             {improvement:.1f}% faster")

        # Print todo summary
        if context.architect_todos:
            total = len(context.architect_todos)
            completed = sum(1 for t in context.architect_todos if t.status == "completed")
            print("\n" + "-"*70)
            print("TODO SUMMARY")
            print("-"*70)
            print(f"Total Tasks:     {total}")
            print(f"Completed:       {completed}")
            print(f"Success Rate:    {(completed/total*100):.1f}%")

        # Print final message
        print("\n" + "-"*70)
        print("✅ Store generation complete!")
        print(f"📂 Check {output_dir} for generated files")
        print("-"*70 + "\n")

        return True

    except Exception as e:
        print(f"\n❌ Error during execution: {str(e)}")
        print(f"Check logs for details.")
        return False


def main():
    """Main entry point."""
    print_banner()

    # Get user choice
    print_menu()
    choice = get_user_choice()

    # Get prompt
    if choice == "5":
        prompt = get_custom_prompt()
        if not prompt.strip():
            print("No prompt provided. Exiting.")
            return
    else:
        prompt = SAMPLE_PROMPTS[choice]["prompt"]
        print(f"\nSelected: {SAMPLE_PROMPTS[choice]['name']}")
        print("\nPrompt:")
        print("-"*70)
        print(prompt)
        print("-"*70)

    # Get output directory
    output_dir = get_output_directory()

    # Confirm
    print("\n" + "="*70)
    print("READY TO START")
    print("="*70)
    print(f"Output: {output_dir}")
    print(f"Expected Time: 18-28 minutes")
    print("\nPress Enter to start, or Ctrl+C to cancel...")
    try:
        input()
    except KeyboardInterrupt:
        print("\n\nCancelled by user.")
        return

    # Run test
    asyncio.run(run_test(prompt, output_dir))


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrupted by user. Exiting.")
        sys.exit(0)

"""
Test script to fix the hanging issue with Runner.run_streamed
"""
import asyncio
import os
import sys
from pathlib import Path

# Add experiments to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agents import Runner
from doxii_agents.architect import create_architect_agent
from doxii_agents.context import DoxiiContext


async def test_with_timeout():
    """Test Runner.run_streamed with timeout and debugging"""

    print("Creating context...")
    context = DoxiiContext(
        chat_id='test_fix',
        chat_root='/tmp/test_fix',
        cms_base_url='https://api.example.com',
        project_initialized=False
    )

    print("Creating agent...")
    agent = create_architect_agent()

    print("Calling Runner.run_streamed...")
    result = Runner.run_streamed(
        agent,
        'Create a simple bookstore',
        context=context,
        max_turns=10
    )

    print(f"Result type: {type(result)}")
    print("Starting to iterate over events...")

    event_count = 0
    timeout_seconds = 30

    try:
        async def iterate_events():
            nonlocal event_count
            async for event in result.stream_events():
                event_count += 1
                print(f"\n[Event {event_count}] Type: {event.type}")

                if hasattr(event, 'data'):
                    print(f"  Data: {type(event.data)}")
                    if hasattr(event.data, 'delta'):
                        print(f"  Delta: {event.data.delta[:100] if event.data.delta else None}")

                if event_count >= 5:
                    print("\nReceived 5 events, stopping test...")
                    break

        # Run with timeout
        print(f"\nWaiting for events (timeout: {timeout_seconds}s)...")
        await asyncio.wait_for(iterate_events(), timeout=timeout_seconds)

        print(f"\n✅ SUCCESS: Received {event_count} events!")

    except asyncio.TimeoutError:
        print(f"\n❌ TIMEOUT after {timeout_seconds}s")
        print(f"   Only received {event_count} events")
        print("   The stream is hanging!")

    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # Check API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ ERROR: OPENAI_API_KEY not set")
        sys.exit(1)

    # Run test
    asyncio.run(test_with_timeout())

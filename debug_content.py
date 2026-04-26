#!/usr/bin/env python3
"""Debug the HTML content being served"""

import requests

def debug_preview_content():
    chat_id = "68a9b9a990fd0c17e97961f8"
    base_url = "http://localhost:8010"
    
    print("=== Debugging Preview Content ===\n")
    
    # Test the query param endpoint
    url = f"{base_url}/preview/{chat_id}?path=public/index.html"
    print(f"Fetching: {url}")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type')}")
        print(f"Content-Length: {len(response.text)}")
        
        if response.status_code == 200:
            content = response.text
            
            # Check key indicators
            print(f"\n=== Content Analysis ===")
            print(f"Contains HTML doctype: {'<!DOCTYPE html>' in content}")
            print(f"Contains React: {'React' in content}")
            root_div_present = 'id="root"' in content
            print(f"Contains root div: {root_div_present}")
            print(f"Contains error message: {'404 Not Found' in content}")
            print(f"Contains 'Unexpected Application Error': {'Unexpected Application Error' in content}")
            
            # Show first 500 characters
            print(f"\n=== First 500 Characters ===")
            print(content[:500])
            
            # Show last 500 characters  
            print(f"\n=== Last 500 Characters ===")
            print(content[-500:])
            
            # Look for script content
            if '<script>' in content:
                script_start = content.find('<script>')
                script_end = content.find('</script>', script_start)
                if script_start != -1 and script_end != -1:
                    script_content = content[script_start:script_start+200]
                    print(f"\n=== Script Content (first 200 chars) ===")
                    print(script_content)
                    
        else:
            print(f"Error response: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    debug_preview_content()
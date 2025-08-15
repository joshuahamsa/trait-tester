#!/usr/bin/env python3
"""
update_script_manifest.py

This script reads the manifest.json file and updates the embedded manifest data
in script.js to keep them in sync. This allows us to use manifest.json as the
single source of truth while still having the data embedded in script.js for
static hosting compatibility.

Usage: python3 update_script_manifest.py
"""

import json
import re
import sys


def read_manifest():
    """Read the manifest.json file and return the traits data."""
    try:
        with open('manifest.json', 'r') as f:
            data = json.load(f)
        return data.get('traits', data)
    except FileNotFoundError:
        print("Error: manifest.json not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in manifest.json: {e}")
        sys.exit(1)


def format_manifest_for_js(manifest):
    """Format the manifest data as a JavaScript object string."""
    # Convert the manifest to a formatted JSON string
    json_str = json.dumps(manifest, indent=2)
    
    # Replace the outer braces and add proper JavaScript formatting
    lines = json_str.split('\n')
    
    # Remove the first and last lines (outer braces)
    lines = lines[1:-1]
    
    # Join the lines and return
    return '\n'.join(lines)


def update_script_js(manifest_js):
    """Update the script.js file with the new manifest data."""
    try:
        with open('script.js', 'r') as f:
            content = f.read()
    except FileNotFoundError:
        print("Error: script.js not found")
        sys.exit(1)
    
    # Find the getTraitManifest function and replace its return value
    pattern = (
        r'(function getTraitManifest\(\) \{[^}]*'
        r'// This data is automatically updated by '
        r'update_script_manifest\.py\s*'
        r'return \{[^}]*\};?\s*\})'
    )
    
    replacement = f'''function getTraitManifest() {{
  // This data is automatically updated by update_script_manifest.py
  return {{
{manifest_js}
  }};
}}'''
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    if new_content == content:
        print("Warning: No changes were made to script.js. "
              "The pattern might not have matched.")
        return False
    
    # Write the updated content back to script.js
    with open('script.js', 'w') as f:
        f.write(new_content)
    
    return True


def main():
    """Main function to update script.js with manifest data."""
    print("Reading manifest.json...")
    manifest = read_manifest()
    
    print("Formatting manifest for JavaScript...")
    manifest_js = format_manifest_for_js(manifest)
    
    print("Updating script.js...")
    if update_script_js(manifest_js):
        print("✅ Successfully updated script.js with manifest data")
    else:
        print("❌ Failed to update script.js")
        sys.exit(1)

if __name__ == "__main__":
    main()

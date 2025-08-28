#!/usr/bin/env python3

import re

def debug_script_extraction():
    with open('script.js', 'r') as f:
        content = f.read()
    
    # Find the manifest object
    manifest_match = re.search(r'return\s*\{([^}]+)\}', content, re.DOTALL)
    if not manifest_match:
        print("No manifest found")
        return
    
    manifest_text = manifest_match.group(1)
    print("Manifest text found, length:", len(manifest_text))
    
    # Look for trait type patterns
    trait_patterns = re.findall(r'"([^"]+)":\s*\[', manifest_text)
    print("Found trait types:", trait_patterns)

if __name__ == "__main__":
    debug_script_extraction()

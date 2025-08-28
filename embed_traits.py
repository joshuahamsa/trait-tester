#!/usr/bin/env python3
"""
Embed trait mapping data directly into script.js
"""

import json
import re


def embed_trait_mapping():
    """Embed the trait mapping data into script.js"""
    
    # Load the trait mapping JSON
    with open('trait_mapping.json', 'r') as f:
        trait_mapping = json.load(f)
    
    # Read the current script.js
    with open('script.js', 'r') as f:
        script_content = f.read()
    
    # Create the embedded mapping string
    mapping_string = json.dumps(trait_mapping, indent=2)
    
    # Replace the loadTraitMapping function
    new_function = f'''/**
 * Initialize the trait mapping with embedded data
 */
function loadTraitMapping() {{
  // Trait mapping data - auto-generated from CSV
  traitMapping = {mapping_string};
  
  console.log('Loaded embedded trait mapping with', Object.keys(traitMapping).length, 'entries');
}}'''
    
    # Find and replace the loadTraitMapping function
    pattern = r'/\*\*\s*\n\s*\* Initialize the trait mapping with embedded data\s*\n\s\*/\s*\nfunction loadTraitMapping\(\) \{[\s\S]*?\n\s*\}'
    
    if re.search(pattern, script_content):
        # Replace existing function
        script_content = re.sub(pattern, new_function, script_content)
    else:
        # Find the old async function and replace it
        old_pattern = r'/\*\*\s*\n\s*\* Load the JSON data and create a mapping from new trait names to original trait names\s*\n\s\*/\s*\nasync function loadTraitMapping\(\) \{[\s\S]*?\n\s*\}'
        script_content = re.sub(old_pattern, new_function, script_content)
    
    # Also remove the await from the init function call
    script_content = script_content.replace('await loadTraitMapping();', 'loadTraitMapping();')
    
    # Write the updated script
    with open('script.js', 'w') as f:
        f.write(script_content)
    
    print(f"Embedded {len(trait_mapping)} trait mappings into script.js")


if __name__ == "__main__":
    embed_trait_mapping()

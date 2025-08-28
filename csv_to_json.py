#!/usr/bin/env python3
"""
Convert CSV trait data to JSON for embedding in script.js
"""

import csv
import json


def convert_csv_to_json():
    """Convert CSV trait data to JSON format"""
    csv_data = []
    with open('Baysed Traits Named.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            csv_data.append(row)
    
    # Create the mapping object - only use New_Trait_w_ID to avoid duplicates
    trait_mapping = {}
    
    for row in csv_data:
        new_trait_with_id = row['New_Trait_w_ID']
        original_trait = row['Original_Trait']
        trait_type = row['Trait_Type']
        
        # Only create mapping for the ID version (APE/HOG format) 
        # and ensure no duplicates
        if new_trait_with_id and new_trait_with_id.strip():
            # Use the ID version as the key to avoid duplicates
            trait_mapping[new_trait_with_id.strip()] = {
                'original': original_trait,
                'type': trait_type
            }
    
    # Write to JSON file
    with open('trait_mapping.json', 'w') as f:
        json.dump(trait_mapping, f, indent=2)
    
    print(f"Created trait_mapping.json with {len(trait_mapping)} entries")
    print("Sample entries:")
    for i, (key, value) in enumerate(trait_mapping.items()):
        if i < 5:  # Show first 5 entries
            print(f"  '{key}': {value}")
        else:
            break
    
    # Also create a JavaScript version for embedding
    js_content = "// Trait mapping data - auto-generated from CSV\n"
    js_content += ("const TRAIT_MAPPING = " + 
                   json.dumps(trait_mapping, indent=2) + ";\n")
    
    with open('trait_mapping.js', 'w') as f:
        f.write(js_content)
    
    print("Created trait_mapping.js for embedding in script.js")


if __name__ == "__main__":
    convert_csv_to_json()

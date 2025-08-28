#!/usr/bin/env python3
"""
Find traits in script.js that have matching CSV entries for immediate display
"""

import csv
import re


def extract_trait_names_from_script():
    """Extract trait names from script.js manifest"""
    with open('script.js', 'r') as f:
        content = f.read()
    
    # Find the manifest object
    manifest_match = re.search(r'return\s*\{([^}]+)\}', content, re.DOTALL)
    if not manifest_match:
        return {}
    
    manifest_text = manifest_match.group(1)
    
    # Parse the manifest object
    trait_data = {}
    current_trait = None
    
    for line in manifest_text.split('\n'):
        line = line.strip()
        # Look for trait type headers like "Skin": [
        trait_match = re.match(r'"([^"]+)":\s*\[', line)
        if trait_match:
            current_trait = trait_match.group(1)
            trait_data[current_trait] = []
        # Look for trait names with .png extension
        elif line.startswith('"') and '.png' in line:
            if current_trait:
                # Extract the trait name between quotes, removing .png extension
                trait_match = re.match(r'"([^"]+)\.png"', line)
                if trait_match:
                    trait_name = trait_match.group(1)
                    trait_data[current_trait].append(trait_name)
    
    return trait_data


def load_csv_data():
    """Load trait data from CSV file"""
    csv_data = []
    with open('Baysed Traits Named.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            csv_data.append(row)
    return csv_data


def find_displayable_traits():
    """Find traits that can be displayed with original names"""
    script_traits = extract_trait_names_from_script()
    csv_data = load_csv_data()
    
    print("=== DISPLAYABLE TRAITS ANALYSIS ===\n")
    
    # Create a mapping from new trait names to original names
    trait_mapping = {}
    
    # Process CSV data
    for row in csv_data:
        new_trait = row['New_Trait']
        new_trait_with_id = row['New_Trait_w_ID']
        original_trait = row['Original_Trait']
        trait_type = row['Trait_Type']
        
        # Map both versions of the new trait name
        if new_trait:
            trait_mapping[new_trait] = {
                'original': original_trait,
                'type': trait_type
            }
        if new_trait_with_id:
            trait_mapping[new_trait_with_id] = {
                'original': original_trait,
                'type': trait_type
            }
    
    # Convert trait type names to match script.js
    type_mapping = {
        'Skin': 'Skin',
        'Clothes': 'Clothes', 
        'Mouth': 'Mouth',
        'Eyes': 'Eyes',
        'Headwear': 'Headwear',
        'Tusk': 'Tusk',
        'Clothing': 'Clothes'  # HOG clothing maps to Clothes
    }
    
    displayable_traits = {}
    missing_mappings = []
    
    for script_trait_type, script_trait_names in script_traits.items():
        displayable_traits[script_trait_type] = []
        
        print(f"\n--- {script_trait_type.upper()} ---")
        print(f"Total traits in script.js: {len(script_trait_names)}")
        
        for script_trait in script_trait_names:
            if script_trait in trait_mapping:
                original_name = trait_mapping[script_trait]['original']
                csv_type = trait_mapping[script_trait]['type']
                displayable_traits[script_trait_type].append({
                    'script_name': script_trait,
                    'original_name': original_name,
                    'csv_type': csv_type
                })
                print(f"  ✅ {script_trait} -> {original_name}")
            else:
                missing_mappings.append({
                    'type': script_trait_type,
                    'name': script_trait
                })
                print(f"  ❌ {script_trait} (no CSV mapping)")
        
        print(f"  Displayable: {len(displayable_traits[script_trait_type])}/{len(script_trait_names)}")
    
    # Summary
    total_script_traits = sum(len(traits) for traits in script_traits.values())
    total_displayable = sum(len(traits) for traits in displayable_traits.values())
    
    print(f"\n\n=== SUMMARY ===")
    print(f"Total traits in script.js: {total_script_traits}")
    print(f"Traits with CSV mappings: {total_displayable}")
    print(f"Coverage: {total_displayable/total_script_traits*100:.1f}%")
    
    if missing_mappings:
        print(f"\nMissing mappings: {len(missing_mappings)}")
        print("These traits need CSV entries to show original names:")
        for missing in missing_mappings[:10]:  # Show first 10
            print(f"  {missing['type']}: {missing['name']}")
        if len(missing_mappings) > 10:
            print(f"  ... and {len(missing_mappings) - 10} more")
    
    return displayable_traits


if __name__ == "__main__":
    find_displayable_traits()

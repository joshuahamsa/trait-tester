#!/usr/bin/env python3
"""
Script to help update CSV trait names to match script.js
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
        elif line.startswith('"') and line.endswith('.png",'):
            if current_trait:
                trait_name = line[1:-5]  # Remove quotes and '.png",'
                trait_data[current_trait].append(trait_name)
        elif line.startswith('"') and line.endswith('.png"'):
            if current_trait:
                trait_name = line[1:-4]  # Remove quotes and '.png"'
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


def find_matches():
    """Find which CSV entries need updates"""
    script_traits = extract_trait_names_from_script()
    csv_data = load_csv_data()
    
    print("=== CSV UPDATE ANALYSIS ===\n")
    
    # Group CSV data by trait type
    csv_by_type = {}
    for row in csv_data:
        trait_type = row['Trait_Type']
        if trait_type not in csv_by_type:
            csv_by_type[trait_type] = []
        csv_by_type[trait_type].append(row)
    
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
    
    updates_needed = []
    
    for trait_type, csv_traits in csv_by_type.items():
        script_trait_type = type_mapping.get(trait_type)
        if not script_trait_type or script_trait_type not in script_traits:
            print(f"⚠️  Skipping {trait_type} - no matching script.js category")
            continue
        
        script_trait_names = script_traits[script_trait_type]
        
        print(f"\n--- {trait_type.upper()} ---")
        print(f"Script.js has {len(script_trait_names)} traits")
        print(f"CSV has {len(csv_traits)} traits")
        
        for csv_row in csv_traits:
            new_trait = csv_row['New_Trait']
            new_trait_with_id = csv_row['New_Trait_w_ID']
            original_trait = csv_row['Original_Trait']
            
            # Check for exact matches
            exact_match = None
            partial_matches = []
            
            for script_trait in script_trait_names:
                if new_trait == script_trait or new_trait_with_id == script_trait:
                    exact_match = script_trait
                    break
                elif new_trait in script_trait or new_trait_with_id in script_trait:
                    partial_matches.append(script_trait)
            
            if exact_match:
                print(f"  ✅ {original_trait} -> {exact_match}")
            elif partial_matches:
                print(f"  🔄 {original_trait} -> {new_trait}")
                print(f"      Partial matches: {partial_matches}")
                updates_needed.append({
                    'type': trait_type,
                    'original': original_trait,
                    'current_new': new_trait,
                    'current_with_id': new_trait_with_id,
                    'suggestions': partial_matches
                })
            else:
                print(f"  ❌ {original_trait} -> {new_trait} (no matches found)")
                updates_needed.append({
                    'type': trait_type,
                    'original': original_trait,
                    'current_new': new_trait,
                    'current_with_id': new_trait_with_id,
                    'suggestions': []
                })
    
    if updates_needed:
        print(f"\n\n=== UPDATES NEEDED ===")
        print(f"Total entries needing updates: {len(updates_needed)}")
        
        for update in updates_needed:
            print(f"\n{update['type']}: {update['original']}")
            print(f"  Current: {update['current_new']}")
            print(f"  Current with ID: {update['current_with_id']}")
            if update['suggestions']:
                print(f"  Suggestions: {update['suggestions']}")
            else:
                print(f"  No suggestions found")


if __name__ == "__main__":
    find_matches()

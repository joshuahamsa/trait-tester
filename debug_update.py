#!/usr/bin/env python3

import csv
import re

def extract_trait_names_from_script():
    with open('script.js', 'r') as f:
        content = f.read()
    
    manifest_match = re.search(r'return\s*\{([^}]+)\}', content, re.DOTALL)
    if not manifest_match:
        return {}
    
    manifest_text = manifest_match.group(1)
    
    trait_data = {}
    current_trait = None
    
    for line in manifest_text.split('\n'):
        line = line.strip()
        if line.startswith('"') and line.endswith(': ['):
            current_trait = line[1:-3]
            trait_data[current_trait] = []
        elif line.startswith('"') and line.endswith('.png",'):
            if current_trait:
                trait_name = line[1:-5]
                trait_data[current_trait].append(trait_name)
        elif line.startswith('"') and line.endswith('.png"'):
            if current_trait:
                trait_name = line[1:-4]
                trait_data[current_trait].append(trait_name)
    
    return trait_data

def debug():
    script_traits = extract_trait_names_from_script()
    print("Script.js trait types:", list(script_traits.keys()))
    
    csv_data = []
    with open('Baysed Traits Named.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            csv_data.append(row)
    
    csv_types = set()
    for row in csv_data:
        csv_types.add(row['Trait_Type'])
    
    print("CSV trait types:", list(csv_types))
    
    type_mapping = {
        'Skin': 'Skin',
        'Clothes': 'Clothes', 
        'Mouth': 'Mouth',
        'Eyes': 'Eyes',
        'Headwear': 'Headwear',
        'Tusk': 'Tusk',
        'Clothing': 'Clothes'
    }
    
    for csv_type in csv_types:
        script_type = type_mapping.get(csv_type)
        print(f"CSV: {csv_type} -> Script: {script_type}")
        if script_type in script_traits:
            print(f"  Found in script.js: {len(script_traits[script_type])} traits")
        else:
            print(f"  NOT found in script.js")

if __name__ == "__main__":
    debug()

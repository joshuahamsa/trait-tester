#!/usr/bin/env python3
"""
Analyze trait name matches between CSV file and script.js
Output results to trait-matching.md in markdown format
"""

import csv
import re
from difflib import SequenceMatcher


def similarity_score(a, b):
    """Calculate similarity score between two strings"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def extract_trait_names_from_script():
    """Extract trait names from script.js manifest"""
    with open('script.js', 'r') as f:
        content = f.read()
    
    # Find the manifest object - look for the return statement
    manifest_match = re.search(r'return\s*\{([\s\S]*?)\n\s*};', content)
    if not manifest_match:
        return {}
    
    manifest_text = manifest_match.group(1)
    
    # Parse the manifest object using regex to find trait types and arrays
    trait_data = {}
    
    # Find all trait type sections
    pattern = r'"([^"]+)":\s*\[([\s\S]*?)\]\s*,?\s*(?=\n\s*"[^"]+"|$)'
    trait_sections = re.findall(pattern, manifest_text)
    
    for trait_type, trait_list in trait_sections:
        # Extract trait names from the array
        trait_matches = re.findall(r'"([^"]+\.png)"', trait_list)
        trait_data[trait_type] = [name.replace('.png', '') 
                                 for name in trait_matches]
    
    return trait_data


def load_csv_data():
    """Load trait data from CSV file"""
    csv_data = []
    with open('Baysed Traits Named.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            csv_data.append(row)
    return csv_data


def analyze_matches():
    """Analyze matches between CSV and script.js and output to markdown"""
    script_traits = extract_trait_names_from_script()
    csv_data = load_csv_data()
    
    # Start building markdown content
    markdown_content = []
    markdown_content.append("# Trait Matching Analysis")
    markdown_content.append("")
    desc = "This document analyzes the matching between traits in `script.js` "
    desc += "and the CSV file across different categories."
    markdown_content.append(desc)
    markdown_content.append("")
    
    # Group CSV data by trait type
    csv_by_type = {}
    for row in csv_data:
        trait_type = row['Trait_Type']
        if trait_type not in csv_by_type:
            csv_by_type[trait_type] = []
        csv_by_type[trait_type].append(row)
    
    # Collect summary data
    summary_data = {}
    all_missing_in_script = []
    all_unassociated = []
    
    # Compare each trait type
    for trait_type in csv_by_type:
        # Convert trait type names to match script.js
        type_mapping = {
            'Skin': 'Skin',
            'Clothes': 'Clothing', 
            'Clothing': 'Clothes',  # Map CSV "Clothing" to script.js "Clothes"
            'Mouth': 'Mouth',
            'Eyes': 'Eyes',
            'Headwear': 'Headwear',
            'Tusk': 'Tusk'
        }
        script_trait_type = type_mapping.get(trait_type, trait_type) # Default to trait_type if not in mapping
        
        if script_trait_type not in script_traits:
            continue
        
        script_trait_names = script_traits[script_trait_type]
        csv_traits = csv_by_type[trait_type]
        
        # Check for matches
        matches = []
        missing_in_script = []
        unassociated = []
        
        for csv_row in csv_traits:
            new_trait = csv_row['New_Trait']
            new_trait_with_id = csv_row['New_Trait_w_ID']
            
            # Check if either version matches a script trait
            found = False
            for script_trait in script_trait_names:
                if (new_trait in script_trait or 
                    new_trait_with_id in script_trait):
                    matches.append({
                        'csv_original': csv_row['Original_Trait'],
                        'csv_new': new_trait,
                        'csv_with_id': new_trait_with_id,
                        'script_match': script_trait
                    })
                    found = True
                    break
            
            if not found:
                missing_in_script.append({
                    'original': csv_row['Original_Trait'],
                    'new': new_trait,
                    'with_id': new_trait_with_id,
                    'type': trait_type  # Store the trait type from CSV
                })
        
        # Check for script traits not in CSV
        for script_trait in script_trait_names:
            found = False
            for csv_row in csv_traits:
                new_trait = csv_row['New_Trait']
                new_trait_with_id = csv_row['New_Trait_w_ID']
                if (new_trait in script_trait or 
                    new_trait_with_id in script_trait):
                    found = True
                    break
            if not found:
                unassociated.append(script_trait)
        
        # Store summary data
        summary_data[trait_type] = {
            'script_count': len(script_trait_names),
            'csv_count': len(csv_traits),
            'matches': len(matches),
            'missing_in_script': len(missing_in_script),
            'unassociated': len(unassociated)
        }
        
        # Collect all missing and unassociated for summary
        all_missing_in_script.extend(missing_in_script)
        all_unassociated.extend(unassociated)
    
    # Add summary section
    markdown_content.append("## Summary")
    markdown_content.append("")
    
    total_script = sum(data['script_count'] for data in summary_data.values())
    total_csv = sum(data['csv_count'] for data in summary_data.values())
    total_matches = sum(data['matches'] for data in summary_data.values())
    total_missing_in_script = len(all_missing_in_script)
    total_unassociated = len(all_unassociated)
    
    markdown_content.append("| Metric | Count |")
    markdown_content.append("|--------|-------|")
    markdown_content.append(f"| Total Script.js traits | {total_script} |")
    markdown_content.append(f"| Total CSV traits | {total_csv} |")
    markdown_content.append(f"| ✅ Found matches | {total_matches} |")
    markdown_content.append(f"| ❌ Missing in script.js | {total_missing_in_script} |")
    markdown_content.append(f"| ❌ Unassociated traits | {total_unassociated} |")
    markdown_content.append("")
    
    if all_missing_in_script:
        markdown_content.append("### All Missing in Script.js (Need Artist Tickets)")
        markdown_content.append("")
        markdown_content.append("| Collection | Trait Type | Original Trait | Updated Trait |")
        markdown_content.append("|------------|------------|----------------|---------------|")
        
        # Find best matches for missing items
        for item in all_missing_in_script:
            # Extract collection from the trait name
            collection = "HOG" if item['with_id'].startswith("HOG") else "APE"
            trait_type = item['type']
            
            # Find the best match from script.js traits of the SAME TYPE
            best_match = None
            best_score = 0
            
            # Get the corresponding script trait type
            script_trait_type = type_mapping.get(trait_type, trait_type)
            if script_trait_type in script_traits:
                script_trait_names = script_traits[script_trait_type]
                
                for script_trait in script_trait_names:
                    score = similarity_score(item['with_id'], script_trait)
                    if score > best_score:
                        best_score = score
                        best_match = script_trait
            
            likely_match = best_match if best_match else "None found"
            chance_percent = f"{best_score * 100:.1f}%" if best_match else "0%"
            
            markdown_content.append(f"| {collection} | {trait_type} | {item['original']} | "
                                  f"{item['with_id']} |")
        markdown_content.append("")
    
    if all_unassociated:
        markdown_content.append("### All Unassociated Traits (Need CSV Entries)")
        markdown_content.append("")
        markdown_content.append("| Collection | Trait Type | Original Trait | Updated Trait |")
        markdown_content.append("|------------|------------|----------------|---------------|")
        
        for trait in all_unassociated:
            # Extract collection from the trait name
            collection = "HOG" if trait.startswith("HOG") else "APE"
            
            # For unassociated traits, we need to determine trait type from context
            # This would require additional logic or manual mapping
            trait_type = "Unknown"
            
            # Find the best match from CSV traits of the SAME TYPE
            best_match = None
            best_score = 0
            
            # Try to determine trait type from naming patterns first
            trait_lower = trait.lower()
            if any(word in trait_lower for word in ['shirt', 'tee', 'hoodie', 'jacket', 'vest', 'suit', 'robe', 'tunic', 'jersey', 'uniform', 'garb', 'attire', 'ensemble', 'shroud', 'mantle']):
                trait_type = "Clothing"
            elif any(word in trait_lower for word in ['skin', 'hide', 'fur', 'scales', 'armor', 'glow', 'frost', 'flame']):
                trait_type = "Skin"
            elif any(word in trait_lower for word in ['grill', 'teeth', 'pipe', 'cigar', 'stick', 'pop', 'husk', 'grille', 'maw', 'scepter', 'dagger', 'roll', 'shard']):
                trait_type = "Mouth"
            elif any(word in trait_lower for word in ['eye', 'laser', 'shutter', 'mask', 'veil', 'spectra', 'eclipse', 'vision']):
                trait_type = "Eyes"
            elif any(word in trait_lower for word in ['cap', 'hat', 'helmet', 'beret', 'mask', 'crown', 'hood', 'bandana']):
                trait_type = "Headwear"
            elif any(word in trait_lower for word in ['tusk', 'fang', 'bone', 'spine', 'nest']):
                trait_type = "Tusk"
            
            # Only compare with CSV traits of the same type
            for csv_row in csv_data:
                if csv_row['Trait_Type'] == trait_type:
                    csv_trait = csv_row['New_Trait_w_ID']
                    score = similarity_score(trait, csv_trait)
                    if score > best_score:
                        best_score = score
                        best_match = csv_row['Original_Trait']
            
            likely_match = best_match if best_match else "None found"
            chance_percent = f"{best_score * 100:.1f}%" if best_match else "0%"
            
            # Extract original trait name (remove collection prefix)
            original_trait = trait.replace("HOG ", "").replace("APE ", "")
            markdown_content.append(f"| {collection} | {trait_type} | {original_trait} | "
                                  f"{trait} |")
        markdown_content.append("")
    
    markdown_content.append("---")
    markdown_content.append("")
    
    # Now add detailed sections
    for trait_type in csv_by_type:
        markdown_content.append(f"## {trait_type.upper()}")
        markdown_content.append("")
        
        # Convert trait type names to match script.js
        type_mapping = {
            'Skin': 'Skin',
            'Clothes': 'Clothing', 
            'Clothing': 'Clothes',  # Map CSV "Clothing" to script.js "Clothes"
            'Mouth': 'Mouth',
            'Eyes': 'Eyes',
            'Headwear': 'Headwear',
            'Tusk': 'Tusk'
        }
        script_trait_type = type_mapping.get(trait_type, trait_type) # Default to trait_type if not in mapping
        
        if script_trait_type not in script_traits:
            msg = f"❌ Trait type '{trait_type}' -> '{script_trait_type}' "
            msg += "not found in script.js"
            markdown_content.append(msg)
            markdown_content.append("")
            continue
        
        script_trait_names = script_traits[script_trait_type]
        csv_traits = csv_by_type[trait_type]
        
        # Create summary table
        markdown_content.append("| Metric | Count |")
        markdown_content.append("|--------|-------|")
        markdown_content.append(f"| Script.js traits | {len(script_trait_names)} |")
        markdown_content.append(f"| CSV traits | {len(csv_traits)} |")
        
        # Check for matches
        matches = []
        missing_in_script = []
        unassociated = []
        
        for csv_row in csv_traits:
            new_trait = csv_row['New_Trait']
            new_trait_with_id = csv_row['New_Trait_w_ID']
            
            # Check if either version matches a script trait
            found = False
            for script_trait in script_trait_names:
                if (new_trait in script_trait or 
                    new_trait_with_id in script_trait):
                    matches.append({
                        'csv_original': csv_row['Original_Trait'],
                        'csv_new': new_trait,
                        'csv_with_id': new_trait_with_id,
                        'script_match': script_trait
                    })
                    found = True
                    break
            
            if not found:
                missing_in_script.append({
                    'original': csv_row['Original_Trait'],
                    'new': new_trait,
                    'with_id': new_trait_with_id
                })
        
        # Check for script traits not in CSV
        for script_trait in script_trait_names:
            found = False
            for csv_row in csv_traits:
                new_trait = csv_row['New_Trait']
                new_trait_with_id = csv_row['New_Trait_w_ID']
                if (new_trait in script_trait or 
                    new_trait_with_id in script_trait):
                    found = True
                    break
            if not found:
                unassociated.append(script_trait)
        
        markdown_content.append(f"| ✅ Matches | {len(matches)} |")
        markdown_content.append(f"| ❌ Missing in script.js | {len(missing_in_script)} |")
        markdown_content.append(f"| ❌ Unassociated traits | {len(unassociated)} |")
        markdown_content.append("")
        
        if missing_in_script:
            markdown_content.append("### Missing in script.js")
            markdown_content.append("")
            for item in missing_in_script:
                markdown_content.append(f"- {item['original']} → {item['new']} "
                                      f"({item['with_id']})")
            markdown_content.append("")
        
        if unassociated:
            markdown_content.append("### Unassociated Traits")
            markdown_content.append("")
            for trait in unassociated:
                markdown_content.append(f"- {trait}")
            markdown_content.append("")
        
        if matches:
            markdown_content.append("### Sample Matches")
            markdown_content.append("")
            for i, match in enumerate(matches[:5]):  # Show first 5 matches
                markdown_content.append(f"{i+1}. {match['csv_original']} → "
                                      f"{match['script_match']}")
            markdown_content.append("")
        
        markdown_content.append("---")
        markdown_content.append("")
    
    # Write to trait-matching.md
    with open('trait-matching.md', 'w') as f:
        f.write('\n'.join(markdown_content))
    
    print("Analysis complete! Results written to trait-matching.md")


if __name__ == "__main__":
    analyze_matches()

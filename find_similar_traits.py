#!/usr/bin/env python3
"""
Find similar trait names between CSV and script.js using fuzzy matching
Automatically fix spacing issues and offer interactive updates
"""

import csv
import re
from difflib import SequenceMatcher

# CONFIGURABLE THRESHOLDS
SIMILARITY_THRESHOLD = 0.7  # Minimum score to show as potential match
HIGH_CONFIDENCE_THRESHOLD = 0.5  # Score above which to offer updates


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


def save_csv_data(csv_data):
    """Save updated CSV data back to file"""
    with open('Baysed Traits Named.csv', 'w', newline='') as f:
        fieldnames = ['Trait_Type', 'Original_Trait', 'New_Trait', 'New_Trait_w_ID']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(csv_data)


def similarity_score(a, b):
    """Calculate similarity score between two strings"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def is_spacing_only_difference(str1, str2):
    """Check if two strings differ only by spacing"""
    # Remove all spaces and compare
    clean1 = re.sub(r'\s+', '', str1)
    clean2 = re.sub(r'\s+', '', str2)
    return clean1.lower() == clean2.lower()


def fix_spacing(str1, str2):
    """Return str1 with spacing corrected to match str2"""
    # If they're already the same, return str2
    if str1 == str2:
        return str2
    
    # Split both strings into words
    words1 = str1.split()
    words2 = str2.split()
    
    # If they have the same words in the same order, use str2's spacing
    if words1 == words2:
        return str2
    
    # Otherwise, normalize spacing (single spaces between words)
    return ' '.join(str1.split())


def find_similar_traits():
    """Find similar trait names between CSV and script.js"""
    script_traits = extract_trait_names_from_script()
    csv_data = load_csv_data()
    
    print("=== SIMILAR TRAIT ANALYSIS ===\n")
    
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
        'Clothing': 'Clothing', 
        'Mouth': 'Mouth',
        'Eyes': 'Eyes',
        'Headwear': 'Headwear',
        'Tusk': 'Tusk'
    }
    
    potential_matches = []
    spacing_fixes = []
    csv_updates = []
    
    for trait_type, csv_traits in csv_by_type.items():
        script_trait_type = type_mapping.get(trait_type)
        if not script_trait_type or script_trait_type not in script_traits:
            continue
        
        script_trait_names = script_traits[script_trait_type]
        
        print(f"\n--- {trait_type.upper()} ---")
        
        for csv_row in csv_traits:
            new_trait = csv_row['New_Trait']
            new_trait_with_id = csv_row['New_Trait_w_ID']
            original_trait = csv_row['Original_Trait']
            
            # Check for exact matches first (using partial string matching like analyze script)
            exact_match = None
            for script_trait in script_trait_names:
                if (new_trait in script_trait or 
                    new_trait_with_id in script_trait):
                    exact_match = script_trait
                    break
            
            if exact_match:
                continue  # Skip if exact match found
            
            # Find similar traits using fuzzy matching for non-exact matches
            similarities = []
            for script_trait in script_trait_names:
                # Check similarity with both new_trait and new_trait_with_id
                score1 = similarity_score(new_trait, script_trait)
                score2 = similarity_score(new_trait_with_id, script_trait)
                score = max(score1, score2)
                
                if score > SIMILARITY_THRESHOLD:  # Threshold for potential match
                    similarities.append({
                        'script_trait': script_trait,
                        'score': score,
                        'csv_trait': new_trait_with_id,
                        'original': original_trait,
                        'csv_row': csv_row
                    })
            
            # Sort by similarity score
            similarities.sort(key=lambda x: x['score'], reverse=True)
            
            if similarities:
                best_match = similarities[0]
                potential_matches.append({
                    'type': trait_type,
                    'csv_trait': best_match['csv_trait'],
                    'original': best_match['original'],
                    'script_trait': best_match['script_trait'],
                    'score': best_match['score'],
                    'csv_row': best_match['csv_row']
                })
                
                print(f"  CSV: {best_match['csv_trait']}")
                print(f"  Script: {best_match['script_trait']}")
                print(f"  Score: {best_match['score']:.2f}")
                print(f"  Original: {best_match['original']}")
                
                # Check if it's just a spacing issue
                if is_spacing_only_difference(best_match['csv_trait'], 
                                           best_match['script_trait']):
                    fixed_spacing = fix_spacing(best_match['csv_trait'], 
                                              best_match['script_trait'])
                    # Only apply fix if there's actually a difference
                    if fixed_spacing != best_match['csv_trait']:
                        spacing_fixes.append({
                            'csv_row': best_match['csv_row'],
                            'old_value': best_match['csv_trait'],
                            'new_value': fixed_spacing,
                            'script_value': best_match['script_trait']
                        })
                        print(f"  🔧 AUTO-FIX: Spacing corrected to '{fixed_spacing}'")
                    else:
                        print(f"  ✅ Already correct: '{best_match['csv_trait']}'")
                elif best_match['score'] > HIGH_CONFIDENCE_THRESHOLD:  # High confidence match
                    csv_updates.append({
                        'csv_row': best_match['csv_row'],
                        'old_value': best_match['csv_trait'],
                        'new_value': best_match['script_trait'],
                        'score': best_match['score']
                    })
                    print(f"  💡 SUGGESTION: Update to '{best_match['script_trait']}'")
                
                print()
    
    # Apply automatic spacing fixes
    if spacing_fixes:
        print("=== APPLYING AUTOMATIC SPACING FIXES ===")
        for fix in spacing_fixes:
            fix['csv_row']['New_Trait_w_ID'] = fix['new_value']
            print(f"  Fixed: '{fix['old_value']}' → '{fix['new_value']}'")
        
        save_csv_data(csv_data)
        print(f"  ✅ Applied {len(spacing_fixes)} spacing fixes to CSV")
        print()
    
    # Offer interactive updates for high-confidence matches
    if csv_updates:
        print("=== HIGH-CONFIDENCE MATCHES ===")
        print("These traits have >90% similarity. Choose update method:")
        print("1. Update all automatically")
        print("2. Choose individually")
        print("3. Skip all updates")
        print()
        
        choice = input("Enter choice (1/2/3): ").strip()
        
        if choice == "1":
            # Update all automatically
            for update in csv_updates:
                update['csv_row']['New_Trait_w_ID'] = update['new_value']
                print(f"  Updated: '{update['old_value']}' → '{update['new_value']}'")
            
            save_csv_data(csv_data)
            print(f"  ✅ Applied {len(csv_updates)} updates to CSV")
            
        elif choice == "2":
            # Choose individually
            updates_applied = 0
            for i, update in enumerate(csv_updates, 1):
                print(f"\n{i}. {update['old_value']} → {update['new_value']} (Score: {update['score']:.2f})")
                response = input("Update this one? (y/n): ").lower().strip()
                
                if response in ['y', 'yes']:
                    update['csv_row']['New_Trait_w_ID'] = update['new_value']
                    print(f"  ✅ Updated: '{update['old_value']}' → '{update['new_value']}'")
                    updates_applied += 1
                else:
                    print(f"  ⏭️  Skipped: '{update['old_value']}'")
            
            if updates_applied > 0:
                save_csv_data(csv_data)
                print(f"\n✅ Applied {updates_applied} updates to CSV")
            else:
                print("\n⏭️  No updates applied")
                
        else:
            print("  ⏭️  Skipped all updates")
    
    # Write potential matches to a file for easy review
    with open('potential_trait_matches.txt', 'w') as f:
        f.write("=== POTENTIAL TRAIT MATCHES ===\n\n")
        f.write("These traits have high similarity scores and might be the same:\n\n")
        
        for match in potential_matches:
            f.write(f"Type: {match['type']}\n")
            f.write(f"CSV: {match['csv_trait']}\n")
            f.write(f"Script: {match['script_trait']}\n")
            f.write(f"Score: {match['score']:.2f}\n")
            f.write(f"Original: {match['original']}\n")
            f.write("-" * 50 + "\n")
    
    print(f"\nFound {len(potential_matches)} potential matches")
    print("Detailed results written to potential_trait_matches.txt")
    
    return potential_matches


if __name__ == "__main__":
    find_similar_traits()

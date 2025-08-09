#!/usr/bin/env python3
"""
update_manifest.py
==================

This script automatically scans the traits folders and updates the hardcoded
manifest in script.js. This ensures the fallback data is always current.

Usage:
    python3 update_manifest.py

The script will:
1. Scan all trait folders (skin, clothes, mouth, eyes, headwear)
2. Find all PNG files in each folder
3. Update the getCommonNamesForTrait function in script.js
4. Preserve the existing JavaScript structure
"""

import os
import re


def scan_trait_folder(trait_path):
    """Scan a trait folder and return sorted list of PNG files."""
    png_files = []
    if os.path.exists(trait_path):
        for file in os.listdir(trait_path):
            if file.lower().endswith('.png'):
                png_files.append(file)
    return sorted(png_files)


def update_script_js(trait_manifest):
    """Update the script.js file with the new hardcoded manifest."""
    script_path = 'script.js'
    
    # Read the current script.js
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the getCommonNamesForTrait function
    function_pattern = (
        r'function getCommonNamesForTrait\(traitType\) \{[\s\S]*?\n  \};\n'
    )
    
    # Build the new function content
    new_function_parts = ['function getCommonNamesForTrait(traitType) {']
    new_function_parts.append('  const commonNames = {')
    
    for trait_type, files in trait_manifest.items():
        new_function_parts.append(f'    {trait_type}: [')
        for file in files:
            new_function_parts.append(f'      "{file}",')
        new_function_parts.append('    ],')
    
    new_function_parts.append('  };')
    new_function_parts.append('  ')
    new_function_parts.append('  return commonNames[traitType] || [];')
    new_function_parts.append('};')
    
    new_function_content = '\n'.join(new_function_parts)
    
    # Replace the function in the content
    if re.search(function_pattern, content):
        new_content = re.sub(
            function_pattern, 
            new_function_content + '\n', 
            content
        )
        
        # Write the updated content back
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Updated {script_path} with current trait manifest")
        return True
    else:
        print(
            f"❌ Could not find getCommonNamesForTrait function in "
            f"{script_path}"
        )
        return False


def main():
    """Main function to scan traits and update script.js."""
    print("🔍 Scanning trait folders...")
    
    # Define trait folders to scan
    trait_folders = ['skin', 'clothes', 'mouth', 'eyes', 'headwear']
    trait_manifest = {}
    
    # Scan each trait folder
    for trait_folder in trait_folders:
        trait_path = os.path.join('traits', trait_folder)
        files = scan_trait_folder(trait_path)
        trait_manifest[trait_folder] = files
        print(f"  {trait_folder}: {len(files)} files")
    
    # Display summary
    print("\n📊 Trait Manifest Summary:")
    total_files = 0
    for trait_type, files in trait_manifest.items():
        print(f"  {trait_type}: {len(files)} files")
        total_files += len(files)
        for file in files:
            print(f"    - {file}")
    
    print(f"\n📈 Total files found: {total_files}")
    
    # Update script.js
    print("\n🔧 Updating script.js...")
    if update_script_js(trait_manifest):
        print("\n✅ Successfully updated script.js!")
        print("\n💡 Next steps:")
        print("   1. Review the changes: git diff script.js")
        print("   2. Commit the update: git add script.js")
        print(
            "   3. Push to GitHub: git commit -m "
            "'Update hardcoded trait manifest'"
        )
        print("   4. Push to origin: git push origin main")
    else:
        print("\n❌ Failed to update script.js")
        return 1
    
    return 0


if __name__ == '__main__':
    exit(main())

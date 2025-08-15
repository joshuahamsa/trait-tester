#!/usr/bin/env python3
"""
Update game code to use Bunny.net URLs instead of local paths
"""

import re
import os

# Configuration
BUNNY_BASE_URL = "https://baysed.b-cdn.net/traits"  # Update this
FILES_TO_UPDATE = ["script.js", "index.html"]  # Add other files as needed

def update_file(file_path):
    """Update a single file to use Bunny.net URLs"""
    if not os.path.exists(file_path):
        print(f"⚠️  File not found: {file_path}")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace local paths with Bunny.net URLs
        # This pattern matches common local path references
        old_content = content
        
        # Replace various local path patterns
        # Handle template literals and regular strings
        content = re.sub(
            r'traits/([^"\s]+\.png)',
            f'{BUNNY_BASE_URL}/\\1',
            content
        )
        
        content = re.sub(
            r'\./traits/([^"\s]+\.png)',
            f'{BUNNY_BASE_URL}/\\1',
            content
        )
        
        # Handle quoted strings (this will properly handle spaces)
        content = re.sub(
            r'"traits/([^"]+\.png)"',
            f'"{BUNNY_BASE_URL}/\\1"',
            content
        )
        
        # Handle template literals with traits/ paths
        content = re.sub(
            r'`traits/([^`]+\.png)`',
            f'`{BUNNY_BASE_URL}/\\1`',
            content
        )
        
        # Handle template literals with variables (like traits/${trait}/${filename})
        content = re.sub(
            r'`traits/\$\{([^}]+)\}/\$\{([^}]+)\}`',
            lambda m: f'`{BUNNY_BASE_URL}/${{{m.group(1)}}}/${{{m.group(2)}}}`',
            content
        )
        
        # If content changed, write it back
        if content != old_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Updated: {file_path}")
            return True
        else:
            print(f"ℹ️  No changes needed: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Error updating {file_path}: {e}")
        return False

def main():
    print("🔄 Updating game code to use Bunny.net URLs...")
    print(f"🌐 Base URL: {BUNNY_BASE_URL}")
    print()
    
    updated_count = 0
    
    for file_path in FILES_TO_UPDATE:
        if update_file(file_path):
            updated_count += 1
    
    print()
    print(f"📈 Updated {updated_count} files")
    print()
    print("💡 Don't forget to:")
    print("   1. Update BUNNY_BASE_URL in this script with your actual URL")
    print("   2. Add traits/ to .gitignore to prevent future commits")
    print("   3. Test your game to make sure images load correctly")

if __name__ == "__main__":
    main()

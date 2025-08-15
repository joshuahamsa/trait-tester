#!/usr/bin/env python3
"""
Upload trait images to Bunny.net CDN
Requires: pip install requests
"""

import os
import requests
import glob
from pathlib import Path

# Bunny.net Configuration
BUNNY_STORAGE_ZONE = "your-storage-zone-name"  # Replace with your storage zone
BUNNY_API_KEY = "your-api-key"  # Replace with your API key
BUNNY_REGION = "de"  # or your preferred region (de, ny, la, sg, etc.)
BUNNY_PATH = "traits"  # Folder path in Bunny.net

# Bunny.net API endpoints
BUNNY_BASE_URL = f"https://storage.bunnycdn.com/{BUNNY_STORAGE_ZONE}/{BUNNY_PATH}"
BUNNY_PURGE_URL = f"https://api.bunny.net/purge?url=https://{BUNNY_STORAGE_ZONE}.b-cdn.net"

def upload_file(file_path, relative_path):
    """Upload a single file to Bunny.net"""
    url = f"{BUNNY_BASE_URL}/{relative_path}"
    
    headers = {
        "AccessKey": BUNNY_API_KEY,
        "Content-Type": "image/png"
    }
    
    try:
        with open(file_path, 'rb') as f:
            response = requests.put(url, data=f, headers=headers)
            
        if response.status_code == 201:
            print(f"✅ Uploaded: {relative_path}")
            return True
        else:
            print(f"❌ Failed to upload {relative_path}: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error uploading {relative_path}: {e}")
        return False

def get_all_png_files():
    """Get all PNG files in the traits directory"""
    png_files = []
    for root, dirs, files in os.walk("traits"):
        for file in files:
            if file.lower().endswith('.png'):
                full_path = os.path.join(root, file)
                # Get relative path from traits directory
                relative_path = os.path.relpath(full_path, "traits")
                png_files.append((full_path, relative_path))
    return png_files

def purge_cache():
    """Purge Bunny.net cache after upload"""
    headers = {"AccessKey": BUNNY_API_KEY}
    try:
        response = requests.post(BUNNY_PURGE_URL, headers=headers)
        if response.status_code == 200:
            print("✅ Cache purged successfully")
        else:
            print(f"⚠️  Cache purge failed: {response.status_code}")
    except Exception as e:
        print(f"⚠️  Cache purge error: {e}")

def main():
    print("🚀 Starting upload to Bunny.net...")
    print(f"📁 Uploading from: {os.path.abspath('traits')}")
    print(f"🌐 Target: {BUNNY_BASE_URL}")
    print()
    
    # Check if traits directory exists
    if not os.path.exists("traits"):
        print("❌ Error: traits directory not found!")
        return
    
    # Get all PNG files
    png_files = get_all_png_files()
    print(f"📊 Found {len(png_files)} PNG files to upload")
    print()
    
    # Upload files
    successful = 0
    failed = 0
    
    for file_path, relative_path in png_files:
        if upload_file(file_path, relative_path):
            successful += 1
        else:
            failed += 1
    
    print()
    print(f"📈 Upload Summary:")
    print(f"   ✅ Successful: {successful}")
    print(f"   ❌ Failed: {failed}")
    
    if successful > 0:
        print()
        print("🔄 Purging cache...")
        purge_cache()
        
        print()
        print("🎉 Upload complete!")
        print(f"🌐 Your images are now available at:")
        print(f"   https://{BUNNY_STORAGE_ZONE}.b-cdn.net/{BUNNY_PATH}/")
        print()
        print("💡 Update your game code to use these URLs instead of local paths")

if __name__ == "__main__":
    main()

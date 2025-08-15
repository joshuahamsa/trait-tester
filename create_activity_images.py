#!/usr/bin/env python3
"""
Create placeholder images for Discord Activity
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder_image(width, height, text, filename):
    """Create a placeholder image with text"""
    # Create a new image with a gradient background
    img = Image.new('RGB', (width, height), color='#5865F2')  # Discord blue
    draw = ImageDraw.Draw(img)
    
    # Try to use a system font, fallback to default
    try:
        font_size = min(width, height) // 10
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Calculate text position to center it
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Draw text with white color
    draw.text((x, y), text, fill='white', font=font)
    
    # Save the image
    img.save(filename)
    print(f"Created {filename}")

def main():
    # Create assets directory if it doesn't exist
    assets_dir = "discord-activity/assets"
    os.makedirs(assets_dir, exist_ok=True)
    
    # Create large image (512x512)
    create_placeholder_image(
        512, 512, 
        "Ravager\nTrait\nTester", 
        f"{assets_dir}/large-image.png"
    )
    
    # Create small image (128x128)
    create_placeholder_image(
        128, 128, 
        "RTT", 
        f"{assets_dir}/small-image.png"
    )
    
    print("✅ Discord activity images created successfully!")
    print(f"📁 Images saved to: {assets_dir}/")

if __name__ == "__main__":
    main()

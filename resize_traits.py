#!/usr/bin/env python3
"""
resize_traits.py
=================

This helper script resizes PNG images to a fixed width and height,
preserving transparency. It can process either a single file or
recursively scan a directory for PNG images.

It is designed to assist NFT teams who have high‑resolution trait
assets (e.g. 2048×2048) and need to downscale them to 1024×1024 or
another size for use in preview applications like the dress up game.

Usage for single file:
    python3 resize_traits.py --input path/to/image.png --size 1024
    python3 resize_traits.py --input path/to/image.png --output path/to/resized.png --size 1024

Usage for directory:
    python3 resize_traits.py --input path/to/traits --size 1024
    python3 resize_traits.py --input path/to/traits --output path/to/resized --size 1024

The `--size` argument sets both width and height. By default the
script resizes to 1024×1024. Only `.png` files are processed. The
original files are overwritten, so be sure to keep a backup of your
high‑resolution assets before running.

For single files, `--output` specifies the output filename.
For directories, `--output` specifies the output directory and the
directory structure under `--input` will be mirrored under `--output`.
"""

import argparse
import os
from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Resize PNG traits - single file or directory.")
    parser.add_argument(
        '--input', '-i', required=True, 
        help='Path to a single PNG file or directory containing PNG files'
    )
    parser.add_argument(
        '--output', '-o', default=None,
        help='Optional output path. For single files: output filename. For directories: output directory. If omitted, input files are overwritten.'
    )
    parser.add_argument(
        '--size', '-s', type=int, default=1024,
        help='Target width and height in pixels.  Default is 1024.'
    )
    parser.add_argument(
        '--keep-aspect', action='store_true',
        help='If set, maintain the original aspect ratio and pad to square with transparency.'
    )
    return parser.parse_args()


def resize_image(path_in: str, path_out: str, size: int, keep_aspect: bool) -> None:
    """Open, resize and save a single image."""
    with Image.open(path_in) as img:
        img = img.convert('RGBA')
        if keep_aspect:
            # Fit image into square canvas while preserving aspect ratio
            ratio = min(size / img.width, size / img.height)
            new_size = (int(img.width * ratio), int(img.height * ratio))
            resized = img.resize(new_size, Image.Resampling.LANCZOS)
            # Create transparent square canvas and paste resized image centered
            canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            offset = ((size - new_size[0]) // 2, (size - new_size[1]) // 2)
            canvas.paste(resized, offset)
            canvas.save(path_out)
        else:
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            resized.save(path_out)


def process_directory(input_dir: str, output_dir: str, size: int, keep_aspect: bool) -> None:
    """Recursively process PNG files in input_dir, writing to output_dir."""
    for root, dirs, files in os.walk(input_dir):
        for filename in files:
            if not filename.lower().endswith('.png'):
                continue
            input_path = os.path.join(root, filename)
            rel_path = os.path.relpath(input_path, input_dir)
            output_path = input_path if output_dir is None else os.path.join(output_dir, rel_path)
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            resize_image(input_path, output_path, size, keep_aspect)
            print(f"Resized {rel_path} -> {output_path}")


def main() -> None:
    args = parse_args()
    input_path = os.path.abspath(args.input)
    
    if os.path.isfile(input_path):
        # Single file processing
        if not input_path.lower().endswith('.png'):
            print("Error: Input file must be a PNG file")
            return
        
        output_path = input_path if args.output is None else args.output
        if args.output is not None:
            # Ensure output directory exists
            output_dir = os.path.dirname(output_path)
            if output_dir:
                os.makedirs(output_dir, exist_ok=True)
        
        resize_image(input_path, output_path, args.size, args.keep_aspect)
        print(f"Resized {input_path} -> {output_path}")
        
    elif os.path.isdir(input_path):
        # Directory processing (existing functionality)
        output_dir = None if args.output is None else os.path.abspath(args.output)
        if output_dir is not None:
            os.makedirs(output_dir, exist_ok=True)
        process_directory(input_path, output_dir, args.size, args.keep_aspect)
        
    else:
        print(f"Error: Input path '{input_path}' does not exist")
        return
    
    print('Done.')


if __name__ == '__main__':
    main()
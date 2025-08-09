#!/usr/bin/env python3
"""
resize_traits.py
=================

This helper script recursively scans a directory for PNG images and
resizes them to a fixed width and height, preserving transparency.

It is designed to assist NFT teams who have high‑resolution trait
assets (e.g. 2048×2048) and need to downscale them to 1024×1024 or
another size for use in preview applications like the dress up game.

Usage:
    python3 resize_traits.py --input path/to/traits --size 1024

The `--size` argument sets both width and height.  By default the
script resizes to 1024×1024.  Only `.png` files are processed.  The
original files are overwritten, so be sure to keep a backup of your
high‑resolution assets before running.

If you want to output resized files to a separate directory instead
of overwriting, use the `--output` option:

    python3 resize_traits.py --input path/to/traits --output path/to/resized --size 1024

The directory structure under `--input` will be mirrored under
`--output`.
"""

import argparse
import os
from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Resize all PNG traits in a directory.")
    parser.add_argument(
        '--input', '-i', required=True, help='Path to the root trait directory (contains subfolders)'
    )
    parser.add_argument(
        '--output', '-o', default=None,
        help='Optional output directory.  If omitted, input files are overwritten.'
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
    input_dir = os.path.abspath(args.input)
    output_dir = None if args.output is None else os.path.abspath(args.output)
    if output_dir is not None:
        os.makedirs(output_dir, exist_ok=True)
    process_directory(input_dir, output_dir, args.size, args.keep_aspect)
    print('Done.')


if __name__ == '__main__':
    main()
#!/usr/bin/env python3
"""
Simple HTTP server for serving trait images
Run with: python3 serve_images.py
"""

import http.server
import socketserver
import os

# Configuration
PORT = 8080
TRAITS_DIR = "traits"  # Path to your traits directory
ALLOWED_ORIGINS = ["*"]  # Add your domain here for security


class TraitImageHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=TRAITS_DIR, **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()


def main():
    if not os.path.exists(TRAITS_DIR):
        print(f"Error: {TRAITS_DIR} directory not found!")
        return
    
    with socketserver.TCPServer(("", PORT), TraitImageHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print(f"Serving images from: {os.path.abspath(TRAITS_DIR)}")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")


if __name__ == "__main__":
    main()

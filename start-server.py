#!/usr/bin/env python3
"""
Simple HTTP Server for MCDO Website
Run this script to start a local server accessible from your phone
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from socket import gethostbyname, gethostname

# Change to the directory containing this script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Set the port
PORT = 8000

# Get the local IP address
def get_local_ip():
    try:
        # Get the local IP address
        hostname = gethostname()
        local_ip = gethostbyname(hostname)
        return local_ip
    except:
        return "localhost"

# Create the server
Handler = http.server.SimpleHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        local_ip = get_local_ip()
        
        print("=" * 60)
        print("MCDO Website Server Started!")
        print("=" * 60)
        print(f"Local access: http://localhost:{PORT}")
        print(f"Phone access: http://{local_ip}:{PORT}")
        print("=" * 60)
        print("Instructions for phone access:")
        print("1. Make sure your phone and computer are on the same WiFi network")
        print("2. On your phone, open Chrome and go to the address above")
        print("3. If it doesn't work, try these troubleshooting steps:")
        print("   - Check firewall settings on your computer")
        print("   - Make sure both devices are on the same network")
        print("   - Try using the computer's IP address instead of hostname")
        print("=" * 60)
        print("Press Ctrl+C to stop the server")
        
        # Automatically open the browser
        print(f"\nOpening http://localhost:{PORT} in your browser...")
        webbrowser.open(f"http://localhost:{PORT}")
        print("=" * 60)
        
        httpd.serve_forever()

except KeyboardInterrupt:
    print("\nServer stopped by user")
    sys.exit(0)
except Exception as e:
    print(f"Error starting server: {e}")
    print("\nTroubleshooting:")
    print("1. Make sure port 8000 is not in use")
    print("2. Check your firewall settings")
    print("3. Try running as administrator if needed")
    sys.exit(1)

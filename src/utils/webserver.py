# simple_server.py
import http.server
import socketserver
import webbrowser
import threading
import os
import sys

# Configure port
PORT = 8000

# Get the absolute path to the parent directory
script_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(script_dir)

# Change to the parent directory
os.chdir(parent_dir)

# Define the path to the HTML file
html_path = os.path.join('gui', 'xml-editor.html')
url_path = f'http://localhost:{PORT}/{html_path.replace(os.sep, "/")}'

# Define handler
Handler = http.server.SimpleHTTPRequestHandler

# Create server
httpd = socketserver.TCPServer(("", PORT), Handler)

# Function to open browser pointing to the specific HTML file
def open_browser():
    print(f"Opening browser to {url_path}")
    webbrowser.open(url_path)

# Print server info
print(f"Server started at http://localhost:{PORT}")
print(f"Current working directory: {os.getcwd()}")
print(f"Target file path: {os.path.join(os.getcwd(), html_path)}")
print("Press Ctrl+C to stop the server")

# Open browser after a short delay (to ensure server is running)
threading.Timer(0.5, open_browser).start()

# Start server
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\nShutting down server...")
    httpd.server_close()
    sys.exit(0)
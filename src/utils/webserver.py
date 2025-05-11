# simple_server.py
import http.server
import socketserver
import webbrowser
import threading
import os

# Configure port
PORT = 8000

# Move to the parent directory to serve files correctly
os.chdir('..')

# Define handler
Handler = http.server.SimpleHTTPRequestHandler

# Create server
httpd = socketserver.TCPServer(("", PORT), Handler)

# Function to open browser pointing to the specific HTML file
def open_browser():
    webbrowser.open(f'http://localhost:{PORT}/gui/xml-editor.html')

# Print server info
print(f"Server started at http://localhost:{PORT}")
print(f"Opening browser to http://localhost:{PORT}/gui/xml-editor.html")
print("Press Ctrl+C to stop the server")

# Open browser after a short delay (to ensure server is running)
threading.Timer(0.5, open_browser).start()

# Start server
httpd.serve_forever()
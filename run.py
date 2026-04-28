import http.server
import socketserver
import webbrowser
import threading
import os

# Configuration
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n>>> Server started at http://localhost:{PORT}")
        print(">>> Press Ctrl+C in this terminal to stop.")
        httpd.serve_forever()

if __name__ == "__main__":
    # 1. Start the server in a background thread
    daemon_thread = threading.Thread(target=start_server, daemon=True)
    daemon_thread.start()

    # 2. Wait a brief moment and open the browser
    print(">>> Opening browser...")
    webbrowser.open(f"http://localhost:{PORT}")

    # 3. Keep the script running
    try:
        while True:
            import time
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n>>> Server stopping...")

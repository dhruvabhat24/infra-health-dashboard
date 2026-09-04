import os
import subprocess
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/health":
            self.send_response(404)
            self.end_headers()
            return
        result = subprocess.run(
            ["pg_isready", "-U", os.getenv("POSTGRES_USER", "infra"), "-d", os.getenv("POSTGRES_DB", "infra")],
            capture_output=True,
            text=True,
        )
        ok = result.returncode == 0
        self.send_response(200 if ok else 503)
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "ok" if ok else "error",
            "database": os.getenv("POSTGRES_DB", "infra")
        }).encode())

    def log_message(self, *_):
        pass

HTTPServer(("0.0.0.0", 8080), Handler).serve_forever()

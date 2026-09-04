from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess
import json


DNS_SERVER = "172.29.0.53"
EXPECTED_IP = "172.29.0.10"


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path != "/health":
            self.send_response(404)
            self.end_headers()
            return

        try:
            output = subprocess.check_output(
                ["dig", "+short", f"@{DNS_SERVER}", "db.internal"],
                stderr=subprocess.STDOUT,
                text=True,
                timeout=2,
            ).strip()

            ok = EXPECTED_IP in output.splitlines()

            self.send_response(200 if ok else 503)
            self.end_headers()

            self.wfile.write(json.dumps({
                "status": "ok" if ok else "error",
                "resolver": DNS_SERVER,
                "db_internal": EXPECTED_IP if ok else None,
            }).encode())

        except Exception as exc:
            self.send_response(503)
            self.end_headers()

            self.wfile.write(json.dumps({
                "status": "error",
                "detail": str(exc),
            }).encode())

    def log_message(self, *_):
        pass


HTTPServer(("0.0.0.0", 8080), Handler).serve_forever()

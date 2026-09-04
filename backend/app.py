import os
import socket
from flask import Flask, jsonify, request
import psycopg2
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST

app = Flask(__name__)

BACKEND_NAME = os.getenv("BACKEND_NAME", "backend")
DB_HOST = os.getenv("DB_HOST", "db.internal")
DB_NAME = os.getenv("POSTGRES_DB", "infra")
DB_USER = os.getenv("POSTGRES_USER", "infra")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "infra_password")
DB_PORT = int(os.getenv("DB_PORT", "5432"))

REQUESTS = Counter(
    "http_requests_total",
    "Total HTTP requests handled by this backend",
    ["backend", "method", "path", "status"],
)

def db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        connect_timeout=3,
    )

@app.after_request
def after_request(response):
    # The dashboard's traffic chart intentionally measures product requests,
    # not health checks or Prometheus scrapes.
    if request.path == "/data":
        REQUESTS.labels(
            BACKEND_NAME,
            request.method,
            request.path,
            str(response.status_code),
        ).inc()
    return response

@app.get("/health")
def health():
    return jsonify(status="ok", backend=BACKEND_NAME)

@app.get("/data")
def data():
    with db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, service, status, message FROM sample_data ORDER BY id;")
            rows = cur.fetchall()
    return jsonify(
        backend=BACKEND_NAME,
        data=[
            {"id": r[0], "service": r[1], "status": r[2], "message": r[3]}
            for r in rows
        ],
    )

@app.get("/metrics")
def metrics():
    return generate_latest(), 200, {"Content-Type": CONTENT_TYPE_LATEST}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

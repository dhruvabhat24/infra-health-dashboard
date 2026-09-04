import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from flask import Flask, jsonify
import requests

app = Flask(__name__)
PROMETHEUS_URL = os.getenv("PROMETHEUS_URL", "http://prometheus:9090")
HEALTH_TARGETS = {
    "frontend": os.getenv("FRONTEND_URL", "http://frontend/health"),
    "backend-1": os.getenv("BACKEND1_URL", "http://backend1:5000/health"),
    "backend-2": os.getenv("BACKEND2_URL", "http://backend2:5000/health"),
    "database": os.getenv("DATABASE_URL", "http://database:8080/health"),
    "dns": os.getenv("DNS_URL", "http://dns:8080/health"),
    "loadbalancer": os.getenv("LOADBALANCER_URL", "http://loadbalancer/health"),
}

def check_health(item):
    name, url = item
    try:
        r = requests.get(url, timeout=1.5)
        return name, {
            "status": "ok" if r.ok else "error",
            "http_status": r.status_code,
        }
    except requests.RequestException as exc:
        return name, {"status": "error", "detail": str(exc)}

def request_counts():
    query = 'sum by (backend) (increase(http_requests_total{job="backends",path="/data"}[60s]))'
    r = requests.get(
        f"{PROMETHEUS_URL}/api/v1/query",
        params={"query": query},
        timeout=2,
    )
    r.raise_for_status()
    result = r.json()["data"]["result"]
    counts = {"backend-1": 0, "backend-2": 0}
    for item in result:
        backend = item["metric"].get("backend")
        if backend in counts:
            counts[backend] = round(float(item["value"][1]), 2)
    return counts

@app.get("/health")
def health():
    return jsonify(status="ok", service="metrics-api")

@app.get("/metrics/summary")
def summary():
    health = {}
    with ThreadPoolExecutor(max_workers=len(HEALTH_TARGETS)) as pool:
        futures = [pool.submit(check_health, item) for item in HEALTH_TARGETS.items()]
        for future in as_completed(futures):
            name, result = future.result()
            health[name] = result

    try:
        traffic = request_counts()
        prometheus_status = "ok"
    except Exception as exc:
        traffic = {"backend-1": 0, "backend-2": 0}
        prometheus_status = "error"
        health["prometheus"] = {"status": "error", "detail": str(exc)}

    return jsonify({
        "timestamp": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        "traffic_last_60s": traffic,
        "health": health,
        "prometheus": prometheus_status,
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

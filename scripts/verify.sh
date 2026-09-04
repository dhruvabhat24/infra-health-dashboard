#!/bin/sh
set -eu

echo "== Compose status =="
docker compose ps

echo "\n== Frontend health =="
curl -fsS http://localhost:3000/health

echo "\n== Load balancer health =="
curl -fsS http://localhost:8080/health

echo "\n== Data through load balancer =="
curl -fsS http://localhost:8080/data

echo "\n== Metrics summary =="
curl -fsS http://localhost:5001/metrics/summary

echo "\n== Explicit DNS =="
docker compose exec -T backend1 getent hosts db.internal

echo "\nVerification complete."

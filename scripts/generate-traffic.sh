#!/bin/sh
set -eu

echo "Generating requests through the NGINX load balancer..."
while true; do
  curl -fsS http://localhost:8080/data >/dev/null
  sleep 0.25
done

#!/bin/sh
set -eu

docker-entrypoint.sh postgres &
pg_pid=$!

until pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" >/dev/null 2>&1; do
  sleep 1
done

python3 /health.py &
health_pid=$!

wait "$pg_pid"

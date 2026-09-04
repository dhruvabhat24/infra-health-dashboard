#!/bin/sh
set -eu

# Docker Desktop runs its Linux engine inside a VM. With pid=host + privileged,
# nsenter targets the engine's host network namespace on Linux engines.
nsenter -t 1 -n iptables -N INFRA_FIREWALL 2>/dev/null || true
nsenter -t 1 -n iptables -C FORWARD -s "${FRONTEND_SUBNET}" -d "${DATABASE_IP}" -j DROP 2>/dev/null ||
  nsenter -t 1 -n iptables -I FORWARD 1 -s "${FRONTEND_SUBNET}" -d "${DATABASE_IP}" -j DROP

echo "Firewall rule installed: ${FRONTEND_SUBNET} -> ${DATABASE_IP}: DROP"
echo "Allowed backend -> database traffic is not matched by this rule."

trap 'exit 0' TERM INT
while true; do sleep 3600; done

# Failure Testing

Run these tests from the project root. Keep the React dashboard open at http://localhost:3000.

## 1. Kill backend-1

```bash
docker compose stop backend1
```

Expected:
- `backend-1` turns red/unhealthy within a few seconds.
- NGINX's active checker removes backend-1 from its upstream.
- New traffic shifts to backend-2.
- The Live Traffic chart trends toward backend-2 ≈ 100%.

Restore:

```bash
docker compose start backend1
```

## 2. Break DNS

Stop dnsmasq:

```bash
docker compose stop dns
```

Expected:
- `dns` turns red.
- Backends can no longer resolve `db.internal` for new database connections.
- `/data` requests can fail because the database hostname cannot be resolved.
- Backend health may remain green because `/health` intentionally does not require PostgreSQL.

Restore:

```bash
docker compose start dns
```

## 3. Break the load balancer port

From another terminal, stop the service:

```bash
docker compose stop loadbalancer
```

Expected:
- `loadbalancer` turns red.
- Live Traffic stops reaching the backends through the normal application path.

Restore:

```bash
docker compose start loadbalancer
```

## 4. Prove frontend -> database is blocked

Start the firewall profile:

```bash
docker compose --profile firewall up -d firewall
```

Check the installed rule:

```bash
docker compose --profile firewall logs firewall
```

The rule is:

```text
172.28.0.0/24 -> 172.29.0.10 DROP
```

A frontend-only container has no route to the private backend network, which is the primary isolation boundary. The firewall rule adds a second defense-in-depth boundary at the engine forwarding layer.

For a direct connectivity check from the frontend container:

```bash
docker compose exec frontend sh -c 'wget -T 2 -O - http://172.29.0.10:5432 || true'
```

Expected: connection failure/timeout.

For a positive control, prove backend -> database works:

```bash
docker compose exec backend1 sh -c 'wget -qO- http://127.0.0.1:5000/data'
```

Expected: JSON containing the seeded PostgreSQL rows.

> Note for Windows 11 + Docker Desktop: Docker's Linux engine runs in a managed VM. Host-level iptables behavior can differ from a native Linux Docker Engine. The Compose network `backend-net: internal: true` is therefore the deterministic isolation mechanism in this project; the iptables container is a defense-in-depth demonstration. For a Linux-native deployment, the same rule can be installed in the Docker host's `DOCKER-USER` chain.

## 5. Simulate a port/DNS outage and record it

Capture:
1. Dashboard before failure.
2. Failure command.
3. Dashboard after 5–10 seconds.
4. Recovery command.
5. Dashboard returning to normal.

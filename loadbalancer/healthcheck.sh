#!/bin/sh
set -eu

CONF=/etc/nginx/conf.d/upstream.conf

write_upstream() {
  tmp="${CONF}.tmp"
  echo "upstream backend_pool {" > "$tmp"
  healthy=0

  for backend in backend1 backend2; do
    if wget -q -T 1 -O - "http://${backend}:5000/health" | grep -q '"status":"ok"'; then
      echo "  server ${backend}:5000;" >> "$tmp"
      healthy=$((healthy + 1))
      echo "[$(date -Iseconds)] ${backend}=UP"
    else
      echo "[$(date -Iseconds)] ${backend}=DOWN"
    fi
  done

  # Keep nginx config valid when both backends are down; requests will return 502.
  if [ "$healthy" -eq 0 ]; then
    echo "  server 127.0.0.1:65535;" >> "$tmp"
  fi

  echo "}" >> "$tmp"
  mv "$tmp" "$CONF"
  nginx -s reload >/dev/null 2>&1 || true
}

cat > "$CONF" <<'EOF'
upstream backend_pool {
  server backend1:5000;
  server backend2:5000;
}
EOF

nginx -c /etc/nginx/nginx.conf
while true; do
  write_upstream
  sleep 2
done

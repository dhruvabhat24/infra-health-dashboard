FROM postgres:17-alpine
RUN apk add --no-cache python3
COPY health.py /health.py
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 5432 8080
ENTRYPOINT ["/entrypoint.sh"]

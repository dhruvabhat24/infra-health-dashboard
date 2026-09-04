FROM alpine:3.22
RUN apk add --no-cache dnsmasq python3 bind-tools
COPY dnsmasq.conf /etc/dnsmasq.conf
COPY health.py /health.py
EXPOSE 53/udp 53/tcp 8080
CMD ["sh", "-c", "python3 /health.py & exec dnsmasq --keep-in-foreground --conf-file=/etc/dnsmasq.conf"]

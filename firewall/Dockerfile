FROM alpine:3.22
RUN apk add --no-cache iptables iproute2 util-linux
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]

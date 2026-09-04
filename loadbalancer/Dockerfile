FROM nginx:1.27-alpine
RUN apk add --no-cache wget
COPY nginx.conf /etc/nginx/nginx.conf
COPY healthcheck.sh /healthcheck.sh
RUN chmod +x /healthcheck.sh
EXPOSE 80
CMD ["/healthcheck.sh"]

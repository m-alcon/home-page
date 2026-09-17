FROM alpine:3.19

RUN apk add --no-cache \
    nginx \
    php82-fpm \
    php82-json \
    supervisor \
    curl \
    && mkdir -p /run/nginx /var/www/html/data

# PHP-FPM pool: listen on TCP 9000 (not Unix socket)
COPY php-www.conf /etc/php82/php-fpm.d/www.conf

COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY . /var/www/html/

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

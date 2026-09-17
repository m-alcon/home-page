FROM alpine:3.19

RUN apk add --no-cache \
    nginx \
    php82-fpm \
    php82-json \
    supervisor \
    && mkdir -p /run/nginx /var/www/html/data

# PHP-FPM pool: listen on TCP 9000 (not Unix socket)
COPY php-www.conf /etc/php82/php-fpm.d/www.conf

COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY . /var/www/html/

RUN chown -R nginx:nginx /var/www/html/data \
    && chmod 775 /var/www/html/data

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

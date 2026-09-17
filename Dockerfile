FROM alpine:3.19

RUN apk add --no-cache \
    nginx \
    php82-fpm \
    php82-json \
    supervisor \
    && mkdir -p /run/nginx /var/www/html/data

# PHP-FPM pool: listen on TCP 9000 (not Unix socket)
RUN echo "[www] 		\
    listen = 127.0.0.1:9000		\
    user = nginx			\
    group = nginx			\
    pm = dynamic			\
    pm.max_children = 5		\
    pm.start_servers = 2		\
    pm.min_spare_servers = 1	\
    pm.max_spare_servers = 3" > /etc/php82/php-fpm.d/www.conf

COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY . /var/www/html/

RUN chown -R nginx:nginx /var/www/html/data \
    && chmod 775 /var/www/html/data

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

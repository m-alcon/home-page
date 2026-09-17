#!/bin/sh

# Fix data directory permissions (volume mount from host may override)
chown -R nginx:nginx /var/www/html/data
chmod 775 /var/www/html/data

# Initialize JSON files if missing
[ -f /var/www/html/data/notes.json ] || echo '[]' > /var/www/html/data/notes.json
[ -f /var/www/html/data/todos.json ] || echo '[]' > /var/www/html/data/todos.json

chown nginx:nginx /var/www/html/data/*.json

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf

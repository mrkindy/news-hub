#!/bin/sh

echo "Waiting for database..."
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Waiting for database connection..."
  sleep 5
done

# Run migrations
php artisan migrate --force

# fetch news
php artisan news:fetch

exec supervisord -c /etc/supervisor/supervisord.conf

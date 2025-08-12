FROM php:8.4-fpm

ENV APACHE_RUN_USER=newshub
ENV APACHE_RUN_ID=1000
ENV APACHE_RUN_GROUP=newshub

RUN useradd -G www-data,root -u ${APACHE_RUN_ID} -d /home/${APACHE_RUN_USER} ${APACHE_RUN_USER}


ENV COMPOSER_ALLOW_SUPERUSER=1 \
    APP_ENV=production

# ===== Dependency Setup =====
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip curl ca-certificates gnupg lsb-release nano \
    supervisor nginx redis-server \
    libzip-dev libicu-dev zlib1g-dev libpq-dev \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    libonig-dev libxml2-dev libssl-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install -j$(nproc) \
     pdo pdo_mysql bcmath intl zip gd opcache exif pcntl sockets \
  && pecl install redis \
  && docker-php-ext-enable redis \
  && rm -rf /var/lib/apt/lists/*


# ===== Composer =====
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN mkdir -p /home/$APACHE_RUN_USER/.composer && \
    chown -R $APACHE_RUN_USER:$APACHE_RUN_GROUP /home/$APACHE_RUN_USER

# ===== Copy Files =====
WORKDIR /var/www/html
COPY . /var/www/html

# ===== Install Composer dependencies =====
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# ===== Set proper ownership and permissions =====
RUN chown -R $APACHE_RUN_USER:$APACHE_RUN_GROUP /var/www/html \
 && chmod -R 755 /var/www/html \
 && chmod -R 777 storage bootstrap/cache \

# ===== add key and clear Laravel cache =====
RUN su -s /bin/bash $APACHE_RUN_USER -c "php artisan key:generate --force" || true \
 && su -s /bin/bash $APACHE_RUN_USER -c "php artisan config:clear" || true \
 && su -s /bin/bash $APACHE_RUN_USER -c "php artisan route:clear" || true \
 && su -s /bin/bash $APACHE_RUN_USER -c "php artisan view:clear" || true

# ===== Remove default Nginx configuration =====
RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf || true

# ===== Copy Nginx Configuration =====
COPY docker/nginx/laravel.conf /etc/nginx/conf.d/laravel.conf

# ===== Copy Supervisor main configuration =====
RUN mkdir -p /var/log/supervisor
COPY docker/supervisor/services.conf /etc/supervisor/conf.d/services.conf

# ===== optimize Laravel =====
RUN su -s /bin/bash $APACHE_RUN_USER -c "php artisan optimize"

# ===== Final permission fix =====
RUN mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions storage/logs \
 && chmod -R 775 storage bootstrap/cache \
 && chown -R $APACHE_RUN_USER:www-data storage bootstrap/cache \
 && chmod -R 777 storage/framework storage/logs

# ===== Healthcheck =====
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -fsS http://localhost/ || exit 1

EXPOSE 80

# ===== Entrypoint =====
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]

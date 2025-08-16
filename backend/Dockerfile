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
    netcat-openbsd \
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

# ===== Copy Files =====
WORKDIR /var/www/html
COPY . /var/www/html

# ===== Install Composer dependencies =====
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# ===== Set proper ownership and permissions =====
RUN chmod -Rf ug+rwx storage bootstrap/cache
RUN chown -Rf $APACHE_RUN_USER:www-data storage bootstrap/cache

# ===== Remove default Nginx configuration =====
RUN rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf

# ===== Copy Nginx Configuration =====
COPY docker/nginx/laravel.conf /etc/nginx/conf.d/laravel.conf

# ===== Copy Supervisor main configuration =====
RUN mkdir -p /var/log/supervisor
COPY docker/supervisor/services.conf /etc/supervisor/conf.d/services.conf

# ===== Copy entrypoint script =====
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# ===== add key and clear Laravel cache =====
RUN php artisan key:generate --force

# ===== optimize Laravel =====
RUN php artisan optimize

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]

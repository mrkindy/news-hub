# Deployment Guide

Production deployment guide for News Hub API with security and performance optimizations.

## Deployment Options

- **Shared Hosting** - Simple deployment
- **VPS/Dedicated Server** - Full control
- **Docker Containers** - Containerized deployment
- **Cloud Platforms** - AWS, Google Cloud, Azure

## Pre-Deployment Checklist

### Environment
- [ ] Production server meets requirements
- [ ] SSL certificate configured
- [ ] Database server ready
- [ ] Redis configured (recommended)
- [ ] Backup strategy implemented

### Code
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Environment variables configured
- [ ] Database migrations reviewed

## Production Configuration

### Environment Variables (.env)
```env
# Application
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_DATABASE=news_hub_prod
DB_USERNAME=production_user
DB_PASSWORD=secure-password
# Cache & Session
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=your-redis-host
REDIS_PASSWORD=redis-password

# API Keys
GUARDIAN_API_KEY=production-key
NYTIMES_API_KEY=production-key
NEWSORG_API_KEY=production-key

# Mail
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_FROM_ADDRESS=noreply@your-domain.com
```

## Docker Deployment

### 1. Build Production Image
```bash
docker build -t news-hub-api .
```

### 2. Run with Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Initialize Database
```bash
docker exec news-hub-api php artisan migrate --force
```

## VPS/Server Deployment

### 1. Server Setup
```bash
# Install dependencies
sudo apt update
sudo apt install nginx mysql-server redis-server php8.2-fpm

# Configure PHP-FPM
sudo systemctl enable php8.2-fpm nginx mysql redis
```

### 2. Application Setup
```bash
# Clone and install
git clone <repo> /var/www/news-hub
cd /var/www/news-hub
composer install --no-dev --optimize-autoloader

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 3. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/news-hub/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
    }
}
```

### 4. SSL Setup
```bash
sudo certbot --nginx -d your-domain.com
```

## Performance Optimization

### Caching
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Database
- Enable query caching
- Optimize indexes
- Regular backups

### Monitoring
- Set up application monitoring
- Configure log rotation
- Monitor database performance

## CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: |
          php artisan test
          # Deploy to production
```

For detailed cloud deployment guides, see respective platform documentation.

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/news-hub/public

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256

    # Security Headers
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

    # Performance
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>

    <Directory /var/www/news-hub/public>
        AllowOverride All
        Options -Indexes +FollowSymLinks
        Require all granted

        # Laravel Pretty URLs
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^(.*)$ index.php/$1 [L]
    </Directory>

    # Cache static files
    <FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        ExpiresActive on
        ExpiresDefault "access plus 1 year"
        Header append Cache-Control "public"
    </FilesMatch>

    ErrorLog ${APACHE_LOG_DIR}/news-hub_error.log
    CustomLog ${APACHE_LOG_DIR}/news-hub_access.log combined
</VirtualHost>
```

## 🐳 Docker Deployment

### Docker Configuration

**Dockerfile** (Production-optimized):

```dockerfile
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    redis \
    mysql-client \
    && docker-php-ext-install pdo pdo_mysql bcmath gd xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create application directory
WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html/

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copy configuration files
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf

# Expose port
EXPOSE 80

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

**docker-compose.yml** (Production):

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: news-hub-app
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./storage:/var/www/html/storage
      - ./bootstrap/cache:/var/www/html/bootstrap/cache
    environment:
      - APP_ENV=production
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis
    networks:
      - news-hub-network

  db:
    image: mysql:8.0
    container_name: news-hub-db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: news_hub
      MYSQL_USER: news_hub_user
      MYSQL_PASSWORD: secure_password
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - db_data:/var/lib/mysql
    ports:
      - "3306:3306"
    networks:
      - news-hub-network

  redis:
    image: redis:7-alpine
    container_name: news-hub-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass redis_password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    networks:
      - news-hub-network

  nginx:
    image: nginx:alpine
    container_name: news-hub-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/ssl:/etc/nginx/ssl
      - ./public:/var/www/html/public
    depends_on:
      - app
    networks:
      - news-hub-network

volumes:
  db_data:
  redis_data:

networks:
  news-hub-network:
    driver: bridge
```

### Docker Deployment Commands

```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec app php artisan migrate --force

# Optimize for production
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
docker-compose exec app php artisan view:cache

# Generate API documentation
docker-compose exec app php artisan l5-swagger:generate
```

## ☁️ Cloud Platform Deployments

### AWS Deployment with Elastic Beanstalk

**Configuration (.ebextensions/01-app.config)**:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    APP_ENV: production
    APP_DEBUG: false
    DB_CONNECTION: mysql
    CACHE_STORE: redis
    SESSION_DRIVER: redis
    QUEUE_CONNECTION: sqs
  
  aws:elasticbeanstalk:container:php:phpini:
    memory_limit: 256M
    max_execution_time: 60
    upload_max_filesize: 20M
    post_max_size: 20M

container_commands:
  01_migrate:
    command: "php artisan migrate --force"
    leader_only: true
  02_cache:
    command: "php artisan config:cache && php artisan route:cache && php artisan view:cache"
  03_swagger:
    command: "php artisan l5-swagger:generate"
```

### DigitalOcean App Platform

**Configuration (.do/app.yaml)**:

```yaml
name: news-hub-api
services:
- name: api
  source_dir: /
  github:
    repo: your-username/news-hub
    branch: main
  run_command: php artisan serve --host=0.0.0.0 --port=8080
  environment_slug: php
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: APP_ENV
    value: production
  - key: APP_DEBUG
    value: false
  - key: APP_KEY
    value: YOUR_APP_KEY
    type: SECRET
  - key: DB_CONNECTION
    value: mysql
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  routes:
  - path: /

databases:
- name: db
  engine: MYSQL
  version: "8"
  size_slug: db-s-1vcpu-1gb

jobs:
- name: migrate
  source_dir: /
  github:
    repo: your-username/news-hub
    branch: main
  run_command: php artisan migrate --force
  environment_slug: php
  instance_count: 1
  instance_size_slug: basic-xxs
  kind: PRE_DEPLOY
```

### Heroku Deployment

**Procfile**:

```
web: vendor/bin/heroku-php-apache2 public/
worker: php artisan queue:work --verbose --tries=3 --timeout=90
scheduler: php artisan schedule:work
```

**app.json**:

```json
{
  "name": "News Hub API",
  "description": "Laravel News Hub API",
  "keywords": ["laravel", "news", "api"],
  "addons": [
    "heroku-mysql",
    "heroku-redis",
    "papertrail"
  ],
  "env": {
    "APP_ENV": "production",
    "APP_DEBUG": "false",
    "LOG_CHANNEL": "errorlog"
  },
  "scripts": {
    "postdeploy": "php artisan migrate --force && php artisan config:cache && php artisan l5-swagger:generate"
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Deployment

**.github/workflows/deploy.yml**:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: 8.2
        extensions: mbstring, xml, ctype, iconv, intl, pdo_sqlite
    
    - name: Install dependencies
      run: composer install --prefer-dist --no-progress
    
    - name: Copy environment file
      run: cp .env.example .env
    
    - name: Generate application key
      run: php artisan key:generate
    
    - name: Run tests
      run: php artisan test

  deploy:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/news-hub
          git pull origin main
          composer install --no-dev --optimize-autoloader
          php artisan migrate --force
          php artisan config:cache
          php artisan route:cache
          php artisan view:cache
          php artisan l5-swagger:generate
          sudo systemctl reload php8.2-fpm
          sudo systemctl reload nginx
```

### GitLab CI/CD

**.gitlab-ci.yml**:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  MYSQL_DATABASE: news_hub_test
  MYSQL_USER: test_user
  MYSQL_PASSWORD: test_password
  MYSQL_ROOT_PASSWORD: root_password

test:
  stage: test
  image: php:8.2
  services:
    - mysql:8.0
  before_script:
    - apt-get update -yqq
    - apt-get install -yqq git libpng-dev libxml2-dev zip unzip
    - docker-php-ext-install pdo pdo_mysql bcmath gd xml
    - curl -sS https://getcomposer.org/installer | php
    - php composer.phar install --prefer-dist --no-progress
    - cp .env.example .env
    - php artisan key:generate
  script:
    - php artisan test

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "
        cd /var/www/news-hub &&
        git pull origin main &&
        docker-compose down &&
        docker-compose pull &&
        docker-compose up -d &&
        docker-compose exec -T app php artisan migrate --force &&
        docker-compose exec -T app php artisan config:cache"
  only:
    - main
```

## 📊 Production Optimization

### Laravel Optimizations

```bash
# Cache configurations
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize Composer autoloader
composer install --optimize-autoloader --no-dev

# Generate optimized bootstrap file
php artisan optimize

# Compile assets (if using)
npm run production
```

### Database Optimizations

```sql
-- Add database indexes for performance
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_category_source ON articles(category_id, source_id);
CREATE FULLTEXT INDEX idx_articles_search ON articles(title, description, content);

-- Optimize MySQL configuration (my.cnf)
[mysqld]
innodb_buffer_pool_size = 1G
query_cache_type = 1
query_cache_size = 64M
max_connections = 200
```

### PHP-FPM Optimizations

```ini
; /etc/php/8.2/fpm/pool.d/www.conf
[www]
pm = dynamic
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500

; Performance settings
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
opcache.save_comments=1
opcache.enable_file_override=1
```

## 🔐 Security Hardening

### Server Security

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Disable unused services
sudo systemctl disable apache2  # if using nginx
sudo systemctl stop apache2

# Secure SSH
echo "PermitRootLogin no" | sudo tee -a /etc/ssh/sshd_config
echo "PasswordAuthentication no" | sudo tee -a /etc/ssh/sshd_config
sudo systemctl restart ssh
```

### Application Security

```php
// config/app.php - Production settings
'debug' => false,
'url' => 'https://your-domain.com',

// config/session.php
'secure' => true,
'http_only' => true,
'same_site' => 'lax',

// config/cors.php
'allowed_origins' => ['https://your-frontend-domain.com'],
'allowed_headers' => ['Content-Type', 'Authorization'],
```

### SSL Certificate Setup

```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📈 Monitoring & Logging

### Application Monitoring

**Install Laravel Telescope (Development)**:

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

**Install Sentry (Production)**:

```bash
composer require sentry/sentry-laravel
php artisan sentry:publish --dsn=YOUR_DSN
```

### System Monitoring

**Setup Prometheus + Grafana**:

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  grafana_data:
```

### Log Management

**Configure structured logging**:

```php
// config/logging.php
'channels' => [
    'production' => [
        'driver' => 'stack',
        'channels' => ['syslog', 'daily'],
    ],
    
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'warning',
        'days' => 14,
    ],
],
```

## 🔄 Backup Strategy

### Database Backups

```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="news_hub"
BACKUP_DIR="/var/backups/mysql"

mkdir -p $BACKUP_DIR

mysqldump -u root -p$MYSQL_ROOT_PASSWORD \
  --single-transaction \
  --routines \
  --triggers \
  $DB_NAME > $BACKUP_DIR/news_hub_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/news_hub_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "news_hub_*.sql.gz" -mtime +30 -delete
```

### File Backups

```bash
#!/bin/bash
# backup-files.sh
rsync -avz --delete \
  /var/www/news-hub/storage/ \
  /var/backups/news-hub-storage/

# Upload to S3 (optional)
aws s3 sync /var/backups/ s3://your-backup-bucket/
```

### Automated Backup Cron

```bash
# Add to crontab
0 2 * * * /path/to/backup-db.sh
30 2 * * * /path/to/backup-files.sh
```

## 🚦 Health Checks & Monitoring

### Application Health Check

```php
// routes/web.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'services' => [
            'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
            'redis' => Redis::ping() ? 'connected' : 'disconnected',
        ]
    ]);
});
```

### Uptime Monitoring

```bash
# Simple uptime check script
#!/bin/bash
URL="https://your-domain.com/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE != "200" ]; then
    echo "Site down! Response code: $RESPONSE" | mail -s "Site Alert" admin@your-domain.com
fi
```

## 📋 Post-Deployment Checklist

### Immediate Post-Deployment

- [ ] Application loads successfully
- [ ] Database connection working
- [ ] Redis connection working
- [ ] API endpoints responding correctly
- [ ] Authentication working
- [ ] News fetching command working
- [ ] SSL certificate valid
- [ ] Error pages displaying correctly

### Performance Verification

- [ ] Page load times < 2 seconds
- [ ] API response times < 500ms
- [ ] Database query optimization
- [ ] Cache hit rates > 80%
- [ ] Memory usage within limits
- [ ] CPU usage stable

### Security Verification

- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] File permissions correct
- [ ] Sensitive data not exposed
- [ ] Rate limiting working
- [ ] CORS properly configured

### Monitoring Setup

- [ ] Error tracking configured
- [ ] Log aggregation working
- [ ] Uptime monitoring active
- [ ] Performance monitoring active
- [ ] Backup verification successful
- [ ] Alert notifications configured

## 🔧 Troubleshooting Production Issues

### Common Issues

**500 Internal Server Error**:
```bash
# Check Laravel logs
tail -f /var/www/news-hub/storage/logs/laravel.log

# Check web server logs
tail -f /var/log/nginx/error.log

# Check PHP-FPM logs
tail -f /var/log/php8.2-fpm.log
```

**Database Connection Issues**:
```bash
# Test database connection
php artisan tinker
# DB::connection()->getPdo();

# Check database status
systemctl status mysql
```

**Cache Issues**:
```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

**Permission Issues**:
```bash
# Fix Laravel permissions
sudo chown -R www-data:www-data /var/www/news-hub
sudo chmod -R 755 /var/www/news-hub/storage
sudo chmod -R 755 /var/www/news-hub/bootstrap/cache
```

### Performance Issues

```bash
# Check system resources
htop
df -h
free -m

# Check PHP processes
ps aux | grep php-fpm

# Check slow queries
mysql -e "SHOW PROCESSLIST;"
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Daily**:
- [ ] Monitor application logs for errors
- [ ] Check system resource usage
- [ ] Verify backup completion

**Weekly**:
- [ ] Review performance metrics
- [ ] Update security patches
- [ ] Clean up old log files

**Monthly**:
- [ ] Review and optimize database
- [ ] Update dependencies
- [ ] Test disaster recovery procedures

### Emergency Procedures

**Service Recovery**:
```bash
# Restart services
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm
sudo systemctl restart mysql
sudo systemctl restart redis

# Roll back to previous version
git checkout previous-stable-tag
composer install --no-dev --optimize-autoloader
php artisan migrate:rollback
```

---

This comprehensive deployment guide ensures your News Hub API is properly configured, secured, and monitored in production environments. Regular maintenance and monitoring will keep your application running smoothly and securely.

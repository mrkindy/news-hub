# Installation Guide

Setup instructions for the News Hub Laravel API.

## Prerequisites

- PHP 8.2+
- Composer
- MySQL 8+ or SQLite
- Redis (optional)

## Quick Setup

```bash
# Clone repository
git clone <repository-url>
cd backend

# Complete setup with Make
make setup
make serve
```

The `make setup` command handles dependencies, environment, database, and API docs.

## Manual Installation

### 1. Install Dependencies
```bash
composer install
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup

**SQLite (Default):**
```bash
touch database/database.sqlite
```

**MySQL:**
```bash
# Update .env with MySQL credentials
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=newshub
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Run Migrations
```bash
php artisan migrate --seed
```

### 5. Start Development Server
```bash
php artisan serve
```

## Production Setup

1. Set `APP_ENV=production` and `APP_DEBUG=false`
2. Configure production database
3. Set up Redis for caching
4. Configure web server (Nginx/Apache)
5. Set up SSL certificate
6. Configure monitoring and backups

For detailed production setup, see [Deployment Guide](DEPLOYMENT.md).

**For MySQL:**

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE news_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Update .env file
sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/' .env
echo "DB_HOST=127.0.0.1" >> .env
echo "DB_PORT=3306" >> .env
echo "DB_DATABASE=news_hub" >> .env
echo "DB_USERNAME=your_username" >> .env
echo "DB_PASSWORD=your_password" >> .env
```

**For PostgreSQL:**

```bash
# Create database
sudo -u postgres createdb news_hub

# Update .env file
sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=pgsql/' .env
echo "DB_HOST=127.0.0.1" >> .env
echo "DB_PORT=5432" >> .env
echo "DB_DATABASE=news_hub" >> .env
echo "DB_USERNAME=your_username" >> .env
echo "DB_PASSWORD=your_password" >> .env
```

#### Step 5: Database Migration and Seeding

```bash
# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed

# Or combine both commands
php artisan migrate --seed
```

#### Step 6: Generate API Documentation

```bash
php artisan l5-swagger:generate
```

#### Step 7: Start the Development Server

```bash
php artisan serve
```

### Method 3: Docker Installation

For containerized development:

#### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

#### Setup Steps

```bash
# Clone repository
git clone <repository-url> news-hub
cd news-hub/backend

# Copy environment file
cp .env.example .env

# Build and start containers
docker-compose up -d

# Install dependencies inside container
docker-compose exec app composer install

# Run migrations and seeding
docker-compose exec app php artisan migrate --seed

# Generate API documentation
docker-compose exec app php artisan l5-swagger:generate
```

#### Access the Application

- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/api/documentation

## ⚙️ Configuration

### Environment Variables

Edit your `.env` file to configure the application:

#### Essential Configuration

```env
# Application
APP_NAME="News Hub"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQLite example)
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite

# Cache
CACHE_STORE=database  # or 'redis' for production
```

#### News API Keys (Optional but Recommended)

To enable news aggregation, obtain and configure API keys:

```env
# Guardian API (https://open-platform.theguardian.com/access/)
GUARDIAN_API_KEY=your_guardian_api_key

# New York Times API (https://developer.nytimes.com/)
NYTIMES_API_KEY=your_nytimes_api_key

# NewsOrg API (https://newsapi.org/)
NEWSORG_API_KEY=your_newsorg_api_key
```

#### Laravel Sanctum

For frontend integration:

```env
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,localhost:3000,localhost:5173
```

### Redis Configuration (Production)

For enhanced performance in production:

```bash
# Install Redis
sudo apt-get install redis-server  # Ubuntu/Debian
brew install redis                 # macOS

# Start Redis service
sudo systemctl start redis-server  # Ubuntu/Debian
brew services start redis          # macOS

# Update .env
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

## 🧪 Verification

### Test the Installation

```bash
# Run the test suite
php artisan test

# Check API health
curl http://localhost:8000/api/v1/filter-options

# Verify database connection
php artisan tinker
# Inside tinker:
# DB::connection()->getPdo();
# exit
```

### Access Key Features

1. **API Documentation**: http://localhost:8000/api/documentation
2. **Health Check**: http://localhost:8000/api/v1/filter-options
3. **News Endpoints**: http://localhost:8000/api/v1/news

### Test News Aggregation

```bash
# Fetch news from external APIs (requires API keys)
php artisan news:fetch

# Dry run to test without saving
php artisan news:fetch --dry-run
```

## 🔧 Post-Installation Setup

### 1. Configure News Aggregation

```bash
# Test API connections
php artisan news:fetch --dry-run

# Set up automated news fetching (optional)
php artisan schedule:work
```

### 2. Performance Optimization

```bash
# Optimize Composer autoloader
composer install --optimize-autoloader --no-dev

# Cache configuration (production)
php artisan config:cache

# Cache routes (production)
php artisan route:cache

# Cache views (production)
php artisan view:cache
```

### 3. Set Up Background Jobs (Production)

```bash
# Start queue worker
php artisan queue:work

# Or use Supervisor for production
sudo apt-get install supervisor
```

### 4. Configure Web Server (Production)

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/news-hub/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/news-hub/backend/public

    <Directory /var/www/news-hub/backend/public>
        AllowOverride All
        Options -Indexes +FollowSymLinks
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/news-hub_error.log
    CustomLog ${APACHE_LOG_DIR}/news-hub_access.log combined
</VirtualHost>
```

## 🐛 Troubleshooting

### Common Issues

#### Permission Issues

```bash
# Fix storage and cache permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

#### Database Connection Issues

```bash
# Check database configuration
php artisan config:show database

# Test database connection
php artisan migrate:status
```

#### Composer Issues

```bash
# Clear Composer cache
composer clear-cache

# Update dependencies
composer update

# Reinstall dependencies
rm -rf vendor composer.lock
composer install
```

#### API Key Issues

```bash
# Test API connections without saving
php artisan news:fetch --dry-run

# Check configuration
php artisan config:show news
```

### Performance Issues

```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan optimize
```

### Log Files

Check these log files for troubleshooting:

- Application logs: `storage/logs/laravel.log`
- Web server logs: `/var/log/nginx/` or `/var/log/apache2/`
- PHP logs: `/var/log/php/` or check `php.ini` for log location

## 🚀 Next Steps

After successful installation:

1. **Read the [Architecture Guide](ARCHITECTURE.md)** to understand the system design
2. **Explore the [API Documentation](API.md)** for endpoint details
3. **Check the [Testing Guide](TESTING.md)** for development workflows
4. **Review the [Deployment Guide](DEPLOYMENT.md)** for production setup

## 📞 Support

If you encounter issues during installation:

1. Check the [Troubleshooting](#-troubleshooting) section above
2. Review the application logs in `storage/logs/laravel.log`
3. Open an issue on GitHub with:
   - Your system details (PHP version, OS, etc.)
   - Complete error messages
   - Steps to reproduce the issue

---

**Installation complete! 🎉 Your News Hub API is ready for development.**

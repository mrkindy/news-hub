# Laravel Backend Makefile
# This Makefile provides convenient commands for development workflow

.PHONY: help install serve test migrate seed fresh analyze format clean fetch-news

# Default target - show help
help:
	@echo "Available commands:"
	@echo "  make install    - Install PHP dependencies"
	@echo "  make serve      - Start the Laravel development server"
	@echo "  make test       - Run all tests"
	@echo "  make migrate    - Run database migrations"
	@echo "  make seed       - Seed the database with sample data"
	@echo "  make fresh      - Fresh migration with seeding"
	@echo "  make analyze    - Run static analysis (if available)"
	@echo "  make format     - Format code with PHP CS Fixer (if available)"
	@echo "  make clean      - Clean caches and temporary files"
	@echo "  make fetch-news - Fetch news from external APIs (requires API keys)"

# Install dependencies
install:
	@echo "Installing PHP dependencies..."
	composer install --no-dev --optimize-autoloader

# Install development dependencies
install-dev:
	@echo "Installing PHP dependencies with dev packages..."
	composer install

# Start development server
serve:
	@echo "Starting Laravel development server on http://localhost:8000"
	php artisan serve

# Run tests
test:
	@echo "Running tests..."
	php artisan test

# Run tests with coverage (if available)
test-coverage:
	@echo "Running tests with coverage..."
	php artisan test --coverage

# Run database migrations
migrate:
	@echo "Running database migrations..."
	php artisan migrate

# Seed database
seed:
	@echo "Seeding database..."
	php artisan db:seed

# Fresh migration with seeding
fresh:
	@echo "Fresh migration with seeding..."
	php artisan migrate:fresh --seed

# Run static analysis (if PHPStan is available)
analyze:
	@echo "Running static analysis..."
	@if command -v  vendor/bin/phpstan >/dev/null 2>&1; then \
		vendor/bin/phpstan analyse --memory-limit 512M app; \
	else \
		echo "PHPStan not installed. Run 'composer require --dev phpstan/phpstan' to install."; \
	fi

# Format Laravel Pint (if available)
pint:
	@echo "Formatting code..."
	@if command -v ./vendor/bin/pint >/dev/null 2>&1; then \
		./vendor/bin/pint; \
	else \
		echo "Laravel Pint not installed. Run 'composer require --dev laravel/pint' to install."; \
	fi

# Clean caches
clean:
	@echo "Cleaning caches..."
	php artisan cache:clear
	php artisan config:clear
	php artisan route:clear
	php artisan view:clear
	composer dump-autoload

# Setup development environment
setup: install-dev migrate seed
	@echo "Development environment setup complete!"
	@echo "Run 'make serve' to start the development server."

# Production build
build: install migrate
	@echo "Production build complete!"

# Check application health
check:
	@echo "Checking application health..."
	@curl -s http://localhost:8000/up || echo "Server not running. Use 'make serve' to start."

# Fetch news from external APIs
fetch-news:
	@echo "Fetching news from external APIs..."
	php artisan news:fetch

# Fetch news (dry run)
fetch-news-dry:
	@echo "Fetching news from external APIs (dry run)..."
	php artisan news:fetch --dry-run

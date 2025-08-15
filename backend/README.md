# News Hub Backend API

A Laravel 12 news aggregation API that collects articles from Guardian, NY Times, and NewsOrg APIs, providing personalized feeds and advanced search capabilities.

## Features

- Multi-source news aggregation
- JWT authentication with Laravel Sanctum  
- Personalized user feeds
- Advanced search and filtering
- Redis caching for performance
- Swagger API documentation

## Quick Start

```bash
git clone <repository-url>
cd backend
make setup
make serve
```

## Documentation

- [Installation Guide](docs/INSTALLATION.md) - Setup instructions
- [Architecture](docs/ARCHITECTURE.md) - System design and patterns
- [API Reference](docs/API.md) - Complete endpoint documentation
- [Testing](docs/TESTING.md) - Testing strategies
- [Deployment](docs/DEPLOYMENT.md) - Production deployment guide

## Tech Stack

- **Framework**: Laravel 12 with PHP 8.2+
- **Database**: MySQL 8 with Redis caching
- **Authentication**: JWT with Laravel Sanctum
- **Documentation**: Swagger/OpenAPI
- **Testing**: PHPUnit with Feature/Unit tests

## Environment Setup

Copy `.env.example` to `.env` and configure:
- Database credentials
- API keys for news sources
- Redis connection (optional)
- Mail configuration

## API Endpoints

- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/articles` - Get articles with filters
- `GET /api/v1/categories` - Get news categories
- `POST /api/v1/preferences` - Set user preferences

Visit `/api/documentation` for complete API docs.

Copy `.env.example` to `.env` and configure:

```env
# Database
DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

# News API Keys (optional)
GUARDIAN_API_KEY=your_guardian_key
NYTIMES_API_KEY=your_nytimes_key
NEWSORG_API_KEY=your_newsorg_key
```

### API Documentation

Once running, access the interactive API documentation at:
- **Swagger UI**: http://localhost:8000/api/documentation

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run with coverage
php artisan test --coverage
```

## 📦 Key Commands

```bash
# Fetch news from external APIs
php artisan news:fetch

# Clear application caches
php artisan news:clear-cache

# Generate API documentation
php artisan l5-swagger:generate
```

## 🛠️ Tech Stack

- **Framework**: Laravel 12
- **PHP**: 8.2+
- **Database**: SQLite/MySQL/PostgreSQL
- **Cache**: Redis (optional)
- **Authentication**: Laravel Sanctum
- **API Documentation**: Swagger/OpenAPI
- **Testing**: PHPUnit

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | User registration |
| POST | `/api/v1/auth/login` | User login |
| GET | `/api/v1/news` | Get news articles with filtering |
| GET | `/api/v1/personalized-feed` | Get personalized news feed |
| PUT | `/api/v1/user/preferences` | Update user preferences |

## 📞 Support

- **API Documentation**: http://localhost:8000/api/documentation
- **Issues**: Create an issue in this repository
- **Email**: admin@mrkindy.com

---

For detailed information, please refer to the [documentation](docs/) folder.

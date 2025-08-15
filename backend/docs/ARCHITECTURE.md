# Architecture Overview

Modern Laravel architecture for News Hub API with clean separation of concerns and scalability.

## System Design

```
Frontend (React) ←→ API Gateway ←→ Laravel API ←→ External APIs
                                      ↓
                               Database + Redis Cache
```

## Core Patterns

### Repository Pattern
Abstracts data access with consistent interfaces:
```
app/Contracts/NewsRepositoryInterface.php
app/Repositories/NewsRepository.php
```

### Action Pattern
Encapsulates business logic in single-purpose classes:
```
app/Actions/RegisterUserAction.php
app/Actions/FetchNewsAction.php
```

### DTO Pattern
Type-safe data transfer with Spatie Data:
```
app/DTOs/ArticleFilterData.php
app/DTOs/UserPreferencesData.php
```

### Service Layer
Handles complex business operations:
```
app/Services/NewsService.php
app/Services/NewsProviders/GuardianNewsService.php
```

## Project Structure

```
app/
├── Actions/          # Business logic actions
├── Http/
│   ├── Controllers/  # API controllers
│   ├── Middleware/   # Request middleware
│   └── Resources/    # API response formatting
├── Models/           # Eloquent models
├── Services/         # Business services
├── Repositories/     # Data access layer
├── DTOs/            # Data transfer objects
└── Contracts/       # Interfaces
```

## Key Components

- **Authentication**: Laravel Sanctum with JWT tokens
- **API Documentation**: Swagger/OpenAPI with L5-Swagger
- **Database**: MySQL with Eloquent ORM
- **Caching**: Redis for performance optimization
- **Testing**: PHPUnit with Feature/Unit tests
- **News Sources**: Guardian, NY Times, NewsOrg APIs

## Data Flow

1. **Request** → Middleware → Controller
2. **Controller** → Action/Service
3. **Service** → Repository → Model
4. **Response** → Resource → JSON API

For detailed implementation examples, see individual service files.

### 2. Strategy Pattern

News aggregation uses the Strategy Pattern to handle different news sources dynamically.

**Structure:**
```
app/
├── Contracts/
│   └── NewsSourceInterface.php
└── Services/
    └── NewsProviders/
        ├── GuardianNews.php
        ├── NTimesNews.php
        └── NewsOrg.php
```

**Benefits:**
- **Extensibility**: Easy to add new news sources
- **Maintainability**: Each source is isolated and independently testable
- **Flexibility**: Can enable/disable sources based on configuration
- **Polymorphism**: All sources implement the same interface

**Example Implementation:**
```php
interface NewsSourceInterface
{
    public function fetchNews(): array;
    public function getName(): string;
}

class GuardianNews implements NewsSourceInterface
{
    public function fetchNews(): array
    {
        // Fetch and normalize Guardian articles
        return $normalizedArticles;
    }
    
    public function getName(): string
    {
        return 'Guardian';
    }
}
```

### 3. Action Pattern

Complex operations are encapsulated in Action classes for reusability and testability.

**Structure:**
```
app/
└── Actions/
    ├── LoginUserAction.php
    └── RegisterUserAction.php
```

**Benefits:**
- **Single Responsibility**: Each action handles one specific operation
- **Reusability**: Actions can be used across different controllers
- **Testability**: Easy to unit test individual actions
- **Maintainability**: Complex logic is isolated and well-organized

### 4. Service Layer Pattern

Business logic is organized in service classes that orchestrate operations between repositories and external services.

**Structure:**
```
app/
└── Services/
    ├── NewsService.php
    ├── PreferencesService.php
    ├── TaxonomyService.php
    └── CacheService.php
```

## 🔧 Core Components

### Controllers

RESTful API controllers handle HTTP requests and responses:

```
app/Http/Controllers/Api/V1/
├── AuthController.php      # Authentication endpoints
├── NewsController.php      # News and articles management
├── TaxonomyController.php  # Categories, sources, authors
└── UserController.php     # User profile and preferences
```

**Responsibilities:**
- Request validation
- Route parameter binding
- Response formatting
- HTTP status code management

### Models & Relationships

Eloquent models represent the core domain entities:

```php
// Core entity relationships
User 1:1 UserPreference
Article N:1 Category
Article N:1 Source  
Article N:1 Author
```

**Key Models:**
- `User`: Authentication and user management
- `Article`: News articles with content and metadata
- `Category`: Article categorization (Technology, Sports, etc.)
- `Source`: News sources (BBC, CNN, etc.)
- `Author`: Article authors and contributors
- `UserPreference`: User's personalized settings

### Data Transfer Objects (DTOs)

Using Spatie Laravel Data for type-safe data handling:

```
app/DTOs/
├── ArticleFilterData.php    # Search and filter parameters
└── UserPreferencesData.php  # User preference settings
```

**Benefits:**
- **Type Safety**: Compile-time type checking
- **Validation**: Built-in validation rules
- **Documentation**: Self-documenting data structures
- **Consistency**: Standardized data transformation

### API Resources

Consistent JSON response formatting:

```
app/Http/Resources/
├── ArticleResource.php         # Single article response
├── PaginatedArticleResource.php # Paginated article list
├── UserProfileResource.php     # User profile data
└── AuthRegisterResource.php    # Registration response
```

### Caching Strategy

Multi-layer caching system for optimal performance:

**Cache Layers:**
1. **Application Cache**: Laravel cache for database queries
2. **HTTP Cache**: Response caching for static content
3. **Database Query Cache**: Eloquent query result caching
4. **Redis Cache**: Distributed caching for production

**Cache Keys and TTL:**
```php
// Cache configuration
'articles:single:{id}' => 30 minutes
'categories' => 24 hours
'sources' => 24 hours  
'authors' => 12 hours
'filter_options' => 6 hours
'personalized_feed:{user_id}:{hash}' => 15 minutes
```

## 📊 Database Design

### Entity-Relationship Diagram

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
│    users    │───►│ user_preferences │    │  articles   │
│             │ 1:1│                  │    │             │
├─────────────┤    ├──────────────────┤    ├─────────────┤
│ id          │    │ id               │    │ id          │
│ first_name  │    │ user_id          │    │ title       │
│ last_name   │    │ categories       │    │ description │
│ email       │    │ sources          │    │ content     │
│ password    │    │ authors          │    │ url         │
│ created_at  │    │ language         │    │ image_url   │
│ updated_at  │    │ theme            │    │ published_at│
└─────────────┘    │ created_at       │    │ external_id │
                   │ updated_at       │    │ category_id │◄─┐
                   └──────────────────┘    │ source_id   │◄─┼─┐
                                          │ author_id   │◄─┼─┼─┐
                                          │ created_at  │  │ │ │
                                          │ updated_at  │  │ │ │
                                          └─────────────┘  │ │ │
                                                          │ │ │
┌─────────────┐                                          │ │ │
│ categories  │◄─────────────────────────────────────────┘ │ │
├─────────────┤                                            │ │
│ id          │                                            │ │
│ name        │                                            │ │
│ slug        │                                            │ │
│ created_at  │                                            │ │
│ updated_at  │                                            │ │
└─────────────┘                                            │ │
                                                          │ │
┌─────────────┐                                          │ │
│   sources   │◄─────────────────────────────────────────┘ │
├─────────────┤                                            │
│ id          │                                            │
│ name        │                                            │
│ slug        │                                            │
│ url         │                                            │
│ description │                                            │
│ created_at  │                                            │
│ updated_at  │                                            │
└─────────────┘                                            │
                                                          │
┌─────────────┐                                          │
│   authors   │◄─────────────────────────────────────────┘
├─────────────┤
│ id          │
│ name        │
│ slug        │
│ bio         │
│ created_at  │
│ updated_at  │
└─────────────┘
```

### Database Indexes

Optimized indexes for query performance:

```sql
-- Articles table indexes
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_source_id ON articles(source_id);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_external_id ON articles(external_id);

-- Search indexes
CREATE FULLTEXT INDEX idx_articles_search ON articles(title, description, content);

-- Categories, sources, authors
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_sources_slug ON sources(slug);
CREATE INDEX idx_authors_slug ON authors(slug);
```

## 🔄 Request Lifecycle

### API Request Flow

```
1. HTTP Request
   │
   ▼
2. Route Resolution (api.php)
   │
   ▼
3. Middleware Stack
   ├─ Throttle (Rate Limiting)
   ├─ Sanctum (Authentication)
   └─ CORS (Cross-Origin)
   │
   ▼
4. Controller Action
   ├─ Request Validation
   ├─ Parameter Binding
   └─ Business Logic Delegation
   │
   ▼
5. Service Layer
   ├─ Cache Check
   ├─ Repository Operations
   └─ External API Calls
   │
   ▼
6. Repository Layer
   ├─ Database Queries
   ├─ Eloquent Relations
   └─ Query Optimization
   │
   ▼
7. Response Formatting
   ├─ API Resources
   ├─ Error Handling
   └─ Status Codes
   │
   ▼
8. HTTP Response
```

### News Aggregation Flow

```
1. Command Trigger (news:fetch)
   │
   ▼
2. NewsFetchService
   ├─ Load Configured Strategies
   ├─ Execute Each Strategy
   └─ Aggregate Results
   │
   ▼
3. Strategy Execution
   ├─ API Authentication
   ├─ Request External API
   ├─ Data Normalization
   └─ Error Handling
   │
   ▼
4. Data Processing
   ├─ Duplicate Detection
   ├─ Data Validation
   ├─ Entity Creation
   └─ Cache Invalidation
   │
   ▼
5. Database Storage
   ├─ Article Creation
   ├─ Taxonomy Updates
   └─ Transaction Management
```

## 🔐 Security Architecture

### Authentication & Authorization

- **Laravel Sanctum**: Token-based API authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Token Management**: Automatic token expiration and cleanup
- **Rate Limiting**: Throttling to prevent abuse

### Input Validation

- **Form Requests**: Dedicated validation classes
- **Sanitization**: XSS protection and data cleaning
- **Type Safety**: DTOs for compile-time type checking
- **SQL Injection**: Eloquent ORM parameterized queries

### API Security

- **CORS Configuration**: Controlled cross-origin access
- **HTTPS Enforcement**: SSL/TLS in production
- **Request Signing**: Optional API request signing
- **Input Filtering**: Whitelist-based parameter validation

## 📈 Performance Optimizations

### Database Optimizations

- **Eager Loading**: Prevent N+1 query problems
- **Index Strategy**: Optimized indexes for common queries
- **Query Caching**: Cache frequently accessed data
- **Connection Pooling**: Efficient database connections

### Caching Strategy

- **Multi-Level Caching**: Application, database, and HTTP caching
- **Cache Invalidation**: Smart cache invalidation strategies
- **Cache Warming**: Preload frequently accessed data
- **Distributed Caching**: Redis for production scalability

### API Optimizations

- **Pagination**: Efficient pagination for large datasets
- **Response Compression**: Gzip compression for responses
- **Field Selection**: Allow clients to specify required fields
- **Rate Limiting**: Protect against API abuse

## 🧪 Testing Architecture

### Test Structure

```
tests/
├── Feature/
│   ├── Api/V1/
│   │   ├── AuthTest.php
│   │   ├── NewsTest.php
│   │   ├── TaxonomyTest.php
│   │   └── UserTest.php
│   └── Commands/
│       └── FetchNewsIntegrationTest.php
├── Unit/
│   ├── Actions/
│   ├── Services/
│   └── Repositories/
└── TestCase.php
```

### Testing Strategies

- **Feature Tests**: Full HTTP request/response testing
- **Unit Tests**: Isolated component testing
- **Integration Tests**: Cross-component interaction testing
- **Database Testing**: Database state validation
- **Mock Testing**: External service mocking

## 🚀 Deployment Architecture

### Production Environment

```
┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   CDN/CloudFlare│
│   (ALB/Nginx)   │    │   (Static Assets)│
└─────────┬───────┘    └─────────────────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐
│   Web Servers   │    │   Cache Layer   │
│   (Multiple)    │◄──►│   (Redis)       │
└─────────┬───────┘    └─────────────────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   File Storage  │
│   (MySQL/RDS)   │    │   (S3/Local)    │
└─────────────────┘    └─────────────────┘
```

### Scaling Considerations

- **Horizontal Scaling**: Multiple application servers
- **Database Scaling**: Read replicas and connection pooling
- **Cache Distribution**: Redis clustering
- **Session Storage**: Database or Redis sessions
- **File Storage**: Cloud storage for assets
- **Background Jobs**: Queue workers for async processing

## 📝 Code Organization Principles

### SOLID Principles

- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types
- **Interface Segregation**: Clients shouldn't depend on unused interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### Laravel Best Practices

- **Service Container**: Dependency injection for loose coupling
- **Facades**: Consistent API access patterns
- **Eloquent ORM**: Object-relational mapping for database operations
- **Artisan Commands**: CLI tools for maintenance and automation
- **Event System**: Decoupled event-driven architecture

---

This architecture provides a solid foundation for a scalable, maintainable, and performant news aggregation API that can grow with your requirements while maintaining code quality and developer productivity.

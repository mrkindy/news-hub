# API Documentation

Complete reference for News Hub API endpoints with authentication and usage examples.

## Base Information

- **Base URL**: `http://localhost:8000/api/v1`
- **Authentication**: Bearer Token (Laravel Sanctum)
- **Format**: JSON
- **Rate Limit**: 100 requests/minute

## Authentication

Use Laravel Sanctum with Bearer tokens:
```http
Authorization: Bearer {access-token}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": { "field": ["Validation messages"] }
}
```

## Authentication Endpoints

### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe", 
  "email": "john@example.com",
  "password": "SecurePassword123",
  "password_confirmation": "SecurePassword123"
}
```

### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

## News Endpoints

### Get Articles
```http
GET /api/v1/articles?category=technology&source=guardian&page=1
Authorization: Bearer {token}
```

**Query Parameters:**
- `category` - Filter by category
- `source` - Filter by news source
- `author` - Filter by author
- `from_date` - Start date (YYYY-MM-DD)
- `to_date` - End date (YYYY-MM-DD)
- `search` - Search term
- `page` - Page number
- `per_page` - Items per page (max 50)

### Get Article by ID
```http
GET /api/v1/articles/{id}
Authorization: Bearer {token}
```

### Get Personalized Feed
```http
GET /api/v1/feed
Authorization: Bearer {token}
```

## User Preferences

### Get User Preferences
```http
GET /api/v1/preferences
Authorization: Bearer {token}
```

### Update Preferences
```http
PUT /api/v1/preferences
Authorization: Bearer {token}
Content-Type: application/json

{
  "preferred_sources": ["guardian", "nytimes"],
  "preferred_categories": ["technology", "business"],
  "preferred_authors": ["author1", "author2"]
}
```

## Taxonomy Endpoints

### Get Categories
```http
GET /api/v1/categories
```

### Get Sources
```http
GET /api/v1/sources
```

### Get Authors
```http
GET /api/v1/authors
```

## Error Codes

- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

Visit `/api/documentation` for interactive Swagger docs.
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-15T10:30:00.000000Z"
  },
  "token": "1|abc123def456..."
}
```

**Validation Rules**:
- `first_name`: required, string, max:255
- `last_name`: required, string, max:255
- `email`: required, email, unique:users
- `password`: required, string, min:8, confirmed

### Login User

Authenticate user and get access token.

**Endpoint**: `POST /api/v1/auth/login`

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  },
  "token": "1|abc123def456..."
}
```

**Error Response** (422 Unprocessable Entity):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Get User Profile

Get authenticated user's profile information.

**Endpoint**: `GET /api/v1/auth/me`  
**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-15T10:30:00.000000Z",
    "preferences": {
      "categories": ["Technology", "Science"],
      "sources": ["BBC News", "The Guardian"],
      "authors": ["John Smith"],
      "language": "en",
      "theme": "light"
    }
  }
}
```

### Logout User

Revoke the current access token.

**Endpoint**: `POST /api/v1/auth/logout`  
**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 📰 News Endpoints

### Get News Articles

Retrieve a paginated list of news articles with optional filtering and search.

**Endpoint**: `GET /api/v1/news`

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 15, max: 100)
- `q` (string): Search query (searches title, description, content)
- `categories` (array): Filter by category slugs
- `sources` (array): Filter by source slugs
- `authors` (array): Filter by author slugs
- `from` (date): Articles from date (YYYY-MM-DD)
- `to` (date): Articles to date (YYYY-MM-DD)
- `sort` (string): Sort field (title, published_at)
- `direction` (string): Sort direction (asc, desc)

**Example Request**:
```http
GET /api/v1/news?page=1&per_page=10&q=technology&categories[]=technology&sources[]=bbc-news&from=2024-01-01&sort=published_at&direction=desc
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Latest Technology Trends",
      "description": "An overview of emerging technology trends...",
      "url": "https://example.com/article/1",
      "image_url": "https://example.com/images/1.jpg",
      "published_at": "2024-01-15T08:00:00.000000Z",
      "category": {
        "id": 1,
        "name": "Technology",
        "slug": "technology"
      },
      "source": {
        "id": 1,
        "name": "BBC News",
        "slug": "bbc-news"
      },
      "author": {
        "id": 1,
        "name": "Jane Smith",
        "slug": "jane-smith"
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 10,
    "to": 10,
    "total": 50
  }
}
```

### Get Single Article

Retrieve a single article with related articles.

**Endpoint**: `GET /api/v1/news/{id}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Latest Technology Trends",
    "description": "An overview of emerging technology trends...",
    "content": "Full article content here...",
    "url": "https://example.com/article/1",
    "image_url": "https://example.com/images/1.jpg",
    "published_at": "2024-01-15T08:00:00.000000Z",
    "category": {
      "id": 1,
      "name": "Technology",
      "slug": "technology"
    },
    "source": {
      "id": 1,
      "name": "BBC News",
      "slug": "bbc-news",
      "url": "https://bbc.com"
    },
    "author": {
      "id": 1,
      "name": "Jane Smith",
      "slug": "jane-smith",
      "bio": "Technology journalist with 10 years experience"
    },
    "related_articles": [
      {
        "id": 2,
        "title": "Related Article",
        "description": "Brief description...",
        "published_at": "2024-01-14T12:00:00.000000Z"
      }
    ]
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Article not found"
}
```

### Get Personalized Feed

Retrieve personalized news feed based on user preferences.

**Endpoint**: `GET /api/v1/personalized-feed`  
**Authentication**: Required

**Query Parameters**:
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 15, max: 100)

**Response** (200 OK):
```json
{
  "success": true,
  "articles": [
    {
      "id": 1,
      "title": "Personalized Article",
      "description": "Article matching your preferences...",
      "relevance_score": 0.95,
      "category": {
        "name": "Technology"
      },
      "source": {
        "name": "BBC News"
      },
      "published_at": "2024-01-15T08:00:00.000000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 45
  }
}
```

## 🏷️ Taxonomy Endpoints

### Get Filter Options

Retrieve all available filter options (categories, sources, authors).

**Endpoint**: `GET /api/v1/filter-options`

**Query Parameters**:
- `q` (string): Search query to filter options

**Response** (200 OK):
```json
{
  "data": {
    "success": true,
    "data": {
      "categories": [
        {
          "id": 1,
          "name": "Technology",
          "slug": "technology",
          "count": 45
        }
      ],
      "sources": [
        {
          "id": 1,
          "name": "BBC News",
          "slug": "bbc-news",
          "count": 23
        }
      ],
      "authors": [
        {
          "id": 1,
          "name": "Jane Smith",
          "slug": "jane-smith",
          "count": 12
        }
      ]
    }
  }
}
```

### Get Categories

Retrieve all article categories.

**Endpoint**: `GET /api/v1/categories`

**Query Parameters**:
- `q` (string): Search categories by name

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Technology",
        "slug": "technology",
        "count": 45
      },
      {
        "id": 2,
        "name": "Science",
        "slug": "science",
        "count": 32
      }
    ]
  }
}
```

### Get Sources

Retrieve all news sources.

**Endpoint**: `GET /api/v1/sources`

**Query Parameters**:
- `q` (string): Search sources by name

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "sources": [
      {
        "id": 1,
        "name": "BBC News",
        "slug": "bbc-news",
        "url": "https://bbc.com",
        "description": "British public service broadcaster",
        "count": 23
      }
    ]
  }
}
```

### Get Authors

Retrieve all article authors.

**Endpoint**: `GET /api/v1/authors`

**Query Parameters**:
- `q` (string): Search authors by name

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "authors": [
      {
        "id": 1,
        "name": "Jane Smith",
        "slug": "jane-smith",
        "bio": "Technology journalist",
        "count": 12
      }
    ]
  }
}
```

## 👤 User Management Endpoints

### Get User Profile

Get authenticated user's profile.

**Endpoint**: `GET /api/v1/user`  
**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-15T10:30:00.000000Z"
  }
}
```

### Get User Preferences

Retrieve user's current preferences.

**Endpoint**: `GET /api/v1/user/preferences`  
**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "categories": ["Technology", "Science"],
    "sources": ["BBC News", "The Guardian"],
    "authors": ["Jane Smith"],
    "language": "en",
    "theme": "light"
  }
}
```

### Update User Preferences

Update user's preferences for personalized content.

**Endpoint**: `PUT /api/v1/user/preferences`  
**Authentication**: Required

**Request Body**:
```json
{
  "categories": ["Technology", "Science", "Health"],
  "sources": ["BBC News", "CNN", "Reuters"],
  "authors": ["John Doe", "Jane Smith"],
  "language": "en",
  "theme": "dark"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "categories": ["Technology", "Science", "Health"],
    "sources": ["BBC News", "CNN", "Reuters"],
    "authors": ["John Doe", "Jane Smith"],
    "language": "en",
    "theme": "dark",
    "updated_at": "2024-01-15T14:30:00.000000Z"
  }
}
```

**Validation Rules**:
- `categories`: array of existing category names
- `sources`: array of existing source names
- `authors`: array of existing author names
- `language`: enum (en, es, fr, de)
- `theme`: enum (light, dark)

## ❌ Error Handling

### HTTP Status Codes

- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Common Error Responses

#### Validation Error (422)
```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

#### Authentication Error (401)
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

#### Not Found Error (404)
```json
{
  "success": false,
  "message": "Article not found"
}
```

#### Rate Limit Error (429)
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

## 📊 Usage Examples

### JavaScript/Fetch Example

```javascript
// Register a new user
const registerUser = async () => {
  const response = await fetch('http://localhost:8000/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      password_confirmation: 'password123'
    })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

// Get news articles
const getNews = async (filters = {}) => {
  const token = localStorage.getItem('token');
  const queryParams = new URLSearchParams(filters);
  
  const response = await fetch(`http://localhost:8000/api/v1/news?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  
  return await response.json();
};
```

### cURL Examples

```bash
# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Get news with filters
curl -X GET "http://localhost:8000/api/v1/news?q=technology&categories[]=technology&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update user preferences
curl -X PUT http://localhost:8000/api/v1/user/preferences \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categories": ["Technology", "Science"],
    "sources": ["BBC News"],
    "language": "en",
    "theme": "dark"
  }'
```

### Python/Requests Example

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

class NewsHubAPI:
    def __init__(self):
        self.session = requests.Session()
        self.token = None
    
    def register(self, first_name, last_name, email, password):
        response = self.session.post(f"{BASE_URL}/auth/register", json={
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "password": password,
            "password_confirmation": password
        })
        
        if response.status_code == 201:
            data = response.json()
            self.token = data["token"]
            self.session.headers.update({"Authorization": f"Bearer {self.token}"})
        
        return response.json()
    
    def get_news(self, **filters):
        response = self.session.get(f"{BASE_URL}/news", params=filters)
        return response.json()
    
    def update_preferences(self, preferences):
        response = self.session.put(f"{BASE_URL}/user/preferences", json=preferences)
        return response.json()

# Usage
api = NewsHubAPI()
api.register("John", "Doe", "john@example.com", "password123")

news = api.get_news(q="technology", page=1, per_page=10)
print(f"Found {news['pagination']['total']} articles")
```

## 🔗 Interactive Documentation

For a fully interactive API documentation with the ability to test endpoints directly:

**Swagger UI**: http://localhost:8000/api/documentation

The Swagger documentation includes:
- Interactive endpoint testing
- Request/response examples
- Schema definitions
- Authentication setup
- Real-time API exploration

---

This completes the comprehensive API documentation. For additional details or specific use cases, refer to the interactive Swagger documentation or contact the development team.

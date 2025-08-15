# Testing Guide

Comprehensive testing strategy for News Hub API with PHPUnit and Laravel testing utilities.

## Testing Philosophy

- **Test-Driven Development**: Write tests before implementation
- **High Coverage**: Aim for comprehensive test coverage
- **Fast Feedback**: Quick test execution cycles
- **Reliable Tests**: Consistent and deterministic results

## Test Structure

```
tests/
├── Feature/                 # Integration tests
│   └── Api/V1/
│       ├── AuthTest.php
│       ├── NewsTest.php
│       └── UserTest.php
├── Unit/                    # Unit tests
│   ├── Actions/
│   ├── Services/
│   ├── Repositories/
│   └── DTOs/
└── TestCase.php            # Base test case
```

## Running Tests

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/Api/V1/AuthTest.php

# Run with coverage
php artisan test --coverage

# Run tests in parallel
php artisan test --parallel

# Using Make commands
make test
make test-coverage
```

## Test Categories

### Feature Tests
Test complete user workflows and API endpoints:
```php
public function test_user_can_get_articles_with_filters()
{
    $user = User::factory()->create();
    
    $response = $this->actingAs($user)
        ->getJson('/api/v1/articles?category=technology');
        
    $response->assertOk()
        ->assertJsonStructure(['success', 'data', 'pagination']);
}
```

### Unit Tests
Test individual components in isolation:
```php
public function test_news_service_can_fetch_guardian_articles()
{
    $service = new GuardianNewsService();
    $articles = $service->fetchArticles(['category' => 'technology']);
    
    $this->assertNotEmpty($articles);
    $this->assertInstanceOf(Article::class, $articles->first());
}
```

## Testing Tools

- **PHPUnit**: Core testing framework
- **Laravel Testing**: Built-in testing utilities
- **Mockery**: Mocking framework
- **RefreshDatabase**: Clean database state
- **GitHub Actions**: CI/CD automation

## Best Practices

- Use factories for test data
- Mock external API calls
- Test both success and failure scenarios
- Keep tests independent and isolated
- Use descriptive test method names

## Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Feature Tests**: Cover all API endpoints
- **Integration Tests**: Test external service integrations

For detailed examples, see individual test files in the `tests/` directory.

# Run specific test suites
make test-unit
make test-feature
```

### PHPUnit Configuration

The `phpunit.xml` file configures the testing environment:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>app</directory>
        </include>
    </source>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
        <env name="CACHE_STORE" value="array"/>
        <env name="SESSION_DRIVER" value="array"/>
        <env name="QUEUE_CONNECTION" value="sync"/>
    </php>
</phpunit>
```

## 🔬 Unit Tests

Unit tests focus on testing individual components in isolation.

### Example: Service Unit Test

```php
<?php

namespace Tests\Unit\Services;

use App\Services\NewsService;
use App\Contracts\NewsRepositoryInterface;
use App\DTOs\ArticleFilterData;
use Tests\TestCase;
use Mockery;

class NewsServiceTest extends TestCase
{
    protected NewsService $newsService;
    protected $newsRepository;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->newsRepository = Mockery::mock(NewsRepositoryInterface::class);
        $this->newsService = new NewsService($this->newsRepository);
    }

    public function test_can_get_articles_with_filters(): void
    {
        // Arrange
        $filters = ArticleFilterData::from([
            'query' => 'technology',
            'perPage' => 15
        ]);
        
        $this->newsRepository
            ->shouldReceive('getArticles')
            ->once()
            ->with($filters)
            ->andReturn(collect(['article1', 'article2']));

        // Act
        $result = $this->newsService->getArticles($filters);

        // Assert
        $this->assertCount(2, $result);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
```

### Example: Action Unit Test

```php
<?php

namespace Tests\Unit\Actions;

use App\Actions\RegisterUserAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterUserActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_register_user(): void
    {
        // Arrange
        $action = new RegisterUserAction();
        $userData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'password' => 'password123'
        ];

        // Act
        $result = $action->execute($userData);

        // Assert
        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertInstanceOf(User::class, $result['user']);
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }

    public function test_hashes_password(): void
    {
        // Arrange
        $action = new RegisterUserAction();
        $userData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'password' => 'password123'
        ];

        // Act
        $result = $action->execute($userData);

        // Assert
        $this->assertNotEquals('password123', $result['user']->password);
        $this->assertTrue(password_verify('password123', $result['user']->password));
    }
}
```

## 🔧 Feature Tests

Feature tests verify complete user workflows and API endpoints.

### Example: Authentication Feature Test

```php
<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        // Arrange
        $userData = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        // Act
        $response = $this->postJson('/api/v1/auth/register', $userData);

        // Assert
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'user' => [
                'id',
                'email',
                'first_name',
                'last_name',
                'createdAt',
            ],
            'token',
        ]);
        $response->assertJsonPath('success', true);
        
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);
    }

    public function test_user_can_login(): void
    {
        // Arrange
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Act
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);

        // Assert
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'user' => ['id', 'email', 'first_name', 'last_name'],
            'token',
        ]);
        $response->assertJsonPath('success', true);
    }

    public function test_user_can_logout(): void
    {
        // Arrange
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/auth/logout');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('message', 'Logged out successfully');
    }

    public function test_login_fails_with_invalid_credentials(): void
    {
        // Act
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword',
        ]);

        // Assert
        $response->assertStatus(422);
        $response->assertJsonPath('success', false);
    }
}
```

### Example: News Feature Test

```php
<?php

namespace Tests\Feature\Api\V1;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test data
        $category = Category::factory()->create(['slug' => 'technology', 'name' => 'Technology']);
        $source = Source::factory()->create(['slug' => 'techcrunch', 'name' => 'TechCrunch']);
        $author = Author::factory()->create(['slug' => 'john-doe', 'name' => 'John Doe']);

        Article::factory()->create([
            'title' => 'Test Article',
            'category_id' => $category->id,
            'source_id' => $source->id,
            'author_id' => $author->id,
            'published_at' => now(),
        ]);
    }

    public function test_can_get_news_list(): void
    {
        // Act
        $response = $this->getJson('/api/v1/news');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'description',
                    'url',
                    'published_at',
                    'category' => ['id', 'name', 'slug'],
                    'source' => ['id', 'name', 'slug'],
                    'author' => ['id', 'name', 'slug'],
                ]
            ],
            'pagination'
        ]);
        $response->assertJsonPath('success', true);
    }

    public function test_can_filter_news_by_category(): void
    {
        // Act
        $response = $this->getJson('/api/v1/news?categories[]=technology');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
    }

    public function test_can_search_news(): void
    {
        // Act
        $response = $this->getJson('/api/v1/news?q=Test');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
    }

    public function test_can_get_single_article(): void
    {
        // Arrange
        $article = Article::first();

        // Act
        $response = $this->getJson("/api/v1/news/{$article->id}");

        // Assert
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'id',
                'title',
                'description',
                'content',
                'url',
                'published_at',
                'category',
                'source',
                'author',
                'related_articles'
            ]
        ]);
    }

    public function test_authenticated_user_can_get_personalized_feed(): void
    {
        // Arrange
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/v1/personalized-feed');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'articles',
            'pagination',
        ]);
    }
}
```

## 🔗 Integration Tests

Integration tests verify the interaction between multiple components.

### Example: News Fetch Integration Test

```php
<?php

namespace Tests\Feature\Commands;

use App\Models\Article;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class FetchNewsIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Configure API keys for testing
        Config::set('news.guardian.api_key', 'test-guardian-key');
        Config::set('news.nytimes.api_key', 'test-nytimes-key');
        Config::set('news.newsorg.api_key', 'test-newsorg-key');
    }

    public function test_fetch_news_command_creates_articles(): void
    {
        // Arrange
        Http::fake([
            'content.guardianapis.com/*' => Http::response([
                'response' => [
                    'results' => [
                        [
                            'id' => 'guardian-123',
                            'webTitle' => 'Test Guardian Article',
                            'webUrl' => 'https://guardian.com/test',
                            'webPublicationDate' => '2024-01-15T10:00:00Z',
                            'fields' => [
                                'bodyText' => 'Guardian article content',
                                'thumbnail' => 'https://guardian.com/image.jpg'
                            ],
                            'sectionName' => 'Technology'
                        ]
                    ]
                ]
            ], 200),
            'api.nytimes.com/*' => Http::response(['response' => ['docs' => []]], 200),
            'newsapi.org/*' => Http::response(['articles' => []], 200),
        ]);

        // Act
        $this->artisan('news:fetch')
            ->expectsOutput('✅ News fetch completed successfully!')
            ->assertExitCode(0);

        // Assert
        $this->assertDatabaseHas('articles', [
            'title' => 'Test Guardian Article'
        ]);
        $this->assertDatabaseHas('categories', [
            'name' => 'Technology'
        ]);
        $this->assertDatabaseHas('sources', [
            'name' => 'The Guardian'
        ]);
    }

    public function test_fetch_news_handles_api_failures_gracefully(): void
    {
        // Arrange
        Http::fake([
            'content.guardianapis.com/*' => Http::response([], 500),
            'api.nytimes.com/*' => Http::response(['response' => ['docs' => []]], 200),
            'newsapi.org/*' => Http::response(['articles' => []], 200),
        ]);

        // Act
        $this->artisan('news:fetch')
            ->assertExitCode(0);

        // Assert - Command should complete even with API failures
        $this->assertTrue(true);
    }

    public function test_duplicate_articles_are_not_created(): void
    {
        // Arrange
        Article::factory()->create([
            'external_id' => 'guardian-123',
            'title' => 'Existing Article'
        ]);

        Http::fake([
            'content.guardianapis.com/*' => Http::response([
                'response' => [
                    'results' => [
                        [
                            'id' => 'guardian-123',
                            'webTitle' => 'Duplicate Article',
                            'webUrl' => 'https://guardian.com/test',
                            'webPublicationDate' => '2024-01-15T10:00:00Z',
                            'fields' => [
                                'bodyText' => 'Content',
                                'thumbnail' => 'https://guardian.com/image.jpg'
                            ],
                            'sectionName' => 'Technology'
                        ]
                    ]
                ]
            ], 200),
            'api.nytimes.com/*' => Http::response(['response' => ['docs' => []]], 200),
            'newsapi.org/*' => Http::response(['articles' => []], 200),
        ]);

        // Act
        $this->artisan('news:fetch');

        // Assert
        $this->assertDatabaseCount('articles', 1);
        $this->assertDatabaseHas('articles', ['title' => 'Existing Article']);
        $this->assertDatabaseMissing('articles', ['title' => 'Duplicate Article']);
    }
}
```

## 🏃‍♂️ Test Performance

### Parallel Testing

For faster test execution:

```bash
# Run tests in parallel (requires sufficient CPU cores)
php artisan test --parallel

# Specify number of processes
php artisan test --parallel --processes=4
```

### Database Optimization

```php
// Use in-memory SQLite for faster tests
// phpunit.xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

### Selective Testing

```bash
# Run only unit tests
php artisan test tests/Unit/

# Run specific test groups
php artisan test --group=authentication
php artisan test --group=api

# Exclude slow tests
php artisan test --exclude-group=slow
```

## 📊 Test Coverage

### Generating Coverage Reports

```bash
# Generate HTML coverage report
php artisan test --coverage-html coverage/

# Generate text coverage summary
php artisan test --coverage-text

# Generate XML coverage (for CI/CD)
php artisan test --coverage-xml coverage/

# Set minimum coverage threshold
php artisan test --min=80
```

### Coverage Configuration

Add to `phpunit.xml`:

```xml
<coverage>
    <include>
        <directory suffix=".php">app</directory>
    </include>
    <exclude>
        <directory>app/Http/Middleware</directory>
        <file>app/Http/Kernel.php</file>
    </exclude>
    <report>
        <html outputDirectory="coverage/html"/>
        <text outputFile="coverage/coverage.txt"/>
    </report>
</coverage>
```

## 🔧 Test Utilities

### Custom Test Traits

```php
<?php

namespace Tests\Traits;

use App\Models\User;

trait CreatesAuthenticatedUser
{
    protected function createAuthenticatedUser(array $attributes = []): array
    {
        $user = User::factory()->create($attributes);
        $token = $user->createToken('test-token')->plainTextToken;
        
        return [
            'user' => $user,
            'token' => $token,
            'headers' => ['Authorization' => "Bearer {$token}"]
        ];
    }
}
```

### Test Factories

```php
<?php

namespace Database\Factories;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'content' => $this->faker->paragraphs(3, true),
            'url' => $this->faker->url(),
            'image_url' => $this->faker->imageUrl(),
            'published_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'external_id' => $this->faker->unique()->uuid(),
            'category_id' => Category::factory(),
            'source_id' => Source::factory(),
            'author_id' => Author::factory(),
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => now()->subDays(rand(1, 30)),
        ]);
    }

    public function withCategory(string $categoryName): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => Category::factory()->create(['name' => $categoryName]),
        ]);
    }
}
```

## 🚨 Testing Best Practices

### 1. Test Organization

```php
// Use descriptive test method names
public function test_user_can_update_preferences_with_valid_data(): void
public function test_user_cannot_update_preferences_without_authentication(): void
public function test_update_preferences_validates_category_names(): void

// Group related tests in the same class
class UserPreferencesTest extends TestCase
{
    // All preference-related tests here
}
```

### 2. Test Data Management

```php
// Use factories for test data
$user = User::factory()->create();
$articles = Article::factory()->count(5)->create();

// Use specific test data when testing specific scenarios
$user = User::factory()->create(['email' => 'test@example.com']);

// Clean up after tests
use RefreshDatabase; // Automatically rolls back database changes
```

### 3. Assertion Best Practices

```php
// Be specific with assertions
$response->assertStatus(200);
$response->assertJsonPath('success', true);
$response->assertJsonStructure(['data' => ['id', 'name']]);

// Test both positive and negative scenarios
public function test_can_create_article(): void { /* ... */ }
public function test_cannot_create_article_without_title(): void { /* ... */ }
```

### 4. Mock External Dependencies

```php
// Mock external APIs
Http::fake([
    'api.example.com/*' => Http::response(['data' => 'mocked'], 200)
]);

// Mock services
$mockService = Mockery::mock(NewsServiceInterface::class);
$this->app->instance(NewsServiceInterface::class, $mockService);
```

## 🔄 Continuous Integration

### GitHub Actions Configuration

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  tests:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        php-version: [8.2, 8.3]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: ${{ matrix.php-version }}
        extensions: mbstring, xml, ctype, iconv, intl, pdo_sqlite
        coverage: xdebug
    
    - name: Install dependencies
      run: composer install --prefer-dist --no-progress
    
    - name: Copy environment file
      run: cp .env.example .env
    
    - name: Generate application key
      run: php artisan key:generate
    
    - name: Run tests
      run: php artisan test --coverage-text --min=80
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

```bash
# Install pre-commit hooks
composer require --dev brianium/paratest

# Add to .git/hooks/pre-commit
#!/bin/sh
php artisan test
if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi
```

## 🐛 Debugging Tests

### Debug Failed Tests

```bash
# Run specific failed test with verbose output
php artisan test --filter=test_user_can_register --verbose

# Debug with dd() or dump()
public function test_example(): void
{
    $response = $this->getJson('/api/v1/news');
    dd($response->json()); // Debug response content
    
    // Continue with assertions...
}
```

### Test Database Inspection

```php
// Check database state in tests
$this->assertDatabaseHas('users', ['email' => 'test@example.com']);
$this->assertDatabaseCount('articles', 5);

// Inspect database contents
dump(User::all()->toArray());
```

## 📋 Testing Checklist

Before deploying, ensure:

- [ ] All tests pass locally
- [ ] Test coverage is above 80%
- [ ] No skipped or incomplete tests
- [ ] Feature tests cover all API endpoints
- [ ] Unit tests cover all business logic
- [ ] Integration tests verify external API interactions
- [ ] Error scenarios are tested
- [ ] Authentication/authorization is tested
- [ ] Database constraints are tested
- [ ] Performance tests for critical paths

---

This comprehensive testing strategy ensures the News Hub API is reliable, maintainable, and ready for production deployment. Regular testing and adherence to these practices will maintain code quality throughout the development lifecycle.

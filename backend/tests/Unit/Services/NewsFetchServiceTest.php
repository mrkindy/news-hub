<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Contracts\NewsSourceInterface;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use App\Services\CacheService;
use App\Services\NewsFetchService;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class NewsFetchServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_fetch_from_all_sources_returns_aggregated_results(): void
    {
        // Arrange
        $guardianArticles = [
            [
                'external_id' => 'guardian_1',
                'title' => 'Guardian Article 1',
                'description' => 'Description 1',
                'content' => 'Content 1',
                'url' => 'https://guardian.com/article1',
                'image_url' => null,
                'published_at' => now()->toDateTimeString(),
                'source_name' => 'The Guardian',
                'category_name' => 'Politics',
                'author_name' => 'John Smith',
            ],
        ];

        $nytimesArticles = [
            [
                'external_id' => 'nytimes_1',
                'title' => 'NY Times Article 1',
                'description' => 'Description 2',
                'content' => 'Content 2',
                'url' => 'https://nytimes.com/article1',
                'image_url' => null,
                'published_at' => now()->toDateTimeString(),
                'source_name' => 'New York Times',
                'category_name' => 'Technology',
                'author_name' => 'Jane Doe',
            ],
        ];

        $guardianStrategy = $this->mock(NewsSourceInterface::class);
        $guardianStrategy->shouldReceive('getName')->andReturn('Guardian');
        $guardianStrategy->shouldReceive('fetchNews')->andReturn($guardianArticles);

        $nytimesStrategy = $this->mock(NewsSourceInterface::class);
        $nytimesStrategy->shouldReceive('getName')->andReturn('New York Times');
        $nytimesStrategy->shouldReceive('fetchNews')->andReturn($nytimesArticles);

        $strategies = collect([$guardianStrategy, $nytimesStrategy]);
        $cacheService = app(CacheService::class);

        $service = new NewsFetchService($strategies, $cacheService);

        // Act
        $results = $service->fetchFromAllSources();

        // Assert
        $this->assertEquals(2, $results['total_articles']);
        $this->assertCount(2, $results['sources']);

        $this->assertEquals('Guardian', $results['sources'][0]['source']);
        $this->assertEquals(1, $results['sources'][0]['fetched']);
        $this->assertEquals(1, $results['sources'][0]['saved']);

        $this->assertEquals('New York Times', $results['sources'][1]['source']);
        $this->assertEquals(1, $results['sources'][1]['fetched']);
        $this->assertEquals(1, $results['sources'][1]['saved']);

        // Verify articles were saved to database
        $this->assertDatabaseCount('articles', 2);
        $this->assertDatabaseCount('sources', 2);
        $this->assertDatabaseCount('categories', 2);
        $this->assertDatabaseCount('authors', 2);
    }

    public function test_handles_strategy_exceptions_gracefully(): void
    {
        // Arrange
        $guardianStrategy = $this->mock(NewsSourceInterface::class);
        $guardianStrategy->shouldReceive('getName')->andReturn('Guardian');
        $guardianStrategy->shouldReceive('fetchNews')->andThrow(new Exception('API Error'));

        $nytimesStrategy = $this->mock(NewsSourceInterface::class);
        $nytimesStrategy->shouldReceive('getName')->andReturn('New York Times');
        $nytimesStrategy->shouldReceive('fetchNews')->andReturn([]);

        $strategies = collect([$guardianStrategy, $nytimesStrategy]);
        $cacheService = app(CacheService::class);
        $service = new NewsFetchService($strategies, $cacheService);

        // Act
        $results = $service->fetchFromAllSources();

        // Assert
        $this->assertEquals(0, $results['total_articles']);
        $this->assertCount(2, $results['sources']);

        $this->assertEquals('Guardian', $results['sources'][0]['source']);
        $this->assertEquals(0, $results['sources'][0]['fetched']);
        $this->assertEquals(0, $results['sources'][0]['saved']);
        $this->assertArrayHasKey('error', $results['sources'][0]);

        $this->assertEquals('New York Times', $results['sources'][1]['source']);
        $this->assertEquals(0, $results['sources'][1]['fetched']);
        $this->assertEquals(0, $results['sources'][1]['saved']);
        $this->assertArrayNotHasKey('error', $results['sources'][1]);
    }

    public function test_skips_duplicate_articles(): void
    {
        // Arrange
        Article::factory()->create([
            'external_id' => 'guardian_duplicate',
            'title' => 'Existing Article',
        ]);

        $guardianArticles = [
            [
                'external_id' => 'guardian_duplicate',
                'title' => 'Guardian Article (Duplicate)',
                'description' => 'Description',
                'content' => 'Content',
                'url' => 'https://guardian.com/duplicate',
                'image_url' => null,
                'published_at' => now()->toDateTimeString(),
                'source_name' => 'The Guardian',
                'category_name' => 'Politics',
                'author_name' => 'John Smith',
            ],
            [
                'external_id' => 'guardian_new',
                'title' => 'New Guardian Article',
                'description' => 'Description',
                'content' => 'Content',
                'url' => 'https://guardian.com/new',
                'image_url' => null,
                'published_at' => now()->toDateTimeString(),
                'source_name' => 'The Guardian',
                'category_name' => 'Politics',
                'author_name' => 'John Smith',
            ],
        ];

        $guardianStrategy = $this->mock(NewsSourceInterface::class);
        $guardianStrategy->shouldReceive('getName')->andReturn('Guardian');
        $guardianStrategy->shouldReceive('fetchNews')->andReturn($guardianArticles);

        $strategies = collect([$guardianStrategy]);
        $cacheService = app(CacheService::class);
        $service = new NewsFetchService($strategies, $cacheService);

        // Act
        $results = $service->fetchFromAllSources();

        // Assert
        $this->assertEquals(2, $results['total_articles']);
        $this->assertEquals('Guardian', $results['sources'][0]['source']);
        $this->assertEquals(2, $results['sources'][0]['fetched']);
        $this->assertEquals(1, $results['sources'][0]['saved']); // Only 1 saved, 1 skipped

        // Verify we still have only 2 articles total (1 existing + 1 new)
        $this->assertDatabaseCount('articles', 2);
    }

    public function test_creates_related_entities(): void
    {
        // Arrange
        $articles = [
            [
                'external_id' => 'test_1',
                'title' => 'Test Article',
                'description' => 'Description',
                'content' => 'Content',
                'url' => 'https://example.com/article',
                'image_url' => null,
                'published_at' => now()->toDateTimeString(),
                'source_name' => 'Test Source',
                'category_name' => 'Test Category',
                'author_name' => 'Test Author',
            ],
        ];

        $strategy = $this->mock(NewsSourceInterface::class);
        $strategy->shouldReceive('getName')->andReturn('Test Strategy');
        $strategy->shouldReceive('fetchNews')->andReturn($articles);

        $strategies = collect([$strategy]);
        $cacheService = app(CacheService::class);
        $service = new NewsFetchService($strategies, $cacheService);

        // Act
        $service->fetchFromAllSources();

        // Assert
        $this->assertDatabaseHas('sources', ['name' => 'Test Source', 'slug' => 'test-source']);
        $this->assertDatabaseHas('categories', ['name' => 'Test Category', 'slug' => 'test-category']);
        $this->assertDatabaseHas('authors', ['name' => 'Test Author', 'slug' => 'test-author']);

        $source = Source::where('slug', 'test-source')->first();
        $category = Category::where('slug', 'test-category')->first();
        $author = Author::where('slug', 'test-author')->first();

        $this->assertDatabaseHas('articles', [
            'external_id' => 'test_1',
            'title' => 'Test Article',
            'source_id' => $source->id,
            'category_id' => $category->id,
            'author_id' => $author->id,
        ]);
    }

    public function test_handles_empty_strategies_collection(): void
    {
        // Arrange
        $strategies = collect();
        $cacheService = app(CacheService::class);
        $service = new NewsFetchService($strategies, $cacheService);

        // Act
        $results = $service->fetchFromAllSources();

        // Assert
        $this->assertEquals(0, $results['total_articles']);
        $this->assertCount(0, $results['sources']);
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class TaxonomyTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_filter_options(): void
    {
        // Create test data
        Category::factory()->count(3)->create();
        Source::factory()->count(2)->create();
        Author::factory()->count(2)->create();

        $response = $this->getJson('/api/v1/filter-options');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'success',
                'data' => [
                    'categories',
                    'sources',
                    'authors',
                ],
            ],
        ]);
        $response->assertJsonPath('data.success', true);
    }

    public function test_can_get_filter_options_with_search(): void
    {
        // Create test data with specific names
        Category::factory()->create(['name' => 'Technology News', 'slug' => 'technology-news']);
        Category::factory()->create(['name' => 'Sports News', 'slug' => 'sports-news']);
        Source::factory()->create(['name' => 'TechCrunch', 'slug' => 'techcrunch']);
        Source::factory()->create(['name' => 'ESPN', 'slug' => 'espn']);
        Author::factory()->create(['name' => 'John Tech Writer', 'slug' => 'john-tech-writer']);
        Author::factory()->create(['name' => 'Jane Sports Reporter', 'slug' => 'jane-sports-reporter']);

        $response = $this->getJson('/api/v1/filter-options?q=tech');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'success',
                'data' => [
                    'categories',
                    'sources',
                    'authors',
                ],
            ],
        ]);
        $response->assertJsonPath('data.success', true);
    }

    public function test_can_get_categories(): void
    {
        Category::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'categories' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'count',
                    ],
                ],
            ],
        ]);
        $response->assertJsonPath('success', true);
    }

    public function test_can_get_categories_with_search(): void
    {
        Category::factory()->create(['name' => 'Technology News', 'slug' => 'technology-news']);
        Category::factory()->create(['name' => 'Sports News', 'slug' => 'sports-news']);
        Category::factory()->create(['name' => 'Health News', 'slug' => 'health-news']);

        $response = $this->getJson('/api/v1/categories?q=tech');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        $categories = $response->json('data.categories');
        $this->assertCount(1, $categories);
        $this->assertEquals('Technology News', $categories[0]['name']);
    }

    public function test_categories_limit_to_10_results(): void
    {
        // Create 15 categories
        Category::factory()->count(15)->create();

        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        $categories = $response->json('data.categories');
        $this->assertLessThanOrEqual(10, count($categories));
    }

    public function test_can_get_sources(): void
    {
        Source::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/sources');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'sources' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'count',
                    ],
                ],
            ],
        ]);
        $response->assertJsonPath('success', true);
    }

    public function test_can_get_sources_with_search(): void
    {
        Source::factory()->create(['name' => 'TechCrunch', 'slug' => 'techcrunch']);
        Source::factory()->create(['name' => 'ESPN', 'slug' => 'espn']);
        Source::factory()->create(['name' => 'BBC Technology', 'slug' => 'bbc-technology']);

        $response = $this->getJson('/api/v1/sources?q=tech');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        $sources = $response->json('data.sources');
        $this->assertCount(2, $sources);
    }

    public function test_sources_limit_to_10_results(): void
    {
        // Create 15 sources
        Source::factory()->count(15)->create();

        $response = $this->getJson('/api/v1/sources');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        $sources = $response->json('data.sources');
        $this->assertLessThanOrEqual(10, count($sources));
    }

    public function test_can_get_authors(): void
    {
        Author::factory()->count(4)->create();

        $response = $this->getJson('/api/v1/authors');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'authors' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'count',
                    ],
                ],
            ],
        ]);
        $response->assertJsonPath('success', true);
    }

    public function test_can_get_authors_with_search(): void
    {
        Author::factory()->create(['name' => 'John Tech Writer', 'slug' => 'john-tech-writer']);
        Author::factory()->create(['name' => 'Jane Sports Reporter', 'slug' => 'jane-sports-reporter']);
        Author::factory()->create(['name' => 'Bob Technology Expert', 'slug' => 'bob-technology-expert']);

        $response = $this->getJson('/api/v1/authors?q=tech');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        $authors = $response->json('data.authors');
        $this->assertCount(2, $authors);
    }

    public function test_authors_limit_to_10_results(): void
    {
        // Create 15 authors
        Author::factory()->count(15)->create();

        $response = $this->getJson('/api/v1/authors');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        $authors = $response->json('data.authors');
        $this->assertLessThanOrEqual(10, count($authors));
    }

    public function test_categories_returns_empty_array_when_no_categories(): void
    {
        $response = $this->getJson('/api/v1/categories');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.categories', []);
    }

    public function test_sources_returns_empty_array_when_no_sources(): void
    {
        $response = $this->getJson('/api/v1/sources');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.sources', []);
    }

    public function test_authors_returns_empty_array_when_no_authors(): void
    {
        $response = $this->getJson('/api/v1/authors');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.authors', []);
    }

    public function test_search_returns_empty_array_when_no_matches(): void
    {
        Category::factory()->create(['name' => 'Sports News', 'slug' => 'sports-news']);

        $response = $this->getJson('/api/v1/categories?q=technology');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.categories', []);
    }
}

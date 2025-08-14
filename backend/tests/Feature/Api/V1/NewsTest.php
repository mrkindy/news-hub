<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class NewsTest extends TestCase
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
        $response = $this->getJson('/api/v1/news');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'articles' => [
                '*' => [
                    'id',
                    'title',
                    'description',
                    'content',
                    'category',
                    'source',
                    'author',
                    'publishedAt',
                    'imageUrl',
                    'url',
                ],
            ],
            'pagination' => [
                'current_page',
                'per_page',
                'total',
                'last_page',
                'from',
                'to',
                'next_page_url',
                'prev_page_url',
                'links',
            ],
        ]);
        $response->assertJsonPath('success', true);
    }

    public function test_can_get_single_news_article(): void
    {
        $article = Article::first();

        $response = $this->getJson("/api/v1/news/{$article->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'article' => [
                'id',
                'title',
                'description',
                'content',
                'category',
                'source',
                'author',
                'publishedAt',
                'imageUrl',
                'url',
            ],
            'relatedArticles',
        ]);

        $response->assertJsonPath('success', true);
        $response->assertJsonPath('article.title', 'Test Article');
    }

    public function test_returns_404_for_nonexistent_article(): void
    {
        $response = $this->getJson('/api/v1/news/999');

        $response->assertStatus(404);
        $response->assertJson([
            'success' => false,
            'message' => 'Article not found',
        ]);
    }

    public function test_can_filter_news_by_category(): void
    {
        $response = $this->getJson('/api/v1/news?categories[]=technology');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
    }

    public function test_can_search_news(): void
    {
        $response = $this->getJson('/api/v1/news?q=Test');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
    }

    public function test_authenticated_user_can_get_personalized_feed(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/v1/personalized-feed');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'articles',
            'pagination',
        ]);
    }
}

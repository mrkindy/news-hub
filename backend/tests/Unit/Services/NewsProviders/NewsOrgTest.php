<?php

declare(strict_types=1);

namespace Tests\Unit\Services\NewsProviders;

use App\Exceptions\ApiConfigurationException;
use App\Exceptions\NewsProviderException;
use App\Services\NewsProviders\NewsOrg;
use Exception;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

final class NewsOrgTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Config::set('news.newsorg.api_key', 'test-newsorg-key');
        Config::set('news.newsorg.base_url', 'https://newsapi.org/v2');
        Config::set('news.request_timeout', 30);
        Config::set('news.max_articles_per_source', 50);
    }

    public function test_fetches_news_successfully(): void
    {
        // Arrange
        $mockResponse = [
            'articles' => [
                [
                    'title' => 'Test NewsOrg Article',
                    'description' => 'Test article description',
                    'content' => 'Test article content...',
                    'url' => 'https://example.com/article1',
                    'urlToImage' => 'https://example.com/image1.jpg',
                    'publishedAt' => '2024-01-01T10:00:00Z',
                    'author' => 'John Reporter',
                    'source' => [
                        'name' => 'Example News',
                    ],
                ],
            ],
        ];

        Http::fake([
            'newsapi.org/*' => Http::response($mockResponse, 200),
        ]);

        $strategy = new NewsOrg();

        // Act
        $articles = $strategy->fetchNews();

        // Assert
        $this->assertCount(1, $articles);

        $article = $articles[0];
        $this->assertEquals('newsorg_'.md5('https://example.com/article1'), $article['external_id']);
        $this->assertEquals('Test NewsOrg Article', $article['title']);
        $this->assertEquals('Test article description', $article['description']);
        $this->assertEquals('Test article content...', $article['content']);
        $this->assertEquals('https://example.com/article1', $article['url']);
        $this->assertEquals('https://example.com/image1.jpg', $article['image_url']);
        $this->assertEquals('Example News', $article['source_name']);
        $this->assertEquals('General', $article['category_name']); // NewsOrg default
        $this->assertEquals('John Reporter', $article['author_name']);
        $this->assertNotNull($article['published_at']);

        // Verify API was called with correct parameters
        Http::assertSent(function (Request $request) {
            return str_contains($request->url(), 'newsapi.org/v2/top-headlines') &&
                   $request->data()['apiKey'] === 'test-newsorg-key' &&
                   $request->data()['language'] === 'en' &&
                   $request->data()['pageSize'] === 50;
        });
    }

    public function test_skips_articles_without_essential_data(): void
    {
        // Arrange
        $mockResponse = [
            'articles' => [
                [
                    'title' => 'Valid Article',
                    'url' => 'https://example.com/valid',
                    'source' => ['name' => 'Example News'],
                ],
                [
                    // Missing title
                    'url' => 'https://example.com/invalid1',
                    'source' => ['name' => 'Example News'],
                ],
                [
                    'title' => 'Another Invalid Article',
                    // Missing URL
                    'source' => ['name' => 'Example News'],
                ],
                [
                    'title' => 'Second Valid Article',
                    'url' => 'https://example.com/valid2',
                    'source' => ['name' => 'Example News'],
                ],
            ],
        ];

        Http::fake([
            'newsapi.org/*' => Http::response($mockResponse, 200),
        ]);

        $strategy = new NewsOrg();

        // Act
        $articles = $strategy->fetchNews();

        // Assert
        $this->assertCount(2, $articles); // Only valid articles
        $this->assertEquals('Valid Article', $articles[0]['title']);
        $this->assertEquals('Second Valid Article', $articles[1]['title']);
    }

    public function test_handles_missing_optional_fields_gracefully(): void
    {
        // Arrange
        $mockResponse = [
            'articles' => [
                [
                    'title' => 'Minimal Article',
                    'url' => 'https://example.com/minimal',
                    // Missing description, content, author, urlToImage, publishedAt, source
                ],
            ],
        ];

        Http::fake([
            'newsapi.org/*' => Http::response($mockResponse, 200),
        ]);

        $strategy = new NewsOrg();

        // Act
        $articles = $strategy->fetchNews();

        // Assert
        $this->assertCount(1, $articles);

        $article = $articles[0];
        $this->assertEquals('Minimal Article', $article['title']);
        $this->assertEquals('https://example.com/minimal', $article['url']);
        $this->assertEquals('', $article['description']); // Empty fallback
        $this->assertEquals('', $article['content']); // Empty fallback
        $this->assertEquals('NewsOrg', $article['author_name']); // Default fallback
        $this->assertEquals('NewsOrg', $article['source_name']); // Default fallback
        $this->assertNull($article['image_url']); // Null when missing
        $this->assertNull($article['published_at']); // Null when missing
    }

    public function test_handles_api_error_gracefully(): void
    {
        // Arrange
        Http::fake([
            'newsapi.org/*' => Http::response(['error' => 'API limit exceeded'], 429),
        ]);

        $strategy = new NewsOrg();

        // Act & Assert
        $this->expectException(NewsProviderException::class);
        $this->expectExceptionMessage('News Provider [NewsOrg]: API request failed with status 429');

        $strategy->fetchNews();
    }

    public function test_handles_network_exception_gracefully(): void
    {
        // Arrange
        Http::fake([
            'newsapi.org/*' => function () {
                throw new Exception('Connection timeout');
            },
        ]);

        $strategy = new NewsOrg();

        // Act & Assert
        $this->expectException(NewsProviderException::class);
        $this->expectExceptionMessage('News Provider [NewsOrg]: Connection timeout');

        $strategy->fetchNews();
    }

    public function test_handles_empty_source_name_gracefully(): void
    {
        // Arrange
        $mockResponse = [
            'articles' => [
                [
                    'title' => 'Test Article',
                    'url' => 'https://example.com/test',
                    'source' => [], // Empty source object
                ],
            ],
        ];

        Http::fake([
            'newsapi.org/*' => Http::response($mockResponse, 200),
        ]);

        $strategy = new NewsOrg();

        // Act
        $articles = $strategy->fetchNews();

        // Assert
        $this->assertCount(1, $articles);
        $this->assertEquals('NewsOrg', $articles[0]['source_name']); // Default fallback
    }

    public function test_throws_exception_when_api_key_not_configured(): void
    {
        // Arrange
        Config::set('news.newsorg.api_key', null);

        // Act & Assert
        $this->expectException(ApiConfigurationException::class);
        $this->expectExceptionMessage('API configuration missing for NewsOrg');

        new NewsOrg();
    }

    public function test_get_name_returns_correct_value(): void
    {
        // Arrange
        $strategy = new NewsOrg();

        // Act & Assert
        $this->assertEquals('NewsOrg', $strategy->getName());
    }
}

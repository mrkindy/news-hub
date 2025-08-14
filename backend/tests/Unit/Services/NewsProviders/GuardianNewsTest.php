<?php

declare(strict_types=1);

namespace Tests\Unit\Services\NewsProviders;

use App\Exceptions\ApiConfigurationException;
use App\Exceptions\NewsProviderException;
use App\Services\NewsProviders\GuardianNews;
use Exception;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

final class GuardianNewsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Config::set('news.guardian.api_key', 'test-api-key');
        Config::set('news.guardian.base_url', 'https://content.guardianapis.com');
        Config::set('news.request_timeout', 30);
        Config::set('news.max_articles_per_source', 50);
    }

    public function test_fetches_news_successfully(): void
    {
        // Arrange
        $mockResponse = [
            'response' => [
                'results' => [
                    [
                        'id' => 'world/2024/jan/01/test-article',
                        'webTitle' => 'Test Article Title',
                        'webUrl' => 'https://www.theguardian.com/world/2024/jan/01/test-article',
                        'webPublicationDate' => '2024-01-01T10:00:00Z',
                        'sectionName' => 'World news',
                        'fields' => [
                            'trailText' => 'Test article description',
                            'bodyText' => 'Test article content',
                            'thumbnail' => 'https://media.guim.co.uk/test-image.jpg',
                            'byline' => 'John Smith',
                        ],
                    ],
                ],
            ],
        ];

        Http::fake([
            'content.guardianapis.com/*' => Http::response($mockResponse, 200),
        ]);

        $strategy = new GuardianNews();

        // Act
        $articles = $strategy->fetchNews();

        // Assert
        $this->assertCount(1, $articles);

        $article = $articles[0];
        $this->assertEquals('guardian_'.md5('world/2024/jan/01/test-article'), $article['external_id']);
        $this->assertEquals('Test Article Title', $article['title']);
        $this->assertEquals('Test article description', $article['description']);
        $this->assertEquals('Test article content', $article['content']);
        $this->assertEquals('https://www.theguardian.com/world/2024/jan/01/test-article', $article['url']);
        $this->assertEquals('https://media.guim.co.uk/test-image.jpg', $article['image_url']);
        $this->assertEquals('The Guardian', $article['source_name']);
        $this->assertEquals('World news', $article['category_name']);
        $this->assertEquals('John Smith', $article['author_name']);
        $this->assertNotNull($article['published_at']);

        // Verify API was called with correct parameters
        Http::assertSent(function (Request $request) {
            return str_contains($request->url(), 'content.guardianapis.com/search') &&
                   isset($request->data()['api-key']) && $request->data()['api-key'] === 'test-api-key' &&
                   isset($request->data()['page-size']) && $request->data()['page-size'] === 50;
        });
    }

    public function test_handles_api_error_gracefully(): void
    {
        // Arrange
        Http::fake([
            'content.guardianapis.com/*' => Http::response([], 500),
        ]);

        $strategy = new GuardianNews();

        // Act & Assert
        $this->expectException(NewsProviderException::class);
        $this->expectExceptionMessage('News Provider [Guardian News]: API request failed with status 500');

        $strategy->fetchNews();
    }

    public function test_handles_network_exception_gracefully(): void
    {
        // Arrange
        Http::fake([
            'content.guardianapis.com/*' => function () {
                throw new Exception('Network error');
            },
        ]);

        $strategy = new GuardianNews();

        // Act & Assert
        $this->expectException(NewsProviderException::class);
        $this->expectExceptionMessage('News Provider [Guardian News]: Network error');

        $strategy->fetchNews();
    }

    public function test_handles_missing_fields_gracefully(): void
    {
        // Arrange
        $mockResponse = [
            'response' => [
                'results' => [
                    [
                        'webTitle' => 'Minimal Article',
                        'webUrl' => 'https://www.theguardian.com/test',
                        // Missing other fields
                    ],
                ],
            ],
        ];

        Http::fake([
            'content.guardianapis.com/*' => Http::response($mockResponse, 200),
        ]);

        $strategy = new GuardianNews();

        // Act
        $articles = $strategy->fetchNews();

        // Assert
        $this->assertCount(1, $articles);

        $article = $articles[0];
        $this->assertEquals('Minimal Article', $article['title']);
        $this->assertEquals('https://www.theguardian.com/test', $article['url']);
        $this->assertEquals('The Guardian', $article['source_name']);
        $this->assertEquals('The Guardian', $article['author_name']); // Default fallback
        $this->assertEquals('', $article['description']); // Empty fallback
    }

    public function test_throws_exception_when_api_key_not_configured(): void
    {
        // Arrange
        Config::set('news.guardian.api_key', null);

        // Act & Assert
        $this->expectException(ApiConfigurationException::class);
        $this->expectExceptionMessage('API configuration missing for Guardian News');

        new GuardianNews();
    }

    public function test_get_name_returns_correct_value(): void
    {
        // Arrange
        $strategy = new GuardianNews();

        // Act & Assert
        $this->assertEquals('The Guardian', $strategy->getName());
    }
}

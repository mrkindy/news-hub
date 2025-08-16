<?php

declare(strict_types=1);

namespace Tests\Unit\Services\NewsProviders;

use App\Exceptions\ApiConfigurationException;
use App\Exceptions\NewsProviderException;
use App\Services\NewsProviders\NTimesNews;
use Exception;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

final class NTimesNewsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Config::set('news.nytimes.api_key', 'test-nytimes-key');
        Config::set('news.nytimes.base_url', 'https://api.nytimes.com/svc/search/v2');
        Config::set('news.request_timeout', 30);
        Config::set('news.max_articles_per_source', 50);
    }

    public function test_fetches_news_successfully(): void
    {
        // Arrange
        $mockResponse = [
            'response' => [
                'docs' => [
                    [
                        '_id' => 'nyt://article/12345',
                        'headline' => ['main' => 'Test NY Times Article'],
                        'abstract' => 'Test article abstract',
                        'lead_paragraph' => 'Test article lead paragraph',
                        'web_url' => 'https://www.nytimes.com/2024/01/01/test-article.html',
                        'pub_date' => '2024-01-01T10:00:00Z',
                        'section_name' => 'World',
                        'multimedia' => [
                            [
                                'url' => 'https://www.nytimes.com/images/2024/01/01/test-image.jpg',
                                'type' => 'image',
                            ],
                        ],
                        'byline' => [
                            'original' => 'By Jane Doe',
                            'person' => [
                                [
                                    'firstname' => 'Jane',
                                    'lastname' => 'Doe',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        Http::fake([
            'api.nytimes.com/*' => Http::response($mockResponse, 200),
        ]);

        $strategy = new NTimesNews();

        // Act
        $articles = $strategy->fetchNews();

        // Assert
        $this->assertCount(1, $articles);

        $article = $articles[0];
        $this->assertEquals('nytimes_'.md5('nyt://article/12345'), $article['external_id']);
        $this->assertEquals('Test NY Times Article', $article['title']);
        $this->assertEquals('Test article abstract', $article['description']);
        $this->assertEquals('Test article lead paragraph', $article['content']);
        $this->assertEquals('https://www.nytimes.com/2024/01/01/test-article.html', $article['url']);
        $this->assertEquals('https://www.nytimes.com/images/2024/01/01/test-image.jpg', $article['image_url']);
        $this->assertEquals('New York Times', $article['source_name']);
        $this->assertEquals('World', $article['category_name']);
        $this->assertEquals('By Jane Doe', $article['author_name']);
        $this->assertNotNull($article['published_at']);

        // Verify API was called with correct parameters
        Http::assertSent(function (Request $request) {
            return str_contains($request->url(), 'api.nytimes.com/svc/search/v2/articlesearch.json') &&
                   $request->data()['api-key'] === 'test-nytimes-key' &&
                   $request->data()['sort'] === 'newest';
        });
    }

    public function test_handles_author_from_person_array(): void
    {
        // Arrange
        $mockResponse = [
            'response' => [
                'docs' => [
                    [
                        '_id' => 'nyt://article/12345',
                        'headline' => ['main' => 'Test Article'],
                        'web_url' => 'https://www.nytimes.com/test.html',
                        'byline' => [
                            'person' => [
                                [
                                    'firstname' => 'John',
                                    'middlename' => 'Q',
                                    'lastname' => 'Smith',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        Http::fake([
            'api.nytimes.com/*' => Http::response($mockResponse, 200),
        ]);

        $strategy = new NTimesNews();

        // Act
        $articles = $strategy->fetchNews();

        // Assert
        $this->assertCount(1, $articles);
        $this->assertEquals('John Q Smith', $articles[0]['author_name']);
    }

    public function test_handles_missing_author_gracefully(): void
    {
        // Arrange
        $mockResponse = [
            'response' => [
                'docs' => [
                    [
                        '_id' => 'nyt://article/12345',
                        'headline' => ['main' => 'Test Article'],
                        'web_url' => 'https://www.nytimes.com/test.html',
                        // No byline field
                    ],
                ],
            ],
        ];

        Http::fake([
            'api.nytimes.com/*' => Http::response($mockResponse, 200),
        ]);

        $strategy = new NTimesNews();

        // Act
        $articles = $strategy->fetchNews();

        // Assert
        $this->assertCount(1, $articles);
        $this->assertEquals('New York Times', $articles[0]['author_name']); // Default fallback
    }

    public function test_handles_api_error_gracefully(): void
    {
        // Arrange
        Http::fake([
            'api.nytimes.com/*' => Http::response([], 429), // Rate limit error
        ]);

        $strategy = new NTimesNews();

        // Act & Assert
        $this->expectException(NewsProviderException::class);
        $this->expectExceptionMessage('News Provider [New York Times]: API request failed with status 429');

        $strategy->fetchNews();
    }

    public function test_handles_network_exception_gracefully(): void
    {
        // Arrange
        Http::fake([
            'api.nytimes.com/*' => function () {
                throw new Exception('Network timeout');
            },
        ]);

        $strategy = new NTimesNews();

        // Act & Assert
        $this->expectException(NewsProviderException::class);
        $this->expectExceptionMessage('News Provider [New York Times]: Network timeout');

        $strategy->fetchNews();
    }

    public function test_respects_max_articles_limit(): void
    {
        // Arrange
        Config::set('news.max_articles_per_source', 2);

        $mockDocs = [];
        for ($i = 1; $i <= 5; ++$i) {
            $mockDocs[] = [
                '_id' => "nyt://article/{$i}",
                'headline' => ['main' => "Article {$i}"],
                'web_url' => "https://www.nytimes.com/article{$i}.html",
            ];
        }

        $mockResponse = ['response' => ['docs' => $mockDocs]];

        Http::fake([
            'api.nytimes.com/*' => Http::response($mockResponse, 200),
        ]);

        $strategy = new NTimesNews();

        // Act
        $articles = $strategy->fetchNews();

        // Assert
        $this->assertCount(2, $articles); // Should respect the limit
    }

    public function test_throws_exception_when_api_key_not_configured(): void
    {
        // Arrange
        Config::set('news.nytimes.api_key', null);

        // Act & Assert
        $this->expectException(ApiConfigurationException::class);
        $this->expectExceptionMessage('API configuration missing for New York Times');

        new NTimesNews();
    }

    public function test_get_name_returns_correct_value(): void
    {
        // Arrange
        $strategy = new NTimesNews();

        // Act & Assert
        $this->assertEquals('New York Times', $strategy->getName());
    }
}

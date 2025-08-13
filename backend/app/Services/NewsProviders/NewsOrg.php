<?php

declare(strict_types=1);

namespace App\Services\NewsProviders;

use App\Contracts\NewsSourceInterface;
use App\Enums\NewsStrategy;
use App\Exceptions\ApiConfigurationException;
use App\Exceptions\NewsProviderException;
use Exception;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class NewsOrg implements NewsSourceInterface
{
    private readonly PendingRequest $client;

    public function __construct()
    {
        if (empty(config('news.newsorg.api_key'))) {
            throw new ApiConfigurationException('NewsOrg', 'NEWSORG_API_KEY');
        }

        $this->client = Http::timeout(config('news.request_timeout', 30))
            ->baseUrl(config('news.newsorg.base_url'));
    }

    public function fetchNews(): array
    {
        try {
            $response = $this->client->get('/top-headlines', [
                'apiKey' => config('news.newsorg.api_key'),
                'language' => 'en',
                'sortBy' => 'publishedAt',
                'pageSize' => config('news.max_articles_per_source', 50),
            ]);

            if (! $response->successful()) {
                $errorMessage = "API request failed with status {$response->status()}";

                Log::error('NewsOrg API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new NewsProviderException('NewsOrg', $errorMessage, $response->status());
            }

            return $this->normalizeResponse($response);
        } catch (NewsProviderException $e) {
            // Re-throw our custom exceptions
            throw $e;
        } catch (Exception $e) {
            Log::error('NewsOrg API exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw new NewsProviderException('NewsOrg', $e->getMessage(), 0, $e);
        }
    }

    public function getName(): string
    {
        return NewsStrategy::NEWS_ORG->value;
    }

    private function normalizeResponse(Response $response): array
    {
        $data = $response->json();
        $articles = [];

        foreach ($data['articles'] ?? [] as $item) {
            // Skip articles without essential data
            if (empty($item['title']) || empty($item['url'])) {
                continue;
            }

            $articles[] = [
                'external_id' => $this->generateExternalId($item['url'] ?? ''),
                'title' => $this->cleanText($item['title'] ?? ''),
                'description' => $this->cleanText($item['description'] ?? ''),
                'content' => $this->cleanText($item['content'] ?? ''),
                'url' => $item['url'] ?? '',
                'image_url' => $item['urlToImage'] ?? null,
                'published_at' => $this->parseDate($item['publishedAt'] ?? ''),
                'source_name' => $this->extractSourceName($item['source'] ?? []),
                'category_name' => NewsStrategy::GENERAL->value,
                'author_name' => $this->cleanText($item['author'] ?? '') ?: NewsStrategy::NEWS_ORG->value,
            ];
        }

        return $articles;
    }

    private function generateExternalId(string $url): string
    {
        return 'newsorg_'.md5($url);
    }

    private function cleanText(string $text): string
    {
        return mb_trim(strip_tags($text));
    }

    private function extractSourceName(array $source): string
    {
        return $source['name'] ?? NewsStrategy::NEWS_ORG->value;
    }

    private function parseDate(string $date): ?string
    {
        if (empty($date)) {
            return null;
        }

        try {
            return \Carbon\Carbon::parse($date)->toDateTimeString();
        } catch (Exception $e) {
            Log::warning('Failed to parse NewsOrg date', ['date' => $date]);

            return null;
        }
    }
}

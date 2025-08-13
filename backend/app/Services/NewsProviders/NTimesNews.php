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

final class NTimesNews implements NewsSourceInterface
{
    private readonly PendingRequest $client;

    public function __construct()
    {
        if (empty(config('news.nytimes.api_key'))) {
            throw new ApiConfigurationException('New York Times', 'NYTIMES_API_KEY');
        }

        $this->client = Http::timeout(config('news.request_timeout', 30))
            ->baseUrl(config('news.nytimes.base_url'));
    }

    public function fetchNews(): array
    {
        try {
            $response = $this->client->get('/articlesearch.json', [
                'api-key' => config('news.nytimes.api_key'),
                'sort' => 'newest',
                'page' => 0,
                'fl' => 'headline,abstract,lead_paragraph,web_url,multimedia,pub_date,byline,section_name',
            ]);

            if (! $response->successful()) {
                $errorMessage = "API request failed with status {$response->status()}";

                Log::error('NY Times API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new NewsProviderException('New York Times', $errorMessage, $response->status());
            }

            return $this->normalizeResponse($response);
        } catch (NewsProviderException $e) {
            // Re-throw our custom exceptions
            throw $e;
        } catch (Exception $e) {
            Log::error('NY Times API exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw new NewsProviderException('New York Times', $e->getMessage(), 0, $e);
        }
    }

    public function getName(): string
    {
        return NewsStrategy::NY_TIMES->value;
    }

    private function normalizeResponse(Response $response): array
    {
        $data = $response->json();
        $articles = [];
        $maxArticles = config('news.max_articles_per_source', 50);

        foreach (array_slice($data['response']['docs'] ?? [], 0, $maxArticles) as $item) {
            $articles[] = [
                'external_id' => $this->generateExternalId($item['_id'] ?? ''),
                'title' => $this->cleanText($item['headline']['main'] ?? ''),
                'description' => $this->cleanText($item['abstract'] ?? ''),
                'content' => $this->cleanText($item['lead_paragraph'] ?? ''),
                'url' => $item['web_url'] ?? '',
                'image_url' => $this->extractImageUrl($item['multimedia'] ?? []),
                'published_at' => $this->parseDate($item['pub_date'] ?? ''),
                'source_name' => NewsStrategy::NY_TIMES->value,
                'category_name' => $item['section_name'] ?? NewsStrategy::GENERAL->value,
                'author_name' => $this->extractAuthor($item['byline'] ?? []),
            ];
        }

        return $articles;
    }

    private function generateExternalId(string $id): string
    {
        return 'nytimes_'.md5($id);
    }

    private function cleanText(string $text): string
    {
        return mb_trim(strip_tags($text));
    }

    private function extractImageUrl(array $multimedia): ?string
    {
        foreach ($multimedia as $media) {
            if (isset($media['url']) && $media['type'] === 'image') {
                return 'https://www.nytimes.com/'.$media['url'];
            }
        }

        return null;
    }

    private function extractAuthor(array $byline): string
    {
        if (isset($byline['original'])) {
            return $this->cleanText($byline['original']);
        }

        if (isset($byline['person']) && ! empty($byline['person'])) {
            $person = $byline['person'][0];
            $name = mb_trim(
                ($person['firstname'] ?? '').' '.
                ($person['middlename'] ?? '').' '.
                ($person['lastname'] ?? '')
            );

            return preg_replace('/\s+/', ' ', $name) ?: NewsStrategy::NY_TIMES->value;
        }

        return NewsStrategy::NY_TIMES->value;
    }

    private function parseDate(string $date): ?string
    {
        if (empty($date)) {
            return null;
        }

        try {
            return \Carbon\Carbon::parse($date)->toDateTimeString();
        } catch (Exception $e) {
            Log::warning('Failed to parse NY Times date', ['date' => $date]);

            return null;
        }
    }
}

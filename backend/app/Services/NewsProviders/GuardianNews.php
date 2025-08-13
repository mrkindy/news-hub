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

final class GuardianNews implements NewsSourceInterface
{
    private readonly PendingRequest $client;

    public function __construct()
    {
        if (empty(config('news.guardian.api_key'))) {
            throw new ApiConfigurationException('Guardian News', 'GUARDIAN_API_KEY');
        }

        $this->client = Http::timeout(config('news.request_timeout', 30))
            ->baseUrl(config('news.guardian.base_url'));
    }

    public function fetchNews(): array
    {
        try {
            $response = $this->client->get('/search', [
                'api-key' => config('news.guardian.api_key'),
                'page-size' => config('news.max_articles_per_source', 50),
                'show-fields' => 'all',
                'order-by' => 'newest',
            ]);

            if (! $response->successful()) {
                $errorMessage = "API request failed with status {$response->status()}";

                Log::error('Guardian API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new NewsProviderException('Guardian News', $errorMessage, $response->status());
            }

            return $this->normalizeResponse($response);
        } catch (NewsProviderException $e) {
            // Re-throw our custom exceptions
            throw $e;
        } catch (Exception $e) {
            Log::error('Guardian API exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw new NewsProviderException('Guardian News', $e->getMessage(), 0, $e);
        }
    }

    public function getName(): string
    {
        return NewsStrategy::THE_GUARDIAN->value;
    }

    private function normalizeResponse(Response $response): array
    {
        $data = $response->json();
        $articles = [];

        foreach ($data['response']['results'] ?? [] as $item) {
            $articles[] = [
                'external_id' => $this->generateExternalId($item['id'] ?? ''),
                'title' => $this->cleanText($item['webTitle'] ?? ''),
                'description' => $this->cleanText($item['fields']['trailText'] ?? ''),
                'content' => $this->cleanText($item['fields']['bodyText'] ?? ''),
                'url' => $item['webUrl'] ?? '',
                'image_url' => $item['fields']['thumbnail'] ?? null,
                'published_at' => $this->parseDate($item['webPublicationDate'] ?? ''),
                'source_name' => NewsStrategy::THE_GUARDIAN->value,
                'category_name' => $item['sectionName'] ?? NewsStrategy::GENERAL->value,
                'author_name' => $item['fields']['byline'] ?? NewsStrategy::THE_GUARDIAN->value,
            ];
        }

        return $articles;
    }

    private function generateExternalId(string $id): string
    {
        return 'guardian_'.md5($id);
    }

    private function cleanText(string $text): string
    {
        return mb_trim(strip_tags($text));
    }

    private function parseDate(string $date): ?string
    {
        if (empty($date)) {
            return null;
        }

        try {
            return \Carbon\Carbon::parse($date)->toDateTimeString();
        } catch (Exception $e) {
            Log::warning('Failed to parse Guardian date', ['date' => $date]);

            return null;
        }
    }
}

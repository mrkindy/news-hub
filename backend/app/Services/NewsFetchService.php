<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\NewsSourceInterface;
use App\Models\Article;
use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use App\Services\CacheService;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class NewsFetchService
{
    /**
     * @param  Collection<int, NewsSourceInterface>  $strategies
     */
    public function __construct(
        private readonly Collection $strategies,
        private readonly CacheService $cacheService
    ) {}

    public function fetchFromAllSources(): array
    {
        $allArticles = [];
        $results = [];

        foreach ($this->strategies as $strategy) {
            $sourceName = $strategy->getName();
            Log::info("Fetching news from {$sourceName}");

            try {
                $articles = $strategy->fetchNews();
                $savedCount = $this->saveArticles($articles);

                $results[] = [
                    'source' => $sourceName,
                    'fetched' => count($articles),
                    'saved' => $savedCount,
                ];

                $allArticles = array_merge($allArticles, $articles);
            } catch (Exception $e) {
                Log::error("Failed to fetch news from {$sourceName}", [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                $results[] = [
                    'source' => $sourceName,
                    'fetched' => 0,
                    'saved' => 0,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return [
            'total_articles' => count($allArticles),
            'sources' => $results,
        ];
    }

    private function saveArticles(array $articles): int
    {
        $savedCount = 0;

        DB::transaction(function () use ($articles, &$savedCount) {
            foreach ($articles as $articleData) {
                try {
                    // Skip if article already exists
                    if (Article::where('external_id', $articleData['external_id'])->exists()) {
                        continue;
                    }

                    // Create or get related entities
                    $category = $this->getOrCreateCategory($articleData['category_name']);
                    $source = $this->getOrCreateSource($articleData['source_name']);
                    $author = $this->getOrCreateAuthor($articleData['author_name']);

                    // Create article
                    Article::create([
                        'external_id' => $articleData['external_id'],
                        'title' => $articleData['title'],
                        'description' => $articleData['description'],
                        'content' => $articleData['content'],
                        'url' => $articleData['url'],
                        'image_url' => $articleData['image_url'],
                        'published_at' => $articleData['published_at'],
                        'category_id' => $category->id,
                        'source_id' => $source->id,
                        'author_id' => $author->id,
                    ]);

                    ++$savedCount;
                } catch (Exception $e) {
                    Log::warning('Failed to save article', [
                        'external_id' => $articleData['external_id'] ?? null,
                        'title' => $articleData['title'] ?? null,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        });

        // Clear cache after successful article saving
        if ($savedCount > 0) {
            $this->clearRelatedCache();
        }

        return $savedCount;
    }

    /**
     * Clear cache when new articles are added
     */
    private function clearRelatedCache(): void
    {
        // Clear taxonomy cache (categories, sources, authors counts may have changed)
        $this->cacheService->forget('categories');
        $this->cacheService->forget('sources');
        $this->cacheService->forget('authors');
        $this->cacheService->forget('filter_options');

        // Clear personalized feeds cache
        $this->cacheService->forgetPattern('news_aggregator:personalized_feed:*');

        // Clear article cache patterns
        $this->cacheService->forgetPattern('news_aggregator:articles:*');

        Log::info('Cache cleared after saving new articles');
    }

    private function getOrCreateCategory(string $name): Category
    {
        $slug = $this->generateSlug($name);

        return Category::firstOrCreate(
            ['slug' => $slug],
            ['name' => $name]
        );
    }

    private function getOrCreateSource(string $name): Source
    {
        $slug = $this->generateSlug($name);

        return Source::firstOrCreate(
            ['slug' => $slug],
            [
                'name' => $name,
                'url' => null,
                'description' => null,
            ]
        );
    }

    private function getOrCreateAuthor(string $name): Author
    {
        $slug = $this->generateSlug($name);

        return Author::firstOrCreate(
            ['slug' => $slug],
            [
                'name' => $name,
                'bio' => null,
            ]
        );
    }

    private function generateSlug(string $text): string
    {
        return mb_strtolower(mb_trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $text), '-'));
    }
}

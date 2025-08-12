<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\NewsRepositoryInterface;
use App\DTOs\ArticleFilterData;
use App\Models\Article;
use App\Services\CacheService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

final class NewsRepository implements NewsRepositoryInterface
{
    public function __construct(
        private readonly CacheService $cacheService
    ) {}

    public function paginate(ArticleFilterData $filters): LengthAwarePaginator
    {
        $query = QueryBuilder::for(Article::class)
            ->allowedFilters([
                'title',
                'description',
                'content',
                'category.slug',
                'source.slug',
                'author.slug',
                'published_at',
            ])
            ->allowedSorts([
                'title',
                'published_at',
                'created_at',
                'updated_at',
            ])
            ->allowedIncludes([
                'category',
                'source',
                'author',
            ])
            ->with(['category', 'source', 'author']);

        // Apply search query
        if ($filters->q) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters->q}%")
                    ->orWhere('description', 'like', "%{$filters->q}%")
                    ->orWhere('content', 'like', "%{$filters->q}%");
            });
        }

        // Apply category filter
        if ($filters->categories) {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->whereIn('name', $filters->categories)
                    ->orWhereIn('slug', $filters->categories);
            });
        }

        // Apply source filter
        if ($filters->sources) {
            $query->whereHas('source', function ($q) use ($filters) {
                $q->whereIn('slug', $filters->sources)
                    ->orWhereIn('name', $filters->sources);
            });
        }

        // Apply author filter
        if ($filters->authors) {
            $query->whereHas('author', function ($q) use ($filters) {
                $q->whereIn('slug', $filters->authors)
                    ->orWhereIn('name', $filters->authors);
            });
        }

        // Apply date filters
        if ($filters->date_from) {
            $query->whereDate('published_at', '>=', $filters->date_from);
        }

        if ($filters->date_to) {
            $query->whereDate('published_at', '<=', $filters->date_to);
        }

        // Apply sorting
        $sortOrder = $filters->sort_direction->value;
        $query->orderBy($filters->sort_field->value, $sortOrder);

        return $query->paginate($filters->per_page, ['*'], 'page', $filters->page);
    }

    public function findById(int|string $id): ?Article
    {
        $cacheKey = "articles:single:{$id}";

        return $this->cacheService->remember($cacheKey, function () use ($id) {
            return Article::with(['category', 'source', 'author'])->find($id);
        });
    }

    public function findByIdWithRelated(int|string $id): ?Article
    {
        $cacheKey = "articles:with_related:{$id}";

        return $this->cacheService->remember($cacheKey, function () use ($id) {
            return Article::with([
                'category',
                'source',
                'author',
                'relatedArticles' => function ($query) {
                    $query->with(['category', 'source', 'author'])
                        ->limit(3);
                },
            ])->find($id);
        });
    }

    public function getPersonalizedFeed(int $userId, ArticleFilterData $filters): LengthAwarePaginator
    {
        $filters = $this->mergeUserPreferences($filters, $userId);
        $cacheKey = $this->generatePersonalizedFeedCacheKey($userId, $filters);

        return $this->cacheService->remember($cacheKey, function () use ($filters) {
            // For now, return the same as regular paginate
            // In a real implementation, this would use user preferences to filter
            return $this->paginate($filters);
        }, 15); // Cache for 15 minutes
    }

    /**
     * Merge user preferences into the filter data
     */
    private function mergeUserPreferences(ArticleFilterData $filters, int $userId): ArticleFilterData
    {
        // Fetch user preferences from database
        $userPreference = (new PreferencesRepository())->getByUserId($userId);

        // If user has no preferences set, use empty arrays as defaults
        if (!$userPreference || !$userPreference->preferences) {
            return $filters;
        }

        $preferences = $userPreference->preferences;

        // Merge preferences into filters
        $filters->categories = $preferences["categories"] ?? [];
        $filters->sources = $preferences["sources"] ?? [];
        $filters->authors = $preferences["authors"] ?? [];

        return $filters;
    }

    /**
     * Generate cache key for personalized feed
     */
    private function generatePersonalizedFeedCacheKey(int $userId, ArticleFilterData $filters): string
    {
        $params = [
            'user_id' => $userId,
            'page' => $filters->page,
            'per_page' => $filters->per_page,
            'sort' => $filters->getSortString(),
            'q' => $filters->q,
            'categories' => $filters->categories ? implode(',', $filters->categories) : null,
            'sources' => $filters->sources ? implode(',', $filters->sources) : null,
            'authors' => $filters->authors ? implode(',', $filters->authors) : null,
            'date_from' => $filters->date_from,
            'date_to' => $filters->date_to,
        ];

        return 'personalized_feed:' . md5(serialize(array_filter($params)));
    }
}

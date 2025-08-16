<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\TaxonomyRepositoryInterface;
use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use App\Services\CacheService;
use Illuminate\Support\Collection;

final class TaxonomyRepository implements TaxonomyRepositoryInterface
{
    public function __construct(
        private readonly CacheService $cacheService
    ) {}

    public function getCategories(?string $query = null): Collection
    {
        $cacheKey = $query ? "categories_search_{$query}" : 'categories';

        return $this->cacheService->remember($cacheKey, function () use ($query) {
            $builder = Category::withCount('articles')
                ->orderBy('name');

            if ($query) {
                $builder->where('name', 'LIKE', "%{$query}%");
            }

            return $builder->limit(10)
                ->get()
                ->map(function ($category) {
                    return [
                        'id' => $category->slug,
                        'name' => $category->name,
                        'slug' => $category->slug,
                        'count' => $category->articles_count,
                    ];
                });
        });
    }

    public function getSources(?string $query = null): Collection
    {
        $cacheKey = $query ? "sources_search_{$query}" : 'sources';

        return $this->cacheService->remember($cacheKey, function () use ($query) {
            $builder = Source::withCount('articles')
                ->orderBy('name');

            if ($query) {
                $builder->where('name', 'LIKE', "%{$query}%");
            }

            return $builder->limit(10)
                ->get()
                ->map(function ($source) {
                    return [
                        'id' => $source->slug,
                        'name' => $source->name,
                        'slug' => $source->slug,
                        'count' => $source->articles_count,
                    ];
                });
        });
    }

    public function getAuthors(?string $query = null): Collection
    {
        $cacheKey = $query ? "authors_search_{$query}" : 'authors';

        return $this->cacheService->remember($cacheKey, function () use ($query) {
            $builder = Author::withCount('articles')
                ->orderBy('name');

            if ($query) {
                $builder->where('name', 'LIKE', "%{$query}%");
            }

            return $builder->limit(10)
                ->get()
                ->map(function ($author) {
                    return [
                        'id' => $author->slug,
                        'name' => $author->name,
                        'slug' => $author->slug,
                        'count' => $author->articles_count,
                    ];
                });
        });
    }

    public function getFilterOptions(?string $query = null): array
    {
        $cacheKey = $query ? "filter_options_search_{$query}" : 'filter_options';

        return $this->cacheService->remember($cacheKey, function () use ($query) {
            return [
                'success' => true,
                'data' => [
                    'categories' => $this->getCategories($query)->toArray(),
                    'sources' => $this->getSources($query)->toArray(),
                    'authors' => $this->getAuthors($query)->toArray(),
                ],
            ];
        });
    }
}

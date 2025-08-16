<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\TaxonomyRepositoryInterface;

final class TaxonomyService
{
    public function __construct(
        private readonly TaxonomyRepositoryInterface $taxonomyRepository
    ) {}

    public function getFilterOptions(?string $query = null): array
    {
        return $this->taxonomyRepository->getFilterOptions($query);
    }

    public function getCategories(?string $query = null): array
    {
        return [
            'categories' => $this->taxonomyRepository->getCategories($query)->toArray(),
        ];
    }

    public function getSources(?string $query = null): array
    {
        return [
            'sources' => $this->taxonomyRepository->getSources($query)->toArray(),
        ];
    }

    public function getAuthors(?string $query = null): array
    {
        return [
            'authors' => $this->taxonomyRepository->getAuthors($query)->toArray(),
        ];
    }
}

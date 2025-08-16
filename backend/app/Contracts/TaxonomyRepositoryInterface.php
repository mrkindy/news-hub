<?php

declare(strict_types=1);

namespace App\Contracts;

use Illuminate\Support\Collection;

interface TaxonomyRepositoryInterface
{
    public function getCategories(?string $query = null): Collection;

    public function getSources(?string $query = null): Collection;

    public function getAuthors(?string $query = null): Collection;

    public function getFilterOptions(?string $query = null): array;
}

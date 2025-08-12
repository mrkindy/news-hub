<?php

declare(strict_types=1);

namespace App\Contracts;

use App\DTOs\ArticleFilterData;
use App\Models\Article;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface NewsRepositoryInterface
{
    public function paginate(ArticleFilterData $filters): LengthAwarePaginator;

    public function findById(int|string $id): ?Article;

    public function findByIdWithRelated(int|string $id): ?Article;

    public function getPersonalizedFeed(int $userId, ArticleFilterData $filters): LengthAwarePaginator;
}

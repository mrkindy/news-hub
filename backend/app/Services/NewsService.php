<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\NewsRepositoryInterface;
use App\DTOs\ArticleFilterData;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class NewsService
{
    public function __construct(
        private readonly NewsRepositoryInterface $newsRepository
    ) {}

    public function getArticles(array $filters): LengthAwarePaginator
    {
        $filterData = ArticleFilterData::fromArray($filters);

        return $this->newsRepository->paginate($filterData);
    }

    public function getArticle(int|string $id): mixed
    {
        return $this->newsRepository->findByIdWithRelated($id);
    }

    public function getPersonalizedFeed(int $userId, array $filters): LengthAwarePaginator
    {
        $filterData = ArticleFilterData::fromArray($filters);

        return $this->newsRepository->getPersonalizedFeed($userId, $filterData);
    }
}

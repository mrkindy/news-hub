<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\ArticleSortField;
use App\Enums\SortDirection;
use Spatie\LaravelData\Data;

use function PHPUnit\Framework\isString;

final class ArticleFilterData extends Data
{
    public function __construct(
        public ?string $q = null,
        public ?array $categories = null,
        public ?array $sources = null,
        public ?array $authors = null,
        public ?string $date_from = null,
        public ?string $date_to = null,
        public int $page = 1,
        public int $per_page = 15,
        public ArticleSortField $sort_field = ArticleSortField::PUBLISHED_AT,
        public SortDirection $sort_direction = SortDirection::DESC,
    ) {}

    public static function fromArray(array $data): self
    {
        $sort = $data['sort'] ?? '-published_at';
        $sortField = ArticleSortField::fromString($sort);
        $sortDirection = SortDirection::fromString($sort);

        $categories = isset($data['categories']) && isString($data['categories']) ? [$data['categories']] : $data['categories'] ?? null;
        $sources = isset($data['sources']) && isString($data['sources']) ? [$data['sources']] : $data['sources'] ?? null;
        $authors = isset($data['authors']) && isString($data['authors']) ? [$data['authors']] : $data['authors'] ?? null;

        return new self(
            q: $data['q'] ?? null,
            categories: $categories,
            sources: $sources,
            authors: $authors,
            date_from: $data['dateFrom'] ?? null,
            date_to: $data['dateTo'] ?? null,
            page: max(1, (int) ($data['page'] ?? 1)),
            per_page: min(100, max(1, (int) ($data['per_page'] ?? 15))),
            sort_field: $sortField,
            sort_direction: $sortDirection,
        );
    }

    public function getSortString(): string
    {
        $prefix = $this->sort_direction === SortDirection::DESC ? '-' : '';

        return $prefix.$this->sort_field->value;
    }
}

<?php

declare(strict_types=1);

namespace App\Enums;

enum ArticleSortField: string
{
    case PUBLISHED_AT = 'published_at';
    case TITLE = 'title';
    case CREATED_AT = 'created_at';
    case UPDATED_AT = 'updated_at';

    public static function fromString(string $sort): self
    {
        $field = mb_ltrim($sort, '-');

        return match ($field) {
            'published_at' => self::PUBLISHED_AT,
            'title' => self::TITLE,
            'created_at' => self::CREATED_AT,
            'updated_at' => self::UPDATED_AT,
            default => self::PUBLISHED_AT,
        };
    }
}

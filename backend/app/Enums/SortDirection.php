<?php

declare(strict_types=1);

namespace App\Enums;

enum SortDirection: string
{
    case ASC = 'asc';
    case DESC = 'desc';

    public static function fromString(string $sort): self
    {
        return str_starts_with($sort, '-') ? self::DESC : self::ASC;
    }
}

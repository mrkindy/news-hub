<?php

declare(strict_types=1);

namespace App\DTOs;

use Spatie\LaravelData\Data;

final class UserPreferencesData extends Data
{
    public function __construct(
        public ?array $categories = null,
        public ?array $sources = null,
        public ?array $authors = null,
        public ?string $language = null,
        public ?string $theme = null,
    ) {}
}

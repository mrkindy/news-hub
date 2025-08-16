<?php

declare(strict_types=1);

namespace App\Contracts;

interface NewsSourceInterface
{
    public function fetchNews(): array;

    public function getName(): string;
}

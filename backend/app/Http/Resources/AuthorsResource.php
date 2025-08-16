<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;

final class AuthorsResource extends Resource
{
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'data' => $this->resource,
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;

final class SourcesResource extends Resource
{
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'data' => $this->resource,
        ];
    }
}

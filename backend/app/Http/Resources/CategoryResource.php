<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;

final class CategoryResource extends Resource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id ?? $this->resource['id'] ?? null,
            'slug' => $this->slug ?? $this->resource['slug'] ?? null,
            'name' => $this->name ?? $this->resource['name'] ?? null,
        ];
    }
}

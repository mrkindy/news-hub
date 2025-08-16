<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;

final class ArticleResource extends Resource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) ($this->id ?? $this->resource['id'] ?? ''),
            'title' => $this->title ?? $this->resource['title'] ?? '',
            'description' => $this->description ?? $this->resource['description'] ?? '',
            'content' => $this->content ?? $this->resource['content'] ?? '',
            'category' => new CategoryResource($this->whenLoaded('category', $this->category ?? $this->resource['category'] ?? null)),
            'source' => new SourceResource($this->whenLoaded('source', $this->source ?? $this->resource['source'] ?? null)),
            'author' => new AuthorResource($this->whenLoaded('author', $this->author ?? $this->resource['author'] ?? null)),
            'publishedAt' => $this->published_at ?? $this->resource['publishedAt'] ?? null,
            'imageUrl' => $this->image_url ?? $this->resource['imageUrl'] ?? null,
            'url' => $this->url ?? $this->resource['url'] ?? null,
        ];
    }
}

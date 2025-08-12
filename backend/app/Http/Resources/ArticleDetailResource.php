<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Article;
use Illuminate\Http\Request;

final class ArticleDetailResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Article $this */
        return [
            'success' => true,
            'article' => new ArticleResource($this),
            'relatedArticles' => ArticleResource::collection($this->relatedArticles),
        ];
    }
}

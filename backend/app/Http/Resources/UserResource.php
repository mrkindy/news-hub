<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;

final class UserResource extends Resource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'email' => $this->email,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'createdAt' => $this->created_at?->toISOString(),
            'preferences' => $this->when(
                $this->relationLoaded('preferences') && $this->preferences,
                $this->preferences?->preferences
            ),
        ];
    }
}

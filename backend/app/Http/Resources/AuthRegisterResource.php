<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;

final class AuthRegisterResource extends Resource
{
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'user' => new UserResource($this->resource['user']),
            'token' => $this->resource['token'],
        ];
    }
}

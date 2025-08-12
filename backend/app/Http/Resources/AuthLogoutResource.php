<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;

final class AuthLogoutResource extends Resource
{

    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'message' => $this->resource['message'] ?? 'Logged out successfully',
        ];
    }
}

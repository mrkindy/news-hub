<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;

final class AuthLoginResource extends Resource
{
    public static $wrap = null;

    public function __construct(private readonly array $authData)
    {
        parent::__construct($authData);
    }

    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'user' => new UserResource($this->authData['user']),
            'token' => $this->authData['token'],
        ];
    }
}

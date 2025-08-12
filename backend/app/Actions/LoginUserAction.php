<?php

declare(strict_types=1);

namespace App\Actions;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

final class LoginUserAction
{
    public function handle(LoginRequest $request): array
    {
        $user = User::with('preferences')->where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('api-token', ['read', 'write'])->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}

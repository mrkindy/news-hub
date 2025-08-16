<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\PreferencesRepositoryInterface;
use App\DTOs\UserPreferencesData;
use App\Models\UserPreference;

final class PreferencesRepository implements PreferencesRepositoryInterface
{
    public function getByUserId(int $userId): ?UserPreference
    {
        return UserPreference::where('user_id', $userId)->first();
    }

    public function upsertForUser(int $userId, UserPreferencesData $preferences): UserPreference
    {
        return UserPreference::updateOrCreate(
            ['user_id' => $userId],
            ['preferences' => $preferences->toArray()]
        );
    }
}

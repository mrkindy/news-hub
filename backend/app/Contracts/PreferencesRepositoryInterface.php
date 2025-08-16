<?php

declare(strict_types=1);

namespace App\Contracts;

use App\DTOs\UserPreferencesData;
use App\Models\UserPreference;

interface PreferencesRepositoryInterface
{
    public function getByUserId(int $userId): ?UserPreference;

    public function upsertForUser(int $userId, UserPreferencesData $preferences): UserPreference;
}

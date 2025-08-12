<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PreferencesRepositoryInterface;
use App\DTOs\UserPreferencesData;
use App\Http\Requests\UpdatePreferencesRequest;

final class PreferencesService
{
    public function __construct(
        private readonly PreferencesRepositoryInterface $preferencesRepository
    ) {}

    public function getUserPreferences(int $userId): array
    {
        $userPreference = $this->preferencesRepository->getByUserId($userId);

        if (!$userPreference) {
            return [
                'success' => true,
                'data' => [
                    'categories' => [],
                    'sources' => [],
                    'authors' => [],
                    'language' => 'en',
                    'theme' => 'light',
                ],
            ];
        }

        return [
            'success' => true,
            'data' => [
                'id' => $userPreference->id,
                'user_id' => $userPreference->user_id,
                'categories' => $userPreference->preferences['categories'] ?? [],
                'sources' => $userPreference->preferences['sources'] ?? [],
                'authors' => $userPreference->preferences['authors'] ?? [],
                'language' => $userPreference->preferences['language'] ?? 'en',
                'theme' => $userPreference->preferences['theme'] ?? 'light',
                'created_at' => $userPreference->created_at,
                'updated_at' => $userPreference->updated_at,
            ],
        ];
    }

    public function updateUserPreferences(int $userId, UpdatePreferencesRequest $request): array
    {
        $preferencesData = UserPreferencesData::from($request->validated());

        $userPreference = $this->preferencesRepository->upsertForUser($userId, $preferencesData);

        return [
            'id' => $userPreference->id,
            'user_id' => $userPreference->user_id,
            'categories' => $userPreference->preferences['categories'] ?? [],
            'sources' => $userPreference->preferences['sources'] ?? [],
            'authors' => $userPreference->preferences['authors'] ?? [],
            'language' => $userPreference->preferences['language'] ?? 'en',
            'theme' => $userPreference->preferences['theme'] ?? 'light',
            'created_at' => $userPreference->created_at,
            'updated_at' => $userPreference->updated_at,
        ];
    }
}

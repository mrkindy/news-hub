<?php

declare(strict_types=1);

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

final class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/user');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'user' => [
                'id',
                'email',
                'first_name',
                'last_name',
                'createdAt',
            ],
        ]);
        $response->assertJson([
            'success' => true,
            'user' => [
                'id' => (string) $user->id,
                'email' => $user->email,
            ],
        ]);
    }

    public function test_unauthenticated_user_cannot_get_profile(): void
    {
        $response = $this->getJson('/api/v1/user');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_get_preferences(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/user/preferences');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'categories',
                'sources',
                'authors',
                'language',
                'theme',
            ],
        ]);
        $response->assertJson([
            'success' => true,
        ]);
    }

    public function test_unauthenticated_user_cannot_get_preferences(): void
    {
        $response = $this->getJson('/api/v1/user/preferences');

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_update_preferences(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $preferences = [
            'categories' => ['Technology', 'Science'],
            'sources' => ['BBC News', 'CNN'],
            'authors' => ['John Doe'],
            'language' => 'en',
            'theme' => 'dark',
        ];

        $response = $this->putJson('/api/v1/user/preferences', $preferences);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'id',
                'user_id',
                'categories',
                'sources',
                'authors',
                'language',
                'theme',
                'created_at',
                'updated_at',
            ],
        ]);
        $response->assertJson([
            'success' => true,
            'message' => 'Preferences updated successfully',
        ]);
    }

    public function test_unauthenticated_user_cannot_update_preferences(): void
    {
        $preferences = [
            'categories' => ['Technology'],
            'sources' => ['BBC News'],
            'authors' => ['John Doe'],
            'language' => 'en',
            'theme' => 'dark',
        ];

        $response = $this->putJson('/api/v1/user/preferences', $preferences);

        $response->assertStatus(401);
    }

    public function test_update_preferences_allows_empty_request(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/v1/user/preferences', []);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'data',
        ]);
    }

    public function test_update_preferences_validates_arrays(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $preferences = [
            'categories' => 'not-an-array',
            'sources' => 123,
            'authors' => ['John Doe', 123], // invalid item type
            'language' => 'en',
            'theme' => 'dark',
        ];

        $response = $this->putJson('/api/v1/user/preferences', $preferences);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors([
            'categories',
            'sources',
            'authors.1',
        ]);
    }

    public function test_update_preferences_validates_language(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $preferences = [
            'categories' => ['Technology'],
            'sources' => ['BBC News'],
            'authors' => ['John Doe'],
            'language' => 'invalid-language',
            'theme' => 'dark',
        ];

        $response = $this->putJson('/api/v1/user/preferences', $preferences);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['language']);
    }

    public function test_update_preferences_validates_theme(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $preferences = [
            'categories' => ['Technology'],
            'sources' => ['BBC News'],
            'authors' => ['John Doe'],
            'language' => 'en',
            'theme' => 'invalid-theme',
        ];

        $response = $this->putJson('/api/v1/user/preferences', $preferences);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['theme']);
    }
}

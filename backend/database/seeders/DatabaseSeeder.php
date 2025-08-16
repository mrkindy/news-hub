<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

final class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a test user
        User::factory()->create([
            'first_name' => 'Demo',
            'last_name' => 'User',
            'email' => 'demo@example.com',
            'password' => Hash::make('password'),
        ]);

        // Seed news data
        $this->call([
            NewsSeeder::class,
        ]);
    }
}

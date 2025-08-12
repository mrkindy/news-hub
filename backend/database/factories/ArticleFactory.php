<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Author;
use App\Models\Category;
use App\Models\Source;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
final class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'external_id' => fake()->uuid(),
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'content' => fake()->paragraphs(5, true),
            'category_id' => Category::factory(),
            'source_id' => Source::factory(),
            'author_id' => Author::factory(),
            'published_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'image_url' => fake()->imageUrl(),
            'url' => fake()->url(),
        ];
    }
}

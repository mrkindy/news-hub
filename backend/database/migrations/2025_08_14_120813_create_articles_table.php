<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('external_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('source_id')->constrained()->cascadeOnDelete();
            $table->foreignId('author_id')->constrained()->cascadeOnDelete();
            $table->timestamp('published_at');
            $table->text('image_url')->nullable();
            $table->text('url')->nullable();
            $table->timestamps();

            $table->index('external_id');
            $table->index('published_at');
            $table->index(['category_id', 'published_at']);
            $table->index(['source_id', 'published_at']);
            $table->index(['author_id', 'published_at']);

            // Only add fulltext for MySQL
            if (config('database.default') === 'mysql') {
                $table->fullText(['title', 'description', 'content']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\CacheService;
use Illuminate\Console\Command;

class ClearNewsCache extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'news:clear-cache
                          {--type= : Specific cache type to clear (categories, sources, authors, articles, all)}';

    /**
     * The console command description.
     */
    protected $description = 'Clear news application cache';

    public function __construct(
        private readonly CacheService $cacheService
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $type = $this->option('type') ?? 'all';

        $this->info("Clearing {$type} cache...");

        match ($type) {
            'categories' => $this->clearCategories(),
            'sources' => $this->clearSources(),
            'authors' => $this->clearAuthors(),
            'articles' => $this->clearArticles(),
            'filter_options' => $this->clearFilterOptions(),
            'personalized_feed' => $this->clearPersonalizedFeeds(),
            'all' => $this->clearAll(),
            default => $this->error("Unknown cache type: {$type}")
        };

        $this->info('Cache cleared successfully!');

        return Command::SUCCESS;
    }

    private function clearCategories(): void
    {
        $this->cacheService->forget('categories');
        $this->line('✓ Categories cache cleared');
    }

    private function clearSources(): void
    {
        $this->cacheService->forget('sources');
        $this->line('✓ Sources cache cleared');
    }

    private function clearAuthors(): void
    {
        $this->cacheService->forget('authors');
        $this->line('✓ Authors cache cleared');
    }

    private function clearFilterOptions(): void
    {
        $this->cacheService->forget('filter_options');
        $this->line('✓ Filter options cache cleared');
    }

    private function clearArticles(): void
    {
        $this->cacheService->forgetPattern('news_aggregator:articles:*');
        $this->line('✓ Articles cache cleared');
    }

    private function clearPersonalizedFeeds(): void
    {
        $this->cacheService->forgetPattern('news_aggregator:personalized_feed:*');
        $this->line('✓ Personalized feeds cache cleared');
    }

    private function clearAll(): void
    {
        $this->clearCategories();
        $this->clearSources();
        $this->clearAuthors();
        $this->clearFilterOptions();
        $this->clearArticles();
        $this->clearPersonalizedFeeds();
    }
}

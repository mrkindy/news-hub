<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\NewsFetchService;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final class FetchNewsCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'news:fetch
                          {--source= : Fetch from specific source (guardian, nytimes, newsorg)}
                          {--dry-run : Show what would be fetched without saving}';

    /**
     * The console command description.
     */
    protected $description = 'Fetch news articles from external APIs using Strategy Pattern';

    public function __construct(
        private readonly NewsFetchService $newsFetchService
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $startTime = now();

        $this->info('Starting news fetch process...');
        $this->newLine();

        if ($this->option('dry-run')) {
            $this->warn('🔍 DRY RUN MODE - No articles will be saved');
            $this->newLine();
        }

        try {
            $results = $this->newsFetchService->fetchFromAllSources();

            $this->displayResults($results);
            $this->displaySummary($results, $startTime);
            $this->flushCache();

            return Command::SUCCESS;
        } catch (Exception $e) {
            $this->error('❌ Failed to fetch news: '.$e->getMessage());
            Log::error('News fetch command failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return Command::FAILURE;
        }
    }

    private function displayResults(array $results): void
    {
        $this->info('📊 Results by Source:');
        $this->newLine();

        $headers = ['Source', 'Fetched', 'Saved', 'Status'];
        $rows = [];

        foreach ($results['sources'] as $source) {
            $status = isset($source['error'])
                ? "❌ Error: {$source['error']}"
                : '✅ Success';

            $rows[] = [
                $source['source'],
                $source['fetched'],
                $source['saved'],
                $status,
            ];
        }

        $this->table($headers, $rows);
    }

    private function displaySummary(array $results, \Carbon\Carbon $startTime): void
    {
        $this->newLine();
        $this->info('📈 Summary:');
        $this->line("Total articles processed: {$results['total_articles']}");

        $totalSaved = array_sum(array_column($results['sources'], 'saved'));
        $this->line("Total articles saved: {$totalSaved}");

        $totalSources = count($results['sources']);
        $successfulSources = count(array_filter($results['sources'], fn ($s) => ! isset($s['error'])));
        $this->line("Sources processed: {$successfulSources}/{$totalSources}");

        $duration = $startTime->diffForHumans(now(), true);
        $this->line("Execution time: {$duration}");

        if ($totalSaved > 0) {
            $this->newLine();
            $this->info('✅ News fetch completed successfully!');
        } else {
            $this->newLine();
            $this->warn('⚠️ No new articles were saved.');
        }
    }

    private function flushCache(): void
    {
        $this->info('Flushing cache...');
        Cache::flush();
        $this->info('Cache cleared successfully.');
    }
}

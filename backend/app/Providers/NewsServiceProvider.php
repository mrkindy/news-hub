<?php

declare(strict_types=1);

namespace App\Providers;

use App\Console\Commands\ClearNewsCache;
use App\Console\Commands\FetchNewsCommand;
use App\Services\CacheService;
use App\Services\NewsFetchService;
use App\Services\NewsProviders\GuardianNews;
use App\Services\NewsProviders\NewsOrg;
use App\Services\NewsProviders\NTimesNews;
use Illuminate\Support\Collection;
use Illuminate\Support\ServiceProvider;

final class NewsServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Register cache service
        $this->app->singleton(CacheService::class);

        // Register individual strategies
        $this->app->singleton(GuardianNews::class);
        $this->app->singleton(NTimesNews::class);
        $this->app->singleton(NewsOrg::class);

        // Register strategy collection
        $this->app->singleton('news.strategies', function ($app) {
            $strategies = collect();

            // Add strategies if their API keys are configured
            if (config('news.guardian.api_key')) {
                $strategies->push($app->make(GuardianNews::class));
            }

            if (config('news.nytimes.api_key')) {
                $strategies->push($app->make(NTimesNews::class));
            }

            if (config('news.newsorg.api_key')) {
                $strategies->push($app->make(NewsOrg::class));
            }

            return $strategies;
        });

        // Register news fetch service
        $this->app->singleton(NewsFetchService::class, function ($app) {
            return new NewsFetchService(
                $app->make('news.strategies'),
                $app->make(CacheService::class)
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                FetchNewsCommand::class,
                ClearNewsCache::class,
            ]);
        }
    }
}

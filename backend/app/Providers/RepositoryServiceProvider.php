<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\NewsRepositoryInterface;
use App\Contracts\PreferencesRepositoryInterface;
use App\Contracts\TaxonomyRepositoryInterface;
use App\Repositories\NewsRepository;
use App\Repositories\PreferencesRepository;
use App\Repositories\TaxonomyRepository;
use Illuminate\Support\ServiceProvider;

final class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(NewsRepositoryInterface::class, NewsRepository::class);
        $this->app->bind(TaxonomyRepositoryInterface::class, TaxonomyRepository::class);
        $this->app->bind(PreferencesRepositoryInterface::class, PreferencesRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}

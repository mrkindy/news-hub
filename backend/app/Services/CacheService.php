<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;

final class CacheService
{
    /**
     * Cache durations in minutes
     */
    private const CACHE_DURATIONS = [
        'categories' => 60 * 24, // 24 hours
        'sources' => 60 * 24,    // 24 hours
        'authors' => 60 * 12,    // 12 hours
        'filter_options' => 60 * 6, // 6 hours
        'articles' => 5,        // 5 minutes
        'personalized_feed' => 5, // 5 minutes
    ];

    public function remember(string $key, callable $callback, ?int $ttl = null): mixed
    {
        $cacheKey = $this->generateCacheKey($key);
        $duration = $ttl ?? $this->getCacheDuration($key);

        return Cache::remember($cacheKey, $duration, $callback);
    }

    public function forget(string $key): bool
    {
        $cacheKey = $this->generateCacheKey($key);

        return Cache::forget($cacheKey);
    }

    public function forgetPattern(string $pattern): void
    {
        $prefix = config('cache.prefix', '');
        $fullPattern = $prefix ? "{$prefix}:{$pattern}" : $pattern;

        // For Redis cache, use pattern deletion
        if (config('cache.default') === 'redis') {
            $keys = Cache::getRedis()->keys($fullPattern);
            if (!empty($keys)) {
                Cache::getRedis()->del($keys);
            }
        } else {
            // For file cache, we'll need to manually track keys
            // This is a limitation of file-based cache
            Cache::flush();
        }
    }

    public function tags(array $tags): self
    {
        // For Redis/Memcached that support tagging
        if (method_exists(Cache::store(), 'tags')) {
            Cache::tags($tags);
        }

        return $this;
    }

    private function generateCacheKey(string $key): string
    {
        return "news_aggregator:{$key}";
    }

    private function getCacheDuration(string $key): int
    {
        $baseKey = explode(':', $key)[0];

        return self::CACHE_DURATIONS[$baseKey] ?? self::CACHE_DURATIONS['articles'];
    }

    public function getCacheDurations(): array
    {
        return self::CACHE_DURATIONS;
    }
}

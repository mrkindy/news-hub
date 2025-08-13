<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | News API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for external news APIs. API keys should be stored in
    | environment variables for security.
    |
    */

    'guardian' => [
        'api_key' => env('GUARDIAN_API_KEY'),
        'base_url' => 'https://content.guardianapis.com',
    ],

    'nytimes' => [
        'api_key' => env('NYTIMES_API_KEY'),
        'base_url' => 'https://api.nytimes.com/svc/search/v2',
    ],

    'newsorg' => [
        'api_key' => env('NEWSORG_API_KEY'),
        'base_url' => 'https://newsapi.org/v2',
    ],

    'request_timeout' => 30,
    'max_articles_per_source' => 50,
];

<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration values for API defaults, pagination, and behavior.
    |
    */

    'defaults' => [
        'per_page' => 15,
        'max_per_page' => 100,
        'sort' => '-published_at',
    ],

    'pagination' => [
        'page_name' => 'page',
        'per_page_name' => 'per_page',
    ],

    'search' => [
        'min_query_length' => 2,
        'max_query_length' => 500,
    ],

    'cache' => [
        'ttl' => 3600, // 1 hour
        'prefix' => 'newshub_api',
    ],

];

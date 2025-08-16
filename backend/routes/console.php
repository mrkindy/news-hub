<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;


// schedule NewsFetchService command to run every 5 minutes
Schedule::command('fetch:news')
    ->everyFiveMinutes()
    ->onSuccess(function () {
        Log::info('News fetch command executed successfully');
    })
    ->onFailure(function () {
        Log::error('News fetch command failed');
    });

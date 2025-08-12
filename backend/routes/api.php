<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\TaxonomyController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('throttle:100,1')->prefix('v1')->group(function () {

    // Public routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // News routes
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{id}', [NewsController::class, 'show']);

    // Taxonomy routes
    Route::get('/filter-options', [TaxonomyController::class, 'filterOptions']);
    Route::get('/categories', [TaxonomyController::class, 'categories']);
    Route::get('/sources', [TaxonomyController::class, 'sources']);
    Route::get('/authors', [TaxonomyController::class, 'authors']);

    // Protected routes
    Route::middleware(['auth:sanctum'])->group(function () {

        // Auth routes
        Route::prefix('auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });

        // User routes
        Route::prefix('user')->group(function () {
            Route::get('/', [UserController::class, 'show']);
            Route::get('/preferences', [UserController::class, 'preferences']);
            Route::put('/preferences', [UserController::class, 'updatePreferences']);
        });

        // Personalized news
        Route::get('/personalized-feed', [NewsController::class, 'personalizedFeed']);
    });
});

// CSRF cookie endpoint for SPA
Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['message' => 'CSRF cookie set']);
})->middleware(['web']);

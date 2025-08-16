<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Exceptions\NewsProviderException;
use App\Exceptions\ApiConfigurationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception): mixed
    {
        // Handle API requests with consistent JSON responses
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->renderJsonException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    /**
     * Render exception as JSON response with consistent format.
     */
    private function renderJsonException(Request $request, Throwable $exception): JsonResponse
    {
        // Validation errors
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $exception->errors(),
            ], 422);
        }

        // Not found errors
        if ($exception instanceof NotFoundHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found',
                'error' => 'The requested resource could not be found.',
            ], 404);
        }

        // Unauthorized errors
        if ($exception instanceof UnauthorizedHttpException) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'error' => 'Authentication is required to access this resource.',
            ], 401);
        }

        // News Provider errors
        if ($exception instanceof NewsProviderException) {
            return response()->json([
                'success' => false,
                'message' => 'News provider error',
                'error' => $exception->getMessage(),
                'provider' => $exception->getProvider(),
            ], 503); // Service Unavailable
        }

        // API Configuration errors
        if ($exception instanceof ApiConfigurationException) {
            return response()->json([
                'success' => false,
                'message' => 'Configuration error',
                'error' => $exception->getMessage(),
            ], 500);
        }

        // Generic server errors
        $status = 500;
        if ($exception instanceof HttpException) {
            $status = $exception->getStatusCode();
        }

        return response()->json([
            'success' => false,
            'message' => 'Server error',
            'error' => app()->isProduction() ? 'Something went wrong' : $exception->getMessage(),
        ], $status);
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePreferencesRequest;
use App\Http\Resources\UserProfileResponse;
use App\Services\PreferencesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="User",
 *     description="API endpoints for managing user profile and preferences"
 * )
 */
final class UserController extends Controller
{
    public function __construct(
        private readonly PreferencesService $preferencesService
    ) {}

    /**
     * @OA\Get(
     *     path="/api/v1/user",
     *     summary="Get user profile",
     *     description="Retrieve the authenticated user's profile information",
     *     operationId="getUserProfile",
     *     tags={"User"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="User profile retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/UserWithPreferences")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Internal server error")
     *         )
     *     )
     * )
     */
    public function show(Request $request): JsonResponse
    {
        return UserProfileResponse::make($request->user()->load('preferences'))->response();
    }

    /**
     * @OA\Get(
     *     path="/api/v1/user/preferences",
     *     summary="Get user preferences",
     *     description="Retrieve the authenticated user's preferences",
     *     operationId="getUserPreferences",
     *     tags={"User"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\Response(
     *         response=200,
     *         description="User preferences retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/UserPreferences")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Internal server error")
     *         )
     *     )
     * )
     */
    public function preferences(Request $request): JsonResponse
    {
        $preferences = $this->preferencesService->getUserPreferences($request->user()->id);

        return response()->json($preferences);
    }

    /**
     * @OA\Put(
     *     path="/api/v1/user/preferences",
     *     summary="Update user preferences",
     *     description="Update the authenticated user's preferences",
     *     operationId="updateUserPreferences",
     *     tags={"User"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\RequestBody(
     *         required=true,
     *         description="User preferences data",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="categories", type="array", nullable=true, description="Preferred category names",
     *
     *                 @OA\Items(type="string", example="Technology")
     *             ),
     *             @OA\Property(property="sources", type="array", nullable=true, description="Preferred source names",
     *
     *                 @OA\Items(type="string", example="BBC News")
     *             ),
     *             @OA\Property(property="authors", type="array", nullable=true, description="Preferred author names",
     *
     *                 @OA\Items(type="string", example="John Smith")
     *             ),
     *             @OA\Property(property="language", type="string", nullable=true, enum={"en", "es", "fr", "de"}, example="en"),
     *             @OA\Property(property="theme", type="string", nullable=true, enum={"light", "dark"}, example="light")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="User preferences updated successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Preferences updated successfully"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="user_id", type="integer", example=1),
     *                 @OA\Property(property="categories", type="array", @OA\Items(type="string"), example={"Technology"}),
     *                 @OA\Property(property="sources", type="array", @OA\Items(type="string"), example={"BBC News"}),
     *                 @OA\Property(property="authors", type="array", @OA\Items(type="string"), example={"John Smith"}),
     *                 @OA\Property(property="language", type="string", example="en"),
     *                 @OA\Property(property="theme", type="string", example="light"),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z")
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=400,
     *         description="Validation error",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Validation failed"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Unauthenticated")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Internal server error")
     *         )
     *     )
     * )
     */
    public function updatePreferences(UpdatePreferencesRequest $request): JsonResponse
    {
        $preferences = $this->preferencesService->updateUserPreferences(
            $request->user()->id,
            $request
        );

        return response()->json([
            'success' => true,
            'message' => 'Preferences updated successfully',
            'data' => $preferences
        ]);
    }
}

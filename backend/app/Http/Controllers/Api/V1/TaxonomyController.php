<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuthorsResource;
use App\Http\Resources\CategoriesResource;
use App\Http\Resources\FilterOptionsResource;
use App\Http\Resources\SourcesResource;
use App\Services\TaxonomyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Taxonomy",
 *     description="API endpoints for managing categories, sources, authors and filter options"
 * )
 */
final class TaxonomyController extends Controller
{
    public function __construct(
        private readonly TaxonomyService $taxonomyService
    ) {}

    /**
     * @OA\Get(
     *     path="/api/v1/filter-options",
     *     summary="Get all filter options",
     *     description="Retrieve all available filter options including categories, sources and authors with optional search",
     *     operationId="getFilterOptions",
     *     tags={"Taxonomy"},
     *
     *     @OA\Parameter(
     *         name="q",
     *         in="query",
     *         description="Search query to filter results",
     *         required=false,
     *         @OA\Schema(type="string", example="technology")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Filter options retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="categories", type="array", @OA\Items(ref="#/components/schemas/Category")),
     *             @OA\Property(property="sources", type="array", @OA\Items(ref="#/components/schemas/Source")),
     *             @OA\Property(property="authors", type="array", @OA\Items(ref="#/components/schemas/Author"))
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
    public function filterOptions(Request $request): JsonResponse
    {
        $query = $request->query('q');
        return FilterOptionsResource::make($this->taxonomyService->getFilterOptions($query))->response();
    }

    /**
     * @OA\Get(
     *     path="/api/v1/categories",
     *     summary="Get all categories",
     *     description="Retrieve all available news categories with optional search (limit 10 results)",
     *     operationId="getCategories",
     *     tags={"Taxonomy"},
     *
     *     @OA\Parameter(
     *         name="q",
     *         in="query",
     *         description="Search query to filter categories by name",
     *         required=false,
     *         @OA\Schema(type="string", example="technology")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Categories retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Category"))
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
    public function categories(Request $request): JsonResponse
    {
        $query = $request->query('q');
        return CategoriesResource::make($this->taxonomyService->getCategories($query))->response();
    }

    /**
     * @OA\Get(
     *     path="/api/v1/sources",
     *     summary="Get all sources",
     *     description="Retrieve all available news sources with optional search (limit 10 results)",
     *     operationId="getSources",
     *     tags={"Taxonomy"},
     *
     *     @OA\Parameter(
     *         name="q",
     *         in="query",
     *         description="Search query to filter sources by name",
     *         required=false,
     *         @OA\Schema(type="string", example="bbc")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Sources retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Source"))
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
    public function sources(Request $request): JsonResponse
    {
        $query = $request->query('q');
        return SourcesResource::make($this->taxonomyService->getSources($query))->response();
    }

    /**
     * @OA\Get(
     *     path="/api/v1/authors",
     *     summary="Get all authors",
     *     description="Retrieve all available news authors with optional search (limit 10 results)",
     *     operationId="getAuthors",
     *     tags={"Taxonomy"},
     *
     *     @OA\Parameter(
     *         name="q",
     *         in="query",
     *         description="Search query to filter authors by name",
     *         required=false,
     *         @OA\Schema(type="string", example="john")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Authors retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Author"))
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
    public function authors(Request $request): JsonResponse
    {
        $query = $request->query('q');
        return AuthorsResource::make($this->taxonomyService->getAuthors($query))->response();
    }
}

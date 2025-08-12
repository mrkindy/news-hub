<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleDetailResource;
use App\Http\Resources\PaginatedArticleResource;
use App\Services\NewsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="News",
 *     description="API endpoints for managing news articles"
 * )
 */
final class NewsController extends Controller
{
    public function __construct(
        private readonly NewsService $newsService
    ) {}

    /**
     * @OA\Get(
     *     path="/api/v1/news",
     *     summary="Get paginated news articles",
     *     description="Retrieve a paginated list of news articles with optional filtering",
     *     operationId="getNews",
     *     tags={"News"},
     *
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *
     *         @OA\Schema(type="integer", minimum=1, example=1)
     *     ),
     *
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Items per page",
     *         required=false,
     *
     *         @OA\Schema(type="integer", minimum=1, maximum=100, example=15)
     *     ),
     *
     *     @OA\Parameter(
     *         name="q",
     *         in="query",
     *         description="Search query (searches in title, description, and content)",
     *         required=false,
     *
     *         @OA\Schema(type="string", example="technology")
     *     ),
     *
     *     @OA\Parameter(
     *         name="categories",
     *         in="query",
     *         description="Filter by category slugs (comma separated)",
     *         required=false,
     *
     *         @OA\Schema(type="array", @OA\Items(type="string"), example={"technology", "science"})
     *     ),
     *
     *     @OA\Parameter(
     *         name="sources",
     *         in="query",
     *         description="Filter by source slugs (comma separated)",
     *         required=false,
     *
     *         @OA\Schema(type="array", @OA\Items(type="string"), example={"bbc-news", "cnn"})
     *     ),
     *
     *     @OA\Parameter(
     *         name="authors",
     *         in="query",
     *         description="Filter by author slugs (comma separated)",
     *         required=false,
     *
     *         @OA\Schema(type="array", @OA\Items(type="string"), example={"john-smith", "jane-doe"})
     *     ),
     *
     *     @OA\Parameter(
     *         name="date_from",
     *         in="query",
     *         description="Filter articles from this date (YYYY-MM-DD)",
     *         required=false,
     *
     *         @OA\Schema(type="string", format="date", example="2023-01-01")
     *     ),
     *
     *     @OA\Parameter(
     *         name="date_to",
     *         in="query",
     *         description="Filter articles until this date (YYYY-MM-DD)",
     *         required=false,
     *
     *         @OA\Schema(type="string", format="date", example="2023-12-31")
     *     ),
     *
     *     @OA\Parameter(
     *         name="sort_field",
     *         in="query",
     *         description="Sort field",
     *         required=false,
     *
     *         @OA\Schema(type="string", enum={"title", "published_at", "created_at", "updated_at"}, example="published_at")
     *     ),
     *
     *     @OA\Parameter(
     *         name="sort_direction",
     *         in="query",
     *         description="Sort direction",
     *         required=false,
     *
     *         @OA\Schema(type="string", enum={"asc", "desc"}, example="desc")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Articles retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/PaginatedArticleList")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=400,
     *         description="Bad request",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Invalid request parameters")
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
    public function index(Request $request): JsonResponse
    {
        $articles = $this->newsService->getArticles($request->all());

        return PaginatedArticleResource::make($articles)->response();
    }

    /**
     * @OA\Get(
     *     path="/api/v1/news/{id}",
     *     summary="Get single news article",
     *     description="Retrieve a single news article with related articles",
     *     operationId="getArticle",
     *     tags={"News"},
     *
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Article ID",
     *         required=true,
     *
     *         @OA\Schema(type="string", example="123")
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Article retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/ArticleDetail")
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=404,
     *         description="Article not found",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Article not found")
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
    public function show(string $id): JsonResponse
    {
        $article = $this->newsService->getArticle($id);

        if (! $article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found',
            ], 404);
        }

        return ArticleDetailResource::make($article->load('author', 'source', 'category'))->response();
    }

    /**
     * @OA\Get(
     *     path="/api/v1/personalized-feed",
     *     summary="Get personalized news feed",
     *     description="Retrieve a personalized news feed based on user preferences",
     *     operationId="getPersonalizedFeed",
     *     tags={"News"},
     *     security={{"sanctum":{}}},
     *
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number",
     *         required=false,
     *
     *         @OA\Schema(type="integer", minimum=1, example=1)
     *     ),
     *
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Items per page",
     *         required=false,
     *
     *         @OA\Schema(type="integer", minimum=1, maximum=100, example=15)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Personalized feed retrieved successfully",
     *
     *         @OA\JsonContent(
     *
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/PaginatedArticleList")
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
    public function personalizedFeed(Request $request): JsonResponse
    {
        $articles = $this->newsService->getPersonalizedFeed($request->user()->id, $request->all());

        return PaginatedArticleResource::make($articles)->response();
    }
}

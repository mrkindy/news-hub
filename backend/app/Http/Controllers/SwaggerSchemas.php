<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="News Hub API",
 *     description="API documentation for News Hub Application",
 *     @OA\Contact(
 *         email="admin@mrkindy.com"
 *     )
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="API Server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     description="Enter JWT Bearer token"
 * )
 */

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="User",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="first_name", type="string", example="John"),
 *     @OA\Property(property="last_name", type="string", example="Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
 *     @OA\Property(property="email_verified_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Category",
 *     type="object",
 *     title="Category",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Technology"),
 *     @OA\Property(property="slug", type="string", example="technology"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Source",
 *     type="object",
 *     title="Source",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="TechCrunch"),
 *     @OA\Property(property="slug", type="string", example="techcrunch"),
 *     @OA\Property(property="url", type="string", format="url", example="https://techcrunch.com"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Author",
 *     type="object",
 *     title="Author",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Jane Smith"),
 *     @OA\Property(property="slug", type="string", example="jane-smith"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="Article",
 *     type="object",
 *     title="Article",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="external_id", type="string", example="ext-123"),
 *     @OA\Property(property="title", type="string", example="Breaking News Title"),
 *     @OA\Property(property="description", type="string", example="Article description"),
 *     @OA\Property(property="content", type="string", example="Full article content"),
 *     @OA\Property(property="image_url", type="string", format="url", nullable=true),
 *     @OA\Property(property="url", type="string", format="url"),
 *     @OA\Property(property="published_at", type="string", format="date-time"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 *     @OA\Property(property="category", ref="#/components/schemas/Category"),
 *     @OA\Property(property="source", ref="#/components/schemas/Source"),
 *     @OA\Property(property="author", ref="#/components/schemas/Author")
 * )
 */

/**
 * @OA\Schema(
 *     schema="UserPreferences",
 *     type="object",
 *     title="UserPreferences",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(
 *         property="preferred_sources",
 *         type="array",
 *         @OA\Items(type="string"),
 *         example={"bbc-news", "cnn"}
 *     ),
 *     @OA\Property(
 *         property="preferred_categories",
 *         type="array",
 *         @OA\Items(type="string"),
 *         example={"technology", "science"}
 *     ),
 *     @OA\Property(
 *         property="preferred_authors",
 *         type="array",
 *         @OA\Items(type="string"),
 *         example={"jane-smith", "john-doe"}
 *     ),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="PaginationMeta",
 *     type="object",
 *     title="PaginationMeta",
 *     @OA\Property(property="current_page", type="integer", example=1),
 *     @OA\Property(property="from", type="integer", example=1),
 *     @OA\Property(property="last_page", type="integer", example=10),
 *     @OA\Property(property="per_page", type="integer", example=15),
 *     @OA\Property(property="to", type="integer", example=15),
 *     @OA\Property(property="total", type="integer", example=150)
 * )
 */

/**
 * @OA\Schema(
 *     schema="PaginationLinks",
 *     type="object",
 *     title="PaginationLinks",
 *     @OA\Property(property="first", type="string", format="url"),
 *     @OA\Property(property="last", type="string", format="url"),
 *     @OA\Property(property="prev", type="string", format="url", nullable=true),
 *     @OA\Property(property="next", type="string", format="url", nullable=true)
 * )
 */

/**
 * @OA\Schema(
 *     schema="ErrorResponse",
 *     type="object",
 *     title="ErrorResponse",
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Error message"),
 *     @OA\Property(property="errors", type="object", nullable=true)
 * )
 */

/**
 * @OA\Schema(
 *     schema="UserWithPreferences",
 *     type="object",
 *     title="UserWithPreferences",
 *     allOf={
 *         @OA\Schema(ref="#/components/schemas/User")
 *     },
 *     @OA\Property(property="preferences", ref="#/components/schemas/UserPreferences")
 * )
 */

/**
 * @OA\Schema(
 *     schema="PaginatedArticleList",
 *     type="object",
 *     title="PaginatedArticleList",
 *     @OA\Property(
 *         property="data",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/Article")
 *     ),
 *     @OA\Property(property="links", ref="#/components/schemas/PaginationLinks"),
 *     @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta")
 * )
 */

/**
 * @OA\Schema(
 *     schema="ArticleDetail",
 *     type="object",
 *     title="ArticleDetail",
 *     allOf={
 *         @OA\Schema(ref="#/components/schemas/Article")
 *     },
 *     @OA\Property(
 *         property="related_articles",
 *         type="array",
 *         @OA\Items(ref="#/components/schemas/Article")
 *     )
 * )
 */

/**
 * @OA\Schema(
 *     schema="ValidationErrorResponse",
 *     type="object",
 *     title="ValidationErrorResponse",
 *     @OA\Property(property="message", type="string", example="The given data was invalid."),
 *     @OA\Property(
 *         property="errors",
 *         type="object",
 *         @OA\AdditionalProperties(
 *             type="array",
 *             @OA\Items(type="string")
 *         )
 *     )
 * )
 */
final class SwaggerSchemas
{
    // This class only contains schema definitions
}

<?php

declare(strict_types=1);

namespace App\Http\Schemas;

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="User",
 *     description="User model",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="first_name", type="string", example="John"),
 *     @OA\Property(property="last_name", type="string", example="Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john.doe@example.com"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z")
 * )
 *
 * @OA\Schema(
 *     schema="Category",
 *     type="object",
 *     title="Category",
 *     description="News category model",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Technology"),
 *     @OA\Property(property="slug", type="string", example="technology"),
 *     @OA\Property(property="description", type="string", nullable=true, example="Technology related news"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z")
 * )
 *
 * @OA\Schema(
 *     schema="Source",
 *     type="object",
 *     title="Source",
 *     description="News source model",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="BBC News"),
 *     @OA\Property(property="slug", type="string", example="bbc-news"),
 *     @OA\Property(property="url", type="string", format="url", nullable=true, example="https://www.bbc.com/news"),
 *     @OA\Property(property="description", type="string", nullable=true, example="British Broadcasting Corporation news"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z")
 * )
 *
 * @OA\Schema(
 *     schema="Author",
 *     type="object",
 *     title="Author",
 *     description="News author model",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Smith"),
 *     @OA\Property(property="slug", type="string", example="john-smith"),
 *     @OA\Property(property="bio", type="string", nullable=true, example="Technology journalist with 10 years of experience"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z")
 * )
 *
 * @OA\Schema(
 *     schema="Article",
 *     type="object",
 *     title="Article",
 *     description="News article model",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="external_id", type="string", nullable=true, example="ext_123456"),
 *     @OA\Property(property="title", type="string", example="Breaking Technology News"),
 *     @OA\Property(property="description", type="string", nullable=true, example="Latest updates in the technology world"),
 *     @OA\Property(property="content", type="string", nullable=true, example="Full article content goes here..."),
 *     @OA\Property(property="image_url", type="string", format="url", nullable=true, example="https://example.com/image.jpg"),
 *     @OA\Property(property="url", type="string", format="url", example="https://example.com/article/123"),
 *     @OA\Property(property="published_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="category", ref="#/components/schemas/Category"),
 *     @OA\Property(property="source", ref="#/components/schemas/Source"),
 *     @OA\Property(property="author", ref="#/components/schemas/Author")
 * )
 *
 * @OA\Schema(
 *     schema="ArticleDetail",
 *     type="object",
 *     title="Article Detail",
 *     description="Detailed article model with related articles",
 *     allOf={
 *         @OA\Schema(ref="#/components/schemas/Article"),
 *         @OA\Schema(
 *
 *             @OA\Property(property="related_articles", type="array", @OA\Items(ref="#/components/schemas/Article"))
 *         )
 *     }
 * )
 *
 * @OA\Schema(
 *     schema="UserPreferences",
 *     type="object",
 *     title="User Preferences",
 *     description="User preferences model",
 *
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="categories", type="array", nullable=true, @OA\Items(ref="#/components/schemas/Category")),
 *     @OA\Property(property="sources", type="array", nullable=true, @OA\Items(ref="#/components/schemas/Source")),
 *     @OA\Property(property="authors", type="array", nullable=true, @OA\Items(ref="#/components/schemas/Author")),
 *     @OA\Property(property="language", type="string", nullable=true, enum={"en", "es", "fr", "de"}, example="en"),
 *     @OA\Property(property="theme", type="string", nullable=true, enum={"light", "dark"}, example="light"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2023-01-01T00:00:00.000000Z")
 * )
 *
 * @OA\Schema(
 *     schema="UserWithPreferences",
 *     type="object",
 *     title="User with Preferences",
 *     description="User model with preferences",
 *     allOf={
 *         @OA\Schema(ref="#/components/schemas/User"),
 *         @OA\Schema(
 *
 *             @OA\Property(property="preferences", ref="#/components/schemas/UserPreferences")
 *         )
 *     }
 * )
 *
 * @OA\Schema(
 *     schema="PaginatedArticleList",
 *     type="object",
 *     title="Paginated Article List",
 *     description="Paginated list of articles",
 *
 *     @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Article")),
 *     @OA\Property(property="links", type="object",
 *         @OA\Property(property="first", type="string", format="url", nullable=true, example="http://localhost:8000/api/v1/news?page=1"),
 *         @OA\Property(property="last", type="string", format="url", nullable=true, example="http://localhost:8000/api/v1/news?page=10"),
 *         @OA\Property(property="prev", type="string", format="url", nullable=true, example="http://localhost:8000/api/v1/news?page=1"),
 *         @OA\Property(property="next", type="string", format="url", nullable=true, example="http://localhost:8000/api/v1/news?page=3")
 *     ),
 *     @OA\Property(property="meta", type="object",
 *         @OA\Property(property="current_page", type="integer", example=2),
 *         @OA\Property(property="from", type="integer", example=16),
 *         @OA\Property(property="last_page", type="integer", example=10),
 *         @OA\Property(property="path", type="string", example="http://localhost:8000/api/v1/news"),
 *         @OA\Property(property="per_page", type="integer", example=15),
 *         @OA\Property(property="to", type="integer", example=30),
 *         @OA\Property(property="total", type="integer", example=150)
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="ValidationError",
 *     type="object",
 *     title="Validation Error",
 *     description="Validation error response",
 *
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="The given data was invalid."),
 *     @OA\Property(property="errors", type="object",
 *         @OA\Property(property="field_name", type="array", @OA\Items(type="string", example="The field name is required."))
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="ErrorResponse",
 *     type="object",
 *     title="Error Response",
 *     description="Generic error response",
 *
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="An error occurred")
 * )
 */
final class SwaggerSchemas
{
    // This class exists only to hold Swagger annotations
}

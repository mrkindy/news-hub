<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Source extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'external_id',
    ];

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}

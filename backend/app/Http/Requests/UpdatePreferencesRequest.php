<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class UpdatePreferencesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'categories' => ['nullable', 'array'],
            'categories.*' => ['string'],

            'sources' => ['nullable', 'array'],
            'sources.*' => ['string'],

            'authors' => ['nullable', 'array'],
            'authors.*' => ['string'],

            'language' => ['nullable', 'string', 'in:en,es,fr,de'],
            'theme' => ['nullable', 'string', 'in:light,dark'],
        ];
    }
}

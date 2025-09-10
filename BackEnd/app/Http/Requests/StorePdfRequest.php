<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePdfRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'cover' => 'nullable|array',
            'header' => 'nullable|array',
            'footer' => 'nullable|array',
            'background_image' => 'nullable|array',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'PDF name is required.',
            'name.string' => 'PDF name must be a string.',
            'name.max' => 'PDF name cannot exceed 255 characters.',
        ];
    }
}

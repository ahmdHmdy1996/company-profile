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
            'cover' => 'nullable|json',
            'header' => 'nullable|json',
            'footer' => 'nullable|json',
            'background_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max
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
            'cover.json' => 'Cover content must be valid JSON.',
            'header.json' => 'Header content must be valid JSON.',
            'footer.json' => 'Footer content must be valid JSON.',
            'background_image.image' => 'Background image must be a valid image file.',
            'background_image.mimes' => 'Background image must be of type: jpeg, png, jpg, gif, or webp.',
            'background_image.max' => 'Background image size cannot exceed 10MB.',
        ];
    }
}

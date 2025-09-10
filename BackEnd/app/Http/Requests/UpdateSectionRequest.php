<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSectionRequest extends FormRequest
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
            'data' => 'sometimes|required|array',
            'order' => 'sometimes|integer|min:0',
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
            'data.required' => 'Section data is required.',
            'data.array' => 'Section data must be an array.',
            'order.integer' => 'Order must be an integer.',
            'order.min' => 'Order must be at least 0.',
        ];
    }
}

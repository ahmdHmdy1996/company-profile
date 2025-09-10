<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePageRequest extends FormRequest
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
            'pdf_id' => 'required|exists:pdfs,id',
            'has_header' => 'required|boolean',
            'has_footer' => 'required|boolean',
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer|min:0',
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
            'pdf_id.required' => 'PDF ID is required.',
            'pdf_id.exists' => 'The selected PDF does not exist.',
            'has_header.required' => 'Header PDF ID is required.',
            'has_header.exists' => 'The selected header PDF does not exist.',
            'has_footer.required' => 'Footer PDF ID is required.',
            'has_footer.exists' => 'The selected footer PDF does not exist.',
            'title.required' => 'Page title is required.',
            'title.string' => 'Page title must be a string.',
            'title.max' => 'Page title cannot exceed 255 characters.',
            'order.integer' => 'Order must be an integer.',
            'order.min' => 'Order must be at least 0.',
        ];
    }
}

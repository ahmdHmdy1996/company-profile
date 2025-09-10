<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttachmentRequest extends FormRequest
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
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,webp,pdf,doc,docx|max:10240', // 10MB
            'pdf_id' => 'required|exists:pdfs,id',
            'order' => 'nullable|integer|min:0'
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
            'file.required' => 'File is required.',
            'file.file' => 'The uploaded file is not valid.',
            'file.mimes' => 'File must be of type: jpeg, png, jpg, gif, webp, pdf, doc, docx.',
            'file.max' => 'File size cannot exceed 10MB.',
            'pdf_id.required' => 'PDF ID is required.',
            'pdf_id.exists' => 'The selected PDF does not exist.',
            'order.integer' => 'Order must be an integer.',
            'order.min' => 'Order must be at least 0.',
        ];
    }
}

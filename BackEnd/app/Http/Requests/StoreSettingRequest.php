<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSettingRequest extends FormRequest
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
            'company_name' => 'nullable|string|max:255',
            'company_email' => 'nullable|email|max:255',
            'company_phone' => 'nullable|string|max:50',
            'company_website' => 'nullable|url|max:255',
            'company_address' => 'nullable|string',
            'company_description' => 'nullable|string',
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
            'company_name.string' => 'Company name must be a string.',
            'company_name.max' => 'Company name cannot exceed 255 characters.',
            'company_email.email' => 'Please provide a valid email address.',
            'company_email.max' => 'Email cannot exceed 255 characters.',
            'company_phone.string' => 'Phone number must be a string.',
            'company_phone.max' => 'Phone number cannot exceed 50 characters.',
            'company_website.url' => 'Please provide a valid website URL.',
            'company_website.max' => 'Website URL cannot exceed 255 characters.',
            'company_address.string' => 'Address must be a string.',
            'company_description.string' => 'Description must be a string.',
        ];
    }
}

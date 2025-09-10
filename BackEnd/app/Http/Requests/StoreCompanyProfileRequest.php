<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyProfileRequest extends FormRequest
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
            'template_id' => 'required|string|max:255',
            'name' => 'nullable|string|max:255|min:2',
            'description' => 'nullable|string|max:1000',
            'data' => 'required|array',
            'data.sections' => 'sometimes|array|max:20',
            'data.sections.*.name' => 'sometimes|string|max:255',
            'data.sections.*.templateId' => 'sometimes|string|max:255',
            'data.sections.*.pages' => 'sometimes|array|max:50',
            'data.sections.*.pages.*.content' => 'sometimes|array',
            'data.logoImage' => 'sometimes|string|max:2000000',
            'data.backgroundImage' => 'sometimes|array|max:10',
            'data.backgroundImage.*' => 'sometimes|string|max:2000000',
            'data.companyName' => 'sometimes|array|max:10',
            'data.companyName.*' => 'sometimes|string|max:255',
            'data.companyDescription' => 'sometimes|array|max:10',
            'data.companyDescription.*' => 'sometimes|string|max:2000',
            'data.contactInfo' => 'sometimes|array',
            'data.contactInfo.email' => 'sometimes|email|max:255',
            'data.contactInfo.phone' => 'sometimes|string|max:50',
            'data.contactInfo.address' => 'sometimes|string|max:500',
            'data.contactInfo.website' => 'sometimes|url|max:255',
            'data.socialMedia' => 'sometimes|array',
            'data.socialMedia.*.platform' => 'sometimes|string|max:100',
            'data.socialMedia.*.url' => 'sometimes|url|max:255',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'template_id.required' => 'Template ID is required.',
            'name.min' => 'Profile name must be at least 2 characters.',
            'name.max' => 'Profile name cannot exceed 255 characters.',
            'description.max' => 'Description cannot exceed 1000 characters.',
            'data.required' => 'Profile data is required.',
            'data.sections.max' => 'Maximum 20 sections allowed.',
            'data.sections.*.pages.max' => 'Maximum 50 pages allowed per section.',
            'data.companyName.max' => 'Company name cannot exceed 255 characters.',
            'data.companyDescription.max' => 'Company description cannot exceed 2000 characters.',
            'data.contactInfo.email.email' => 'Please provide a valid email address.',
            'data.contactInfo.website.url' => 'Please provide a valid website URL.',
            'data.socialMedia.*.url.url' => 'Please provide a valid social media URL.',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'template_id' => 'template ID',
            'data.companyName' => 'company name',
            'data.companyDescription' => 'company description',
            'data.contactInfo.email' => 'email address',
            'data.contactInfo.phone' => 'phone number',
            'data.contactInfo.address' => 'address',
            'data.contactInfo.website' => 'website URL',
        ];
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompanySetting;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;

class CompanySettingController extends Controller
{
    /**
     * Get company settings for a specific company profile
     */
    public function show($companyProfileId): JsonResponse
    {
        $companySetting = CompanySetting::where('company_profile_id', $companyProfileId)->first();
        
        if (!$companySetting) {
            return response()->json([
                'success' => false,
                'message' => 'Company settings not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $companySetting
        ]);
    }
    
    /**
     * Store or update company settings
     */
    public function store(Request $request, $companyProfileId): JsonResponse
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'company_email' => 'nullable|email|max:255',
            'company_phone' => 'nullable|string|max:20',
            'company_website' => 'nullable|url|max:255',
            'company_address' => 'nullable|string|max:500',
            'company_description' => 'nullable|string|max:1000'
        ]);
        
        // Check if company profile exists
        $companyProfile = CompanyProfile::find($companyProfileId);
        if (!$companyProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile not found'
            ], 404);
        }
        
        $companySetting = CompanySetting::updateOrCreate(
            ['company_profile_id' => $companyProfileId],
            $request->only([
                'company_name',
                'company_email', 
                'company_phone',
                'company_website',
                'company_address',
                'company_description'
            ])
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Company settings saved successfully',
            'data' => $companySetting
        ]);
    }
}

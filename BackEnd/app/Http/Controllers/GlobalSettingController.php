<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GlobalSetting;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;

class GlobalSettingController extends Controller
{
    /**
     * Get global settings for a specific company profile
     */
    public function show($companyProfileId): JsonResponse
    {
        $globalSetting = GlobalSetting::where('company_profile_id', $companyProfileId)->first();
        
        if (!$globalSetting) {
            return response()->json([
                'success' => false,
                'message' => 'Global settings not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $globalSetting
        ]);
    }
    
    /**
     * Store or update global settings
     */
    public function store(Request $request, $companyProfileId): JsonResponse
    {
        $request->validate([
            'header_logo_path' => 'nullable|string|max:255',
            'show_header_logo' => 'nullable|boolean',
            'show_footer_email' => 'nullable|boolean',
            'show_footer_phone' => 'nullable|boolean',
            'show_footer_page_number' => 'nullable|boolean',
            'footer_email' => 'nullable|email|max:255',
            'footer_phone' => 'nullable|string|max:20'
        ]);
        
        // Check if company profile exists
        $companyProfile = CompanyProfile::find($companyProfileId);
        if (!$companyProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile not found'
            ], 404);
        }
        
        $globalSetting = GlobalSetting::updateOrCreate(
            ['company_profile_id' => $companyProfileId],
            $request->only([
                'header_logo_path',
                'show_header_logo',
                'show_footer_email',
                'show_footer_phone',
                'show_footer_page_number',
                'footer_email',
                'footer_phone'
            ])
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Global settings saved successfully',
            'data' => $globalSetting
        ]);
    }
}

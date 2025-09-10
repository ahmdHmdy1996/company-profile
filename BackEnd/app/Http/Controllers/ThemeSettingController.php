<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ThemeSetting;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;

class ThemeSettingController extends Controller
{
    /**
     * Get theme settings for a specific company profile
     */
    public function show($companyProfileId): JsonResponse
    {
        $themeSetting = ThemeSetting::where('company_profile_id', $companyProfileId)->first();
        
        if (!$themeSetting) {
            return response()->json([
                'success' => false,
                'message' => 'Theme settings not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $themeSetting
        ]);
    }
    
    /**
     * Store or update theme settings
     */
    public function store(Request $request, $companyProfileId): JsonResponse
    {
        $request->validate([
            'selected_theme' => 'required|string|max:50',
            'primary_color' => 'nullable|string|max:7',
            'secondary_color' => 'nullable|string|max:7',
            'accent_color' => 'nullable|string|max:7',
            'background_color' => 'nullable|string|max:7'
        ]);
        
        // Check if company profile exists
        $companyProfile = CompanyProfile::find($companyProfileId);
        if (!$companyProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile not found'
            ], 404);
        }
        
        $themeSetting = ThemeSetting::updateOrCreate(
            ['company_profile_id' => $companyProfileId],
            $request->only([
                'selected_theme',
                'primary_color',
                'secondary_color',
                'accent_color',
                'background_color'
            ])
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Theme settings saved successfully',
            'data' => $themeSetting
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BackgroundSetting;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;

class BackgroundSettingController extends Controller
{
    /**
     * Get background settings for a specific company profile
     */
    public function show($companyProfileId): JsonResponse
    {
        $backgroundSetting = BackgroundSetting::where('company_profile_id', $companyProfileId)->first();
        
        if (!$backgroundSetting) {
            return response()->json([
                'success' => false,
                'message' => 'Background settings not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $backgroundSetting
        ]);
    }
    
    /**
     * Store or update background settings
     */
    public function store(Request $request, $companyProfileId): JsonResponse
    {
        $request->validate([
            'default_background_color' => 'nullable|string|max:7',
            'background_image_path' => 'nullable|string|max:255',
            'background_opacity' => 'nullable|numeric|min:0|max:1',
            'background_repeat' => 'nullable|string|in:no-repeat,repeat,repeat-x,repeat-y'
        ]);
        
        // Check if company profile exists
        $companyProfile = CompanyProfile::find($companyProfileId);
        if (!$companyProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile not found'
            ], 404);
        }
        
        $backgroundSetting = BackgroundSetting::updateOrCreate(
            ['company_profile_id' => $companyProfileId],
            $request->only([
                'default_background_color',
                'background_image_path',
                'background_opacity',
                'background_repeat'
            ])
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Background settings saved successfully',
            'data' => $backgroundSetting
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PageContent;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;

class PageContentController extends Controller
{
    /**
     * Get all page contents for a specific company profile
     */
    public function index($companyProfileId): JsonResponse
    {
        $pageContents = PageContent::where('company_profile_id', $companyProfileId)
            ->orderBy('order')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $pageContents
        ]);
    }
    
    /**
     * Get page content by type for a specific company profile
     */
    public function show($companyProfileId, $pageType): JsonResponse
    {
        $pageContent = PageContent::where('company_profile_id', $companyProfileId)
            ->where('page_type', $pageType)
            ->first();
        
        if (!$pageContent) {
            return response()->json([
                'success' => false,
                'message' => 'Page content not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $pageContent
        ]);
    }
    
    /**
     * Store or update page content
     */
    public function store(Request $request, $companyProfileId): JsonResponse
    {
        $request->validate([
            'page_type' => 'required|string|in:about_us,our_staff,our_clients,our_services,our_projects',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'styles' => 'nullable|array',
            'is_enabled' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0'
        ]);
        
        // Check if company profile exists
        $companyProfile = CompanyProfile::find($companyProfileId);
        if (!$companyProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile not found'
            ], 404);
        }
        
        $pageContent = PageContent::updateOrCreate(
            [
                'company_profile_id' => $companyProfileId,
                'page_type' => $request->page_type
            ],
            $request->only([
                'title',
                'content',
                'styles',
                'is_enabled',
                'order'
            ])
        );
        
        return response()->json([
            'success' => true,
            'message' => 'Page content saved successfully',
            'data' => $pageContent
        ]);
    }
    
    /**
     * Delete page content
     */
    public function destroy($companyProfileId, $pageType): JsonResponse
    {
        $pageContent = PageContent::where('company_profile_id', $companyProfileId)
            ->where('page_type', $pageType)
            ->first();
        
        if (!$pageContent) {
            return response()->json([
                'success' => false,
                'message' => 'Page content not found'
            ], 404);
        }
        
        $pageContent->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Page content deleted successfully'
        ]);
    }
}

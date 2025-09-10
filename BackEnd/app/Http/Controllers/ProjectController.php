<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    /**
     * Get all projects for a specific company profile
     */
    public function index($companyProfileId): JsonResponse
    {
        $projects = Project::where('company_profile_id', $companyProfileId)
            ->orderBy('order')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }
    
    /**
     * Get a specific project
     */
    public function show($companyProfileId, $id): JsonResponse
    {
        $project = Project::where('company_profile_id', $companyProfileId)
            ->where('id', $id)
            ->first();
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $project
        ]);
    }
    
    /**
     * Store a new project
     */
    public function store(Request $request, $companyProfileId): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_path' => 'nullable|string|max:255',
            'current_page' => 'nullable|integer|min:1',
            'total_pages' => 'nullable|integer|min:1',
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
        
        $project = Project::create([
            'company_profile_id' => $companyProfileId,
            ...$request->only([
                'title',
                'subtitle',
                'image_path',
                'current_page',
                'total_pages',
                'order'
            ])
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project
        ], 201);
    }
    
    /**
     * Update a project
     */
    public function update(Request $request, $companyProfileId, $id): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image_path' => 'nullable|string|max:255',
            'current_page' => 'nullable|integer|min:1',
            'total_pages' => 'nullable|integer|min:1',
            'order' => 'nullable|integer|min:0'
        ]);
        
        $project = Project::where('company_profile_id', $companyProfileId)
            ->where('id', $id)
            ->first();
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }
        
        $project->update($request->only([
            'title',
            'subtitle',
            'image_path',
            'current_page',
            'total_pages',
            'order'
        ]));
        
        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project
        ]);
    }
    
    /**
     * Delete a project
     */
    public function destroy($companyProfileId, $id): JsonResponse
    {
        $project = Project::where('company_profile_id', $companyProfileId)
            ->where('id', $id)
            ->first();
        
        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }
        
        $project->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully'
        ]);
    }
}

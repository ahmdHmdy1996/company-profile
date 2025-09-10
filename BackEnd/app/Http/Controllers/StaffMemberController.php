<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StaffMember;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;

class StaffMemberController extends Controller
{
    /**
     * Get all staff members for a specific company profile
     */
    public function index($companyProfileId): JsonResponse
    {
        $staffMembers = StaffMember::where('company_profile_id', $companyProfileId)
            ->orderBy('order')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $staffMembers
        ]);
    }
    
    /**
     * Get a specific staff member
     */
    public function show($companyProfileId, $id): JsonResponse
    {
        $staffMember = StaffMember::where('company_profile_id', $companyProfileId)
            ->where('id', $id)
            ->first();
        
        if (!$staffMember) {
            return response()->json([
                'success' => false,
                'message' => 'Staff member not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $staffMember
        ]);
    }
    
    /**
     * Store a new staff member
     */
    public function store(Request $request, $companyProfileId): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'image_path' => 'nullable|string|max:255',
            'type' => 'required|string|in:CEO,Manager,Staff,Junior Staff',
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
        
        $staffMember = StaffMember::create([
            'company_profile_id' => $companyProfileId,
            ...$request->only([
                'name',
                'position',
                'image_path',
                'type',
                'order'
            ])
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Staff member created successfully',
            'data' => $staffMember
        ], 201);
    }
    
    /**
     * Update a staff member
     */
    public function update(Request $request, $companyProfileId, $id): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'image_path' => 'nullable|string|max:255',
            'type' => 'required|string|in:CEO,Manager,Staff,Junior Staff',
            'order' => 'nullable|integer|min:0'
        ]);
        
        $staffMember = StaffMember::where('company_profile_id', $companyProfileId)
            ->where('id', $id)
            ->first();
        
        if (!$staffMember) {
            return response()->json([
                'success' => false,
                'message' => 'Staff member not found'
            ], 404);
        }
        
        $staffMember->update($request->only([
            'name',
            'position',
            'image_path',
            'type',
            'order'
        ]));
        
        return response()->json([
            'success' => true,
            'message' => 'Staff member updated successfully',
            'data' => $staffMember
        ]);
    }
    
    /**
     * Delete a staff member
     */
    public function destroy($companyProfileId, $id): JsonResponse
    {
        $staffMember = StaffMember::where('company_profile_id', $companyProfileId)
            ->where('id', $id)
            ->first();
        
        if (!$staffMember) {
            return response()->json([
                'success' => false,
                'message' => 'Staff member not found'
            ], 404);
        }
        
        $staffMember->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Staff member deleted successfully'
        ]);
    }
}

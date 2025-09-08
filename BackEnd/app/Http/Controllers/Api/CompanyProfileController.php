<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\CompanyProfile;

class CompanyProfileController extends Controller
{
    /**
     * Store a new company profile
     */
    public function store(Request $request)
    {
        $request->validate([
            'template_id' => 'required|string',
            'data' => 'required|array',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $profile = CompanyProfile::create([
            'user_id' => $request->user()->id,
            'template_id' => $request->input('template_id'),
            'data' => $request->input('data'),
            'name' => $request->input('name'),
            'description' => $request->input('description'),
        ]);

        return response()->json([
            'success' => true,
            'data' => $profile,
            'message' => 'Company profile saved successfully'
        ], 201);
    }

    /**
     * Get the last updated company profile
     */
    public function index(Request $request)
    {
        $profile = CompanyProfile::where('user_id', $request->user()->id)
            ->latest()
            ->first();

        return response()->json([
            'success' => true,
            'data' => $profile
        ]);
    }

    /**
     * Get a specific company profile
     */
    public function show(Request $request, $id)
    {
        $profile = CompanyProfile::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $profile
        ]);
    }

    /**
     * Update a company profile
     */
    public function update(Request $request, $id)
    {
        $profile = CompanyProfile::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $request->validate([
            'template_id' => 'sometimes|string',
            'data' => 'sometimes|array',
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $profile->update([
            'template_id' => $request->input('template_id', $profile->template_id),
            'data' => $request->input('data', $profile->data),
            'name' => $request->input('name', $profile->name),
            'description' => $request->input('description', $profile->description),
        ]);

        return response()->json([
            'success' => true,
            'data' => $profile,
            'message' => 'Company profile updated successfully'
        ]);
    }

    /**
     * Delete a company profile
     */
    public function destroy(Request $request, $id)
    {
        $profile = CompanyProfile::where('user_id', $request->user()->id)
            ->findOrFail($id);

        // Delete associated images if they exist
        if (is_array($profile->data)) {
            if (isset($profile->data['logoImage'])) {
                $logoPath = str_replace('/storage/', '', $profile->data['logoImage']);
                Storage::disk('public')->delete($logoPath);
            }
            if (isset($profile->data['backgroundImage'])) {
                $backgroundPath = str_replace('/storage/', '', $profile->data['backgroundImage']);
                Storage::disk('public')->delete($backgroundPath);
            }
        }

        $profile->delete();

        return response()->json([
            'success' => true,
            'message' => 'Company profile deleted successfully'
        ]);
    }
}

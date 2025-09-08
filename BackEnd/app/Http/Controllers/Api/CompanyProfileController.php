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
        try {
            $validated = $request->validate([
                'template_id' => 'required|string|max:255',
                'data' => 'required|array',
                'name' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:1000',
            ]);

            $profile = CompanyProfile::create([
                'user_id' => $request->user()->id,
                'template_id' => $validated['template_id'],
                'data' => $validated['data'],
                'name' => $validated['name'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'Company profile saved successfully'
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save company profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the last updated company profile
     */
    public function index(Request $request)
    {
        try {
            $profile = CompanyProfile::where('user_id', $request->user()->id)
                ->latest()
                ->first();

            return response()->json([
                'success' => true,
                'data' => $profile
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve company profiles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific company profile
     */
    public function show(Request $request, $id)
    {
        try {
            $profile = CompanyProfile::where('user_id', $request->user()->id)
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $profile
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile not found',
                'error' => 'The requested company profile does not exist or you do not have permission to access it.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve company profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a company profile
     */
    public function update(Request $request, $id)
    {
        try {
            $profile = CompanyProfile::where('user_id', $request->user()->id)
                ->findOrFail($id);

            $validated = $request->validate([
                'template_id' => 'sometimes|string|max:255',
                'data' => 'sometimes|array',
                'name' => 'nullable|string|max:255',
                'description' => 'nullable|string|max:1000',
            ]);

            $profile->update([
                'template_id' => $validated['template_id'] ?? $profile->template_id,
                'data' => $validated['data'] ?? $profile->data,
                'name' => $validated['name'] ?? $profile->name,
                'description' => $validated['description'] ?? $profile->description,
            ]);

            return response()->json([
                'success' => true,
                'data' => $profile,
                'message' => 'Company profile updated successfully'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile not found',
                'error' => 'The requested company profile does not exist or you do not have permission to access it.'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update company profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a company profile
     */
    public function destroy(Request $request, $id)
    {
        try {
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

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Company profile not found',
                'error' => 'The requested company profile does not exist or you do not have permission to access it.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete company profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

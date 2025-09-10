<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class SettingController extends Controller
{
    /**
     * Display the settings.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::first();

        return response()->json([
            'success' => true,
            'data' => $settings,
            'message' => 'Settings retrieved successfully'
        ]);
    }

    /**
     * Store or update the settings.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'company_name' => 'nullable|string|max:255',
                'company_email' => 'nullable|email|max:255',
                'company_phone' => 'nullable|string|max:50',
                'company_website' => 'nullable|url|max:255',
                'company_address' => 'nullable|string',
                'company_description' => 'nullable|string',
            ]);

            // Update existing settings or create new ones
            $settings = Setting::first();

            if ($settings) {
                $settings->update($validated);
            } else {
                $settings = Setting::create($validated);
            }

            return response()->json([
                'success' => true,
                'data' => $settings,
                'message' => 'Settings saved successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified setting.
     */
    public function show(string $id): JsonResponse
    {
        $setting = Setting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $setting,
            'message' => 'Setting retrieved successfully'
        ]);
    }

    /**
     * Update the specified setting.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $setting = Setting::find($id);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found'
            ], 404);
        }

        try {
            $validated = $request->validate([
                'company_name' => 'sometimes|nullable|string|max:255',
                'company_email' => 'sometimes|nullable|email|max:255',
                'company_phone' => 'sometimes|nullable|string|max:50',
                'company_website' => 'sometimes|nullable|url|max:255',
                'company_address' => 'sometimes|nullable|string',
                'company_description' => 'sometimes|nullable|string',
            ]);

            $setting->update($validated);

            return response()->json([
                'success' => true,
                'data' => $setting,
                'message' => 'Setting updated successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }
}

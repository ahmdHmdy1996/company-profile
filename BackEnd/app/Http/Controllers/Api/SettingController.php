<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Http\Requests\StoreSettingRequest;
use App\Http\Requests\UpdateSettingRequest;
use App\Http\Resources\SettingResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display a listing of settings.
     */
    public function index(Request $request): JsonResponse
    {
        $settings = Setting::orderBy('id')->get();

        return successResponse(
            SettingResource::collection($settings),
            'Settings retrieved successfully'
        );
    }

    /**
     * Store a newly created setting.
     */
    public function store(StoreSettingRequest $request): JsonResponse
    {
        $setting = Setting::create($request->validated());

        return successResponse(
            new SettingResource($setting),
            'Setting created successfully',
            201
        );
    }

    /**
     * Display the specified setting.
     */
    public function show(Setting $setting): JsonResponse
    {
        return successResponse(
            new SettingResource($setting),
            'Setting retrieved successfully'
        );
    }

    /**
     * Display setting by key.
     */
    public function showByKey(string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return errorResponse('Setting not found', 404);
        }

        return successResponse(
            new SettingResource($setting),
            'Setting retrieved successfully'
        );
    }

    /**
     * Update the specified setting.
     */
    public function update(UpdateSettingRequest $request, Setting $setting): JsonResponse
    {
        $setting->update($request->validated());

        return successResponse(
            new SettingResource($setting),
            'Setting updated successfully'
        );
    }

    /**
     * Update setting by key.
     */
    public function updateByKey(UpdateSettingRequest $request, string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return errorResponse('Setting not found', 404);
        }

        $setting->update($request->validated());

        return successResponse(
            new SettingResource($setting),
            'Setting updated successfully'
        );
    }

    /**
     * Remove the specified setting.
     */
    public function destroy(Setting $setting): JsonResponse
    {
        $setting->delete();

        return successResponse(
            null,
            'Setting deleted successfully'
        );
    }

    /**
     * Bulk update settings.
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'required'
        ]);

        foreach ($request->settings as $settingData) {
            Setting::updateOrCreate(
                ['key' => $settingData['key']],
                ['value' => $settingData['value']]
            );
        }

        return successResponse(
            null,
            'Settings updated successfully'
        );
    }
}

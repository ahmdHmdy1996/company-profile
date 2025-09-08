<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\CompanyProfileController;
use App\Http\Controllers\Api\AuthController;


// Authentication routes (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Company Profile API Routes (protected)
    Route::prefix('company-profiles')->group(function () {
        Route::get('/', [CompanyProfileController::class, 'index']);
        Route::post('/', [CompanyProfileController::class, 'store']);
        Route::get('/{id}', [CompanyProfileController::class, 'show']);
        Route::put('/{id}', [CompanyProfileController::class, 'update']);
        Route::delete('/{id}', [CompanyProfileController::class, 'destroy']);
    });

    // Image upload endpoint (protected)
    Route::post('/upload-image', function (Request $request) {
        try {
            $validated = $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'type' => 'required|in:logo,background'
            ]);

            $type = $validated['type'];
            $path = $request->file('image')->store($type . 's', 'public');

            return response()->json([
                'success' => true,
                'url' => Storage::url($path),
                'path' => $path,
                'message' => 'Image uploaded successfully'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image',
                'error' => $e->getMessage()
            ], 500);
        }
    });
});

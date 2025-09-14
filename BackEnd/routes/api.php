<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\PdfController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\AttachmentController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\AuthController;

// Authentication routes (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Settings API Routes
Route::prefix('settings')->group(function () {
    Route::get('/', [SettingController::class, 'index']);
    Route::post('/', [SettingController::class, 'store']);
    Route::get('/{id}', [SettingController::class, 'show']);
    Route::put('/{id}', [SettingController::class, 'update']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // PDF API Routes
    Route::prefix('pdfs')->group(function () {
        Route::get('/', [PdfController::class, 'index']);
        Route::get('/last', [PdfController::class, 'getLastPdf']);
        Route::post('/', [PdfController::class, 'store']);
        Route::get('/{id}', [PdfController::class, 'show']);
        Route::put('/{id}', [PdfController::class, 'update']);
        Route::delete('/{id}', [PdfController::class, 'destroy']);
    });

    // Page API Routes
    Route::prefix('pages')->group(function () {
        Route::get('/', [PageController::class, 'index']); // ?pdf_id=1
        Route::post('/', [PageController::class, 'store']);
        Route::get('/{id}', [PageController::class, 'show']);
        Route::put('/{id}', [PageController::class, 'update']);
        Route::delete('/{id}', [PageController::class, 'destroy']);
        Route::post('/reorder', [PageController::class, 'reorder']);
    });

    // Section API Routes
    Route::prefix('sections')->group(function () {
        Route::get('/', [SectionController::class, 'index']); // ?page_id=1
        Route::post('/', [SectionController::class, 'store']);
        Route::get('/{id}', [SectionController::class, 'show']);
        Route::put('/{id}', [SectionController::class, 'update']);
        Route::delete('/{id}', [SectionController::class, 'destroy']);
        Route::post('/reorder', [SectionController::class, 'reorder']);
    });

    // Attachment API Routes
    Route::prefix('attachments')->group(function () {
        Route::get('/', [AttachmentController::class, 'index']); // ?pdf_id=1
        Route::post('/', [AttachmentController::class, 'store']);
        Route::get('/{attachment}', [AttachmentController::class, 'show']);
        Route::put('/{attachment}', [AttachmentController::class, 'update']);
        Route::delete('/{attachment}', [AttachmentController::class, 'destroy']);
        Route::get('/{attachment}/download', [AttachmentController::class, 'download']);
        Route::post('/reorder', [AttachmentController::class, 'reorder']);
    });
});

// Public file serving route (optional, for direct file access)
Route::get('/files/{path}', function ($path) {
    if (!Storage::disk('public')->exists($path)) {
        return errorResponse('File not found', 404);
    }

    return response()->file(storage_path('app/public/' . $path));
})->where('path', '.*');

// Fallback route for undefined API endpoints
Route::fallback(function () {
    return errorResponse('API endpoint not found', 404);
});

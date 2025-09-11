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

// API Documentation route
Route::get('/', function () {
    return successResponse([
        'api_name' => 'Company Profile API',
        'version' => '1.0.0',
        'description' => 'RESTful API for managing company profile PDFs, pages, sections, attachments, and settings',
        'base_url' => url('/api'),
        'endpoints' => [
            'Authentication' => [
                'POST /register' => 'User registration',
                'POST /login' => 'User login',
                'POST /logout' => 'User logout (requires auth)',
                'GET /user' => 'Get authenticated user (requires auth)'
            ],
            'PDFs' => [
                'GET /pdfs' => 'List all PDFs (requires auth)',
                'POST /pdfs' => 'Create new PDF (requires auth)',
                'GET /pdfs/{id}' => 'Get specific PDF (requires auth)',
                'PUT /pdfs/{id}' => 'Update PDF (requires auth)',
                'DELETE /pdfs/{id}' => 'Delete PDF (requires auth)',
                'GET /pdfs/last' => 'Get last PDF (requires auth)'
            ],
            'Pages' => [
                'GET /pages' => 'List pages (requires auth)',
                'POST /pages' => 'Create page (requires auth)',
                'GET /pages/{id}' => 'Get specific page (requires auth)',
                'PUT /pages/{id}' => 'Update page (requires auth)',
                'DELETE /pages/{id}' => 'Delete page (requires auth)',
                'POST /pages/reorder' => 'Reorder pages (requires auth)'
            ],
            'Sections' => [
                'GET /sections' => 'List sections (requires auth)',
                'POST /sections' => 'Create section (requires auth)',
                'GET /sections/{id}' => 'Get specific section (requires auth)',
                'PUT /sections/{id}' => 'Update section (requires auth)',
                'DELETE /sections/{id}' => 'Delete section (requires auth)',
                'POST /sections/reorder' => 'Reorder sections (requires auth)'
            ],
            'Attachments' => [
                'GET /attachments' => 'List attachments (requires auth)',
                'POST /attachments' => 'Upload attachment (requires auth)',
                'GET /attachments/{id}' => 'Get attachment (requires auth)',
                'PUT /attachments/{id}' => 'Update attachment (requires auth)',
                'DELETE /attachments/{id}' => 'Delete attachment (requires auth)',
                'GET /attachments/{id}/download' => 'Download attachment (requires auth)',
                'POST /attachments/reorder' => 'Reorder attachments (requires auth)'
            ],
            'Settings' => [
                'GET /settings' => 'List settings (requires auth)',
                'POST /settings' => 'Create setting (requires auth)',
                'GET /settings/{id}' => 'Get setting (requires auth)',
                'PUT /settings/{id}' => 'Update setting (requires auth)',
                'DELETE /settings/{id}' => 'Delete setting (requires auth)',
                'POST /settings/bulk-update' => 'Bulk update settings (requires auth)'
            ]
        ],
        'response_format' => [
            'success' => 'boolean',
            'message' => 'string',
            'data' => 'object|array|null',
            'errors' => 'object (only for validation errors)'
        ],
        'authentication' => 'Bearer Token (Laravel Sanctum)',
        'content_type' => 'application/json'
    ], 'Welcome to Company Profile API');
});

// Authentication routes (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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

    // Settings API Routes
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'index']);
        Route::post('/', [SettingController::class, 'store']);
        Route::get('/{id}', [SettingController::class, 'show']);
        Route::put('/{id}', [SettingController::class, 'update']);
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

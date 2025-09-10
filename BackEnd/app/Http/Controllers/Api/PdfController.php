<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PdfController extends Controller
{
    /**
     * Display a listing of the PDFs.
     */
    public function index(): JsonResponse
    {
        $pdfs = Pdf::with(['pages', 'attachments', 'settings'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $pdfs,
            'message' => 'PDFs retrieved successfully'
        ]);
    }

    /**
     * Store a newly created PDF.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'cover' => 'nullable|array',
                'header' => 'nullable|array',
                'footer' => 'nullable|array',
                'background_image' => 'nullable|array',
            ]);

            $pdf = Pdf::create($validated);

            return response()->json([
                'success' => true,
                'data' => $pdf->load(['pages', 'attachments', 'settings']),
                'message' => 'PDF created successfully'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * Display the specified PDF.
     */
    public function show(string $id): JsonResponse
    {
        $pdf = Pdf::with(['pages.sections', 'attachments', 'settings'])->find($id);

        if (!$pdf) {
            return response()->json([
                'success' => false,
                'message' => 'PDF not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $pdf,
            'message' => 'PDF retrieved successfully'
        ]);
    }

    /**
     * Update the specified PDF.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $pdf = Pdf::find($id);

        if (!$pdf) {
            return response()->json([
                'success' => false,
                'message' => 'PDF not found'
            ], 404);
        }

        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'cover' => 'nullable|array',
                'header' => 'nullable|array',
                'footer' => 'nullable|array',
                'background_image' => 'nullable|array',
            ]);

            $pdf->update($validated);

            return response()->json([
                'success' => true,
                'data' => $pdf->load(['pages.sections', 'attachments', 'settings']),
                'message' => 'PDF updated successfully'
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
     * Remove the specified PDF.
     */
    public function destroy(string $id): JsonResponse
    {
        $pdf = Pdf::find($id);

        if (!$pdf) {
            return response()->json([
                'success' => false,
                'message' => 'PDF not found'
            ], 404);
        }

        $pdf->delete();

        return response()->json([
            'success' => true,
            'message' => 'PDF deleted successfully'
        ]);
    }

    /**
     * Get the last created PDF.
     */
    public function getLastPdf(): JsonResponse
    {
        $pdf = Pdf::with(['pages.sections', 'attachments', 'settings'])
            ->latest()
            ->first();

        if (!$pdf) {
            return response()->json([
                'success' => false,
                'message' => 'No PDF found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $pdf,
            'message' => 'Last PDF retrieved successfully'
        ]);
    }
}

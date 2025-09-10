<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PageController extends Controller
{
    /**
     * Display a listing of pages for a specific PDF.
     */
    public function index(Request $request): JsonResponse
    {
        $pdfId = $request->query('pdf_id');

        if (!$pdfId) {
            return response()->json([
                'success' => false,
                'message' => 'PDF ID is required'
            ], 400);
        }

        $pages = Page::with(['sections'])
            ->where('pdf_id', $pdfId)
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pages,
            'message' => 'Pages retrieved successfully'
        ]);
    }

    /**
     * Store a newly created page.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'pdf_id' => 'required|exists:pdfs,id',
                'has_header' => 'required|exists:pdfs,id',
                'has_footer' => 'required|exists:pdfs,id',
                'title' => 'required|string|max:255',
                'order' => 'nullable|integer|min:0',
            ]);

            // Set default order if not provided
            if (!isset($validated['order'])) {
                $lastOrder = Page::where('pdf_id', $validated['pdf_id'])->max('order');
                $validated['order'] = $lastOrder ? $lastOrder + 1 : 0;
            }

            $page = Page::create($validated);

            return response()->json([
                'success' => true,
                'data' => $page->load(['sections']),
                'message' => 'Page created successfully'
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
     * Display the specified page.
     */
    public function show(string $id): JsonResponse
    {
        $page = Page::with(['sections', 'pdf'])->find($id);

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $page,
            'message' => 'Page retrieved successfully'
        ]);
    }

    /**
     * Update the specified page.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found'
            ], 404);
        }

        try {
            $validated = $request->validate([
                'has_header' => 'sometimes|required|exists:pdfs,id',
                'has_footer' => 'sometimes|required|exists:pdfs,id',
                'title' => 'sometimes|required|string|max:255',
                'order' => 'sometimes|integer|min:0',
            ]);

            $page->update($validated);

            return response()->json([
                'success' => true,
                'data' => $page->load(['sections', 'pdf']),
                'message' => 'Page updated successfully'
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
     * Remove the specified page.
     */
    public function destroy(string $id): JsonResponse
    {
        $page = Page::find($id);

        if (!$page) {
            return response()->json([
                'success' => false,
                'message' => 'Page not found'
            ], 404);
        }

        $page->delete();

        return response()->json([
            'success' => true,
            'message' => 'Page deleted successfully'
        ]);
    }

    /**
     * Reorder pages for a specific PDF.
     */
    public function reorder(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'pdf_id' => 'required|exists:pdfs,id',
                'pages' => 'required|array',
                'pages.*.id' => 'required|exists:pages,id',
                'pages.*.order' => 'required|integer|min:0',
            ]);

            foreach ($validated['pages'] as $pageData) {
                Page::where('id', $pageData['id'])
                    ->where('pdf_id', $validated['pdf_id'])
                    ->update(['order' => $pageData['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pages reordered successfully'
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

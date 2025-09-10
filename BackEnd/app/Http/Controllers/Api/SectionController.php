<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class SectionController extends Controller
{
    /**
     * Display a listing of sections for a specific page.
     */
    public function index(Request $request): JsonResponse
    {
        $pageId = $request->query('page_id');

        if (!$pageId) {
            return response()->json([
                'success' => false,
                'message' => 'Page ID is required'
            ], 400);
        }

        $sections = Section::where('page_id', $pageId)
            ->orderBy('order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sections,
            'message' => 'Sections retrieved successfully'
        ]);
    }

    /**
     * Store a newly created section.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'page_id' => 'required|exists:pages,id',
                'data' => 'required|array',
                'order' => 'nullable|integer|min:0',
            ]);

            // Set default order if not provided
            if (!isset($validated['order'])) {
                $lastOrder = Section::where('page_id', $validated['page_id'])->max('order');
                $validated['order'] = $lastOrder ? $lastOrder + 1 : 0;
            }

            $section = Section::create($validated);

            return response()->json([
                'success' => true,
                'data' => $section,
                'message' => 'Section created successfully'
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
     * Display the specified section.
     */
    public function show(string $id): JsonResponse
    {
        $section = Section::with(['page'])->find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Section not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $section,
            'message' => 'Section retrieved successfully'
        ]);
    }

    /**
     * Update the specified section.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $section = Section::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Section not found'
            ], 404);
        }

        try {
            $validated = $request->validate([
                'data' => 'sometimes|required|array',
                'order' => 'sometimes|integer|min:0',
            ]);

            $section->update($validated);

            return response()->json([
                'success' => true,
                'data' => $section->load(['page']),
                'message' => 'Section updated successfully'
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
     * Remove the specified section.
     */
    public function destroy(string $id): JsonResponse
    {
        $section = Section::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Section not found'
            ], 404);
        }

        $section->delete();

        return response()->json([
            'success' => true,
            'message' => 'Section deleted successfully'
        ]);
    }

    /**
     * Reorder sections for a specific page.
     */
    public function reorder(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'page_id' => 'required|exists:pages,id',
                'sections' => 'required|array',
                'sections.*.id' => 'required|exists:sections,id',
                'sections.*.order' => 'required|integer|min:0',
            ]);

            foreach ($validated['sections'] as $sectionData) {
                Section::where('id', $sectionData['id'])
                    ->where('page_id', $validated['page_id'])
                    ->update(['order' => $sectionData['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Sections reordered successfully'
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

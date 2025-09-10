<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateSectionRequest;
use App\Http\Resources\SectionResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SectionController extends Controller
{
    /**
     * Display a listing of sections for a specific page.
     */
    public function index(Request $request): JsonResponse
    {
        $pageId = $request->query('page_id');

        if (!$pageId) {
            return errorResponse('Page ID is required', 400);
        }

        $sections = Section::where('page_id', $pageId)
            ->orderBy('order')
            ->get();

        return successResponse(
            SectionResource::collection($sections),
            'Sections retrieved successfully'
        );
    }

    /**
     * Store a newly created section.
     */
    public function store(StoreSectionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Set default order if not provided
        if (!isset($validated['order'])) {
            $lastOrder = Section::where('page_id', $validated['page_id'])->max('order');
            $validated['order'] = $lastOrder ? $lastOrder + 1 : 0;
        }

        $section = Section::create($validated);

        return successResponse(
            new SectionResource($section),
            'Section created successfully',
            201
        );
    }

    /**
     * Display the specified section.
     */
    public function show(string $id): JsonResponse
    {
        $section = Section::with(['page'])->find($id);

        if (!$section) {
            return errorResponse('Section not found', 404);
        }

        return successResponse(
            new SectionResource($section),
            'Section retrieved successfully'
        );
    }

    /**
     * Update the specified section.
     */
    public function update(UpdateSectionRequest $request, string $id): JsonResponse
    {
        $section = Section::find($id);

        if (!$section) {
            return errorResponse('Section not found', 404);
        }

        $section->update($request->validated());

        return successResponse(
            new SectionResource($section->load(['page'])),
            'Section updated successfully'
        );
    }

    /**
     * Remove the specified section.
     */
    public function destroy(string $id): JsonResponse
    {
        $section = Section::find($id);

        if (!$section) {
            return errorResponse('Section not found', 404);
        }

        $section->delete();

        return successResponse(
            null,
            'Section deleted successfully'
        );
    }

    /**
     * Reorder sections for a specific page.
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'page_id' => 'required|exists:pages,id',
            'sections' => 'required|array',
            'sections.*.id' => 'required|exists:sections,id',
            'sections.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->sections as $sectionData) {
            Section::where('id', $sectionData['id'])
                ->where('page_id', $request->page_id)
                ->update(['order' => $sectionData['order']]);
        }

        return successResponse(
            null,
            'Sections reordered successfully'
        );
    }
}

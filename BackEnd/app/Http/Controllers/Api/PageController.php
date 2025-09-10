<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Http\Requests\StorePageRequest;
use App\Http\Requests\UpdatePageRequest;
use App\Http\Resources\PageResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PageController extends Controller
{
    /**
     * Display a listing of pages for a specific PDF.
     */
    public function index(Request $request): JsonResponse
    {
        $pdfId = $request->query('pdf_id');
        
        if (!$pdfId) {
            return errorResponse('PDF ID is required', 400);
        }

        $pages = Page::with(['sections'])
            ->where('pdf_id', $pdfId)
            ->orderBy('order')
            ->get();

        return successResponse(
            PageResource::collection($pages),
            'Pages retrieved successfully'
        );
    }

    /**
     * Store a newly created page.
     */
    public function store(StorePageRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Set default order if not provided
        if (!isset($validated['order'])) {
            $lastOrder = Page::where('pdf_id', $validated['pdf_id'])->max('order');
            $validated['order'] = $lastOrder ? $lastOrder + 1 : 0;
        }

        $page = Page::create($validated);

        return successResponse(
            new PageResource($page->load(['sections'])),
            'Page created successfully',
            201
        );
    }

    /**
     * Display the specified page.
     */
    public function show(string $id): JsonResponse
    {
        $page = Page::with(['sections', 'pdf'])->find($id);

        if (!$page) {
            return errorResponse('Page not found', 404);
        }

        return successResponse(
            new PageResource($page),
            'Page retrieved successfully'
        );
    }

    /**
     * Update the specified page.
     */
    public function update(UpdatePageRequest $request, string $id): JsonResponse
    {
        $page = Page::find($id);

        if (!$page) {
            return errorResponse('Page not found', 404);
        }

        $page->update($request->validated());

        return successResponse(
            new PageResource($page->load(['sections', 'pdf'])),
            'Page updated successfully'
        );
    }

    /**
     * Remove the specified page.
     */
    public function destroy(string $id): JsonResponse
    {
        $page = Page::find($id);

        if (!$page) {
            return errorResponse('Page not found', 404);
        }

        $page->delete();

        return successResponse(
            null,
            'Page deleted successfully'
        );
    }

    /**
     * Reorder pages for a specific PDF.
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'pdf_id' => 'required|exists:pdfs,id',
            'pages' => 'required|array',
            'pages.*.id' => 'required|exists:pages,id',
            'pages.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->pages as $pageData) {
            Page::where('id', $pageData['id'])
                ->where('pdf_id', $request->pdf_id)
                ->update(['order' => $pageData['order']]);
        }

        return successResponse(
            null,
            'Pages reordered successfully'
        );
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pdf;
use App\Http\Requests\StorePdfRequest;
use App\Http\Requests\UpdatePdfRequest;
use App\Http\Resources\PdfResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PdfController extends Controller
{
    /**
     * Display a listing of the PDFs.
     */
    public function index(): JsonResponse
    {
        $pdfs = Pdf::with(['pages', 'attachments'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return successResponse(
            PdfResource::collection($pdfs),
            'PDFs retrieved successfully'
        );
    }

    /**
     * Store a newly created PDF.
     */
    public function store(StorePdfRequest $request): JsonResponse
    {
        $pdf = Pdf::create($request->validated());

        return successResponse(
            new PdfResource($pdf->load(['pages', 'attachments'])),
            'PDF created successfully',
            201
        );
    }

    /**
     * Display the specified PDF.
     */
    public function show(string $id): JsonResponse
    {
        $pdf = Pdf::with(['pages.sections', 'attachments'])->find($id);

        if (!$pdf) {
            return errorResponse('PDF not found', 404);
        }

        return successResponse(
            new PdfResource($pdf),
            'PDF retrieved successfully'
        );
    }

    /**
     * Update the specified PDF.
     */
    public function update(UpdatePdfRequest $request, string $id): JsonResponse
    {
        $pdf = Pdf::find($id);

        if (!$pdf) {
            return errorResponse('PDF not found', 404);
        }

        $pdf->update($request->validated());

        return successResponse(
            new PdfResource($pdf->load(['pages.sections', 'attachments'])),
            'PDF updated successfully'
        );
    }

    /**
     * Remove the specified PDF.
     */
    public function destroy(string $id): JsonResponse
    {
        $pdf = Pdf::find($id);

        if (!$pdf) {
            return errorResponse('PDF not found', 404);
        }

        $pdf->delete();

        return successResponse(
            null,
            'PDF deleted successfully'
        );
    }

    /**
     * Get the last created PDF.
     */
    public function getLastPdf(): JsonResponse
    {
        $pdf = Pdf::with(['pages.sections', 'attachments'])
            ->latest()
            ->first();

        if (!$pdf) {
            return errorResponse('No PDF found', 404);
        }

        return successResponse(
            new PdfResource($pdf),
            'Last PDF retrieved successfully'
        );
    }
}

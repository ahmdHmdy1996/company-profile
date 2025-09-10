<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use App\Http\Requests\StoreAttachmentRequest;
use App\Http\Requests\UpdateAttachmentRequest;
use App\Http\Resources\AttachmentResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AttachmentController extends Controller
{
    /**
     * Display a listing of attachments.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Attachment::query();

        // Filter by PDF if needed
        if ($request->has('pdf_id')) {
            $query->where('pdf_id', $request->pdf_id);
        }

        $attachments = $query->orderBy('order', 'asc')
                            ->orderBy('created_at', 'desc')
                            ->paginate(20);

        return successResponse(
            AttachmentResource::collection($attachments),
            'Attachments retrieved successfully'
        );
    }

    /**
     * Store a newly created attachment.
     */
    public function store(StoreAttachmentRequest $request): JsonResponse
    {
        $file = $request->file('file');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('attachments', $filename, 'public');

        // Set default order if not provided
        $order = $request->order;
        if ($order === null) {
            $lastOrder = Attachment::where('pdf_id', $request->pdf_id)->max('order');
            $order = $lastOrder ? $lastOrder + 1 : 0;
        }

        $attachment = Attachment::create([
            'pdf_id' => $request->pdf_id,
            'path' => $path,
            'order' => $order
        ]);

        return successResponse(
            new AttachmentResource($attachment),
            'Attachment uploaded successfully',
            201
        );
    }

    /**
     * Display the specified attachment.
     */
    public function show(Attachment $attachment): JsonResponse
    {
        return successResponse(
            new AttachmentResource($attachment),
            'Attachment retrieved successfully'
        );
    }

    /**
     * Update the specified attachment.
     */
    public function update(UpdateAttachmentRequest $request, Attachment $attachment): JsonResponse
    {
        $attachment->update($request->validated());

        return successResponse(
            new AttachmentResource($attachment),
            'Attachment updated successfully'
        );
    }

    /**
     * Remove the specified attachment.
     */
    public function destroy(Attachment $attachment): JsonResponse
    {
        // Delete file from storage
        if (Storage::disk('public')->exists($attachment->path)) {
            Storage::disk('public')->delete($attachment->path);
        }

        $attachment->delete();

        return successResponse(
            null,
            'Attachment deleted successfully'
        );
    }

    /**
     * Download the specified attachment.
     */
    public function download(Attachment $attachment)
    {
        if (!Storage::disk('public')->exists($attachment->path)) {
            return errorResponse('File not found', 404);
        }

        $fileName = basename($attachment->path);
        return response()->download(storage_path('app/public/' . $attachment->path), $fileName);
    }

    /**
     * Reorder attachments.
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'attachments' => 'required|array',
            'attachments.*.id' => 'required|exists:attachments,id',
            'attachments.*.order' => 'required|integer|min:0'
        ]);

        foreach ($request->attachments as $attachmentData) {
            Attachment::where('id', $attachmentData['id'])
                     ->update(['order' => $attachmentData['order']]);
        }

        return successResponse(
            null,
            'Attachments reordered successfully'
        );
    }
}

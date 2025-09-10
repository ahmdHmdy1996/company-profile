<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AttachmentController extends Controller
{
    /**
     * Display a listing of attachments.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Attachment::query();

            // Filter by PDF if needed
            if ($request->has('pdf_id')) {
                $query->where('pdf_id', $request->pdf_id);
            }

            $attachments = $query->orderBy('order', 'asc')
                                ->orderBy('created_at', 'desc')
                                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $attachments,
                'message' => 'Attachments retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve attachments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created attachment.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:jpeg,png,jpg,gif,webp,pdf,doc,docx|max:10240', // 10MB
                'pdf_id' => 'required|exists:pdfs,id',
                'order' => 'nullable|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

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

            return response()->json([
                'success' => true,
                'data' => $attachment,
                'message' => 'Attachment uploaded successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload attachment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified attachment.
     */
    public function show(Attachment $attachment): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $attachment,
                'message' => 'Attachment retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve attachment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified attachment.
     */
    public function update(Request $request, Attachment $attachment): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'order' => 'nullable|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $attachment->update($request->only(['order']));

            return response()->json([
                'success' => true,
                'data' => $attachment,
                'message' => 'Attachment updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update attachment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified attachment.
     */
    public function destroy(Attachment $attachment): JsonResponse
    {
        try {
            // Delete file from storage
            if (Storage::disk('public')->exists($attachment->path)) {
                Storage::disk('public')->delete($attachment->path);
            }

            $attachment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Attachment deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete attachment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download the specified attachment.
     */
    public function download(Attachment $attachment)
    {
        try {
            if (!Storage::disk('public')->exists($attachment->path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }

            $fileName = basename($attachment->path);
            return response()->download(storage_path('app/public/' . $attachment->path), $fileName);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download attachment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reorder attachments.
     */
    public function reorder(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'attachments' => 'required|array',
                'attachments.*.id' => 'required|exists:attachments,id',
                'attachments.*.order' => 'required|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            foreach ($request->attachments as $attachmentData) {
                Attachment::where('id', $attachmentData['id'])
                         ->update(['order' => $attachmentData['order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Attachments reordered successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reorder attachments',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

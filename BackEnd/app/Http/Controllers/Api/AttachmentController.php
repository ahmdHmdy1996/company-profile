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
            
            // Filter by user if needed
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }
            
            // Filter by company profile if needed
            if ($request->has('company_profile_id')) {
                $query->where('company_profile_id', $request->company_profile_id);
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
                'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB
                'description' => 'nullable|string|max:500',
                'company_profile_id' => 'nullable|exists:company_profiles,id',
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

            $attachment = Attachment::create([
                'filename' => $filename,
                'original_name' => $file->getClientOriginalName(),
                'path' => $path,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'description' => $request->description,
                'company_profile_id' => $request->company_profile_id,
                'user_id' => auth()->id(),
                'order' => $request->order ?? 0
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
                'description' => 'nullable|string|max:500',
                'order' => 'nullable|integer|min:0'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $attachment->update($request->only(['description', 'order']));

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

            return Storage::disk('public')->download($attachment->path, $attachment->original_name);
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
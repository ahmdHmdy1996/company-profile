<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PdfResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'cover' => $this->cover,
            'header' => $this->header,
            'footer' => $this->footer,
            'background_image' => $this->background_image,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'pages' => PageResource::collection($this->whenLoaded('pages')),
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
            'settings' => SettingResource::collection($this->whenLoaded('settings')),
            'pages_count' => $this->when($this->relationLoaded('pages'), function () {
                return $this->pages->count();
            }),
            'attachments_count' => $this->when($this->relationLoaded('attachments'), function () {
                return $this->attachments->count();
            }),
        ];
    }
}

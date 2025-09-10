<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttachmentResource extends JsonResource
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
            'pdf_id' => $this->pdf_id,
            'path' => $this->path,
            'order' => $this->order,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'url' => $this->url,
            'extension' => $this->getExtension(),
            'is_image' => $this->isImage(),
            'filename' => basename($this->path),
            'pdf' => new PdfResource($this->whenLoaded('pdf')),
        ];
    }
}

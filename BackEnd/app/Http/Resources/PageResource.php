<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
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
            'has_header' => $this->has_header,
            'has_footer' => $this->has_footer,
            'title' => $this->title,
            'order' => $this->order,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'pdf' => new PdfResource($this->whenLoaded('pdf')),
            'sections' => SectionResource::collection($this->whenLoaded('sections')),
            'sections_count' => $this->when($this->relationLoaded('sections'), function () {
                return $this->sections->count();
            }),
        ];
    }
}

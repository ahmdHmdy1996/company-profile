<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
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
            'company_name' => $this->company_name,
            'company_email' => $this->company_email,
            'company_phone' => $this->company_phone,
            'company_website' => $this->company_website,
            'company_address' => $this->company_address,
            'company_description' => $this->company_description,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

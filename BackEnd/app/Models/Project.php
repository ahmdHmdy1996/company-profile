<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    protected $fillable = [
        'company_profile_id',
        'title',
        'subtitle',
        'image_path',
        'current_page',
        'total_pages',
        'order',
    ];

    protected $casts = [
        'current_page' => 'integer',
        'total_pages' => 'integer',
        'order' => 'integer',
    ];

    public function companyProfile(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageContent extends Model
{
    protected $fillable = [
        'company_profile_id',
        'page_type',
        'title',
        'content',
        'image_path',
        'styles',
        'is_enabled',
        'order',
    ];

    protected $casts = [
        'styles' => 'array',
        'is_enabled' => 'boolean',
        'order' => 'integer',
    ];

    public function companyProfile(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GlobalSetting extends Model
{
    protected $fillable = [
        'company_profile_id',
        'header_logo_path',
        'show_header_logo',
        'show_footer_email',
        'show_footer_phone',
        'show_footer_page_number',
        'footer_email',
        'footer_phone',
    ];

    protected $casts = [
        'show_header_logo' => 'boolean',
        'show_footer_email' => 'boolean',
        'show_footer_phone' => 'boolean',
        'show_footer_page_number' => 'boolean',
    ];

    public function companyProfile(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class);
    }
}

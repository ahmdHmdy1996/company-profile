<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BackgroundSetting extends Model
{
    protected $fillable = [
        'company_profile_id',
        'default_background_color',
        'background_image_path',
        'background_opacity',
        'background_repeat',
    ];

    protected $casts = [
        'background_opacity' => 'decimal:2',
    ];

    public function companyProfile(): BelongsTo
    {
        return $this->belongsTo(CompanyProfile::class);
    }
}

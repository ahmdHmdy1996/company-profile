<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompanyProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'template_id',
        'data',
        'name',
        'description',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    protected $dates = [
        'deleted_at',
    ];

    /**
     * Get the user that owns the profile
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the company settings for the profile
     */
    public function companySetting(): HasOne
    {
        return $this->hasOne(CompanySetting::class);
    }

    /**
     * Get the background settings for the profile
     */
    public function backgroundSetting(): HasOne
    {
        return $this->hasOne(BackgroundSetting::class);
    }

    /**
     * Get the theme settings for the profile
     */
    public function themeSetting(): HasOne
    {
        return $this->hasOne(ThemeSetting::class);
    }

    /**
     * Get the global settings for the profile
     */
    public function globalSetting(): HasOne
    {
        return $this->hasOne(GlobalSetting::class);
    }

    /**
     * Get the page contents for the profile
     */
    public function pageContents(): HasMany
    {
        return $this->hasMany(PageContent::class);
    }

    /**
     * Get the staff members for the profile
     */
    public function staffMembers(): HasMany
    {
        return $this->hasMany(StaffMember::class);
    }

    /**
     * Get the projects for the profile
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Get the attachments for the profile
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pdf extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'cover',
        'header',
        'footer',
        'background_image',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'cover' => 'array',
        'header' => 'array',
        'footer' => 'array',
        'background_image' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the pages for the PDF.
     */
    public function pages(): HasMany
    {
        return $this->hasMany(Page::class)->orderBy('order');
    }

    /**
     * Get the attachments for the PDF.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class)->orderBy('order');
    }

    /**
     * Get the settings for the PDF.
     */
    public function settings(): HasMany
    {
        return $this->hasMany(Setting::class);
    }
}

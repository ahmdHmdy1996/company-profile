<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('background_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_profile_id')->constrained('company_profiles')->onDelete('cascade');
            $table->string('default_background_color')->default('#ffffff');
            $table->string('background_image_path')->nullable();
            $table->decimal('background_opacity', 3, 2)->default(1.00);
            $table->enum('background_repeat', ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'])->default('no-repeat');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('background_settings');
    }
};

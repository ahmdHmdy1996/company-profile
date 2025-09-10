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
        Schema::create('global_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_profile_id')->constrained('company_profiles')->onDelete('cascade');
            $table->string('header_logo_path')->nullable();
            $table->boolean('show_header_logo')->default(true);
            $table->boolean('show_footer_email')->default(true);
            $table->boolean('show_footer_phone')->default(true);
            $table->boolean('show_footer_page_number')->default(true);
            $table->string('footer_email')->nullable();
            $table->string('footer_phone')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('global_settings');
    }
};

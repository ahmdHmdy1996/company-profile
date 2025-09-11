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
        Schema::table('pages', function (Blueprint $table) {
            // Drop the incorrect foreign key constraints
            $table->dropForeign(['has_header']);
            $table->dropForeign(['has_footer']);

            // Change columns to boolean
            $table->boolean('has_header')->default(false)->change();
            $table->boolean('has_footer')->default(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // Revert back to foreign keys (though this is probably not desired)
            $table->foreignId('has_header')->constrained('pdfs')->onDelete('cascade')->change();
            $table->foreignId('has_footer')->constrained('pdfs')->onDelete('cascade')->change();
        });
    }
};

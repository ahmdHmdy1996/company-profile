<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Load production CORS configuration in production environment
        if (app()->environment('production')) {
            $corsConfig = require config_path('cors.production.php');
            config(['cors' => $corsConfig]);
        }
    }
}

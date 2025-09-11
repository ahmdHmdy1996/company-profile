<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a test user for login
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@company.com',
            'password' => Hash::make('password123'),
        ]);

        $this->call([
            UserSeeder::class,
            SettingSeeder::class,
            PdfSeeder::class,
        ]);
    }
}

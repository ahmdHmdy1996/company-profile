<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Create test user
        User::create([
            'name' => 'Test User',
            'email' => 'test@company.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Create demo user
        User::create([
            'name' => 'Demo User',
            'email' => 'demo@company.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Create manager user
        User::create([
            'name' => 'Manager User',
            'email' => 'manager@company.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        // Create editor user
        User::create([
            'name' => 'Editor User',
            'email' => 'editor@company.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        echo "✅ Created 5 sample users:\n";
        echo "- admin@company.com (password: password123)\n";
        echo "- test@company.com (password: password123)\n";
        echo "- demo@company.com (password: password123)\n";
        echo "- manager@company.com (password: password123)\n";
        echo "- editor@company.com (password: password123)\n";
    }
}

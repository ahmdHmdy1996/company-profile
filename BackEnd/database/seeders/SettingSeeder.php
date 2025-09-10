<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create([
            'company_name' => 'Sample Company',
            'company_email' => 'info@samplecompany.com',
            'company_phone' => '+1-234-567-8900',
            'company_website' => 'https://www.samplecompany.com',
            'company_address' => '123 Business Street, City, State 12345',
            'company_description' => 'We are a leading company in our industry, providing excellent services to our clients worldwide.',
        ]);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pdf;
use App\Models\Page;
use App\Models\Section;

class PdfSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a sample PDF
        $pdf = Pdf::create([
            'name' => 'Sample Company Profile',
            'cover' => [
                'title' => 'Company Profile 2025',
                'subtitle' => 'Building Excellence Together',
                'background_color' => '#1e40af',
                'text_color' => '#ffffff'
            ],
            'header' => [
                'logo_url' => null,
                'company_name' => 'Sample Company',
                'show_on_pages' => true
            ],
            'footer' => [
                'text' => '© 2025 Sample Company. All rights reserved.',
                'contact_info' => 'info@samplecompany.com | +1-234-567-8900',
                'show_on_pages' => true
            ],
            'background_image' => null
        ]);

        // Create sample pages
        $aboutPage = Page::create([
            'pdf_id' => $pdf->id,
            'has_header' => $pdf->id,
            'has_footer' => $pdf->id,
            'title' => 'About Us',
            'order' => 0
        ]);

        $servicesPage = Page::create([
            'pdf_id' => $pdf->id,
            'has_header' => $pdf->id,
            'has_footer' => $pdf->id,
            'title' => 'Our Services',
            'order' => 1
        ]);

        $contactPage = Page::create([
            'pdf_id' => $pdf->id,
            'has_header' => $pdf->id,
            'has_footer' => $pdf->id,
            'title' => 'Contact Us',
            'order' => 2
        ]);

        // Create sample sections for About Us page
        Section::create([
            'page_id' => $aboutPage->id,
            'data' => [
                'type' => 'text',
                'title' => 'Our Story',
                'content' => 'Founded in 2020, Sample Company has been dedicated to providing exceptional services to our clients. We believe in innovation, quality, and customer satisfaction.',
                'style' => [
                    'font_size' => '16px',
                    'text_align' => 'left',
                    'margin_bottom' => '20px'
                ]
            ],
            'order' => 0
        ]);

        Section::create([
            'page_id' => $aboutPage->id,
            'data' => [
                'type' => 'text',
                'title' => 'Our Mission',
                'content' => 'To deliver world-class solutions that help our clients achieve their business objectives while maintaining the highest standards of quality and integrity.',
                'style' => [
                    'font_size' => '16px',
                    'text_align' => 'left',
                    'margin_bottom' => '20px'
                ]
            ],
            'order' => 1
        ]);

        // Create sample sections for Services page
        Section::create([
            'page_id' => $servicesPage->id,
            'data' => [
                'type' => 'service_list',
                'title' => 'What We Offer',
                'services' => [
                    [
                        'name' => 'Consulting Services',
                        'description' => 'Expert advice to help grow your business'
                    ],
                    [
                        'name' => 'Technical Solutions',
                        'description' => 'Cutting-edge technology implementations'
                    ],
                    [
                        'name' => 'Support & Maintenance',
                        'description' => '24/7 support for all our solutions'
                    ]
                ]
            ],
            'order' => 0
        ]);

        // Create sample sections for Contact page
        Section::create([
            'page_id' => $contactPage->id,
            'data' => [
                'type' => 'contact_info',
                'title' => 'Get In Touch',
                'contact_details' => [
                    'address' => '123 Business Street, City, State 12345',
                    'phone' => '+1-234-567-8900',
                    'email' => 'info@samplecompany.com',
                    'website' => 'https://www.samplecompany.com'
                ]
            ],
            'order' => 0
        ]);
    }
}

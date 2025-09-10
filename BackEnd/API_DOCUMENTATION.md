# Updated API Documentation

## Overview
The Laravel backend has been updated to reflect the new database structure with the following main entities:
- **PDFs** - Main document containers
- **Pages** - Individual pages within PDFs
- **Sections** - Content sections within pages
- **Attachments** - Files associated with PDFs
- **Settings** - Company/application settings

## Database Structure

### Tables Created
1. `pdfs` - Main PDF documents
2. `pages` - Pages within PDFs
3. `sections` - Content sections within pages
4. `attachments` - File attachments for PDFs
5. `settings` - Application/company settings

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout (protected)
- `GET /api/user` - Get current user (protected)

### PDFs
- `GET /api/pdfs` - List all PDFs with pagination
- `POST /api/pdfs` - Create a new PDF
- `GET /api/pdfs/{id}` - Get specific PDF with pages and sections
- `PUT /api/pdfs/{id}` - Update PDF
- `DELETE /api/pdfs/{id}` - Delete PDF
- `GET /api/pdfs/last` - Get the last created PDF

### Pages
- `GET /api/pages?pdf_id={id}` - List pages for a specific PDF
- `POST /api/pages` - Create a new page
- `GET /api/pages/{id}` - Get specific page with sections
- `PUT /api/pages/{id}` - Update page
- `DELETE /api/pages/{id}` - Delete page
- `POST /api/pages/reorder` - Reorder pages within a PDF

### Sections
- `GET /api/sections?page_id={id}` - List sections for a specific page
- `POST /api/sections` - Create a new section
- `GET /api/sections/{id}` - Get specific section
- `PUT /api/sections/{id}` - Update section
- `DELETE /api/sections/{id}` - Delete section
- `POST /api/sections/reorder` - Reorder sections within a page

### Attachments
- `GET /api/attachments?pdf_id={id}` - List attachments for a specific PDF
- `POST /api/attachments` - Upload a new attachment
- `GET /api/attachments/{id}` - Get specific attachment
- `PUT /api/attachments/{id}` - Update attachment
- `DELETE /api/attachments/{id}` - Delete attachment
- `GET /api/attachments/{id}/download` - Download attachment file
- `POST /api/attachments/reorder` - Reorder attachments within a PDF

### Settings
- `GET /api/settings` - Get application settings
- `POST /api/settings` - Create or update settings
- `GET /api/settings/{id}` - Get specific setting
- `PUT /api/settings/{id}` - Update specific setting

## Models Created/Updated

### New Models
1. **Pdf.php** - Main PDF document model
2. **Page.php** - Page model with PDF relationship
3. **Section.php** - Section model with page relationship
4. **Setting.php** - Settings model

### Updated Models
1. **Attachment.php** - Updated to work with PDFs instead of company profiles

## Controllers Created/Updated

### New Controllers
1. **PdfController.php** - Handles PDF CRUD operations
2. **PageController.php** - Handles page CRUD operations
3. **SectionController.php** - Handles section CRUD operations
4. **SettingController.php** - Handles settings CRUD operations

### Updated Controllers
1. **AttachmentController.php** - Updated to work with PDFs

## Migration Files Structure
The following migration files define the new database structure:
- `2025_09_07_000001_create_pdfs_table.php`
- `2025_09_08_114850_create_pages_table.php`
- `2025_09_09_145800_create_attachments_table.php`
- `2025_09_10_114842_create_settings_table.php`
- `2025_09_10_114915_create_sections_table.php`

## Sample Data
The project includes seeders that create sample data:
- Company settings with contact information
- A sample PDF with multiple pages
- Sample sections with different content types

## Removed/Deprecated
The following old models and controllers are no longer used with the new structure:
- CompanyProfile model and controller
- BackgroundSetting, CompanySetting, ThemeSetting models and controllers
- PageContent, StaffMember, Project models and controllers

## File Upload
Attachments are stored in the `storage/app/public/attachments` directory and can be accessed via:
- Direct download: `/api/attachments/{id}/download`
- Public URL: `/api/files/{path}` (for direct file serving)

## Installation Steps
1. Run `php artisan migrate:fresh` to apply the new database structure
2. Run `php artisan db:seed` to populate with sample data
3. Ensure `storage/app/public` is linked: `php artisan storage:link`

All endpoints (except authentication) require authentication via Laravel Sanctum.

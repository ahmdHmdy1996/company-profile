# Company Profile Backend API - Postman Collection

This directory contains Postman collection and environment files for testing the Company Profile Backend API.

## Files Included

1. **Company-Profile-Backend-API.postman_collection.json** - Main collection with all API endpoints
2. **Company-Profile-Backend.postman_environment.json** - Environment variables for easy configuration

## How to Import and Use

### Step 1: Import the Collection

1. Open Postman
2. Click "Import" button
3. Select "Company-Profile-Backend-API.postman_collection.json"
4. The collection will be imported with all endpoints organized in folders

### Step 2: Import the Environment

1. In Postman, go to "Environments" tab
2. Click "Import"
3. Select "Company-Profile-Backend.postman_environment.json"
4. Select the imported environment from the dropdown

### Step 3: Configure Base URL

1. In the environment variables, update `BASE_URL` if your Laravel server runs on a different port or URL
2. Default is set to `http://localhost:8000`

### Step 4: Start Testing

#### Authentication Flow:

1. **Register a new user** using the "Register User" request in the Authentication folder
2. **Login** using the "Login User" request - this will automatically set the `AUTH_TOKEN` variable
3. All other requests will use this token automatically

## API Endpoints Overview

### 🔐 Authentication

-   `POST /api/register` - Register new user
-   `POST /api/login` - Login user (auto-saves token)
-   `GET /api/user` - Get current user info
-   `POST /api/logout` - Logout user

### 📄 PDF Management

-   `GET /api/pdfs` - Get all PDFs
-   `GET /api/pdfs/last` - Get latest PDF
-   `POST /api/pdfs` - Create new PDF
-   `GET /api/pdfs/{id}` - Get specific PDF
-   `PUT /api/pdfs/{id}` - Update PDF
-   `DELETE /api/pdfs/{id}` - Delete PDF

### 📃 Page Management

-   `GET /api/pages` - Get all pages (filter by pdf_id)
-   `POST /api/pages` - Create new page
-   `GET /api/pages/{id}` - Get specific page
-   `PUT /api/pages/{id}` - Update page
-   `DELETE /api/pages/{id}` - Delete page
-   `POST /api/pages/reorder` - Reorder pages

### 📝 Section Management

-   `GET /api/sections` - Get all sections (filter by page_id)
-   `POST /api/sections` - Create new section
-   `GET /api/sections/{id}` - Get specific section
-   `PUT /api/sections/{id}` - Update section
-   `DELETE /api/sections/{id}` - Delete section
-   `POST /api/sections/reorder` - Reorder sections

### 📎 Attachment Management

-   `GET /api/attachments` - Get all attachments (filter by pdf_id)
-   `POST /api/attachments` - Upload new attachment
-   `GET /api/attachments/{id}` - Get specific attachment
-   `PUT /api/attachments/{id}` - Update attachment
-   `DELETE /api/attachments/{id}` - Delete attachment
-   `GET /api/attachments/{id}/download` - Download attachment
-   `POST /api/attachments/reorder` - Reorder attachments

### ⚙️ Settings Management

-   `GET /api/settings` - Get all settings
-   `POST /api/settings` - Create new setting
-   `GET /api/settings/{id}` - Get specific setting
-   `PUT /api/settings/{id}` - Update setting

### 📁 File Management

-   `GET /api/files/{path}` - Access public files

## Environment Variables

| Variable        | Description                      | Default Value           |
| --------------- | -------------------------------- | ----------------------- |
| `BASE_URL`      | Backend server URL               | `http://localhost:8000` |
| `AUTH_TOKEN`    | Authentication token             | Auto-filled after login |
| `PDF_ID`        | Sample PDF ID for testing        | `1`                     |
| `PAGE_ID`       | Sample Page ID for testing       | `1`                     |
| `SECTION_ID`    | Sample Section ID for testing    | `1`                     |
| `ATTACHMENT_ID` | Sample Attachment ID for testing | `1`                     |
| `SETTING_ID`    | Sample Setting ID for testing    | `1`                     |

## Sample Request Bodies

### Authentication

```json
// Register
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}

// Login
{
    "email": "john.doe@example.com",
    "password": "password123"
}
```

### PDF Creation

```json
{
    "title": "Company Profile 2025",
    "description": "Annual company profile document"
}
```

### Page Creation

```json
{
    "pdf_id": 1,
    "title": "Introduction Page",
    "content": "This is the introduction page content",
    "order": 1
}
```

### Section Creation

```json
{
    "page_id": 1,
    "title": "Company Overview",
    "content": "This section contains information about our company",
    "type": "text",
    "order": 1
}
```

### Settings Creation

```json
{
    "key": "company_name",
    "value": "Your Company Name",
    "type": "string",
    "description": "The name of the company"
}
```

## Notes

1. **Authentication Required**: All endpoints except registration, login, and public file access require authentication
2. **File Uploads**: Attachment endpoints use `multipart/form-data` for file uploads
3. **Response Format**: All API responses follow a consistent JSON structure with `status`, `code`, `message`, and `data` fields
4. **Error Handling**: Validation errors and other errors are returned in a standardized format

## Running the Backend

Make sure your Laravel backend is running:

```bash
cd BackEnd
php artisan serve
```

The API will be available at `http://localhost:8000`

## Support

If you encounter any issues with the API endpoints, check:

1. Backend server is running
2. Database migrations are executed
3. Authentication token is valid
4. Request format matches the examples provided

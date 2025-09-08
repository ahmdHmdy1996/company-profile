# Company Profile Frontend-Backend Integration

This document explains the integration between the React frontend and Laravel backend for the Company Profile application.

## Architecture Overview

The application uses a modern full-stack architecture:

### Frontend (React + Vite)

- **Framework**: React 19 with Vite build tool
- **Styling**: Tailwind CSS
- **State Management**: React Context API for authentication
- **HTTP Client**: Axios for API calls
- **UI Components**: Custom components with Lucide React icons

### Backend (Laravel)

- **Framework**: Laravel (PHP)
- **Authentication**: Laravel Sanctum (API tokens)
- **Database**: SQLite (configurable)
- **API**: RESTful API with JSON responses

## Integration Features

### 1. Authentication System

- **Registration**: Users can create new accounts
- **Login/Logout**: Secure authentication with API tokens
- **Token Management**: Automatic token handling with axios interceptors
- **Context Management**: Global auth state using React Context

### 2. Company Profile Management

- **CRUD Operations**: Create, Read, Update, Delete company profiles
- **Data Persistence**: All profiles saved to backend database
- **User Isolation**: Each user can only access their own profiles
- **Template Support**: Multi-section profile templates

### 3. File Upload

- **Image Upload**: Support for logo and background images
- **File Validation**: Server-side validation for image types and sizes
- **Storage**: Files stored in Laravel's public storage

## File Structure

```
FrontEnd/
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx           # Authentication modal
│   │   ├── Dashboard.jsx           # Main application dashboard
│   │   ├── LoadingComponents.jsx   # Loading and error states
│   │   └── SavedProfilesModal.jsx  # Profile management modal
│   ├── contexts/
│   │   └── AuthContext.jsx         # Global authentication state
│   ├── hooks/
│   │   ├── useAuth.js             # Authentication hook
│   │   └── useCompanyProfiles.js  # Profile management hook
│   └── services/
│       ├── apiClient.js           # Axios configuration
│       ├── authService.js         # Authentication API calls
│       ├── companyProfileService.js # Profile API calls
│       └── api.js                 # Legacy API service (deprecated)

BackEnd/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── AuthController.php     # Authentication endpoints
│   │   └── CompanyProfileController.php # Profile endpoints
│   └── Models/
│       ├── User.php              # User model
│       └── CompanyProfile.php    # Profile model
├── routes/
│   └── api.php                   # API routes definition
└── database/
    └── migrations/               # Database schema
```

## API Endpoints

### Authentication

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Company Profiles

- `GET /api/company-profiles` - Get user's profiles
- `POST /api/company-profiles` - Create new profile
- `GET /api/company-profiles/{id}` - Get specific profile
- `PUT /api/company-profiles/{id}` - Update profile
- `DELETE /api/company-profiles/{id}` - Delete profile

### File Upload

- `POST /api/upload-image` - Upload images

## Environment Configuration

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Backend (.env)

```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
SESSION_DRIVER=file
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

## Development Workflow

### 1. Start Backend Server

```bash
cd BackEnd
php artisan serve
# Server will run on http://localhost:8000
```

### 2. Start Frontend Server

```bash
cd FrontEnd
npm run dev
# Server will run on http://localhost:5173
```

### 3. Database Setup

```bash
cd BackEnd
php artisan migrate
```

## Key Integration Features

### 1. Automatic Token Management

The frontend automatically handles authentication tokens:

- Stores tokens in localStorage
- Adds Authorization header to requests
- Removes tokens on logout or 401 errors

### 2. Error Handling

Comprehensive error handling across the application:

- Network errors
- Validation errors
- Authentication errors
- Server errors

### 3. Loading States

User-friendly loading indicators:

- Spinner components
- Disabled states during operations
- Progress feedback

### 4. State Synchronization

Real-time state updates:

- Profile lists update after operations
- Authentication state reflects across components
- Optimistic updates with rollback on errors

## Security Features

### 1. CORS Configuration

Backend configured to accept requests from frontend origin.

### 2. Input Validation

- Server-side validation for all inputs
- File type and size validation
- SQL injection protection

### 3. Authentication Protection

- Protected routes require authentication
- User isolation (users can only access their data)
- Token expiration handling

## Testing the Integration

1. **Start both servers** (backend and frontend)
2. **Open browser** to http://localhost:5173
3. **Register a new account** or login
4. **Create a company profile** and save it
5. **Verify data persistence** by refreshing the page
6. **Test CRUD operations** (create, read, update, delete)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **Authentication Failures**: Check token storage and API endpoints
3. **File Upload Issues**: Verify storage permissions and file size limits
4. **Database Errors**: Run migrations and check database connection

### Debug Steps

1. Check browser console for errors
2. Verify API endpoints in Network tab
3. Check backend logs for server errors
4. Validate environment variables

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live collaboration
2. **Advanced File Management**: Multiple file types, drag-and-drop
3. **Profile Sharing**: Public profile URLs and sharing features
4. **Version Control**: Profile version history and rollback
5. **Export Features**: PDF generation, multiple formats
6. **Advanced Authentication**: OAuth, 2FA, role-based access

## Dependencies

### Frontend

- React 19
- Axios for HTTP requests
- Tailwind CSS for styling
- Lucide React for icons
- React Context for state management

### Backend

- Laravel Framework
- Laravel Sanctum for authentication
- SQLite/MySQL for database
- Laravel Storage for file handling

This integration provides a solid foundation for a modern, scalable company profile management system with secure authentication and data persistence.

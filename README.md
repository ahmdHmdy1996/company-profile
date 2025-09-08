# Company Profile Development Setup

## Quick Start Guide

### Prerequisites

- Node.js (v18 or higher)
- PHP (v8.1 or higher)
- Composer
- Git

### Backend Setup

1. **Navigate to Backend Directory**

   ```bash
   cd BackEnd
   ```

2. **Install Dependencies**

   ```bash
   composer install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Setup**

   ```bash
   php artisan migrate
   ```

5. **Start Development Server**
   ```bash
   php artisan serve
   ```
   Backend will be available at: http://localhost:8000

### Frontend Setup

1. **Navigate to Frontend Directory**

   ```bash
   cd FrontEnd
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Frontend will be available at: http://localhost:5173

### Testing the Integration

1. Open your browser to http://localhost:5173
2. Click on the user icon to register/login
3. Create a new company profile
4. Save the profile and verify it appears in the saved profiles list

### API Testing with curl

**Register a new user:**

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get user profiles (replace TOKEN with actual token):**

```bash
curl -X GET http://localhost:8000/api/company-profiles \
  -H "Authorization: Bearer TOKEN"
```

### Common Issues

1. **CORS Errors**: Make sure both servers are running on correct ports
2. **PHP not found**: Install PHP and add to system PATH
3. **Composer not found**: Install Composer globally
4. **Database errors**: Check database connection in .env file

### File Structure

```
company-profile/
├── BackEnd/                 # Laravel API server
│   ├── app/
│   ├── routes/api.php      # API routes
│   ├── database/           # Migrations and models
│   └── .env               # Backend configuration
├── FrontEnd/               # React application
│   ├── src/
│   ├── package.json       # Frontend dependencies
│   └── .env              # Frontend configuration
└── INTEGRATION_GUIDE.md  # Detailed integration docs
```

### Development Workflow

1. **Backend Changes**: Modify controllers, models, or routes in `/BackEnd`
2. **Frontend Changes**: Update components, services, or hooks in `/FrontEnd/src`
3. **Database Changes**: Create migrations with `php artisan make:migration`
4. **Testing**: Use browser dev tools and backend logs for debugging

### Production Deployment

1. **Frontend Build**:

   ```bash
   npm run build
   ```

2. **Backend Optimization**:
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   ```

For detailed integration information, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

# Company Profile Builder - Implementation Summary

## What Was Accomplished

### 1. Updated Frontend Templates

-   **Modified Cover Template**: Updated `src/templates/templateRegistry.jsx` to support both image logos and text logos
-   **Added logoImage field**: The Cover template now accepts a `logoImage` field that displays an uploaded image
-   **Backward Compatibility**: Still supports text logos via `logoText` field

### 2. Laravel Backend Setup with Authentication

-   **Created Laravel Project**: Set up complete Laravel backend in `company-profile-backend/` directory
-   **Authentication System**: Implemented Laravel Sanctum for API token authentication
-   **Database Configuration**: Configured SQLite database for easy development
-   **Migration Created**: Database tables for users, company profiles, and personal access tokens
-   **API Controller**: Complete REST API for managing company profiles with user authentication
-   **Image Upload**: Dedicated endpoint for handling image uploads (protected)

### 3. Key Files Created/Modified

#### Frontend Changes:

-   `src/templates/templateRegistry.jsx` - Updated Cover template with image logo support

#### Backend Files:

-   `app/Http/Controllers/Api/CompanyProfileController.php` - Main API controller (protected)
-   `app/Http/Controllers/Api/AuthController.php` - Authentication controller
-   `app/Models/CompanyProfile.php` - Eloquent model with user relationship
-   `app/Models/User.php` - User model with API tokens support
-   `database/migrations/2025_09_07_000001_create_company_profiles_table.php` - Database schema
-   `database/migrations/2025_09_07_164602_add_user_id_to_company_profiles_table.php` - User relationship
-   `routes/api.php` - API route definitions with authentication
-   `database/database.sqlite` - SQLite database file
-   `config/cors.php` - CORS configuration for frontend integration

## API Endpoints

### Authentication (Public)

```
POST   /api/register              - Register new user
POST   /api/login                 - Login user
```

### Protected Routes (Requires Authentication)

```
GET    /api/user                  - Get authenticated user
POST   /api/logout                - Logout user
GET    /api/company-profiles      - List user's profiles
POST   /api/company-profiles      - Create new profile
GET    /api/company-profiles/{id} - Get specific user profile
PUT    /api/company-profiles/{id} - Update user profile
DELETE /api/company-profiles/{id} - Delete user profile
POST   /api/upload-image          - Upload images
```

## Frontend Integration Guide

### 1. Create Authentication API Service

Create `src/services/api.js`:

```javascript
const API_BASE_URL = "http://localhost:8000/api";

class AuthService {
    static setToken(token) {
        localStorage.setItem("auth_token", token);
    }

    static getToken() {
        return localStorage.getItem("auth_token");
    }

    static removeToken() {
        localStorage.removeItem("auth_token");
    }

    static getAuthHeaders() {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}

export class CompanyProfileAPI {
    // Authentication methods
    static async register(name, email, password, passwordConfirmation) {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            }),
        });

        const data = await response.json();
        if (data.success) {
            AuthService.setToken(data.token);
        }
        return data;
    }

    static async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.success) {
            AuthService.setToken(data.token);
        }
        return data;
    }

    static async logout() {
        const response = await fetch(`${API_BASE_URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...AuthService.getAuthHeaders(),
            },
        });

        AuthService.removeToken();
        return response.json();
    }

    static async getUser() {
        const response = await fetch(`${API_BASE_URL}/user`, {
            headers: AuthService.getAuthHeaders(),
        });
        return response.json();
    }

    // Protected API methods
    static async uploadImage(file, type = "logo") {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", type);

        const response = await fetch(`${API_BASE_URL}/upload-image`, {
            method: "POST",
            headers: AuthService.getAuthHeaders(),
            body: formData,
        });

        return response.json();
    }

    static async saveProfile(
        templateId,
        data,
        name = null,
        description = null
    ) {
        const response = await fetch(`${API_BASE_URL}/company-profiles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...AuthService.getAuthHeaders(),
            },
            body: JSON.stringify({
                template_id: templateId,
                data,
                name,
                description,
            }),
        });

        return response.json();
    }

    static async getProfiles() {
        const response = await fetch(`${API_BASE_URL}/company-profiles`, {
            headers: AuthService.getAuthHeaders(),
        });
        return response.json();
    }

    // ... other protected methods
}
```

### 2. Create Login/Register Components

Create `src/components/AuthModal.jsx`:

```javascript
import { useState } from "react";
import { CompanyProfileAPI } from "../services/api";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let result;
            if (isLogin) {
                result = await CompanyProfileAPI.login(
                    formData.email,
                    formData.password
                );
            } else {
                result = await CompanyProfileAPI.register(
                    formData.name,
                    formData.email,
                    formData.password,
                    formData.password_confirmation
                );
            }

            if (result.success) {
                onSuccess(result.user);
                onClose();
            } else {
                setError(result.message || "Authentication failed");
            }
        } catch (err) {
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-6">
                    {isLogin ? "Login" : "Register"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                required
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={formData.password_confirmation}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password_confirmation: e.target.value,
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 text-red-600 text-sm">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading
                            ? "Loading..."
                            : isLogin
                            ? "Login"
                            : "Register"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:underline"
                    >
                        {isLogin
                            ? "Need an account? Register"
                            : "Have an account? Login"}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full text-gray-500 hover:text-gray-700"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
```

### 3. Update Dashboard Component

Add authentication state to your main `Dashboard.jsx`:

```javascript
import { useState, useEffect } from "react";
import { CompanyProfileAPI } from "../services/api";
import AuthModal from "./AuthModal";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const result = await CompanyProfileAPI.getUser();
            if (result.success) {
                setUser(result.user);
                loadProfiles();
            }
        } catch (error) {
            // User not authenticated
        }
    };

    const loadProfiles = async () => {
        try {
            const result = await CompanyProfileAPI.getProfiles();
            if (result.success) {
                setProfiles(result.data);
            }
        } catch (error) {
            console.error("Failed to load profiles:", error);
        }
    };

    const handleLogout = async () => {
        await CompanyProfileAPI.logout();
        setUser(null);
        setProfiles([]);
    };

    const handleSave = async (templateId, data) => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }

        try {
            const result = await CompanyProfileAPI.saveProfile(
                templateId,
                data
            );
            if (result.success) {
                alert("Profile saved successfully!");
                loadProfiles();
            }
        } catch (error) {
            alert("Failed to save profile");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm border-b px-6 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        Company Profile Builder
                    </h1>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span>Welcome, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-800"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Login
                        </button>
                    )}
                </div>
            </header>

            {/* Your existing dashboard content */}

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={(userData) => {
                    setUser(userData);
                    loadProfiles();
                }}
            />
        </div>
    );
}
```

Add image field support to `src/components/EditorPanel.jsx`:

```javascript
{
    field.type === "image" && (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
            </label>
            <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const result = await CompanyProfileAPI.uploadImage(
                            file,
                            "logo"
                        );
                        handleFieldChange(field.key, result.url);
                    }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {data[field.key] && (
                <img
                    src={data[field.key]}
                    alt="Preview"
                    className="mt-2 w-16 h-16 object-cover rounded"
                />
            )}
        </div>
    );
}
```

### 4. Update EditorPanel Component

Add image field support to `src/components/EditorPanel.jsx`:

```javascript
{
    field.type === "image" && (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
            </label>
            <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        try {
                            const result = await CompanyProfileAPI.uploadImage(
                                file,
                                "logo"
                            );
                            if (result.success) {
                                handleFieldChange(field.key, result.url);
                            }
                        } catch (error) {
                            alert("Upload failed. Please login first.");
                        }
                    }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {data[field.key] && (
                <img
                    src={data[field.key]}
                    alt="Preview"
                    className="mt-2 w-16 h-16 object-cover rounded"
                />
            )}
        </div>
    );
}
```

### 5. Template Field Definition

The Cover template now includes the logoImage field:

```javascript
fields: [
  { key: "headline", label: "Headline", type: "textarea" },
  { key: "subtitle", label: "Subtitle" },
  { key: "website", label: "Website" },
  { key: "logoText", label: "Logo Text" },
  { key: "logoImage", label: "Logo Image", type: "image" },
],
```

## How to Run

### Backend (Laravel)

```bash
cd company-profile-backend
php artisan serve
# Runs on http://localhost:8000
```

### Frontend (React)

```bash
npm run dev
# Runs on http://localhost:5173
```

## Next Steps

1. **CORS Configuration**: Add CORS middleware to Laravel for frontend API calls
2. **Error Handling**: Implement proper error handling in frontend components
3. **Validation**: Add client-side validation for image uploads
4. **Loading States**: Add loading indicators during image uploads
5. **Image Optimization**: Add image resizing/compression on upload
6. **Background Images**: Extend image support to background images

## ✅ **Authentication System Complete**

### **What's Now Protected:**

1. **Profile Management**: Only authenticated users can create, view, edit, and delete their own profiles
2. **Image Uploads**: Logo and background image uploads require authentication
3. **User Isolation**: Users can only access their own profiles
4. **Secure API**: All sensitive endpoints protected with Laravel Sanctum tokens

### **Ready to Use:**

1. **Backend Server**: Running on `http://localhost:8000`
2. **Registration/Login**: Full user management system
3. **Token Authentication**: Secure API access with bearer tokens
4. **Profile Ownership**: Each profile belongs to a specific user
5. **Image Storage**: Secure file uploads with proper permissions

### **Database Schema Updates:**

-   `users` table: For user accounts
-   `personal_access_tokens` table: For API tokens
-   `company_profiles` table: Now includes `user_id` foreign key

The system now provides complete security - users must register/login to save profiles and upload images. Each user can only access their own data.

## How to Run

### Backend (Laravel)

```bash
cd company-profile-backend
php artisan serve
# Runs on http://localhost:8000
```

### Frontend (React)

```bash
npm run dev
# Runs on http://localhost:5173
```

## Next Steps

1. **Implement Frontend Auth**: Add the AuthModal component and update Dashboard
2. **Add Error Handling**: Handle authentication errors gracefully
3. **Add Loading States**: Show loading indicators during API calls
4. **Profile Management**: Add UI for viewing and managing saved profiles
5. **Export Features**: Add PDF export functionality for completed profiles

The implementation now supports both text and image logos, with a complete backend API for data persistence, image management, and user authentication.

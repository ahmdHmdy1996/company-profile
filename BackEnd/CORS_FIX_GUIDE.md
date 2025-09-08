# CORS Production Fix Guide

## Problem Description

The frontend application at `https://company-profile.codgoo.com` is unable to access the backend API at `https://backend-company-profile.codgoo.com/api/login` due to a CORS (Cross-Origin Resource Sharing) policy error:

```
Access to XMLHttpRequest at 'https://backend-company-profile.codgoo.com/api/login' 
from origin 'https://company-profile.codgoo.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Root Cause

Laravel was using the default `config/cors.php` configuration in production instead of the production-specific `config/cors.production.php` configuration. The default configuration allows all origins (`*`), but the production configuration specifically allows the frontend domain.

## Solution Applied

### 1. Updated AppServiceProvider

Modified `app/Providers/AppServiceProvider.php` to automatically load the production CORS configuration when the application is running in production environment:

```php
public function boot(): void
{
    // Load production CORS configuration in production environment
    if (app()->environment('production')) {
        $corsConfig = require config_path('cors.production.php');
        config(['cors' => $corsConfig]);
    }
}
```

### 2. Production CORS Configuration

The `config/cors.production.php` file contains the correct settings:

```php
'allowed_origins' => [
    'https://company-profile.codgoo.com',
    'https://www.company-profile.codgoo.com',
    'http://localhost:5173', // For local development
    'http://localhost:3000', // For local development
],
'supports_credentials' => true,
```

## Deployment Steps

### Option 1: Using the Fix Script (Recommended)

1. **Upload the updated files to production server:**
   ```bash
   # Upload AppServiceProvider.php and fix_cors_production.php
   scp app/Providers/AppServiceProvider.php user@server:/path/to/laravel/app/Providers/
   scp fix_cors_production.php user@server:/path/to/laravel/
   ```

2. **Run the fix script on production server:**
   ```bash
   ssh user@server
   cd /path/to/laravel
   php fix_cors_production.php
   ```

### Option 2: Manual Steps

1. **Upload the updated AppServiceProvider.php:**
   ```bash
   scp app/Providers/AppServiceProvider.php user@server:/path/to/laravel/app/Providers/
   ```

2. **Clear and rebuild caches:**
   ```bash
   ssh user@server
   cd /path/to/laravel
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   php artisan cache:clear
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

## Verification Steps

### 1. Test CORS Configuration

```bash
# Test with curl
curl -H "Origin: https://company-profile.codgoo.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://backend-company-profile.codgoo.com/api/login
```

**Expected Response Headers:**
```
Access-Control-Allow-Origin: https://company-profile.codgoo.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN
Access-Control-Allow-Credentials: true
```

### 2. Test Frontend Login

1. Open the frontend application: `https://company-profile.codgoo.com`
2. Navigate to the login page
3. Attempt to log in with valid credentials
4. Check browser developer tools for CORS errors

### 3. Verify API Endpoints

```bash
# Test API endpoints
curl -X GET https://backend-company-profile.codgoo.com/api/user \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Origin: https://company-profile.codgoo.com"
```

## Troubleshooting

### Issue: Still getting CORS errors

**Solutions:**
1. **Check environment:**
   ```bash
   php artisan env
   # Should return 'production'
   ```

2. **Verify configuration is loaded:**
   ```bash
   php artisan tinker
   >>> dump(config('cors'));
   ```

3. **Clear all caches again:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan config:cache
   ```

### Issue: 500 Internal Server Error

**Solutions:**
1. **Check Laravel logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **Check web server logs:**
   ```bash
   # For Apache
   tail -f /var/log/apache2/error.log
   
   # For Nginx
   tail -f /var/log/nginx/error.log
   ```

### Issue: Configuration not taking effect

**Solutions:**
1. **Restart web server:**
   ```bash
   # For Apache
   sudo systemctl restart apache2
   
   # For Nginx
   sudo systemctl restart nginx
   ```

2. **Restart PHP-FPM (if applicable):**
   ```bash
   sudo systemctl restart php8.2-fpm
   ```

## Files Modified/Created

- ✅ `app/Providers/AppServiceProvider.php` - Updated with production CORS logic
- ✅ `fix_cors_production.php` - Automated fix script
- ✅ `CORS_FIX_GUIDE.md` - This documentation

## Expected Results

After applying this fix:

1. ✅ Frontend can successfully make API requests to backend
2. ✅ Login functionality works without CORS errors
3. ✅ All API endpoints are accessible from the frontend
4. ✅ Browser developer tools show no CORS-related errors
5. ✅ Production environment uses the correct CORS configuration

## Security Notes

- The production CORS configuration only allows specific domains
- Credentials are supported for authenticated requests
- Local development URLs are included for testing purposes
- The configuration is environment-specific and secure

## Support Resources

- **Laravel CORS Documentation:** https://laravel.com/docs/cors
- **MDN CORS Guide:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Deployment Verification:** `verify_deployment.php`
- **Server Testing Guide:** `SERVER_TESTING_GUIDE.md`
- **Migration Fix Guide:** `MIGRATION_FIX_GUIDE.md`
# Production Troubleshooting Guide

## Current Issues

### 1. CORS Policy Error
```
Access to XMLHttpRequest at 'https://backend-company-profile.codgoo.com/api/login' 
from origin 'https://company-profile.codgoo.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### 2. API Endpoint Not Found
The backend API is returning "This Page Does Not Exist" instead of processing API requests.

## Root Causes Analysis

### CORS Issue
- Laravel is using default `cors.php` instead of production-specific configuration
- Missing `Access-Control-Allow-Origin` header for the frontend domain

### API Routing Issue
- Web server not properly routing requests to Laravel
- Missing or incorrect `.htaccess` configuration
- Document root not pointing to `public/` directory
- Laravel routes not being recognized

## Complete Fix Solution

### Option 1: Automated Fix (Recommended)

1. **Upload the comprehensive fix script:**
   ```bash
   scp BackEnd/fix_production_issues.php user@server:/path/to/laravel/
   ```

2. **Run the fix script:**
   ```bash
   ssh user@server
   cd /path/to/laravel
   php fix_production_issues.php
   ```

### Option 2: Manual Step-by-Step Fix

#### Step 1: Fix CORS Configuration

1. **Upload updated AppServiceProvider:**
   ```bash
   scp BackEnd/app/Providers/AppServiceProvider.php user@server:/path/to/laravel/app/Providers/
   ```

2. **Verify production CORS config exists:**
   ```bash
   ssh user@server
   ls -la /path/to/laravel/config/cors.production.php
   ```

#### Step 2: Fix API Routing

1. **Check document root configuration:**
   ```bash
   # For Apache - check virtual host
   sudo nano /etc/apache2/sites-available/backend-company-profile.codgoo.com.conf
   
   # Document root should point to:
   DocumentRoot /path/to/laravel/public
   ```

2. **Verify .htaccess file:**
   ```bash
   cat /path/to/laravel/public/.htaccess
   ```

   If missing, create with this content:
   ```apache
   <IfModule mod_rewrite.c>
       <IfModule mod_negotiation.c>
           Options -MultiViews -Indexes
       </IfModule>

       RewriteEngine On

       # Handle Authorization Header
       RewriteCond %{HTTP:Authorization} .
       RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

       # Redirect Trailing Slashes If Not A Folder...
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteCond %{REQUEST_URI} (.+)/$
       RewriteRule ^ %1 [L,R=301]

       # Send Requests To Front Controller...
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteRule ^ index.php [L]
   </IfModule>
   ```

3. **Enable Apache modules:**
   ```bash
   sudo a2enmod rewrite
   sudo a2enmod headers
   sudo systemctl restart apache2
   ```

#### Step 3: Clear Caches and Optimize

```bash
cd /path/to/laravel
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Step 4: Fix File Permissions

```bash
chmod -R 755 /path/to/laravel/storage
chmod -R 755 /path/to/laravel/bootstrap/cache
chown -R www-data:www-data /path/to/laravel/storage
chown -R www-data:www-data /path/to/laravel/bootstrap/cache
```

## Verification Steps

### 1. Test API Endpoint Directly

```bash
# Test if API endpoint exists
curl -v https://backend-company-profile.codgoo.com/api/login

# Expected: Should return method not allowed (405) or validation error, NOT "Page Does Not Exist"
```

### 2. Test CORS Headers

```bash
# Test CORS preflight request
curl -H "Origin: https://company-profile.codgoo.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v https://backend-company-profile.codgoo.com/api/login

# Expected headers in response:
# Access-Control-Allow-Origin: https://company-profile.codgoo.com
# Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
# Access-Control-Allow-Headers: Accept, Authorization, Content-Type, X-Requested-With, X-CSRF-TOKEN
```

### 3. Test API Routes

```bash
# Check if routes are loaded
ssh user@server
cd /path/to/laravel
php artisan route:list --path=api

# Should show:
# POST | api/login | App\Http\Controllers\Api\AuthController@login
```

### 4. Test Frontend Login

1. Open browser developer tools
2. Navigate to `https://company-profile.codgoo.com`
3. Attempt login
4. Check Network tab for:
   - OPTIONS request to `/api/login` (should return 200 with CORS headers)
   - POST request to `/api/login` (should process login attempt)

## Common Issues and Solutions

### Issue: Still getting "This Page Does Not Exist"

**Possible Causes:**
1. Document root not pointing to `public/` directory
2. `.htaccess` file missing or not working
3. Apache mod_rewrite not enabled
4. Laravel not properly installed

**Solutions:**
```bash
# Check Apache virtual host configuration
sudo nano /etc/apache2/sites-available/backend-company-profile.codgoo.com.conf

# Ensure DocumentRoot points to:
DocumentRoot /path/to/laravel/public

# Enable site and restart Apache
sudo a2ensite backend-company-profile.codgoo.com
sudo systemctl restart apache2
```

### Issue: CORS headers still not present

**Solutions:**
1. Verify environment is set to "production":
   ```bash
   php artisan env
   ```

2. Check if CORS config is loaded:
   ```bash
   php artisan tinker
   >>> dump(config('cors'));
   ```

3. Restart web server:
   ```bash
   sudo systemctl restart apache2
   ```

### Issue: 500 Internal Server Error

**Solutions:**
1. Check Laravel logs:
   ```bash
   tail -f /path/to/laravel/storage/logs/laravel.log
   ```

2. Check Apache error logs:
   ```bash
   tail -f /var/log/apache2/error.log
   ```

3. Check file permissions:
   ```bash
   ls -la /path/to/laravel/storage
   ls -la /path/to/laravel/bootstrap/cache
   ```

## Web Server Configuration Examples

### Apache Virtual Host

```apache
<VirtualHost *:443>
    ServerName backend-company-profile.codgoo.com
    DocumentRoot /path/to/laravel/public
    
    SSLEngine on
    SSLCertificateFile /path/to/ssl/cert.pem
    SSLCertificateKeyFile /path/to/ssl/private.key
    
    <Directory /path/to/laravel/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/backend-company-profile-error.log
    CustomLog ${APACHE_LOG_DIR}/backend-company-profile-access.log combined
</VirtualHost>
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name backend-company-profile.codgoo.com;
    root /path/to/laravel/public;
    index index.php;
    
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## Files Created/Modified

- ✅ `fix_production_issues.php` - Comprehensive automated fix script
- ✅ `PRODUCTION_TROUBLESHOOTING_GUIDE.md` - This troubleshooting guide
- ✅ `app/Providers/AppServiceProvider.php` - Updated with CORS production logic
- ✅ `CORS_FIX_GUIDE.md` - CORS-specific fix guide

## Success Indicators

After applying fixes, you should see:

1. ✅ API endpoint responds (not "Page Does Not Exist")
2. ✅ CORS headers present in OPTIONS requests
3. ✅ Frontend can make API requests without CORS errors
4. ✅ Login functionality works
5. ✅ No errors in browser developer tools
6. ✅ Laravel logs show successful API requests

## Emergency Recovery

If something goes wrong:

1. **Restore from backup:**
   ```bash
   cp /backup/path/AppServiceProvider.php /path/to/laravel/app/Providers/
   ```

2. **Clear all caches:**
   ```bash
   php artisan optimize:clear
   ```

3. **Restart web server:**
   ```bash
   sudo systemctl restart apache2
   ```

## Support Resources

- **Laravel Documentation:** https://laravel.com/docs
- **CORS Documentation:** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **Apache mod_rewrite:** https://httpd.apache.org/docs/current/mod/mod_rewrite.html
- **Deployment Verification:** `verify_deployment.php`
- **Server Testing Guide:** `SERVER_TESTING_GUIDE.md`
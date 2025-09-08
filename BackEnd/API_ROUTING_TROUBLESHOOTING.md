# API Routing Troubleshooting Guide

## Problem Description

When calling `https://backend-company-profile.codgoo.com/api/login` in Postman or from the frontend, instead of getting a proper API response, you receive an HTML page with:

```html
<!DOCTYPE html>
<html>
<head>
    <title>This Page Does Not Exist</title>
</head>
<body>
    <div class="page-not-found">
        <h1>This Page Does Not Exist</h1>
        <p>Sorry, the page you are looking for could not be found.</p>
    </div>
</body>
</html>
```

## Root Cause Analysis

This issue occurs because **the web server is not properly routing requests to Laravel**. The server is returning a generic 404 page instead of processing the request through Laravel's routing system.

### Common Causes:

1. **Document Root Misconfiguration**: Web server document root is not pointing to Laravel's `public/` directory
2. **Missing .htaccess**: The `.htaccess` file in the public directory is missing or not working
3. **Mod_rewrite Disabled**: Apache's mod_rewrite module is not enabled
4. **Incorrect File Structure**: Laravel files are not properly structured for the hosting environment
5. **File Permissions**: Incorrect permissions preventing proper execution

## Quick Diagnosis

Run these commands to diagnose the issue:

```bash
# Test if the API endpoint should work
curl -X POST https://backend-company-profile.codgoo.com/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{}'

# Expected: 422 validation error
# Actual: "This Page Does Not Exist" HTML
```

```bash
# Test if Laravel is accessible at all
curl https://backend-company-profile.codgoo.com/

# Should show Laravel welcome page or proper response
```

## Solution 1: Automated Fix (Recommended)

### For General Laravel Deployments:

```bash
# Upload and run the diagnostic script
scp fix_api_routing.php user@server:/path/to/laravel/
ssh user@server
cd /path/to/laravel
php fix_api_routing.php
```

### For Hostinger/cPanel Deployments:

```bash
# Upload and run the Hostinger-specific fix
scp hostinger_deployment_fix.php user@server:/path/to/public_html/
ssh user@server
cd /path/to/public_html
php hostinger_deployment_fix.php
```

## Solution 2: Manual Step-by-Step Fix

### Step 1: Verify Laravel Installation

```bash
# Check if Laravel is properly installed
php artisan --version
php artisan route:list --path=api
```

Expected output should show your API routes:
```
POST | api/login    | App\Http\Controllers\Api\AuthController@login
POST | api/register | App\Http\Controllers\Api\AuthController@register
```

### Step 2: Fix Document Root (Apache)

**Problem**: Document root points to Laravel root instead of `public/` directory.

**Solution**: Update Apache virtual host configuration:

```apache
# /etc/apache2/sites-available/backend-company-profile.codgoo.com.conf
<VirtualHost *:443>
    ServerName backend-company-profile.codgoo.com
    DocumentRoot /path/to/laravel/public  # ← Must point to public/ directory
    
    <Directory /path/to/laravel/public>
        AllowOverride All
        Require all granted
    </Directory>
    
    # SSL configuration...
VirtualHost>
```

```bash
# Restart Apache
sudo systemctl restart apache2
```

### Step 3: Fix Document Root (Nginx)

```nginx
# /etc/nginx/sites-available/backend-company-profile.codgoo.com
server {
    listen 443 ssl;
    server_name backend-company-profile.codgoo.com;
    root /path/to/laravel/public;  # ← Must point to public/ directory
    index index.php;
    
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

```bash
# Restart Nginx
sudo systemctl restart nginx
```

### Step 4: Fix .htaccess File

**Problem**: Missing or incorrect `.htaccess` file in public directory.

**Solution**: Create/update `public/.htaccess`:

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Handle X-XSRF-Token Header
    RewriteCond %{HTTP:x-xsrf-token} .
    RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]

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

### Step 5: Enable Apache Modules

```bash
# Enable required Apache modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2
```

### Step 6: Fix File Permissions

```bash
# Set correct permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
chown -R www-data:www-data storage/
chown -R www-data:www-data bootstrap/cache/
```

### Step 7: Clear and Optimize Caches

```bash
# Clear all caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan optimize:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Solution 3: Hostinger/cPanel Specific Fix

**Problem**: Hostinger/cPanel requires a specific file structure where Laravel's `public/` contents must be in the `public_html/` root.

### Manual Hostinger Fix:

1. **Upload Laravel files to `public_html/`**
2. **Move `public/` folder contents to `public_html/` root**:
   ```bash
   mv public/* ./
   mv public/.htaccess ./
   rmdir public/
   ```

3. **Update `index.php` bootstrap path**:
   ```php
   // Change this line in index.php:
   $app = require_once __DIR__.'/../bootstrap/app.php';
   
   // To this:
   $app = require_once __DIR__.'/bootstrap/app.php';
   ```

4. **Update autoload path in `index.php`**:
   ```php
   // Change this line:
   require __DIR__.'/../vendor/autoload.php';
   
   // To this:
   require __DIR__.'/vendor/autoload.php';
   ```

### Automated Hostinger Fix:

Run the provided script:
```bash
php hostinger_deployment_fix.php
```

## Verification Steps

### 1. Test API Endpoints

```bash
# Test login endpoint (should return 422, not 404)
curl -X POST https://backend-company-profile.codgoo.com/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{}'

# Expected response:
{
  "message": "The email field is required. (and 1 more error)",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

```bash
# Test protected endpoint (should return 401, not 404)
curl https://backend-company-profile.codgoo.com/api/user

# Expected response:
{
  "message": "Unauthenticated."
}
```

### 2. Test CORS Headers

```bash
# Test CORS preflight
curl -H "Origin: https://company-profile.codgoo.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -v https://backend-company-profile.codgoo.com/api/login

# Should include CORS headers in response
```

### 3. Check Laravel Routes

```bash
# Verify routes are loaded
php artisan route:list --path=api

# Should show all API routes
```

## Common Error Messages and Solutions

### "This Page Does Not Exist"
- **Cause**: Web server not routing to Laravel
- **Solution**: Fix document root and .htaccess

### "500 Internal Server Error"
- **Cause**: File permissions or Laravel configuration
- **Solution**: Check logs, fix permissions, clear caches

### "404 Not Found" (plain text)
- **Cause**: Route not found in Laravel
- **Solution**: Check route definitions and cache

### "403 Forbidden"
- **Cause**: File permissions or directory access
- **Solution**: Fix file permissions and directory configuration

## Environment-Specific Notes

### Hostinger
- Requires files in `public_html/` root
- May need to contact support for mod_rewrite
- Check cPanel error logs

### DigitalOcean/AWS
- Usually requires proper virtual host configuration
- Check security groups and firewall rules

### Shared Hosting
- May have restrictions on .htaccess
- Contact hosting support if needed

## Files Created

- ✅ `fix_api_routing.php` - General diagnostic and fix script
- ✅ `hostinger_deployment_fix.php` - Hostinger-specific fix script
- ✅ `API_ROUTING_TROUBLESHOOTING.md` - This troubleshooting guide

## Success Indicators

After applying the fix, you should see:

1. ✅ API endpoints return proper JSON responses (not HTML)
2. ✅ Login endpoint returns 422 validation error (not 404)
3. ✅ Protected endpoints return 401 unauthorized (not 404)
4. ✅ CORS headers present in OPTIONS requests
5. ✅ Frontend can successfully communicate with backend
6. ✅ No "Page Does Not Exist" errors

## Emergency Recovery

If something goes wrong:

1. **Restore from backup**
2. **Clear all caches**: `php artisan optimize:clear`
3. **Restart web server**: `sudo systemctl restart apache2`
4. **Check error logs**: `tail -f storage/logs/laravel.log`

## Support Resources

- **Laravel Documentation**: https://laravel.com/docs/deployment
- **Apache mod_rewrite**: https://httpd.apache.org/docs/current/mod/mod_rewrite.html
- **Nginx Configuration**: https://laravel.com/docs/deployment#nginx
- **Hostinger Laravel Guide**: https://www.hostinger.com/tutorials/how-to-upload-laravel-project-to-hostinger

---

**Note**: This issue is purely a deployment/server configuration problem. The Laravel application code is correct and working properly. The fix involves ensuring the web server properly routes requests to Laravel's front controller (`public/index.php`).
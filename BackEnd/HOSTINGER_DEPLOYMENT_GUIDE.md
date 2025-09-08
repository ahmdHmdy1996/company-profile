# Hostinger Deployment Guide

## Your Domain Configuration
- **Backend API**: https://backend-company-profile.codgoo.com
- **Frontend**: https://company-profile.codgoo.com
- **Alternative Frontend**: https://www.company-profile.codgoo.com

## Database Configuration
- **Database Name**: u122956677_cp_test
- **Username**: u122956677_cp_test_admin
- **Password**: K6=q@Wl~OKb
- **Host**: localhost
- **Port**: 3306

## Pre-Deployment Steps

### 1. Prepare Production Environment File
- Copy `.env.production` to `.env` on your Hostinger server
- Update `APP_URL` with your actual domain
- Configure email settings if needed

### 2. Install Dependencies
```bash
composer install --optimize-autoloader --no-dev
```

### 3. Generate Application Key (if needed)
```bash
php artisan key:generate
```

### 4. Run Database Migrations
```bash
php artisan migrate --force
```

### 5. Optimize for Production
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Deployment Steps

### 1. Upload Files
- Upload all files except:
  - `.env` (use `.env.production` instead)
  - `node_modules/`
  - `.git/`
  - `tests/`
  - `storage/logs/*`

### 2. Set Permissions
Ensure these directories are writable (755 or 775):
- `storage/`
- `storage/app/`
- `storage/framework/`
- `storage/logs/`
- `bootstrap/cache/`

### 3. Configure Web Server
- Point your domain to the `public/` directory
- Ensure `.htaccess` is working for URL rewriting

### 4. Database Setup
- Create the database `u122956677_cp_test` in Hostinger control panel
- Run migrations: `php artisan migrate --force`
- Seed data if needed: `php artisan db:seed --force`

### 5. Final Configuration
- Clear all caches: `php artisan optimize:clear`
- Cache configurations: `php artisan optimize`

## Post-Deployment Checklist

- [ ] Database connection working
- [ ] API endpoints responding
- [ ] CORS configured for frontend domain
- [ ] SSL certificate installed
- [ ] Error logging working
- [ ] Email functionality (if used)

## Troubleshooting

### Common Issues
1. **500 Internal Server Error**
   - Check file permissions
   - Verify `.env` configuration
   - Check error logs in `storage/logs/`

2. **Database Connection Failed**
   - Verify database credentials
   - Ensure database exists
   - Check host/port settings

3. **CORS Issues**
   - Update `config/cors.php` with frontend domain
   - Clear config cache: `php artisan config:clear`

### Useful Commands
```bash
# Clear all caches
php artisan optimize:clear

# View current configuration
php artisan config:show

# Check database connection
php artisan tinker
# Then run: DB::connection()->getPdo()

# View logs
tail -f storage/logs/laravel.log
```

## Security Notes
- Never commit `.env` files to version control
- Use strong passwords for database
- Keep Laravel and dependencies updated
- Enable HTTPS/SSL
- Regularly backup database

## Quick Deployment with Script

After uploading files to Hostinger, you can use the automated deployment script:

```bash
php deploy.php
```

This script will:
- Set up environment configuration
- Install dependencies
- Run migrations
- Optimize the application
- Set proper permissions
- Run basic tests

## File Upload Checklist

### Files to Upload:
- All PHP files and directories
- `composer.json` and `composer.lock`
- `.env.production` (rename to `.env` on server)
- `public/` directory contents to your domain's public folder
- `storage/` directory (ensure it's writable)
- `bootstrap/cache/` directory

### Files NOT to Upload:
- `.env` (use `.env.production` instead)
- `node_modules/`
- `.git/`
- `tests/`
- `storage/logs/*` (will be created automatically)
- `vendor/` (will be installed via composer)

## Hostinger-Specific Configuration

### 1. File Manager Setup
- Upload files to `public_html/` or your domain folder
- Ensure `public/index.php` is in the web root
- Move Laravel files outside public_html for security (optional but recommended)

### 2. PHP Configuration
- Ensure PHP 8.1+ is selected in Hostinger control panel
- Enable required extensions: PDO, OpenSSL, Mbstring, Tokenizer, XML, Ctype, JSON

### 3. Database Setup in Hostinger
- Go to Hostinger control panel → Databases
- Create database: `u122956677_cp_test`
- Create user: `u122956677_cp_test_admin`
- Set password: `K6=q@Wl~OKb`
- Grant all privileges to the user

### 4. Domain Configuration
- Point your domain to the `public/` directory
- Or move `public/` contents to your domain root
- Update `.htaccess` if needed

## Environment Variables for Production

Key settings to update in `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://backend-company-profile.codgoo.com
LOG_LEVEL=error

# Database (already configured)
DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=u122956677_cp_test
DB_USERNAME=u122956677_cp_test_admin
DB_PASSWORD="K6=q@Wl~OKb"

# Email (configure with your Hostinger email)
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=your-email@codgoo.com
MAIL_PASSWORD=your-email-password
MAIL_ENCRYPTION=tls
```

## CORS Configuration for Production

Replace `config/cors.php` with `config/cors.production.php` and update allowed origins:

```php
'allowed_origins' => [
    'https://company-profile.codgoo.com',
    'https://www.company-profile.codgoo.com',
    'http://localhost:5173', // For local development
],
```

## Support
If you encounter issues, check:
1. Hostinger documentation
2. Laravel deployment documentation
3. Server error logs
4. Application logs in `storage/logs/`
5. Run `php deploy.php` for automated troubleshooting
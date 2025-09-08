# Server Testing Guide

## SSH Connection Details

**Server Access:**
```bash
ssh -p 65002 u122956677@148.135.133.26
```

**Server Information:**
- Host: `148.135.133.26`
- Port: `65002`
- Username: `u122956677`
- Backend Domain: `https://backend-company-profile.codgoo.com`
- Frontend Domain: `https://company-profile.codgoo.com`

## Quick Server Testing Steps

### 1. Connect to Server
```bash
ssh -p 65002 u122956677@148.135.133.26
```

### 2. Navigate to Project Directory
```bash
cd public_html
ls -la
```

### 3. Run Deployment Verification
```bash
php verify_deployment.php
```

### 4. Check Laravel Status
```bash
# Check if Laravel is working
php artisan --version

# Check routes
php artisan route:list

# Check database connection
php artisan migrate:status

# Clear caches (if needed)
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

### 5. Test API Endpoints

#### Test Registration Endpoint
```bash
curl -X POST https://backend-company-profile.codgoo.com/api/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

#### Test Login Endpoint
```bash
curl -X POST https://backend-company-profile.codgoo.com/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Test Protected Endpoint (use token from login response)
```bash
curl -X GET https://backend-company-profile.codgoo.com/api/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### 6. Check Server Logs
```bash
# Check Laravel logs
tail -f storage/logs/laravel.log

# Check web server error logs (location may vary)
tail -f /var/log/apache2/error.log
# OR
tail -f /var/log/nginx/error.log
```

### 7. File Permissions Check
```bash
# Check storage permissions
ls -la storage/
ls -la storage/app/
ls -la storage/logs/
ls -la bootstrap/cache/

# Fix permissions if needed
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
```

## Advanced Testing

### Database Testing
```bash
# Connect to MySQL directly
mysql -h localhost -u u122956677_company -p u122956677_company_profile

# Check tables
SHOW TABLES;

# Check users table
SELECT * FROM users LIMIT 5;

# Check company profiles
SELECT * FROM company_profiles LIMIT 5;
```

### Environment Configuration Check
```bash
# Check environment file
cat .env | grep -E "APP_|DB_|MAIL_"

# Verify APP_KEY is set
grep APP_KEY .env

# Check database configuration
grep DB_ .env
```

### CORS Testing
```bash
# Test CORS preflight request
curl -X OPTIONS https://backend-company-profile.codgoo.com/api/login \
  -H "Origin: https://company-profile.codgoo.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

## Troubleshooting Common Issues

### 1. 500 Internal Server Error
```bash
# Check Laravel logs
tail -20 storage/logs/laravel.log

# Check web server logs
tail -20 /var/log/apache2/error.log

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### 2. Database Connection Issues
```bash
# Test database connection
php artisan tinker
# Then in tinker:
DB::connection()->getPdo();
```

### 3. Permission Issues
```bash
# Fix storage permissions
sudo chown -R www-data:www-data storage/
sudo chown -R www-data:www-data bootstrap/cache/
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
```

### 4. CORS Issues
```bash
# Check if production CORS config is being used
php artisan config:show cors

# Verify CORS middleware is applied
php artisan route:list | grep api
```

## Performance Testing

### Load Testing with curl
```bash
# Simple load test (run multiple times)
for i in {1..10}; do
  curl -w "@curl-format.txt" -o /dev/null -s https://backend-company-profile.codgoo.com/api/register
done
```

### Create curl-format.txt for timing
```bash
cat > curl-format.txt << 'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

## Security Verification

### SSL Certificate Check
```bash
# Check SSL certificate
curl -I https://backend-company-profile.codgoo.com

# Detailed SSL info
openssl s_client -connect backend-company-profile.codgoo.com:443 -servername backend-company-profile.codgoo.com
```

### Security Headers Check
```bash
# Check security headers
curl -I https://backend-company-profile.codgoo.com/api/register
```

## Monitoring Commands

### Real-time Log Monitoring
```bash
# Monitor Laravel logs in real-time
tail -f storage/logs/laravel.log

# Monitor access logs
tail -f /var/log/apache2/access.log | grep api
```

### System Resource Monitoring
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
ps aux | grep php
```

## Quick Health Check Script

Create a quick health check script:

```bash
cat > health_check.sh << 'EOF'
#!/bin/bash
echo "=== Backend Health Check ==="
echo "Date: $(date)"
echo ""

echo "1. Checking if Laravel is accessible..."
curl -s -o /dev/null -w "%{http_code}" https://backend-company-profile.codgoo.com/api/register
echo ""

echo "2. Checking database connection..."
php artisan migrate:status | head -5
echo ""

echo "3. Checking storage permissions..."
ls -la storage/ | head -3
echo ""

echo "4. Checking recent errors..."
tail -5 storage/logs/laravel.log
echo ""

echo "=== Health Check Complete ==="
EOF

chmod +x health_check.sh
```

Run the health check:
```bash
./health_check.sh
```

## Emergency Recovery

If something goes wrong:

```bash
# 1. Backup current state
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# 2. Reset to known good state
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# 3. Regenerate optimizations
php artisan config:cache
php artisan route:cache

# 4. Check status
php verify_deployment.php
```

---

**Remember:**
- Always backup before making changes
- Monitor logs when testing
- Test one endpoint at a time
- Document any issues found
- Keep the verification script handy for quick checks

**Support:**
- Laravel Documentation: https://laravel.com/docs
- Hostinger Support: https://www.hostinger.com/help
- Server logs location: `storage/logs/laravel.log`
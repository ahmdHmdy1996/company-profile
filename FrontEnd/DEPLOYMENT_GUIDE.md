# Frontend Deployment Guide

## Domain Configuration

**Production Domains:**
- Frontend: `https://company-profile.codgoo.com`
- Backend API: `https://backend-company-profile.codgoo.com`

## Environment Configuration

### Development (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_BACKEND_URL=http://localhost:8000
```

### Production (.env.production)
```env
VITE_API_URL=https://backend-company-profile.codgoo.com/api
VITE_BACKEND_URL=https://backend-company-profile.codgoo.com
VITE_APP_TITLE=Company Profile Builder
VITE_APP_DESCRIPTION=Professional company profile generator
VITE_NODE_ENV=production
```

## Pre-Deployment Checklist

### 1. Environment Setup
- [x] Update `.env` with production backend URLs
- [x] Create `.env.production` file
- [x] Update `api.js` to use environment variables
- [ ] Test API connectivity with production backend

### 2. Build Configuration
- [ ] Install dependencies: `npm install`
- [ ] Run production build: `npm run build`
- [ ] Test build locally: `npm run preview`

### 3. Code Verification
- [x] Remove hardcoded localhost URLs
- [x] Verify API service uses environment variables
- [ ] Check for console.log statements (remove for production)
- [ ] Verify error handling for API failures

## Deployment Steps

### Option 1: Manual Deployment

1. **Build the application:**
   ```bash
   npm install
   npm run build
   ```

2. **Upload files:**
   - Upload the entire `dist/` folder contents to your web hosting
   - Ensure the backend API is accessible at `https://backend-company-profile.codgoo.com`

3. **Configure web server:**
   - Set up URL rewriting for SPA (Single Page Application)
   - Configure HTTPS redirect
   - Set proper MIME types for static assets

### Option 2: Automated Deployment Script

Create `deploy.js` in the frontend root:

```javascript
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting frontend deployment...');

try {
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build for production
  console.log('🔨 Building for production...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify build
  if (!fs.existsSync('./dist')) {
    throw new Error('Build failed - dist folder not found');
  }

  console.log('✅ Frontend build completed successfully!');
  console.log('📁 Upload the dist/ folder contents to your web server');
  console.log('🌐 Configure your domain to point to: https://company-profile.codgoo.com');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
```

## Web Server Configuration

### Apache (.htaccess)
```apache
RewriteEngine On
RewriteBase /

# Handle Angular and React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Nginx
```nginx
server {
    listen 80;
    server_name company-profile.codgoo.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name company-profile.codgoo.com;
    
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Post-Deployment Testing

### 1. Basic Functionality
- [ ] Website loads at `https://company-profile.codgoo.com`
- [ ] All pages render correctly
- [ ] Navigation works properly
- [ ] No console errors

### 2. API Integration
- [ ] User registration works
- [ ] User login works
- [ ] Profile creation/editing works
- [ ] Image upload functionality works
- [ ] Data persistence works

### 3. Performance
- [ ] Page load times are acceptable
- [ ] Images load properly
- [ ] No broken links or resources

## Troubleshooting

### Common Issues

**1. API Connection Failed**
- Verify backend is running at `https://backend-company-profile.codgoo.com`
- Check CORS configuration in backend
- Verify SSL certificates are valid

**2. 404 Errors on Refresh**
- Configure web server for SPA routing
- Ensure all routes redirect to index.html

**3. Environment Variables Not Working**
- Verify `.env.production` file exists
- Ensure variables start with `VITE_`
- Rebuild the application after changes

**4. Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Security Considerations

- Never commit `.env` files with sensitive data
- Use HTTPS for all production traffic
- Implement proper error handling to avoid exposing sensitive information
- Regularly update dependencies for security patches

## Monitoring

- Set up error tracking (e.g., Sentry)
- Monitor API response times
- Track user interactions and errors
- Set up uptime monitoring

## Support

For deployment issues:
1. Check browser console for errors
2. Verify network requests in browser dev tools
3. Check backend API logs
4. Review web server error logs

---

**Next Steps:**
1. Run `npm run build` to create production build
2. Upload `dist/` folder contents to web hosting
3. Configure domain DNS to point to hosting
4. Test all functionality with production URLs
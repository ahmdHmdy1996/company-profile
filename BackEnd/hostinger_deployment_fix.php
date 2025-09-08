<?php
/**
 * Hostinger/cPanel Deployment Fix Script
 * 
 * This script fixes the common issue where Laravel deployed on Hostinger/cPanel
 * returns "Page Does Not Exist" instead of processing API requests.
 * 
 * The issue occurs because:
 * 1. Laravel files are uploaded to public_html/ but the web server expects the public/ folder contents at the root
 * 2. The index.php file needs to be updated to point to the correct bootstrap path
 */

echo "=== Hostinger/cPanel Laravel Deployment Fix ===\n\n";

// Check current directory structure
echo "Current directory: " . getcwd() . "\n";
echo "Files in current directory:\n";
$files = scandir('.');
foreach ($files as $file) {
    if ($file !== '.' && $file !== '..') {
        echo "  - $file" . (is_dir($file) ? '/' : '') . "\n";
    }
}

echo "\n=== Deployment Structure Analysis ===\n";

// Check if we're in the Laravel root (has artisan)
if (file_exists('artisan')) {
    echo "✅ Found Laravel installation (artisan exists)\n";
    $isLaravelRoot = true;
} else {
    echo "❌ Not in Laravel root directory (artisan not found)\n";
    $isLaravelRoot = false;
}

// Check if we're in public_html with Laravel files
if (file_exists('public/index.php') && file_exists('app') && file_exists('config')) {
    echo "✅ Laravel project structure detected\n";
    $hasLaravelStructure = true;
} else {
    echo "❌ Laravel project structure not found\n";
    $hasLaravelStructure = false;
}

// Check if index.php exists in current directory (indicating public_html root)
if (file_exists('index.php') && !file_exists('artisan')) {
    echo "✅ Appears to be in public_html root\n";
    $isPublicHtmlRoot = true;
} else {
    $isPublicHtmlRoot = false;
}

echo "\n=== Applying Hostinger Fix ===\n";

if ($hasLaravelStructure) {
    echo "Detected Laravel files in current directory.\n";
    echo "Applying Hostinger deployment fix...\n\n";
    
    // Step 1: Move public folder contents to root
    echo "Step 1: Moving public/ folder contents to root...\n";
    
    if (is_dir('public')) {
        $publicFiles = scandir('public');
        foreach ($publicFiles as $file) {
            if ($file !== '.' && $file !== '..') {
                $source = 'public/' . $file;
                $destination = $file;
                
                if (!file_exists($destination)) {
                    if (is_dir($source)) {
                        echo "  Moving directory: $source -> $destination\n";
                        rename($source, $destination);
                    } else {
                        echo "  Moving file: $source -> $destination\n";
                        rename($source, $destination);
                    }
                } else {
                    echo "  Skipping $file (already exists)\n";
                }
            }
        }
        
        // Remove empty public directory
        if (count(scandir('public')) == 2) { // Only . and ..
            rmdir('public');
            echo "  Removed empty public/ directory\n";
        }
    } else {
        echo "  public/ directory not found or already moved\n";
    }
    
    // Step 2: Update index.php to point to correct bootstrap path
    echo "\nStep 2: Updating index.php bootstrap path...\n";
    
    if (file_exists('index.php')) {
        $indexContent = file_get_contents('index.php');
        
        // Update the bootstrap path
        $updatedContent = str_replace(
            "require_once __DIR__.'/../bootstrap/app.php';",
            "require_once __DIR__.'/bootstrap/app.php';",
            $indexContent
        );
        
        // Also update autoload path if needed
        $updatedContent = str_replace(
            "require __DIR__.'/../vendor/autoload.php';",
            "require __DIR__.'/vendor/autoload.php';",
            $updatedContent
        );
        
        if ($updatedContent !== $indexContent) {
            file_put_contents('index.php', $updatedContent);
            echo "  ✅ Updated index.php bootstrap paths\n";
        } else {
            echo "  ✅ index.php paths already correct\n";
        }
    } else {
        echo "  ❌ index.php not found\n";
    }
    
    // Step 3: Create/update .htaccess
    echo "\nStep 3: Creating/updating .htaccess...\n";
    
    $htaccessContent = <<<'HTACCESS'
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
HTACCESS;
    
    file_put_contents('.htaccess', $htaccessContent);
    echo "  ✅ Created/updated .htaccess\n";
    
    // Step 4: Set proper permissions
    echo "\nStep 4: Setting file permissions...\n";
    
    if (is_dir('storage')) {
        chmod('storage', 0755);
        echo "  ✅ Set storage/ permissions to 755\n";
        
        // Recursively set storage permissions
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator('storage', RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );
        
        foreach ($iterator as $item) {
            chmod($item, $item->isDir() ? 0755 : 0644);
        }
        echo "  ✅ Set recursive storage/ permissions\n";
    }
    
    if (is_dir('bootstrap/cache')) {
        chmod('bootstrap/cache', 0755);
        echo "  ✅ Set bootstrap/cache/ permissions to 755\n";
    }
    
    // Step 5: Clear and optimize caches
    echo "\nStep 5: Clearing and optimizing caches...\n";
    
    if (file_exists('artisan')) {
        echo "  Clearing configuration cache...\n";
        exec('php artisan config:clear 2>&1', $output, $return);
        
        echo "  Clearing route cache...\n";
        exec('php artisan route:clear 2>&1', $output, $return);
        
        echo "  Clearing view cache...\n";
        exec('php artisan view:clear 2>&1', $output, $return);
        
        echo "  Clearing application cache...\n";
        exec('php artisan cache:clear 2>&1', $output, $return);
        
        echo "  Optimizing for production...\n";
        exec('php artisan config:cache 2>&1', $output, $return);
        exec('php artisan route:cache 2>&1', $output, $return);
        exec('php artisan view:cache 2>&1', $output, $return);
        
        echo "  ✅ Caches cleared and optimized\n";
    }
    
    echo "\n=== Fix Applied Successfully ===\n";
    echo "✅ Laravel files restructured for Hostinger/cPanel\n";
    echo "✅ Bootstrap paths updated\n";
    echo "✅ .htaccess configured\n";
    echo "✅ File permissions set\n";
    echo "✅ Caches optimized\n";
    
} else {
    echo "❌ Laravel project structure not detected.\n";
    echo "\nPlease ensure you've uploaded all Laravel files to public_html/\n";
    echo "Required files/folders:\n";
    echo "  - app/\n";
    echo "  - bootstrap/\n";
    echo "  - config/\n";
    echo "  - database/\n";
    echo "  - public/\n";
    echo "  - resources/\n";
    echo "  - routes/\n";
    echo "  - storage/\n";
    echo "  - vendor/\n";
    echo "  - artisan\n";
    echo "  - composer.json\n";
}

echo "\n=== Testing Instructions ===\n";
echo "After running this fix, test your API endpoints:\n\n";
echo "1. Test with curl:\n";
echo "   curl -X POST https://backend-company-profile.codgoo.com/api/login \\\n";
echo "     -H 'Content-Type: application/json' \\\n";
echo "     -H 'Accept: application/json' \\\n";
echo "     -d '{}'\n\n";
echo "2. Expected result: 422 validation error (NOT 'Page Does Not Exist')\n\n";
echo "3. Test in browser:\n";
echo "   Visit: https://backend-company-profile.codgoo.com/api/user\n";
echo "   Expected: 401 Unauthorized (NOT 'Page Does Not Exist')\n\n";

echo "=== Environment Configuration ===\n";
echo "Don't forget to configure your .env file:\n";
echo "  - APP_ENV=production\n";
echo "  - APP_DEBUG=false\n";
echo "  - APP_URL=https://backend-company-profile.codgoo.com\n";
echo "  - Database credentials\n";
echo "  - CORS settings\n\n";

echo "=== Support ===\n";
echo "If you still get 'Page Does Not Exist' errors after this fix:\n";
echo "1. Check that mod_rewrite is enabled on your hosting\n";
echo "2. Verify .htaccess files are allowed\n";
echo "3. Contact Hostinger support if needed\n";
echo "4. Check error logs in cPanel\n\n";

echo "Fix script completed!\n";
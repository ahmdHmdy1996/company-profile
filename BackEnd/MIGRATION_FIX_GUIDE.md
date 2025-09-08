# Migration Fix Guide

## 🚨 Issue Description

The migration failed because of incorrect chronological ordering:

- `2025_01_15_000001_modify_company_profiles_data_field.php` (January 15, 2025) was trying to modify a table
- `2025_09_07_000001_create_company_profiles_table.php` (September 7, 2025) creates the table

Laravel runs migrations in chronological order, so the modification was attempted before table creation.

## ✅ Solution Applied

### 1. Fixed Migration Order
Renamed the modification migration to run after table creation:
- **Old**: `2025_01_15_000001_modify_company_profiles_data_field.php`
- **New**: `2025_09_07_164603_modify_company_profiles_data_field.php`

### 2. Correct Migration Sequence
Now migrations will run in this order:
1. `2025_09_07_000001_create_company_profiles_table.php` - Creates the table
2. `2025_09_07_164602_add_user_id_to_company_profiles_table.php` - Adds user_id column
3. `2025_09_07_164603_modify_company_profiles_data_field.php` - Modifies data field to longText

## 🔧 How to Fix on Production Server

### Option 1: Use the Fix Script (Recommended)
```bash
# Upload the fix script to your server
# Then run:
php fix_migration.php
```

### Option 2: Manual Steps
```bash
# 1. Check current migration status
php artisan migrate:status

# 2. Rollback the failed migration
php artisan migrate:rollback --step=1

# 3. Run migrations again (they will now run in correct order)
php artisan migrate --force

# 4. Verify all migrations completed
php artisan migrate:status
```

## 📊 Expected Migration Status After Fix

```
+------+----------------------------------------------------------+-------+
| Ran? | Migration                                                | Batch |
+------+----------------------------------------------------------+-------+
| Yes  | 0001_01_01_000000_create_users_table                    | 1     |
| Yes  | 0001_01_01_000001_create_cache_table                    | 1     |
| Yes  | 0001_01_01_000002_create_jobs_table                     | 1     |
| Yes  | 2025_09_07_000001_create_company_profiles_table         | 2     |
| Yes  | 2025_09_07_164347_create_personal_access_tokens_table   | 2     |
| Yes  | 2025_09_07_164602_add_user_id_to_company_profiles_table | 2     |
| Yes  | 2025_09_07_164603_modify_company_profiles_data_field    | 2     |
+------+----------------------------------------------------------+-------+
```

## 🔍 Verification Steps

### 1. Check Database Tables
```bash
# Connect to MySQL and verify tables exist
mysql -u u122956677_cp_test_admin -p u122956677_cp_test

# In MySQL:
SHOW TABLES;
DESCRIBE company_profiles;
```

### 2. Verify Table Structure
The `company_profiles` table should have:
- `id` (bigint, primary key)
- `user_id` (bigint, foreign key)
- `template_id` (varchar)
- `data` (longtext) - This should be longtext, not json
- `name` (varchar, nullable)
- `description` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable)

### 3. Test API Endpoints
```bash
# Run the deployment verification
php verify_deployment.php

# Test API endpoints
curl -X POST https://backend-company-profile.codgoo.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'
```

## 🚨 Troubleshooting

### If Rollback Fails
```bash
# Check which migrations are in the database
php artisan tinker
> DB::table('migrations')->get();

# Manually remove the failed migration record
> DB::table('migrations')->where('migration', '2025_01_15_000001_modify_company_profiles_data_field')->delete();
```

### If Table Already Exists Error
```bash
# Check if table exists but migration record is missing
php artisan tinker
> Schema::hasTable('company_profiles');

# If true, manually add migration records
> DB::table('migrations')->insert([
    'migration' => '2025_09_07_000001_create_company_profiles_table',
    'batch' => 2
  ]);
```

### Database Connection Issues
If you get database connection errors:
1. Verify `.env` file has correct database credentials
2. Test connection: `php artisan tinker` then `DB::connection()->getPdo()`
3. Check if database exists in Hostinger control panel

## 📁 Files Created/Modified

- ✅ **Renamed**: Migration file to correct chronological order
- ✅ **Created**: `fix_migration.php` - Automated fix script
- ✅ **Created**: `MIGRATION_FIX_GUIDE.md` - This guide
- ✅ **Existing**: `verify_deployment.php` - Deployment verification
- ✅ **Existing**: `SERVER_TESTING_GUIDE.md` - Server testing procedures

## 🎯 Success Indicators

✅ All migrations show "Yes" in migrate:status
✅ `company_profiles` table exists with correct structure
✅ `data` field is `longtext` type (not `json`)
✅ API endpoints respond correctly
✅ No database connection errors
✅ verify_deployment.php shows all green checkmarks

## 📞 Support

If you encounter issues:
1. Check Laravel logs: `tail -f storage/logs/laravel.log`
2. Review this guide's troubleshooting section
3. Use the verification script: `php verify_deployment.php`
4. Follow the server testing guide for comprehensive checks

---

**Note**: This fix ensures proper migration order and resolves the table dependency issue. The application should work correctly after applying these changes.
# دليل استخدام API للفرونت إند

## نظرة عامة
هذا الدليل يوضح كيفية استخدام API endpoints لنظام إدارة ملفات الشركة في تطبيق الفرونت إند.

## استيراد Postman Collection

### الخطوة 1: تحميل الملف
- قم بتحميل ملف `Company_Profile_API_Collection.postman_collection.json`
- افتح تطبيق Postman
- اضغط على "Import" في الزاوية العلوية اليسرى
- اختر الملف المحمل

### الخطوة 2: إعداد المتغيرات
بعد استيراد Collection، قم بتعديل المتغيرات التالية:

```
base_url: http://localhost:8000 (أو عنوان الخادم الخاص بك)
auth_token: (سيتم ملؤه تلقائياً بعد تسجيل الدخول)
company_profile_id: معرف ملف الشركة
page_content_id: معرف محتوى الصفحة
staff_member_id: معرف الموظف
project_id: معرف المشروع
```

## تدفق العمل الأساسي

### 1. المصادقة (Authentication)

#### تسجيل مستخدم جديد
```http
POST /api/register
Content-Type: application/json

{
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

#### تسجيل الدخول
```http
POST /api/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

**ملاحظة:** بعد تسجيل الدخول بنجاح، سيتم حفظ الـ token تلقائياً في متغير `auth_token`.

### 2. إدارة ملفات الشركة

#### إنشاء ملف شركة جديد
```http
POST /api/company-profiles
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
    "company_name": "اسم الشركة",
    "company_email": "company@example.com",
    "company_phone": "+966501234567",
    "company_website": "https://company.com",
    "company_address": "عنوان الشركة",
    "company_description": "وصف الشركة"
}
```

#### الحصول على جميع ملفات الشركة
```http
GET /api/company-profiles
Authorization: Bearer {{auth_token}}
```

### 3. إدارة الإعدادات

#### إعدادات الشركة
```http
# الحصول على الإعدادات
GET /api/company-profiles/{{company_profile_id}}/company-settings
Authorization: Bearer {{auth_token}}

# حفظ الإعدادات
POST /api/company-profiles/{{company_profile_id}}/company-settings
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
    "company_name": "اسم الشركة",
    "company_email": "info@company.com",
    "company_phone": "+966501234567",
    "company_website": "https://company.com",
    "company_address": "الرياض، المملكة العربية السعودية",
    "company_description": "وصف مفصل عن الشركة"
}
```

#### إعدادات الخلفية
```http
# الحصول على إعدادات الخلفية
GET /api/company-profiles/{{company_profile_id}}/background-settings
Authorization: Bearer {{auth_token}}

# حفظ إعدادات الخلفية
POST /api/company-profiles/{{company_profile_id}}/background-settings
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
    "default_background_color": "#ffffff",
    "background_image": "path/to/background.jpg",
    "background_opacity": 0.8,
    "background_repeat_pattern": "no-repeat"
}
```

#### إعدادات الثيم
```http
# الحصول على إعدادات الثيم
GET /api/company-profiles/{{company_profile_id}}/theme-settings
Authorization: Bearer {{auth_token}}

# حفظ إعدادات الثيم
POST /api/company-profiles/{{company_profile_id}}/theme-settings
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
    "selected_theme": "modern",
    "primary_color": "#007bff",
    "secondary_color": "#6c757d",
    "accent_color": "#28a745",
    "background_color": "#f8f9fa"
}
```

### 4. إدارة المحتوى

#### محتوى الصفحات
```http
# الحصول على جميع محتويات الصفحات
GET /api/company-profiles/{{company_profile_id}}/page-contents
Authorization: Bearer {{auth_token}}

# إنشاء محتوى صفحة جديد
POST /api/company-profiles/{{company_profile_id}}/page-contents
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
    "page_type": "about_us",
    "page_title": "من نحن",
    "page_subtitle": "تعرف على شركتنا",
    "page_content": "محتوى مفصل عن الشركة",
    "page_image": "path/to/about-image.jpg"
}
```

#### إدارة الموظفين
```http
# الحصول على جميع الموظفين
GET /api/company-profiles/{{company_profile_id}}/staff-members
Authorization: Bearer {{auth_token}}

# إضافة موظف جديد
POST /api/company-profiles/{{company_profile_id}}/staff-members
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
    "staff_name": "أحمد محمد",
    "staff_position": "مدير التطوير",
    "staff_image": "path/to/staff-photo.jpg",
    "staff_type": "Manager"
}

# تحديث بيانات موظف
PUT /api/company-profiles/{{company_profile_id}}/staff-members/{{staff_member_id}}
Authorization: Bearer {{auth_token}}
Content-Type: application/json

# حذف موظف
DELETE /api/company-profiles/{{company_profile_id}}/staff-members/{{staff_member_id}}
Authorization: Bearer {{auth_token}}
```

#### إدارة المشاريع
```http
# الحصول على جميع المشاريع
GET /api/company-profiles/{{company_profile_id}}/projects
Authorization: Bearer {{auth_token}}

# إضافة مشروع جديد
POST /api/company-profiles/{{company_profile_id}}/projects
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
    "project_title": "مشروع تطوير موقع إلكتروني",
    "project_subtitle": "موقع تجاري متكامل",
    "project_image": "path/to/project-image.jpg",
    "current_page_number": 1,
    "total_pages": 10
}
```

### 5. رفع الملفات

#### رفع صورة
```http
POST /api/upload-image
Authorization: Bearer {{auth_token}}
Content-Type: multipart/form-data

# في Postman، اختر Body > form-data
# أضف key: "image" من نوع File
# اختر الصورة المراد رفعها
```

## أنواع البيانات المدعومة

### أنواع الصفحات (page_type)
- `about_us`: من نحن
- `our_staff`: فريقنا
- `our_clients`: عملاؤنا
- `our_services`: خدماتنا
- `our_projects`: مشاريعنا

### أنواع الموظفين (staff_type)
- `CEO`: الرئيس التنفيذي
- `Manager`: مدير
- `Staff`: موظف
- `Junior Staff`: موظف مبتدئ

### أنواع الثيمات (selected_theme)
- `modern`: عصري
- `classic`: كلاسيكي
- `minimal`: بسيط
- `corporate`: مؤسسي

## معالجة الأخطاء

### رموز الاستجابة الشائعة
- `200`: نجح الطلب
- `201`: تم إنشاء المورد بنجاح
- `400`: خطأ في البيانات المرسلة
- `401`: غير مصرح (تحقق من الـ token)
- `404`: المورد غير موجود
- `422`: خطأ في التحقق من صحة البيانات
- `500`: خطأ في الخادم

### مثال على استجابة خطأ
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "company_name": [
            "The company name field is required."
        ]
    }
}
```

## نصائح للتطوير

1. **استخدم المتغيرات**: استفد من متغيرات Postman لتسهيل التبديل بين البيئات
2. **احفظ الـ Token**: الـ Collection مُعد لحفظ token تلقائياً بعد تسجيل الدخول
3. **اختبر التسلسل**: ابدأ بتسجيل الدخول، ثم إنشاء ملف شركة، ثم الإعدادات
4. **تحقق من الاستجابات**: راجع استجابات API للتأكد من صحة البيانات
5. **استخدم البيئات**: أنشئ بيئات منفصلة للتطوير والإنتاج

## الدعم
للمساعدة أو الاستفسارات، يرجى مراجعة:
- ملفات المشروع في مجلد `BackEnd`
- ملفات الـ Controllers في `app/Http/Controllers`
- ملفات الـ Models في `app/Models`
- ملف الـ Routes في `routes/api.php`
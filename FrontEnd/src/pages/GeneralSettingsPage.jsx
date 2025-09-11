import React, { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  DocumentTextIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../services/api';

const GeneralSettingsPage = () => {
  const [settings, setSettings] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_website: '',
    company_address: '',
    company_description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSettings();
      
      // Convert array of settings to object format
      const settingsObj = {};
      data.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });
      
      setSettings(settingsObj);
    } catch (error) {
      console.error('Error loading settings:', error);
      // Fallback to localStorage if API fails
      const savedSettings = localStorage.getItem('generalSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setMessage({ type: 'error', text: 'فشل في تحميل الإعدادات من الخادم، تم تحميل الإعدادات المحفوظة محلياً' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!settings.company_name.trim()) {
      newErrors.company_name = 'اسم الشركة مطلوب';
    }
    
    if (!settings.company_email.trim()) {
      newErrors.company_email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.company_email)) {
      newErrors.company_email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!settings.company_phone.trim()) {
      newErrors.company_phone = 'رقم الهاتف مطلوب';
    }
    
    if (settings.company_website && !/^https?:\/\/.+/.test(settings.company_website)) {
      newErrors.company_website = 'رابط الموقع يجب أن يبدأ بـ http:// أو https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'يرجى تصحيح الأخطاء أولاً' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Save each setting to the API
      const settingPromises = Object.entries(settings).map(async ([key, value]) => {
        try {
          // Try to update existing setting first
          const existingSettings = await apiService.getSettings();
          const existingSetting = existingSettings.find(s => s.key === key);
          
          if (existingSetting) {
            return await apiService.updateSetting(existingSetting.id, {
              key,
              value,
              type: 'string',
              description: getSettingDescription(key)
            });
          } else {
            return await apiService.createSetting({
              key,
              value,
              type: 'string',
              description: getSettingDescription(key)
            });
          }
        } catch (error) {
          console.error(`Error saving setting ${key}:`, error);
          throw error;
        }
      });
      
      await Promise.all(settingPromises);
      
      // Also save to localStorage as backup
      localStorage.setItem('generalSettings', JSON.stringify(settings));
      
      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'فشل في حفظ الإعدادات' });
    } finally {
      setLoading(false);
    }
  };

  const getSettingDescription = (key) => {
    const descriptions = {
      companyName: 'اسم الشركة',
      email: 'البريد الإلكتروني للشركة',
      phone: 'رقم هاتف الشركة',
      website: 'موقع الشركة الإلكتروني',
      address: 'عنوان الشركة',
      description: 'وصف الشركة'
    };
    return descriptions[key] || key;
  };

  const handleReset = () => {
    setSettings({
      company_name: '',
      company_email: '',
      company_phone: '',
      company_website: '',
      company_address: '',
      company_description: ''
    });
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const inputFields = [
    {
      key: 'company_name',
      label: 'اسم الشركة',
      icon: BuildingOfficeIcon,
      type: 'text',
      placeholder: 'أدخل اسم الشركة'
    },
    {
      key: 'company_email',
      label: 'البريد الإلكتروني',
      icon: EnvelopeIcon,
      type: 'email',
      placeholder: 'company@example.com'
    },
    {
      key: 'company_phone',
      label: 'رقم الهاتف',
      icon: PhoneIcon,
      type: 'tel',
      placeholder: '+966 50 123 4567'
    },
    {
      key: 'company_website',
      label: 'موقع الشركة',
      icon: GlobeAltIcon,
      type: 'url',
      placeholder: 'https://www.company.com'
    },
    {
      key: 'company_address',
      label: 'عنوان الشركة',
      icon: MapPinIcon,
      type: 'text',
      placeholder: 'أدخل عنوان الشركة'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <BuildingOfficeIcon className="w-8 h-8 text-blue-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">الإعدادات العامة</h1>
              <p className="text-gray-600 mt-1">إدارة معلومات الشركة الأساسية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckIcon className="w-5 h-5 ml-2" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5 ml-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputFields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.key} className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Icon className="w-4 h-4 ml-2" />
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={settings[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors[field.key] 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    disabled={loading}
                  />
                  {errors[field.key] && (
                    <p className="text-red-600 text-sm flex items-center">
                      <ExclamationTriangleIcon className="w-4 h-4 ml-1" />
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Company Description */}
          <div className="mt-6 space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <DocumentTextIcon className="w-4 h-4 ml-2" />
              وصف الشركة
            </label>
            <textarea
              value={settings.company_description}
              onChange={(e) => handleInputChange('company_description', e.target.value)}
              placeholder="أدخل وصف مختصر عن الشركة وأنشطتها"
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.company_description 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              disabled={loading}
            />
            {errors.company_description && (
              <p className="text-red-600 text-sm flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 ml-1" />
                {errors.company_description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4 space-x-reverse">
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إعادة تعيين
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 ml-2" />
                  حفظ الإعدادات
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Settings Preview */}
      <div className="mt-6 bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">معاينة البيانات</h2>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>اسم الشركة:</strong> {settings.company_name || 'غير محدد'}</div>
              <div><strong>البريد الإلكتروني:</strong> {settings.company_email || 'غير محدد'}</div>
              <div><strong>رقم الهاتف:</strong> {settings.company_phone || 'غير محدد'}</div>
              <div><strong>الموقع الإلكتروني:</strong> {settings.company_website || 'غير محدد'}</div>
              <div className="md:col-span-2"><strong>العنوان:</strong> {settings.company_address || 'غير محدد'}</div>
              <div className="md:col-span-2"><strong>الوصف:</strong> {settings.company_description || 'غير محدد'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
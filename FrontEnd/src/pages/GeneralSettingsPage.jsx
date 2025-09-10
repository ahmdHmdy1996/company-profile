import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Palette, 
  Building, 
  FileText, 
  Upload, 
  Save, 
  RotateCcw,
  Eye,
  Download,
  Image as ImageIcon,
  X,
  AlertCircle,
  LogIn
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import { SettingsService } from '../services';

const GeneralSettingsPage = ({ 
  companyData, 
  onUpdateCompanyData = () => {},
  backgroundSettings,
  onUpdateBackgroundSettings = () => {},
  themeSettings,
  onUpdateThemeSettings = () => {}
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('company');
  const [localCompanyData, setLocalCompanyData] = useState(companyData || {});
  const [localBackgroundSettings, setLocalBackgroundSettings] = useState(backgroundSettings || {});
  const [localThemeSettings, setLocalThemeSettings] = useState(themeSettings || {});
  const [previewBackground, setPreviewBackground] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalCompanyData(companyData || {});
  }, [companyData]);

  useEffect(() => {
    setLocalBackgroundSettings(backgroundSettings || {});
  }, [backgroundSettings]);

  useEffect(() => {
    setLocalThemeSettings(themeSettings || {});
  }, [themeSettings]);

  const tabs = [
    { id: 'company', label: 'Company Data', icon: Building },
    { id: 'background', label: 'Background Settings', icon: ImageIcon },
    { id: 'theme', label: 'Theme Settings', icon: Palette }
  ];

  const themes = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Modern and elegant design',
      colors: {
        primary: '#3B82F6',
        secondary: '#64748B',
        accent: '#10B981',
        background: '#F8FAFC'
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Professional and classic design',
      colors: {
        primary: '#1E40AF',
        secondary: '#374151',
        accent: '#059669',
        background: '#FFFFFF'
      }
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Creative and colorful design',
      colors: {
        primary: '#7C3AED',
        secondary: '#EC4899',
        accent: '#F59E0B',
        background: '#FEF3C7'
      }
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and clean design',
      colors: {
        primary: '#000000',
        secondary: '#6B7280',
        accent: '#DC2626',
        background: '#FFFFFF'
      }
    }
  ];

  // Helper function to detect changes
  const getChangedData = (original, current) => {
    console.log('مقارنة البيانات:', { original, current });
    const changes = {};
    for (const key in current) {
      const originalValue = JSON.stringify(original[key]);
      const currentValue = JSON.stringify(current[key]);
      console.log(`مقارنة ${key}:`, { originalValue, currentValue, isEqual: originalValue === currentValue });
      if (originalValue !== currentValue) {
        changes[key] = current[key];
      }
    }
    const hasChanges = Object.keys(changes).length > 0;
    console.log('النتيجة:', { changes, hasChanges });
    return hasChanges ? changes : null;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user');
      
      console.log('Auth token:', token ? 'موجود' : 'غير موجود');
      console.log('User data:', user ? 'موجود' : 'غير موجود');
      alert('بدء عملية الحفظ - تحقق من وحدة التحكم');
      
      if (!token || !user) {
        alert('يجب تسجيل الدخول أولاً لحفظ الإعدادات');
        return;
      }
      
      console.log("بدء حفظ الإعدادات...");
      console.log('البيانات الأصلية للشركة:', companyData);
      console.log('البيانات المحلية للشركة:', localCompanyData);
      console.log('البيانات الأصلية للخلفية:', backgroundSettings);
      console.log('البيانات المحلية للخلفية:', localBackgroundSettings);
      console.log('البيانات الأصلية للثيم:', themeSettings);
      console.log('البيانات المحلية للثيم:', localThemeSettings);
      
      // Detect changes and send only modified data
      const companyChanges = getChangedData(companyData || {}, localCompanyData);
      const backgroundChanges = getChangedData(backgroundSettings || {}, localBackgroundSettings);
      const themeChanges = getChangedData(themeSettings || {}, localThemeSettings);
      
      console.log('تغييرات بيانات الشركة:', companyChanges);
      console.log('تغييرات إعدادات الخلفية:', backgroundChanges);
      console.log('تغييرات إعدادات الثيم:', themeChanges);
      
      alert(`التغييرات المكتشفة:\nالشركة: ${companyChanges ? 'نعم' : 'لا'}\nالخلفية: ${backgroundChanges ? 'نعم' : 'لا'}\nالثيم: ${themeChanges ? 'نعم' : 'لا'}`);
      
      // Only send API calls for changed data
      if (companyChanges) {
        console.log('إرسال تغييرات بيانات الشركة...');
        await onUpdateCompanyData(companyChanges);
      }
      
      if (backgroundChanges) {
        console.log('إرسال تغييرات إعدادات الخلفية...');
        await onUpdateBackgroundSettings(backgroundChanges);
      }
      
      if (themeChanges) {
        console.log('إرسال تغييرات إعدادات الثيم...');
        await onUpdateThemeSettings(themeChanges);
      }
      
      if (!companyChanges && !backgroundChanges && !themeChanges) {
        console.log('لا توجد تغييرات للحفظ - سيتم إرسال البيانات الحالية للاختبار');
        // For testing purposes, send current data even if no changes detected
        console.log('إرسال البيانات الحالية للاختبار...');
        await onUpdateCompanyData(localCompanyData);
        console.log('تم إرسال البيانات بنجاح');
        alert('تم إرسال البيانات للاختبار');
        return;
      }
      
      console.log("تم حفظ الإعدادات بنجاح");
      alert('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreviewBackground(imageUrl);
        setLocalBackgroundSettings(prev => ({ 
          ...prev, 
          backgroundImage: imageUrl 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackgroundImage = () => {
    setPreviewBackground(null);
    setLocalBackgroundSettings(prev => ({ 
      ...prev, 
      backgroundImage: null 
    }));
  };

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={localCompanyData.name || ''}
            onChange={(e) => setLocalCompanyData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Company Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={localCompanyData.email || ''}
            onChange={(e) => setLocalCompanyData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Company Email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={localCompanyData.phone || ''}
            onChange={(e) => setLocalCompanyData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Phone Number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={localCompanyData.website || ''}
            onChange={(e) => setLocalCompanyData(prev => ({ ...prev, website: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Address
        </label>
        <textarea
          value={localCompanyData.address || ''}
          onChange={(e) => setLocalCompanyData(prev => ({ ...prev, address: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Full Company Address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          About Company
        </label>
        <textarea
          value={localCompanyData.description || ''}
          onChange={(e) => setLocalCompanyData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Brief description about the company and its activities"
        />
      </div>
    </div>
  );

  const renderBackgroundSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={localBackgroundSettings.defaultBackgroundColor || '#ffffff'}
              onChange={(e) => setLocalBackgroundSettings(prev => ({ 
                ...prev, 
                defaultBackgroundColor: e.target.value 
              }))}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={localBackgroundSettings.defaultBackgroundColor || '#ffffff'}
              onChange={(e) => setLocalBackgroundSettings(prev => ({ 
                ...prev, 
                defaultBackgroundColor: e.target.value 
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Opacity
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={localBackgroundSettings.opacity || 100}
            onChange={(e) => setLocalBackgroundSettings(prev => ({ 
              ...prev, 
              opacity: parseInt(e.target.value) 
            }))}
            className="w-full"
          />
          <div className="text-sm text-gray-600 mt-1">
            {localBackgroundSettings.opacity || 100}%
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Image
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {previewBackground || localBackgroundSettings.backgroundImage ? (
            <div className="relative">
              <img
                src={previewBackground || localBackgroundSettings.backgroundImage}
                alt="Background Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={removeBackgroundImage}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600 mb-2">
                Drag and drop an image here or click to select
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageUpload}
                className="hidden"
                id="background-upload"
              />
              <label
                htmlFor="background-upload"
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Choose Image
              </label>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Repeat Pattern
        </label>
        <select
          value={localBackgroundSettings.backgroundRepeat || 'no-repeat'}
          onChange={(e) => setLocalBackgroundSettings(prev => ({ 
            ...prev, 
            backgroundRepeat: e.target.value 
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="no-repeat">No Repeat</option>
          <option value="repeat">Repeat</option>
          <option value="repeat-x">Repeat Horizontally</option>
          <option value="repeat-y">Repeat Vertically</option>
        </select>
      </div>
    </div>
  );

  const renderThemeSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                localThemeSettings.selectedTheme === theme.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setLocalThemeSettings(prev => ({ 
                ...prev, 
                selectedTheme: theme.id,
                colors: theme.colors
              }))}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{theme.name}</h4>
                <div className="flex gap-1">
                  {Object.values(theme.colors).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{theme.description}</p>
            </div>
          ))}
        </div>
      </div>

      {localThemeSettings.selectedTheme && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customize Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(localThemeSettings.colors || {}).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {key === 'primary' ? 'Primary Color' :
                   key === 'secondary' ? 'Secondary Color' :
                   key === 'accent' ? 'Accent Color' :
                   key === 'background' ? 'Background Color' : key}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => setLocalThemeSettings(prev => ({
                      ...prev,
                      colors: {
                        ...prev.colors,
                        [key]: e.target.value
                      }
                    }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setLocalThemeSettings(prev => ({
                      ...prev,
                      colors: {
                        ...prev.colors,
                        [key]: e.target.value
                      }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('auth_token') && localStorage.getItem('user');

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      <PageHeader 
        title="General Settings"
        subtitle="Manage company and design settings"
        showSaveButton={true}
        onSave={handleSave}
        isSaving={isSaving}
        saveButtonText="Save Settings"
      />
      
      {/* Login Warning */}
      {!isLoggedIn && (
        <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-yellow-600" size={20} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Login Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You must log in first to save settings to the database
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8 space-x-reverse">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {activeTab === 'company' && renderCompanySettings()}
            {activeTab === 'background' && renderBackgroundSettings()}
            {activeTab === 'theme' && renderThemeSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
import React, { useState } from 'react';
import { Settings, Upload, X, Save } from 'lucide-react';

const GlobalSettings = ({ 
  globalSettings = {
    header: {
      logo: null,
      showLogo: true
    },
    footer: {
      showEmail: true,
      showPhone: true,
      showPageNumber: true,
      email: 'info@teamarabia.com',
      phone: '+966 11 234 5678'
    }
  },
  onUpdateSettings = () => {},
  isOpen = false,
  onClose = () => {}
}) => {
  const [settings, setSettings] = useState(globalSettings);
  const [logoFile, setLogoFile] = useState(null);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings(prev => ({
          ...prev,
          header: {
            ...prev.header,
            logo: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
      setLogoFile(file);
    }
  };

  const handleSave = () => {
    onUpdateSettings(settings);
    onClose();
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Settings className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Global Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Header Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Header Settings
            </h3>
            
            {/* Logo Upload */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Company Logo
              </label>
              
              {settings.header.logo && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img 
                    src={settings.header.logo} 
                    alt="Logo" 
                    className="w-16 h-16 object-contain border border-gray-200 rounded"
                  />
                  <button
                    onClick={() => handleInputChange('header', 'logo', null)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove Logo
                  </button>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  <Upload size={16} />
                  Upload New Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Show Logo Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showLogo"
                checked={settings.header.showLogo}
                onChange={(e) => handleInputChange('header', 'showLogo', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="showLogo" className="text-sm font-medium text-gray-700">
                Show Logo in Header
              </label>
            </div>
          </div>

          {/* Footer Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Footer Settings
            </h3>
            
            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showEmail"
                  checked={settings.footer.showEmail}
                  onChange={(e) => handleInputChange('footer', 'showEmail', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="showEmail" className="text-sm font-medium text-gray-700">
                  Show Email
                </label>
              </div>
              {settings.footer.showEmail && (
                <input
                  type="email"
                  value={settings.footer.email}
                  onChange={(e) => handleInputChange('footer', 'email', e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showPhone"
                  checked={settings.footer.showPhone}
                  onChange={(e) => handleInputChange('footer', 'showPhone', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="showPhone" className="text-sm font-medium text-gray-700">
                  Show Phone Number
                </label>
              </div>
              {settings.footer.showPhone && (
                <input
                  type="tel"
                  value={settings.footer.phone}
                  onChange={(e) => handleInputChange('footer', 'phone', e.target.value)}
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>

            {/* Page Number */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showPageNumber"
                checked={settings.footer.showPageNumber}
                onChange={(e) => handleInputChange('footer', 'showPageNumber', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="showPageNumber" className="text-sm font-medium text-gray-700">
                Show Page Number
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettings;
import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Save, X, Image, Type, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const InlineEditor = ({ 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  className = '',
  multiline = false,
  isEditing = false,
  onStartEdit,
  onSave,
  onCancel,
  showLanguageSelector = false
}) => {
  const { currentLanguage, changeLanguage, languages, isRTL } = useLanguage();
  const [localValue, setLocalValue] = useState(value || '');
  const [isLocalEditing, setIsLocalEditing] = useState(isEditing);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Set default language to English
  useEffect(() => {
    if (currentLanguage !== 'en') {
      changeLanguage('en');
    }
  }, []);
  
  // Get localized placeholder based on current language and context
  const getLocalizedPlaceholder = () => {
    if (placeholder) return placeholder;
    
    // Determine placeholder type based on className or type
    let placeholderType = 'default';
    
    if (className.includes('text-6xl') || className.includes('text-4xl')) {
      placeholderType = 'title';
    } else if (className.includes('text-2xl')) {
      placeholderType = 'section-title';
    } else if (className.includes('text-xl')) {
      placeholderType = 'subtitle';
    } else if (multiline) {
      placeholderType = 'content';
    }
    
    const placeholders = {
      'ar': {
        'default': 'اكتب هنا...',
        'title': 'عنوان الصفحة',
        'section-title': 'عنوان القسم',
        'subtitle': 'العنوان الفرعي',
        'content': 'محتوى النص'
      },
      'en': {
        'default': 'Type here...',
        'title': 'Page Title',
        'section-title': 'Section Title',
        'subtitle': 'Subtitle',
        'content': 'Text Content'
      }
    };
    
    return placeholders[currentLanguage]?.[placeholderType] || placeholders['en'][placeholderType];
  };

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    if (isLocalEditing && (inputRef.current || textareaRef.current)) {
      const element = multiline ? textareaRef.current : inputRef.current;
      element?.focus();
      element?.select();
    }
  }, [isLocalEditing, multiline]);

  const handleStartEdit = () => {
    setIsLocalEditing(true);
    onStartEdit?.();
  };

  const handleSave = () => {
    onChange?.(localValue);
    onSave?.(localValue);
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(value || '');
    setIsLocalEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  if (type === 'image') {
    return (
      <div className={`relative group ${className}`}>
        {value ? (
          <img 
            src={value} 
            alt="صورة" 
            className="w-full h-auto rounded-lg"
          />
        ) : (
          <div className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Image size={24} className="mx-auto mb-2" />
              <p className="text-sm">لا توجد صورة</p>
            </div>
          </div>
        )}
        
        {/* Edit overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={handleStartEdit}
            className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 size={16} />
          </button>
        </div>

        {/* Image upload modal */}
        {isLocalEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">تحديث الصورة</h3>
              <input
                type="url"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder="رابط الصورة"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-right"
                dir="ltr"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isLocalEditing) {
    return (
      <div className={`relative ${className}`}>
        {multiline ? (
          <textarea
            ref={textareaRef}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getLocalizedPlaceholder()}
            className={`w-full p-2 border-2 border-blue-500 rounded-lg resize-none min-h-[100px] ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
            rows={4}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getLocalizedPlaceholder()}
            className={`w-full p-2 border-2 border-blue-500 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        )}
        
        {/* Action buttons */}
        <div className="absolute -top-10 left-0 flex gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
          {showLanguageSelector && (
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1"
                title="Language"
              >
                <Globe size={14} />
                <span className="text-xs">{languages[currentLanguage].flag}</span>
              </button>
              
              {showLangDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1 z-50 min-w-[120px]">
                  {Object.values(languages).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-50 flex items-center gap-2 ${
                        currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Save (Enter)"
          >
            <Save size={14} />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Cancel (Esc)"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative group cursor-pointer ${className}`}
      onClick={handleStartEdit}
    >
      <div className="relative">
        {multiline ? (
          <div className="whitespace-pre-wrap min-h-[2em] p-1">
            {localValue || placeholder}
          </div>
        ) : (
          <div className="min-h-[1.5em] p-1">
            {localValue || placeholder}
          </div>
        )}
        
        {/* Edit indicator */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:bg-opacity-20 rounded transition-all duration-200" />
        
        {/* Edit icon */}
        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-blue-600 text-white p-1 rounded shadow-lg">
            <Edit3 size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineEditor;
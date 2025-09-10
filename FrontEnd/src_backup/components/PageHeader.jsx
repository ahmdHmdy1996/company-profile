import React from 'react';
import { Save } from 'lucide-react';

const PageHeader = ({ 
  title, 
  subtitle, 
  children, 
  showSaveButton = false, 
  onSave = () => {}, 
  isSaving = false,
  saveButtonText = 'حفظ'
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-3">
          {children}
          {showSaveButton && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isSaving ? 'جاري الحفظ...' : saveButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
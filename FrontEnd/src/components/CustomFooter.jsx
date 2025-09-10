import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CustomFooter = ({ 
  pageNumber = 1,
  totalPages = 1,
  globalSettings = {
    footer: {
      showEmail: true,
      showPhone: true,
      showPageNumber: true,
      email: 'info@teamarabia.com',
      phone: '+966 11 234 5678'
    }
  }
}) => {
  const { footer } = globalSettings;
  const { currentLanguage } = useLanguage();
  
  // Don't render if nothing is enabled
  if (!footer.showEmail && !footer.showPhone && !footer.showPageNumber) {
    return null;
  }

  // Translation for page number text
  const getPageNumberText = () => {
    if (currentLanguage === 'ar') {
      return `${pageNumber} من ${totalPages}`;
    } else {
      return `${pageNumber} of ${totalPages}`;
    }
  };

  return (
    <div className="flex justify-between items-center px-12 py-8 border-t border-gray-200 mt-auto">
      {/* Left side - Contact Info */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        {footer.showEmail && footer.email && (
          <div className="flex items-center gap-2">
            <span>{footer.email}</span>
          </div>
        )}
        {footer.showPhone && footer.phone && (
          <div className="flex items-center gap-2">
            <span>{footer.phone}</span>
          </div>
        )}
      </div>

      {/* Center - Progress bars */}
      <div className="flex items-center gap-2">
        <div className="w-32 h-1 bg-gray-300"></div>
        <div className="w-16 h-1 bg-green-600"></div>
      </div>

      {/* Right side - Page Number */}
      {footer.showPageNumber && (
        <div className="text-gray-600 text-sm">
          {getPageNumberText()}
        </div>
      )}
    </div>
  );
};

export default CustomFooter;
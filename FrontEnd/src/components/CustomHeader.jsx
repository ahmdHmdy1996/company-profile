import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const CustomHeader = ({ 
  pageName = '',
  globalSettings = {
    header: {
      logo: null,
      showLogo: true
    }
  },
  showHeader = true
}) => {
  const { currentLanguage, isRTL } = useLanguage();
  
  // Get localized page name based on current language
  const getLocalizedPageName = () => {
    if (!pageName) return '';
    
    const pageNameTranslations = {
       'ar': {
         'Company Profile': 'Company Profile',
         'About Us': 'About Us',
         'Our Services': 'Our Services',
         'Contact Us': 'Contact Us',
         'Home': 'Home',
         'Vision & Mission': 'Vision & Mission',
         'Our Team': 'Our Team',
         'Portfolio': 'Portfolio',
         'News': 'News',
         'About': 'About'
       },
       'en': {
         'ملف الشركة': 'Company Profile',
         'من نحن': 'About Us',
         'خدماتنا': 'Our Services',
         'اتصل بنا': 'Contact Us',
         'الرئيسية': 'Home',
         'الرؤية والرسالة': 'Vision & Mission',
         'فريقنا': 'Our Team',
         'أعمالنا': 'Portfolio',
         'الأخبار': 'News',
         'نبذة عنا': 'About',
         'About': 'About'
       }
     };
    
    // If current language is English and pageName is 'About', return 'About'
    if (currentLanguage === 'en' && pageName === 'About') {
      return 'About';
    }
    
    // If current language is Arabic and pageName is 'About', return English translation
    if (currentLanguage === 'ar' && pageName === 'About') {
      return 'About';
    }
    
    return pageNameTranslations[currentLanguage]?.[pageName] || pageName;
  };
  if (!showHeader) return null;

  return (
    <div className="flex items-start p-12 pb-8">
      <div className="flex items-center gap-4 mb-8">
        {/* Logo */}
        {globalSettings.header.showLogo && (
          <div className="w-32 h-auto  rounded flex items-center justify-center">
            {globalSettings.header.logo ? (
              <img 
                src={globalSettings.header.logo} 
                alt="Company Logo" 
                className="w-full h-full object-contain rounded"
              />
            ) : (
              <span className="text-green-600 font-bold text-xl">TAC</span>
            )}
          </div>
        )}
        
        {/* Page Name */}
        {pageName && (
          <h1 className={`text-gray-600 text-4xl font-light tracking-wider ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {getLocalizedPageName()}
          </h1>
        )}
      </div>
    </div>
  );
};

export default CustomHeader;
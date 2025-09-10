import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const languages = {
  ar: {
    code: 'ar',
    name: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦'
  },
  en: {
    code: 'en',
    name: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ar');
  
  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Update document direction and language when language changes
  useEffect(() => {
    const language = languages[currentLanguage];
    document.documentElement.dir = language.direction;
    document.documentElement.lang = language.code;
    
    // Save to localStorage
    localStorage.setItem('selectedLanguage', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    if (languages[languageCode]) {
      setCurrentLanguage(languageCode);
    }
  };

  const value = {
    currentLanguage,
    language: languages[currentLanguage],
    languages,
    changeLanguage,
    isRTL: languages[currentLanguage].direction === 'rtl'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
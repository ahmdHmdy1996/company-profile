import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, languages, changeLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded="true"
          aria-haspopup="true"
        >
          <span className="mr-2">{languages[currentLanguage].flag}</span>
          {languages[currentLanguage].name}
          <svg
            className={`${isRTL ? 'ml-2' : '-mr-1 ml-2'} h-5 w-5 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Dropdown */}
          <div className={`origin-top-${isRTL ? 'left' : 'right'} absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20`}>
            <div className="py-1" role="menu" aria-orientation="vertical">
              {Object.values(languages).map((language) => (
                <button
                  key={language.code}
                  className={`${
                    currentLanguage === language.code
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700'
                  } group flex items-center px-4 py-2 text-sm w-full text-${isRTL ? 'right' : 'left'} hover:bg-gray-100 hover:text-gray-900`}
                  role="menuitem"
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className={`${isRTL ? 'ml-3' : 'mr-3'} text-lg`}>{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{language.name}</span>
                    <span className="text-xs text-gray-500">
                      {language.direction.toUpperCase()}
                    </span>
                  </div>
                  {currentLanguage === language.code && (
                    <svg
                      className={`${isRTL ? 'mr-auto' : 'ml-auto'} h-5 w-5 text-green-500`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
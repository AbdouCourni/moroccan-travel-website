// components/LanguageSwitcher.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { getAllLanguages, type Language } from '../lib/language-server';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  mobile?: boolean;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange, mobile = false }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languages = getAllLanguages();

  const currentLangInfo = languages.find(lang => lang.code === currentLanguage);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: Language) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  if (mobile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-1 px-2 py-2 text-gray-700 border border-gray-200 rounded-lg hover:border-primary-gold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-gold focus:ring-opacity-50"
          aria-label="Select language"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="text-lg">{currentLangInfo?.flag}</span>
          <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div 
            className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            role="menu"
            aria-orientation="vertical"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`flex items-center space-x-3 w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                  currentLanguage === lang.code ? 'bg-amber-50 text-primary-gold font-semibold' : 'text-gray-700'
                }`}
                role="menuitem"
                aria-checked={currentLanguage === lang.code}
              >
                <span className="text-lg" aria-hidden="true">{lang.flag}</span>
                <span className="text-sm flex-1">{lang.name}</span>
                {currentLanguage === lang.code && (
                  <Check className="w-3 h-3 text-primary-gold" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-primary-gold transition-colors border border-gray-200 rounded-lg hover:border-primary-gold focus:outline-none focus:ring-2 focus:ring-primary-gold focus:ring-opacity-50"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm font-medium">{currentLangInfo?.flag}</span>
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                currentLanguage === lang.code ? 'bg-amber-50 text-primary-gold font-semibold' : 'text-gray-700'
              }`}
              role="menuitem"
              aria-checked={currentLanguage === lang.code}
            >
              <span className="text-lg" aria-hidden="true">{lang.flag}</span>
              <span className="flex-1">{lang.name}</span>
              {currentLanguage === lang.code && (
                <Check className="w-4 h-4 text-primary-gold" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
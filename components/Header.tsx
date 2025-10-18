// components/Header.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../src/logo.png';
// Import useRouter and usePathname
import { usePathname, useRouter } from 'next/navigation'; 
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import UserMenu from './Auth/UserMenu';
import LoginForm from './Auth/LoginForm';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage, type Language } from '../contexts/LanguageContext';

export default function Header() {
  // ... (state declarations remain the same)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  // Helper function to get the base path (without /lang segment)
  const basepath = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean); // filter(Boolean) removes empty strings from initial '/'
    
    // Check if the first segment is one of your supported language codes
    if (['en', 'fr', 'ar', 'es'].includes(parts[0])) {
      // Path is /lang/segment -> return the rest, joined back with a leading '/'
      return '/' + parts.slice(1).join('/');
    }
    // Path is /segment (or / if parts is empty) -> return the whole pathname
    return pathname;
  }, [pathname]);

  // ... (useEffect for auth and mobile check remains the same)

  // FIX: This function now navigates to the new URL path
  const handleLanguageChange = async (newLanguage: Language) => {
    
    // Determine the language-agnostic path (e.g., '/destinations' or just '/')
    const currentBasepath = basepath || '/'; 

    let newPath = '';

    if (newLanguage === 'en' && currentBasepath === '/') {
      // Root English is generally just '/'
      newPath = '/';
    } else if (newLanguage === 'en') {
        // English path for segments: e.g., /destinations
        newPath = currentBasepath; 
    } else if (currentBasepath === '/') {
        // Other language root: e.g., /fr
        newPath = `/${newLanguage}`;
    } else {
        // Localized path: e.g., /fr/destinations
        newPath = `/${newLanguage}${currentBasepath}`;
    }

    // 1. Perform client-side navigation to the new URL path
    router.push(newPath);
    
    // 2. Update client context (optional but good for instant header text update)
    setLanguage(newLanguage);
  };
  
  // Rework isActive to check against the language-agnostic path
  const isActive = (href: string) => {
    const currentBase = basepath || '/';
    if (href === '/') return currentBase === '/';
    return currentBase === href || currentBase.startsWith(href + '/');
  };

  const handleLinkClick = () => setIsMenuOpen(false);

  // Nav items need the language path segment
  const navItems = [
    { name: t('home'), href: '' }, // Use empty string for root segment
    { name: t('destinations'), href: 'destinations' },
    { name: t('stays'), href: 'stays' },
    { name: t('transport'), href: 'transport' },
    { name: t('culture'), href: 'culture' },
  ];
  
  // Helper to generate correct localized link URL
  const getLocalizedHref = (segment: string) => {
      // If language is 'en', the segment might be the default URL (like '/destinations')
      if (language === 'en') {
          return segment ? `/${segment}` : '/';
      }
      // If language is not 'en', always prepend /lang
      return segment ? `/${language}/${segment}` : `/${language}`;
  };

  return (
    <>
      <header className="header-glass sticky top-0 z-50 shadow-md bg-white/95 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
           {/* Logo and Title - links to the current language home */}
<Link href={getLocalizedHref('')} className="flex items-center" onClick={handleLinkClick}>
  <Image 
    src={logo} 
    alt="MoroCompase logo" 
    width={40}  // Add specific width
    height={40} // Add specific height
    className="w-8 h-8 md:w-10 md:h-10" // Responsive sizing
    priority
  />
  <span className={`font-amiri font-bold text-primary-gold ${
    isMobile ? 'text-xl' : 'text-2xl'
  }`}>
    MoroCompase
  </span>
</Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              {navItems.map((item) => {
                const localizedHref = getLocalizedHref(item.href);
                // We use the language-agnostic path (item.href) for isActive check against basepath
                const active = isActive(item.href ? `/${item.href}` : '/'); 
                
                return (
                  <Link
                    key={item.href}
                    href={localizedHref} // Use the correct localized link
                    className={`transition-all duration-300 font-medium px-3 lg:px-4 py-2 rounded-lg ${
                      active
                        ? 'text-black bg-amber-50 font-semibold shadow-sm border border-amber-200'
                        : 'text-gray-700 hover:text-primary-gold hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Desktop Language Switcher */}
              <div className="ml-2">
                <LanguageSwitcher 
                  currentLanguage={language} 
                  onLanguageChange={handleLanguageChange} // This is the fixed function
                />
              </div>
              
              {user ? (
                <UserMenu user={user} />
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="btn-primary ml-2 px-4 py-2 text-sm"
                >
                  {t('login')}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher 
                  currentLanguage={language} 
                  onLanguageChange={handleLanguageChange}
                  mobile
                />
              </div>

              {user ? (
                <UserMenu user={user} mobile />
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  {t('login')}
                </button>
              )}
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-gold p-2 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <span className="text-lg">✕</span>
                ) : (
                  <span className="text-lg">☰</span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200 absolute left-0 right-0">
              <div className="px-4 pt-2 pb-4 space-y-1 bg-white">
                {/* Mobile Language Switcher - Inside Menu */}
                <div className="px-4 py-3 sm:hidden border-b border-gray-100">
                  <LanguageSwitcher 
                    currentLanguage={language} 
                    onLanguageChange={handleLanguageChange}
                    mobile
                  />
                </div>
                
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? 'text-primary-gold bg-amber-50 font-semibold border-r-2 border-primary-gold'
                          : 'text-gray-700 hover:text-primary-gold hover:bg-gray-50'
                      }`}
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('login')} to MoroCompase</h3>
              <button 
                onClick={() => setIsLoginOpen(false)} 
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <LoginForm onSuccess={() => setIsLoginOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
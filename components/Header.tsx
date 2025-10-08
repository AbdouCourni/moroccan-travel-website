// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../src/logo.png';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import UserMenu from './Auth/UserMenu';
import LoginForm from './Auth/LoginForm';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage, type Language } from '../contexts/LanguageContext'; // Use hook and type

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Use the custom hook for language
  const { language, setLanguage, t } = useLanguage();
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLinkClick = () => setIsMenuOpen(false);

  const handleLanguageChange = async (newLanguage: Language) => {
    // Update context (this will handle localStorage, cookies, and document attributes)
    setLanguage(newLanguage);
    
    // Update URL for server-side detection
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLanguage);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const navItems = [
    { name: t('home'), href: '/' },
    { name: t('destinations'), href: '/destinations' },
    { name: t('stays'), href: '/stays' },
    { name: t('transport'), href: '/transport' },
    { name: t('culture'), href: '/culture' },
  ];

  return (
    <>
      <header className="header-glass sticky top-0 z-50 shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <Link href="/" className="flex items-center" onClick={handleLinkClick}>
              <Image src={logo} alt="MoroCompase logo" width={36} height={36} className="mr-3 object-contain" />
              <span className="font-amiri text-2xl font-bold text-primary-gold">
                MoroCompase
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition-all duration-300 font-medium px-4 py-2 rounded-lg ${
                      active
                        ? 'text-primary-gold border-green-600 font-semibold shadow-md border-1'
                        : 'text-gray-700 border-transparent hover:text-primary-gold hover:bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Language Switcher */}
              <LanguageSwitcher 
                currentLanguage={language} 
                onLanguageChange={handleLanguageChange}
              />
              
              {user ? (
                <UserMenu user={user} />
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="btn-primary ml-4"
                >
                  {t('login')}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Language Switcher */}
              <LanguageSwitcher 
                currentLanguage={language} 
                onLanguageChange={handleLanguageChange}
                mobile
              />

              {user ? (
                <UserMenu user={user} mobile />
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="btn-primary text-sm px-3 py-2"
                >
                  {t('login')}
                </button>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-gold p-2 transition-colors"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white shadow-lg border-t">
              <div className="px-2 pt-2 pb-4 space-y-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                        active
                          ? 'text-primary-gold bg-amber-50 font-semibold border-none'
                          : 'text-gray-700 hover:text-primary-gold hover:bg-gray-50 border-l-4 border-transparent'
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
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('login')} to MoroCompase</h3>
              <button onClick={() => setIsLoginOpen(false)} className="text-gray-500">✕</button>
            </div>
            <LoginForm onSuccess={() => setIsLoginOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
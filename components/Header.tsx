// components/Header.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './Auth/UserMenu';
import LoginForm from './Auth/LoginForm';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { Search, Menu, X, User } from 'lucide-react';
import logo from '../src/logo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Base path helper
  const basepath = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    if (['en', 'fr', 'ar', 'es'].includes(parts[0])) {
      return '/' + parts.slice(1).join('/');
    }
    return pathname;
  }, [pathname]);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile detection - lock body scroll
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768 && isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Type-safe language change handler
  const handleLanguageChange = useCallback(async (newLanguage: Language) => {
    const currentBasepath = basepath || '/';
    let newPath: string = '';
    
    if (newLanguage === 'en' && currentBasepath === '/') {
      newPath = '/';
    } else if (newLanguage === 'en') {
      newPath = currentBasepath;
    } else if (currentBasepath === '/') {
      newPath = `/${newLanguage}`;
    } else {
      newPath = `/${newLanguage}${currentBasepath}`;
    }
    
    // Cast to Route type for Next.js router
    router.push(newPath as Route);
    setLanguage(newLanguage);
    setIsMenuOpen(false);
  }, [basepath, router, setLanguage]);
  
  const isActive = useCallback((href: string) => {
    const currentBase = basepath || '/';
    if (href === '/') return currentBase === '/';
    return currentBase === href || currentBase.startsWith(href + '/');
  }, [basepath]);

  const handleLinkClick = useCallback(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchPath = `/${language}/destinations?q=${encodeURIComponent(searchQuery.trim())}`;
      router.push(searchPath as Route);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  }, [searchQuery, language, router]);

  // Type-safe href generator
  const getLocalizedHref = useCallback((segment: string): Route => {
    if (language === 'en') {
      return (segment ? `/${segment}` : '/') as Route;
    }
    return (segment ? `/${language}/${segment}` : `/${language}`) as Route;
  }, [language]);

  const navItems = [
    { name: t('home'), href: '' },
    { name: t('destinations'), href: 'destinations' },
    { name: t('stays'), href: 'stays' },
    { name: t('transport'), href: 'transport' },
    { name: t('culture'), href: 'culture' },
  ];

  return (
    <>
      <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-gradient-to-r from-primary-gold/95 to-moroccan-blue/95 backdrop-blur-md shadow-lg py-1' 
      : 'bg-gradient-to-r from-primary-gold/85 to-moroccan-blue/85 backdrop-blur-sm py-2'
  }`}
        role="banner"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
    <div className="flex justify-between items-center h-12 sm:h-14">
            
            {/* Logo - Brand Color: Primary Gold */}
            <Link 
              href={getLocalizedHref('')} 
              className="flex items-center gap-2 sm:gap-3 group" 
              onClick={handleLinkClick}
              aria-label="MoroCompase home"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image 
                  src={logo} 
                  alt="MoroCompase" 
                  fill
                  className="object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </div>
             <span className={`font-amiri font-bold text-primary-gold transition-all duration-300 ${
  isScrolled ? 'text-xl' : 'text-2xl'
}`}>
  MoroCompase
</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const localizedHref = getLocalizedHref(item.href);
                const active = isActive(item.href ? `/${item.href}` : '/');
                
                return (
                  <Link
                    key={item.href}
                    href={localizedHref}
                    className={`relative px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      active
                        ? 'text-black bg-primary-gold/15 font-semibold shadow-sm'
                        : 'text-gray-700 hover:text-primary-gold hover:bg-gray-50'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.name}
                    {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-gold rounded-full" />}
                  </Link>
                );
              })}
              
              {/* Language Switcher */}
              <div className="ml-1">
                <LanguageSwitcher 
                  currentLanguage={language} 
                  onLanguageChange={handleLanguageChange}
                />
              </div>
              
              {/* Auth Section - Brand Colors */}
              {authLoading ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <UserMenu user={user} />
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="ml-1 inline-flex items-center gap-2 bg-gradient-to-r from-primary-gold to-moroccan-blue text-white px-4 py-2 text-sm rounded-lg font-medium hover:from-primary-gold/90 hover:to-moroccan-blue/90 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-gold focus:ring-offset-2 shadow-md"
                >
                  <User className="w-4 h-4" />
                  {t('login')}
                </button>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile Auth */}
              {authLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <UserMenu user={user} mobile />
              ) : (
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="p-2 text-primary-gold hover:text-moroccan-blue rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Login"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
              
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-primary-gold rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 space-y-1">
              {/* Mobile Language Switcher */}
              <div className="pb-3 border-b border-gray-100">
                <LanguageSwitcher 
                  currentLanguage={language} 
                  onLanguageChange={handleLanguageChange}
                  mobile
                />
              </div>
              
              {/* Mobile Nav Items */}
              {navItems.map((item) => {
                const active = isActive(item.href ? `/${item.href}` : '/');
                return (
                  <Link
                    key={item.href}
                    href={getLocalizedHref(item.href)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? 'bg-gradient-to-r from-primary-gold/10 to-moroccan-blue/10 text-primary-gold font-semibold border-l-4 border-primary-gold'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-gold/5 hover:to-moroccan-blue/5 hover:text-primary-gold'
                    }`}
                    onClick={handleLinkClick}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-gold to-moroccan-blue opacity-50" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Login Modal */}
      {isLoginOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsLoginOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-t-4 border-primary-gold"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 id="login-modal-title" className="text-xl font-semibold bg-gradient-to-r from-primary-gold to-moroccan-blue bg-clip-text text-transparent">
                {t('login')} to MoroCompase
              </h3>
              <button 
                onClick={() => setIsLoginOpen(false)} 
                className="p-2 text-gray-400 hover:text-primary-gold rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close login modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <LoginForm onSuccess={() => setIsLoginOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
'use client';

import { usePathname } from 'next/navigation';
import { LanguageProvider } from '../contexts/LanguageContext';

export function getLanguageFromPath(pathname: string): 'en' | 'fr' | 'ar' | 'es' {
  const locale = pathname.split('/')[1];
  if (['en', 'fr', 'ar', 'es'].includes(locale)) {
    return locale as 'en' | 'fr' | 'ar' | 'es';
  }
  return 'en';
}

export default function ClientLanguageWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  const language = getLanguageFromPath(pathname);
  
  return (
    <LanguageProvider initialLanguage={language}>
      {children}
    </LanguageProvider>
  );
}
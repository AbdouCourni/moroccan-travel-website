// src/app/[lang]/layout.tsx

import { LanguageProvider } from '../../../contexts/LanguageContext';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { AuthProvider } from '../../../contexts/AuthContext';
import { GoogleAnalyticsWrapper } from '../../../components/GoogleAnalytics';
import { isRTL, Language } from '../../../lib/language-server'; // Import utility for RTL
import '../globals.css';

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const supportedLangs = ['en', 'fr', 'ar', 'es'];
  // Ensure the language is a supported type, defaulting to 'en'
  const lang = supportedLangs.includes(params.lang) ? params.lang as Language : 'en' as Language;

  return (
    // Set 'dir' and 'lang' attributes based on the URL parameter
    // <html lang={lang} dir={isRTL(lang) ? 'rtl' : 'ltr'}>
      <>
        {/* Initialize the client-side context with the server-determined language */}
        <LanguageProvider initialLanguage={lang}>
          <AuthProvider>
            
            <Header />
            
            <main>{children}</main>
            <GoogleAnalyticsWrapper />
           
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </>
   
  );
}
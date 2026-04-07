// src/app/[lang]/layout.tsx - REMOVE html/body tags

import { LanguageProvider } from '../../../contexts/LanguageContext';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { AuthProvider } from '../../../contexts/AuthContext';
import { GoogleAnalyticsWrapper } from '../../../components/GoogleAnalytics';
import { isRTL, Language } from '../../../lib/language-server';
import type { Metadata } from 'next';
import '../globals.css';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang;
  const baseUrl = 'https://morocompase.com';
  
  const titles = {
    en: "Discover Morocco's Hidden Gems - Authentic Travel Experiences | MoroCompase",
    fr: "Découvrez les Joyaux Cachés du Maroc - Voyages Authentiques | MoroCompase",
    ar: "اكتشف جواهر المغرب الخفية - تجارب سفر أصيلة | موروكومباس",
    es: "Descubre las Joyas Ocultas de Marruecos - Experiencias Auténticas | MoroCompase"
  };
  
  const descriptions = {
    en: "Explore Morocco with local experts. Discover Marrakech, Fez, Sahara Desert tours, authentic riads, and hidden cultural gems.",
    fr: "Explorez le Maroc avec des experts locaux. Découvrez Marrakech, Fès, les circuits dans le désert du Sahara, les riads authentiques et les pépites culturelles cachées.",
    ar: "استكشف المغرب مع خبراء محليين. اكتشف مراكش وفاس وجولات الصحراء الكبرى والرياض الأصيلة والكنوز الثقافية المخفية.",
    es: "Explora Marruecos con expertos locales. Descubre Marrakech, Fez, tours por el desierto del Sahara, riads auténticos y joyas culturales escondidas."
  };
  
  return {
    title: titles[lang as keyof typeof titles] || titles.en,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
        'ar': `${baseUrl}/ar`,
        'es': `${baseUrl}/es`,
        'x-default': `${baseUrl}/en`,
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const supportedLangs = ['en', 'fr', 'ar', 'es'];
  const lang = supportedLangs.includes(params.lang) ? params.lang as Language : 'en' as Language;

  // NO html or body tags here - root layout already has them
  return (
    <LanguageProvider initialLanguage={lang}>
      <AuthProvider>
        <Header />
        <main>{children}</main>
        <GoogleAnalyticsWrapper />
        <Footer />
      </AuthProvider>
    </LanguageProvider>
  );
}
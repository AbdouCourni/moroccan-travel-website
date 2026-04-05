// src/app/[lang]/layout.tsx

import { LanguageProvider } from '../../../contexts/LanguageContext';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { AuthProvider } from '../../../contexts/AuthContext';
import { GoogleAnalyticsWrapper } from '../../../components/GoogleAnalytics';
import { isRTL, Language } from '../../../lib/language-server';
import type { Metadata } from 'next';
import '../globals.css';

// Generate metadata dynamically based on language
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Language;
  const baseUrl = 'https://morocompase.com';
  
  const metadataConfig = {
    en: {
      title: "Discover Morocco's Hidden Gems - Authentic Travel Experiences | MoroCompase",
      description: "Explore Morocco with local experts. Discover Marrakech, Fez, Sahara Desert tours, authentic riads, and hidden cultural gems. Your complete Morocco travel guide.",
    },
    fr: {
      title: "Découvrez les Joyaux Cachés du Maroc - Voyages Authentiques | MoroCompase",
      description: "Explorez le Maroc avec des experts locaux. Découvrez Marrakech, Fès, les circuits dans le désert du Sahara, les riads authentiques et les pépites culturelles cachées.",
    },
    ar: {
      title: "اكتشف جواهر المغرب الخفية - تجارب سفر أصيلة | موروكومباس",
      description: "استكشف المغرب مع خبراء محليين. اكتشف مراكش وفاس وجولات الصحراء الكبرى والرياض الأصيلة والكنوز الثقافية المخفية.",
    },
    es: {
      title: "Descubre las Joyas Ocultas de Marruecos - Experiencias Auténticas | MoroCompase",
      description: "Explora Marruecos con expertos locales. Descubre Marrakech, Fez, tours por el desierto del Sahara, riads auténticos y joyas culturales escondidas.",
    },
  };
  
  const current = metadataConfig[lang] || metadataConfig.en;
  
  return {
    title: current.title,
    description: current.description,
    openGraph: {
      title: current.title,
      description: current.description,
      type: 'website',
      url: `${baseUrl}/${lang}`,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'MoroCompase' }],
      siteName: 'MoroCompase',
    },
    twitter: {
      card: 'summary_large_image',
      title: current.title,
      description: current.description,
      images: ['/twitter-image.png'],
    },
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
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
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

  return (
    <html lang={lang} dir={isRTL(lang) ? 'rtl' : 'ltr'}>
      <body>
        <LanguageProvider initialLanguage={lang}>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <GoogleAnalyticsWrapper />
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
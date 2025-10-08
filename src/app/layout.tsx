// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { detectLanguage } from '../../lib/language-server';
import { LanguageProvider } from '../../contexts/LanguageContext';
import Script from 'next/script';
import Header from '../../components/Header'; // Import Header
import Footer from '../../components/Footer';
import { GoogleAnalyticsWrapper } from '../../components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
 title: 'MoroCompase - Moroccan Travel Guide',
  description: 'Discover authentic Moroccan culture, recipes, and travel experiences',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32', 
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: ['/favicon.ico'],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = await detectLanguage();

  return (
    <html lang={language}>
      <body className={inter.className}>
        {/* Load Google Maps JS API so client Map components can use window.google */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        
        <LanguageProvider initialLanguage={language}>
          <Header />
          <main>{children}
             <GoogleAnalyticsWrapper />
          </main>
          
          <Footer/>
        </LanguageProvider>
      </body>
    </html>
  );
}
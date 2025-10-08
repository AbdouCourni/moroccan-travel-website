// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { detectLanguage } from '../../lib/language-server';
import { LanguageProvider } from '../../contexts/LanguageContext';
import Script from 'next/script';
import Header from '../../components/Header'; // Import Header
import Footer from '../../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MoroCompase - Explore Morocco',
  description: 'Discover the beauty of Morocco',
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
          <main>{children}</main>
          <Footer/>
        </LanguageProvider>
      </body>
    </html>
  );
}
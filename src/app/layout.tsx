// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { detectLanguage,getLanguageFromPath  } from '../../lib/language-server';
import { LanguageProvider } from '../../contexts/LanguageContext';
import Script from 'next/script';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { GoogleAnalyticsWrapper } from '../../components/GoogleAnalytics';
import { AuthProvider } from '../../contexts/AuthContext';
import { usePathname } from 'next/navigation';
import ClientLanguageWrapper from '../../components/ClientLanguageWrapper'; // Import the client com

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: "MoroCompase - Discover Morocco's Hidden Gems",
    template: '%s | MoroCompase - Authentic Moroccan Travel'
  },
  description: 'Explore Morocco with local insights. Discover Marrakech, Casablanca, Fez, Sahara Desert, and hidden gems. Best riads, restaurants, and cultural experiences.',
  keywords: ['Morocco travel', 'Marrakech', 'Casablanca', 'Fez', 'Sahara Desert', 'Moroccan riads', 'local guides', 'Morocco tourism'],
  authors: [{ name: 'MoroCompase' }],
  creator: 'MoroCompase',
  publisher: 'MoroCompase',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://morocompase.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'fr': '/fr',
      'ar': '/ar',
      'es': '/es',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://morocompase.com',
    siteName: 'MoroCompase',
    title: "MoroCompase - Discover Morocco's Hidden Gems",
    description: 'Explore Morocco with local insights. Discover authentic experiences.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MoroCompase - Moroccan Travel Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoroCompase - Discover Morocco',
    description: 'Explore Morocco with local insights',
    images: ['/twitter-image.png'],
    creator: '@morocompase',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
  // verification: {
  //   google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, // Add to your .env.local
  // },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = await detectLanguage();

  return (
    <html lang={language}>
      <head>
        {/* hreflang tags for multilingual SEO */}
        <link rel="alternate" href="https://morocompase.com" hrefLang="x-default" />
        <link rel="alternate" href="https://morocompase.com" hrefLang="en" />
        <link rel="alternate" href="https://morocompase.com/fr" hrefLang="fr" />
        <link rel="alternate" href="https://morocompase.com/ar" hrefLang="ar" />
        <link rel="alternate" href="https://morocompase.com/es" hrefLang="es" />
        
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        
        {/* Canonical URL for homepage */}
        <link rel="canonical" href="https://morocompase.com" />
      </head>
      <body className={inter.className}>
        {/* Load Google Maps JS API so client Map components can use window.google */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        
        {/* Schema.org structured data for local business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TravelAgency',
              name: 'MoroCompase',
              description: 'Authentic Moroccan travel experiences and local guides',
              url: 'https://morocompase.com',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'MA',
                addressLocality: 'Marrakech',
              },
              areaServed: 'Morocco',
              offers: {
                '@type': 'Offer',
                description: 'Morocco travel packages and local experiences'
              },
              sameAs: [
                'https://www.facebook.com/morocompase',
                'https://www.instagram.com/morocompase',
                'https://www.twitter.com/morocompase'
              ]
            })
          }}
        />
        
        <ClientLanguageWrapper>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <GoogleAnalyticsWrapper />
            <Footer/>
          </AuthProvider>
        </ClientLanguageWrapper>   
      </body>
    </html>
  );
}


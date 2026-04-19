// src/app/[lang]/page.tsx
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Hero from '../../../components/Hero';
import DestinationCard from '../../../components/DestinationCard';
import ClientMapWrapper from '../../../components/ClientMapWrapper';
import { LocalBusinessStructuredData } from '../../../components/seo/StructuredData';
import { getCachedHomePageData } from '../../../lib/firebase-server';
import type { Destination, Place } from '../../../types';

// Types
type Lang = 'en' | 'fr' | 'ar' | 'es';

// Next.js configs
export const dynamic = 'force-static';
export const revalidate = 3600;

// Translations
const translations = {
  en: {
    title: 'Top Moroccan Destinations',
    description: 'Discover the most iconic and beautiful places that make Morocco truly magical.',
    exploreAll: 'Explore All Destinations',
    mapTitle: 'Explore Morocco',
    mapDesc: 'Interactive map showing our curated destinations across beautiful Morocco'
  },
  fr: {
    title: 'Meilleures Destinations Marocaines',
    description: 'Découvrez les endroits les plus emblématiques et magnifiques qui rendent le Maroc vraiment magique.',
    exploreAll: 'Explorer Toutes les Destinations',
    mapTitle: 'Explorez le Maroc',
    mapDesc: 'Carte interactive présentant nos destinations sélectionnées à travers le beau Maroc'
  },
  ar: {
    title: 'أفضل الوجهات المغربية',
    description: 'اكتشف أكثر الأماكن شهرة وجمالاً التي تجعل المغرب ساحراً حقاً.',
    exploreAll: 'استكشف جميع الوجهات',
    mapTitle: 'استكشف المغرب',
    mapDesc: 'خريطة تفاعلية تظهر وجهاتنا المختارة في جميع أنحاء المغرب الجميل'
  },
  es: {
    title: 'Principales Destinos Marroquíes',
    description: 'Descubre los lugares más icónicos y hermosos que hacen que Marruecos sea verdaderamente mágico.',
    exploreAll: 'Explorar Todos los Destinos',
    mapTitle: 'Explora Marruecos',
    mapDesc: 'Mapa interactivo que muestra nuestros destinos seleccionados en todo el hermoso Marruecos'
  }
} as const;

// Loading Components
function HeroSkeleton() {
  return (
    <div className="relative h-screen bg-gradient-to-r from-moroccan-blue to-primary-gold">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg animate-pulse">Loading magical views...</p>
        </div>
      </div>
    </div>
  );
}

function DestinationGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden bg-gray-100 animate-pulse">
          <div className="h-56 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-6 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="w-full h-[900px] bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-gold/30 border-t-primary-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading interactive map...</p>
      </div>
    </div>
  );
}

// Helper function to convert date strings to Date objects
function convertToDate(dateValue: string | Date | undefined): Date {
  if (!dateValue) return new Date();
  if (dateValue instanceof Date) return dateValue;
  return new Date(dateValue);
}

// Helper to ensure Place type compatibility
function normalizePlace(place: any): Place {
  return {
    ...place,
    createdAt: convertToDate(place.createdAt),
    updatedAt: convertToDate(place.updatedAt),
  };
}

// Metadata generation
export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang as Lang;
  const titles = {
    en: "Discover Morocco's Hidden Gems - Authentic Travel Experiences | MoroCompase",
    fr: "Découvrez les Joyaux Cachés du Maroc - Voyages Authentiques | MoroCompase",
    ar: "اكتشف جواهر المغرب الخفية - تجارب سفر أصيلة | موروكومباس",
    es: "Descubre las Joyas Ocultas de Marruecos - Experiencias Auténticas | MoroCompase"
  };
  
  return {
    title: titles[lang] || titles.en,
    description: "Explore Morocco with local experts. Discover Marrakech, Fez, Sahara Desert tours, authentic riads, and hidden cultural gems.",
    alternates: {
      canonical: `https://morocompase.com/${lang}`,
    },
    openGraph: {
      title: titles[lang] || titles.en,
      description: "Explore Morocco with local experts.",
      type: 'website',
      url: `https://morocompase.com/${lang}`,
      images: [{ url: '/og-home.jpeg', width: 1200, height: 630 }],
    },
  };
}

export default async function LangHomePage({ params }: { params: { lang: string } }) {
  // Validate language
  const lang = (['en', 'fr', 'ar', 'es'].includes(params.lang) ? params.lang : 'en') as Lang;
  const t = translations[lang];
  
  // Fetch all data with single cached call
  const { destinations, featuredPlaces } = await getCachedHomePageData(65);
  
  if (!destinations.length) {
    notFound();
  }
  
  // Normalize featured places to ensure Date objects
  const normalizedFeaturedPlaces = featuredPlaces.map(normalizePlace);
  
  return (
    <>
      <LocalBusinessStructuredData />
      
      {/* Hero Section - Suspense boundary */}
      <Suspense fallback={<HeroSkeleton />}>
        <Hero lang={lang} />
      </Suspense>
      
      {/* Interactive Map Section - Lazy loaded via Client Component */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t.mapTitle}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.mapDesc}
            </p>
          </div>
          
          <div className="h-[900px] rounded-xl overflow-hidden shadow-lg">
            <Suspense fallback={<MapSkeleton />}>
              <ClientMapWrapper 
                destinations={destinations as Destination[]}
                places={normalizedFeaturedPlaces}
              />
            </Suspense>
          </div>
        </div>
      </section> */}
      
      {/* Featured Destinations Section */}
      <section id="featured" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-gold mb-4">
              {t.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>
          
          <Suspense fallback={<DestinationGridSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {destinations.map((dest, index) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest as Destination}
                  priority={index < 4}
                  prefetch={index < 4}
                />
              ))}
            </div>
          </Suspense>
          
          <div className="text-center mt-12">
            <a
              href={`/${lang}/destinations`}
              className="inline-flex items-center gap-2 bg-primary-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-md"
            >
              {t.exploreAll}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
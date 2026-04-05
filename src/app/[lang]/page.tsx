// src/app/[lang]/page.tsx

// All necessary imports for the home page content
import Hero from '../../../components/Hero';
import DestinationCard from '../../../components/DestinationCard';
import MapLoader from '../../../components/InteractMapLoader';
import { selectTopDestinations } from '../../../lib/firebase-server';
import { getAllDestinationsByRanking } from '../../../lib/firebase-server';
import { getFeaturedPlaces } from '../../../lib/firebase-server';
import { LocalBusinessStructuredData } from '../../../components/seo/StructuredData';
import InteractMapLoader from '../../../components/InteractMapLoader';
import PracticeMap from '../../../components/PracticeMap';

import MoroccoRegionsMap from '../../../components/MoroccoRegionsMap';
import { convertDestinationData } from '../../../lib/firebase-utils';



// Translations moved here from the original page.tsx
const serverTranslations = {
  en: {
    title: 'Top Moroccan Destinations',
    description: 'Discover the most iconic and beautiful places that make Morocco truly magical.',
    exploreAll: 'Explore All Destinations'
  },
  fr: {
    title: 'Meilleures Destinations Marocaines',
    description: 'Découvrez les endroits les plus emblématiques et magnifiques qui rendent le Maroc vraiment magique.',
    exploreAll: 'Explorer Toutes les Destinations'
  },
  ar: {
    title: 'أفضل الوجهات المغربية',
    description: 'اكتشف أكثر الأماكن شهرة وجمالاً التي تجعل المغرب ساحراً حقاً.',
    exploreAll: 'استكشف جميع الوجهات'
  },
  es: {
    title: 'Principales Destinos Marroquíes',
    description: 'Descubre los lugares más icónicos y hermosos que hacen que Marruecos sea verdaderamente mágico.',
    exploreAll: 'Explorar Todos los Destinos'
  }
} as const; // Use 'as const' for strong typing


// Add this to src/app/[lang]/page.tsx - place it before your LangHomePage component
export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  
  // Language-specific content
  const titles = {
    en: "Discover Morocco's Hidden Gems - Authentic Travel Experiences | MoroCompase",
    fr: "Découvrez les Joyaux Cachés du Maroc - Voyages Authentiques | MoroCompase",
    ar: "اكتشف جواهر المغرب الخفية - تجارب سفر أصيلة | موروكومباس",
    es: "Descubre las Joyas Ocultas de Marruecos - Experiencias Auténticas | MoroCompase"
  };
  
  const descriptions = {
    en: "Explore Morocco with local experts. Discover Marrakech, Fez, Sahara Desert tours, authentic riads, and hidden cultural gems. Your complete Morocco travel guide.",
    fr: "Explorez le Maroc avec des experts locaux. Découvrez Marrakech, Fès, les circuits dans le désert du Sahara, les riads authentiques et les pépites culturelles cachées. Votre guide de voyage complet pour le Maroc.",
    ar: "استكشف المغرب مع خبراء محليين. اكتشف مراكش وفاس وجولات الصحراء الكبرى والرياض الأصيلة والكنوز الثقافية المخفية. دليلك الكامل للسفر إلى المغرب.",
    es: "Explora Marruecos con expertos locales. Descubre Marrakech, Fez, tours por el desierto del Sahara, riads auténticos y joyas culturales escondidas. Tu guía de viaje completa para Marruecos."
  };
  
  const keywords = {
    en: ["Morocco travel", "Marrakech guide", "Sahara Desert tours", "Fez medina", "Moroccan riads", "local experiences", "Morocco tourism", "best time to visit Morocco", "Morocco travel packages", "discover Morocco"],
    fr: ["voyage Maroc", "guide Marrakech", "circuits désert Sahara", "médina Fès", "riads marocains", "expériences locales", "tourisme Maroc", "meilleure période pour visiter Maroc", "forfaits voyage Maroc"],
    ar: ["السفر إلى المغرب", "دليل مراكش", "جولات الصحراء الكبرى", "فاس المدينة", "رياض مغربية", "تجارب محلية", "السياحة في المغرب", "أفضل وقت لزيارة المغرب", "باقات السفر إلى المغرب"],
    es: ["viajes Marruecos", "guía Marrakech", "tours desierto Sahara", "medina Fez", "riads marroquíes", "experiencias locales", "turismo Marruecos", "mejor época para visitar Marruecos", "paquetes de viaje Marruecos"]
  };
  
  const baseUrl = 'https://morocompase.com';
  
  return {
    title: titles[lang as keyof typeof titles] || titles.en,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
    keywords: keywords[lang as keyof typeof keywords] || keywords.en,
    
    // Open Graph tags (for social media sharing)
    openGraph: {
      title: titles[lang as keyof typeof titles] || titles.en,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      url: `${baseUrl}/${lang}`,
      images: [
        {
          url: '/og-home.jpeg',
          width: 1200,
          height: 630,
          alt: `MoroCompase - ${titles[lang as keyof typeof titles] || titles.en}`,
        },
      ],
      siteName: 'MoroCompase',
      locale: lang === 'ar' ? 'ar_MA' : lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: ['en_US', 'fr_FR', 'ar_MA', 'es_ES'],
    },
    
    // Twitter Card tags
    twitter: {
      card: 'summary_large_image',
      title: titles[lang as keyof typeof titles] || titles.en,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
      images: ['/twitter-home.jpeg'],
      site: '@morocompase',
      creator: '@morocompase',
    },
    
    // Canonical URL (tells Google which URL is the master copy)
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
    
    // Other metadata
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
    
    verification: {
      // Add your Google Search Console verification code here if you have one
      // google: 'your-verification-code',
    },
    
    category: 'travel',
    
    // Viewport settings (optional but good for mobile)
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
  };
}

type lang = 'en' | 'fr' | 'ar' | 'es';

export default async function LangHomePage({
  params,
}: {
  params: { lang: string };
}) {
  // 1. Get the lang directly from the URL path (params.lang)
  const lang = (['en', 'fr', 'ar', 'es'].includes(params.lang)
    ? params.lang
    : 'en') as lang;

  // const destinations = await selectTopDestinations(8);
  // const t = serverTranslations[lang];

  const destinations = await getAllDestinationsByRanking('desc');
  const featuredPlaces = await getFeaturedPlaces('nador', 3); // You'll need to implement this based on your data structure
  const t = serverTranslations[lang];
  const convertedDestinations = destinations.map(convertDestinationData);

  return (
    <>
      <LocalBusinessStructuredData />
      <Hero />
      {/* Interactive Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {lang === 'en' ? 'Explore Morocco' :
                lang === 'fr' ? 'Explorez le Maroc' :
                  lang === 'ar' ? 'استكشف المغرب' :
                    'Explora Marruecos'}
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              {lang === 'en' ? 'Interactive map showing our curated destinations across beautiful Morocco' :
                lang === 'fr' ? 'Carte interactive présentant nos destinations sélectionnées à travers le beau Maroc' :
                  lang === 'ar' ? 'خريطة تفاعلية تظهر وجهاتنا المختارة في جميع أنحاء المغرب الجميل' :
                    'Mapa interactivo que muestra nuestros destinos seleccionados en todo el hermoso Marruecos'}
            </p>
          </div>


          <div className="h-[900px] rounded-xl overflow-hidden hidden md:block">
            <InteractMapLoader
              destinations={convertedDestinations}
              places={featuredPlaces}
            />
          </div>

          {/* Simple mobile placeholder */}
          <div className="md:hidden bg-amber-100 rounded-xl p-6 text-center">
            <p className="text-amber-800 font-medium">
              🗺️ Map available on larger screens
            </p>
          </div>

        </div>
      </section>

      {/* Rest of your existing featured destinations section */}
      <section id="featured" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {t.title}
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              {t.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {destinations.slice(0, 8).map((dest) => (
              <DestinationCard
                key={dest.slug}
                destination={{
                  slug: dest.slug,
                  name: dest.name,
                  image: dest.images?.[0] || '/images/placeholder.jpg',
                  description: dest.description,
                  region: dest.region,
                  highlights: dest.highlights?.slice(0, 3) || [],
                }}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={`/${lang}/destinations`}
              className="bg-primary-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-300 inline-block border-1 border-green-600 shadow-md"
            >
              {t.exploreAll}
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
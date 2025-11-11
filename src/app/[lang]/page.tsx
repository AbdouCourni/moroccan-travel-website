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
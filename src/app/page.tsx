// src/app/page.tsx
import Hero from '../../components/Hero';
import DestinationCard from '../../components/DestinationCard';
import { selectTopDestinations } from '../../lib/firebase-server';
import { detectLanguage } from '../../lib/language-server';

// Translations for server component
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
};

export default async function HomePage() {
  const language = await detectLanguage();
  const destinations = await selectTopDestinations(20);
  const t = serverTranslations[language];

  return (
    <>
      <Hero />
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
            {destinations.map((dest) => (
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
              href="/destinations"
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
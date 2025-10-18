// src/app/page.tsx
import Hero from '../../components/Hero';
import DestinationCard from '../../components/DestinationCard';
import { selectTopDestinations } from '../../lib/firebase-server';
import { detectLanguage } from '../../lib/language-server';
import { Metadata } from 'next';
import { LocalBusinessStructuredData } from '../../components/seo/StructuredData';
import { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';




// Homepage-specific metadata - this overrides layout metadata
export const metadata: Metadata = {
  title: "Discover Morocco's Hidden Gems - Authentic Travel Experiences | MoroCompase",
  description: "Explore Morocco with local experts. Discover Marrakech, Fez, Sahara Desert tours, authentic riads, and hidden cultural gems. Your complete Morocco travel guide.",
  keywords: [
    "Morocco travel",
    "Marrakech guide", 
    "Sahara Desert tours",
    "Fez medina",
    "Moroccan riads",
    "local experiences",
    "Morocco tourism",
    "best time to visit Morocco",
    "Morocco travel packages"
  ],
  openGraph: {
    title: "MoroCompase - Discover Authentic Morocco Travel Experiences",
    description: "Your local guide to Morocco's hidden gems, cultural tours, and authentic stays",
    images: [
      {
        url: "/og-home.jpeg",
        width: 1200,
        height: 630,
        alt: "Discover Authentic Morocco with MoroCompase",
      },
    ],
    url: "https://morocompase.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "MoroCompase - Discover Morocco's Hidden Gems",
    description: "Authentic Moroccan travel experiences with local insights",
    images: ["/twitter-home.jpeg"],
  },
  alternates: {
    canonical: "/",
  },
};

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

export default function RedirectToDefaultLanguage() {
  // Permanently redirects the root URL (/) to the English URL (/en)
  redirect('/en');
}

// export default async function HomePage({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | string[] | undefined };
// }) {
//   // Get language from search params
//   const langParam = searchParams.lang as string;
//   const language = (['en', 'fr', 'ar', 'es'].includes(langParam) ? langParam : 'en') as 'en' | 'fr' | 'ar' | 'es';
  
//   const destinations = await selectTopDestinations(8);
//   const t = serverTranslations[language];

//   return (
//     <>
//       <LocalBusinessStructuredData />
//       <Hero />
//       <section id="featured" className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
//               {t.title}
//             </h2>
//             <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
//               {t.description}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {destinations.map((dest) => (
//               <DestinationCard
//                 key={dest.slug}
//                 destination={{
//                   slug: dest.slug,
//                   name: dest.name,
//                   image: dest.images?.[0] || '/images/placeholder.jpg',
//                   description: dest.description,
//                   region: dest.region,
//                   highlights: dest.highlights?.slice(0, 3) || [],
//                 }}
//                // currentLanguage={language}
//               />
//             ))}
//           </div>

//           <div className="text-center mt-12">
//             <a
//               href={`/destinations?lang=${language}`}
//               className="bg-primary-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-300 inline-block border-1 border-green-600 shadow-md"
//             >
//               {t.exploreAll}
//             </a>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
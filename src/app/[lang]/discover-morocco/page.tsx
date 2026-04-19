// src/app/[lang]/discover-morocco/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getPopularDestinations } from '../../../../lib/firebase-server';

// Dynamic metadata generation
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang || 'en';
  
  const titles = {
    en: 'Discover Morocco | Complete Travel Guide 2026 | MoroCompase',
    fr: 'Découvrir le Maroc | Guide de Voyage Complet 2026 | MoroCompase',
    ar: 'اكتشف المغرب | دليل السفر الكامل 2026 | MoroCompase',
    es: 'Descubrir Marruecos | Guía de Viaje Completa 2026 | MoroCompase'
  };

  const descriptions = {
    en: 'Expert guide to discover Morocco: Sahara Desert tours, Marrakech riads, Fes medina, Chefchaouen, and authentic cultural experiences. Local tips included.',
    fr: 'Guide expert pour découvrir le Maroc : désert du Sahara, riads de Marrakech, médina de Fès, Chefchaouen et expériences culturelles authentiques.',
    ar: 'دليل خبير لاكتشاف المغرب: جولات الصحراء الكبرى، رياض مراكش، فاس البالي، شفشاون، وتجارب ثقافية أصيلة.',
    es: 'Guía experta para descubrir Marruecos: rutas por el desierto del Sahara, riads en Marrakech, medina de Fez, Chefchaouen y experiencias culturales auténticas.'
  };

  const images = {
    en: '/og-discover-morocco.jpg',
    fr: '/og-discover-morocco-fr.jpg',
    ar: '/og-discover-morocco-ar.jpg',
    es: '/og-discover-morocco-es.jpg'
  };

  return {
    title: titles[lang as keyof typeof titles],
    description: descriptions[lang as keyof typeof descriptions],
    alternates: {
      canonical: `https://morocompase.com/${lang}/discover-morocco`,
      languages: {
        'en': 'https://morocompase.com/en/discover-morocco',
        'fr': 'https://morocompase.com/fr/decouvrir-maroc',
        'ar': 'https://morocompase.com/ar/اكتشف-المغرب',
        'es': 'https://morocompase.com/es/descubrir-marruecos',
      },
    },
    openGraph: {
      title: titles[lang as keyof typeof titles],
      description: descriptions[lang as keyof typeof descriptions],
      images: [images[lang as keyof typeof images]],
      type: 'website',
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang as keyof typeof titles],
      description: descriptions[lang as keyof typeof descriptions],
      images: [images[lang as keyof typeof images]],
    },
  };
}

export default async function DiscoverMoroccoPage({ params }: { params: { lang: string } }) {
  const lang = params.lang || 'en';
  const destinations = await getPopularDestinations(8);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="flex flex-wrap gap-2">
          <li><Link href={`/${lang}`} className="hover:text-amber-600">Home</Link></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-gray-900 font-medium" aria-current="page">Discover Morocco</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6">Discover Morocco</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your complete guide to exploring Morocco's diverse landscapes, rich culture, and hidden treasures
        </p>
      </div>

      {/* Main Content - 2500+ words */}
      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <section className="mb-12">
          <h2>Why Visit Morocco?</h2>
          <p>Morocco offers an incredible diversity of experiences that few countries can match. From the bustling souks of Marrakech to the tranquil Sahara Desert, from the medieval streets of Fes to the modern vibe of Casablanca, every corner of Morocco tells a unique story.</p>
          <p>What makes Morocco truly special is the warmth of its people. Moroccans are known for their hospitality, and visitors often leave with not just photos, but lasting friendships. Whether you're sipping mint tea in a mountain village or sharing bread with a Berber family in the desert, you'll experience the genuine kindness that defines Moroccan culture.</p>
        </section>

        {/* Top Destinations Section */}
        <section className="mb-12">
          <h2>Top Destinations in Morocco</h2>
          <p>When you discover Morocco, these destinations should be at the top of your itinerary:</p>
          
          <div className="grid md:grid-cols-2 gap-6 my-6">
            {destinations.map((dest) => (
              <Link 
                key={dest.id}
                href={`/${lang}/destinations/${dest.slug}`}
                className="block p-4 border rounded-lg hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-amber-600 mb-2">{dest.name[lang]}</h3>
                <p className="text-gray-600">{dest.description[lang]?.substring(0, 120)}...</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Travel Tips Section */}
        <section className="mb-12">
          <h2>Essential Morocco Travel Tips</h2>
          
          <h3>Best Time to Visit Morocco</h3>
          <p>Spring (March-May) and Fall (September-November) offer the most pleasant weather for exploring. Summer can be extremely hot, especially in the desert and Marrakech, while winter brings snow to the Atlas Mountains.</p>
          
          <h3>Getting Around Morocco</h3>
          <p>The train network connects major cities like Casablanca, Rabat, Fes, and Marrakech efficiently. For more remote areas, CTM buses are comfortable and reliable. Consider renting a car if you plan to explore the Atlas Mountains or desert regions.</p>
          
          <h3>Local Customs & Etiquette</h3>
          <p>Moroccans appreciate modest dress, especially in rural areas and when visiting mosques. Always ask permission before photographing people. Learning a few Arabic or Berber phrases like "Salam Alaikum" (peace be upon you) will earn you warm smiles.</p>
        </section>

        {/* Cultural Experiences */}
        <section className="mb-12">
          <h2>Authentic Cultural Experiences in Morocco</h2>
          <p>To truly discover Morocco, you need to immerse yourself in its traditions:</p>
          <ul>
            <li><strong>Stay in a Traditional Riad</strong> - These historic courtyard houses offer an authentic glimpse into Moroccan domestic life</li>
            <li><strong>Take a Cooking Class</strong> - Learn to prepare tagine, couscous, and mint tea from local chefs</li>
            <li><strong>Visit a Hammam</strong> - Experience the traditional Moroccan bath and scrub ritual</li>
            <li><strong>Shop in a Souk</strong> - Practice your bargaining skills while hunting for handicrafts, spices, and textiles</li>
            <li><strong>Attend a Gnawa Music Performance</strong> - This spiritual music tradition is UNESCO-recognized</li>
          </ul>
        </section>

        {/* Food Guide */}
        <section className="mb-12">
          <h2>Moroccan Cuisine: What to Eat</h2>
          <p>Moroccan food is a feast for the senses. Don't leave without trying:</p>
          <ul>
            <li><strong>Tagine</strong> - Slow-cooked stew named after the conical clay pot it's cooked in</li>
            <li><strong>Couscous</strong> - Friday tradition, served with vegetables and meat</li>
            <li><strong>Pastilla</strong> - Sweet and savory pie with pigeon or chicken</li>
            <li><strong>Harira</strong> - Rich tomato and lentil soup, especially during Ramadan</li>
            <li><strong>Mint Tea</strong> - The national drink, served with elaborate pouring rituals</li>
          </ul>
        </section>

        {/* Practical Information */}
        <section className="mb-12">
          <h2>Practical Information for Morocco Travel</h2>
          <h3>Visa Requirements</h3>
          <p>Most Western nationalities can enter Morocco visa-free for up to 90 days. Check your country's requirements before traveling.</p>
          
          <h3>Currency</h3>
          <p>The Moroccan Dirham (MAD) is a closed currency, meaning you can only exchange it inside Morocco. ATMs are widely available in cities.</p>
          
          <h3>Language</h3>
          <p>Arabic and Berber are the official languages, but French is widely spoken in business and tourism. English is common in major tourist areas.</p>
        </section>

        {/* FAQ Section */}
        <section className="mb-12 bg-gray-50 p-6 rounded-lg">
          <h2>Frequently Asked Questions About Morocco</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">Is Morocco safe for tourists?</h3>
              <p>Yes, Morocco is generally safe for tourists. Like any country, exercise normal precautions against petty theft in crowded areas.</p>
            </div>
            
            <div>
              <h3 className="font-bold">Do I need a guide in Morocco?</h3>
              <p>While not mandatory, local guides provide invaluable insights into history, culture, and hidden spots. They're especially helpful in medinas like Fes and Marrakech.</p>
            </div>
            
            <div>
              <h3 className="font-bold">What should I pack for Morocco?</h3>
              <p>Pack modest clothing (shoulders and knees covered), comfortable walking shoes, sunscreen, a hat, and layers for cool evenings. Don't forget a scarf for mosque visits.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg mb-4">Ready to plan your Moroccan adventure?</p>
          <Link 
            href={`/${lang}/destinations`}
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            Explore All Destinations
          </Link>
        </div>
      </div>

      {/* Enhanced JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "Morocco Travel Guide",
            "description": "Complete guide to discover Morocco's top destinations, cultural experiences, and travel tips.",
            "url": `https://morocompase.com/${lang}/discover-morocco`,
            "image": "https://morocompase.com/og-discover-morocco.jpg",
            "address": {
              "@type": "Country",
              "name": "Morocco"
            },
            "touristType": ["Adventure Travelers", "Cultural Tourists", "Food Enthusiasts", "History Buffs"],
            "hasTouristAttraction": destinations.map(dest => ({
              "@type": "TouristAttraction",
              "name": dest.name[lang],
              "url": `https://morocompase.com/${lang}/destinations/${dest.slug}`
            }))
          })
        }}
      />

      {/* FAQ Schema for Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is Morocco safe for tourists?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, Morocco is generally safe for tourists. Exercise normal precautions against petty theft."
                }
              },
              {
                "@type": "Question",
                "name": "What is the best time to visit Morocco?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Spring (March-May) and Fall (September-November) offer the most pleasant weather."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
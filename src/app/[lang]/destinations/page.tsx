// app/destinations/page.tsx
import Link from 'next/link';
import { selectTopDestinations, getAllDestinations,getAllDestinationsByRanking } from '../../../../lib/firebase-server';
import { MapPin, Star, Calendar } from 'lucide-react';

// Language configuration
const DEFAULT_LANGUAGE = 'en'; // You can change this based on user preference or context

// Helper function to get text in the selected language
function getLocalizedText(text: string | { [key: string]: string } | undefined, lang: string = DEFAULT_LANGUAGE): string {
  if (!text) return 'Unnamed Destination';
  
  if (typeof text === 'string') {
    return text;
  }
  
  // Return the requested language, fallback to English, then first available language
  return text[lang] || text['en'] || Object.values(text)[0] || 'Unnamed Destination';
}

// Helper function to get description
function getLocalizedDescription(description: string | { [key: string]: string } | undefined, lang: string = DEFAULT_LANGUAGE): string {
  if (!description) return 'Explore this beautiful Moroccan destination';
  
  if (typeof description === 'string') {
    return description;
  }
  
  return description[lang] || description['en'] || Object.values(description)[0] || 'Explore this beautiful Moroccan destination';
}

export default async function DestinationsPage() {
  // Fetch destinations from Firebase
  //const destinations = await selectTopDestinations(12);
  //const destinations = await getAllDestinations();
  const destinations = await getAllDestinationsByRanking();
  
  // If no destinations found, show fallback
  if (!destinations || destinations.length === 0) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-r from-[var(--primary-gold)] to-[var(--moroccan-blue)] py-16 text-white">
          <div className="bg- max-w-7xl mx-auto px-4 text-center">
            <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-4">Discover Morocco</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Explore the diverse regions and cities that make Morocco a unique travel destination
            </p>
          </div>
        </section>

        {/* Error State */}
        <section className="py-16 px-4 max-w-7xl mx-auto text-center">
          <div className="bg-gray-50 rounded-2xl p-12">
            <div className="text-6xl mb-4">🏜️</div>
            <h2 className="font-amiri text-2xl font-bold text-gray-900 mb-4">
              No Destinations Found
            </h2>
            <p className="text-gray-600 mb-6">
              We're having trouble loading destinations. Please check back later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-300"
            >
              Try Again
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-[var(--primary-gold)] to-[var(--moroccan-blue)] py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-4">Discover Morocco</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore the diverse regions and cities that make Morocco a unique travel destination
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>{destinations.length}+ Destinations</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Star className="w-4 h-4" />
              <span>Curated Experiences</span>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => {
            const displayName = getLocalizedText(destination.name, DEFAULT_LANGUAGE);
            const displayDescription = getLocalizedDescription(destination.description, DEFAULT_LANGUAGE);
            
            return (
              <Link 
                key={destination.id} 
                href={`/destinations/${destination.slug}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={destination.images?.[0] || '/images/placeholder-destination.jpg'} 
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    
                    {/* Region Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                        {destination.region}
                      </span>
                    </div>

                    {/* Popularity Badge
                    {destination.popularity && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {destination.popularity > 4 ? 'Popular' : 'Trending'}
                        </span>
                      </div>
                    )} */}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-amiri text-xl font-bold text-gray-900 line-clamp-1">
                          {displayName}
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {displayDescription}
                      </p>

                      {/* Highlights */}
                      {destination.highlights && destination.highlights.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Highlights</h4>
                          <div className="flex flex-wrap gap-1">
                            {destination.highlights.slice(0, 3).map((highlight, index) => (
                              <span 
                                key={index}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                              >
                                {highlight}
                              </span>
                            ))}
                            {destination.highlights.length > 3 && (
                              <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
                                +{destination.highlights.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        {destination.bestSeason && destination.bestSeason.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{destination.bestSeason[0]}</span>
                          </div>
                        )}
                        
                        {destination.activities && (
                          <span className="text-primary-gold font-semibold">
                            {destination.activities.length}+ activities
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Showing {destinations.length} of Morocco's finest destinations
          </p>
          <Link 
            href="/destinations/all"
            className="inline-flex items-center gap-2 bg-white text-moroccan-blue border border-moroccan-blue px-6 py-3 rounded-lg font-semibold hover:bg-moroccan-blue hover:text-white transition-all duration-300"
          >
            View All Destinations
            <MapPin className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Regions Overview */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-amiri text-3xl font-bold text-gray-900 mb-4">
            Explore by Region
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Morocco is divided into diverse regions, each offering unique landscapes, culture, and experiences
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {Array.from(new Set(destinations.map(d => d.region))).map((region) => (
              <div key={region} className="text-center p-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-gold to-moroccan-blue rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {region.charAt(0)}
                </div>
                <h3 className="font-semibold text-gray-900">{region}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {destinations.filter(d => d.region === region).length} destinations
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
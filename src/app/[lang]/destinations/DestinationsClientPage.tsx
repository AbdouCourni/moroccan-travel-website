// app/destinations/DestinationsClientPage.tsx (Client Component)
'use client';

import { useState, useMemo, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import Link from 'next/link';
import { MapPin, Star, Calendar, Search, X, Filter } from 'lucide-react';
import { Destination } from '../../../../types';

// Language configuration
const DEFAULT_LANGUAGE = 'en';

// Helper functions (same as before)
function getLocalizedText(text: string | { [key: string]: string } | undefined, lang: string = DEFAULT_LANGUAGE): string {
  if (!text) return 'Unnamed Destination';
  
  if (typeof text === 'string') {
    return text;
  }
  
  return text[lang] || text['en'] || Object.values(text)[0] || 'Unnamed Destination';
}

function getLocalizedDescription(description: string | { [key: string]: string } | undefined, lang: string = DEFAULT_LANGUAGE): string {
  if (!description) return 'Explore this beautiful Moroccan destination';
  
  if (typeof description === 'string') {
    return description;
  }
  
  return description[lang] || description['en'] || Object.values(description)[0] || 'Explore this beautiful Moroccan destination';
}

interface DestinationsClientPageProps {
  initialDestinations: Destination[];
}

export default function DestinationsClientPage({ initialDestinations }: DestinationsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [destinations] = useState(initialDestinations);

  // Extract unique regions for filter
  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(destinations.map(d => d.region)));
    return ['all', ...uniqueRegions].filter(Boolean);
  }, [destinations]);

  // Filter destinations based on search and region
  const filteredDestinations = useMemo(() => {
    let filtered = destinations;

    // Apply region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(destination => 
        destination.region?.toLowerCase() === selectedRegion.toLowerCase()
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(destination => {
        const name = getLocalizedText(destination.name).toLowerCase();
        const description = getLocalizedDescription(destination.description).toLowerCase();
        const region = destination.region?.toLowerCase() || '';
        
        return (
          name.includes(query) ||
          description.includes(query) ||
          region.includes(query) ||
          destination.highlights?.some((highlight: string) => 
            highlight.toLowerCase().includes(query)
          ) ||
          destination.activities?.some((activity: string) => 
            activity.toLowerCase().includes(query)
          )
        );
      });
    }

    return filtered;
  }, [destinations, searchQuery, selectedRegion]);

  // Get regions for the stats
  const regionStats = useMemo(() => {
    const stats: { [key: string]: number } = {};
    destinations.forEach(destination => {
      const region = destination.region || 'Unknown';
      stats[region] = (stats[region] || 0) + 1;
    });
    return stats;
  }, [destinations]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedRegion('all');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Search */}
      <section className="bg-gradient-to-r from-[var(--primary-gold)] to-[var(--moroccan-blue)] py-12 md:py-16 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="font-amiri text-4xl md:text-5xl font-bold mb-4">Discover Morocco</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Explore the diverse regions and cities that make Morocco a unique travel destination
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
                <div className="flex items-center px-4 py-3">
                  <Search className="w-5 h-5 text-white/70 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search destinations, regions, activities..."
                    className="flex-1 bg-transparent text-white placeholder-white/60 outline-none text-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-white/70" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
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
          </div>
        </div>
      </section>

      {/* Filters and Results Summary */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Region Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 font-medium mr-2">Filter by:</span>
              {regions.slice(0, 8).map(region => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedRegion === region
                      ? 'bg-primary-gold text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {region === 'all' ? 'All Regions' : region}
                  {region !== 'all' && (
                    <span className="ml-1 text-xs opacity-80">
                      ({regionStats[region] || 0})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Results Counter */}
            <div className="text-gray-600">
              {filteredDestinations.length === destinations.length ? (
                <span>Showing all {destinations.length} destinations</span>
              ) : (
                <span>
                  Found {filteredDestinations.length} of {destinations.length} destinations
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedRegion !== 'all' && ` in ${selectedRegion}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        {filteredDestinations.length === 0 ? (
          // No Results State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="font-amiri text-2xl font-bold text-gray-900 mb-3">
              No destinations found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery ? (
                `No destinations match "${searchQuery}"${selectedRegion !== 'all' ? ` in ${selectedRegion}` : ''}. Try a different search term.`
              ) : (
                `No destinations found in ${selectedRegion}. Try selecting a different region.`
              )}
            </p>
            <button
              onClick={clearSearch}
              className="inline-flex items-center gap-2 bg-primary-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        ) : (
          // Destinations Grid
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => {
                const displayName = getLocalizedText(destination.name, DEFAULT_LANGUAGE);
                const displayDescription = getLocalizedDescription(destination.description, DEFAULT_LANGUAGE);
                
                return (
                  <Link 
                    key={destination.id} 
                    href={`/destinations/${destination.slug}`}
                    className="block group"
                  >
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
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
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-amiri text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-primary-gold transition-colors">
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
                                {destination.highlights.slice(0, 3).map((highlight: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
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
            {filteredDestinations.length >= destinations.length && (
              <div className="text-center mt-12">
                <p className="text-gray-600 mb-4">
                  Showing all {destinations.length} of Morocco's finest destinations
                </p>
                <Link 
                  href="/destinations/all"
                  className="inline-flex items-center gap-2 bg-white text-moroccan-blue border border-moroccan-blue px-6 py-3 rounded-lg font-semibold hover:bg-moroccan-blue hover:text-white transition-all duration-300"
                >
                  View All Destinations
                  <MapPin className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Regions Overview - Only show if no active filters */}
      {searchQuery === '' && selectedRegion === 'all' && (
        <section className="bg-white py-16 border-t">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="font-amiri text-3xl font-bold text-gray-900 mb-4">
              Explore by Region
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Morocco is divided into diverse regions, each offering unique landscapes, culture, and experiences
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {Object.entries(regionStats).map(([region, count]) => (
                <div key={region} className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-gold to-moroccan-blue rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                    {region.charAt(0)}
                  </div>
                  <h3 className="font-semibold text-gray-900">{region}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {count} destination{count !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
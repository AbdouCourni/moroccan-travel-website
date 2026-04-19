// app/[lang]/stays/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { AccommodationPlatformCard } from '../../../../components/AccommodationPlatformCard';
import { AccommodationPlatform } from '../../../../types';
import { getAccommodationPlatforms } from '../../../../lib/firebase-server';

const accommodationPlatforms = await getAccommodationPlatforms();


// useEffect(() => {
//   const fetchPlatforms = async () => {
//     const accommodationPlatforms = await getAccommodationPlatforms();
//     setPlatforms(accommodationPlatforms);
//   };
//   fetchPlatforms();
// }, []);

export default function StaysPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [destination, setDestination] = useState('');

  const filteredPlatforms = accommodationPlatforms.filter(platform => {
    if (selectedPlatform !== 'all' && platform.id !== selectedPlatform) return false;
    if (searchTerm && !platform.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // You can use the destination for filtering or pass to cards
    console.log('Searching for:', destination);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-gold/20 via-amber-50 to-primary-gold/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-amiri text-5xl md:text-6xl font-bold text-dark-charcoal mb-4">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compare prices from the world's best booking platforms. Find the perfect riad, hotel, or apartment for your Moroccan adventure.
          </p>
        </div>
      </div>

      {/* Search Section */}
     

      {/* Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                selectedPlatform === 'all'
                  ? 'bg-primary-gold text-black font-semibold shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Platforms
            </button>
            {accommodationPlatforms.map(platform => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedPlatform === platform.id
                    ? 'bg-primary-gold text-black font-semibold shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            placeholder="Search platform..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none w-full md:w-64"
          />
        </div>

        {/* Results Count */}
        <p className="text-center text-gray-500 mb-6">
          Found {filteredPlatforms.length} booking platforms
        </p>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlatforms.map((platform) => (
            <AccommodationPlatformCard 
              key={platform.id} 
              platform={platform} 
              destinationName={destination || 'Morocco'}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPlatforms.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No platforms found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-full">
            <span className="text-sm text-gray-600">
              🔒 Secure Booking • Best Price Guarantee • Free Cancellation on Most Properties
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/[lang]/transport/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { TransportationPlatformCard } from '../../../../components/TransportationPlatformCard';
import { TransportationPlatform } from '../../../../types';
import { getTransportationPlatforms } from '../../../../lib/firebase-server';

export default function TransportPage() {
  const [platforms, setPlatforms] = useState<TransportationPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    try {
      const data = await getTransportationPlatforms();
      setPlatforms(data);
    } catch (error) {
      console.error('Error loading transportation platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlatforms = platforms.filter(platform => {
    if (selectedPlatform !== 'all' && platform.id !== selectedPlatform) return false;
    if (searchTerm && !platform.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // You can use the destination for filtering or pass to cards
    console.log('Searching for transport to:', destination);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading transportation options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600/20 via-cyan-50 to-blue-600/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-amiri text-5xl md:text-6xl font-bold text-dark-charcoal mb-4">
            Getting Around Morocco
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compare prices from the best transportation platforms. Find trains, buses, car rentals, and flights for your Moroccan journey.
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
            {platforms.map(platform => (
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
          Found {filteredPlatforms.length} transportation platforms
        </p>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlatforms.map((platform) => (
            <TransportationPlatformCard 
              key={platform.id} 
              platform={platform} 
              destinationName={destination || 'Morocco'}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPlatforms.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No transportation platforms found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-full">
            <span className="text-sm text-gray-600">
              🔒 Secure Booking • Price Comparison • Best Deals on Transportation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
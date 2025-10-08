'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Accommodation } from '../../../types';

export default function StaysPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    priceRange: [0, 500],
    amenities: [] as string[]
  });

  useEffect(() => {
    loadAccommodations();
  }, []);

  const loadAccommodations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'accommodations'));
      const accommodationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Accommodation[];
      setAccommodations(accommodationsData);
    } catch (error) {
      console.error('Error loading accommodations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-lg">Loading accommodations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-amiri text-4xl font-bold text-dark-charcoal">Find Your Perfect Stay</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Discover authentic riads, desert camps, and modern apartments across Morocco
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select 
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Cities</option>
                <option value="marrakech">Marrakech</option>
                <option value="fes">Fes</option>
                <option value="chefchaouen">Chefchaouen</option>
                <option value="casablanca">Casablanca</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select 
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Types</option>
                <option value="riad">Riad</option>
                <option value="hotel">Hotel</option>
                <option value="apartment">Apartment</option>
                <option value="desert_camp">Desert Camp</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </label>
              <input 
                type="range" 
                min="0" 
                max="500" 
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <select 
                multiple
                value={filters.amenities}
                onChange={(e) => setFilters({...filters, amenities: Array.from(e.target.selectedOptions, option => option.value)})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="wifi">WiFi</option>
                <option value="pool">Pool</option>
                <option value="breakfast">Breakfast</option>
                <option value="air_conditioning">Air Conditioning</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accommodations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accommodations.map((accommodation) => (
            <div key={accommodation.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <img 
                src={accommodation.images[0] || '/images/default-accommodation.jpg'} 
                alt={accommodation.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-amiri text-xl font-bold">{accommodation.name}</h3>
                  <span className="bg-primary-gold text-white px-2 py-1 rounded text-sm">
                    ${accommodation.price.nightly}/night
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{accommodation.city} • {accommodation.type}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 font-semibold">{accommodation.rating}</span>
                    <span className="text-gray-500 ml-1">({accommodation.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>

                <button className="w-full btn-primary">View Details</button>
              </div>
            </div>
          ))}
        </div>

        {accommodations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No accommodations found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
// components/TransportationSection.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bus, Car, Train, ExternalLink } from 'lucide-react';
import { getTransportationPlatforms } from '../lib/firebase-server';
import { TransportationPlatform } from '../types';

interface TransportationSectionProps {
  destinationName: string;
}

export function TransportationSection({ destinationName }: TransportationSectionProps) {
  const [platforms, setPlatforms] = useState<TransportationPlatform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlatforms() {
      try {
        const data = await getTransportationPlatforms();
        // Get only first 3 for the section
        setPlatforms(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching transportation platforms:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlatforms();
  }, []);

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'train': return <Train className="w-5 h-5" />;
      case 'bus': return <Bus className="w-5 h-5" />;
      case 'car_rental': return <Car className="w-5 h-5" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <section id="transport" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading transportation options...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!platforms.length) {
    return null;
  }

  return (
    <section id="transport" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-amiri text-4xl font-bold text-dark-charcoal mb-4">
            Getting to {destinationName}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the best way to reach and explore this destination
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <div key={platform.id || index} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <Image
                  src={platform.image || '/images/transport-placeholder.jpg'}
                  alt={platform.name}
                  width={400}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-primary-gold">
                    {getTransportIcon(platform.transportTypes?.[0] || 'car_rental')}
                  </div>
                  <h3 className="font-amiri text-xl font-bold text-dark-charcoal">
                    {platform.name}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {platform.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {platform.transportTypes?.join(', ') || 'Transportation'}
                  </span>
                  <a
                    href={platform.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-gold font-semibold text-sm hover:underline flex items-center gap-1"
                  >
                    Book Now <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See All Button */}
        <div className="text-center mt-12">
          <Link
            href="/transport"
            className="inline-flex items-center gap-2 bg-primary-gold text-orange px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-300"
          >
            See All Transportation Options
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
// components/AccommodationPlatformCard.tsx
'use client';

import Image from 'next/image';
import { ExternalLink, Star } from 'lucide-react';
import { AccommodationPlatform } from '../types';


interface AccommodationPlatformCardProps {
  platform: AccommodationPlatform;
  destinationName?: string;
}

export function AccommodationPlatformCard({ platform, destinationName }: AccommodationPlatformCardProps) {
  // Inject destination name into affiliate link if needed
  const getAffiliateLink = () => {
    let link = platform.affiliateLink;
    if (destinationName && link.includes('{{destination}}')) {
      link = link.replace('{{destination}}', encodeURIComponent(destinationName));
    }
    return link;
  };

  const handleBookNow = () => {
    window.open(getAffiliateLink(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={platform.image}
          alt={platform.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {platform.rating && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-bold text-gray-800">{platform.rating}</span>
            {platform.reviewCount && (
              <span className="text-xs text-gray-500">({platform.reviewCount})</span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-amiri text-2xl font-bold text-gray-900 group-hover:text-primary-gold transition-colors">
            {platform.name}
          </h3>
          {platform.commission && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {platform.commission}
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {platform.description}
        </p>

        {platform.features && platform.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {platform.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleBookNow}
          className="w-full bg-primary-gold text-black py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2 group"
          style={{ backgroundColor: platform.color || '#d4af37' }}
        >
          <span>Book on {platform.name}</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
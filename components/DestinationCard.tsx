// components/DestinationCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import { Destination } from '../types';
import { useState, memo, useCallback } from 'react';
import { MapPin, Star, ArrowRight, Heart } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';

interface DestinationCardProps {
  destination: Destination;
  priority?: boolean;
  prefetch?: boolean;
  showFavorite?: boolean;
}

const DestinationCard = memo(function DestinationCard({ 
  destination, 
  priority = false,
  prefetch = true, // Changed to true by default
  showFavorite = false
}: DestinationCardProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const displayName = destination.name[language] || destination.name.en;
  const displayDescription = destination.description[language] || destination.description.en;
  const routeHref = `/destinations/${destination.slug}` as Route;

  // Prefetch on hover for instant navigation
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    // Prefetch the destination page on hover
    router.prefetch(routeHref);
  }, [router, routeHref]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <Link 
      href={routeHref}
      prefetch={prefetch}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="block group focus:outline-none focus:ring-2 focus:ring-primary-gold focus:ring-offset-2 rounded-xl"
      aria-label={`Explore ${displayName}`}
    >
      <article className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={destination.images?.[0] || '/images/placeholder.jpg'}
            alt={displayName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            quality={85}
          />
          
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
          )}
          
          {destination.ranking > 0 && (
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 z-10">
              <Star className="w-3.5 h-3.5 fill-primary-gold text-primary-gold" />
              <span className="text-white text-sm font-semibold">{destination.ranking.toFixed(1)}</span>
            </div>
          )}
          
          {showFavorite && (
            <button
              onClick={handleFavorite}
              className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:scale-110 transition-all duration-300"
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'
                }`} 
              />
            </button>
          )}
          
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-primary-gold" />
              <span className="text-xs font-medium text-white">{destination.region}</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-primary-gold transition-colors line-clamp-1">
            {displayName}
          </h3>
          
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {displayDescription}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {destination.highlights?.slice(0, 2).map((highlight, index) => (
              <span
                key={index}
                className="text-xs bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full font-medium"
              >
                {highlight}
              </span>
            ))}
            {destination.highlights?.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                +{destination.highlights.length - 2}
              </span>
            )}
          </div>
        </div>

        <div className={`px-4 pb-4 transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <span className="inline-flex items-center gap-1 text-primary-gold text-sm font-medium">
            Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </article>
    </Link>
  );
});

export default DestinationCard;
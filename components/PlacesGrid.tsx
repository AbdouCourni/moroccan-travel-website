// components/PlacesGrid.tsx
'use client';

import Link from 'next/link';
import { Star, MapPin, Clock, Heart } from 'lucide-react';
import { Place as PlaceType } from '../types';
import { useLanguage, type Language } from '../contexts/LanguageContext';

interface PlacesGridProps {
  places: PlaceType[];
  slug: string;
  columns?: number;
}

// Define valid category and type keys
type CategoryKey = 'cultural' | 'food' | 'nature' | 'shopping' | 'entertainment' | 'religious';
type TypeKey = 'landmark' | 'museum' | 'restaurant' | 'market' | 'park' | 'beach' | 'historical' | 'religious' | 'viewpoint';

// Category translations with proper typing
const categoryTranslations: Record<Language, Record<CategoryKey | 'default', string>> = {
  en: {
    cultural: 'Cultural',
    food: 'Food & Dining',
    nature: 'Nature',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    religious: 'Religious',
    default: 'Place'
  },
  fr: {
    cultural: 'Culturel',
    food: 'Nourriture',
    nature: 'Nature',
    shopping: 'Shopping',
    entertainment: 'Divertissement',
    religious: 'Religieux',
    default: 'Lieu'
  },
  ar: {
    cultural: 'ثقافي',
    food: 'طعام',
    nature: 'طبيعة',
    shopping: 'تسوق',
    entertainment: 'ترفيه',
    religious: 'ديني',
    default: 'مكان'
  },
  es: {
    cultural: 'Cultural',
    food: 'Comida',
    nature: 'Naturaleza',
    shopping: 'Compras',
    entertainment: 'Entretenimiento',
    religious: 'Religioso',
    default: 'Lugar'
  }
};

// Type translations with proper typing
const typeTranslations: Record<Language, Record<TypeKey | 'default', string>> = {
  en: {
    landmark: 'Landmark',
    museum: 'Museum',
    restaurant: 'Restaurant',
    market: 'Market',
    park: 'Park',
    beach: 'Beach',
    historical: 'Historical',
    religious: 'Religious',
    viewpoint: 'Viewpoint',
    default: 'Place'
  },
  fr: {
    landmark: 'Point de repère',
    museum: 'Musée',
    restaurant: 'Restaurant',
    market: 'Marché',
    park: 'Parc',
    beach: 'Plage',
    historical: 'Historique',
    religious: 'Religieux',
    viewpoint: 'Point de vue',
    default: 'Lieu'
  },
  ar: {
    landmark: 'معلم',
    museum: 'متحف',
    restaurant: 'مطعم',
    market: 'سوق',
    park: 'حديقة',
    beach: 'شاطئ',
    historical: 'تاريخي',
    religious: 'ديني',
    viewpoint: 'نقطة مشاهدة',
    default: 'مكان'
  },
  es: {
    landmark: 'Punto de referencia',
    museum: 'Museo',
    restaurant: 'Restaurante',
    market: 'Mercado',
    park: 'Parque',
    beach: 'Playa',
    historical: 'Histórico',
    religious: 'Religioso',
    viewpoint: 'Mirador',
    default: 'Lugar'
  }
};

export function PlacesGrid({ places, slug, columns = 3 }: PlacesGridProps) {
  const { t, language } = useLanguage();
  
  console.log('placesGrid places param', places.length);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  const getPriceLevel = (level?: number) => {
    if (!level) return null;
    return '$'.repeat(level);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cultural: 'bg-blue-100 text-blue-800',
      food: 'bg-red-100 text-red-800',
      nature: 'bg-green-100 text-green-800',
      shopping: 'bg-purple-100 text-purple-800',
      entertainment: 'bg-pink-100 text-pink-800',
      religious: 'bg-amber-100 text-amber-800',
      default: 'bg-gray-100 text-gray-800',
    };
    
    return colors[category] || colors.default;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      cultural: '🏛️',
      food: '🍴',
      nature: '🌿',
      shopping: '🛍️',
      entertainment: '🎭',
      religious: '🕌',
      default: '📍',
    };
    
    return icons[category] || icons.default;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      landmark: '🏛️',
      museum: '🖼️',
      restaurant: '🍴',
      market: '🛍️',
      park: '🌳',
      beach: '🏖️',
      historical: '🏺',
      religious: '🕌',
      viewpoint: '🌄',
      default: '📍',
    };
    
    return icons[type] || icons.default;
  };

  // Get localized text for place content
  const getLocalizedText = (text: any): string => {
    if (!text) return '';
    
    if (typeof text === 'string') {
      return text;
    }
    
    return text[language] || text['en'] || Object.values(text)[0] || '';
  };

  // Get localized category name with type safety
  const getLocalizedCategory = (category: string): string => {
    const langTranslations = categoryTranslations[language];
    const validCategory = category as CategoryKey;
    
    if (validCategory in langTranslations) {
      return langTranslations[validCategory];
    }
    
    return langTranslations.default;
  };

  // Get localized type name with type safety
  const getLocalizedType = (type: string): string => {
    const langTranslations = typeTranslations[language];
    const validType = type as TypeKey;
    
    if (validType in langTranslations) {
      return langTranslations[validType];
    }
    
    return langTranslations.default;
  };

  // Safe rating display with fallback
  const displayRating = (place: PlaceType) => {
    if (place.rating && place.reviewCount) {
      return (
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold">{place.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-300">({place.reviewCount})</span>
        </div>
      );
    }
    return null;
  };

  // Safe price display
  const displayPrice = (place: PlaceType) => {
    if (place.entranceFee) {
      const price = place.entranceFee.tourist || place.entranceFee.local;
      return (
        <div className="text-green-600 font-semibold text-sm">
          {price} {place.entranceFee.currency}
        </div>
      );
    }
    return null;
  };

  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏜️</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {t('noPlacesFound') || 'No places found'}
        </h3>
        <p className="text-gray-500">
          {t('checkBackLater') || 'Check back later for new places in this destination.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {places.map((place) => (
        <div
          key={place.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
        >
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={place.images?.[0] || '/images/placeholder.jpg'}
              alt={getLocalizedText(place.name)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(place.category)}`}>
                <span className="text-xs">{getCategoryIcon(place.category)}</span>
                {getLocalizedCategory(place.category)}
              </span>
            </div>

            {/* Type Badge */}
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700">
                <span className="text-xs">{getTypeIcon(place.type)}</span>
                {getLocalizedType(place.type)}
              </span>
            </div>

            {/* Favorite Button */}
            <button className="absolute top-12 right-3 bg-white/90 hover:bg-white text-gray-600 rounded-full p-2 transition-all duration-300">
              <Heart className="w-4 h-4" />
            </button>

            {/* Rating Badge */}
            {displayRating(place)}
          </div>

          {/* Content Section */}
          <div className="p-5">
            {/* Title and Location */}
            <div className="mb-3">
              <h3 className="font-amiri text-xl font-bold text-dark-charcoal mb-2 line-clamp-1">
                {getLocalizedText(place.name)}
              </h3>
              {place.location?.address && (
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{place.location.address}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {getLocalizedText(place.description) || (t('noDescription') || 'No description available.')}
            </p>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-4">
                {place.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{place.duration}</span>
                  </div>
                )}
                {displayPrice(place)}
              </div>
            </div>

            {/* Tags */}
            {place.tips && place.tips.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {place.tips.slice(0, 3).map((tip, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                  >
                    {getLocalizedText(tip)}
                  </span>
                ))}
                {place.tips.length > 3 && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                    +{place.tips.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Best Time to Visit */}
            {place.bestTimeToVisit && place.bestTimeToVisit.length > 0 && (
              <div className="mb-4">
                <span className="text-xs text-gray-500">
                  {t('bestTime') || 'Best time'}: 
                </span>
                <span className="text-xs text-primary-gold font-medium ml-1">
                  {place.bestTimeToVisit.join(', ')}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link
                href={`/destinations/${slug}/places/${place.id}`}
                className="flex-1 bg-primary-gold text-green-600 text-center py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-300"
              >
                {t('viewDetails') || 'View Details'}
              </Link>
              <button className="px-4 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:border-primary-gold hover:text-primary-gold transition duration-300">
                {t('save') || 'Save'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
// components/ActivityCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ActivityCardProps {
  activity: any;
  lang: string;
  destinationSlug: string;
}

export function ActivityCard({ activity, lang, destinationSlug }: ActivityCardProps) {
  const title = activity.title?.[lang] || activity.title?.en || 'Activity';
  const shortDescription = activity.shortDescription?.[lang] || activity.shortDescription?.en || activity.description?.[lang] || '';
  const image = activity.images?.[0] || '/images/activity-placeholder.jpg';
  
  const categoryColors: Record<string, string> = {
    nature: 'bg-green-100 text-green-700',
    cultural: 'bg-blue-100 text-blue-700',
    food: 'bg-red-100 text-red-700',
    adventure: 'bg-orange-100 text-orange-700',
    workshop: 'bg-purple-100 text-purple-700',
  };
  
  const categoryLabels: Record<string, string> = {
    nature: '🌿 Nature',
    cultural: '🏛️ Cultural',
    food: '🍽️ Food',
    adventure: '⚡ Adventure',
    workshop: '🎨 Workshop',
  };
  
  const categoryClass = categoryColors[activity.category] || 'bg-gray-100 text-gray-700';
  const categoryLabel = categoryLabels[activity.category] || activity.category;

  return (
    <Link href={`/${lang}/destinations/${destinationSlug}/activities/${activity.slug}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={image}
            alt={title}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryClass}`}>
              {categoryLabel}
            </span>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs">
            ⏱️ {activity.duration}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="font-amiri text-xl font-bold text-dark-charcoal mb-2 group-hover:text-primary-gold transition-colors line-clamp-1">
            {title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {shortDescription}
          </p>
          
          {/* Price */}
          {activity.price && activity.price.amount > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary-gold font-bold">
                {activity.price.amount} {activity.price.currency}
              </span>
              {activity.price.description && (
                <span className="text-xs text-gray-500">({activity.price.description})</span>
              )}
            </div>
          )}
          
          {/* Rating */}
          {activity.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-semibold">{activity.rating}</span>
              </div>
              {activity.reviewCount && (
                <span className="text-xs text-gray-500">({activity.reviewCount} reviews)</span>
              )}
            </div>
          )}
          
          {/* Read More Link */}
          <div className="mt-4 text-primary-gold font-semibold text-sm group-hover:underline">
            View Details →
          </div>
        </div>
      </div>
    </Link>
  );
}
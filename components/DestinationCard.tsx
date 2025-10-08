// components/DestinationCard.tsx
'use client';

import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { MultiLanguageText } from '../types';

interface DestinationCardProps {
  destination: {
    slug: string;
    name: MultiLanguageText;
    image: string;
    description: MultiLanguageText;
    region: string;
    highlights: string[];
  };
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const { language } = useLanguage();

  // Now 100% type-safe — no error!
  const displayName = destination.name[language] || destination.name.en;
  const displayDescription = destination.description[language] || destination.description.en;

  console.log(destination.name[language]+'_____'+destination.image);
  return (
    <Link href={`/destinations/${destination.slug}`}>
      <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
        <div >
          <img 
            src={destination.image} 
            alt={displayName}
            className="w-full h-48  group-hover:scale-105 transition-transform duration-300"
          />
          <div/>
        </div>
        <div className="p-4">
          <h3 className="font-amiri text-xl font-bold text-dark-charcoal group-hover:text-primary-gold transition-colors">
            {displayName}
          </h3>
          <p className="text-gray-600 mt-2 line-clamp-2">
            {displayDescription}
          </p>
          <div className="mt-3">
            <span className="text-sm text-moroccan-blue font-semibold">
              {destination.region}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {destination.highlights.slice(0, 3).map((highlight, index) => (
              <span 
                key={index}
                className="text-xs bg-desert-sand text-dark-charcoal px-2 py-1 rounded"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
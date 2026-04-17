// components/AccommodationSection.tsx
'use client';

import { AccommodationCard } from './AccommodationCard';
import {Language} from '../types'

interface AccommodationSectionProps {
  destinationName: string;
  language: Language;
}

export function AccommodationSection({ destinationName, language }: AccommodationSectionProps) {
 const titleMap: Record<Language, string> = {
  en: `Where to Stay in ${destinationName}`,
  fr: `Où séjourner à ${destinationName}`,
  ar: `أين تقيم في ${destinationName}`,
  es: `Dónde alojarse en ${destinationName}`
};

  const subtitleText : Record<Language, string>= {
    en: 'Find the perfect accommodation for your stay',
    fr: 'Trouvez l\'hébergement parfait pour votre séjour',
    ar: 'ابحث عن الإقامة المثالية لإقامتك',
    es: 'Encuentra el alojamiento perfecto para tu estancia'
  };

  return (
    <section id="accommodation" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-amiri text-4xl font-bold text-dark-charcoal mb-4">
            {titleMap[language]}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {subtitleText[language]}
          </p>
        </div>
        
        <AccommodationCard 
          destinationName={destinationName}
          showAllPartners={false}
          maxPartners={3}
        />
      </div>
    </section>
  );
}
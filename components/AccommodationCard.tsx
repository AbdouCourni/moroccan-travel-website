// components/AccommodationCard.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { AffiliatePartner } from '../types';
import { ExternalLink, Award } from 'lucide-react';

// List of external booking websites - you can easily add more here
const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  {
    id: 'booking',
    name: 'Booking.com',
    icon: '🏨',
    baseUrl: 'https://www.booking.com/searchresults.html',
    color: '#003580',
    textColor: 'white',
    commission: 'Best deals',
    isActive: true
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    icon: '🏠',
    baseUrl: 'https://www.airbnb.com/s',
    color: '#FF5A5F',
    textColor: 'white',
    commission: 'Unique stays',
    isActive: true
  },
  {
    id: 'expedia',
    name: 'Expedia',
    icon: '✈️',
    baseUrl: 'https://www.expedia.com/Hotel-Search',
    color: '#01A9DB',
    textColor: 'white',
    commission: 'Package deals',
    isActive: true
  },
  {
    id: 'agoda',
    name: 'Agoda',
    icon: '🏮',
    baseUrl: 'https://www.agoda.com/search',
    color: '#E31837',
    textColor: 'white',
    commission: 'Secret deals',
    isActive: true
  },
  {
    id: 'hotelscom',
    name: 'Hotels.com',
    icon: '🏢',
    baseUrl: 'https://www.hotels.com/search',
    color: '#C9142E',
    textColor: 'white',
    commission: 'Rewards program',
    isActive: true
  },
  {
    id: 'tripadvisor',
    name: 'Tripadvisor',
    icon: '🦉',
    baseUrl: 'https://www.tripadvisor.com/Hotels',
    color: '#00AA6C',
    textColor: 'white',
    commission: 'Compare prices',
    isActive: true
  }
];

interface AccommodationCardProps {
  destinationName: string;
  className?: string;
  showAllPartners?: boolean;
  maxPartners?: number;
}

export function AccommodationCard({ 
  destinationName, 
  className = '',
  showAllPartners = false,
  maxPartners = 3
}: AccommodationCardProps) {
  const { language } = useLanguage();
  const [hoveredPartner, setHoveredPartner] = useState<string | null>(null);

  // Filter active partners
  const activePartners = AFFILIATE_PARTNERS.filter(p => p.isActive);
  
  // Show limited partners or all
  const displayedPartners = showAllPartners ? activePartners : activePartners.slice(0, maxPartners);

  // Generate search URL with destination injection
  const generateBookingUrl = (partner: AffiliatePartner): string => {
    const encodedDestination = encodeURIComponent(destinationName);
    
    // Different URL formats for different partners
    const urlFormats: Record<string, string> = {
      booking: `${partner.baseUrl}?ss=${encodedDestination}&checkin=&checkout=&group_adults=2&no_rooms=1&group_children=0`,
      airbnb: `${partner.baseUrl}/${encodedDestination}?adults=2&children=0&infants=0`,
      expedia: `${partner.baseUrl}?destination=${encodedDestination}&startDate=&endDate=&adults=2`,
      agoda: `${partner.baseUrl}?city=${encodedDestination}&checkIn=&checkOut=&adults=2&rooms=1`,
      hotelscom: `${partner.baseUrl}?destination=${encodedDestination}&adults=2&rooms=1`,
      tripadvisor: `${partner.baseUrl}-${encodedDestination.replace(/\s/g, '_')}.html`
    };
    
    return urlFormats[partner.id] || `${partner.baseUrl}?q=${encodedDestination}`;
  };

  const handleBookNow = (partner: AffiliatePartner) => {
    const url = generateBookingUrl(partner);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const titleText = {
    en: `Find Accommodation in ${destinationName}`,
    fr: `Trouver un Hébergement à ${destinationName}`,
    ar: `ابحث عن إقامة في ${destinationName}`,
    es: `Encontrar Alojamiento en ${destinationName}`
  }[language];

  const subtitleText = {
    en: 'Compare prices from top booking sites',
    fr: 'Comparez les prix des meilleurs sites de réservation',
    ar: 'قارن الأسعار من أفضل مواقع الحجز',
    es: 'Compara precios de los mejores sitios de reserva'
  }[language];

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-gold to-amber-600 p-6 text-black">
        <h3 className="font-amiri text-2xl font-bold mb-2">
          {titleText}
        </h3>
        <p className="text-black/80 text-sm">
          {subtitleText}
        </p>
      </div>

      {/* Partner Buttons */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedPartners.map((partner) => (
            <button
              key={partner.id}
              onClick={() => handleBookNow(partner)}
              onMouseEnter={() => setHoveredPartner(partner.id)}
              onMouseLeave={() => setHoveredPartner(null)}
              className="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: partner.color }}
            >
              {/* Background animation */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{partner.icon}</span>
                  <div className="text-left">
                    <div className="font-bold text-white" style={{ color: partner.textColor || 'white' }}>
                      {partner.name}
                    </div>
                    {partner.commission && (
                      <div className="text-xs text-white/80">
                        {partner.commission}
                      </div>
                    )}
                  </div>
                </div>
                <ExternalLink 
                  className={`w-5 h-5 text-white transition-transform duration-300 ${
                    hoveredPartner === partner.id ? 'translate-x-1 -translate-y-1' : ''
                  }`} 
                />
              </div>
            </button>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Award className="w-4 h-4" />
            <span>
              {language === 'en' ? 'Best price guaranteed • Secure booking • Free cancellation on most rooms' : 
               language === 'fr' ? 'Meilleur prix garanti • Réservation sécurisée • Annulation gratuite sur la plupart des chambres' : 
               language === 'ar' ? 'أفضل سعر مضمون • حجز آمن • إلغاء مجاني في معظم الغرف' : 
               'Mejor precio garantizado • Reserva segura • Cancelación gratuita en la mayoría de las habitaciones'}
            </span>
          </div>
        </div>

        {/* Note about affiliate */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-400">
            {language === 'en' ? 'We may earn a commission from bookings at no extra cost to you' : 
             language === 'fr' ? 'Nous pouvons gagner une commission sur les réservations sans frais supplémentaires pour vous' : 
             language === 'ar' ? 'قد نربح عمولة من الحجوزات دون أي تكلفة إضافية عليك' : 
             'Podemos ganar una comisión por reservas sin costo adicional para usted'}
          </p>
        </div>
      </div>
    </div>
  );
}
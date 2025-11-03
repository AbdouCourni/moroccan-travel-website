// components/SimpleMoroccoMap.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Destination, Place } from '../types';

// Simplified Morocco regions with basic paths
const SIMPLE_MOROCCO_REGIONS = [
  {
    id: 'tanger-tetouan-al_hoceima',
    name: { 
      en: 'Tangier-Tetouan-Al Hoceima', 
      fr: 'Tanger-Tétouan-Al Hoceima', 
      ar: 'طنجة - تطوان - الحسيمة', 
      es: 'Tanger-Tetouan-Al Hoceima' 
    },
    color: '#805ad5',
    path: 'M150,80 L200,100 L250,120 L300,140 L350,160 L300,180 L250,200 L200,220 L150,240 L100,220 L100,160 L100,100 Z',
    destinations: ['tangier', 'chefchaouen', 'tetouan', 'al-hoceima', 'larache']
  },
  {
    id: 'rabat-sale-kenitra',
    name: { 
      en: 'Rabat-Salé-Kénitra', 
      fr: 'Rabat-Salé-Kénitra', 
      ar: 'الرباط - سلا - القنيطرة', 
      es: 'Rabat-Salé-Kénitra' 
    },
    color: '#38a169',
    path: 'M300,160 L350,180 L400,200 L450,220 L500,240 L450,260 L400,280 L350,300 L300,320 L250,300 L250,240 L250,180 Z',
    destinations: ['rabat', 'kenitra', 'sale']
  },
  {
    id: 'casablanca-settat',
    name: { 
      en: 'Casablanca-Settat', 
      fr: 'Casablanca-Settat', 
      ar: 'الدار البيضاء - سطات', 
      es: 'Casablanca-Settat' 
    },
    color: '#3182ce',
    path: 'M450,200 L500,220 L550,240 L600,260 L650,280 L600,300 L550,320 L500,340 L450,360 L400,340 L400,280 L400,220 Z',
    destinations: ['casablanca', 'el-jadida', 'settat']
  },
  {
    id: 'marrakech-safi',
    name: { 
      en: 'Marrakech-Safi', 
      fr: 'Marrakech-Safi', 
      ar: 'مراكش آسفي', 
      es: 'Marrakech-Safi' 
    },
    color: '#e53e3e',
    path: 'M350,300 L400,320 L450,340 L500,360 L550,380 L500,400 L450,420 L400,440 L350,460 L300,440 L300,380 L300,320 Z',
    destinations: ['marrakech', 'essaouira', 'safi']
  },
  {
    id: 'fes-meknes',
    name: { 
      en: 'Fès-Meknès', 
      fr: 'Fès-Meknès', 
      ar: 'فاس - مكناس', 
      es: 'Fès-Meknès' 
    },
    color: '#d69e2e',
    path: 'M550,260 L600,280 L650,300 L700,320 L750,340 L700,360 L650,380 L600,400 L550,420 L500,400 L500,340 L500,280 Z',
    destinations: ['fes', 'meknes', 'ifrane']
  },
  {
    id: 'southern',
    name: { 
      en: 'Southern Provinces', 
      fr: 'Provinces du Sud', 
      ar: 'الأقاليم الجنوبية', 
      es: 'Provincias del Sur' 
    },
    color: '#dd6b20',
    path: 'M350,420 L400,440 L450,460 L500,480 L550,500 L500,520 L450,540 L400,560 L350,580 L300,560 L300,500 L300,440 Z',
    destinations: ['agadir', 'ouarzazate', 'merzouga', 'zagora', 'dakhla']
  }
];

interface Props {
  destinations: Destination[];
  places: Place[];
  onRegionClick?: (region: any, filteredDestinations: Destination[], filteredPlaces: Place[]) => void;
  onShowAll?: () => void;
}

export default function SimpleMoroccoMap({ destinations, places, onRegionClick, onShowAll }: Props) {
  const { language } = useLanguage();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);

  // Filter destinations that should be shown on map (default to true if undefined)
  const visibleDestinations = destinations.filter(dest => dest.showOnMap !== false);

  // Get top places (highly rated)
  const topPlaces = places
    .filter(place => place.rating && place.rating >= 4.0)
    .slice(0, 15);

  const handleRegionClick = (region: any) => {
    if (selectedRegion?.id === region.id) {
      // Clicking the same region again shows all
      handleShowAll();
      return;
    }

    setSelectedRegion(region);
    
    // Filter destinations by region
    const regionDestinations = visibleDestinations.filter(dest => 
      region.destinations.includes(dest.slug)
    );

    // Filter places by region (simplified - you might want to enhance this)
    const regionPlaces = topPlaces.filter(place => {
      return regionDestinations.some(dest => 
        place.location.address.toLowerCase().includes(region.id.toLowerCase()) ||
        place.location.address.toLowerCase().includes(dest.region.toLowerCase())
      );
    });

    if (onRegionClick) {
      onRegionClick(region, regionDestinations, regionPlaces);
    }
  };

  const handleShowAll = () => {
    setSelectedRegion(null);
    if (onShowAll) {
      onShowAll();
    }
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6">
      {/* Map Container */}
      <div className="flex-1 relative bg-white rounded-xl shadow-2xl p-4">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Morocco outline background */}
          <path
            d="M50,50 L750,50 L750,550 L50,550 Z"
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          
          {/* Regions */}
          {SIMPLE_MOROCCO_REGIONS.map(region => (
            <path
              key={region.id}
              id={region.id}
              d={region.path}
              fill={
                selectedRegion?.id === region.id ? region.color :
                hoveredRegion === region.id ? `${region.color}60` : `${region.color}30`
              }
              stroke={region.color}
              strokeWidth={selectedRegion?.id === region.id ? 3 : 2}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => handleRegionClick(region)}
            />
          ))}

          {/* Destination markers */}
          {visibleDestinations.map(destination => {
            const region = SIMPLE_MOROCCO_REGIONS.find(r => 
              r.destinations.includes(destination.slug)
            );
            if (!region || (selectedRegion && selectedRegion.id !== region.id)) return null;

            return (
              <g key={destination.id} className="cursor-pointer">
                <circle
                  cx={getDestinationCoordinates(destination.slug).x}
                  cy={getDestinationCoordinates(destination.slug).y}
                  r="6"
                  fill={region.color}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={getDestinationCoordinates(destination.slug).x}
                  y={getDestinationCoordinates(destination.slug).y - 12}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-gray-800 pointer-events-none"
                >
                  {destination.name[language]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Map Controls */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <button
            onClick={handleShowAll}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedRegion 
                ? 'bg-primary-gold text-black' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {language === 'en' ? 'All Morocco' : 
             language === 'fr' ? 'Tout le Maroc' :
             language === 'ar' ? 'كل المغرب' : 
             'Todo Marruecos'}
          </button>
        </div>

        {/* Selected Region Info */}
        {selectedRegion && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg" style={{ color: selectedRegion.color }}>
                  {selectedRegion.name[language]}
                </h3>
                <p className="text-sm text-gray-600">
                  {visibleDestinations.filter(dest => 
                    selectedRegion.destinations.includes(dest.slug)
                  ).length} {language === 'en' ? 'destinations' : 
                  language === 'fr' ? 'destinations' :
                  language === 'ar' ? 'وجهات' : 
                  'destinos'}
                </p>
              </div>
              <button
                onClick={handleShowAll}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {language === 'en' ? 'Show all' :
                 language === 'fr' ? 'Tout voir' :
                 language === 'ar' ? 'عرض الكل' :
                 'Ver todo'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - You can use this or handle the data in parent component */}
      <div className="lg:w-80 bg-white rounded-xl shadow-2xl p-6">
        <h3 className="font-bold text-xl mb-6 text-gray-800">
          {selectedRegion 
            ? `${selectedRegion.name[language]} ${language === 'en' ? 'Destinations' : 
               language === 'fr' ? 'Destinations' :
               language === 'ar' ? 'الوجهات' : 
               'Destinos'}`
            : language === 'en' ? 'Top Destinations' :
              language === 'fr' ? 'Meilleures Destinations' :
              language === 'ar' ? 'أفضل الوجهات' :
              'Principales Destinos'
          }
        </h3>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {(selectedRegion 
            ? visibleDestinations.filter(dest => selectedRegion.destinations.includes(dest.slug))
            : visibleDestinations.slice(0, 6)
          ).map(destination => (
            <div
              key={destination.id}
              className="p-3 rounded-lg border border-gray-200 hover:border-primary-gold transition-colors cursor-pointer"
              onClick={() => window.location.href = `/${language}/destinations/${destination.slug}`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={destination.images[0]}
                  alt={destination.name[language]}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-800 truncate">
                    {destination.name[language]}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">
                    {destination.highlights?.[0] || destination.description[language].substring(0, 50)}...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to get coordinates for destinations
function getDestinationCoordinates(slug: string): { x: number; y: number } {
  const coordinates: { [key: string]: { x: number; y: number } } = {
    'marrakech': { x: 400, y: 380 },
    'casablanca': { x: 450, y: 280 },
    'rabat': { x: 350, y: 240 },
    'fes': { x: 600, y: 340 },
    'tangier': { x: 200, y: 160 },
    'chefchaouen': { x: 250, y: 140 },
    'agadir': { x: 400, y: 480 },
    'essaouira': { x: 350, y: 340 },
    'merzouga': { x: 550, y: 450 },
    'ouarzazate': { x: 450, y: 420 },
  };
  
  return coordinates[slug] || { x: 400, y: 300 };
}
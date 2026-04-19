// app/[lang]/destinations/DestinationsClientPage.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import DestinationCard from '../../../../components/DestinationCard';
import type { Destination } from '../../../../types';

interface DestinationsClientPageProps {
  initialDestinations: Destination[];
}

export default function DestinationsClientPage({ initialDestinations }: DestinationsClientPageProps) {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [regions, setRegions] = useState<string[]>([]);

  // Extract unique regions from destinations
  useEffect(() => {
    if (initialDestinations && initialDestinations.length > 0) {
      const uniqueRegions = [...new Set(initialDestinations.map(d => d.region).filter(Boolean))];
      setRegions(uniqueRegions);
    }
  }, [initialDestinations]);

  // Filter destinations based on search and region
  const filteredDestinations = useMemo(() => {
    if (!initialDestinations || initialDestinations.length === 0) return [];
    
    return initialDestinations.filter(dest => {
      const displayName = dest.name[language] || dest.name.en;
      const matchesSearch = searchTerm === '' || 
        displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description[language]?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === 'all' || dest.region === selectedRegion;
      
      return matchesSearch && matchesRegion;
    });
  }, [initialDestinations, searchTerm, selectedRegion, language]);

  // Show message if no destinations
  if (!initialDestinations || initialDestinations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Destinations</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
          <p className="text-yellow-800 mb-2">No destinations found</p>
          <p className="text-gray-600 text-sm">Please check your Firebase database connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-gold mb-4">
          {language === 'en' ? 'All Destinations' : 
           language === 'fr' ? 'Toutes les Destinations' : 
           language === 'ar' ? 'جميع الوجهات' : 'Todos los Destinos'}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {language === 'en' ? 'Discover the beauty and diversity of Morocco through our curated destinations' :
           language === 'fr' ? 'Découvrez la beauté et la diversité du Maroc à travers nos destinations sélectionnées' :
           language === 'ar' ? 'اكتشف جمال وتنوع المغرب من خلال وجهاتنا المنسقة' :
           'Descubre la belleza y diversidad de Marruecos a través de nuestros destinos seleccionados'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <input
          type="search"
          placeholder={language === 'en' ? 'Search destinations...' : 
                       language === 'fr' ? 'Rechercher des destinations...' : 
                       language === 'ar' ? 'ابحث عن وجهات...' : 
                       'Buscar destinos...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition"
        />
        
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-primary-gold outline-none transition bg-white"
        >
          <option value="all">
            {language === 'en' ? 'All Regions' : 
             language === 'fr' ? 'Toutes les Régions' : 
             language === 'ar' ? 'جميع المناطق' : 'Todas las Regiones'}
          </option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="text-center mb-6">
        <p className="text-gray-500">
          {filteredDestinations.length} {language === 'en' ? 'destinations found' : 
           language === 'fr' ? 'destinations trouvées' : 
           language === 'ar' ? 'وجهة تم العثور عليها' : 'destinos encontrados'}
        </p>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            {language === 'en' ? 'No destinations match your search' : 
             language === 'fr' ? 'Aucune destination ne correspond à votre recherche' : 
             language === 'ar' ? 'لا توجد وجهات تطابق بحثك' : 
             'No hay destinos que coincidan con tu búsqueda'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              priority={index < 4}
              prefetch={index < 4}
            />
          ))}
        </div>
      )}
    </div>
  );
}
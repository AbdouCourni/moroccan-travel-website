// components/MapWithPlaces.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { whatsappStyle } from '../styles/map-styles';
import { Place as PlaceType } from '../types';

const MAP_STYLE = whatsappStyle;

// interface Place {
//   id: string;
//   name: { en: string; fr?: string; ar?: string; es?: string };
//   location: {
//     coordinates: {
//       lat: number;
//       lng: number;
//     };
//     address?: string;
//   };
//   images?: string[];
//   type: string;
//   category: string;
// }

interface MapWithPlacesProps {
  places: PlaceType[];
  className?: string;
  destinationSlug:string
}

declare global {
  interface Window {
    google: any;
  }
}

export function MapWithPlaces({ places, className = "h-96",destinationSlug }: MapWithPlacesProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceType | null>(null);
  const router = useRouter();

  // Filter places with valid coordinates
  const validPlaces = places.filter(place => 
    place.location?.coordinates?.lat && place.location?.coordinates?.lng
  );

  useEffect(() => {
    if (window.google) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || validPlaces.length === 0) return;

    // Calculate bounds to fit all markers
    const bounds = new window.google.maps.LatLngBounds();
    
    validPlaces.forEach(place => {
      bounds.extend(new window.google.maps.LatLng(
        place.location.coordinates.lat,
        place.location.coordinates.lng
      ));
    });

    const map = new window.google.maps.Map(mapRef.current, {
      center: bounds.getCenter(),
      zoom: 12,
      styles: whatsappStyle,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: true
    });

    // Fit map to bounds
    map.fitBounds(bounds);

    // Create markers for each place
    const markers = validPlaces.map(place => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: place.location.coordinates.lat,
          lng: place.location.coordinates.lng
        },
        map: map,
        title: place.name.en,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="24" height="34" viewBox="0 0 24 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.373 0 0 5.373 0 12C0 21.5 12 34 12 34C12 34 24 21.5 24 12C24 5.373 18.627 0 12 0Z" fill="#D4AF37"/>
              <circle cx="12" cy="12" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 34),
          anchor: new window.google.maps.Point(12, 34),
        }
      });

      // Add click listener to marker
      marker.addListener('click', () => {
        setSelectedPlace(place);
      });

      return marker;
    });

    // Close dialog when clicking on map
    window.google.maps.event.addListener(map, 'click', () => {
      setSelectedPlace(null);
    });

  }, [isLoaded, validPlaces]);

  const handlePlaceClick = (place: PlaceType) => {
    // Navigate to the place page
    // You'll need to pass the destination slug as a prop or derive it
    router.push(`/destinations/${destinationSlug}/places/${place.id}`);
  };

  if (!isLoaded) {
    return (
      <div className={`bg-gray-200 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (validPlaces.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-2xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4" />
          <p>No places with location data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className={`rounded-2xl ${className}`} />
      
      {/* Place Dialog */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm mx-auto">
          <div 
            className="flex gap-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => handlePlaceClick(selectedPlace)}
          >
            {selectedPlace.images && selectedPlace.images[0] && (
              <img 
                src={selectedPlace.images[0]} 
                alt={selectedPlace.name.en}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-dark-charcoal mb-1">
                {selectedPlace.name.en}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {selectedPlace.type} • {selectedPlace.category}
              </p>
              {selectedPlace.location.address && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {selectedPlace.location.address}
                </p>
              )}
              <button className="mt-2 text-sm text-primary-gold font-semibold hover:underline">
                View Details →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
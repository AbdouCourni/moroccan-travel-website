// components/MapLoader.tsx
'use client';

import { useEffect, useState } from 'react';
import { Map } from './Map';

interface MapLoaderProps {
  coordinates: {
    lat: number;
    lng: number;
    address?: string;
  };
  zoom?: number;
  className?: string;
}

export function MapLoader({ coordinates, zoom = 15, className }: MapLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

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

  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return <Map coordinates={coordinates} zoom={zoom} className={className} />;
}
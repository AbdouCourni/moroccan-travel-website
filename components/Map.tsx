// components/Map.tsx
'use client';

import { useEffect, useRef } from 'react';
import { whatsappStyle } from '../styles/map-styles';
const MAP_STYLE = whatsappStyle;

interface MapProps {
  coordinates: {
    lat: number;
    lng: number;
    address?: string;
  };
  zoom?: number;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}



// Choose your preferred style
//const MAP_STYLE = whatsappStyle;
//const MAP_STYLE = balancedAirbnbStyle;
//const MAP_STYLE = minimalStyle;
//const MAP_STYLE = moroccanStyle;

export function Map({ coordinates, zoom =8,className = "h-48" }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Defensive: ensure coordinates are present before accessing lat/lng
    if (!coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
      console.warn('Map: invalid coordinates, skipping map init', coordinates);
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: coordinates.lat, lng: coordinates.lng },
      zoom: zoom,
      styles: MAP_STYLE,
      // Show more default UI elements for better usability
      disableDefaultUI: false, // Keep default UI
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: true, // Enable street view
      rotateControl: false,
      fullscreenControl: true
    });

    // Custom marker with your brand colors
    new window.google.maps.Marker({
  position: { lat: coordinates.lat, lng: coordinates.lng },
  map: map,
  title: coordinates.address || "Location",
  // Use standard Google Maps marker icon
  // icon: {
  //   url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Standard red pin
  //   scaledSize: new window.google.maps.Size(32, 32),
  //   anchor: new window.google.maps.Point(16, 32), // Anchor at bottom center for pin
  // },
  icon: {
  url: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C10.477 0 6 4.477 6 10C6 17 16 40 16 40C16 40 26 17 26 10C26 4.477 21.523 0 16 0Z" fill="#D4AF37"/>
      <circle cx="16" cy="10" r="5" fill="white"/>
    </svg>
  `),
  scaledSize: new window.google.maps.Size(32, 40),
  anchor: new window.google.maps.Point(16, 40), // Anchor at bottom tip
},
  animation: window.google.maps.Animation.DROP
});

  }, [coordinates, zoom]);

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 shadow-sm ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
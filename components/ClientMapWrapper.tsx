// components/ClientMapWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import { Destination, Place } from '../types';

// Dynamic import with ssr: false - this is safe in a Client Component
const DynamicMapLoader = dynamic(
  () => import('./InteractMapLoader'),
  {
    loading: () => <MapSkeleton />,
    ssr: false
  }
);

function MapSkeleton() {
  return (
    <div className="w-full h-[600px] bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-gold/30 border-t-primary-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading interactive map...</p>
      </div>
    </div>
  );
}

interface ClientMapWrapperProps {
  destinations: Destination[];
  places: Place[];
}

export default function ClientMapWrapper({ destinations, places }: ClientMapWrapperProps) {
  return (
    <DynamicMapLoader 
      destinations={destinations}
      places={places}
    />
  );
}
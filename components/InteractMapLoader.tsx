// components/InteractMapLoader.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Destination, Place } from '../types';

// Dynamically import the interactive Morocco map
const InteractiveMoroccoMap = dynamic(() => import('./InteractiveMoroccoMap'), {
  ssr: false,
  loading: () => <MapPlaceholder />
});

interface Props {
  destinations: Destination[];
  places: Place[];
}

function MapPlaceholder() {
  return (
    <div className="w-full min-h-[600px] bg-gray-200 animate-pulse rounded-xl flex">
      <div className="flex-1 bg-gray-300 rounded-l-xl"></div>
      <div className="w-80 bg-gray-200 rounded-r-xl"></div>
    </div>
  );
}

export default function InteractMapLoader({ destinations, places }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <MapPlaceholder />;
  }

  return <InteractiveMoroccoMap destinations={destinations} places={places} />;
}
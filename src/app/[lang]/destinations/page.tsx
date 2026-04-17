// app/[lang]/destinations/page.tsx
import { Suspense } from 'react';
import { getAllDestinations } from '../../../../lib/firebase-server';
import DestinationsClientPage from './DestinationsClientPage';
import type { Destination } from '../../../../types';

// Helper function to convert Firebase timestamps to serializable format
function serializeDestination(destination: any): Destination {
  return {
    ...destination,
    id: destination.id,
    // Convert Firestore Timestamps to ISO strings or null
    createdAt: destination.createdAt?.toDate?.()?.toISOString() || destination.createdAt || null,
    updatedAt: destination.updatedAt?.toDate?.()?.toISOString() || destination.updatedAt || null,
    // Ensure coordinates are properly formatted
    coordinates: destination.coordinates ? {
      lat: destination.coordinates.lat || 0,
      lng: destination.coordinates.lng || 0
    } : { lat: 0, lng: 0 },
    // Ensure arrays exist
    images: destination.images || [],
    highlights: destination.highlights || [],
    bestSeason: destination.bestSeason || [],
    activities: destination.activities || [],
    travelTips: destination.travelTips || [],
  };
}

// Loading skeleton
function DestinationsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-gray-100 animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function DestinationsPage() {
  try {
    // Fetch destinations
    const destinations = await getAllDestinations();
    
    // Debug: Log the result
    console.log('Fetched destinations count:', destinations?.length);
    
    if (!destinations || destinations.length === 0) {
      console.warn('No destinations found in Firebase');
      return (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Destinations</h1>
          <p className="text-gray-600">No destinations found. Please check your Firebase data.</p>
        </div>
      );
    }
    
    // Serialize destinations for client component
    const serializedDestinations = destinations.map(serializeDestination);
    
    return (
      <Suspense fallback={<DestinationsSkeleton />}>
        <DestinationsClientPage initialDestinations={serializedDestinations} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in DestinationsPage:', error);
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Destinations</h1>
        <p className="text-red-600">Error loading destinations. Please try again later.</p>
        <p className="text-gray-500 text-sm mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
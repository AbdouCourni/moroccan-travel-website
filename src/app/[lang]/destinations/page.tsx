// app/destinations/page.tsx (Server Component)
import DestinationsClientPage from './DestinationsClientPage';
import { getAllDestinationsByRanking,getAllDestinations } from '../../../../lib/firebase-server';

// Helper function to convert Firebase timestamps
function convertFirebaseTimestamps(destinations: any[]) {
  return destinations.map(destination => ({
    ...destination,
    // Convert Firebase Timestamp to ISO string
    createdAt: destination.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: destination.updatedAt?.toDate?.()?.toISOString() || null,
    // Also handle any nested timestamps if they exist
    ...(destination.coordinates && {
      coordinates: {
        ...destination.coordinates,
        // Handle nested timestamps if coordinates has them
        ...(destination.coordinates.createdAt && {
          createdAt: destination.coordinates.createdAt?.toDate?.()?.toISOString() || null
        })
      }
    })
  }));
}

export default async function DestinationsPage() {
  try {
    const destinations = await getAllDestinations();
    
    // Convert Firebase timestamps to plain objects before passing to client
    const serializedDestinations = convertFirebaseTimestamps(destinations);
    
    return <DestinationsClientPage initialDestinations={serializedDestinations} />;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return <DestinationsClientPage initialDestinations={[]} />;
  }
}
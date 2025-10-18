// app/destinations/[slug]/places/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDestinationBySlug, getPlacesByDestination, getPlacesByCategory } from '../../../../../../lib/firebase-server';
import { PlacesGrid } from '../../../../../../components/PlacesGrid';
import { MapWithPlaces } from '../../../../../../components/MapWithPlaces'; // Import the new component
import { MapPin, Filter, Navigation } from 'lucide-react';
import { convertFirebaseData } from '../../../../../../lib/firebase-utils';

export default async function PlacesPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = await params.slug;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  // Get all places and categorized places
  const allPlaces = await getPlacesByDestination(destination.id, 50);
  const culturalPlaces = await getPlacesByCategory(destination.id, 'cultural', 6);
  const foodPlaces = await getPlacesByCategory(destination.id, 'food', 6);
  const naturePlaces = await getPlacesByCategory(destination.id, 'nature', 6);

  // Convert Firebase data to plain objects
  const convertedAllPlaces = convertFirebaseData(allPlaces);
  const convertedCulturalPlaces = convertFirebaseData(culturalPlaces);
  const convertedFoodPlaces = convertFirebaseData(foodPlaces);
  const convertedNaturePlaces = convertFirebaseData(naturePlaces);

  const displayName = destination.name.en;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href={`/destinations/${destination.slug}`}
              className="flex items-center gap-2 text-moroccan-blue hover:text-primary-gold transition-colors"
            >
              <Navigation className="w-4 h-4 rotate-180" />
              Back to {displayName}
            </Link>
          </div>
          <h1 className="font-amiri text-4xl font-bold text-dark-charcoal">
            All Places in {displayName}
          </h1>
          <p className="text-gray-600 mt-2">
            Discover {convertedAllPlaces.length} amazing places to visit
          </p>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 overflow-x-auto pb-4">
          <button className="bg-white text-dark-charcoal px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap border-2 border-primary-gold">
            All Places ({convertedAllPlaces.length})
          </button>
          <button className="bg-white text-gray-600 px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap border border-gray-200 hover:border-primary-gold">
            Cultural ({convertedCulturalPlaces.length})
          </button>
          <button className="bg-white text-gray-600 px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap border border-gray-200 hover:border-primary-gold">
            Food & Dining ({convertedFoodPlaces.length})
          </button>
          <button className="bg-white text-gray-600 px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-300 whitespace-nowrap border border-gray-200 hover:border-primary-gold">
            Nature ({convertedNaturePlaces.length})
          </button>
        </div>
      </div>

      {/* All Places Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlacesGrid places={convertedAllPlaces} slug={destination.slug} />
      </div>

      {/* Interactive Map Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-amiri text-3xl font-bold text-dark-charcoal mb-4">
              Explore on Map
            </h2>
            <p className="text-gray-600">
              Click on markers to see place details and navigate to their pages
            </p>
          </div>
          
          <MapWithPlaces 
            places={convertedAllPlaces} 
            className="h-96 lg:h-[500px] rounded-2xl"
            destinationSlug={slug}
          />
          
          <div className="text-center mt-4 text-sm text-gray-500">
            <p>
              Showing {convertedAllPlaces.filter((p: { location: { coordinates: any; }; }) => p.location?.coordinates).length} places with location data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
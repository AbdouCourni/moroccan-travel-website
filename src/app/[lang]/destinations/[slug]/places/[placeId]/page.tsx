// app/destinations/[slug]/places/[placeId]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDestinationBySlug, getPlaceById } from '../../../../../../../lib/firebase-server';
import { Star, MapPin, Clock, Calendar, Heart, Share2, Navigation, Phone, Globe } from 'lucide-react';
import { MapLoader } from '../../../../../../../components/MapLoader';
import { convertFirebaseData } from '../../../../../../../lib/firebase-utils';
import { LocationShare } from '../../../../../../../components/LocationShare';
import { Metadata } from 'next';
import { PlaceStructuredData } from '../../../../../../../components/seo/StructuredData';
import { generatePlaceSEO } from '../../../../../../../utils/seo-utils';

interface PlacePageProps {
  params: {
    slug: string;
    placeId: string;
  };
}

// Generate metadata for SEO - FIXED VERSION
export async function generateMetadata({
  params,
}: PlacePageProps): Promise<Metadata> {
  const { slug, placeId } = params; // FIXED: Remove await

  try {
    const destination = await getDestinationBySlug(slug);
    
    if (!destination) {
      return {
        title: 'Destination Not Found',
        description: 'The requested destination could not be found.',
      };
    }

    const place = await getPlaceById(destination.id, placeId);
    
    if (!place) {
      return {
        title: 'Place Not Found',
        description: 'The requested place could not be found.',
      };
    }

    const convertedPlace = convertFirebaseData(place);
    const displayName = convertedPlace.name?.en || 'Unnamed Place';
    const displayDescription = convertedPlace.description?.en || 'No description available.';

    return {
      title: `${displayName} - ${destination.name.en} | MoroCompase`,
      description: displayDescription,
      openGraph: {
        title: `${displayName} - ${destination.name.en}`,
        description: displayDescription,
        images: convertedPlace.images?.[0] ? [convertedPlace.images[0]] : [],
        type: 'article',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Place Details | MoroCompase',
      description: 'Discover this amazing place in Morocco.',
    };
  }
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug, placeId } = params;

  // Get destination to verify it exists
  const destination = await getDestinationBySlug(slug);
  if (!destination) {
    notFound();
  }

  // Get the specific place
  const place = await getPlaceById(destination.id, placeId);
  if (!place) {
    notFound();
  }

  // Convert Firebase data
  const convertedPlace = convertFirebaseData(place);
  const convertedDestination = convertFirebaseData(destination);

  const displayName = convertedPlace.name?.en || 'Unnamed Place';
  const displayDescription = convertedPlace.description?.en || 'No description available.';

  // Check if we have valid coordinates for the map
  const hasValidLocation = convertedPlace.location?.coordinates?.lat && convertedPlace.location?.coordinates?.lng;


  return (
    <div className="min-h-screen bg-white">
          {/* Add Structured Data for SEO */}
      <PlaceStructuredData place={convertedPlace} destination={convertedDestination} />
      {/* Hero Section */}
      <section className="relative h-96">
        <div className="absolute inset-0">
          <img
            src={convertedPlace.images?.[0] || '/images/placeholder.jpg'}
            alt={displayName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>

        {/* Navigation */}
        <div className="relative z-10 pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link
                href={`/destinations/${destination.slug}`}
                className="inline-flex items-center text-white/90 hover:text-white transition-colors backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20"
              >
                <Navigation className="w-4 h-4 mr-2 rotate-180" />
                Back to {destination.name.en}
              </Link>
              <Link
                href={`/destinations/${destination.slug}/places`}
                className="inline-flex items-center text-white/90 hover:text-white transition-colors backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20"
              >
                All Places
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-primary-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                  {convertedPlace.type?.charAt(0).toUpperCase() + convertedPlace.type?.slice(1)}
                </span>
                <span className="bg-moroccan-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                  {convertedPlace.category?.charAt(0).toUpperCase() + convertedPlace.category?.slice(1)}
                </span>
              </div>
              <h1 className="font-amiri text-5xl md:text-6xl font-bold mb-4">
                {displayName}
              </h1>

              {/* Fixed Location Display - using the correct structure */}
              {convertedPlace.location && (
                <div className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {convertedPlace.location.address ||
                      (convertedPlace.location.coordinates?.lat && convertedPlace.location.coordinates?.lng
                        ? `${convertedPlace.location.coordinates.lat.toFixed(4)}, ${convertedPlace.location.coordinates.lng.toFixed(4)}`
                        : 'Location information available')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts Bar */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {convertedPlace.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-800">{convertedPlace.rating.toFixed(1)}</span>
                  <span className="text-gray-600">({convertedPlace.reviewCount} reviews)</span>
                </div>
              )}

              {convertedPlace.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{convertedPlace.duration}</span>
                </div>
              )}

              {convertedPlace.entranceFee && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">
                    {convertedPlace.entranceFee.tourist || convertedPlace.entranceFee.local} {convertedPlace.entranceFee.currency}
                  </span>
                  <span className="text-gray-600">entrance fee</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-gold text-gray-700 hover:text-primary-gold transition-colors">
                <Heart className="w-4 h-4" />
                Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-primary-gold hover:text-primary-gold transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="mb-8">
                <h2 className="font-amiri text-3xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{displayDescription}</p>
              </div>

              {/* Image Gallery */}
              {convertedPlace.images && convertedPlace.images.length > 1 && (
                <div className="mb-8">
                  <h3 className="font-amiri text-2xl font-bold text-gray-900 mb-4">Gallery</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {convertedPlace.images.slice(1).map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${displayName} ${index + 2}`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {convertedPlace.tips && convertedPlace.tips.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-amiri text-2xl font-bold text-gray-900 mb-4">Visitor Tips</h3>
                  <ul className="space-y-2">
                    {convertedPlace.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700">
                        <span className="text-primary-gold mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Accessibility */}
              {convertedPlace.accessibility && convertedPlace.accessibility.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-amiri text-2xl font-bold text-gray-900 mb-4">Accessibility</h3>
                  <div className="flex flex-wrap gap-2">
                    {convertedPlace.accessibility.map((feature: string, index: number) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Best Time to Visit */}
              {convertedPlace.bestTimeToVisit && convertedPlace.bestTimeToVisit.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-amiri text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Best Time to Visit
                  </h3>
                  <div className="space-y-2">
                    {convertedPlace.bestTimeToVisit.map((time: string, index: number) => (
                      <div key={index} className="text-gray-700">
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {convertedPlace.openingHours && (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-amiri text-xl font-bold text-gray-900 mb-3">
                    Opening Hours
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(convertedPlace.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-gray-700">
                        <span className="capitalize">{day}:</span>
                        <span>{hours as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {convertedPlace.contact && (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-amiri text-xl font-bold text-gray-900 mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {convertedPlace.contact.phone && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4" />
                        <span>{convertedPlace.contact.phone}</span>
                      </div>
                    )}
                    {convertedPlace.contact.website && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Globe className="w-4 h-4" />
                        <a
                          href={convertedPlace.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-moroccan-blue hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location Map */}

              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
                  <h3 className="font-amiri text-xl font-bold text-gray-900">
                    Location
                  </h3>


                </div>

                {hasValidLocation ? (
                  <div >
                    <MapLoader
                      coordinates={{
                        lat: convertedPlace.location.coordinates.lat,
                        lng: convertedPlace.location.coordinates.lng,
                        address: convertedPlace.location.address
                      }}
                      className="h-64 md:h-96 lg:h-[500px]"
                    />
                    <div className="mt-4"> {/* Add margin-top wrapper */}
                      <LocationShare
                        coordinates={convertedPlace.location.coordinates}
                        address={convertedPlace.location.address}
                        placeName={displayName}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-200 rounded-lg h-64 md:h-96 lg:h-[500px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p>Location map not available</p>
                      <p className="text-sm">No coordinates provided</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
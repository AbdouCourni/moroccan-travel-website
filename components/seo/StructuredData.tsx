'use client';

import { Destination, Place } from '../../types';

interface DestinationStructuredDataProps {
  destination: Destination;
}

interface PlaceStructuredDataProps {
  place: Place;
  destination: Destination;
}

export function DestinationStructuredData({ destination }: DestinationStructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name.en,
    description: destination.description.en,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MA',
      addressRegion: destination.region,
    },
    containsPlace: destination.activities?.map(activity => ({
      '@type': 'TouristAttraction',
      name: activity,
    })),
    location: {
      '@type': 'GeoCoordinates',
      latitude: destination.coordinates.lat,
      longitude: destination.coordinates.lng,
    },
    audience: {
      '@type': 'PeopleAudience',
      geographicArea: {
        '@type': 'Country',
        name: 'Morocco',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function PlaceStructuredData({ place, destination }: PlaceStructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': place.type === 'restaurant' ? 'Restaurant' : 'TouristAttraction',
    name: place.name.en,
    description: place.description.en,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MA',
      addressRegion: destination.region,
      streetAddress: place.location.address,
    },
    location: {
      '@type': 'GeoCoordinates',
      latitude: place.location.coordinates.lat,
      longitude: place.location.coordinates.lng,
    },
    ...(place.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: place.rating,
        reviewCount: place.reviewCount || 0,
      },
    }),
    ...(place.openingHours && {
      openingHoursSpecification: Object.entries(place.openingHours).map(([day, hours]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day,
        opens: hours.split('-')[0],
        closes: hours.split('-')[1],
      })),
    }),
    ...(place.entranceFee && {
      offers: {
        '@type': 'Offer',
        price: place.entranceFee.tourist,
        priceCurrency: place.entranceFee.currency,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LocalBusinessStructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'MoroCompase',
    description: 'Authentic Moroccan travel experiences and local guides',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MA',
      addressLocality: 'Marrakech',
    },
    areaServed: 'Morocco',
    offers: {
      '@type': 'Offer',
      description: 'Morocco travel packages and local experiences',
    },
    telephone: '+212-XXX-XXXXXX',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
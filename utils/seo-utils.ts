import { SEOConfig } from '../types/seo';
import { Destination, Place } from '../types/index';

export const defaultSEO: SEOConfig = {
  title: "MoroCompase - Discover Morocco's Hidden Gems",
  description: "Explore Morocco with local insights. Discover Marrakech, Casablanca, Fez, Sahara Desert, and hidden gems. Best riads, restaurants, and cultural experiences.",
  keywords: ["Morocco travel", "Marrakech", "Casablanca", "Fez", "Sahara Desert", "Moroccan riads", "local guides", "Morocco tourism"],
  openGraph: {
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MoroCompase - Moroccan Travel Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-image.jpg"],
  },
};

export function generateDestinationSEO(destination: Destination, language: string = 'en'): SEOConfig {
  const name = destination.name[language as keyof typeof destination.name] || destination.name.en;
  const description = destination.description[language as keyof typeof destination.description] || destination.description.en;
  
  return {
    title: `${name} - Complete Travel Guide | MoroCompase`,
    description: `${description.substring(0, 155)}...`,
    keywords: [
      name,
      'Morocco',
      'travel guide',
      'things to do',
      'attractions',
      ...destination.activities,
      ...destination.highlights,
    ],
    openGraph: {
      images: destination.images.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: `${name} - Moroccan destination`,
      })),
    },
  };
}

export function generatePlaceSEO(place: Place, destination: Destination, language: string = 'en'): SEOConfig {
  const placeName = place.name[language as keyof typeof place.name] || place.name.en;
  const destinationName = destination.name[language as keyof typeof destination.name] || destination.name.en;
  
  return {
    title: `${placeName} - ${destinationName} | MoroCompase`,
    description: `${place.description[language as keyof typeof place.description] || place.description.en}.substring(0, 155)}...`,
    keywords: [
      placeName,
      destinationName,
      place.type,
      place.category,
      'Morocco',
      'things to do',
      'attractions',
    ],
    openGraph: {
      images: place.images.map(img => ({
        url: img,
        width: 1200,
        height: 630,
        alt: `${placeName} in ${destinationName}`,
      })),
    },
  };
}
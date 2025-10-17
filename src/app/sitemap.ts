import { MetadataRoute } from 'next';
import { getAllDestinations,getPlacesByDestination }  from '../../lib/firebase-server';


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://morocompase.com';
  
  const destinations = await getAllDestinations();
  const allPlaces = await Promise.all(
    destinations.map(dest => getPlacesByDestination(dest.id))
  );
  
  const destinationUrls = destinations.map(dest => ({
    url: `${baseUrl}/destinations/${dest.slug}`,
    lastModified: dest.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const placeUrls = allPlaces.flat().map(place => {
    const destination = destinations.find(dest => 
      place.id === dest.id
    );
    return {
      url: `${baseUrl}/destinations/${destination?.slug}/places/${place.id}`,
      lastModified: place.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...destinationUrls,
    ...placeUrls,
    {
      url: `${baseUrl}/culture`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
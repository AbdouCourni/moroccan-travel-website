// src/lib/firebase-server.ts
import { 
  collection, 
  getDocs, 
  limit, 
  query, 
  where, 
  orderBy,
  doc,
  getDoc,
  collectionGroup
} from 'firebase/firestore';
import { db } from './firebase';
import { Destination, Place,Recipe } from '../types';

// List of top Moroccan destinations for consistent ordering
const TOP_MOROCCAN_DESTINATIONS = [
  'marrakech',     // The Red City - most famous
  'casablanca',    // Economic capital & Hassan II Mosque
  'fes',           // Cultural & spiritual capital
  'agadir',        // Beach resort city
  'chefchaouen',   // The Blue Pearl
  'essaouira',     // Coastal city with Portuguese heritage
  'rabat',         // Capital city
  'tangier',       // Gateway to Africa/Europe
  'meknes',        // Imperial city
  'ouarzazate',    // Gateway to Sahara & film studios
  'merzouga',      // Sahara desert dunes
  'ifrane',        // Little Switzerland in Atlas Mountains
  'safi',          // Pottery & fishing city
  'el-jadida',     // Portuguese heritage city
  'tetouan',       // Andalusian-influenced city
  'larache',       // Coastal city with Roman ruins
  'nador',  
  'al-hoceima',  
  'zagora',
  'tinghir',
  'dakhla'

];
//_______________________________________________Destinations related queries_______________________________________________

// ✅ Select top destinations from a predefined list
export async function selectTopDestinations(count: number = 12): Promise<Destination[]> {
  const destinationsRef = collection(db, 'destinations');
  
  // Get all destinations first (we'll filter client-side for simplicity)
  const q = query(destinationsRef, limit(100));
  const snapshot = await getDocs(q);

  const allDestinations: Destination[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Destination));

  // Filter and sort to only include top destinations in curated order
  const topDestinations = TOP_MOROCCAN_DESTINATIONS
    .map(slug => allDestinations.find(dest => dest.slug === slug))
    .filter((dest): dest is Destination => dest !== undefined)
    .slice(0, count);

  return topDestinations;
}

// ✅ Get all destinations (for "Show More" page)
export async function getAllDestinations(limitCount: number = 100): Promise<Destination[]> {
  const destinationsRef = collection(db, 'destinations');
  const q = query(destinationsRef, limit(limitCount));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Destination));
}

// ✅ Fetch multiple destinations with limit (keep for backward compatibility)
export async function getDestinations(limitCount: number = 10): Promise<Destination[]> {
  const destinationsRef = collection(db, 'destinations');
  const q = query(destinationsRef, limit(limitCount));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Destination));
}

export async function getAllDestinationsByRanking(
  order: "asc" | "desc" = "desc"
): Promise<Destination[]> {
  try {
    const destinationsRef = collection(db, "destinations");

    // Order destinations by 'ranking' in the specified order
    const q = query(destinationsRef, orderBy("ranking", order));

    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Destination)
    );
  } catch (error) {
    console.error("Error fetching destinations by ranking:", error);
    return [];
  }
}

// ✅ Get single destination by slug
export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const destinationsRef = collection(db, 'destinations');
  const q = query(destinationsRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as Destination;
}

// ✅ Get places by destination ID (from subcollection)
// Add limits and field selection to reduce data transfer
export async function getPlacesByDestination(
  destinationId: string, 
  limitCount: number = 10
): Promise<Place[]> {
  try {
    const placesRef = collection(db, 'destinations', destinationId, 'places');
    const q = query(placesRef, limit(limitCount));
    
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id, // This is the Firestore document ID
      ...doc.data()
    } as Place));
  } catch (error) {
    console.error('Error fetching places by destination:', error);
    return [];
  }
}
// export async function getPlacesByDestination(
//   destinationId: string, 
//   limitCount: number = 10
// ): Promise<Place[]> {
//   try {
//     // Access the places subcollection for the specific destination
//     const placesRef = collection(db, 'destinations', destinationId, 'places');
//     const q = query(placesRef, limit(limitCount));
    
//     const snapshot = await getDocs(q);

//     return snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     } as Place));
//   } catch (error) {
//     console.error('Error fetching places by destination:', error);
//     return [];
//   }
// }
// export async function getAllPlacesTopDesc(): Promise<Place[]> {
//   try {
//     const placesRef = collection(db, 'places');
    
//     // Order by rating and reviewCount descending
//     const q = query(
//       placesRef,
//       orderBy('rating', 'desc'),
//       orderBy('reviewCount', 'desc')
//     );

//     const snapshot = await getDocs(q);

//     return snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     } as Place));
//   } catch (error) {
//     console.error('Error fetching all top places:', error);
//     return [];
//   }
// }
//_______________________________________________Places related queries_______________________________________________

// ✅ Get popular places by destination ID (sorted by rating and review count)
export async function getPopularPlaces(
  destinationId: string, 
  limitCount: number = 6
): Promise<Place[]> {
  try {
    const placesRef = collection(db, 'destinations', destinationId, 'places');
    const q = query(
      placesRef, 
      orderBy('rating', 'desc'),
      orderBy('reviewCount', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Place));
  } catch (error) {
    console.error('Error fetching popular places:', error);
    return [];
  }
}

// ✅ Get places by category within a destination
export async function getPlacesByCategory(
  destinationId: string,
  category: string,
  limitCount: number = 6
): Promise<Place[]> {
  try {
    const placesRef = collection(db, 'destinations', destinationId, 'places');
    const q = query(
      placesRef, 
      where('category', '==', category),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Place));
  } catch (error) {
    console.error('Error fetching places by category:', error);
    return [];
  }
}

// ✅ Get place by ID from a specific destination
export async function getPlaceById(
  destinationId: string,
  placeId: string
): Promise<Place | null> {
  try {
    const placeRef = doc(db, 'destinations', destinationId, 'places', placeId);
    const placeDoc = await getDoc(placeRef);

    if (!placeDoc.exists()) return null;

    return {
      id: placeDoc.id,
      ...placeDoc.data()
    } as Place;
  } catch (error) {
    console.error('Error fetching place by ID:', error);
    return null;
  }
}

// ✅ Search places across all destinations
export async function searchPlaces(
  searchTerm: string,
  destinationId?: string,
  limitCount: number = 10
): Promise<Place[]> {
  try {
    let places: Place[] = [];

    if (destinationId) {
      // Search within a specific destination
      places = await getPlacesByDestination(destinationId, 50); // Get more for filtering
    } else {
      // Search across all destinations (using collection group query)
      const placesQuery = query(
        collectionGroup(db, 'places'),
        limit(50) // Limit for performance
      );
      const snapshot = await getDocs(placesQuery);
      places = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Place));
    }

    // Client-side filtering for basic search
    const searchLower = searchTerm.toLowerCase();
    return places
      .filter(place => 
        place.name?.en?.toLowerCase().includes(searchLower) ||
        place.description?.en?.toLowerCase().includes(searchLower) ||
        place.tips?.some(tip => tip.toLowerCase().includes(searchLower)) ||
        place.type?.toLowerCase().includes(searchLower) ||
        place.category?.toLowerCase().includes(searchLower)
      )
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}

// ✅ Get places by type (landmark, museum, restaurant, etc.)
export async function getPlacesByType(
  destinationId: string,
  type: Place['type'],
  limitCount: number = 6
): Promise<Place[]> {
  try {
    const placesRef = collection(db, 'destinations', destinationId, 'places');
    const q = query(
      placesRef, 
      where('type', '==', type),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Place));
  } catch (error) {
    console.error('Error fetching places by type:', error);
    return [];
  }
}

// ✅ Get featured places (highly rated with many reviews)
export async function getFeaturedPlaces(
  destinationId: string,
  limitCount: number = 4
): Promise<Place[]> {
  try {
    const placesRef = collection(db, 'destinations', destinationId, 'places');
    const q = query(
      placesRef, 
      where('rating', '>=', 4.5),
      where('reviewCount', '>=', 50),
      orderBy('rating', 'desc'),
      orderBy('reviewCount', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Place));
  } catch (error) {
    console.error('Error fetching featured places:', error);
    // Fallback to popular places if no featured places found
    return getPopularPlaces(destinationId, limitCount);
  }
}

// ✅ Get places count for a destination
export async function getPlacesCount(destinationId: string): Promise<number> {
  try {
    const placesRef = collection(db, 'destinations', destinationId, 'places');
    const snapshot = await getDocs(placesRef);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting places count:', error);
    return 0;
  }
}

// ✅ Update destination with places count
export async function updateDestinationWithPlacesCount(destinationId: string): Promise<void> {
  try {
    const count = await getPlacesCount(destinationId);
    // You might want to update the destination document with this count
    console.log(`Destination ${destinationId} has ${count} places`);
  } catch (error) {
    console.error('Error updating destination with places count:', error);
  }
}
//_______________________________ Recipes related queries_______________________________________________
export const recipesCollection = collection(db, 'recipes');

export const getRecipes = async (): Promise<Recipe[]> => {
  const snapshot = await getDocs(recipesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Recipe));
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  const docRef = doc(db, 'recipes', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Recipe;
  }
  return null;
};

export const getRecipesByCategory = async (category: string): Promise<Recipe[]> => {
  const q = query(recipesCollection, where('category', '==', category));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Recipe));
};
//________________________________________REgion destinations___________
// ✅ Get all destinations by region
export async function getDestinationsByRegion(regionName: string): Promise<Destination[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const q = query(destinationsRef, where('region', '==', regionName));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Destination));
  } catch (error) {
    console.error('Error fetching destinations by region:', error);
    return [];
  }
}

// ✅ Get all unique regions from destinations
export async function getAllRegions(): Promise<string[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const snapshot = await getDocs(destinationsRef);
    
    const regions = snapshot.docs.map(doc => doc.data().region);
    return [...new Set(regions)].filter(region => region) as string[];
  } catch (error) {
    console.error('Error fetching all regions:', error);
    return [];
  }
}

// ✅ Get region statistics (count and average ranking)
export async function getRegionStats(): Promise<{region: string, count: number, averageRanking: number}[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const snapshot = await getDocs(destinationsRef);
    
    const destinations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Destination));

    const regionMap = new Map<string, {count: number, totalRanking: number}>();
    
    destinations.forEach(dest => {
      if (!dest.region) return;
      
      const current = regionMap.get(dest.region) || {count: 0, totalRanking: 0};
      regionMap.set(dest.region, {
        count: current.count + 1,
        totalRanking: current.totalRanking + (dest.ranking || 0)
      });
    });

    return Array.from(regionMap.entries()).map(([region, stats]) => ({
      region,
      count: stats.count,
      averageRanking: stats.totalRanking / stats.count
    }));
  } catch (error) {
    console.error('Error fetching region stats:', error);
    return [];
  }
}

// ✅ Get featured destinations by region (highest ranked in each region)
export async function getFeaturedDestinationsByRegion(limitPerRegion: number = 3): Promise<Destination[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const q = query(destinationsRef, orderBy('ranking', 'desc'));
    const snapshot = await getDocs(q);

    const destinations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Destination));

    // Group by region and take top N from each
    const regionMap = new Map<string, Destination[]>();
    
    destinations.forEach(dest => {
      if (!dest.region) return;
      
      const regionDests = regionMap.get(dest.region) || [];
      regionDests.push(dest);
      regionMap.set(dest.region, regionDests);
    });

    return Array.from(regionMap.values())
      .flatMap(regionDests => regionDests.slice(0, limitPerRegion))
      .sort((a, b) => (b.ranking || 0) - (a.ranking || 0));
  } catch (error) {
    console.error('Error fetching featured destinations by region:', error);
    return [];
  }
}
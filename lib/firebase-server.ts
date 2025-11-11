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
  collectionGroup,
  addDoc,
  Timestamp,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Destination, Place,Recipe,Review,ReviewStats } from '../types';

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
//________________________________________Reviews related queries_______________________________________________
export async function getReviews(
  targetType: 'destination' | 'place',
  targetId: string,
  limitCount: number = 6
): Promise<Review[]> {
  const q = query(
    collection(db, 'reviews'),
    where('targetType', '==', targetType),
    where('targetId', '==', targetId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data() as any;

    const toDate = (v: any | undefined) =>
      v instanceof Timestamp ? v.toDate() : v ? new Date(v) : undefined;

    const review: Review = {
      id: d.id,
      targetType: data.targetType,
      targetId: data.targetId,
      userId: data.userId,
      rating: Number(data.rating ?? 0),
      title: data.title ?? '',
      content: data.content ?? data.text ?? '',
      images: Array.isArray(data.images) ? data.images : [],
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
      user: {
        name: data.user?.name ?? data.userName ?? 'Anonymous',
        avatar: data.user?.avatar ?? data.userAvatar,
        country: data.user?.country,
      },
      helpful: Number(data.helpful ?? 0),
      reported: Boolean(data.reported ?? false),
    };

    return review;
  });
}

/**
 * Compute stats (avg + distribution) for a given target.
 * Fixes the TS index error by narrowing to 1|2|3|4|5.
 */
export async function getReviewStats(
  targetType: 'destination' | 'place',
  targetId: string
): Promise<ReviewStats> {
  const list = await getReviews(targetType, targetId, 1000);

  const ratings: ReviewStats['ratingDistribution'] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let sum = 0;

  for (const r of list) {
    const rounded = Math.round(Number(r.rating));
    const clamped = Math.max(1, Math.min(5, rounded)) as 1 | 2 | 3 | 4 | 5;
    ratings[clamped] = (ratings[clamped] + 1) as number;
    sum += clamped;
  }

  const total = list.length;
  return {
    averageRating: total ? +(sum / total).toFixed(2) : 0,
    totalReviews: total,
    ratingDistribution: ratings,
  };
}

/**
 * Add a review. Use serverTimestamp so your orderBy('createdAt') works reliably.
 */


function tsToDate(v: any): Date | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return v;
  if (v?.toDate) return v.toDate();
  return new Date(v);
}

export async function getReviewsByTarget(targetType: 'destination' | 'place', targetId: string): Promise<Review[]> {
  const qRef = query(
    collection(db, 'reviews'),
    where('targetType', '==', targetType),
    where('targetId', '==', targetId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(qRef);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    const r: Review = {
      id: d.id,
      targetType: data.targetType,
      targetId: data.targetId,
     // placeId: data.placeId, // tolerated if still in DB, not used
      userId: data.userId,
      rating: data.rating,
      title: data.title ?? '',
      content: data.content ?? data.text ?? '',
      images: Array.isArray(data.images) ? data.images : [],
      createdAt: tsToDate(data.createdAt),
      updatedAt: tsToDate(data.updatedAt),
      user: {
        name: data.user?.name ?? data.userName ?? 'Anonymous',
        avatar: data.user?.avatar,
        country: data.user?.country,
      },
      helpful: data.helpful ?? 0,
      reported: data.reported ?? false,
    };
    return r;
  });
}

export async function getReviewStatsByTarget(targetType: 'destination' | 'place', targetId: string): Promise<ReviewStats> {
  const list = await getReviewsByTarget(targetType, targetId);
  const total = list.length;
  const dist: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  for (const r of list) {
    const clamped = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    dist[clamped] = dist[clamped] + 1;
    sum += clamped;
  }

  return {
    averageRating: total ? +(sum / total).toFixed(2) : 0,
    totalReviews: total,
    ratingDistribution: dist,
  };
}

/**
 * Enforce: one review per user per target within last 365 days.
 * Throws { code: 'ALREADY_REVIEWED_THIS_YEAR' } if blocked.
 */
export async function addReview(input: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  // check duplicates in last 365 days
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);

  const dupQ = query(
    collection(db, 'reviews'),
    where('targetType', '==', input.targetType),
    where('targetId', '==', input.targetId),
    where('userId', '==', input.userId),
    where('createdAt', '>=', Timestamp.fromDate(cutoff))
  );
  const dupSnap = await getDocs(dupQ);
  if (!dupSnap.empty) {
    const err: any = new Error('Already reviewed within a year');
    err.code = 'ALREADY_REVIEWED_THIS_YEAR';
    throw err;
  }

  const now = serverTimestamp();
  const docRef = await addDoc(collection(db, 'reviews'), {
    ...input,
    // keep legacy shape tolerant (if something still reads placeId)
    placeId: input.targetId,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function deleteReview(reviewId: string): Promise<void> {
  // Security rules will enforce ownership (request.auth.uid == resource.data.userId)
  const ref = doc(db, 'reviews', reviewId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  await deleteDoc(ref);
}

/** Backward-compat helpers you already call from the page (optional) */
//export const getPlaceReviews = (targetId: string) => getReviewsByTarget('place', targetId);
//export const getPlaceReviewStats = (targetId: string) => getReviewStatsByTarget('place', targetId);
export async function getPlaceReviews(targetId: string, limitCount = 6): Promise<Review[]> {
  const qy = query(
    collection(db, 'reviews'),
    where('targetType', '==', 'place'),
    where('targetId', '==', targetId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(qy);
  return snap.docs.map(d => {
    const data = d.data() as any;
    return {
      id: d.id,
      targetType: data.targetType,
      targetId: data.targetId,
      userId: data.userId,
      rating: data.rating,
      title: data.title ?? '',
      content: data.content ?? '',
      images: Array.isArray(data.images) ? data.images : [],
      createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
      user: {
        name: data.user?.name ?? data.userName ?? 'Anonymous',
        avatar: data.user?.avatar,
        country: data.user?.country,
      },
      helpful: data.helpful ?? 0,
      reported: !!data.reported,
    } as Review;
  });
}
export async function getPlaceReviewStats(targetId: string) {
  const list = await getPlaceReviews(targetId);
  const total = list.length;

  let ratings: ReviewStats['ratingDistribution'] = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  let sum = 0;

  for (const r of list) {
    const key = Math.max(1, Math.min(5, Math.round(r.rating))) as 1|2|3|4|5;
    ratings[key] = ratings[key] + 1;
    sum += key;
  }

  return {
    averageRating: total ? +(sum / total).toFixed(2) : 0,
    totalReviews: total,
    ratingDistribution: ratings,
  };
}
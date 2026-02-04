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
  deleteDoc,
updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Destination,
   Place,Recipe,
   Review,
   ReviewStats, 
   TripCriteria,
    TripPlan,
    SavedTripPlan,
     User,
     ActivitySlot,
    DayPlan,
    MealPlan,
    AccommodationDay,
    BudgetBreakdown,
    
    
    } from '../types';
    import {
  calculateDailyCost,
  getBestMonths,
  calculateBudgetBreakdown,
  generateRecommendedPlaces,
  generateAccommodations,
  generateTransportPlan,
  generateTravelTips,
  generatePackingList,
  generateEmergencyInfo,
  generateLocalCustoms,
  generateFoodGuide,
  calculateTripStats
} from './trip-planner-helpers';

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
//-----------------------------------AI planner needed functions-----------------------------------
// Add these specific functions to your firebase-server.ts for AI planner

// ✅ Get destinations with places count for AI planner
export async function getDestinationsForAIPlanner(): Promise<Array<Destination & { placesCount: number }>> {
  try {
    const destinations = await getAllDestinations();
    
    // Get places count for each destination
    const destinationsWithPlacesCount = await Promise.all(
      destinations.map(async (destination) => {
        const placesCount = await getPlacesCount(destination.id);
        return {
          ...destination,
          placesCount
        };
      })
    );
    
    return destinationsWithPlacesCount;
  } catch (error) {
    console.error('Error fetching destinations for AI planner:', error);
    return [];
  }
}

// ✅ Get destinations by activity type (for interest matching)
export async function getDestinationsByActivities(activities: string[]): Promise<Destination[]> {
  try {
    const destinations = await getAllDestinations();
    
    // Filter destinations that have ANY of the specified activities
    return destinations.filter(destination => 
      destination.activities && 
      destination.activities.some(activity => 
        activities.some(searchActivity => 
          activity.toLowerCase().includes(searchActivity.toLowerCase())
        )
      )
    );
  } catch (error) {
    console.error('Error fetching destinations by activities:', error);
    return [];
  }
}

// ✅ Get destinations suitable for specified season
export async function getDestinationsBySeason(season: string): Promise<Destination[]> {
  try {
    const destinations = await getAllDestinations();
    
    return destinations.filter(destination => 
      destination.bestSeason && 
      destination.bestSeason.some(best => 
        best.toLowerCase().includes(season.toLowerCase())
      )
    );
  } catch (error) {
    console.error('Error fetching destinations by season:', error);
    return [];
  }
}

// ✅ Get featured destinations with high ranking
export async function getTopRankedDestinations(limitCount: number = 10): Promise<Destination[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const q = query(
      destinationsRef, 
      where('ranking', '>=', 4),
      orderBy('ranking', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Destination));
  } catch (error) {
    console.error('Error fetching top ranked destinations:', error);
    return [];
  }
}



// ✅ Calculate optimal route between destinations (basic distance calculation)
export async function getOptimalRoute(destinationIds: string[]): Promise<string[]> {
  try {
    const destinations = await getDestinationsForItinerary(destinationIds);
    
    if (destinations.length < 2) {
      return destinationIds;
    }
    
    // Simple implementation - sort by latitude (north to south)
    // In a real app, you'd use a proper routing algorithm like TSP
    return destinations
      .sort((a, b) => a.coordinates.lat - b.coordinates.lat)
      .map(dest => dest.id);
  } catch (error) {
    console.error('Error calculating optimal route:', error);
    return destinationIds;
  }
}

// ✅ Get destination by ID (NEW - add this)
export async function getDestinationById(destinationId: string): Promise<Destination | null> {
  try {
    const destinationRef = doc(db, 'destinations', destinationId);
    const destinationDoc = await getDoc(destinationRef);
    
    if (!destinationDoc.exists()) return null;
    
    return {
      id: destinationDoc.id,
      ...destinationDoc.data()
    } as Destination;
  } catch (error) {
    console.error('Error fetching destination by ID:', error);
    return null;
  }
}

// ✅ Get destinations for itinerary planning (updated to work with both IDs and slugs)
export async function getDestinationsForItinerary(destinationSlugsOrIds: string[]): Promise<Destination[]> {
  try {
    const destinations: Destination[] = [];
    
    for (const identifier of destinationSlugsOrIds) {
      let destination: Destination | null = null;
      
      // Try to fetch by ID first (if it looks like a Firestore ID)
      if (identifier.length === 20 || identifier.length === 28) { // Firestore ID lengths
        destination = await getDestinationById(identifier);
      }
      
      // If not found by ID, try by slug
      if (!destination) {
        destination = await getDestinationBySlug(identifier);
      }
      
      if (destination) {
        destinations.push(destination);
      }
    }
    
    return destinations;
  } catch (error) {
    console.error('Error fetching destinations for itinerary:', error);
    return [];
  }
}

// ✅ Update getSimilarDestinations to work with slugs
export async function getSimilarDestinations(
  referenceDestinationSlug: string,
  limitCount: number = 5
): Promise<Destination[]> {
  try {
    const referenceDestination = await getDestinationBySlug(referenceDestinationSlug);
    if (!referenceDestination) return [];
    
    const destinations = await getAllDestinations();
    
    const scoredDestinations = destinations
      .filter(dest => dest.slug !== referenceDestination.slug)
      .map(dest => {
        let score = 0;
        
        // Same region gets high score
        if (dest.region === referenceDestination.region) {
          score += 3;
        }
        
        // Shared activities
        if (referenceDestination.activities && dest.activities) {
          const sharedActivities = referenceDestination.activities.filter(activity =>
            dest.activities.includes(activity)
          );
          score += sharedActivities.length;
        }
        
        // Similar highlights
        if (referenceDestination.highlights && dest.highlights) {
          const sharedHighlights = referenceDestination.highlights.filter(highlight =>
            dest.highlights.includes(highlight)
          );
          score += sharedHighlights.length * 0.5;
        }
        
        // Similar season
        if (referenceDestination.bestSeason && dest.bestSeason) {
          const sharedSeasons = referenceDestination.bestSeason.filter(season =>
            dest.bestSeason.includes(season)
          );
          score += sharedSeasons.length;
        }
        
        return { destination: dest, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limitCount)
      .map(item => item.destination);
    
    return scoredDestinations;
  } catch (error) {
    console.error('Error fetching similar destinations:', error);
    return [];
  }
}
// ====================== AI TRIP PLANNER FUNCTIONS ======================

// ✅ Save trip plan to user's collection
export async function saveTripPlanForUser(
  userId: string, 
  tripPlanData: Omit<SavedTripPlan, 'id' | 'createdAt' | 'updatedAt' | 'version'>
): Promise<string> {
  try {
    const tripPlansRef = collection(db, 'users', userId, 'tripPlans');
    
    const now = Timestamp.now();
    
    // Create a clean trip plan object with all required fields
    const tripPlanToSave = {
      // Required fields from input
      userId: userId,
      title: tripPlanData.title || 'Untitled Trip',
      criteria: tripPlanData.criteria || {},
      generatedPlan: tripPlanData.generatedPlan || {},
      realReferences: tripPlanData.realReferences || {
        destinationIds: [],
        placeIds: [],
        placeDetails: []
      },
      status: tripPlanData.status || 'draft',
      dates: {
        start: tripPlanData.dates?.start ? Timestamp.fromDate(new Date(tripPlanData.dates.start)) : now,
        end: tripPlanData.dates?.end ? Timestamp.fromDate(new Date(tripPlanData.dates.end)) : now,
        actualStart: tripPlanData.dates?.actualStart ? Timestamp.fromDate(new Date(tripPlanData.dates.actualStart)) : null,
        actualEnd: tripPlanData.dates?.actualEnd ? Timestamp.fromDate(new Date(tripPlanData.dates.actualEnd)) : null
      },
      budget: {
        estimated: tripPlanData.budget?.estimated || 0,
        actualSpent: tripPlanData.budget?.actualSpent || 0,
        currency: tripPlanData.budget?.currency || 'USD',
        breakdown: tripPlanData.budget?.breakdown || {
          accommodations: 0,
          activities: 0,
          food: 0,
          transport: 0,
          shopping: 0,
          misc: 0
        }
      },
      notes: tripPlanData.notes || '',
      photos: tripPlanData.photos || [],
      // Make sure rating is always a number (not undefined)
      rating: tripPlanData.rating || 0,
      sharing: {
        isPublic: tripPlanData.sharing?.isPublic || false,
        shareToken: tripPlanData.sharing?.shareToken || '',
        sharedWith: tripPlanData.sharing?.sharedWith || []
      },
      // System fields
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    
    console.log('Saving trip plan:', tripPlanToSave);
    
    const docRef = await addDoc(tripPlansRef, tripPlanToSave);
    
    // Update user's savedTripPlanIds
    await updateUserTripPlanIds(userId, docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving trip plan:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to save trip plan: ${message}`);
  }
}

// ✅ Get all trip plans for a user
// Update the getUserTripPlans function in firebase-server.ts:

export async function getUserTripPlans(userId: string): Promise<SavedTripPlan[]> {
  try {
    const tripPlansRef = collection(db, 'users', userId, 'tripPlans');
    const q = query(tripPlansRef, orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      
      // Helper function to convert Firestore timestamps
      const toDate = (value: any): Date => {
        if (!value) return new Date();
        if (value.toDate && typeof value.toDate === 'function') {
          return value.toDate();
        }
        if (value instanceof Date) return value;
        if (typeof value === 'string') return new Date(value);
        if (typeof value === 'number') return new Date(value);
        return new Date();
      };
      
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        criteria: data.criteria,
        generatedPlan: data.generatedPlan,
        realReferences: data.realReferences || {
          destinationIds: [],
          placeIds: [],
          placeDetails: []
        },
        status: data.status || 'draft',
        dates: {
          start: toDate(data.dates?.start),
          end: toDate(data.dates?.end),
          actualStart: data.dates?.actualStart ? toDate(data.dates.actualStart) : undefined,
          actualEnd: data.dates?.actualEnd ? toDate(data.dates.actualEnd) : undefined
        },
        budget: {
          estimated: data.budget?.estimated || 0,
          actualSpent: data.budget?.actualSpent || 0,
          currency: data.budget?.currency || 'USD',
          breakdown: data.budget?.breakdown || {
            accommodations: 0,
            activities: 0,
            food: 0,
            transport: 0,
            shopping: 0,
            misc: 0
          }
        },
        notes: data.notes || '',
        photos: data.photos || [],
        rating: data.rating || 0,
        sharing: {
          isPublic: data.sharing?.isPublic || false,
          shareToken: data.sharing?.shareToken || '',
          sharedWith: data.sharing?.sharedWith || []
        },
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
        version: data.version || 1
      } as SavedTripPlan;
    });
  } catch (error) {
    console.error('Error fetching user trip plans:', error);
    return [];
  }
}

// ✅ Get single trip plan by ID
export async function getTripPlanById(
  userId: string, 
  tripPlanId: string
): Promise<SavedTripPlan | null> {
  try {
    const tripPlanRef = doc(db, 'users', userId, 'tripPlans', tripPlanId);
    const tripPlanDoc = await getDoc(tripPlanRef);
    
    if (!tripPlanDoc.exists()) return null;
    
    const data = tripPlanDoc.data();
    
    // Helper function to convert Firestore timestamps
    const toDate = (value: any): Date => {
      if (!value) return new Date();
      if (value.toDate && typeof value.toDate === 'function') {
        return value.toDate();
      }
      if (value instanceof Date) return value;
      if (typeof value === 'string') return new Date(value);
      if (typeof value === 'number') return new Date(value);
      return new Date();
    };
    
    return {
      id: tripPlanDoc.id,
      userId: data.userId,
      title: data.title,
      criteria: data.criteria,
      generatedPlan: data.generatedPlan,
      realReferences: data.realReferences || {
        destinationIds: [],
        placeIds: [],
        placeDetails: []
      },
      status: data.status || 'draft',
      dates: {
        start: toDate(data.dates?.start),
        end: toDate(data.dates?.end),
        actualStart: data.dates?.actualStart ? toDate(data.dates.actualStart) : undefined,
        actualEnd: data.dates?.actualEnd ? toDate(data.dates.actualEnd) : undefined
      },
      budget: {
        estimated: data.budget?.estimated || 0,
        actualSpent: data.budget?.actualSpent || 0,
        currency: data.budget?.currency || 'USD',
        breakdown: data.budget?.breakdown || {
          accommodations: 0,
          activities: 0,
          food: 0,
          transport: 0,
          shopping: 0,
          misc: 0
        }
      },
      notes: data.notes || '',
      photos: data.photos || [],
      rating: data.rating || 0,
      sharing: {
        isPublic: data.sharing?.isPublic || false,
        shareToken: data.sharing?.shareToken || '',
        sharedWith: data.sharing?.sharedWith || []
      },
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
      version: data.version || 1
    } as SavedTripPlan;
  } catch (error) {
    console.error('Error fetching trip plan:', error);
    return null;
  }
}

// ✅ Update trip plan
export async function updateTripPlan(
  userId: string,
  tripPlanId: string,
  updates: Partial<SavedTripPlan>
): Promise<void> {
  try {
    const tripPlanRef = doc(db, 'users', userId, 'tripPlans', tripPlanId);
    
    await updateDoc(tripPlanRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating trip plan:', error);
    throw new Error('Failed to update trip plan');
  }
}

// ✅ Delete trip plan
export async function deleteTripPlan(
  userId: string,
  tripPlanId: string
): Promise<void> {
  try {
    const tripPlanRef = doc(db, 'users', userId, 'tripPlans', tripPlanId);
    await deleteDoc(tripPlanRef);
    
    // Remove from user's savedTripPlanIds
    await removeUserTripPlanId(userId, tripPlanId);
  } catch (error) {
    console.error('Error deleting trip plan:', error);
    throw new Error('Failed to delete trip plan');
  }
}

// ✅ Duplicate trip plan
export async function duplicateTripPlan(
  userId: string,
  tripPlanId: string
): Promise<string> {
  try {
    const originalPlan = await getTripPlanById(userId, tripPlanId);
    if (!originalPlan) throw new Error('Trip plan not found');
    
    const newPlan: Omit<SavedTripPlan, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
      ...originalPlan,
      title: `${originalPlan.title} (Copy)`,
      status: 'draft',
      sharing: {
        ...originalPlan.sharing,
        isPublic: false,
        shareToken: undefined
      },
      budget: {
        ...originalPlan.budget,
        actualSpent: undefined
      },
      dates: {
        ...originalPlan.dates,
        actualStart: undefined,
        actualEnd: undefined
      },
      rating: undefined,
      photos: [],
      notes: ''
    };
    
    return await saveTripPlanForUser(userId, newPlan);
  } catch (error) {
    console.error('Error duplicating trip plan:', error);
    throw new Error('Failed to duplicate trip plan');
  }
}

// ✅ Get destinations with their places for region selection
export async function getDestinationsWithPlacesByRegion(
  regionName: string
): Promise<Array<Destination & { places: Place[] }>> {
  try {
    // Get all destinations in the region
    const destinations = await getDestinationsByRegion(regionName);
    
    // Get places for each destination
    const destinationsWithPlaces = await Promise.all(
      destinations.map(async (destination) => {
        const places = await getPlacesByDestination(destination.id, 50); // Get up to 50 places
        return {
          ...destination,
          places
        };
      })
    );
    
    return destinationsWithPlaces;
  } catch (error) {
    console.error('Error fetching destinations with places:', error);
    return [];
  }
}

// ✅ Get places filtered by interests
export async function getPlacesForItinerary(
  destinationId: string, 
  interests: string[]
): Promise<Place[]> {
  try {
    const allPlaces = await getPlacesByDestination(destinationId, 100);
    
    if (!interests.length) return allPlaces.slice(0, 20); // Return top 20 if no interests
    
    // Map interests to place types/categories
    const interestMapping: Record<string, { types: Place['type'][], categories: Place['category'][] }> = {
      'cultural': { types: ['museum', 'historical', 'religious'], categories: ['cultural'] },
      'beaches': { types: ['beach'], categories: ['scenic', 'nature'] },
      'mountains': { types: ['natural'], categories: ['nature'] },
      'desert': { types: ['natural'], categories: ['nature'] },
      'food': { types: ['restaurant'], categories: ['food'] },
      'shopping': { types: ['market'], categories: ['shopping'] },
      'adventure': { types: ['natural'], categories: ['nature'] },
      'history': { types: ['historical', 'museum'], categories: ['cultural'] },
      'relaxation': { types: ['park', 'beach'], categories: ['scenic'] },
      'photography': { types: ['viewpoint', 'natural', 'historical'], categories: ['scenic'] },
      'nature': { types: ['natural', 'park'], categories: ['nature', 'scenic'] },
      'nightlife': { types: [], categories: ['entertainment'] },
      'spiritual': { types: ['religious'], categories: ['religious'] },
      'crafts': { types: ['market'], categories: ['shopping', 'cultural'] },
      'festivals': { types: [], categories: ['entertainment', 'cultural'] }
    };
    
    // Filter places based on interests
    const filteredPlaces = allPlaces.filter(place => {
      return interests.some(interest => {
        const mapping = interestMapping[interest];
        if (!mapping) return false;
        
        // Check if place type matches interest
        const typeMatch = mapping.types.includes(place.type);
        
        // Check if place category matches interest
        const categoryMatch = mapping.categories.includes(place.category);
        
        return typeMatch || categoryMatch;
      });
    });
    
    // Sort by rating and review count
    return filteredPlaces
      .sort((a, b) => {
        const aScore = (a.rating || 0) * (a.reviewCount || 1);
        const bScore = (b.rating || 0) * (b.reviewCount || 1);
        return bScore - aScore;
      })
      .slice(0, 30); // Return top 30 places
  } catch (error) {
    console.error('Error fetching places for itinerary:', error);
    return [];
  }
}

// ✅ Calculate daily schedule from places
export async function calculateDailySchedule(
  places: Place[],
  dailyHours: number,
  startTime: string = '09:00'
): Promise<ActivitySlot[]> {
  const activities: ActivitySlot[] = [];
  let currentTime = startTime;
  
  for (const place of places) {
    // Parse duration string (e.g., "2-3 hours" or "45 minutes")
    let durationMinutes = 120; // Default 2 hours
    
    if (place.duration) {
      const durationMatch = place.duration.match(/(\d+)/);
      if (durationMatch) {
        const num = parseInt(durationMatch[1]);
        if (place.duration.includes('hour')) {
          durationMinutes = num * 60;
        } else if (place.duration.includes('minute')) {
          durationMinutes = num;
        }
      }
    }
    
    // Add travel time buffer (30 minutes between activities)
    const travelBuffer = activities.length > 0 ? 30 : 0;
    
    // Calculate end time
    const startDateTime = new Date(`2000-01-01T${currentTime}`);
    startDateTime.setMinutes(startDateTime.getMinutes() + travelBuffer);
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);
    
    // Format times
    const formatTime = (date: Date) => {
      return date.toTimeString().slice(0, 5);
    };
    
    const activity: ActivitySlot = {
      id: `activity_${Date.now()}_${place.id}`,
      placeId: place.id,
      placeName: place.name.en,
      placeType: place.type,
      placeCategory: place.category,
      description: place.description.en.substring(0, 100) + '...',
      duration: durationMinutes,
      startTime: formatTime(startDateTime),
      endTime: formatTime(endDateTime),
      location: {
        name: place.location.address,
        coordinates: place.location.coordinates
      },
      cost: {
        perPerson: place.entranceFee?.tourist || 0,
        total: place.entranceFee?.tourist || 0,
        currency: place.entranceFee?.currency || 'MAD',
        includes: ['Entrance fee']
      },
      practicalInfo: {
        bestTime: place.bestTimeToVisit?.[0] || 'Morning',
        tips: place.tips || [],
        whatToBring: [],
        bookingRequired: place.type === 'restaurant' || false,
        difficulty: 'easy'
      }
    };
    
    activities.push(activity);
    currentTime = formatTime(endDateTime);
    
    // Check if we've exceeded daily hours
    const totalMinutes = activities.reduce((sum, act) => sum + act.duration, 0);
    if (totalMinutes / 60 > dailyHours) {
      break;
    }
  }
  
  return activities;
}

// ✅ Generate complete itinerary
export async function generateCompleteItinerary(
  criteria: TripCriteria,
  selectedDestinations: Destination[],
  userPreferences?: User['preferences']
): Promise<TripPlan> {
  try {
    // Get places for each destination based on interests
    const destinationPlaces = await Promise.all(
      selectedDestinations.map(async (destination) => {
        const places = await getPlacesForItinerary(destination.id, criteria.interests);
        return { destination, places };
      })
    );
    
    // Calculate days per destination (proportional)
    const totalPlaces = destinationPlaces.reduce((sum, dp) => sum + dp.places.length, 0);
    const destinationDays = destinationPlaces.map(dp => ({
      destination: dp.destination,
      days: Math.max(1, Math.round((dp.places.length / totalPlaces) * criteria.duration))
    }));
    
    // Generate day plans
    const dayPlans: DayPlan[] = [];
    let currentDay = 1;
    
    for (const { destination, days } of destinationDays) {
      const places = destinationPlaces.find(dp => dp.destination.id === destination.id)?.places || [];
      
      // Split places across days for this destination
      const placesPerDay = Math.ceil(places.length / days);
      
      for (let dayOffset = 0; dayOffset < days && currentDay <= criteria.duration; dayOffset++) {
        const dayPlaces = places.slice(dayOffset * placesPerDay, (dayOffset + 1) * placesPerDay);
        const dailyActivities = await calculateDailySchedule(
          dayPlaces,
          criteria.activityLevel === 'relaxed' ? 4 : criteria.activityLevel === 'balanced' ? 6 : 8
        );
        
        const dayPlan: DayPlan = {
          dayNumber: currentDay,
          date: new Date(new Date(criteria.startDate).setDate(
            new Date(criteria.startDate).getDate() + currentDay - 1
          )).toISOString().split('T')[0],
          title: `Day ${currentDay}: Exploring ${destination.name.en}`,
          theme: criteria.interests[0] ? `${criteria.interests[0]} Experience` : 'Discovery',
          destination: {
            id: destination.id,
            name: destination.name.en,
            region: destination.region
          },
          morning: dailyActivities.slice(0, Math.ceil(dailyActivities.length / 2)),
          afternoon: dailyActivities.slice(Math.ceil(dailyActivities.length / 2)),
          evening: [],
          meals: generateMealPlan(criteria),
          accommodation: generateAccommodation(criteria, destination),
          transport: {
            local: [],
            totalTravelTime: 60,
            totalTravelCost: 0
          },
          estimatedStartTime: '09:00',
          estimatedEndTime: '17:00',
          totalActivityHours: dailyActivities.reduce((sum, act) => sum + act.duration, 0) / 60,
          freeTime: 60,
          dailyCost: calculateDailyCost(dailyActivities, criteria),
          packingTips: [],
          importantNotes: [],
          contingencyPlans: [],
          isCustomized: false
        };
        
        dayPlans.push(dayPlan);
        currentDay++;
      }
    }
    
    // Generate complete trip plan
    const tripPlan: TripPlan = {
      id: `plan_${Date.now()}`,
      title: `${criteria.interests[0] ? criteria.interests[0].charAt(0).toUpperCase() + criteria.interests[0].slice(1) : 'Moroccan'} Adventure - ${criteria.duration} Days`,
      summary: `Explore the beauty of Morocco with this ${criteria.duration}-day itinerary designed for ${criteria.travelers} traveler${criteria.travelers > 1 ? 's' : ''}. Experience ${criteria.interests.join(', ')} across ${selectedDestinations.length} destinations.`,
      theme: criteria.interests[0] || 'Moroccan Discovery',
      generatedAt: new Date(),
      version: 1,
      generationId: `gen_${Date.now()}`,
      language: userPreferences?.language || 'en',
      criteria,
      duration: criteria.duration,
      dates: {
        start: criteria.startDate,
        end: criteria.endDate,
        season: criteria.season,
        bestMonths: getBestMonths(criteria.season)
      },
      dayPlans,
      totalActivities: dayPlans.reduce((sum, day) => sum + day.morning.length + day.afternoon.length + day.evening.length, 0),
      totalTravelHours: dayPlans.reduce((sum, day) => sum + day.transport.totalTravelTime, 0) / 60,
      budget: calculateBudgetBreakdown(criteria, dayPlans),
      destinations: selectedDestinations.map(dest => ({
        id: dest.id,
        name: dest.name.en,
        slug: dest.slug,
        region: dest.region,
        daysSpent: destinationDays.find(dd => dd.destination.id === dest.id)?.days || 1,
        arrivalDay: 1,
        departureDay: criteria.duration
      })),
      recommendedPlaces: generateRecommendedPlaces(destinationPlaces, criteria.interests),
      includedPlaceIds: dayPlans.flatMap(day => [
        ...day.morning.map(act => act.placeId),
        ...day.afternoon.map(act => act.placeId),
        ...day.evening.map(act => act.placeId)
      ]).filter(Boolean) as string[],
      accommodations: generateAccommodations(criteria, selectedDestinations),
      transportPlan: generateTransportPlan(criteria, selectedDestinations),
      travelTips: generateTravelTips(criteria, selectedDestinations),
      packingList: generatePackingList(criteria),
      emergencyInfo: generateEmergencyInfo(),
      localCustoms: generateLocalCustoms(selectedDestinations),
      foodGuide: generateFoodGuide(selectedDestinations, criteria),
      customizations: {
        excludedActivities: [],
        addedActivities: [],
        modifiedDays: [],
        userNotes: {},
        userPhotos: {}
      },
      stats: calculateTripStats(dayPlans),
      exportFormats: {
        pdfReady: true,
        calendarReady: true,
        shareableLink: ''
      },
      isSaved: false,
      viewCount: 0
    };
    
    return tripPlan;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary');
  }
}

// ====================== HELPER FUNCTIONS ======================

// Helper: Update user's trip plan IDs
async function updateUserTripPlanIds(userId: string, tripPlanId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentIds = userData.savedTripPlanIds || [];
      
      if (!currentIds.includes(tripPlanId)) {
        await updateDoc(userRef, {
          savedTripPlanIds: [...currentIds, tripPlanId]
        });
      }
    }
  } catch (error) {
    console.error('Error updating user trip plan IDs:', error);
  }
}

// Helper: Remove trip plan ID from user
async function removeUserTripPlanId(userId: string, tripPlanId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentIds = userData.savedTripPlanIds || [];
      
      await updateDoc(userRef, {
        savedTripPlanIds: currentIds.filter((id: string) => id !== tripPlanId)
      });
    }
  } catch (error) {
    console.error('Error removing trip plan ID from user:', error);
  }
}

// Helper: Generate meal plan
function generateMealPlan(criteria: TripCriteria): MealPlan[] {
  return [
    {
      type: 'breakfast',
      time: '08:00',
      suggestion: 'Traditional Moroccan breakfast with msemen and mint tea',
      cuisine: 'Moroccan',
      budgetRange: '$5-10',
      dietaryOptions: criteria.dietaryRestrictions
    },
    {
      type: 'lunch',
      time: '13:00',
      suggestion: 'Local restaurant with tagine options',
      cuisine: 'Moroccan',
      budgetRange: '$10-20',
      dietaryOptions: criteria.dietaryRestrictions
    },
    {
      type: 'dinner',
      time: '19:00',
      suggestion: 'Dinner with Moroccan specialties',
      cuisine: 'Moroccan',
      budgetRange: '$15-30',
      dietaryOptions: criteria.dietaryRestrictions
    }
  ];
}

// Helper: Generate accommodation
function generateAccommodation(criteria: TripCriteria, destination: Destination): AccommodationDay {
  const styles = {
    traditional: { name: 'Traditional Riad', cost: 80 },
    modern: { name: 'Modern Hotel', cost: 120 },
    luxury: { name: 'Luxury Resort', cost: 250 },
    budget: { name: 'Budget Hostel', cost: 40 },
    mix: { name: 'Mixed Accommodation', cost: 100 }
  };
  
  const style = styles[criteria.accommodationStyle as keyof typeof styles] || styles.traditional;
  
  return {
    name: `${style.name} in ${destination.name.en}`,
    type: criteria.accommodationStyle,
    location: destination.name.en,
    checkIn: '14:00',
    checkOut: '11:00',
    costPerNight: style.cost * (criteria.budgetLevel === 'luxury' ? 1.5 : criteria.budgetLevel === 'budget' ? 0.7 : 1),
    amenities: ['WiFi', 'Breakfast', 'Air Conditioning'],
    bookingStatus: 'not-booked',
    notes: 'Recommend booking in advance'
  };
}

// Add these imports at the top if not already there:

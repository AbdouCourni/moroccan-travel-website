// src/lib/firebase-server.ts
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

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
import { 
  Destination,
  Place,
  Recipe,
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

// ==================== CONSTANTS ====================

const TOP_MOROCCAN_DESTINATIONS = [
  'marrakech', 'casablanca', 'fes', 'agadir', 'chefchaouen', 'essaouira',
  'rabat', 'tangier', 'meknes', 'ouarzazate', 'merzouga', 'ifrane',
  'safi', 'el-jadida', 'tetouan', 'larache', 'nador', 'al-hoceima', 
  'zagora', 'tinghir', 'dakhla'
];

const CACHE_TTL = {
  DESTINATIONS: 3600, // 1 hour
  PLACES: 3600,       // 1 hour
  HOME_PAGE: 300,     // 5 minutes
};

// ==================== DESTINATION QUERIES ====================

// ✅ Optimized: Fetch only top destinations using 'in' query
export async function selectTopDestinations(count: number = 12): Promise<Destination[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const topSlugs = TOP_MOROCCAN_DESTINATIONS.slice(0, count);
    
    // Firebase 'in' queries are limited to 30 items, so we batch if needed
    const batches: string[][] = [];
    for (let i = 0; i < topSlugs.length; i += 30) {
      batches.push(topSlugs.slice(i, i + 30));
    }
    
    let allDestinations: Destination[] = [];
    
    for (const batch of batches) {
      const q = query(destinationsRef, where('slug', 'in', batch));
      const snapshot = await getDocs(q);
      
      const batchDestinations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Destination));
      allDestinations.push(...batchDestinations);
    }
    
    // Return in the correct order
    return topSlugs
      .map(slug => allDestinations.find(dest => dest.slug === slug))
      .filter((dest): dest is Destination => dest !== undefined);
  } catch (error) {
    console.error('Error fetching top destinations:', error);
    return [];
  }
}

// ✅ Get destination by slug (cached)
export const getDestinationBySlug = cache(async (slug: string): Promise<Destination | null> => {
  try {
    const destinationsRef = collection(db, 'destinations');
    const q = query(destinationsRef, where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Destination;
  } catch (error) {
    console.error('Error fetching destination by slug:', error);
    return null;
  }
});

// ✅ Get destination by ID
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

// ✅ Get all destinations with pagination
export async function getAllDestinations(): Promise<Destination[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const snapshot = await getDocs(destinationsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Destination));
  } catch (error) {
    console.error('Error fetching all destinations:', error);
    return [];
  }
}
// ✅ Keep this as an alternative with limit

export async function getAllDestinationsWithLimit(limitCount: number = 100): Promise<Destination[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const q = query(destinationsRef, limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Destination));
  } catch (error) {
    console.error('Error fetching destinations with limit:', error);
    return [];
  }
}

// ✅ Get destinations by region
export async function getDestinationsByRegion(regionName: string): Promise<Destination[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const q = query(destinationsRef, where('region', '==', regionName), limit(50));
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

// ✅ Get all unique regions
export async function getAllRegions(): Promise<string[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const snapshot = await getDocs(query(destinationsRef, limit(100)));
    
    const regions = new Set<string>();
    snapshot.docs.forEach(doc => {
      const region = doc.data().region;
      if (region) regions.add(region);
    });
    
    return Array.from(regions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
}

// ✅ Get destinations by activities
export async function getDestinationsByActivities(activities: string[]): Promise<Destination[]> {
  try {
    const destinations = await getAllDestinationsOptimized(50);
    
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

// ✅ Get destinations by season
export async function getDestinationsBySeason(season: string): Promise<Destination[]> {
  try {
    const destinations = await getAllDestinationsOptimized(50);
    
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

// ✅ Helper to get all destinations (simplified)
async function getAllDestinationsOptimized(limitCount: number = 100): Promise<Destination[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    const q = query(destinationsRef, limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Destination));
  } catch (error) {
    console.error('Error fetching all destinations:', error);
    return [];
  }
}

// ==================== PLACE QUERIES ====================

// ✅ Get places by destination
export async function getPlacesByDestination(
  destinationId: string, 
  limitCount: number = 10
): Promise<Place[]> {
  try {
    const placesRef = collection(db, 'destinations', destinationId, 'places');
    const q = query(placesRef, limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Place));
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

// ✅ Get popular places by destination
export async function getPopularPlaces(
  destinationId: string, 
  limitCount: number = 6
): Promise<Place[]> {
  try {
    const placesRef = collection(db, 'destinations', destinationId, 'places');
    const q = query(
      placesRef, 
      orderBy('rating', 'desc'),
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

// ✅ Get featured places across all destinations
export async function getFeaturedPlaces(limitCount: number = 4): Promise<Place[]> {
  try {
    const placesQuery = query(
      collectionGroup(db, 'places'),
      where('rating', '>=', 4.0),
      orderBy('rating', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(placesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Place));
  } catch (error) {
    console.error('Error fetching featured places:', error);
    return [];
  }
}

// ✅ Get place by ID
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

// ==================== REVIEW QUERIES ====================

export async function getReviews(
  targetType: 'destination' | 'place',
  targetId: string,
  limitCount: number = 6
): Promise<Review[]> {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('targetType', '==', targetType),
      where('targetId', '==', targetId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snap = await getDocs(q);
    
    return snap.docs.map((d) => {
      const data = d.data();
      const toDate = (v: any) => v instanceof Timestamp ? v.toDate() : v ? new Date(v) : undefined;
      
      return {
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
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function getReviewStats(
  targetType: 'destination' | 'place',
  targetId: string
): Promise<ReviewStats> {
  try {
    const list = await getReviews(targetType, targetId, 100);
    
    const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    
    for (const r of list) {
      const clamped = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      ratings[clamped]++;
      sum += clamped;
    }
    
    const total = list.length;
    return {
      averageRating: total ? +(sum / total).toFixed(2) : 0,
      totalReviews: total,
      ratingDistribution: ratings,
    };
  } catch (error) {
    console.error('Error fetching review stats:', error);
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }
}

export async function addReview(input: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
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
    placeId: input.targetId,
    createdAt: now,
    updatedAt: now,
  });
  
  return docRef.id;
}

export async function deleteReview(reviewId: string): Promise<void> {
  const ref = doc(db, 'reviews', reviewId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  await deleteDoc(ref);
}

// ==================== RECIPE QUERIES ====================

export const recipesCollection = collection(db, 'recipes');

export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const snapshot = await getDocs(recipesCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Recipe));
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const docRef = doc(db, 'recipes', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Recipe;
    }
    return null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
};

export const getRecipesByCategory = async (category: string): Promise<Recipe[]> => {
  try {
    const q = query(recipesCollection, where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Recipe));
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    return [];
  }
};

// ==================== CACHED QUERIES ====================

// ✅ Cached home page data
export const getCachedHomePageData = unstable_cache(
  async () => {
    const [destinations, featuredPlaces] = await Promise.all([
      selectTopDestinations(8),
      getFeaturedPlaces(3).catch(() => [])
    ]);
    
    return {
      destinations: destinations.map(d => ({
        ...d,
        createdAt: d.createdAt?.toDate?.()?.toISOString() || d.createdAt,
        updatedAt: d.updatedAt?.toDate?.()?.toISOString() || d.updatedAt,
      })),
      featuredPlaces: featuredPlaces.map(p => ({
        ...p,
        createdAt: p.createdAt?.toDate?.()?.toISOString() || p.createdAt,
        updatedAt: p.updatedAt?.toDate?.()?.toISOString() || p.updatedAt,
      }))
    };
  },
  ['home-page-data'],
  { revalidate: CACHE_TTL.HOME_PAGE, tags: ['destinations', 'places'] }
);

// ✅ Cached destination by slug
export const getCachedDestinationBySlug = cache(async (slug: string): Promise<Destination | null> => {
  return getDestinationBySlug(slug);
});

// ✅ Cached destinations by region
export const getCachedDestinationsByRegion = cache(async (regionName: string): Promise<Destination[]> => {
  return getDestinationsByRegion(regionName);
});

// ==================== AI TRIP PLANNER FUNCTIONS ====================

export async function getDestinationsForItinerary(destinationSlugsOrIds: string[]): Promise<Destination[]> {
  try {
    const destinations: Destination[] = [];
    
    for (const identifier of destinationSlugsOrIds) {
      let destination: Destination | null = null;
      
      if (identifier.length === 20 || identifier.length === 28) {
        destination = await getDestinationById(identifier);
      }
      
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

export async function getSimilarDestinations(
  referenceDestinationSlug: string,
  limitCount: number = 5
): Promise<Destination[]> {
  try {
    const referenceDestination = await getDestinationBySlug(referenceDestinationSlug);
    if (!referenceDestination) return [];
    
    const { destinations } = await getAllDestinations(100);
    
    const scoredDestinations = destinations
      .filter(dest => dest.slug !== referenceDestination.slug)
      .map(dest => {
        let score = 0;
        
        if (dest.region === referenceDestination.region) score += 3;
        
        if (referenceDestination.activities && dest.activities) {
          const sharedActivities = referenceDestination.activities.filter(activity =>
            dest.activities.includes(activity)
          );
          score += sharedActivities.length;
        }
        
        if (referenceDestination.highlights && dest.highlights) {
          const sharedHighlights = referenceDestination.highlights.filter(highlight =>
            dest.highlights.includes(highlight)
          );
          score += sharedHighlights.length * 0.5;
        }
        
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

export async function saveTripPlanForUser(
  userId: string, 
  tripPlanData: Omit<SavedTripPlan, 'id' | 'createdAt' | 'updatedAt' | 'version'>
): Promise<string> {
  try {
    const tripPlansRef = collection(db, 'users', userId, 'tripPlans');
    const now = Timestamp.now();
    
    const tripPlanToSave = {
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
      rating: tripPlanData.rating || 0,
      sharing: {
        isPublic: tripPlanData.sharing?.isPublic || false,
        shareToken: tripPlanData.sharing?.shareToken || '',
        sharedWith: tripPlanData.sharing?.sharedWith || []
      },
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    
    const docRef = await addDoc(tripPlansRef, tripPlanToSave);
    await updateUserTripPlanIds(userId, docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving trip plan:', error);
    throw new Error(`Failed to save trip plan: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getUserTripPlans(userId: string): Promise<SavedTripPlan[]> {
  try {
    const tripPlansRef = collection(db, 'users', userId, 'tripPlans');
    const q = query(tripPlansRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const toDate = (value: any): Date => {
      if (!value) return new Date();
      if (value.toDate && typeof value.toDate === 'function') return value.toDate();
      if (value instanceof Date) return value;
      if (typeof value === 'string') return new Date(value);
      if (typeof value === 'number') return new Date(value);
      return new Date();
    };
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        criteria: data.criteria,
        generatedPlan: data.generatedPlan,
        realReferences: data.realReferences || { destinationIds: [], placeIds: [], placeDetails: [] },
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
            accommodations: 0, activities: 0, food: 0, transport: 0, shopping: 0, misc: 0
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

export async function getTripPlanById(userId: string, tripPlanId: string): Promise<SavedTripPlan | null> {
  try {
    const tripPlanRef = doc(db, 'users', userId, 'tripPlans', tripPlanId);
    const tripPlanDoc = await getDoc(tripPlanRef);
    
    if (!tripPlanDoc.exists()) return null;
    
    const data = tripPlanDoc.data();
    
    const toDate = (value: any): Date => {
      if (!value) return new Date();
      if (value.toDate && typeof value.toDate === 'function') return value.toDate();
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
      realReferences: data.realReferences || { destinationIds: [], placeIds: [], placeDetails: [] },
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
          accommodations: 0, activities: 0, food: 0, transport: 0, shopping: 0, misc: 0
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

export async function deleteTripPlan(userId: string, tripPlanId: string): Promise<void> {
  try {
    const tripPlanRef = doc(db, 'users', userId, 'tripPlans', tripPlanId);
    await deleteDoc(tripPlanRef);
    await removeUserTripPlanId(userId, tripPlanId);
  } catch (error) {
    console.error('Error deleting trip plan:', error);
    throw new Error('Failed to delete trip plan');
  }
}

export async function duplicateTripPlan(userId: string, tripPlanId: string): Promise<string> {
  try {
    const originalPlan = await getTripPlanById(userId, tripPlanId);
    if (!originalPlan) throw new Error('Trip plan not found');
    
    const newPlan: Omit<SavedTripPlan, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
      ...originalPlan,
      title: `${originalPlan.title} (Copy)`,
      status: 'draft',
      sharing: { ...originalPlan.sharing, isPublic: false, shareToken: undefined },
      budget: { ...originalPlan.budget, actualSpent: undefined },
      dates: { ...originalPlan.dates, actualStart: undefined, actualEnd: undefined },
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

// ==================== HELPER FUNCTIONS ====================

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

// ==================== ITINERARY GENERATION ====================

export async function getPlacesForItinerary(destinationId: string, interests: string[]): Promise<Place[]> {
  try {
    const allPlaces = await getPlacesByDestination(destinationId, 100);
    
    if (!interests.length) return allPlaces.slice(0, 20);
    
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
      'spiritual': { types: ['religious'], categories: ['religious'] },
      'crafts': { types: ['market'], categories: ['shopping', 'cultural'] },
    };
    
    const filteredPlaces = allPlaces.filter(place => {
      return interests.some(interest => {
        const mapping = interestMapping[interest];
        if (!mapping) return false;
        const typeMatch = mapping.types.includes(place.type);
        const categoryMatch = mapping.categories.includes(place.category);
        return typeMatch || categoryMatch;
      });
    });
    
    return filteredPlaces
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 30);
  } catch (error) {
    console.error('Error fetching places for itinerary:', error);
    return [];
  }
}

export async function calculateDailySchedule(
  places: Place[],
  dailyHours: number,
  startTime: string = '09:00'
): Promise<ActivitySlot[]> {
  const activities: ActivitySlot[] = [];
  let currentTime = startTime;
  
  for (const place of places) {
    let durationMinutes = 120;
    
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
    
    const travelBuffer = activities.length > 0 ? 30 : 0;
    const startDateTime = new Date(`2000-01-01T${currentTime}`);
    startDateTime.setMinutes(startDateTime.getMinutes() + travelBuffer);
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);
    
    const formatTime = (date: Date) => date.toTimeString().slice(0, 5);
    
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
        bookingRequired: place.type === 'restaurant',
        difficulty: 'easy'
      }
    };
    
    activities.push(activity);
    currentTime = formatTime(endDateTime);
    
    const totalMinutes = activities.reduce((sum, act) => sum + act.duration, 0);
    if (totalMinutes / 60 > dailyHours) break;
  }
  
  return activities;
}

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

export async function generateCompleteItinerary(
  criteria: TripCriteria,
  selectedDestinations: Destination[],
  userPreferences?: User['preferences']
): Promise<TripPlan> {
  try {
    const destinationPlaces = await Promise.all(
      selectedDestinations.map(async (destination) => {
        const places = await getPlacesForItinerary(destination.id, criteria.interests);
        return { destination, places };
      })
    );
    
    const totalPlaces = destinationPlaces.reduce((sum, dp) => sum + dp.places.length, 0);
    const destinationDays = destinationPlaces.map(dp => ({
      destination: dp.destination,
      days: Math.max(1, Math.round((dp.places.length / totalPlaces) * criteria.duration))
    }));
    
    const dayPlans: DayPlan[] = [];
    let currentDay = 1;
    
    for (const { destination, days } of destinationDays) {
      const places = destinationPlaces.find(dp => dp.destination.id === destination.id)?.places || [];
      const placesPerDay = Math.ceil(places.length / days);
      
      for (let dayOffset = 0; dayOffset < days && currentDay <= criteria.duration; dayOffset++) {
        const dayPlaces = places.slice(dayOffset * placesPerDay, (dayOffset + 1) * placesPerDay);
        const dailyActivities = await calculateDailySchedule(
          dayPlaces,
          criteria.activityLevel === 'relaxed' ? 4 : criteria.activityLevel === 'balanced' ? 6 : 8
        );
        
        const dayPlan: DayPlan = {
          dayNumber: currentDay,
          date: new Date(new Date(criteria.startDate).setDate(new Date(criteria.startDate).getDate() + currentDay - 1)).toISOString().split('T')[0],
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
          transport: { local: [], totalTravelTime: 60, totalTravelCost: 0 },
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
    
    return {
      id: `plan_${Date.now()}`,
      title: `${criteria.interests[0] ? criteria.interests[0].charAt(0).toUpperCase() + criteria.interests[0].slice(1) : 'Moroccan'} Adventure - ${criteria.duration} Days`,
      summary: `Explore the beauty of Morocco with this ${criteria.duration}-day itinerary designed for ${criteria.travelers} traveler${criteria.travelers > 1 ? 's' : ''}.`,
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
      customizations: { excludedActivities: [], addedActivities: [], modifiedDays: [], userNotes: {}, userPhotos: {} },
      stats: calculateTripStats(dayPlans),
      exportFormats: { pdfReady: true, calendarReady: true, shareableLink: '' },
      isSaved: false,
      viewCount: 0
    };
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary');
  }
}
// ==================== SEARCH FUNCTIONS ====================

/**
 * Search destinations by name, description, or region
 * @param searchTerm - The search query string
 * @param limitCount - Maximum number of results to return (default: 20)
 * @returns Array of matching destinations
 */
export async function getDestinations(
  limitCount: number = 20,
  searchTerm?: string
): Promise<Destination[]> {
  try {
    const destinationsRef = collection(db, 'destinations');
    let q;
    
    if (searchTerm && searchTerm.trim().length > 0) {
      // For search with term, we fetch more and filter client-side
      // because Firestore doesn't support full-text search natively
      q = query(destinationsRef, limit(limitCount * 2));
      const snapshot = await getDocs(q);
      
      const searchLower = searchTerm.toLowerCase();
      const allDestinations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Destination));
      
      // Filter client-side for better search experience
      return allDestinations.filter(dest => {
        const nameEn = dest.name?.en?.toLowerCase() || '';
        const nameFr = dest.name?.fr?.toLowerCase() || '';
        const nameAr = dest.name?.ar?.toLowerCase() || '';
        const nameEs = dest.name?.es?.toLowerCase() || '';
        const descEn = dest.description?.en?.toLowerCase() || '';
        const region = dest.region?.toLowerCase() || '';
        
        return nameEn.includes(searchLower) ||
               nameFr.includes(searchLower) ||
               nameAr.includes(searchLower) ||
               nameEs.includes(searchLower) ||
               descEn.includes(searchLower) ||
               region.includes(searchLower);
      }).slice(0, limitCount);
    } else {
      // No search term, just return top destinations by ranking
      q = query(destinationsRef, orderBy('ranking', 'desc'), limit(limitCount));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Destination));
    }
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

/**
 * Search places across all destinations by name, description, type, or category
 * @param searchTerm - The search query string
 * @param destinationId - Optional destination ID to limit search scope
 * @param limitCount - Maximum number of results to return (default: 20)
 * @returns Array of matching places
 */
export async function searchPlaces(
  searchTerm: string,
  destinationId?: string,
  limitCount: number = 20
): Promise<Place[]> {
  try {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }
    
    const searchLower = searchTerm.toLowerCase();
    let allPlaces: Place[] = [];
    
    if (destinationId) {
      // Search within a specific destination
      const placesRef = collection(db, 'destinations', destinationId, 'places');
      const q = query(placesRef, limit(50));
      const snapshot = await getDocs(q);
      
      allPlaces = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Place));
    } else {
      // Search across all destinations using collection group
      const placesQuery = query(
        collectionGroup(db, 'places'),
        limit(100)
      );
      const snapshot = await getDocs(placesQuery);
      
      allPlaces = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Place));
    }
    
    // Filter places based on search term
    const filteredPlaces = allPlaces.filter(place => {
      const nameEn = place.name?.en?.toLowerCase() || '';
      const nameFr = place.name?.fr?.toLowerCase() || '';
      const nameAr = place.name?.ar?.toLowerCase() || '';
      const nameEs = place.name?.es?.toLowerCase() || '';
      const descEn = place.description?.en?.toLowerCase() || '';
      const type = place.type?.toLowerCase() || '';
      const category = place.category?.toLowerCase() || '';
      
      return nameEn.includes(searchLower) ||
             nameFr.includes(searchLower) ||
             nameAr.includes(searchLower) ||
             nameEs.includes(searchLower) ||
             descEn.includes(searchLower) ||
             type.includes(searchLower) ||
             category.includes(searchLower);
    });
    
    // Sort by rating (higher rating first) and limit results
    return filteredPlaces
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}

/**
 * Optimized search that returns both destinations and places in one call
 * @param searchTerm - The search query string
 * @param limitCount - Maximum number of results per type (default: 10)
 * @returns Combined search results with destinations and places
 */
export async function searchAll(
  searchTerm: string,
  limitCount: number = 10
): Promise<{ destinations: Destination[]; places: Place[] }> {
  try {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return { destinations: [], places: [] };
    }
    
    const [destinations, places] = await Promise.all([
      getDestinations(limitCount, searchTerm),
      searchPlaces(searchTerm, undefined, limitCount)
    ]);
    
    return { destinations, places };
  } catch (error) {
    console.error('Error in searchAll:', error);
    return { destinations: [], places: [] };
  }
}

// Get accommodation platforms from Firebase
export async function getAccommodationPlatforms(): Promise<any[]> {
  try {
    const platformsRef = collection(db, 'accommodation_platforms');
    const snapshot = await getDocs(platformsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching accommodation platforms:', error);
    return [];
  }
}

// Get transportation platforms from Firebase
export async function getTransportationPlatforms(): Promise<any[]> {
  try {
    const platformsRef = collection(db, 'transportation_platforms');
    const snapshot = await getDocs(platformsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching transportation platforms:', error);
    return [];
  }
}
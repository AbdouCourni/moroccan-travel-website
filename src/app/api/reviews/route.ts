// lib/reviews.ts
import { db } from '../../../../lib/firebase';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  Timestamp,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import type { Review, ReviewStats } from '../../../../types';

// Convert Firestore value → Date | undefined
function toDateOrUndefined(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

// Normalize DB → Review type
function asReview(id: string, data: DocumentData): Review {
  return {
    id,
    // ✅ placeId removed — use targetId only
    targetId: data.targetId, // still fill to keep your UI working until you update references

    userId: data.userId,
    targetType: 'place',
   // targetId: data.targetId,

    rating: Number(data.rating) || 0,
    title: data.title ?? '',
    content: data.content ?? '',
    images: Array.isArray(data.images) ? data.images : undefined,

    createdAt: toDateOrUndefined(data.createdAt),
    updatedAt: toDateOrUndefined(data.updatedAt),

    user: {
      name: data?.user?.name ?? 'Anonymous',
      avatar: data?.user?.avatar,
      country: data?.user?.country,
    },

    helpful: Number(data.helpful) || 0,
    reported: Boolean(data.reported) || false,
  };
}

// ✅ Get reviews for a *place*
export async function getPlaceReviews(placeId: string): Promise<Review[]> {
  const q = query(
    collection(db, 'reviews'),
    where('targetType', '==', 'place'),
    where('targetId', '==', placeId),
    orderBy('createdAt', 'desc')
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => asReview(d.id, d.data()));
}

// ✅ Stats
export async function getPlaceReviewStats(targetId: string): Promise<ReviewStats> {
  const list = await getPlaceReviews(targetId);
  const total = list.length;

  const ratings: ReviewStats['ratingDistribution'] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  for (const r of list) {
    // ensure rating is one of: 1 | 2 | 3 | 4 | 5
    const rating = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;

    ratings[rating] += 1; // ✅ no TS error now
    sum += rating;
  }

  return {
    averageRating: total ? +(sum / total).toFixed(2) : 0,
    totalReviews: total,
    ratingDistribution: ratings,
  };
}

// ✅ Write new review using targetId only
export async function addPlaceReview(input: {
  placeId: string; // still passed in from UI, we rename usage below
  userId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  user: { name: string; avatar?: string; country?: string };
}): Promise<string> {
  const now = serverTimestamp();

  const docRef = await addDoc(collection(db, 'reviews'), {
    targetType: 'place',
    targetId: input.placeId, // ✅ single source of truth

    userId: input.userId,
    rating: input.rating,
    title: input.title ?? '',
    content: input.content ?? '',
    images: input.images ?? [],

    user: input.user,

    helpful: 0,
    reported: false,

    createdAt: now,
    updatedAt: now,
  });

  return docRef.id;
}

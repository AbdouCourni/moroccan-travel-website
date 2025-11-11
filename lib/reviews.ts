// lib/reviews.ts
import { Review, ReviewStats } from '../types';
import { Timestamp } from 'firebase/firestore';

export function toReview(docId: string, data: any): Review {
  return {
    id: docId,
   // placeId: data.placeId,
    userId: data.userId,
    targetType: data.targetType,
    targetId: data.targetId,
    rating: data.rating,
    title: data.title,
    content: data.content,
    images: data.images ?? [],
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt ?? undefined,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt ?? undefined,
    user: {
      name: data.user?.name ?? 'Anonymous',
      avatar: data.user?.avatar,
      country: data.user?.country,
    },
    helpful: data.helpful ?? 0,
    reported: data.reported ?? false,
  };
}

export function computeStats(reviews: Review[]): ReviewStats {
  const total = reviews.length;
  const dist: ReviewStats['ratingDistribution'] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of reviews) {
    const clamped = Math.max(1, Math.min(5, Math.round(r.rating)));
    dist[clamped as keyof typeof dist] += 1;
    sum += r.rating;
  }
  return {
    totalReviews: total,
    averageRating: total ? Number((sum / total).toFixed(2)) : 0,
    ratingDistribution: dist,
  };
}

// components/PlaceReviews.tsx — client UI (keeps your design, +delete, +one-review-per-year guard)

'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Review, ReviewStats } from '../types';
import { Star, MessageCircle, Trash2 } from 'lucide-react';
import LoginForm from './Auth/LoginForm';
import { addReview, deleteReview } from '../lib/firebase-server';

interface Props {
  targetType: 'destination' | 'place';
  targetId: string;
  placeName: string;
  initialReviews?: Review[];
  reviewStats?: ReviewStats;
}

export default function PlaceReviews({
  targetType,
  targetId,
  placeName,
  initialReviews = [],
  reviewStats,
}: Props) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [currentReviewStats, setCurrentReviewStats] = useState<ReviewStats | undefined>(reviewStats);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setShowLoginForm(true);
      return;
    }
    if (!rating) return;

    setSubmitting(true);
    try {
      const newReviewBase: Omit<Review, 'id' | 'createdAt' | 'updatedAt'> = {
        targetType,
        targetId,
        userId: user.uid,
        rating,
        title,
        content,
        images: [],
        user: {
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || undefined,
        },
        helpful: 0,
        reported: false,
      };

      // Will throw if the user already reviewed within the past year
      const id = await addReview(newReviewBase);

      const now = new Date();
      const newReview: Review = {
        id,
        ...newReviewBase,
        createdAt: now,
        updatedAt: now,
      };

      setReviews((r) => [newReview, ...r]);

      // update local stats (no refetch)
      setCurrentReviewStats((prev) => {
        const base: ReviewStats = prev ?? {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
        const nextTotal = base.totalReviews + 1;
        const dist: ReviewStats['ratingDistribution'] = { ...base.ratingDistribution };
        const clamped = Math.max(1, Math.min(5, Math.round(rating))) as 1 | 2 | 3 | 4 | 5;
        dist[clamped] = (dist[clamped] + 1) as number;

        const sum = 1 * dist[1] + 2 * dist[2] + 3 * dist[3] + 4 * dist[4] + 5 * dist[5];
        return {
          averageRating: +(sum / nextTotal).toFixed(2),
          totalReviews: nextTotal,
          ratingDistribution: dist,
        };
      });

      setShowReviewForm(false);
      setTitle('');
      setContent('');
      setRating(0);
    } catch (err: any) {
      // show a friendly message for the "one per year" rule
      if (err?.code === 'ALREADY_REVIEWED_THIS_YEAR') {
        setError('You can post only one review for this place per year.');
      } else if (typeof err?.message === 'string') {
        setError(err.message);
      } else {
        setError('Failed to post your review. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (review: Review) => {
    if (!user) {
      setShowLoginForm(true);
      return;
    }
    if (review.userId !== user.uid) return;

    const ok = window.confirm('Delete this review?');
    if (!ok) return;

    try {
      await deleteReview(review.id);
      // remove locally
      setReviews((list) => list.filter((r) => r.id !== review.id));

      // update stats locally
      setCurrentReviewStats((prev) => {
        if (!prev) return prev;
        const clamped = Math.max(1, Math.min(5, Math.round(review.rating))) as 1 | 2 | 3 | 4 | 5;
        const nextDist: ReviewStats['ratingDistribution'] = { ...prev.ratingDistribution };
        nextDist[clamped] = Math.max(0, nextDist[clamped] - 1);
        const nextTotal = Math.max(0, prev.totalReviews - 1);
        const sum = 1 * nextDist[1] + 2 * nextDist[2] + 3 * nextDist[3] + 4 * nextDist[4] + 5 * nextDist[5];
        return {
          averageRating: nextTotal ? +(sum / nextTotal).toFixed(2) : 0,
          totalReviews: nextTotal,
          ratingDistribution: nextDist,
        };
      });
    } catch {
      setError('Could not delete review. If this keeps happening, refresh the page.');
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-amiri text-3xl font-bold text-gray-900">Reviews</h2>
            <p className="text-gray-600">
              Share your experience at <span className="font-semibold">{placeName}</span>
            </p>
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
          </div>

          {currentReviewStats && currentReviewStats.totalReviews > 0 ? (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">
                {currentReviewStats.averageRating.toFixed(1)}
              </span>
              <span className="text-gray-600">
                ({currentReviewStats.totalReviews} reviews)
              </span>
            </div>
          ) : null}
        </div>

        {!showReviewForm && (
          <button
            onClick={() => (user ? setShowReviewForm(true) : setShowLoginForm(true))}
            className="bg-yellow-600 hover:bg-green-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Write a review
          </button>
        )}

        {showLoginForm && !user && (
          <div className="mt-6">
            <LoginForm onSuccess={() => setShowLoginForm(false)} />
          </div>
        )}

        {showReviewForm && (
          <form onSubmit={onSubmit} className="mt-6 p-4 border rounded-xl space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      n <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full border rounded-lg px-3 py-2"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share details of your experience..."
              className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="bg-yellow-600 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
              >
                {submitting ? 'Posting…' : 'Post review'}
              </button>

              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to share your experience!</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {r.user?.avatar ? (
                      <img
                        src={r.user.avatar}
                        alt={r.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                    )}
                    <div>
                      <div className="font-semibold">{r.user?.name ?? 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${
                            n <= Math.round(r.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Delete (author only) */}
                    {user?.uid === r.userId && (
                      <button
                        title="Delete review"
                        onClick={() => onDelete(r)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>

                {r.title ? <h4 className="mt-3 font-semibold">{r.title}</h4> : null}
                <p className="mt-2 text-gray-700">{r.content}</p>

                {Array.isArray(r.images) && r.images.length > 0 && (
                  <div className="mt-3 flex gap-2">
                    {r.images.map((img, i) => (
                      <div key={i} className="w-20 h-20 rounded overflow-hidden bg-gray-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

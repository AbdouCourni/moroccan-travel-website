// components/ReviewBadge.tsx
'use client';

import { ReviewStats } from '../types';
import { Star } from 'lucide-react';

interface ReviewBadgeProps {
  stats: ReviewStats;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function ReviewBadge({ stats, size = 'sm', showCount = true }: ReviewBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const starSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };
  
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        <Star className={`w-${starSizes[size]} h-${starSizes[size]} fill-primary-gold text-primary-gold`} />
        <span className={`font-semibold text-gray-900 ${sizeClasses[size]}`}>
          {stats.averageRating.toFixed(1)}
        </span>
      </div>
      {showCount && (
        <span className={`text-gray-500 ${sizeClasses[size]}`}>
          ({stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}
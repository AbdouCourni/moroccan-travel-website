// components/FavoriteShareBar.tsx — client component: Save + Share + Stats display
'use client';

import { useEffect, useState } from 'react';
import { Heart, Share2, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isFavoritePlace, toggleFavoritePlace } from '../lib/favorites';
import type { ReviewStats } from '../types';

type Props = {
  placeId: string;
  stats?: ReviewStats | null;
  className?: string;
  placeUrl: string;       // canonical url for share/copy
};

export default function FavoriteShareBar({ placeId, stats, className, placeUrl }: Props) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [isFav, setIsFav] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) { setIsFav(false); return; }
      const fav = await isFavoritePlace(user.uid, placeId);
      if (mounted) setIsFav(fav);
    })();
    return () => { mounted = false; };
  }, [user, placeId]);

  const onToggleSave = async () => {
    if (!user) {
      // Surface your login UI however you prefer; simplest:
      alert('Please sign in to save places.');
      return;
    }
    setSaving(true);
    try {
      const next = await toggleFavoritePlace(user.uid, placeId);
      setIsFav(next);
    } finally {
      setSaving(false);
    }
  };

  const onShare = async () => {
    const data = { title: 'Check out this place', text: 'I found this on MoroCompase', url: placeUrl };
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share(data);
      } catch {/* user canceled */}
    } else {
      try {
        await navigator.clipboard.writeText(placeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // fallback
        prompt('Copy this link:', placeUrl);
      }
    }
  };

  return (
    <div className={`py-6 flex flex-wrap items-center justify-between gap-4 ${className ?? ''}`}>
      <div className="flex items-center gap-6">
        {stats && stats.totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-semibold text-gray-800">
              {stats.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600">({stats.totalReviews} reviews)</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 border hover:bg-gray-100 rounded-lg transition-colors ${
            isFav
              ? 'border-primary-gold text-gray-900'
              : 'border-gray-300 text-gray-700 hover:border-primary-gold hover:text-primary-gold'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          {isFav ? 'Saved' : 'Save'}
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 border hover:bg-gray-100 border-gray-300 text-gray-700 rounded-lg hover:border-primary-gold hover:text-primary-gold transition-colors"
        >
          <Share2 className="w-4 h-4" />
          {copied ? 'Link copied!' : 'Share'}
        </button>
      </div>
    </div>
  );
}

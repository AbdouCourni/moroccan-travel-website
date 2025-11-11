// components/FavoriteHeart.tsx
'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  placeId: string;
  initialIsFavorite?: boolean;   // default false; pass true if you're in a favorites list
  className?: string;
  size?: number;                 // icon size in px (default 18)
  onChange?: (isFavorite: boolean) => void;
};

export default function FavoriteHeart({
  placeId,
  initialIsFavorite = false,
  className,
  size = 18,
  onChange,
}: Props) {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState<boolean>(initialIsFavorite);
  const [busy, setBusy] = useState(false);

  // If you want it to self-detect initial state when not provided:
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user?.uid || initialIsFavorite) return;
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        const cur: string[] = (snap.data()?.favoritesPlaces ?? []) as string[];
        if (mounted) setIsFav(cur.includes(placeId));
      } catch {
        /* swallow */
      }
    })();
    return () => { mounted = false; };
  }, [user?.uid, placeId, initialIsFavorite]);

  const toggle = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!user?.uid || busy) return;

    setBusy(true);
    const ref = doc(db, 'users', user.uid);

    // ensure user doc exists without wiping other fields
    await setDoc(ref, { favoritesPlaces: [] }, { merge: true });

    const next = !isFav;
    // optimistic
    setIsFav(next);
    onChange?.(next);

    try {
      await updateDoc(ref, {
        favoritesPlaces: next ? arrayUnion(placeId) : arrayRemove(placeId),
      });
    } catch (err) {
      // revert on failure
      const revert = !next;
      setIsFav(revert);
      onChange?.(revert);
      console.error('FavoriteHeart toggle failed:', err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      onClick={toggle}
      disabled={busy}
      className={[
        'rounded-full p-2 bg-white/90 hover:bg-white transition-colors shadow-sm',
        isFav ? 'text-red-500' : 'text-gray-600',
        busy ? 'opacity-70 cursor-not-allowed' : '',
        className || '',
      ].join(' ')}
      title={isFav ? 'Unfavorite' : 'Favorite'}
    >
      <Heart
        className={isFav ? 'fill-current' : ''}
        style={{ width: size, height: size }}
      />
    </button>
  );
}

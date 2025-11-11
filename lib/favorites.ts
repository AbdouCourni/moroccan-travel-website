// lib/favorites.ts
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  documentId,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Place } from '../types';

type FavoriteRef =
  | string
  | { placeId: string; destinationId?: string };

/**
 * Reads the current user's favoritesPlaces field.
 * Supports:
 * - string[] of placeId
 * - { placeId, destinationId? }[]
 */
export async function getUserFavoriteRefs(userId: string): Promise<FavoriteRef[]> {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return [];
  const data = snap.data() as any;
  const raw = data?.favoritesPlaces ?? [];
  if (!Array.isArray(raw)) return [];
  return raw as FavoriteRef[];
}

/**
 * Fetch places by IDs under top-level /places (if you store them there),
 * chunked to respect Firestore "in" 10-limit.
 */
async function fetchTopLevelPlacesByIds(ids: string[]): Promise<Place[]> {
  const results: Place[] = [];
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));

  for (const c of chunks) {
    const qRef = query(
      collection(db, 'places'),
      where(documentId(), 'in', c)
    );
    const qs = await getDocs(qRef);
    qs.forEach((d) => results.push({ id: d.id, ...(d.data() as any) }));
  }
  return results;
}

/**
 * Fetch places by (destinationId, placeId) pairs under
 * /destinations/{destinationId}/places/{placeId}
 */
async function fetchNestedPlacesByPairs(
  pairs: { destinationId: string; placeId: string }[]
): Promise<Place[]> {
  const results: Place[] = [];
  // No "in" available across subcollections, so do direct getDoc per pair
  await Promise.all(
    pairs.map(async ({ destinationId, placeId }) => {
      const d = await getDoc(
        doc(db, 'destinations', destinationId, 'places', placeId)
      );
      if (d.exists()) results.push({ id: d.id, ...(d.data() as any) });
    })
  );
  return results;
}

/**
 * Returns the list of Place objects for the current user's favorites,
 * auto-detecting which schema you’re using.
 */
export async function getUserFavoritePlaces(userId: string): Promise<Place[]> {
  const refs = await getUserFavoriteRefs(userId);
  if (refs.length === 0) return [];

  const stringIds = refs.filter((r): r is string => typeof r === 'string');
  const objectRefs = refs.filter(
    (r): r is { placeId: string; destinationId?: string } =>
      typeof r === 'object' && r !== null
  );

  const nestedPairs = objectRefs.filter(
    (r) => r.destinationId && r.placeId
  ) as { destinationId: string; placeId: string }[];

  const [topLevel, nested] = await Promise.all([
    stringIds.length ? fetchTopLevelPlacesByIds(stringIds) : Promise.resolve([]),
    nestedPairs.length ? fetchNestedPlacesByPairs(nestedPairs) : Promise.resolve([]),
  ]);

  // Merge, prefer unique by id
  const byId = new Map<string, Place>();
  [...topLevel, ...nested].forEach((p) => byId.set(p.id, p));
  return Array.from(byId.values());
}



// // lib/favorites.ts — client helpers to toggle favorites
// // (kept separate to avoid bloating components)
// import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
// import { db } from './firebase';

// export async function ensureUserDoc(uid: string) {
//   const ref = doc(db, 'users', uid);
//   const snap = await getDoc(ref);
//   if (!snap.exists()) {
//     await setDoc(ref, { favoritesPlaces: [] });
//   }
//   return ref;
// }

// export async function toggleFavoritePlace(uid: string, placeId: string) {
//   const ref = await ensureUserDoc(uid);
//   const snap = await getDoc(ref);
//   const cur: string[] = (snap.data()?.favoritesPlaces ?? []) as string[];
//   const isFav = cur.includes(placeId);
//   await updateDoc(ref, {
//     favoritesPlaces: isFav ? arrayRemove(placeId) : arrayUnion(placeId),
//   });
//   return !isFav; // new state
// }

// export async function isFavoritePlace(uid: string, placeId: string) {
//   const ref = doc(db, 'users', uid);
//   const snap = await getDoc(ref);
//   const cur: string[] = (snap.data()?.favoritesPlaces ?? []) as string[];
//   return cur.includes(placeId);
// }



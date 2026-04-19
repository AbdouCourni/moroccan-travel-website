// lib/favorites.ts — client helpers to toggle favorites
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Place } from '../types';

/**
 * Ensure user document exists with favoritesPlaces array
 */
export async function ensureUserDoc(uid: string) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { favoritesPlaces: [] });
  }
  return ref;
}

/**
 * Toggle a place in user's favorites
 * @returns true if added, false if removed
 */
export async function toggleFavoritePlace(uid: string, placeId: string) {
  const ref = await ensureUserDoc(uid);
  const snap = await getDoc(ref);
  const cur: string[] = (snap.data()?.favoritesPlaces ?? []) as string[];
  const isFav = cur.includes(placeId);
  await updateDoc(ref, {
    favoritesPlaces: isFav ? arrayRemove(placeId) : arrayUnion(placeId),
  });
  return !isFav; // new state (true = added, false = removed)
}

/**
 * Check if a place is in user's favorites
 */
export async function isFavoritePlace(uid: string, placeId: string) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  const cur: string[] = (snap.data()?.favoritesPlaces ?? []) as string[];
  return cur.includes(placeId);
}

/**
 * Get all favorite place IDs for a user
 */
export async function getUserFavoriteIds(uid: string): Promise<string[]> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  return (snap.data()?.favoritesPlaces ?? []) as string[];
}

/**
 * Fetch full place objects for user's favorites
 * (Useful for displaying favorite places)
 */
export async function getUserFavoritePlaces(uid: string): Promise<Place[]> {
  const ids = await getUserFavoriteIds(uid);
  if (ids.length === 0) return [];
  
  // Fetch places from your places collection
  const { collection, query, where, getDocs, documentId } = await import('firebase/firestore');
  const placesRef = collection(db, 'places');
  
  const results: Place[] = [];
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += 10) {
    chunks.push(ids.slice(i, i + 10));
  }
  
  for (const chunk of chunks) {
    const q = query(placesRef, where(documentId(), 'in', chunk));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() } as Place);
    });
  }
  
  return results;
}
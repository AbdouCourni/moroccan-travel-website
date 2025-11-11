// lib/getFavoritePlaces.ts
import {
  doc, getDoc, collection, collectionGroup, query, where, getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Place } from '../types';

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}


export async function getFavoritePlacesForUser(userId: string): Promise<Place[]> {
  try {
    const userSnap = await getDoc(doc(db, 'users', userId));
    if (!userSnap.exists()) return [];

    const data = userSnap.data() as { favoritesPlaces?: string[] };
    const favSlugs = Array.isArray(data.favoritesPlaces) ? data.favoritesPlaces.filter(Boolean) : [];
    if (favSlugs.length === 0) return [];

    const results: Place[] = [];
    const found = new Set<string>();

    // Try top-level /places
    for (const b of chunk(favSlugs, 10)) {
      const qs = await getDocs(query(collection(db, 'places'), where('slug', 'in', b)));
      qs.forEach((d) => {
        const place = { id: d.id, ...(d.data() as any) } as Place;
        const slug = (place as any).slug as string | undefined;
        if (slug) {
          results.push(place);
          found.add(slug);
        }
      });
    }

    // Fallback: collectionGroup('places') under /destinations/*/places/*
    const remaining = favSlugs.filter((s) => !found.has(s));
    for (const b of chunk(remaining, 10)) {
      const qs = await getDocs(query(collectionGroup(db, 'places'), where('slug', 'in', b)));
      qs.forEach((d) => {
        results.push({ id: d.id, ...(d.data() as any) } as Place);
      });
    }

    // Preserve original order
    const bySlug = new Map<string, Place>();
    for (const p of results) {
      const slug = (p as any).slug as string | undefined;
      if (slug) bySlug.set(slug, p);
    }
    return favSlugs.map((s) => bySlug.get(s)).filter(Boolean) as Place[];
  } catch (err) {
    console.error('getFavoritePlacesForUser failed:', err);
    return [];
  }
}

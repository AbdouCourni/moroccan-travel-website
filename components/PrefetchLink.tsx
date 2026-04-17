// lib/prefetch.ts
import { getDestinationBySlug, getPlacesByDestination } from '../lib/firebase-server';

// Cache for prefetched data
const prefetchCache = new Map();

export async function prefetchDestinationPage(slug: string) {
  if (prefetchCache.has(slug)) {
    return prefetchCache.get(slug);
  }
  
  const promise = Promise.all([
    getDestinationBySlug(slug),
    getPlacesByDestination(slug, 6).catch(() => [])
  ]);
  
  prefetchCache.set(slug, promise);
  return promise;
}
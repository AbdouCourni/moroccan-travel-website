// lib/reviews-helpers.ts  (small helper if you want to reuse)
export function bumpDistribution(
  dist: { 1: number; 2: number; 3: number; 4: number; 5: number },
  rating: number
) {
  const key = Math.max(1, Math.min(5, Math.round(rating))) as 1 | 2 | 3 | 4 | 5;
  return { ...dist, [key]: dist[key] + 1 };
}

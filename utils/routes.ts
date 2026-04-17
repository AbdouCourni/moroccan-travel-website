// src/utils/routes.ts
export type AppRoute = 
  | '/'
  | '/destinations'
  | `/destinations/${string}`
  | '/stays'
  | '/transport'
  | '/culture'
  | '/ai-trip-planner'
  | `/destinations/${string}/places/${string}`
  // Add more routes as needed
  ;

export const createDestinationLink = (slug: string): AppRoute => 
  `/destinations/${slug}` as AppRoute;
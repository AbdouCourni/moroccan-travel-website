// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'traveler' | 'host' | 'admin';
  preferences: {
    language: 'en' | 'fr' | 'ar' | 'es';
    currency: 'USD' | 'EUR' | 'MAD';
  };
  createdAt: Date;
  phone?: string;
  emailVerified: boolean;
  dateOfBirth?: Date;
  location?: {
    country: string;
    city: string;
  };
  hostProfile?: {
    isVerified: boolean;
    description?: string;
    responseRate?: number;
    responseTime?: string;
  };
}
export interface Recipe {
  id: string;
  title: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  category: string;
  preparationTime: number; // in minutes
  cookingTime: number; // in minutes
  totalTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: {
    en: string[];
    fr: string[];
    ar: string[];
    es: string[];
  };
  instructions: {
    en: string[];
    fr: string[];
    ar: string[];
    es: string[];
  };
  image: string;
  tags: string[];
  origin: string;
  author?: string;
  rating?: number;
  
  // Nutritional Information
  nutrition: {
    calories: number; // total calories per serving
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
    fiber: number; // grams
    sugar: number; // grams
    sodium: number; // mg
  };
  
  // Dietary Restrictions
  restrictions: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
    halal: boolean;
    spicy: boolean;
  };
  
  // Additional Fields
  cuisineType: 'Moroccan' | 'North African' | 'Mediterranean';
  mealType: ('Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Snack')[];
  season: ('Spring' | 'Summer' | 'Fall' | 'Winter')[];
  
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Destination {
  id: string;
  slug: string;
  name: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  highlights: string[];
  bestSeason: string[];
  activities: string[];
  travelTips: string[];
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
  ranking : number;
}

// types/index.ts
export interface Place {
  id: string; // Keep this as the document ID
  slug: string; // Add this field
  name: MultiLanguageText;
  description: MultiLanguageText;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  type: 'natural' | 'museum' | 'restaurant' | 'market' | 'park' | 'beach' | 'historical' | 'religious' | 'viewpoint'; // Updated to match 'natural'
  category: 'scenic' | 'nature' | 'food' | 'shopping' | 'entertainment' | 'religious' | 'cultural'; // Updated to match 'scenic'
  openingHours?: {
    [key: string]: string;
  };
  entranceFee?: {
    local: number;
    tourist: number;
    currency: string;
  };
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  rating?: number;
  reviewCount?: number;
  duration: string;
  bestTimeToVisit: string[];
  tips: string[];
  accessibility: string[];
  createdAt: Date;
  updatedAt: Date;
}

// export interface Destination {
//   id: string;
//   slug: string;
//   name: MultiLanguageText;
//   description: MultiLanguageText;
//   region: string;
//   coordinates: {
//     lat: number;
//     lng: number;
//   };
//   images: string[];
//   highlights: string[];
//   bestSeason: string[];
//   activities: string[];
//   travelTips: string[];
//   climate?: {
//     averageTemp: string;
//     bestMonths: string[];
//     rainfall: string;
//   };
//   popularity?: number;
//   tags?: string[];
//   nearbyAttractions?: string[];
//   localCuisine?: string[];
//   metaDescription?: MultiLanguageText;
//   keywords?: string[];
//   // Places subcollection reference
//   placesCount?: number;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface Accommodation {
  id: string;
  name: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  type: 'riad' | 'hotel' | 'apartment' | 'villa' | 'desert_camp';
  city: string;
  hostId: string;
  price: {
    nightly: number;
    currency: string;
  };
  amenities: string[];
  images: string[];
  availability: {
    availableDates: string[];
    blockedDates: string[];
  };
  rating: number;
  reviewCount: number;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  createdAt: Date;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  checkInTime: string;
  checkOutTime: string;
  houseRules: string[];
  cancellationPolicy: 'flexible' | 'moderate' | 'strict';
  isVerified: boolean;
  safetyFeatures: string[];
}

export interface Review {
  id: string;
  userId: string;
  targetType: 'destination' | 'accommodation';
  targetId: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: Date;
  helpful: number;
  user: {
    name: string;
    avatar?: string;
    country: string;
  };
  aspectRatings?: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    value: number;
  };
}

export interface Booking {
  id: string;
  userId: string;
  accommodationId: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
}

export interface Transportation {
  id: string;
  type: 'train' | 'bus' | 'taxi' | 'car_rental' | 'flight';
  provider: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  schedule: Date[];
  amenities: string[];
  description?: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
}

export interface Activity {
  id: string;
  name: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
    es: string;
  };
  type: 'tour' | 'cooking_class' | 'desert_tour' | 'historical' | 'adventure' | 'cultural';
  duration: string;
  price: number;
  includes: string[];
  requirements: string[];
  images: string[];
  location: string;
  difficulty: 'easy' | 'moderate' | 'difficult';
  rating?: number;
  reviewCount?: number;
}

// Hook-specific interfaces
export interface UseDestinationsOptions {
  limit?: number;
  featuredOnly?: boolean;
  region?: string;
  searchTerm?: string;
}

export interface UseDestinationOptions {
  slug: string;
}

// Utility types for language handling
export type Language = 'en' | 'fr' | 'ar' | 'es';
export type Currency = 'USD' | 'EUR' | 'MAD';

// Common multi-language text interface
export interface MultiLanguageText {
  en: string;
  fr: string;
  ar: string;
  es: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
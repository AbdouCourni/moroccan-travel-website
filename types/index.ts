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
  updatedAt: Date;
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
   favoritesPlaces?: string[]; // place ids the user saved.
     savedTripPlanIds?: string[];
  tripPreferences?: {
    preferredRegions?: string[];
    commonInterests?: string[];
    usualBudget?: 'budget' | 'moderate' | 'luxury';
    usualTravelPace?: 'relaxed' | 'balanced' | 'active';
    usualAccommodationStyle?: 'traditional' | 'modern' | 'luxury' | 'budget';
    dietaryRestrictions?: string[];
    mobilityNeeds?: string[];
    lastTripCriteria?: TripCriteria; 
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
  createdAt: any;
  updatedAt: any;
  ranking : number;
  showOnMap: boolean;
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
export interface AuthContextType {
  user: User | null;
  signup: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  googleSignIn: () => Promise<any>;
  logout: () => Promise<void>;
  loading?: boolean; // Add loading if needed
}

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

// types/index.ts - Add these interfaces

export interface Review {
  id: string;
  //placeId: string;
  userId: string;
  targetType: 'destination' | 'place';
  targetId: string; // placeId in this case
  rating: number;
  title: string;
  content: string;
  images?: string[];
  createdAt?: Date; // Make optional
  updatedAt?: Date; // Make optional
  user: {
    name: string;
    avatar?: string;
    country?: string;
  };
  helpful: number;
  reported: boolean;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
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
export interface TripCriteria {
  // Basic Info
  duration: number;
  travelers: number;
  travelersAdults: number;
  travelersChildren: number;
  travelersInfants: number;
  
  // Dates
  startDate: string; // ISO string
  endDate: string;   // ISO string
  season: 'winter' | 'spring' | 'summer' | 'autumn' | 'any';
  
  // Budget
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  budgetPerPerson: number;
  totalBudget: number;
  currency: Currency;
  
  // Locations
  selectedRegion: string; // Region name (matches Destination.region)
  selectedDestinations: string[]; // Destination IDs
  preferredRegions: string[];
  
  // Interests & Activities
  interests: string[]; // Interest IDs from INTERESTS array
  activityLevel: 'relaxed' | 'balanced' | 'active';
  mustHaveActivities: string[];
  
  // Accommodation
  accommodationStyle: 'traditional' | 'modern' | 'luxury' | 'budget' | 'mix';
  accommodationTypes: ('hotel' | 'riad' | 'hostel' | 'villa' | 'camp')[];
  roomPreferences: {
    singleRooms: number;
    doubleRooms: number;
    suites: number;
  };
  
  // Food & Dining
  dietaryRestrictions: string[];
  mealPreferences: ('local' | 'international' | 'vegetarian' | 'halal' | 'fine-dining')[];
  cookingFacilities: boolean;
  
  // Transportation
  transportPreferences: ('private' | 'public' | 'rental' | 'mixed')[];
  intercityTransport: ('train' | 'bus' | 'flight' | 'car')[];
  mobilityNeeds: string[];
  
  // Special Requirements
  travelCompanion: 'solo' | 'couple' | 'family' | 'friends' | 'business';
  ageGroups: string[];
  specialOccasion: string;
  accessibilityNeeds: string[];
  languagePreferences: Language[];
  
  // Customization
  avoidCrowds: boolean;
  photographyFocused: boolean;
  shoppingFocus: boolean;
  nightlifeInterest: boolean;
  wellnessFocus: boolean;
  
  // Generation Settings
  itineraryStyle: 'structured' | 'flexible' | 'mixed';
  includeRestDays: boolean;
  maxDailyActivities: number;
  travelTimeBuffer: number;
}

export interface ActivitySlot {
  id: string;
  placeId?: string;
  placeName: string;
  placeType: Place['type'];
  placeCategory: Place['category'];
  description: string;
  duration: number; // in minutes
  startTime: string; // "09:00"
  endTime: string;   // "11:00"
  location: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    address?: string;
  };
  cost: {
    perPerson: number;
    total: number;
    currency: string;
    includes: string[];
  };
  practicalInfo: {
    bestTime: string;
    tips: string[];
    whatToBring: string[];
    bookingRequired: boolean;
    difficulty: 'easy' | 'moderate' | 'challenging';
  };
  travelToNext?: {
    mode: string;
    duration: number;
    distance: number;
    cost: number;
    notes: string;
  };
}

export interface MealPlan {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  suggestion: string;
  cuisine: string;
  budgetRange: string;
  dietaryOptions: string[];
  restaurantSuggestion?: {
    name: string;
    type: string;
    priceLevel: string;
    specialty: string;
  };
}

export interface AccommodationDay {
  name: string;
  type: string;
  location: string;
  checkIn: string;
  checkOut: string;
  costPerNight: number;
  amenities: string[];
  bookingStatus: 'not-booked' | 'pending' | 'confirmed';
  notes: string;
}

export interface DayPlan {
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  destination: {
    id: string;
    name: string;
    region: string;
  };
  
  // Schedule
  morning: ActivitySlot[];
  afternoon: ActivitySlot[];
  evening: ActivitySlot[];
  
  // Essentials
  meals: MealPlan[];
  accommodation: AccommodationDay;
  transport: {
    intercity?: ActivitySlot;
    local: ActivitySlot[];
    totalTravelTime: number;
    totalTravelCost: number;
  };
  
  // Logistics
  estimatedStartTime: string;
  estimatedEndTime: string;
  totalActivityHours: number;
  freeTime: number;
  
  // Costs
  dailyCost: {
    activities: number;
    food: number;
    transport: number;
    accommodation: number;
    misc: number;
    total: number;
  };
  
  // Practical Info
  weatherForecast?: {
    high: number;
    low: number;
    condition: string;
    precipitation: number;
  };
  packingTips: string[];
  importantNotes: string[];
  contingencyPlans: string[];
  
  // User Customization
  isCustomized: boolean;
  userNotes?: string;
  userRating?: number;
  photos?: string[];
}

export interface BudgetBreakdown {
  accommodation: {
    total: number;
    perNight: number;
    perPerson: number;
    breakdown: Array<{
      type: string;
      nights: number;
      cost: number;
    }>;
  };
  activities: {
    total: number;
    perPerson: number;
    perDay: number;
    breakdown: Array<{
      category: string;
      cost: number;
      count: number;
    }>;
  };
  food: {
    total: number;
    perPersonPerDay: number;
    breakdown: {
      breakfast: number;
      lunch: number;
      dinner: number;
      snacks: number;
    };
  };
  transport: {
    total: number;
    perPerson: number;
    breakdown: {
      flights: number;
      trains: number;
      buses: number;
      taxis: number;
      carRental: number;
      fuel: number;
    };
  };
  misc: {
    total: number;
    categories: {
      souvenirs: number;
      tips: number;
      entranceFees: number;
      guides: number;
      insurance: number;
      visa: number;
    };
  };
  summary: {
    totalCost: number;
    costPerPerson: number;
    costPerDay: number;
    costPerPersonPerDay: number;
    currency: string;
  };
}

export interface RecommendedPlace {
  placeId: string;
  destinationId: string;
  name: string;
  type: Place['type'];
  category: Place['category'];
  description: string;
  highlights: string[];
  image: string;
  rating: number;
  reviewCount: number;
  duration: string;
  bestTimeToVisit: string[];
  cost: {
    local: number;
    tourist: number;
    currency: string;
  };
  matchScore: number;
  whyRecommended: string;
}

export interface TravelTips {
  destinationSpecific: Array<{
    destination: string;
    tips: string[];
    warnings: string[];
    bestPractices: string[];
  }>;
  general: {
    packing: string[];
    etiquette: string[];
    safety: string[];
    money: string[];
    health: string[];
    communication: string[];
  };
  seasonal: {
    season: string;
    tips: string[];
    clothing: string[];
    activities: string[];
  };
}

export interface PackingList {
  clothing: Array<{
    category: string;
    items: string[];
    quantity: string;
    importance: 'essential' | 'recommended' | 'optional';
    notes: string;
  }>;
  electronics: Array<{
    item: string;
    quantity: string;
    importance: 'essential' | 'recommended' | 'optional';
  }>;
  documents: Array<{
    document: string;
    required: boolean;
    copiesNeeded: number;
    notes: string;
  }>;
  health: Array<{
    item: string;
    quantity: string;
    importance: 'essential' | 'recommended' | 'optional';
    notes: string;
  }>;
  miscellaneous: Array<{
    category: string;
    items: string[];
    importance: 'essential' | 'recommended' | 'optional';
  }>;
}

export interface TripPlan {
  // Basic Info
  id: string;
  title: string;
  summary: string;
  theme: string;
  coverImage?: string;
  
  // Metadata
  generatedAt: Date;
  version: number;
  generationId: string;
  language: Language;
  
  // Criteria used
  criteria: TripCriteria;
  
  // Timeline
  duration: number;
  dates: {
    start: string;
    end: string;
    season: string;
    bestMonths: string[];
  };
  
  // Itinerary
  dayPlans: DayPlan[];
  totalActivities: number;
  totalTravelHours: number;
  
  // Budget
  budget: BudgetBreakdown;
  
  // Destinations & Places
  destinations: Array<{
    id: string;
    name: string;
    slug: string;
    region: string;
    daysSpent: number;
    arrivalDay: number;
    departureDay: number;
  }>;
  
  recommendedPlaces: RecommendedPlace[];
  includedPlaceIds: string[];
  
  // Accommodation
  accommodations: Array<{
    destination: string;
    nights: number;
    type: string;
    estimatedCost: number;
    suggestions: string[];
  }>;
  
  // Transportation
  transportPlan: {
    intercity: Array<{
      from: string;
      to: string;
      mode: string;
      duration: number;
      estimatedCost: number;
      bookingTips: string[];
    }>;
    local: {
      primaryMode: string;
      estimatedDailyCost: number;
      tips: string[];
    };
  };
  
  // Practical Information
  travelTips: TravelTips;
  packingList: PackingList;
  emergencyInfo: {
    embassies: Array<{
      country: string;
      address: string;
      phone: string;
      emergencyPhone: string;
    }>;
    hospitals: Array<{
      name: string;
      location: string;
      phone: string;
      specialties: string[];
    }>;
    emergencyNumbers: string[];
  };
  
  // Local Insights
  localCustoms: Array<{
    category: string;
    dos: string[];
    donts: string[];
    tips: string[];
  }>;
  
  foodGuide: Array<{
    destination: string;
    mustTry: Array<{
      dish: string;
      description: string;
      bestPlace: string;
      priceRange: string;
    }>;
    dietaryOptions: Array<{
      restriction: string;
      availability: 'easy' | 'moderate' | 'difficult';
      suggestions: string[];
    }>;
  }>;
  
  // User Customization
  customizations: {
    excludedActivities: string[];
    addedActivities: ActivitySlot[];
    modifiedDays: number[];
    userNotes: Record<number, string>;
    userPhotos: Record<number, string[]>;
  };
  
  // Statistics
  stats: {
    totalWalkingDistance: number;
    averageDailyActivities: number;
    busiestDay: number;
    mostExpensiveDay: number;
    culturalScore: number;
    adventureScore: number;
    relaxationScore: number;
  };
  
  // Integration
  exportFormats: {
    pdfReady: boolean;
    calendarReady: boolean;
    shareableLink: string;
  };
  
  // Status
  isSaved: boolean;
  saveDate?: Date;
  lastViewed?: Date;
  viewCount: number;
}

export interface RegionInfo {
  id: string;
  name: string;
  color: string;
  description?: string;
  image?: string;
  popularDestinations?: string[];
}

export interface InterestOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
  matchesPlaceTypes?: Place['type'][];
  matchesPlaceCategories?: Place['category'][];
}

export interface BudgetLevel {
  id: 'budget' | 'moderate' | 'luxury';
  label: string;
  range: string;
  description: string;
  color: string;
  dailyPerPerson: {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
  };
}

export interface TravelPace {
  id: 'relaxed' | 'balanced' | 'active';
  label: string;
  description: string;
  icon: string;
  dailyHours: number;
  maxDailyActivities: number;
}

export interface AccommodationStyle {
  id: 'traditional' | 'modern' | 'luxury' | 'budget';
  label: string;
  icon: string;
  description: string;
  priceRange: string;
}

// ====================== FIREBASE RESPONSE TYPES ======================

export interface TripPlanResponse {
  success: boolean;
  data?: SavedTripPlan;
  error?: string;
}

export interface TripPlansListResponse {
  success: boolean;
  data: SavedTripPlan[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ItineraryGenerationRequest {
  criteria: TripCriteria;
  destinations: Destination[];
  places: Place[];
  userPreferences?: User['preferences'];
}

export interface ItineraryGenerationResponse {
  success: boolean;
  data?: TripPlan;
  warnings?: string[];
  suggestions?: string[];
  generationTime?: number;
}
export interface SavedTripPlan {
  id: string;
  userId: string;
  title: string;
  criteria: TripCriteria;
  generatedPlan: TripPlan;
  realReferences: {
    destinationIds: string[];
    placeIds: string[];
    placeDetails?: Place[];
  };
  status: 'draft' | 'planned' | 'in-progress' | 'completed' | 'favorite';
  dates: {
    start: Date;
    end: Date;
    actualStart?: Date;
    actualEnd?: Date;
  };
  budget: {
    estimated: number;
    actualSpent?: number;
    currency: string;
    breakdown?: {
      accommodations: number;
      activities: number;
      food: number;
      transport: number;
      shopping: number;
      misc: number;
    };
  };
  notes?: string;
  photos?: string[];
  rating?: number;
  sharing: {
    isPublic: boolean;
    shareToken?: string;
    sharedWith?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
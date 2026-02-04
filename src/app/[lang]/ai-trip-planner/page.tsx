// app/ai-trip-planner/page.tsx
'use client';

import { useState, useEffect, useCallback, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  MapPin, 
  DollarSign, 
  Heart, 
  Sparkles, 
  ChevronRight,
  Plane,
  Hotel,
  Utensils,
  Mountain,
  Sun,
  Moon,
  Clock,
  Filter,
  X,
  Loader2,
  Download,
  Share2,
  Bookmark,
  RefreshCw,
  CheckCircle,
  Navigation,
  Globe,
  Camera,
  Coffee,
  ShoppingBag,
  Palette,
  Save,
  Eye,
  Trash2,
  Edit2,
  Copy,
  Calendar as CalendarIcon,
  FileText,
  Map,
  Compass,
  Star,
  TrendingUp
} from 'lucide-react';

// Firebase imports
import {
  getDestinationsForAIPlanner,
  getDestinationById,
  getDestinationsByRegion,
  getPlacesByDestination,
  getPlacesForItinerary,
  saveTripPlanForUser,
  getUserTripPlans,
  getTripPlanById,
  updateTripPlan,
  deleteTripPlan,
  duplicateTripPlan,
  getDestinationsWithPlacesByRegion,
  generateCompleteItinerary
} from '../../../../lib/firebase-server';

// Helper functions
import {
  calculateDailyCost,
  getBestMonths,
  calculateBudgetBreakdown,
  generateRecommendedPlaces,
  generateAccommodations,
  generateTransportPlan,
  generateTravelTips,
  generatePackingList,
  generateEmergencyInfo,
  generateLocalCustoms,
  generateFoodGuide,
  calculateTripStats
} from '../../../../lib/trip-planner-helpers';

// Auth hook
import { useAuth } from '../../../../hooks/useAuth';

// Types
import type { 
  TripCriteria, 
  TripPlan, 
  SavedTripPlan, 
  Destination, 
  Place,
  User as UserType
} from '../../../../types';

// ====================== CONSTANTS ======================

const INTERESTS = [
  { id: 'cultural', label: 'Cultural Heritage', icon: '🏛️', placeTypes: ['museum', 'historical', 'religious'], placeCategories: ['cultural'] },
  { id: 'beaches', label: 'Beaches', icon: '🏖️', placeTypes: ['beach'], placeCategories: ['scenic', 'nature'] },
  { id: 'mountains', label: 'Mountains', icon: '⛰️', placeTypes: ['natural'], placeCategories: ['nature'] },
  { id: 'desert', label: 'Desert', icon: '🏜️', placeTypes: ['natural'], placeCategories: ['nature'] },
  { id: 'food', label: 'Food & Cuisine', icon: '🍲', placeTypes: ['restaurant'], placeCategories: ['food'] },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', placeTypes: ['market'], placeCategories: ['shopping'] },
  { id: 'adventure', label: 'Adventure', icon: '🧗', placeTypes: ['natural'], placeCategories: ['nature'] },
  { id: 'history', label: 'History', icon: '🏺', placeTypes: ['historical', 'museum'], placeCategories: ['cultural'] },
  { id: 'relaxation', label: 'Relaxation', icon: '🧘', placeTypes: ['park', 'beach'], placeCategories: ['scenic'] },
  { id: 'photography', label: 'Photography', icon: '📸', placeTypes: ['viewpoint', 'natural', 'historical'], placeCategories: ['scenic'] },
  { id: 'nature', label: 'Nature', icon: '🌿', placeTypes: ['natural', 'park'], placeCategories: ['nature', 'scenic'] },
  { id: 'nightlife', label: 'Nightlife', icon: '🌃', placeTypes: [], placeCategories: ['entertainment'] },
  { id: 'spiritual', label: 'Spiritual', icon: '🕌', placeTypes: ['religious'], placeCategories: ['religious'] },
  { id: 'crafts', label: 'Local Crafts', icon: '🧵', placeTypes: ['market'], placeCategories: ['shopping', 'cultural'] },
  { id: 'festivals', label: 'Festivals', icon: '🎉', placeTypes: [], placeCategories: ['entertainment', 'cultural'] }
];

const MOROCCO_REGIONS = [
  { 
    id: 'Tanger-Tetouan-Al Hoceima', 
    name: 'Tangier-Tetouan-Al Hoceima', 
    color: 'bg-yellow-100 text-yellow-800', 
    description: 'Northern coastal region with Mediterranean influence' 
  },
  { 
    id: 'Oriental Region', 
    name: 'Oriental', 
    color: 'bg-pink-100 text-pink-800', 
    description: 'Eastern region bordering Algeria' 
  },
  { 
    id: 'Fès-Meknès',  // Changed from 'fes-meknes' to match your database
    name: 'Fès-Meknès', 
    color: 'bg-purple-100 text-purple-800', 
    description: 'Imperial cities and cultural heartland' 
  },
  { 
    id: 'Rabat-Salé-Kenitra', 
    name: 'Rabat-Salé-Kénitra', 
    color: 'bg-green-100 text-green-800', 
    description: 'Capital region and administrative center' 
  },
  { 
    id: 'Casablanca-Settat', 
    name: 'Casablanca-Settat', 
    color: 'bg-blue-100 text-blue-800', 
    description: 'Economic capital and Atlantic coast' 
  },
  { 
    id: 'Béni Mellal-Khénifra', 
    name: 'Beni Mellal-Khénifra', 
    color: 'bg-orange-100 text-orange-800', 
    description: 'Atlas Mountains and agricultural region' 
  },
  { 
    id: 'Draa-Tafilalet', 
    name: 'Drâa-Tafilalet', 
    color: 'bg-indigo-100 text-indigo-800', 
    description: 'Desert region and gateway to Sahara' 
  },
  { 
    id: 'Marrakech-Safi',  // Changed from 'marrakech-safi' to match your database
    name: 'Marrakech-Safi', 
    color: 'bg-red-100 text-red-800', 
    description: 'Tourist hub with vibrant markets and palaces' 
  },
  { 
    id: 'Souss–Massa', 
    name: 'Souss-Massa', 
    color: 'bg-teal-100 text-teal-800', 
    description: 'Southern region with Argan trees and beaches' 
  },
  { 
    id: 'Guelmim–Oued Noun', 
    name: 'Guelmim-Oued Noun', 
    color: 'bg-cyan-100 text-cyan-800', 
    description: 'Desert region and nomadic culture' 
  },
  { 
    id: 'Laâyoune–Sakia El Hamra', 
    name: 'Laâyoune-Sakia El Hamra', 
    color: 'bg-lime-100 text-lime-800', 
    description: 'Western Sahara region' 
  },
  { 
    id: 'Dakhla–Oued Ed-Dahab', 
    name: 'Dakhla-Oued Ed-Dahab', 
    color: 'bg-violet-100 text-violet-800', 
    description: 'Southern coastal region for water sports' 
  }
];

const ACCOMMODATION_STYLES = [
  { id: 'traditional', label: 'Traditional Riads', icon: '🏛️', description: 'Authentic Moroccan houses with courtyards', priceRange: '$80-150/night' },
  { id: 'modern', label: 'Modern Hotels', icon: '🏨', description: 'Contemporary accommodations with amenities', priceRange: '$100-250/night' },
  { id: 'luxury', label: 'Luxury Resorts', icon: '⭐', description: 'High-end resorts with premium services', priceRange: '$200-500/night' },
  { id: 'budget', label: 'Budget Hostels', icon: '💰', description: 'Affordable shared accommodations', priceRange: '$20-50/night' }
];

const BUDGET_LEVELS = [
  { 
    id: 'budget', 
    label: 'Budget ($)', 
    range: 'Under $50/day/person',
    description: 'Hostels, street food, public transport',
    color: 'bg-green-100 text-green-800',
    dailyPerPerson: {
      accommodation: 20,
      food: 15,
      activities: 10,
      transport: 5
    }
  },
  { 
    id: 'moderate', 
    label: 'Moderate ($$)', 
    range: '$50-$150/day/person',
    description: 'Mid-range hotels, mix of dining options',
    color: 'bg-blue-100 text-blue-800',
    dailyPerPerson: {
      accommodation: 70,
      food: 40,
      activities: 25,
      transport: 15
    }
  },
  { 
    id: 'luxury', 
    label: 'Luxury ($$$)', 
    range: '$150+/day/person',
    description: 'Luxury hotels, fine dining, private tours',
    color: 'bg-purple-100 text-purple-800',
    dailyPerPerson: {
      accommodation: 150,
      food: 80,
      activities: 50,
      transport: 30
    }
  }
];

const TRAVEL_PACE = [
  { 
    id: 'relaxed', 
    label: 'Relaxed', 
    description: '1-2 activities per day, lots of downtime',
    icon: '🌅',
    dailyHours: 4,
    maxDailyActivities: 2
  },
  { 
    id: 'balanced', 
    label: 'Balanced', 
    description: '2-3 activities per day, some free time',
    icon: '⚖️',
    dailyHours: 6,
    maxDailyActivities: 3
  },
  { 
    id: 'active', 
    label: 'Active', 
    description: '3-4+ activities per day, packed schedule',
    icon: '⚡',
    dailyHours: 8,
    maxDailyActivities: 4
  }
];

// ====================== MAIN COMPONENT ======================

export default function AITripPlannerPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  // State
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedTripPlan[]>([]);
  const [isLoadingSavedPlans, setIsLoadingSavedPlans] = useState(false);
  
  // Data state
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<Destination[]>([]);
  const [destinationsWithPlaces, setDestinationsWithPlaces] = useState<Array<Destination & { places: Place[] }>>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Criteria state
  const [criteria, setCriteria] = useState<TripCriteria>({
    // Basic Info
    duration: 7,
    travelers: 2,
    travelersAdults: 2,
    travelersChildren: 0,
    travelersInfants: 0,
    
    // Dates (default to 2 weeks from now)
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: '',
    season: 'any',
    
    // Budget
    budgetLevel: 'moderate',
    budgetPerPerson: 100,
    totalBudget: 200,
    currency: 'USD',
    
    // Locations
    selectedRegion: '',
    selectedDestinations: [],
    preferredRegions: [],
    
    // Interests & Activities
    interests: ['cultural', 'food'],
    activityLevel: 'balanced',
    mustHaveActivities: [],
    
    // Accommodation
    accommodationStyle: 'traditional',
    accommodationTypes: ['riad'],
    roomPreferences: {
      singleRooms: 0,
      doubleRooms: 1,
      suites: 0
    },
    
    // Food & Dining
    dietaryRestrictions: [],
    mealPreferences: ['local'],
    cookingFacilities: false,
    
    // Transportation
    transportPreferences: ['mixed'],
    intercityTransport: ['train', 'bus'],
    mobilityNeeds: [],
    
    // Special Requirements
    travelCompanion: 'couple',
    ageGroups: ['adults'],
    specialOccasion: '',
    accessibilityNeeds: [],
    languagePreferences: ['en'],
    
    // Customization
    avoidCrowds: false,
    photographyFocused: false,
    shoppingFocus: false,
    nightlifeInterest: false,
    wellnessFocus: false,
    
    // Generation Settings
    itineraryStyle: 'flexible',
    includeRestDays: true,
    maxDailyActivities: 3,
    travelTimeBuffer: 20
  });

  // Auto-set end date based on duration
  useEffect(() => {
    if (criteria.startDate) {
      const start = new Date(criteria.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + criteria.duration);
      setCriteria(prev => ({
        ...prev,
        endDate: end.toISOString().split('T')[0],
        season: getSeasonFromDate(start)
      }));
    }
  }, [criteria.startDate, criteria.duration]);

  // Load user's saved trip plans
  useEffect(() => {
    if (user && !authLoading) {
      loadUserTripPlans();
    }
  }, [user, authLoading]);

  // Load destinations for selected region
  useEffect(() => {
    if (criteria.selectedRegion) {
      loadDestinationsForRegion();
    }
  }, [criteria.selectedRegion]);

  // Helper function to get season from date
  const getSeasonFromDate = (date: Date): TripCriteria['season'] => {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };

  // Load destinations for selected region
 // Update the loadDestinationsForRegion function to use your existing function directly:

const loadDestinationsForRegion = async () => {
  setIsLoadingData(true);
  try {
    console.log(`Loading destinations for region: "${criteria.selectedRegion}"`);
    // Get the region info from MOROCCO_REGIONS
    const regionInfo = MOROCCO_REGIONS.find(r => r.id === criteria.selectedRegion);
    if (!regionInfo) {
      console.log(`Region not found: ${criteria.selectedRegion}`);
      setDestinations([]);
      setDestinationsWithPlaces([]);
      setIsLoadingData(false);
      return;
    }
    
    console.log(`Fetching destinations for region: "${regionInfo.id}"`);
    
    // Use your existing function - it will do exact match with 'region' field
    const regionDestinations = await getDestinationsByRegion(regionInfo.id);
    
    console.log(`Found ${regionDestinations.length} destinations for region: "${regionInfo.id}"`);
    
    // If no results, the region name in MOROCCO_REGIONS doesn't match the database
    if (regionDestinations.length === 0) {
      console.log(`No destinations found. Check if region name "${regionInfo.id}" matches database.`);
      
      // Optional: Try to find what region names actually exist
      const allDestinations = await getDestinationsForAIPlanner();
      const uniqueRegions = [...new Set(allDestinations.map(d => d.region).filter(Boolean))];
      console.log('Available regions in database:', uniqueRegions);
    }
    
    // Get places for each destination
    const destinationsWithPlaces = await Promise.all(
      regionDestinations.map(async (destination) => {
        try {
          const places = await getPlacesByDestination(destination.id, 10);
          return {
            ...destination,
            places: places || []
          };
        } catch (error) {
          console.error(`Error fetching places for ${destination.name.en}:`, error);
          return {
            ...destination,
            places: []
          };
        }
      })
    );
    
    setDestinationsWithPlaces(destinationsWithPlaces);
    setDestinations(regionDestinations);
    
  } catch (error) {
    console.error('Error loading destinations:', error);
    setDestinations([]);
    setDestinationsWithPlaces([]);
  } finally {
    setIsLoadingData(false);
  }
};

  // Load user's saved trip plans
  const loadUserTripPlans = async () => {
    if (!user) return;
    
    setIsLoadingSavedPlans(true);
    try {
      const plans = await getUserTripPlans(user.uid);
      setSavedPlans(plans);
    } catch (error) {
      console.error('Error loading saved trip plans:', error);
    } finally {
      setIsLoadingSavedPlans(false);
    }
  };

  // Handle interest toggle
  const handleInterestToggle = (interestId: string) => {
    setCriteria(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId].slice(0, 5) // Limit to 5 interests
    }));
  };

  // Handle destination selection
  const handleDestinationToggle = (destinationId: string) => {
    const destination = destinations.find(d => d.id === destinationId);
    if (!destination) return;

    setSelectedDestinations(prev => {
      const isSelected = prev.some(d => d.id === destinationId);
      if (isSelected) {
        return prev.filter(d => d.id !== destinationId);
      } else {
        return [...prev, destination];
      }
    });

    setCriteria(prev => ({
      ...prev,
      selectedDestinations: selectedDestinations.some(d => d.id === destinationId)
        ? prev.selectedDestinations.filter(id => id !== destinationId)
        : [...prev.selectedDestinations, destinationId]
    }));
  };

  // Generate trip plan
  const generateTripPlanHandler = async () => {
    if (selectedDestinations.length === 0) {
      alert('Please select at least one destination');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate itinerary using real data
      const generatedPlan = await generateCompleteItinerary(
        criteria,
        selectedDestinations,
        user ? { language: 'en', currency: 'USD' } : undefined
      );
      
      setTripPlan(generatedPlan);
      setStep(6); // Go to results step
    } catch (error) {
      console.error('Error generating trip plan:', error);
      alert('Failed to generate trip plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save trip plan
 const saveTripPlanHandler = async () => {
  if (!user) {
    alert('Please log in to save trip plans');
    router.push('/login?redirect=/ai-trip-planner');
    return;
  }

  if (!tripPlan) {
    alert('No trip plan to save');
    return;
  }

  try {
    const savedPlan: Omit<SavedTripPlan, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
      userId: user.uid,
      title: tripPlan.title || 'Morocco Trip Plan',
      criteria,
      generatedPlan: tripPlan,
      realReferences: {
        destinationIds: selectedDestinations.map(d => d.id),
        placeIds: tripPlan.includedPlaceIds || [],
        placeDetails: [] // Could fetch place details here
      },
      status: 'planned',
      dates: {
        start: new Date(criteria.startDate),
        end: new Date(criteria.endDate),
        actualStart: undefined,
        actualEnd: undefined
      },
      budget: {
        estimated: tripPlan.budget?.summary?.totalCost || 0,
        currency: criteria.currency || 'USD',
        breakdown: {
          accommodations: tripPlan.budget?.accommodation?.total || 0,
          activities: tripPlan.budget?.activities?.total || 0,
          food: tripPlan.budget?.food?.total || 0,
          transport: tripPlan.budget?.transport?.total || 0,
          shopping: tripPlan.budget?.misc?.categories?.souvenirs || 0,
          misc: (tripPlan.budget?.misc?.total || 0) - (tripPlan.budget?.misc?.categories?.souvenirs || 0)
        },
        actualSpent: 0
      },
      notes: '',
      photos: [],
      rating: 0, // ← FIX: Make sure rating is always a number, not undefined
      sharing: {
        isPublic: false,
        shareToken: '',
        sharedWith: []
      }
    };

    console.log('Attempting to save trip plan:', savedPlan);
    const tripPlanId = await saveTripPlanForUser(user.uid, savedPlan);
    console.log('Trip plan saved with ID:', tripPlanId);
    
    alert('Trip plan saved successfully!');
    
    // Reload saved plans
    loadUserTripPlans();
  } catch (error) {
    console.error('Error saving trip plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    alert(`Failed to save trip plan: ${errorMessage}`);
  }
};

  // Delete saved trip plan
  const deleteTripPlanHandler = async (tripPlanId: string) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this trip plan?')) return;
    
    try {
      await deleteTripPlan(user.uid, tripPlanId);
      setSavedPlans(prev => prev.filter(plan => plan.id !== tripPlanId));
      alert('Trip plan deleted successfully');
    } catch (error) {
      console.error('Error deleting trip plan:', error);
      alert('Failed to delete trip plan');
    }
  };

  // Load saved trip plan
  const loadSavedTripPlan = async (tripPlanId: string) => {
    if (!user) return;
    
    try {
      const savedPlan = await getTripPlanById(user.uid, tripPlanId);
      if (savedPlan) {
        setTripPlan(savedPlan.generatedPlan);
        setCriteria(savedPlan.criteria);
        setStep(6);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error loading trip plan:', error);
      alert('Failed to load trip plan');
    }
  };

  // Export as PDF (mock function)
  const exportAsPDF = () => {
    alert('PDF export feature will be implemented soon!');
    // In a real app, this would generate and download a PDF
  };

  // Share trip plan
  const shareTripPlan = () => {
    if (navigator.share) {
      navigator.share({
        title: tripPlan?.title || 'Morocco Trip Plan',
        text: 'Check out this amazing AI-generated trip plan for Morocco!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Navigation
  const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Reset form
  const resetForm = () => {
    setCriteria({
      duration: 7,
      travelers: 2,
      travelersAdults: 2,
      travelersChildren: 0,
      travelersInfants: 0,
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: '',
      season: 'any',
      budgetLevel: 'moderate',
      budgetPerPerson: 100,
      totalBudget: 200,
      currency: 'USD',
      selectedRegion: 'marrakech-safi',
      selectedDestinations: [],
      preferredRegions: ['marrakech-safi', 'fes-meknes'],
      interests: ['cultural', 'food'],
      activityLevel: 'balanced',
      mustHaveActivities: [],
      accommodationStyle: 'traditional',
      accommodationTypes: ['riad'],
      roomPreferences: { singleRooms: 0, doubleRooms: 1, suites: 0 },
      dietaryRestrictions: [],
      mealPreferences: ['local'],
      cookingFacilities: false,
      transportPreferences: ['mixed'],
      intercityTransport: ['train', 'bus'],
      mobilityNeeds: [],
      travelCompanion: 'couple',
      ageGroups: ['adults'],
      specialOccasion: '',
      accessibilityNeeds: [],
      languagePreferences: ['en'],
      avoidCrowds: false,
      photographyFocused: false,
      shoppingFocus: false,
      nightlifeInterest: false,
      wellnessFocus: false,
      itineraryStyle: 'flexible',
      includeRestDays: true,
      maxDailyActivities: 3,
      travelTimeBuffer: 20
    });
    setSelectedDestinations([]);
    setTripPlan(null);
    setStep(1);
  };

  // ====================== STEP RENDERERS ======================

  const renderStep = () => {
    switch(step) {
      case 1: // Select Region
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary-gold" />
                Select Your Region
              </h3>
              <p className="text-gray-600 mb-8">
                Choose a region to explore destinations in Morocco. Each region has unique attractions and culture.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOROCCO_REGIONS.map(region => (
                  <button
                    key={region.id}
                    onClick={() => {
                        console.log('Selected region ID:', region.id);
                        setCriteria(prev => ({ ...prev, selectedRegion: region.id }))}
                }
                    className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                      criteria.selectedRegion === region.id
                        ? 'border-primary-gold bg-primary-gold/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block ${region.color}`}>
                      {region.name.split('-')[0]}
                    </div>
                    <h4 className="font-semibold text-black mb-2">{region.name}</h4>
                    <p className="text-sm text-gray-600">{region.description}</p>
                    {criteria.selectedRegion === region.id && (
                      <div className="flex items-center gap-2 mt-4 text-primary-gold">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2: // Select Destinations
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <Compass className="w-6 h-6 text-primary-gold" />
                Choose Destinations
              </h3>
              <p className="text-gray-600 mb-8">
                Select destinations within {MOROCCO_REGIONS.find(r => r.id === criteria.selectedRegion)?.name}. 
                You can choose multiple destinations.
              </p>
              
              {isLoadingData ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-gold mb-4" />
                  <p className="text-gray-600">Loading destinations...</p>
                </div>
              ) : destinations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No destinations found for this region.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinations.map(destination => {
                    const isSelected = selectedDestinations.some(d => d.id === destination.id);
                    const placesCount = destinationsWithPlaces.find(d => d.id === destination.id)?.places.length || 0;
                    
                    return (
                      <button
                        key={destination.id}
                        onClick={() => handleDestinationToggle(destination.id)}
                        className={`rounded-xl border-2 overflow-hidden text-left transition-all hover:shadow-lg ${
                          isSelected
                            ? 'border-primary-gold ring-2 ring-primary-gold/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {destination.images?.[0] && (
                          <div className="h-48 overflow-hidden">
                            <img 
                              src={destination.images[0]} 
                              alt={destination.name.en}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-black text-lg">{destination.name.en}</h4>
                            {isSelected && <CheckCircle className="w-5 h-5 text-primary-gold flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {destination.description.en.substring(0, 100)}...
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              <span>{destination.region}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>{destination.ranking || 'N/A'}/5</span>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {placesCount} places
                            </div>
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {destination.activities?.length || 0} activities
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              
              {selectedDestinations.length > 0 && (
                <div className="mt-8 p-6 bg-primary-gold/5 rounded-xl border border-primary-gold/20">
                  <h4 className="font-semibold text-black mb-4">Selected Destinations ({selectedDestinations.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDestinations.map(dest => (
                      <div key={dest.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border">
                        <span className="font-medium">{dest.name.en}</span>
                        <button
                          onClick={() => handleDestinationToggle(dest.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Select Interests
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <Heart className="w-6 h-6 text-primary-gold" />
                What Interests You?
              </h3>
              <p className="text-gray-600 mb-8">
                Select up to 5 interests. We'll match them with activities and places in your chosen destinations.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {INTERESTS.map(interest => {
                  const isSelected = criteria.interests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'border-primary-gold bg-primary-gold/10'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      } ${criteria.interests.length >= 5 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={criteria.interests.length >= 5 && !isSelected}
                    >
                      <span className="text-3xl mb-3">{interest.icon}</span>
                      <span className="text-sm font-medium text-center mb-2">{interest.label}</span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-primary-gold mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>
              
              {criteria.interests.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold text-black mb-4">Selected Interests ({criteria.interests.length}/5)</h4>
                  <div className="flex flex-wrap gap-2">
                    {criteria.interests.map(interestId => {
                      const interest = INTERESTS.find(i => i.id === interestId);
                      return interest ? (
                        <div key={interest.id} className="flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-3 py-2 rounded-lg">
                          <span>{interest.icon}</span>
                          <span className="font-medium">{interest.label}</span>
                          <button
                            onClick={() => handleInterestToggle(interest.id)}
                            className="text-primary-gold/70 hover:text-primary-gold"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Set Preferences
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary-gold" />
                Trip Details & Preferences
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-4">Duration & Travelers</label>
                    <div className="space-y-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Trip Duration (days)</div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setCriteria(prev => ({ ...prev, duration: Math.max(3, prev.duration - 1) }))}
                            className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 text-xl"
                          >
                            -
                          </button>
                          <div className="flex-1 text-center">
                            <div className="text-5xl font-bold text-primary-gold">{criteria.duration}</div>
                            <div className="text-gray-600 mt-1">days</div>
                          </div>
                          <button 
                            onClick={() => setCriteria(prev => ({ ...prev, duration: Math.min(30, prev.duration + 1) }))}
                            className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 text-xl"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Number of Travelers</div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setCriteria(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
                            className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 text-xl"
                          >
                            -
                          </button>
                          <div className="flex-1 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <Users className="w-8 h-8 text-primary-gold" />
                              <div className="text-5xl font-bold text-black">{criteria.travelers}</div>
                            </div>
                            <div className="text-gray-600 mt-1">traveler{criteria.travelers > 1 ? 's' : ''}</div>
                          </div>
                          <button 
                            onClick={() => setCriteria(prev => ({ ...prev, travelers: Math.min(10, prev.travelers + 1) }))}
                            className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 text-xl"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-4">Travel Dates</label>
                    <div className="grid gap-3">
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Start Date</div>
                        <input
                          type="date"
                          value={criteria.startDate}
                          onChange={(e) => setCriteria(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-2">End Date</div>
                        <input
                          type="date"
                          value={criteria.endDate}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-4">Travel Pace</label>
                    <div className="space-y-3">
                      {TRAVEL_PACE.map(pace => (
                        <button
                          key={pace.id}
                          onClick={() => setCriteria(prev => ({ ...prev, activityLevel: pace.id as 'relaxed' | 'balanced' | 'active' }))}
                          className={`w-full p-4 rounded-xl border-2 flex items-start gap-4 text-left transition-all ${
                            criteria.activityLevel === pace.id
                              ? 'border-primary-gold bg-primary-gold/5'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-2xl">{pace.icon}</span>
                          <div>
                            <div className="font-semibold text-black">{pace.label}</div>
                            <div className="text-sm text-gray-600 mt-1">{pace.description}</div>
                            <div className="text-xs text-gray-500 mt-2">~{pace.dailyHours} hours of activities/day</div>
                          </div>
                          {criteria.activityLevel === pace.id && (
                            <CheckCircle className="w-5 h-5 text-primary-gold ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-4">Accommodation Style</label>
                    <div className="grid grid-cols-2 gap-4">
                      {ACCOMMODATION_STYLES.map(style => (
                        <button
                          key={style.id}
                          onClick={() => setCriteria(prev => ({ ...prev, accommodationStyle: style.id as typeof prev.accommodationStyle }))}
                          className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                            criteria.accommodationStyle === style.id
                              ? 'border-primary-gold bg-primary-gold/5'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-3xl mb-2">{style.icon}</span>
                          <div className="text-center">
                            <div className="font-semibold text-black text-sm">{style.label}</div>
                            <div className="text-xs text-gray-600 mt-1">{style.priceRange}</div>
                          </div>
                          {criteria.accommodationStyle === style.id && (
                            <CheckCircle className="w-4 h-4 text-primary-gold mt-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Set Budget
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-primary-gold" />
                Budget & Special Requirements
              </h3>
              
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-4">Budget Level</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {BUDGET_LEVELS.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setCriteria(prev => ({ 
                        ...prev, 
                        budgetLevel: level.id as 'budget' | 'moderate' | 'luxury',
                        budgetPerPerson: level.dailyPerPerson.accommodation + level.dailyPerPerson.food + level.dailyPerPerson.activities + level.dailyPerPerson.transport
                      }))}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        criteria.budgetLevel === level.id
                          ? 'border-primary-gold bg-primary-gold/5'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${level.color}`}>
                          {level.label}
                        </div>
                        <DollarSign className={`w-6 h-6 ${
                          criteria.budgetLevel === level.id ? 'text-primary-gold' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="text-xl font-bold text-black mb-2">{level.range}</div>
                      <div className="text-sm text-gray-600">{level.description}</div>
                      {criteria.budgetLevel === level.id && (
                        <CheckCircle className="w-5 h-5 text-primary-gold mt-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-4">Special Requirements (Optional)</label>
                <div className="space-y-4">
                  <textarea
                    placeholder="Any dietary restrictions, accessibility needs, or special requests?"
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                    value={criteria.dietaryRestrictions.join(', ')}
                    onChange={(e) => setCriteria(prev => ({ 
                      ...prev, 
                      dietaryRestrictions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }))}
                  />
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Examples:</span>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Vegetarian</span>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Wheelchair accessible</span>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">Family-friendly</span>
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">No pork</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Generate & Results
        return tripPlan ? (
          <TripPlanViewer 
            tripPlan={tripPlan}
            criteria={criteria}
            onSave={saveTripPlanHandler}
            onExport={exportAsPDF}
            onShare={shareTripPlan}
            onReset={resetForm}
            user={user as UserType | null | undefined}
          />
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-gold to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Ready to Generate Your Trip!</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Based on your preferences, our AI will create a personalized {criteria.duration}-day Moroccan adventure for {criteria.travelers} traveler{criteria.travelers > 1 ? 's' : ''}.
              </p>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
                <h4 className="font-semibold text-black mb-6 text-lg">Your Preferences Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-gold">{criteria.duration}</div>
                    <div className="text-sm text-gray-600">Days</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-gold">{criteria.travelers}</div>
                    <div className="text-sm text-gray-600">Travelers</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-gold">{criteria.interests.length}</div>
                    <div className="text-sm text-gray-600">Interests</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-gold">
                      {BUDGET_LEVELS.find(b => b.id === criteria.budgetLevel)?.label}
                    </div>
                    <div className="text-sm text-gray-600">Budget</div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {criteria.interests.map(interestId => {
                      const interest = INTERESTS.find(i => i.id === interestId);
                      return interest && (
                        <span key={interest.id} className="inline-flex items-center gap-2 bg-primary-gold/10 text-primary-gold px-3 py-1 rounded-full">
                          {interest.icon} {interest.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                onClick={generateTripPlanHandler}
                disabled={isGenerating || selectedDestinations.length === 0}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-gold to-purple-600 text-white text-lg px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Your Trip Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI-Powered Trip Plan
                  </>
                )}
              </button>
              
              {selectedDestinations.length === 0 && (
                <p className="text-red-600 mt-4">Please select at least one destination in Step 2</p>
              )}
              
              <p className="text-sm text-gray-500 mt-4">
                This may take a few seconds. Our AI is crafting your perfect itinerary!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ====================== TRIP PLAN VIEWER COMPONENT ======================

  const TripPlanViewer = ({ 
    tripPlan, 
    criteria, 
    onSave, 
    onExport, 
    onShare, 
    onReset,
    user 
  }: { 
    tripPlan: TripPlan;
    criteria: TripCriteria;
    onSave: () => void;
    onExport: () => void;
    onShare: () => void;
    onReset: () => void;
    user: UserType | null | undefined;
  }): JSX.Element => {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-gold to-purple-600 text-white px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold">AI-Powered Trip Plan</span>
                </div>
                <h1 className="font-amiri text-3xl md:text-4xl font-bold text-black mb-2">{tripPlan.title}</h1>
                <p className="text-gray-600 max-w-3xl">{tripPlan.summary}</p>
              </div>
              
              <div className="flex items-center gap-3">
                {user ? (
                  <button
                    onClick={onSave}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/login?redirect=/ai-trip-planner')}
                    className="flex items-center gap-2 bg-primary-gold text-white px-4 py-2 rounded-lg hover:bg-primary-gold/90"
                  >
                    <Save className="w-4 h-4" />
                    Login to Save
                  </button>
                )}
                <button
                  onClick={onShare}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={onExport}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                <CalendarIcon className="w-4 h-4" />
                <span>{criteria.duration} days</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                <Users className="w-4 h-4" />
                <span>{criteria.travelers} traveler{criteria.travelers > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full">
                <DollarSign className="w-4 h-4" />
                <span>{BUDGET_LEVELS.find(b => b.id === criteria.budgetLevel)?.label}</span>
              </div>
              <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                <span>~{tripPlan.stats?.averageDailyActivities || 3} activities/day</span>
              </div>
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>${tripPlan.budget?.summary?.costPerPerson?.toLocaleString() || '0'} per person</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cost Summary */}
              {tripPlan.budget && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-primary-gold" />
                    Estimated Cost Breakdown
                  </h2>
                  <div className="text-center mb-8">
                    <div className="text-5xl font-bold text-primary-gold mb-2">
                      ${tripPlan.budget.summary.totalCost.toLocaleString()}
                    </div>
                    <p className="text-gray-600">Total estimated cost for {criteria.travelers} traveler{criteria.travelers > 1 ? 's' : ''}</p>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries({
                      accommodation: tripPlan.budget.accommodation.total,
                      activities: tripPlan.budget.activities.total,
                      food: tripPlan.budget.food.total,
                      transport: tripPlan.budget.transport.total,
                      misc: tripPlan.budget.misc.total
                    }).map(([category, amount]) => (
                      <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-gold/10 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary-gold" />
                          </div>
                          <div>
                            <div className="font-semibold text-black capitalize">{category}</div>
                            <div className="text-sm text-gray-600">Estimated ${(amount / criteria.travelers / criteria.duration).toFixed(2)}/person/day</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-black">${amount.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Daily Itinerary */}
              {tripPlan.dayPlans && tripPlan.dayPlans.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-black mb-6">Daily Itinerary</h2>
                  <div className="space-y-6">
                    {tripPlan.dayPlans.slice(0, 5).map(day => (
                      <div key={day.dayNumber} className="border-l-4 border-primary-gold pl-6 py-6 bg-gray-50/50 rounded-r-lg">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-gold to-moroccan-blue text-white rounded-full flex items-center justify-center font-bold text-lg">
                            Day {day.dayNumber}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-black">{day.title}</h3>
                            <p className="text-gray-600 mt-1">{day.theme}</p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <h4 className="font-semibold text-black mb-3 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Morning Activities
                            </h4>
                            <ul className="space-y-2">
                              {day.morning.slice(0, 3).map((activity, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <div className="w-5 h-5 bg-primary-gold/20 rounded-full flex items-center justify-center mt-0.5">
                                    <ChevronRight className="w-3 h-3 text-primary-gold" />
                                  </div>
                                  <span className="text-gray-700">{activity.placeName}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                                <Hotel className="w-4 h-4" />
                                Accommodation
                              </h4>
                              <p className="text-gray-700">{day.accommodation.name}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                                <Utensils className="w-4 h-4" />
                                Food Highlights
                              </h4>
                              <p className="text-gray-700">{day.meals.map(m => m.suggestion).join(', ')}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h4 className="font-semibold text-black mb-3">Daily Highlights</h4>
                          <div className="flex flex-wrap gap-2">
                            {day.importantNotes?.slice(0, 3).map((highlight, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-gold/10 text-primary-gold rounded-full text-sm">
                                <CheckCircle className="w-3 h-3" />
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {tripPlan.dayPlans.length > 5 && (
                      <div className="text-center pt-6 border-t border-gray-200">
                        <p className="text-gray-600">
                          + {tripPlan.dayPlans.length - 5} more days in your itinerary
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Side Info */}
            <div className="space-y-8">
              {/* Saved Trips Panel */}
              {user && savedPlans.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-primary-gold" />
                    Your Saved Trips
                  </h2>
                  <div className="space-y-3">
                    {savedPlans.slice(0, 3).map(plan => (
                      <div key={plan.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-black text-sm">{plan.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {plan.dates.start.toLocaleDateString()} - {plan.dates.end.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => loadSavedTripPlan(plan.id)}
                              className="p-1 text-gray-400 hover:text-primary-gold"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTripPlanHandler(plan.id)}
                              className="p-1 text-gray-400 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                            plan.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {plan.status}
                          </span>
                          <span className="text-xs text-gray-600">
                            ${plan.budget.estimated?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    {savedPlans.length > 3 && (
                      <button
                        onClick={() => router.push('/profile/trips')}
                        className="w-full text-center text-sm text-primary-gold hover:text-primary-gold/80 pt-2"
                      >
                        View all {savedPlans.length} trips →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Recommended Destinations */}
              {tripPlan.recommendedPlaces && tripPlan.recommendedPlaces.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-gold" />
                    Top Recommended Places
                  </h2>
                  <div className="space-y-4">
                    {tripPlan.recommendedPlaces.slice(0, 3).map((place, idx) => (
                      <div key={place.placeId} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-gold to-moroccan-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-black">{place.name}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{place.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-gray-600">{place.rating} • {place.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel Tips */}
              {tripPlan.travelTips && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Essential Travel Tips</h2>
                  <ul className="space-y-3">
                    {tripPlan.travelTips.general?.safety?.slice(0, 3).map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                        </div>
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/bookings')}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book This Trip
                </button>
                <button
                  onClick={onExport}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export as PDF
                </button>
                <button 
                  onClick={onReset}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Create New Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ====================== MAIN RENDER ======================

  if (tripPlan && step === 6) {
    return (
      <TripPlanViewer 
        tripPlan={tripPlan}
        criteria={criteria}
        onSave={saveTripPlanHandler}
        onExport={exportAsPDF}
        onShare={shareTripPlan}
        onReset={resetForm}
        user={user as UserType | null}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-gold to-purple-600 text-white px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">AI Trip Planner</span>
          </div>
          <h1 className="font-amiri text-3xl md:text-4xl font-bold text-black mb-4">
            Plan Your Perfect Moroccan Adventure
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our AI creates personalized itineraries based on your preferences, budget, and travel style.
            Follow the steps to generate your perfect trip.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 5</span>
            <span className="text-sm font-medium text-primary-gold">{Math.round((step / 5) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-gold to-purple-600 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {['Region', 'Destinations', 'Interests', 'Preferences', 'Budget'].map((label, idx) => (
              <div 
                key={label}
                className={`text-sm font-medium ${idx + 1 <= step ? 'text-primary-gold' : 'text-gray-400'}`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-2 text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Previous Step
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={resetForm}
              className="flex items-center gap-2 text-gray-600 hover:text-black"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            
            {step < 5 ? (
              <button
                onClick={nextStep}
                className="btn-primary flex items-center gap-2 px-6 py-3"
                disabled={(step === 2 && selectedDestinations.length === 0) || (step === 3 && criteria.interests.length === 0)}
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : step === 5 && !tripPlan ? (
              <button
                onClick={nextStep}
                className="btn-primary flex items-center gap-2 px-6 py-3"
              >
                Generate Plan
                <Sparkles className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>

        {/* User Status */}
        {authLoading ? (
          <div className="mt-8 text-center">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary-gold" />
          </div>
        ) : user ? (
          <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-gold to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-black">Logged in as {user.displayName || user.email}</p>
                  <p className="text-sm text-gray-600">
                    {savedPlans.length} saved trip{savedPlans.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/profile/trips')}
                className="text-sm text-primary-gold hover:text-primary-gold/80"
              >
                View All →
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <p className="text-black mb-2">
              <span className="font-medium">Log in to save your trip plans</span> and access them anytime
            </p>
            <button
              onClick={() => router.push('/login?redirect=/ai-trip-planner')}
              className="text-primary-gold hover:text-primary-gold/80 font-medium"
            >
              Sign in / Create account →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
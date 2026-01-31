// app/ai-trip-planner/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
  Palette
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TripCriteria {
  duration: number;
  travelers: number;
  budgetLevel: 'budget' | 'moderate' | 'luxury';
  interests: string[];
  preferredRegions: string[];
  travelPace: 'relaxed' | 'balanced' | 'active';
  accommodationStyle: 'traditional' | 'modern' | 'luxury' | 'budget';
  dietaryRestrictions: string[];
  startDate: string;
  endDate: string;
}

interface DayPlan {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation: string;
  meals: string[];
  highlights: string[];
  transport: string;
  estimatedTime: string;
}

interface TripPlan {
  id: string;
  title: string;
  summary: string;
  theme: string;
  totalCost: {
    estimated: number;
    breakdown: {
      accommodation: number;
      activities: number;
      food: number;
      transport: number;
      misc: number;
    };
  };
  dayPlans: DayPlan[];
  recommendedDestinations: {
    name: string;
    description: string;
    highlights: string[];
  }[];
  travelTips: string[];
  packingList: {
    category: string;
    items: string[];
  }[];
  bestTimeToVisit: string[];
  localCustoms: string[];
  estimatedDailyHours: number;
  generatedAt: Date;
}

const INTERESTS = [
  { id: 'cultural', label: 'Cultural Heritage', icon: '🏛️' },
  { id: 'beaches', label: 'Beaches', icon: '🏖️' },
  { id: 'mountains', label: 'Mountains', icon: '⛰️' },
  { id: 'desert', label: 'Desert', icon: '🏜️' },
  { id: 'food', label: 'Food & Cuisine', icon: '🍲' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'adventure', label: 'Adventure', icon: '🧗' },
  { id: 'history', label: 'History', icon: '🏺' },
  { id: 'relaxation', label: 'Relaxation', icon: '🧘' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌃' },
  { id: 'spiritual', label: 'Spiritual', icon: '🕌' },
  { id: 'crafts', label: 'Local Crafts', icon: '🧵' },
  { id: 'festivals', label: 'Festivals', icon: '🎉' }
];

const MOROCCO_REGIONS = [
  { id: 'marrakech', name: 'Marrakech-Safi', color: 'bg-red-100 text-red-800' },
  { id: 'casablanca', name: 'Casablanca-Settat', color: 'bg-blue-100 text-blue-800' },
  { id: 'rabat', name: 'Rabat-Salé-Kénitra', color: 'bg-green-100 text-green-800' },
  { id: 'fes', name: 'Fès-Meknès', color: 'bg-purple-100 text-purple-800' },
  { id: 'tangier', name: 'Tangier-Tetouan-Al Hoceima', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'oriental', name: 'Oriental', color: 'bg-pink-100 text-pink-800' },
  { id: 'drif', name: 'Drâa-Tafilalet', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'souss', name: 'Souss-Massa', color: 'bg-teal-100 text-teal-800' }
];

const ACCOMMODATION_STYLES = [
  { id: 'traditional', label: 'Traditional Riads', icon: '🏛️', description: 'Authentic Moroccan houses with courtyards' },
  { id: 'modern', label: 'Modern Hotels', icon: '🏨', description: 'Contemporary accommodations with amenities' },
  { id: 'luxury', label: 'Luxury Resorts', icon: '⭐', description: 'High-end resorts with premium services' },
  { id: 'budget', label: 'Budget Hostels', icon: '💰', description: 'Affordable shared accommodations' }
];

const BUDGET_LEVELS = [
  { 
    id: 'budget', 
    label: 'Budget ($)', 
    range: 'Under $50/day',
    description: 'Hostels, street food, public transport',
    color: 'bg-green-100 text-green-800'
  },
  { 
    id: 'moderate', 
    label: 'Moderate ($$)', 
    range: '$50-$150/day',
    description: 'Mid-range hotels, mix of dining options',
    color: 'bg-blue-100 text-blue-800'
  },
  { 
    id: 'luxury', 
    label: 'Luxury ($$$)', 
    range: '$150+/day',
    description: 'Luxury hotels, fine dining, private tours',
    color: 'bg-purple-100 text-purple-800'
  }
];

const TRAVEL_PACE = [
  { 
    id: 'relaxed', 
    label: 'Relaxed', 
    description: '1-2 activities per day, lots of downtime',
    icon: '🌅',
    dailyHours: 4
  },
  { 
    id: 'balanced', 
    label: 'Balanced', 
    description: '2-3 activities per day, some free time',
    icon: '⚖️',
    dailyHours: 6
  },
  { 
    id: 'active', 
    label: 'Active', 
    description: '3-4+ activities per day, packed schedule',
    icon: '⚡',
    dailyHours: 8
  }
];

export default function AITripPlannerPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<TripPlan[]>([]);
  
  const [criteria, setCriteria] = useState<TripCriteria>({
    duration: 7,
    travelers: 2,
    budgetLevel: 'moderate',
    interests: ['cultural', 'food'],
    preferredRegions: ['marrakech', 'fes'],
    travelPace: 'balanced',
    accommodationStyle: 'traditional',
    dietaryRestrictions: [],
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: ''
  });

  // Auto-set end date based on duration
  useEffect(() => {
    if (criteria.startDate) {
      const start = new Date(criteria.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + criteria.duration);
      setCriteria(prev => ({
        ...prev,
        endDate: end.toISOString().split('T')[0]
      }));
    }
  }, [criteria.startDate, criteria.duration]);

  const handleInterestToggle = (interestId: string) => {
    setCriteria(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleRegionToggle = (regionId: string) => {
    setCriteria(prev => ({
      ...prev,
      preferredRegions: prev.preferredRegions.includes(regionId)
        ? prev.preferredRegions.filter(r => r !== regionId)
        : [...prev.preferredRegions, regionId]
    }));
  };

  const generateTripPlan = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const getTheme = () => {
      if (criteria.interests.includes('cultural')) return 'Cultural Immersion';
      if (criteria.interests.includes('adventure')) return 'Adventure Quest';
      if (criteria.interests.includes('relaxation')) return 'Wellness Retreat';
      if (criteria.interests.includes('food')) return 'Culinary Journey';
      return 'Moroccan Discovery';
    };

    const getAccommodation = () => {
      switch(criteria.accommodationStyle) {
        case 'traditional': return 'Traditional Riad with courtyard';
        case 'modern': return '4-star Modern Hotel';
        case 'luxury': return '5-star Luxury Resort';
        case 'budget': return 'Budget-friendly Hostel';
        default: return 'Traditional Riad';
      }
    };

    // Mock trip plan based on criteria
    const mockPlan: TripPlan = {
      id: `plan_${Date.now()}`,
      title: `${getTheme()} - ${criteria.duration} Days in Morocco`,
      summary: `Experience the magic of Morocco with this carefully curated ${criteria.duration}-day itinerary. Designed for ${criteria.travelers} traveler${criteria.travelers > 1 ? 's' : ''}, this journey combines ${criteria.interests.map(id => INTERESTS.find(i => i.id === id)?.label).join(', ').toLowerCase()} with authentic Moroccan hospitality.`,
      theme: getTheme(),
      totalCost: {
        estimated: criteria.budgetLevel === 'budget' ? criteria.duration * 40 * criteria.travelers :
                   criteria.budgetLevel === 'moderate' ? criteria.duration * 90 * criteria.travelers :
                   criteria.duration * 180 * criteria.travelers,
        breakdown: {
          accommodation: criteria.budgetLevel === 'budget' ? criteria.duration * 15 * criteria.travelers :
                       criteria.budgetLevel === 'moderate' ? criteria.duration * 40 * criteria.travelers :
                       criteria.duration * 100 * criteria.travelers,
          activities: criteria.duration * 10 * criteria.travelers,
          food: criteria.duration * 12 * criteria.travelers,
          transport: criteria.duration * 8 * criteria.travelers,
          misc: criteria.duration * 5 * criteria.travelers
        }
      },
      dayPlans: Array.from({ length: criteria.duration }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: ${i === 0 ? 'Arrival & First Impressions' : 
                               i === criteria.duration - 1 ? 'Final Memories & Departure' : 
                               `Exploring ${criteria.preferredRegions[i % criteria.preferredRegions.length]?.charAt(0).toUpperCase() + criteria.preferredRegions[i % criteria.preferredRegions.length]?.slice(1)}`}`,
        description: `A day designed around your interests in ${criteria.interests.map(id => INTERESTS.find(i => i.id === id)?.label.toLowerCase()).join(' and ')}.`,
        activities: [
          'Morning market exploration',
          'Guided historical walking tour',
          'Traditional Moroccan cooking class',
          'Sunset at a scenic viewpoint'
        ],
        accommodation: getAccommodation(),
        meals: ['Traditional breakfast', 'Local restaurant lunch', 'Dinner with cultural show'],
        highlights: ['Authentic local interaction', 'Cultural immersion', 'Photography opportunities'],
        transport: 'Private driver & local taxis',
        estimatedTime: '8-10 hours of activities'
      })),
      recommendedDestinations: criteria.preferredRegions.map(regionId => {
        const region = MOROCCO_REGIONS.find(r => r.id === regionId);
        return {
          name: region?.name || 'Morocco',
          description: 'A must-visit destination with rich history and culture',
          highlights: ['Historic Medina', 'Local Markets', 'Traditional Architecture']
        };
      }).concat([
        {
          name: 'Sahara Desert',
          description: 'Experience the breathtaking dunes and starry nights',
          highlights: ['Camel Trekking', 'Desert Camping', 'Sunset Views']
        },
        {
          name: 'Atlas Mountains',
          description: 'Majestic peaks and traditional Berber villages',
          highlights: ['Hiking Trails', 'Village Visits', 'Mountain Views']
        }
      ]),
      travelTips: [
        'Carry cash in Moroccan Dirhams for local markets',
        'Dress modestly when visiting religious sites',
        'Learn basic Arabic phrases (Salam, Shukran)',
        'Stay hydrated, especially in desert regions',
        'Bargain politely in souks (start at 30% of asking price)',
        'Respect local customs and traditions'
      ],
      packingList: [
        {
          category: 'Clothing',
          items: ['Lightweight, modest clothing', 'Comfortable walking shoes', 'Scarf/shawl for religious sites', 'Sun hat and sunglasses']
        },
        {
          category: 'Essentials',
          items: ['Passport and copies', 'Travel insurance documents', 'Power adapter (Type C/E)', 'Portable charger']
        },
        {
          category: 'Health & Safety',
          items: ['Basic first aid kit', 'Prescription medications', 'Sunscreen (high SPF)', 'Hand sanitizer']
        },
        {
          category: 'Optional',
          items: ['Camera with extra batteries', 'Notebook for journaling', 'Reusable water bottle', 'Light backpack for day trips']
        }
      ],
      bestTimeToVisit: [
        'Spring (March-May): Pleasant temperatures, blooming landscapes',
        'Autumn (September-November): Mild weather, fewer crowds',
        'Avoid peak summer (July-August) in desert regions'
      ],
      localCustoms: [
        'Greet with "Salam alaikum" (peace be upon you)',
        'Use right hand for eating and greetings',
        'Remove shoes when entering homes',
        'Avoid public displays of affection',
        'Accept mint tea when offered - it\'s a sign of hospitality'
      ],
      estimatedDailyHours: TRAVEL_PACE.find(p => p.id === criteria.travelPace)?.dailyHours || 6,
      generatedAt: new Date()
    };

    setTripPlan(mockPlan);
    setIsGenerating(false);
  };

  const saveTripPlan = () => {
    if (tripPlan) {
      setSavedPlans(prev => [...prev, tripPlan]);
      alert('Trip plan saved to your account!');
    }
  };

  const exportAsPDF = () => {
    alert('PDF export feature would be implemented here');
    // In a real app, this would generate and download a PDF
  };

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

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const resetForm = () => {
    setCriteria({
      duration: 7,
      travelers: 2,
      budgetLevel: 'moderate',
      interests: ['cultural', 'food'],
      preferredRegions: ['marrakech', 'fes'],
      travelPace: 'balanced',
      accommodationStyle: 'traditional',
      dietaryRestrictions: [],
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: ''
    });
    setStep(1);
    setTripPlan(null);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary-gold" />
                Trip Duration & Group
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-3">Duration (days)</label>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setCriteria(prev => ({ ...prev, duration: Math.max(3, prev.duration - 1) }))}
                        className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-xl"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center">
                        <div className="text-5xl font-bold text-primary-gold">{criteria.duration}</div>
                        <div className="text-gray-600 mt-1">days</div>
                      </div>
                      <button 
                        onClick={() => setCriteria(prev => ({ ...prev, duration: Math.min(30, prev.duration + 1) }))}
                        className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-3">Number of Travelers</label>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setCriteria(prev => ({ ...prev, travelers: Math.max(1, prev.travelers - 1) }))}
                        className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-xl"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Users className="w-8 h-8 text-primary-gold" />
                          <div className="text-5xl font-bold text-gray-900">{criteria.travelers}</div>
                        </div>
                        <div className="text-gray-600 mt-1">traveler{criteria.travelers > 1 ? 's' : ''}</div>
                      </div>
                      <button 
                        onClick={() => setCriteria(prev => ({ ...prev, travelers: Math.min(10, prev.travelers + 1) }))}
                        className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-3">Travel Dates</label>
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

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-4">Travel Pace</label>
                    <div className="space-y-3">
                      {TRAVEL_PACE.map(pace => (
                        <button
                          key={pace.id}
                          onClick={() => setCriteria(prev => ({ ...prev, travelPace: pace.id as any }))}
                          className={`w-full p-4 rounded-xl border-2 flex items-start gap-4 text-left transition-all ${
                            criteria.travelPace === pace.id
                              ? 'border-primary-gold bg-primary-gold/5'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-2xl">{pace.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{pace.label}</div>
                            <div className="text-sm text-gray-600 mt-1">{pace.description}</div>
                            <div className="text-xs text-gray-500 mt-2">~{pace.dailyHours} hours of activities/day</div>
                          </div>
                          {criteria.travelPace === pace.id && (
                            <CheckCircle className="w-5 h-5 text-primary-gold ml-auto" />
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

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Heart className="w-6 h-6 text-primary-gold" />
                Interests & Preferences
              </h3>
              
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-4">What interests you most? (Select 3-5)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                        criteria.interests.includes(interest.id)
                          ? 'border-primary-gold bg-primary-gold/10'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl mb-2">{interest.icon}</span>
                      <span className="text-sm font-medium text-center">{interest.label}</span>
                      {criteria.interests.includes(interest.id) && (
                        <CheckCircle className="w-4 h-4 text-primary-gold mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-4">Preferred Regions</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {MOROCCO_REGIONS.map(region => (
                    <button
                      key={region.id}
                      onClick={() => handleRegionToggle(region.id)}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${
                        criteria.preferredRegions.includes(region.id)
                          ? `border-2 border-primary-gold ${region.color.replace('bg-', 'bg-').replace('text-', 'text-')}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <MapPin className={`w-5 h-5 mb-2 ${
                        criteria.preferredRegions.includes(region.id) ? 'text-current' : 'text-gray-400'
                      }`} />
                      <span className="text-sm font-medium text-center">{region.name.split('-')[0]}</span>
                      {criteria.preferredRegions.includes(region.id) && (
                        <CheckCircle className="w-4 h-4 text-current mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-4">Accommodation Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ACCOMMODATION_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setCriteria(prev => ({ ...prev, accommodationStyle: style.id as any }))}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                        criteria.accommodationStyle === style.id
                          ? 'border-primary-gold bg-primary-gold/5'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-3xl mb-3">{style.icon}</span>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{style.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{style.description}</div>
                      </div>
                      {criteria.accommodationStyle === style.id && (
                        <CheckCircle className="w-5 h-5 text-primary-gold mt-3" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-primary-gold" />
                Budget & Special Requirements
              </h3>
              
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-4">Budget Level</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {BUDGET_LEVELS.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setCriteria(prev => ({ ...prev, budgetLevel: level.id as any }))}
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
                      <div className="text-xl font-bold text-gray-900 mb-2">{level.range}</div>
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

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-gold to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Generate Your Trip!</h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Based on your preferences, our AI will create a personalized {criteria.duration}-day Moroccan adventure for {criteria.travelers} traveler{criteria.travelers > 1 ? 's' : ''}.
              </p>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
                <h4 className="font-semibold text-gray-900 mb-6 text-lg">Your Preferences Summary</h4>
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
                onClick={generateTripPlan}
                disabled={isGenerating}
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

  if (tripPlan) {
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
                <h1 className="font-amiri text-3xl md:text-4xl font-bold text-gray-900 mb-2">{tripPlan.title}</h1>
                <p className="text-gray-600 max-w-3xl">{tripPlan.summary}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={saveTripPlan}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={shareTripPlan}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={exportAsPDF}
                  className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4" />
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
                <span>~{tripPlan.estimatedDailyHours} hrs/day</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cost Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-primary-gold" />
                  Estimated Cost Breakdown
                </h2>
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold text-primary-gold mb-2">
                    ${tripPlan.totalCost.estimated.toLocaleString()}
                  </div>
                  <p className="text-gray-600">Total estimated cost for {criteria.travelers} traveler{criteria.travelers > 1 ? 's' : ''}</p>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(tripPlan.totalCost.breakdown).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-gold/10 rounded-full flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-primary-gold" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 capitalize">{category}</div>
                          <div className="text-sm text-gray-600">Estimated ${(amount / criteria.travelers / criteria.duration).toFixed(2)}/person/day</div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-gray-900">${amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Itinerary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h2>
                <div className="space-y-6">
                  {tripPlan.dayPlans.map(day => (
                    <div key={day.day} className="border-l-4 border-primary-gold pl-6 py-6 bg-gray-50/50 rounded-r-lg">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-gold to-moroccan-blue text-white rounded-full flex items-center justify-center font-bold text-lg">
                          Day {day.day}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{day.title}</h3>
                          <p className="text-gray-600 mt-1">{day.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Activities
                          </h4>
                          <ul className="space-y-2">
                            {day.activities.map((activity, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-5 h-5 bg-primary-gold/20 rounded-full flex items-center justify-center mt-0.5">
                                  <ChevronRight className="w-3 h-3 text-primary-gold" />
                                </div>
                                <span className="text-gray-700">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <Hotel className="w-4 h-4" />
                              Accommodation
                            </h4>
                            <p className="text-gray-700">{day.accommodation}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <Plane className="w-4 h-4" />
                              Transport
                            </h4>
                            <p className="text-gray-700">{day.transport}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Highlights</h4>
                        <div className="flex flex-wrap gap-2">
                          {day.highlights.map((highlight, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-gold/10 text-primary-gold rounded-full text-sm">
                              <CheckCircle className="w-3 h-3" />
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Side Info */}
            <div className="space-y-8">
              {/* Recommended Destinations */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-gold" />
                  Recommended Destinations
                </h2>
                <div className="space-y-4">
                  {tripPlan.recommendedDestinations.map((destination, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-gold to-moroccan-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{destination.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{destination.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {destination.highlights.map((highlight, hIdx) => (
                              <span key={hIdx} className="text-xs bg-white px-2 py-1 rounded border">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Tips */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Travel Tips & Customs</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Essential Tips</h3>
                    <ul className="space-y-2">
                      {tripPlan.travelTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                          </div>
                          <span className="text-sm text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Local Customs</h3>
                    <ul className="space-y-2">
                      {tripPlan.localCustoms.map((custom, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-700">{custom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Packing List */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Packing List</h2>
                <div className="space-y-4">
                  {tripPlan.packingList.map((category, idx) => (
                    <div key={idx}>
                      <h3 className="font-semibold text-gray-900 mb-2">{category.category}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {category.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Time to Visit */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Best Time to Visit</h2>
                <ul className="space-y-3">
                  {tripPlan.bestTimeToVisit.map((time, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-0.5">
                        <Sun className="w-3 h-3 text-yellow-600" />
                      </div>
                      <span className="text-sm text-gray-700">{time}</span>
                    </li>
                  ))}
                </ul>
              </div>

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
                  onClick={exportAsPDF}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export as PDF
                </button>
                <button 
                  onClick={resetForm}
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
          <h1 className="font-amiri text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Let AI Plan Your Moroccan Adventure
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Answer a few questions and our AI will create a personalized itinerary 
            tailored to your preferences, budget, and travel style.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
            <span className="text-sm font-medium text-primary-gold">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-gold to-purple-600 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {['Trip Details', 'Interests', 'Budget', 'Generate'].map((label, idx) => (
              <div 
                key={label}
                className={`text-sm font-medium ${
                  idx + 1 <= step ? 'text-primary-gold' : 'text-gray-400'
                }`}
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
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Previous Step
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={resetForm}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            
            {step < 4 && (
              <button
                onClick={nextStep}
                className="btn-primary flex items-center gap-2 px-6 py-3"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// src/lib/trip-planner-helpers.ts

import { 
  TripCriteria, 
  TripPlan, 
  DayPlan, 
  ActivitySlot, 
  Destination, 
  Place,
  User,
  BudgetBreakdown,
  RecommendedPlace,
  MealPlan,
  AccommodationDay,
  TravelTips,
  PackingList
} from '../types';

// ====================== DATA VALIDATION ======================
export function validateTripPlanData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required fields
  if (!data.userId) errors.push('userId is required');
  if (!data.title) errors.push('title is required');
  if (!data.criteria) errors.push('criteria is required');
  if (!data.generatedPlan) errors.push('generatedPlan is required');
  
  // Ensure rating is a number (not undefined)
  if (data.rating === undefined) {
    console.warn('rating is undefined, setting to 0');
    data.rating = 0;
  }
  
  // Ensure dates are properly formatted
  if (data.dates?.start && !(data.dates.start instanceof Date)) {
    try {
      data.dates.start = new Date(data.dates.start);
    } catch (e) {
      errors.push('Invalid start date');
    }
  }
  
  if (data.dates?.end && !(data.dates.end instanceof Date)) {
    try {
      data.dates.end = new Date(data.dates.end);
    } catch (e) {
      errors.push('Invalid end date');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ====================== COST CALCULATIONS ======================

export function calculateDailyCost(activities: ActivitySlot[], criteria: TripCriteria) {
  const activityCost = activities.reduce((sum, act) => sum + act.cost.total, 0);
  const foodCost = criteria.budgetLevel === 'budget' ? 30 : 
                   criteria.budgetLevel === 'moderate' ? 60 : 100;
  const transportCost = 20;
  const accommodationCost = criteria.budgetLevel === 'budget' ? 40 : 
                           criteria.budgetLevel === 'moderate' ? 100 : 200;
  
  return {
    activities: activityCost * criteria.travelers,
    food: foodCost * criteria.travelers,
    transport: transportCost * criteria.travelers,
    accommodation: accommodationCost * (criteria.roomPreferences?.singleRooms || 1 + 
                                        criteria.roomPreferences?.doubleRooms || 1),
    misc: 15 * criteria.travelers,
    total: (activityCost + foodCost + transportCost + accommodationCost + 15) * criteria.travelers
  };
}

export function calculateBudgetBreakdown(criteria: TripCriteria, dayPlans: DayPlan[]): BudgetBreakdown {
  const totalDays = criteria.duration;
  const totalTravelers = criteria.travelers;
  
  // Accommodation costs
  const accommodationPerNight = criteria.budgetLevel === 'budget' ? 40 :
                               criteria.budgetLevel === 'moderate' ? 100 : 200;
  const totalAccommodation = accommodationPerNight * totalDays * (criteria.roomPreferences?.singleRooms || 1);
  
  // Activity costs from actual day plans
  const totalActivities = dayPlans.reduce((sum, day) => sum + day.dailyCost.activities, 0);
  
  // Food costs
  const foodPerPersonPerDay = criteria.budgetLevel === 'budget' ? 30 :
                             criteria.budgetLevel === 'moderate' ? 60 : 100;
  const totalFood = foodPerPersonPerDay * totalTravelers * totalDays;
  
  // Transport costs
  const transportPerPersonPerDay = 20;
  const totalTransport = transportPerPersonPerDay * totalTravelers * totalDays;
  
  // Misc costs
  const miscPerPersonPerDay = 15;
  const totalMisc = miscPerPersonPerDay * totalTravelers * totalDays;
  
  const totalCost = totalAccommodation + totalActivities + totalFood + totalTransport + totalMisc;
  
  return {
    accommodation: {
      total: totalAccommodation,
      perNight: accommodationPerNight,
      perPerson: totalAccommodation / totalTravelers,
      breakdown: [{
        type: criteria.accommodationStyle,
        nights: totalDays,
        cost: totalAccommodation
      }]
    },
    activities: {
      total: totalActivities,
      perPerson: totalActivities / totalTravelers,
      perDay: totalActivities / totalDays,
      breakdown: [{
        category: 'Entrance Fees & Tours',
        cost: totalActivities,
        count: dayPlans.reduce((sum, day) => sum + day.morning.length + day.afternoon.length + day.evening.length, 0)
      }]
    },
    food: {
      total: totalFood,
      perPersonPerDay: foodPerPersonPerDay,
      breakdown: {
        breakfast: 10 * totalTravelers * totalDays,
        lunch: 15 * totalTravelers * totalDays,
        dinner: 25 * totalTravelers * totalDays,
        snacks: 10 * totalTravelers * totalDays
      }
    },
    transport: {
      total: totalTransport,
      perPerson: transportPerPersonPerDay * totalDays,
      breakdown: {
        flights: criteria.intercityTransport.includes('flight') ? 200 * totalTravelers : 0,
        trains: criteria.intercityTransport.includes('train') ? 50 * totalTravelers : 0,
        buses: criteria.intercityTransport.includes('bus') ? 30 * totalTravelers : 0,
        taxis: 100 * totalTravelers,
        carRental: criteria.transportPreferences.includes('rental') ? 400 : 0,
        fuel: criteria.transportPreferences.includes('rental') ? 150 : 0
      }
    },
    misc: {
      total: totalMisc,
      categories: {
        souvenirs: 100 * totalTravelers,
        tips: 50 * totalTravelers,
        entranceFees: 0, // Already in activities
        guides: 200,
        insurance: 50 * totalTravelers,
        visa: criteria.travelers * 30
      }
    },
    summary: {
      totalCost,
      costPerPerson: totalCost / totalTravelers,
      costPerDay: totalCost / totalDays,
      costPerPersonPerDay: totalCost / (totalTravelers * totalDays),
      currency: criteria.currency || 'USD'
    }
  };
}

// ====================== SEASON & DATE HELPERS ======================

export function getBestMonths(season: string): string[] {
  const monthMapping: Record<string, string[]> = {
    'winter': ['December', 'January', 'February'],
    'spring': ['March', 'April', 'May'],
    'summer': ['June', 'July', 'August'],
    'autumn': ['September', 'October', 'November'],
    'any': ['March-May', 'September-November']
  };
  
  return monthMapping[season] || ['March-May', 'September-November'];
}

// ====================== PLACE RECOMMENDATIONS ======================

export function generateRecommendedPlaces(
  destinationPlaces: Array<{ destination: Destination; places: Place[] }>,
  interests: string[]
): RecommendedPlace[] {
  const recommended: RecommendedPlace[] = [];
  
  // Map interests to place scoring
  const interestScores: Record<string, number> = {
    'cultural': 3,
    'historical': 3,
    'food': 2,
    'nature': 2,
    'adventure': 2,
    'relaxation': 1,
    'shopping': 1,
    'photography': 1
  };
  
  for (const { destination, places } of destinationPlaces) {
    // Take top 3-5 places from each destination
    const topPlaces = places
      .slice(0, 5)
      .map(place => {
        // Calculate match score based on interests
        let matchScore = 0;
        
        // Base score from rating
        matchScore += (place.rating || 3) * 10;
        
        // Interest-based scoring
        interests.forEach(interest => {
          if (interestScores[interest]) {
            matchScore += interestScores[interest];
          }
        });
        
        return {
          placeId: place.id,
          destinationId: destination.id,
          name: place.name.en,
          type: place.type,
          category: place.category,
          description: place.description.en.substring(0, 150) + '...',
          highlights: place.tips?.slice(0, 3) || ['Scenic views', 'Cultural experience'],
          image: place.images?.[0] || '',
          rating: place.rating || 4,
          reviewCount: place.reviewCount || 10,
          duration: place.duration || '2-3 hours',
          bestTimeToVisit: place.bestTimeToVisit || ['Morning', 'Late afternoon'],
          cost: place.entranceFee || { local: 20, tourist: 50, currency: 'MAD' },
          matchScore,
          whyRecommended: getWhyRecommended(place, interests)
        };
      });
    
    recommended.push(...topPlaces);
  }
  
  // Sort by match score and return top 15
  return recommended
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 15);
}

function getWhyRecommended(place: Place, interests: string[]): string {
  if (interests.includes('cultural') && (place.type === 'museum' || place.type === 'historical')) {
    return 'Perfect for cultural enthusiasts with rich historical significance';
  }
  if (interests.includes('food') && place.type === 'restaurant') {
    return 'Highly rated for authentic Moroccan cuisine';
  }
  if (interests.includes('nature') && place.type === 'natural') {
    return 'Breathtaking natural scenery and photo opportunities';
  }
  if (interests.includes('photography') && (place.type === 'viewpoint' || place.category === 'scenic')) {
    return 'Excellent photography spot with panoramic views';
  }
  return 'Highly recommended by travelers for its unique experience';
}

// ====================== ACCOMMODATION GENERATION ======================

export function generateAccommodations(
  criteria: TripCriteria,
  destinations: Destination[]
): Array<{ destination: string; nights: number; type: string; estimatedCost: number; suggestions: string[] }> {
  const accommodations = [];
  const nightsPerDestination = Math.floor(criteria.duration / destinations.length);
  
  for (let i = 0; i < destinations.length; i++) {
    const destination = destinations[i];
    const nights = i === destinations.length - 1 
      ? criteria.duration - (nightsPerDestination * (destinations.length - 1))
      : nightsPerDestination;
    
    const accommodationType = criteria.accommodationStyle;
    const costPerNight = criteria.budgetLevel === 'budget' ? 40 :
                        criteria.budgetLevel === 'moderate' ? 100 : 200;
    
    const suggestions = getAccommodationSuggestions(destination.name.en, accommodationType);
    
    accommodations.push({
      destination: destination.name.en,
      nights,
      type: accommodationType,
      estimatedCost: costPerNight * nights * (criteria.roomPreferences?.singleRooms || 1),
      suggestions
    });
  }
  
  return accommodations;
}

function getAccommodationSuggestions(destination: string, type: string): string[] {
  const suggestions: Record<string, string[]> = {
    'traditional': [
      `Traditional riad in the medina of ${destination}`,
      `Family-owned guesthouse with courtyard`,
      `Heritage house with traditional architecture`
    ],
    'modern': [
      `4-star hotel in ${destination} city center`,
      `Boutique hotel with modern amenities`,
      `Business hotel with swimming pool`
    ],
    'luxury': [
      `5-star luxury resort in ${destination}`,
      `Palace hotel with spa facilities`,
      `Private villa with desert views`
    ],
    'budget': [
      `Hostel in ${destination} with shared facilities`,
      `Budget guesthouse near main attractions`,
      `Eco-lodge with basic amenities`
    ]
  };
  
  return suggestions[type] || suggestions['traditional'];
}

// ====================== TRANSPORT PLAN ======================

export function generateTransportPlan(
  criteria: TripCriteria,
  destinations: Destination[]
) {
  const intercity = [];
  
  // Create transport segments between destinations
  for (let i = 0; i < destinations.length - 1; i++) {
    const fromDest = destinations[i];
    const toDest = destinations[i + 1];
    
    // Choose transport mode based on preferences
    let mode = 'train';
    if (criteria.intercityTransport.includes('flight') && i === 0) {
      mode = 'flight';
    } else if (criteria.intercityTransport.includes('bus')) {
      mode = 'bus';
    } else if (criteria.transportPreferences.includes('private')) {
      mode = 'private car';
    }
    
    // Estimate duration based on distance (simplified)
    const duration = mode === 'flight' ? 1 : mode === 'train' ? 3 : 4;
    const cost = mode === 'flight' ? 150 : mode === 'train' ? 50 : mode === 'bus' ? 30 : 100;
    
    intercity.push({
      from: fromDest.name.en,
      to: toDest.name.en,
      mode,
      duration: duration * 60, // in minutes
      estimatedCost: cost * criteria.travelers,
      bookingTips: getTransportBookingTips(mode)
    });
  }
  
  return {
    intercity,
    local: {
      primaryMode: criteria.transportPreferences.includes('private') ? 'private driver' : 'taxis & walking',
      estimatedDailyCost: criteria.transportPreferences.includes('private') ? 80 : 30,
      tips: getLocalTransportTips(criteria)
    }
  };
}

function getTransportBookingTips(mode: string): string[] {
  const tips: Record<string, string[]> = {
    'train': [
      'Book train tickets 2-3 weeks in advance for best prices',
      'Consider first class for longer journeys',
      'Validate ticket before boarding'
    ],
    'flight': [
      'Check luggage allowance carefully',
      'Arrive at airport 2 hours before domestic flights',
      'Consider travel insurance for flight delays'
    ],
    'bus': [
      'Book through reputable companies like CTM or Supratours',
      'Early morning buses are less crowded',
      'Keep valuables in hand luggage'
    ],
    'private car': [
      'Agree on price before starting journey',
      'Confirm if fuel is included',
      'Consider tipping driver 10% for good service'
    ]
  };
  
  return tips[mode] || tips['train'];
}

function getLocalTransportTips(criteria: TripCriteria): string[] {
  const tips = [
    'Use petit taxis for short distances within cities',
    'Always negotiate price before getting in a taxi',
    'Walking is the best way to explore medinas'
  ];
  
  if (criteria.transportPreferences.includes('rental')) {
    tips.push('Rent a car only for intercity travel, not within cities');
    tips.push('International driving permit required');
  }
  
  if (criteria.mobilityNeeds?.length) {
    tips.push('Notify accommodations in advance for accessibility needs');
  }
  
  return tips;
}

// ====================== TRAVEL TIPS ======================

export function generateTravelTips(
  criteria: TripCriteria,
  destinations: Destination[]
): TravelTips {
  return {
    destinationSpecific: destinations.map(dest => ({
      destination: dest.name.en,
      tips: dest.travelTips?.slice(0, 5) || [
        'Respect local customs and dress modestly',
        'Carry cash for small purchases in the medina',
        'Learn basic Arabic phrases like "Shukran" (thank you)'
      ],
      warnings: [
        'Avoid unlicensed guides',
        'Be cautious with street food if you have sensitive stomach',
        'Keep valuables secure in crowded areas'
      ],
      bestPractices: [
        'Bargain politely in souks - start at 50% of asking price',
        'Accept mint tea when offered - it\'s a sign of hospitality',
        'Remove shoes when entering homes or mosques'
      ]
    })),
    general: {
      packing: [
        'Lightweight, modest clothing',
        'Comfortable walking shoes',
        'Scarf for visiting religious sites',
        'Sun protection (hat, sunglasses, sunscreen)'
      ],
      etiquette: [
        'Use right hand for eating and greeting',
        'Dress modestly, especially in rural areas',
        'Ask permission before photographing people',
        'Avoid public displays of affection'
      ],
      safety: [
        'Keep passport and valuables in hotel safe',
        'Use licensed taxis with meters',
        'Avoid political discussions',
        'Emergency number: 190 (police), 150 (ambulance)'
      ],
      money: [
        'Carry Moroccan Dirhams (MAD)',
        'ATMs widely available in cities',
        'Credit cards accepted in hotels and restaurants',
        'Keep small bills for tips and markets'
      ],
      health: [
        'Drink bottled water only',
        'Carry basic medications',
        'Consider travel insurance with medical coverage',
        'Protect against sun and heat'
      ],
      communication: [
        'Basic Arabic phrases are appreciated',
        'French widely spoken in tourist areas',
        'English spoken in hotels and touristic places',
        'Download offline maps and translation apps'
      ]
    },
    seasonal: {
      season: criteria.season,
      tips: getSeasonalTips(criteria.season),
      clothing: getSeasonalClothing(criteria.season),
      activities: getSeasonalActivities(criteria.season)
    }
  };
}

function getSeasonalTips(season: string): string[] {
  const tips: Record<string, string[]> = {
    'winter': [
      'Pack warm layers for cold nights',
      'Desert nights can be very cold - bring thermal wear',
      'Mountain roads may be icy - check conditions'
    ],
    'spring': [
      'Perfect weather for outdoor activities',
      'Wildflowers in bloom - great for photography',
      'Book accommodations early for popular festivals'
    ],
    'summer': [
      'Stay hydrated and avoid midday sun',
      'Desert temperatures can exceed 40°C (104°F)',
      'Coastal areas are cooler than inland'
    ],
    'autumn': [
      'Ideal temperatures for hiking and exploration',
      'Harvest season - great for food experiences',
      'Fewer crowds than spring'
    ]
  };
  
  return tips[season] || ['Pack layers for varying temperatures'];
}

function getSeasonalClothing(season: string): string[] {
  const clothing: Record<string, string[]> = {
    'winter': ['Warm jacket', 'Sweaters', 'Thermal layers', 'Closed shoes', 'Gloves for desert nights'],
    'spring': ['Light jacket', 'Long sleeves', 'Comfortable pants', 'Sun hat', 'Walking shoes'],
    'summer': ['Light cotton clothing', 'Sun hat', 'Sunglasses', 'Swimwear', 'Sandals'],
    'autumn': ['Light layers', 'Jacket for evenings', 'Comfortable shoes', 'Scarf', 'Rain jacket']
  };
  
  return clothing[season] || ['Versatile layers', 'Comfortable walking shoes', 'Sun protection'];
}

function getSeasonalActivities(season: string): string[] {
  const activities: Record<string, string[]> = {
    'winter': ['Desert camping with bonfire', 'Skiing in Atlas Mountains', 'Indoor historical sites'],
    'spring': ['Hiking in national parks', 'Garden tours', 'Outdoor festivals'],
    'summer': ['Beach activities', 'Desert trips at dawn/dusk', 'Evening market exploration'],
    'autumn': ['Village harvest visits', 'Mountain trekking', 'Cultural festivals']
  };
  
  return activities[season] || ['Cultural sightseeing', 'Market exploration', 'Food experiences'];
}

// ====================== PACKING LIST ======================

export function generatePackingList(criteria: TripCriteria): PackingList {
  return {
    clothing: [
      {
        category: 'Essential Clothing',
        items: ['Lightweight shirts (long sleeves)', 'Comfortable pants/jeans', 'Modest dresses/skirts', 'Light jacket/sweater'],
        quantity: '5-7 days worth',
        importance: 'essential',
        notes: 'Choose natural fabrics like cotton for hot weather'
      },
      {
        category: 'Footwear',
        items: ['Comfortable walking shoes', 'Sandals', 'Evening shoes'],
        quantity: '2-3 pairs',
        importance: 'essential',
        notes: 'Break in new shoes before trip'
      },
      {
        category: 'Accessories',
        items: ['Sun hat/cap', 'Sunglasses', 'Scarf/shawl for religious sites', 'Belt'],
        quantity: '1 each',
        importance: 'essential',
        notes: 'Scarf is essential for visiting mosques'
      }
    ],
    electronics: [
      { item: 'Phone & charger', quantity: '1', importance: 'essential' },
      { item: 'Power adapter (Type C/E)', quantity: '1-2', importance: 'essential' },
      { item: 'Power bank', quantity: '1', importance: 'recommended' },
      { item: 'Camera & accessories', quantity: 'As needed', importance: 'optional' },
      { item: 'Tablet/laptop', quantity: '1', importance: 'optional' }
    ],
    documents: [
      { document: 'Passport', required: true, copiesNeeded: 2, notes: 'Valid for 6+ months after travel' },
      { document: 'Travel insurance', required: true, copiesNeeded: 2, notes: 'Keep digital and printed copies' },
      { document: 'Flight tickets', required: true, copiesNeeded: 2, notes: 'Printed and digital' },
      { document: 'Hotel reservations', required: true, copiesNeeded: 2, notes: 'Printed confirmations' },
      { document: 'Driver\'s license', required: criteria.transportPreferences.includes('rental'), copiesNeeded: 1, notes: 'International permit if renting' }
    ],
    health: [
      { item: 'Prescription medications', quantity: 'Full trip + extra', importance: 'essential', notes: 'In original containers' },
      { item: 'Basic first aid kit', quantity: '1', importance: 'essential', notes: 'Include bandages, antiseptic, pain relievers' },
      { item: 'Sunscreen (high SPF)', quantity: '1-2 bottles', importance: 'essential', notes: 'Moroccan sun is strong' },
      { item: 'Insect repellent', quantity: '1', importance: 'recommended', notes: 'Especially for evening outdoors' },
      { item: 'Hand sanitizer', quantity: '1-2 small bottles', importance: 'recommended', notes: 'For markets and travel' }
    ],
    miscellaneous: [
      {
        category: 'Personal Care',
        items: ['Toiletries', 'Quick-dry towel', 'Tissues/wet wipes', 'Lip balm'],
        importance: 'essential'
      },
      {
        category: 'Travel Comfort',
        items: ['Reusable water bottle', 'Travel pillow', 'Earplugs', 'Eye mask'],
        importance: 'recommended'
      },
      {
        category: 'Miscellaneous',
        items: ['Notebook & pen', 'Books/entertainment', 'Small backpack', 'Ziplock bags'],
        importance: 'optional'
      }
    ]
  };
}

// ====================== EMERGENCY INFO ======================

export function generateEmergencyInfo() {
  return {
    embassies: [
      {
        country: 'United States',
        address: 'Km 5.7, Avenue Mohammed VI, Souissi, Rabat',
        phone: '+212 537 63 72 00',
        emergencyPhone: '+212 661 13 19 39'
      },
      {
        country: 'United Kingdom',
        address: '28 Avenue S.A.R. Sidi Mohammed, Souissi, Rabat',
        phone: '+212 537 63 33 33',
        emergencyPhone: '+212 661 17 47 71'
      },
      {
        country: 'France',
        address: '3 Rue Sahnoun, Rabat',
        phone: '+212 537 68 97 00',
        emergencyPhone: '+212 661 17 12 34'
      }
    ],
    hospitals: [
      {
        name: 'Cheikh Zaid Hospital',
        location: 'Rabat',
        phone: '+212 537 68 94 00',
        specialties: ['General', 'Emergency', 'Specialized care']
      },
      {
        name: 'Ibn Sina Hospital',
        location: 'Rabat',
        phone: '+212 537 67 37 37',
        specialties: ['University hospital', 'All specialties']
      },
      {
        name: 'Clinique du Sud',
        location: 'Marrakech',
        phone: '+212 524 44 79 99',
        specialties: ['Private clinic', 'Emergency', 'Tourist services']
      }
    ],
    emergencyNumbers: ['190 - Police', '150 - Ambulance', '15 - Fire', '177 - Tourist Police']
  };
}

// ====================== LOCAL CUSTOMS ======================

export function generateLocalCustoms(destinations: Destination[]) {
  return [
    {
      category: 'Greetings & Etiquette',
      dos: [
        'Greet with "Salam alaikum" (peace be upon you)',
        'Use right hand for eating and greetings',
        'Accept mint tea when offered'
      ],
      donts: [
        'Don\'t use left hand for eating',
        'Don\'t refuse hospitality',
        'Don\'t point with finger'
      ],
      tips: [
        'Handshake is common between men',
        'Women may nod instead of shaking hands',
        'Remove shoes when entering homes'
      ]
    },
    {
      category: 'Religious Customs',
      dos: [
        'Dress modestly near religious sites',
        'Remove shoes before entering mosques',
        'Be respectful during prayer times'
      ],
      donts: [
        'Don\'t enter mosques during prayer if non-Muslim',
        'Don\'t take photos inside mosques without permission',
        'Don\'t drink/eat publicly during Ramadan daytime'
      ],
      tips: [
        'Non-Muslims can visit Hassan II Mosque in Casablanca',
        'Friday is the Muslim holy day - some shops close',
        'Ramadan schedule affects restaurant hours'
      ]
    },
    {
      category: 'Shopping & Bargaining',
      dos: [
        'Bargain politely in souks',
        'Start at about 50% of asking price',
        'Smile and be friendly during negotiations'
      ],
      donts: [
        'Don\'t touch items unless interested',
        'Don\'t feel pressured to buy',
        'Don\'t argue aggressively about prices'
      ],
      tips: [
        'Fixed prices in supermarkets and malls',
        'Quality varies - examine items carefully',
        'Learn basic numbers in Arabic for bargaining'
      ]
    },
    {
      category: 'Food & Dining',
      dos: [
        'Eat with right hand if no utensils',
        'Try local specialties',
        'Say "Bismillah" (in God\'s name) before eating'
      ],
      donts: [
        'Don\'t eat or drink publicly during Ramadan daytime',
        'Don\'t waste food',
        'Don\'t refuse seconds if offered'
      ],
      tips: [
        'Street food is safe in busy areas',
        'Restaurants add 10% service charge',
        'Tipping 5-10% is appreciated'
      ]
    }
  ];
}

// ====================== FOOD GUIDE ======================

export function generateFoodGuide(
  destinations: Destination[],
  criteria: TripCriteria
) {
  const commonDishes = [
    {
      dish: 'Tagine',
      description: 'Slow-cooked stew with meat, vegetables, and spices',
      bestPlace: 'Traditional restaurants in medinas',
      priceRange: '$8-15'
    },
    {
      dish: 'Couscous',
      description: 'Steamed semolina with vegetables and meat, traditionally served on Fridays',
      bestPlace: 'Family restaurants and local homes',
      priceRange: '$7-12'
    },
    {
      dish: 'Pastilla',
      description: 'Sweet and savory pie with pigeon or chicken, almonds, and cinnamon',
      bestPlace: 'Fes and Meknes',
      priceRange: '$10-18'
    },
    {
      dish: 'Mechoui',
      description: 'Slow-roasted lamb, often for special occasions',
      bestPlace: 'Festivals and celebrations',
      priceRange: '$15-25'
    },
    {
      dish: 'Harira',
      description: 'Traditional soup with lentils, chickpeas, and tomatoes',
      bestPlace: 'During Ramadan for breaking fast',
      priceRange: '$3-5'
    }
  ];

  const dietaryOptions = criteria.dietaryRestrictions.map(restriction => {
    const options: Record<string, { availability: 'easy' | 'moderate' | 'difficult'; suggestions: string[] }> = {
      'vegetarian': {
        availability: 'easy',
        suggestions: ['Vegetable tagine', 'Couscous with vegetables', 'Salads', 'Bean dishes']
      },
      'vegan': {
        availability: 'moderate',
        suggestions: ['Vegetable couscous', 'Lentil soup', 'Salads', 'Fruit']
      },
      'gluten-free': {
        availability: 'moderate',
        suggestions: ['Grilled meats', 'Salads', 'Fruit', 'Rice dishes']
      },
      'halal': {
        availability: 'easy',
        suggestions: ['All meat is halal in Morocco']
      },
      'kosher': {
        availability: 'difficult',
        suggestions: ['Vegetarian options', 'Fresh fruit', 'Certified kosher restaurants in major cities']
      }
    };

    return {
      restriction,
      availability: options[restriction]?.availability || 'moderate',
      suggestions: options[restriction]?.suggestions || ['Ask restaurants about options']
    };
  });

  return destinations.map(destination => ({
    destination: destination.name.en,
    mustTry: commonDishes,
    dietaryOptions
  }));
}

// ====================== TRIP STATISTICS ======================

export function calculateTripStats(dayPlans: DayPlan[]) {
  const totalActivities = dayPlans.reduce((sum, day) => 
    sum + day.morning.length + day.afternoon.length + day.evening.length, 0);
  
  const activityHours = dayPlans.reduce((sum, day) => sum + day.totalActivityHours, 0);
  
  // Find busiest day (most activities)
  let busiestDay = 1;
  let maxActivities = 0;
  dayPlans.forEach(day => {
    const dayActivities = day.morning.length + day.afternoon.length + day.evening.length;
    if (dayActivities > maxActivities) {
      maxActivities = dayActivities;
      busiestDay = day.dayNumber;
    }
  });
  
  // Find most expensive day
  let mostExpensiveDay = 1;
  let maxCost = 0;
  dayPlans.forEach(day => {
    if (day.dailyCost.total > maxCost) {
      maxCost = day.dailyCost.total;
      mostExpensiveDay = day.dayNumber;
    }
  });
  
  // Calculate scores based on activities
  const culturalActivities = dayPlans.reduce((sum, day) => 
    sum + day.morning.concat(day.afternoon, day.evening)
      .filter(act => act.placeType === 'museum' || act.placeType === 'historical' || act.placeType === 'religious').length, 0);
  
  const adventureActivities = dayPlans.reduce((sum, day) => 
    sum + day.morning.concat(day.afternoon, day.evening)
      .filter(act => act.placeType === 'natural' || act.practicalInfo.difficulty === 'challenging').length, 0);
  
  const relaxationActivities = dayPlans.reduce((sum, day) => 
    sum + day.morning.concat(day.afternoon, day.evening)
      .filter(act => act.placeType === 'beach' || act.placeType === 'park').length, 0);
  
  return {
    totalWalkingDistance: dayPlans.length * 5, // Estimated 5km per day
    averageDailyActivities: totalActivities / dayPlans.length,
    busiestDay,
    mostExpensiveDay,
    culturalScore: Math.min(100, (culturalActivities / totalActivities) * 200),
    adventureScore: Math.min(100, (adventureActivities / totalActivities) * 200),
    relaxationScore: Math.min(100, (relaxationActivities / totalActivities) * 200)
  };
}
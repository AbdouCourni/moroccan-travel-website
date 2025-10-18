// lib/firebase-utils.ts
import { Timestamp } from 'firebase/firestore';

export function convertFirebaseData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Convert Timestamp to simple object
  if (data instanceof Timestamp) {
    return {
      seconds: data.seconds,
      nanoseconds: data.nanoseconds,
      isoString: data.toDate().toISOString() // Add ISO string for easy date usage
    };
  }

  if (Array.isArray(data)) {
    return data.map(item => convertFirebaseData(item));
  }

  if (typeof data === 'object') {
    const converted: any = {};
    for (const key in data) {
      converted[key] = convertFirebaseData(data[key]);
    }
    return converted;
  }

  return data;
}



// For Destination type
export function convertDestinationData(destination: any) {
  const converted = convertFirebaseData(destination);
  
  // Ensure dates are proper Date objects for destination
  if (converted.createdAt && !(converted.createdAt instanceof Date)) {
    converted.createdAt = new Date(converted.createdAt);
  }
  if (converted.updatedAt && !(converted.updatedAt instanceof Date)) {
    converted.updatedAt = new Date(converted.updatedAt);
  }
  
  return converted;
}

// For Place type  
export function convertPlaceData(place: any) {
  const converted = convertFirebaseData(place);
  
  // Ensure dates are proper Date objects for place
  if (converted.createdAt && !(converted.createdAt instanceof Date)) {
    converted.createdAt = new Date(converted.createdAt);
  }
  if (converted.updatedAt && !(converted.updatedAt instanceof Date)) {
    converted.updatedAt = new Date(converted.updatedAt);
  }
  
  return converted;
}

// Generic converter for any Firebase data
export function convertToPlainObject(data: any) {
  return convertFirebaseData(data);
}

// For Recipe type
export function convertRecipeData(recipe: any) {
  const converted = convertFirebaseData(recipe);
  
  // Ensure dates are proper Date objects for recipe
  if (converted.createdAt && !(converted.createdAt instanceof Date)) {
    converted.createdAt = new Date(converted.createdAt);
  }
  if (converted.updatedAt && !(converted.updatedAt instanceof Date)) {
    converted.updatedAt = new Date(converted.updatedAt);
  }
  
  // Ensure nutrition object exists and has proper structure
  if (!converted.nutrition) {
    converted.nutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };
  }
  
  // Ensure restrictions object exists and has proper structure
  if (!converted.restrictions) {
    converted.restrictions = {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      spicy: false
    };
  }
  
  // Ensure arrays exist and are properly formatted
  if (!converted.ingredients) {
    converted.ingredients = { en: [], fr: [], ar: [], es: [] };
  }
  
  if (!converted.instructions) {
    converted.instructions = { en: [], fr: [], ar: [], es: [] };
  }
  
  if (!converted.tags) {
    converted.tags = [];
  }
  
  // Ensure multilingual fields have fallbacks
  if (!converted.title) {
    converted.title = { en: '', fr: '', ar: '', es: '' };
  }
  
  if (!converted.description) {
    converted.description = { en: '', fr: '', ar: '', es: '' };
  }
  
  // Ensure required fields have defaults
  if (!converted.category) converted.category = 'Main Course';
  if (!converted.difficulty) converted.difficulty = 'Medium';
  if (!converted.preparationTime) converted.preparationTime = 0;
  if (!converted.cookingTime) converted.cookingTime = 0;
  if (!converted.servings) converted.servings = 4;
  if (!converted.image) converted.image = '';
  if (!converted.origin) converted.origin = '';
  
  return converted;
}
//---------------------------------------------------------
// import { Timestamp } from 'firebase/firestore';

// export function convertFirebaseData(data: any): any {
//   if (data === null || data === undefined) {
//     return data;
//   }

//   // Convert Timestamp to Date object
//   if (data instanceof Timestamp) {
//     return data.toDate();
//   }

//   if (Array.isArray(data)) {
//     return data.map(item => convertFirebaseData(item));
//   }

//   if (typeof data === 'object') {
//     const converted: any = {};
//     for (const key in data) {
//       converted[key] = convertFirebaseData(data[key]);
//     }
//     return converted;
//   }

//   return data;
// }
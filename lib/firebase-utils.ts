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

// // For Destination type
// export function convertDestinationData(destination: any) {
//   const converted = convertFirebaseData(destination);
  
//   // Ensure dates are proper Date objects for destination
//   if (converted.createdAt && !(converted.createdAt instanceof Date)) {
//     converted.createdAt = new Date(converted.createdAt);
//   }
//   if (converted.updatedAt && !(converted.updatedAt instanceof Date)) {
//     converted.updatedAt = new Date(converted.updatedAt);
//   }
  
//   return converted;
// }

// // For Place type  
// export function convertPlaceData(place: any) {
//   const converted = convertFirebaseData(place);
  
//   // Ensure dates are proper Date objects for place
//   if (converted.createdAt && !(converted.createdAt instanceof Date)) {
//     converted.createdAt = new Date(converted.createdAt);
//   }
//   if (converted.updatedAt && !(converted.updatedAt instanceof Date)) {
//     converted.updatedAt = new Date(converted.updatedAt);
//   }
  
//   return converted;
// }

// // Generic converter for any Firebase data
// export function convertToPlainObject(data: any) {
//   return convertFirebaseData(data);
// }
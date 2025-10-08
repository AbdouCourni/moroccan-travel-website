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
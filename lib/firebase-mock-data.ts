// lib/firebase-mock-data.ts
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export const mockAccommodations = [
  {
    name: { en: 'Luxury Riad in Medina', fr: 'Riad de Luxe dans la Médina', ar: 'رياض فاخر في المدينة', es: 'Riad de Lujo en la Medina' },
    type: 'riad',
    price: { nightly: 120, currency: 'USD' },
    rating: 4.8,
    reviewCount: 156,
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400'],
    amenities: ['Pool', 'Breakfast', 'WiFi', 'Spa'],
    location: { address: 'Medina Center', coordinates: { lat: 31.6295, lng: -7.9811 } },
    isVerified: true,
    maxGuests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'flexible',
    affiliateUrls: {
      booking: 'https://www.booking.com/hotel/ma/luxury-riad.html',
      airbnb: 'https://www.airbnb.com/rooms/luxury-riad'
    }
  },
  {
    name: { en: 'Desert Camp Experience', fr: 'Expérience de Camp dans le Désert', ar: 'تجربة المخيم الصحراوي', es: 'Experiencia de Campamento en el Desierto' },
    type: 'desert_camp',
    price: { nightly: 80, currency: 'USD' },
    rating: 4.9,
    reviewCount: 203,
    images: ['https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400'],
    amenities: ['Camel Ride', 'Dinner', 'Bonfire', 'Stargazing'],
    location: { address: 'Sahara Desert', coordinates: { lat: 31.1029, lng: -3.9989 } },
    isVerified: true,
    maxGuests: 6,
    bedrooms: 1,
    beds: 4,
    bathrooms: 1,
    checkInTime: '15:00',
    checkOutTime: '10:00',
    cancellationPolicy: 'moderate',
    affiliateUrls: {
      booking: 'https://www.booking.com/hotel/ma/desert-camp.html',
      expedia: 'https://www.expedia.com/Merzouga-Hotels-Desert-Camp'
    }
  },
  {
    name: { en: 'Modern City Apartment', fr: 'Appartement Moderne en Ville', ar: 'شقة عصرية في المدينة', es: 'Apartamento Moderno en la Ciudad' },
    type: 'apartment',
    price: { nightly: 65, currency: 'USD' },
    rating: 4.6,
    reviewCount: 89,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'],
    amenities: ['Kitchen', 'WiFi', 'Parking', 'Balcony'],
    location: { address: 'City Center', coordinates: { lat: 31.6295, lng: -7.9811 } },
    isVerified: true,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'strict',
    affiliateUrls: {
      booking: 'https://www.booking.com/hotel/ma/modern-apartment.html',
      airbnb: 'https://www.airbnb.com/rooms/modern-apartment'
    }
  }
];

export const mockTransportation = [
  {
    name: { en: 'ONCF Train', fr: 'Train ONCF', ar: 'قطار ONCF', es: 'Tren ONCF' },
    type: 'train',
    description: { en: 'Comfortable rail service connecting major cities', fr: 'Service ferroviaire confortable reliant les grandes villes', ar: 'خدمة السكك الحديدية المريحة تربط المدن الكبرى', es: 'Servicio de tren cómodo que conecta las principales ciudades' },
    price: { amount: 15, currency: 'USD', period: 'per trip' },
    duration: { en: '3 hours from Casablanca', fr: '3 heures de Casablanca', ar: '3 ساعات من الدار البيضاء', es: '3 horas desde Casablanca' },
    image: 'https://i.imgur.com/0ZiwMT4.png',
    affiliateUrl: 'https://www.oncf.ma/en/',
    bookingUrl: 'https://www.trainline.com/trains/morocco'
  },
  {
    name: { en: 'CTM Bus', fr: 'Bus CTM', ar: 'حافلة CTM', es: 'Autobús CTM' },
    type: 'bus',
    description: { en: 'Reliable bus service throughout Morocco', fr: 'Service de bus fiable dans tout le Maroc', ar: 'خدمة حافلات موثوقة في جميع أنحاء المغرب', es: 'Servicio de autobús confiable en todo Marruecos' },
    price: { amount: 10, currency: 'USD', period: 'per trip' },
    duration: { en: '4 hours from Casablanca', fr: '4 heures de Casablanca', ar: '4 ساعات من الدار البيضاء', es: '4 horas desde Casablanca' },
    image: 'https://i.imgur.com/1GNiZJ0.png',
    affiliateUrl: 'https://www.ctm.ma/en',
    bookingUrl: 'https://www.busbud.com/morocco'
  },
  {
    name: { en: 'Car Rental', fr: 'Location de Voiture', ar: 'تأجير سيارات', es: 'Alquiler de Coches' },
    type: 'car_rental',
    description: { en: 'Freedom to explore at your own pace', fr: 'Liberté d\'explorer à votre rythme', ar: 'حرية الاستكشاف بالسرعة التي تناسبك', es: 'Libertad para explorar a tu propio ritmo' },
    price: { amount: 25, currency: 'USD', period: 'per day' },
    duration: { en: 'Flexible', fr: 'Flexible', ar: 'مرن', es: 'Flexible' },
    image: 'https://i.imgur.com/v0t9HvX.png',
    affiliateUrl: 'https://www.discovercars.com/morocco',
    bookingUrl: 'https://www.rentalcars.com/morocco'
  }
];

export const mockActivities = [
  {
    name: { en: 'Camel Trek in Sahara', fr: 'Randonnée à Chameau dans le Sahara', ar: 'ركوب الجمال في الصحراء', es: 'Excursión en Camello en el Sahara' },
    description: { en: 'Sunset camel ride with traditional dinner', fr: 'Promenade à chameau au coucher du soleil avec dîner traditionnel', ar: 'ركوب الجمال عند غروب الشمس مع عشاء تقليدي', es: 'Paseo en camello al atardecer con cena tradicional' },
    price: { amount: 45, currency: 'USD', period: 'per person' },
    duration: { en: '3 hours', fr: '3 heures', ar: '3 ساعات', es: '3 horas' },
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400',
    rating: 4.9,
    type: 'desert_tour',
    affiliateUrl: 'https://www.getyourguide.com/morocco-camel-trek'
  },
  {
    name: { en: 'Cooking Class', fr: 'Cours de Cuisine', ar: 'دروس الطبخ', es: 'Clase de Cocina' },
    description: { en: 'Learn to make authentic Moroccan tagine', fr: 'Apprenez à préparer un tajine marocain authentique', ar: 'تعلم كيفية صنع الطاجن المغربي الأصيل', es: 'Aprende a hacer auténtico tagine marroquí' },
    price: { amount: 35, currency: 'USD', period: 'per person' },
    duration: { en: '4 hours', fr: '4 heures', ar: '4 ساعات', es: '4 horas' },
    image: 'https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1?w=400',
    rating: 4.8,
    type: 'cooking_class',
    affiliateUrl: 'https://www.airbnb.com/experiences/moroccan-cooking'
  },
  {
    name: { en: 'Atlas Mountains Hiking', fr: 'Randonnée dans les Montagnes de l\'Atlas', ar: 'المشي لمسافات طويلة في جبال الأطلس', es: 'Senderismo en las Montañas del Atlas' },
    description: { en: 'Day trip to Imlil valley and Berber villages', fr: 'Excursion d\'une journée dans la vallée d\'Imlil et les villages berbères', ar: 'رحلة ليوم واحد إلى وادي إمليل والقرى البربرية', es: 'Excursión de un día al valle de Imlil y pueblos bereberes' },
    price: { amount: 50, currency: 'USD', period: 'per person' },
    duration: { en: '8 hours', fr: '8 heures', ar: '8 ساعات', es: '8 horas' },
    image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400',
    rating: 4.7,
    type: 'adventure',
    affiliateUrl: 'https://www.getyourguide.com/atlas-mountains-hiking'
  }
];

// Function to seed data to Firebase
export async function seedMockData() {
  try {
    // Seed accommodations
    const accommodationsRef = collection(db, 'accommodations');
    for (const acc of mockAccommodations) {
      await addDoc(accommodationsRef, {
        ...acc,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    console.log('Accommodations seeded');

    // Seed transportation
    const transportRef = collection(db, 'transportation');
    for (const trans of mockTransportation) {
      await addDoc(transportRef, {
        ...trans,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    console.log('Transportation seeded');

    // Seed activities
    const activitiesRef = collection(db, 'activities');
    for (const act of mockActivities) {
      await addDoc(activitiesRef, {
        ...act,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    console.log('Activities seeded');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
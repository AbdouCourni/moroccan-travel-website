// app/destinations/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDestinationBySlug, getPlacesByDestination, getPopularPlaces } from '../../../../lib/firebase-server';
import { DestinationGallery } from '../../../../components/DestinationGallery';
import { ImageSlider } from '../../../../components/ImageSlider';
import { PlacesGrid } from '../../../../components/PlacesGrid';
import { AccommodationCard } from '../../../../components/AccommodationCard';
import { ActivityCard } from '../../../../components/ActivityCard';
import { MapPin, Calendar, Star, Navigation, Home, Car, Bus, Utensils, Mountain, Camera } from 'lucide-react';
import { detectLanguage, getLocalizedText } from '../../../../lib/language-server';
import { convertFirebaseData } from '../../../../lib/firebase-utils';

// Server-side translations
const translations = {
  en: {
    backToDestinations: 'Back to Destinations',
    atAGlance: 'At a Glance',
    bestTimeToVisit: 'Best Time to Visit',
    topActivities: 'Top Activities',
    popularPlaces: 'Popular Places',
    attractions: 'attractions',
    yearRound: 'Year-round',
    placesToVisit: 'Places to Visit',
    mustVisitIn: 'Must-Visit Places in',
    discoverTopAttractions: 'Discover the top attractions, restaurants, and hidden gems',
    viewAllPlaces: 'View All Places',
    whereToStay: 'Where to Stay',
    findPerfectAccommodation: 'Find the perfect accommodation for your Moroccan adventure',
    browseAllAccommodations: 'Browse All Accommodations',
    gettingTo: 'Getting to',
    chooseBestWay: 'Choose the best way to reach and explore this destination',
    thingsToDo: 'Things to Do',
    experienceBestActivities: 'Experience the best activities and adventures',
    discover: 'Discover',
    exploreBeauty: 'Explore the beauty and charm through these stunning visuals',
    readyToExplore: 'Ready to explore more of Morocco\'s wonders?'
  },
  fr: {
    backToDestinations: 'Retour aux destinations',
    atAGlance: 'En un coup d\'œil',
    bestTimeToVisit: 'Meilleure période pour visiter',
    topActivities: 'Activités principales',
    popularPlaces: 'Lieux populaires',
    attractions: 'attractions',
    yearRound: 'Toute l\'année',
    placesToVisit: 'Lieux à visiter',
    mustVisitIn: 'Lieux incontournables à',
    discoverTopAttractions: 'Découvrez les principales attractions, restaurants et joyaux cachés',
    viewAllPlaces: 'Voir tous les lieux',
    whereToStay: 'Où séjourner',
    findPerfectAccommodation: 'Trouvez l\'hébergement parfait pour votre aventure marocaine',
    browseAllAccommodations: 'Parcourir tous les hébergements',
    gettingTo: 'Se rendre à',
    chooseBestWay: 'Choisissez la meilleure façon d\'atteindre et d\'explorer cette destination',
    thingsToDo: 'Choses à faire',
    experienceBestActivities: 'Vivez les meilleures activités et aventures',
    discover: 'Découvrir',
    exploreBeauty: 'Explorez la beauté et le charme à travers ces visuels époustouflants',
    readyToExplore: 'Prêt à explorer plus de merveilles du Maroc ?'
  },
  ar: {
    backToDestinations: 'العودة إلى الوجهات',
    atAGlance: 'نظرة سريعة',
    bestTimeToVisit: 'أفضل وقت للزيارة',
    topActivities: 'أفضل الأنشطة',
    popularPlaces: 'الأماكن الشعبية',
    attractions: 'معالم جذب',
    yearRound: 'طوال العام',
    placesToVisit: 'أماكن للزيارة',
    mustVisitIn: 'أماكن يجب زيارتها في',
    discoverTopAttractions: 'اكتشف أهم المعالم والمطاعم والكنوز المخفية',
    viewAllPlaces: 'عرض جميع الأماكن',
    whereToStay: 'أين تقيم',
    findPerfectAccommodation: 'ابحث عن الإقامة المثالية لمغامرتك المغربية',
    browseAllAccommodations: 'تصفح جميع أماكن الإقامة',
    gettingTo: 'الوصول إلى',
    chooseBestWay: 'اختر أفضل طريقة للوصول واستكشاف هذه الوجهة',
    thingsToDo: 'أشياء للقيام بها',
    experienceBestActivities: 'جرب أفضل الأنشطة والمغامرات',
    discover: 'اكتشف',
    exploreBeauty: 'استكشف الجمال والسحر من خلال هذه الصور المذهلة',
    readyToExplore: 'مستعد لاكتشاف المزيد من عجائب المغرب؟'
  },
  es: {
    backToDestinations: 'Volver a destinos',
    atAGlance: 'De un vistazo',
    bestTimeToVisit: 'Mejor época para visitar',
    topActivities: 'Principales actividades',
    popularPlaces: 'Lugares populares',
    attractions: 'atracciones',
    yearRound: 'Todo el año',
    placesToVisit: 'Lugares para visitar',
    mustVisitIn: 'Lugares imprescindibles en',
    discoverTopAttractions: 'Descubre las principales atracciones, restaurantes y joyas ocultas',
    viewAllPlaces: 'Ver todos los lugares',
    whereToStay: 'Dónde alojarse',
    findPerfectAccommodation: 'Encuentra el alojamiento perfecto para tu aventura marroquí',
    browseAllAccommodations: 'Ver todos los alojamientos',
    gettingTo: 'Cómo llegar a',
    chooseBestWay: 'Elige la mejor manera de llegar y explorar este destino',
    thingsToDo: 'Cosas que hacer',
    experienceBestActivities: 'Experimenta las mejores actividades y aventuras',
    discover: 'Descubrir',
    exploreBeauty: 'Explora la belleza y el encanto a través de estas impresionantes imágenes',
    readyToExplore: '¿Listo para explorar más maravillas de Marruecos?'
  }
};

// Mock data (same as before)
const mockAccommodations = [
  // ... your mock accommodations data
  {
    id: '1',
    name: 'Luxury Riad in Medina',
    type: 'riad',
    price: 120,
    rating: 4.8,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    amenities: ['Pool', 'Breakfast', 'WiFi', 'Spa'],
    location: 'Medina Center'
  },
  {
    id: '2',
    name: 'Desert Camp Experience',
    type: 'desert_camp',
    price: 80,
    rating: 4.9,
    reviewCount: 203,
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400',
    amenities: ['Camel Ride', 'Dinner', 'Bonfire', 'Stargazing'],
    location: 'Sahara Desert'
  },
  {
    id: '3',
    name: 'Modern City Apartment',
    type: 'apartment',
    price: 65,
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    amenities: ['Kitchen', 'WiFi', 'Parking', 'Balcony'],
    location: 'City Center'
  }
];

const mockTransportation = [
  // ... your mock transportation data
   {
    type: 'train',
    name: 'ONCF Train',
    description: 'Comfortable rail service connecting major cities',
    price: 'From $15',
    duration: '3 hours from Casablanca',
    image: 'https://images.unsplash.com/photo-1599661048171-5d5c0dea5acf?w=300'
  },
  {
    type: 'bus',
    name: 'CTM Bus',
    description: 'Reliable bus service throughout Morocco',
    price: 'From $10',
    duration: '4 hours from Casablanca',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300'
  },
  {
    type: 'car_rental',
    name: 'Car Rental',
    description: 'Freedom to explore at your own pace',
    price: 'From $25/day',
    duration: 'Flexible',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300'
  }
];

export default async function DestinationPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const slug = params.slug;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  // Detect language from search params
  const langParam = searchParams.lang as string;
  const language = await detectLanguage();
  const currentLanguage = (['en', 'fr', 'ar', 'es'].includes(langParam) ? langParam : language) as 'en' | 'fr' | 'ar' | 'es';

  // Get places for this destination
  const places = await getPlacesByDestination(destination.id, 6);
  const popularPlaces = await getPopularPlaces(destination.id, 3);

  // Convert Firebase data to plain objects
  const convertedPlaces = convertFirebaseData(places);

  // Get localized content
  const displayName = getLocalizedText(destination.name, currentLanguage);
  const displayDescription = getLocalizedText(destination.description, currentLanguage);
  const regionName = getLocalizedText(destination.region, currentLanguage);

  const t = (key: keyof typeof translations.en) => translations[currentLanguage]?.[key] || translations.en[key];

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Hero Section with Image Slider */}
      <section className="relative h-[70vh] min-h-[600px]">
        {destination.images && destination.images.length > 1 ? (
          <ImageSlider images={destination.images} alt={displayName} />
        ) : (
          <div className="absolute inset-0">
            <img 
              src={destination.images?.[0] || '/images/placeholder.jpg'} 
              alt={displayName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>
        )}
        
        {/* Floating Header */}
        <div className="relative z-10 pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              href="/destinations" 
              className="inline-flex items-center text-white/90 hover:text-white transition-colors backdrop-blur-sm bg-white/10 rounded-full px-4 py-2 border border-white/20"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {t('backToDestinations')}
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg font-medium">{regionName}</span>
                </div>
                <h1 className="font-amiri text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight">
                  {displayName}
                </h1>
                <p className="text-xl md:text-2xl max-w-3xl leading-relaxed opacity-95">
                  {displayDescription}
                </p>
              </div>
              
              {/* Quick Facts */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white max-w-md">
                <h3 className="font-amiri text-2xl font-bold mb-4">{t('atAGlance')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{t('bestTimeToVisit')}</div>
                      <div className="text-sm opacity-90">
                        {destination.bestSeason?.join(', ') || t('yearRound')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5" />
                    <div>
                      <div className="font-medium">{t('topActivities')}</div>
                      <div className="text-sm opacity-90">
                        {destination.activities?.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>
                  {popularPlaces.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Camera className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{t('popularPlaces')}</div>
                        <div className="text-sm opacity-90">
                          {popularPlaces.length}+ {t('attractions')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto py-4 space-x-8">
            <a href="#places" className="flex items-center gap-2 whitespace-nowrap text-gray-600 hover:text-primary-gold transition-colors">
              <MapPin className="w-4 h-4" />
              {t('placesToVisit')}
            </a>
            <a href="#accommodation" className="flex items-center gap-2 whitespace-nowrap text-gray-600 hover:text-primary-gold transition-colors">
              <Home className="w-4 h-4" />
              {t('whereToStay')}
            </a>
            <a href="#transport" className="flex items-center gap-2 whitespace-nowrap text-gray-600 hover:text-primary-gold transition-colors">
              <Car className="w-4 h-4" />
              {t('gettingTo')} {displayName}
            </a>
            <a href="#activities" className="flex items-center gap-2 whitespace-nowrap text-gray-600 hover:text-primary-gold transition-colors">
              <Mountain className="w-4 h-4" />
              {t('thingsToDo')}
            </a>
            <a href="#gallery" className="flex items-center gap-2 whitespace-nowrap text-gray-600 hover:text-primary-gold transition-colors">
              <Camera className="w-4 h-4" />
              {t('discover')}
            </a>
          </nav>
        </div>
      </section>

      {/* Places to Visit Section */}
     {convertedPlaces.length > 0 && (
  <section id="places" className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h2 className="font-amiri text-4xl font-bold text-gray-900 mb-4">
          {t('mustVisitIn')} {displayName}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl">
          {t('discoverTopAttractions')}
        </p>
      </div>

      {/* Pass converted places instead of raw places */}
      <PlacesGrid places={convertedPlaces} slug={destination.slug} />

      {/* Moved button under PlacesGrid, aligned to right */}
      <div className="flex justify-end mt-8">
        <Link
          href={`/destinations/${destination.slug}/places`}
          className="bg-primary-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-300 border-green-600 border-1"
        >
          {t('viewAllPlaces')}
        </Link>
      </div>
    </div>
  </section>
)}

      {/* Accommodation Section */}
      <section id="accommodation" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-amiri text-4xl font-bold text-dark-charcoal mb-4">
              {t('whereToStay')} {displayName}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('findPerfectAccommodation')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockAccommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href={`/stays?city=${destination.slug}`}
              className="bg-primary-gold text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition duration-300 inline-block"
            >
              {t('browseAllAccommodations')}
            </Link>
          </div>
        </div>
      </section>

      {/* Transportation Section */}
      <section id="transport" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-amiri text-4xl font-bold text-dark-charcoal mb-4">
              {t('gettingTo')} {displayName}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('chooseBestWay')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTransportation.map((transport, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={transport.image} 
                    alt={transport.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {transport.type === 'train' && <Bus className="w-6 h-6 text-moroccan-blue" />}
                    {transport.type === 'bus' && <Bus className="w-6 h-6 text-primary-gold" />}
                    {transport.type === 'car_rental' && <Car className="w-6 h-6 text-green-600" />}
                    <h3 className="font-amiri text-xl font-bold text-dark-charcoal">{transport.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{transport.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary-gold">{transport.price}</span>
                    <span className="text-sm text-gray-500">{transport.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      {destination.activities && destination.activities.length > 0 && (
        <section id="activities" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-amiri text-4xl font-bold text-dark-charcoal mb-4">
                {t('thingsToDo')} {displayName}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('experienceBestActivities')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destination.activities.map((activity, index) => (
                <ActivityCard key={index} activity={activity} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {destination.images && destination.images.length > 1 && (
        <section id="gallery" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-amiri text-4xl font-bold text-dark-charcoal mb-4">
                {t('discover')} {displayName}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('exploreBeauty')}
              </p>
            </div>
            <DestinationGallery images={destination.images} destinationName={displayName} />
          </div>
        </section>
      )}

      {/* Bottom Navigation */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <Link 
              href="/destinations" 
              className="flex items-center gap-3 text-moroccan-blue hover:text-primary-gold transition-colors font-semibold"
            >
              <Navigation className="w-5 h-5 rotate-180" />
              {t('backToDestinations')}
            </Link>
            <div className="text-gray-500 text-sm">
              {t('readyToExplore')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
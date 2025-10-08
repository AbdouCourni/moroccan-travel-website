// components/AccommodationCard.tsx
import { Star, MapPin } from 'lucide-react';

interface Accommodation {
  id: string;
  name: string;
  type: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  amenities: string[];
  location: string;
}

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export function AccommodationCard({ accommodation }: AccommodationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={accommodation.image} 
          alt={accommodation.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-amiri text-xl font-bold text-dark-charcoal">{accommodation.name}</h3>
          <div className="flex items-center gap-1 bg-primary-gold text-white px-2 py-1 rounded text-sm">
            <Star className="w-3 h-3 fill-current" />
            <span>{accommodation.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{accommodation.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-gold">${accommodation.price}</span>
          <span className="text-sm text-gray-500">{accommodation.reviewCount} reviews</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {accommodation.amenities.slice(0, 3).map((amenity, index) => (
            <span 
              key={index}
              className="text-xs bg-desert-sand text-dark-charcoal px-2 py-1 rounded"
            >
              {amenity}
            </span>
          ))}
        </div>
        
        <button className="w-full mt-4 bg-moroccan-blue text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition duration-300">
          View Details
        </button>
      </div>
    </div>
  );
}
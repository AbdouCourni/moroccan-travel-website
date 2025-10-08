// components/DestinationGallery.tsx
'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DestinationGalleryProps {
  images: string[];
  destinationName: string;
}

export function DestinationGallery({ images, destinationName }: DestinationGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedImage(index);
  const closeModal = () => setSelectedImage(null);
  const nextImage = () => setSelectedImage(prev => prev !== null ? (prev + 1) % images.length : null);
  const prevImage = () => setSelectedImage(prev => prev !== null ? (prev - 1 + images.length) % images.length : null);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={index}
            className="aspect-square rounded-xl rounded-lg cursor-pointer group "
            onClick={() => openModal(index)}
          >
            <img 
              src={image} 
              alt={`${destinationName} ${index + 1}`}
              className="w-full h-full group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-4xl max-h-full">
            <img 
              src={images[selectedImage]} 
              alt={`${destinationName} ${selectedImage + 1}`}
              className=""
            />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
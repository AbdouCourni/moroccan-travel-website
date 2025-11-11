"use client";

import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

export default function PlaceGallery({
  images,
  displayName,
}: {
  images: string[];
  displayName: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length <= 1) return null;

  return (
    <div className="mb-8">
      <h3 className="font-amiri text-2xl font-bold text-gray-900 mb-4" >
        Gallery
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.slice(1).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${displayName} ${index + 2}`}
            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setLightboxIndex(index + 1)} // shift index
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          setIndex={setLightboxIndex}
        />
      )}
    </div>
  );
}

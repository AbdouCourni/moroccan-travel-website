// components/ImageLightbox.tsx
"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageLightbox({
  images,
  index,
  onClose,
  setIndex,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  setIndex: (i: number) => void;
}) {
  const current = images[index];

  const showPrev = () =>
    setIndex(index - 1 < 0 ? images.length - 1 : index - 1);
  const showNext = () =>
    setIndex(index + 1 >= images.length ? 0 : index + 1);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <div
      className="
        fixed left-0 right-0 bottom-0
        top-[var(--header-height)]
        bg-black/80 backdrop-blur-sm
        z-[9999]
        flex items-center justify-center
      "
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2 transition-all hover:scale-110 z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev */}
      <button
        className="
          absolute left-4 text-white hover:text-gray-300
          p-2 rounded-full bg-black/50 transition-all hover:scale-110
        "
        onClick={showPrev}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      {/* Image - Made smaller height */}
      <img
        src={current}
        alt=""
        className="
          max-h-[80vh]
          max-w-[85vw]
          object-contain rounded-lg
          transition-all
        "
      />

      {/* Next */}
      <button
        className="
          absolute right-4 text-white hover:text-gray-300
          p-2 rounded-full bg-black/50 transition-all hover:scale-110
        "
        onClick={showNext}
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
}
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
        className="absolute top-3 right-4 text-white hover:text-gray-300"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Prev */}
      <button
        className="
          absolute left-4 text-white hover:text-gray-300
          p-2 rounded-full
        "
        onClick={showPrev}
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      {/* Image */}
      <img
        src={current}
        alt=""
        className="
          max-h-[calc(100vh-var(--header-height)-40px)]
          max-w-[90vw]
          object-contain rounded-lg
          transition-all
        "
      />

      {/* Next */}
      <button
        className="
          absolute right-4 text-white hover:text-gray-300
          p-2 rounded-full
        "
        onClick={showNext}
      >
        <ChevronRight className="w-10 h-10" />
      </button>
    </div>
  );
}

//----------------------------add just close is a better ui
// components/ImageLightbox.tsx
// 'use client';

// import { useEffect } from 'react';
// import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// export default function ImageLightbox({
//   images, index, onClose, setIndex,
// }: {
//   images: string[]; index: number; onClose: () => void; setIndex: (i: number) => void;
// }) {
//   const current = images[index];
//   const showPrev = () => setIndex(index - 1 < 0 ? images.length - 1 : index - 1);
//   const showNext = () => setIndex(index + 1 >= images.length ? 0 : index + 1);

//   useEffect(() => {
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//       if (e.key === 'ArrowRight') showNext();
//       if (e.key === 'ArrowLeft') showPrev();
//     };
//     window.addEventListener('keydown', handleKey);
//     return () => window.removeEventListener('keydown', handleKey);
//   }, [index]); // eslint-disable-line

//   return (
//     <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
//       {/* offset for header height (adjust if your header is taller) */}
//       <div className="relative h-full pt-16 flex items-center justify-center">
//         <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={onClose}>
//           <X className="w-8 h-8" />
//         </button>

//         <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300" onClick={showPrev}>
//           <ChevronLeft className="w-10 h-10" />
//         </button>

//         <img src={current} alt="" className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg" />

//         <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300" onClick={showNext}>
//           <ChevronRight className="w-10 h-10" />
//         </button>
//       </div>
//     </div>
//   );
// }

//-------------------------------

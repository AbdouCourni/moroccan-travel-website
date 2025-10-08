'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => setIsVideoLoaded(true));
      
      // Try to play the video (autoplay might be blocked by browsers)
      const playVideo = async () => {
        try {
          await video.play();
        } catch (err) {
          // Autoplay was prevented, show fallback or handle gracefully
          console.log('Autoplay prevented, showing fallback');
        }
      };
      playVideo();
    }
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1549923297-504c55940e0b?w=1200" // Fallback image
        >
          <source src="https://cdn.pixabay.com/video/2021/10/22/92837-638016606_large.mp4" type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <img 
            src="https://images.unsplash.com/photo-1549923297-504c55940e0b?w=1200" 
            alt="Morocco landscape" 
            className="w-full h-full object-cover"
          />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-moroccan-blue/60 to-primary-gold/40"></div>

        {/* Loading Fallback */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-moroccan-blue to-primary-gold flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading amazing Morocco views...</p>
            </div>
          </div>
        )}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="font-amiri text-5xl md:text-7xl lg:text-8xl font-bold mb-6 fade-in">
          Discover Morocco
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl mb-8 leading-relaxed fade-in" style={{animationDelay: '0.2s'}}>
          From the Atlas Mountains to the Sahara Desert, experience the magic of Morocco&apos;s rich culture
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in" style={{animationDelay: '0.4s'}}>
          <Link href="/destinations" className="btn-primary text-center text-lg px-8 py-4">
            Explore Destinations
          </Link>
          <Link href="/stays" className="btn-secondary text-center text-lg px-8 py-4">
            Find Stays
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
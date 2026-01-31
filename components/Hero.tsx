//components/Hero.tsx
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react'; // You'll need to install lucide-react if not already

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoLoad = () => {
      setIsVideoLoaded(true);
      setVideoError(false);
    };

    const handleVideoError = () => {
      console.log('Video failed to load');
      setVideoError(true);
      setIsVideoLoaded(true); // Stop loading spinner
    };

    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('canplay', handleVideoLoad);

    // Mobile-specific video handling
    const playVideo = async () => {
      try {
        // Ensure video is muted for autoplay on mobile
        video.muted = true;
        video.playsInline = true;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video autoplay started');
            })
            .catch(error => {
              console.log('Autoplay prevented:', error);
              // Show fallback image but don't set error state
              // Let the video load normally for manual play
            });
        }
      } catch (err) {
        console.log('Video play error:', err);
      }
    };

    // Try to play after a short delay
    const timeoutId = setTimeout(playVideo, 1000);

    return () => {
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('canplay', handleVideoLoad);
      clearTimeout(timeoutId);
    };
  }, []);

  // Fallback image URL (using a reliable Unsplash source)
  const fallbackImage = "https://images.unsplash.com/photo-1543348750-466b55f32f3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background with Fallback */}
      <div className="absolute inset-0 w-full h-full">
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            poster={fallbackImage}
            onError={() => setVideoError(true)}
          >
            {/* Multiple video sources for better compatibility */}
            <source 
              src="/moroccoVibes.mp4" 
              type="video/mp4" 
            />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
        ) : (
          // Fallback image when video fails
          <img 
            src={fallbackImage}
            alt="Beautiful Morocco landscape" 
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-moroccan-blue/70 to-primary-gold/50"></div>

        {/* Loading Fallback */}
        {!isVideoLoaded && !videoError && (
          <div className="absolute inset-0 bg-gradient-to-r from-moroccan-blue to-primary-gold flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">Loading amazing Morocco views...</p>
            </div>
          </div>
        )}
      </div>

    {/* Hero Content */}
<div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
  <h1 className="font-amiri text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
    Discover Morocco
  </h1>
  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-2">
    From the Atlas Mountains to the Sahara Desert, experience the magic of Morocco&apos;s rich culture
  </p>
  
  {/* Main Button Row */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4">
    <Link 
      href="/destinations" 
      className="btn-primary text-center text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-w-[200px] sm:min-w-0"
    >
      Explore Destinations
    </Link>
    <Link 
      href="/stays" 
      className="btn-secondary text-center text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 min-w-[200px] sm:min-w-0"
    >
      Find Stays
    </Link>
  </div>

  {/* AI Button Below */}
  <div className="mt-4">
    <Link 
      href="/ai-trip-planner" 
      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
    >
      <Sparkles className="w-5 h-5" />
      Let AI Plan My Trip
    </Link>
  </div>
</div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
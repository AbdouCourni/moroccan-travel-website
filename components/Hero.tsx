'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, memo, useMemo, useCallback } from 'react';
import { Sparkles, Search, ArrowDown, Play, Pause, Volume2, VolumeX, MapPin, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { searchPlaces, getDestinations } from '../lib/firebase-server';
import { Destination, Place } from '../types';
import Image from 'next/image';

interface HeroProps {
  lang?: 'en' | 'fr' | 'ar' | 'es';
}

interface SearchSuggestion {
  id: string;
  name: string;
  type: 'destination' | 'place';
  slug?: string;
  destinationId?: string;
  region?: string;
  image?: string;
  description?: string;
}

const Hero = memo(function Hero({ lang = 'en' }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showControls, setShowControls] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const router = useRouter();
  const { language } = useLanguage();

  // Fetch suggestions when search query changes (2+ characters)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        // Search in destinations and places
        const [destinations, places] = await Promise.all([
          getDestinations(20),
          searchPlaces(searchQuery, undefined, 20)
        ]);

        const destinationSuggestions: SearchSuggestion[] = destinations
          .filter(dest => {
            const name = dest.name[language] || dest.name.en;
            return name.toLowerCase().includes(searchQuery.toLowerCase());
          })
          .slice(0, 5)
          .map(dest => ({
            id: dest.id,
            name: dest.name[language] || dest.name.en,
            type: 'destination',
            slug: dest.slug,
            region: dest.region,
            image: dest.images?.[0],
            description: dest.description[language] || dest.description.en
          }));

        const placeSuggestions: SearchSuggestion[] = places
          .slice(0, 5)
          .map(place => ({
            id: place.id,
            name: place.name[language] || place.name.en,
            type: 'place',
            slug: place.slug,
            destinationId: place.destinationId,
            image: place.images?.[0],
            description: place.description[language] || place.description.en
          }));

        // Combine and deduplicate results
        const combined = [...destinationSuggestions, ...placeSuggestions].slice(0, 8);
        setSuggestions(combined);
        setShowSuggestions(combined.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, language]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${language}/destinations?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'destination' && suggestion.slug) {
      router.push(`/${language}/destinations/${suggestion.slug}`);
    } else if (suggestion.type === 'place' && suggestion.slug && suggestion.destinationId) {
      router.push(`/${language}/destinations/${suggestion.destinationId}/places/${suggestion.slug}`);
    }
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const handleTrendingClick = (city: string) => {
    setSearchQuery(city);
    // Focus input and trigger search
    searchInputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const content = useMemo(() => ({
    en: {
      title: 'Morocco',
      highlight: 'Awaits',
      subtitle: 'Experience the magic of authentic riads, hidden medinas, and the golden dunes of the Sahara.',
      searchPlaceholder: 'Where would you like to go?',
      trending: ['Marrakech', 'Chefchaouen', 'Sahara']
    },
    fr: {
      title: 'Maroc',
      highlight: 'Vous Attend',
      subtitle: 'Découvrez la magie des riads authentiques, des médinas cachées et des dunes dorées du Sahara.',
      searchPlaceholder: 'Où aimeriez-vous aller?',
      trending: ['Marrakech', 'Chefchaouen', 'Sahara']
    },
    ar: {
      title: 'المغرب',
      highlight: 'في انتظارك',
      subtitle: 'اختبر سحر الرياضات الأصلية والمدن المخفية والكثبان الذهبية بالصحراء.',
      searchPlaceholder: 'أين تود أن تذهب؟',
      trending: ['مراكش', 'شفشاون', 'الصحراء']
    },
    es: {
      title: 'Marruecos',
      highlight: 'Te Espera',
      subtitle: 'Experimenta la magia de riads auténticos, medinas ocultas y las dunas doradas del Sahara.',
      searchPlaceholder: '¿A dónde te gustaría ir?',
      trending: ['Marrakech', 'Chefchaouen', 'Sahara']
    }
  })[lang], [lang]);

  // Handle video interaction
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => setIsPlaying(false));
  }, []);

  return (
    <section
      className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-gray-900"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">
  {!videoError ? (
    <video
      ref={videoRef}
      autoPlay muted loop playsInline
      className={`w-full h-full object-cover transition-transform duration-[10s] ease-out ${
        isVideoLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
      }`}
      style={{
        // Mobile: Full screen coverage (9:16 aspect ratio)
        objectFit: 'cover',
        objectPosition: 'center',
        minHeight: '100vh',
        minWidth: '100%',
      }}
      onLoadedData={() => setIsVideoLoaded(true)}
      onError={() => setVideoError(true)}
    >
      <source src="/moroccoVibes.mp4" type="video/mp4" />
    </video>
  ) : (
    <div 
      className="w-full h-full bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=2067')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    />
  )}

  {/* MULTI-STAGE OVERLAY FOR READABILITY */}
  <div className="absolute inset-0 bg-black/40 z-[1]" />
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-gray-900 z-[2]" />
</div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center">

        {/* HERO TYPOGRAPHY */}
        <h1 className="font-amiri text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
          {content.title} <span className="text-primary-gold italic">{content.highlight}</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/80 mb-6 leading-relaxed font-light">
          {content.subtitle}
        </p>

        <div className="max-w-3xl mx-auto mb-8 relative">
          <form
            onSubmit={handleSearch}
            className="group relative bg-white/90 backdrop-blur-2xl p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-2 transition-all duration-300 hover:bg-white"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full relative">
              <MapPin className="text-primary-gold w-6 h-6 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder={content.searchPlaceholder}
                className="w-full bg-transparent border-none text-gray-900 placeholder-gray-500 focus:ring-0 text-lg py-3 outline-none"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* <button className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg shadow-black/20">
              <Search className="w-5 h-5" />
              Search
            </button> */}
          </form>

          {/* SUGGESTIONS DROPDOWN */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeInUp"
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary-gold animate-spin" />
                  <span className="ml-2 text-gray-500">Searching...</span>
                </div>
              ) : (
                <div>
                  {/* Suggestions Header */}
                  <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-500">
                    {suggestions.length} results found
                  </div>
                  
                  {/* Suggestions List */}
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.id}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-0 ${
                        index === selectedIndex ? 'bg-amber-50' : ''
                      }`}
                    >
                      {/* Image */}
                      {suggestion.image && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={suggestion.image}
                            alt={suggestion.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-primary-gold">
                            {suggestion.name}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            suggestion.type === 'destination' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {suggestion.type === 'destination' ? 'Destination' : 'Place'}
                          </span>
                        </div>
                        {suggestion.region && (
                          <p className="text-sm text-gray-500 mt-1">
                            {suggestion.region}
                          </p>
                        )}
                        {suggestion.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                            {suggestion.description.substring(0, 80)}...
                          </p>
                        )}
                      </div>
                      
                      {/* Arrow indicator */}
                      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TRENDING CHIPS */}
          {/* <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="text-white/60 text-sm py-1">Trending:</span>
            {content.trending.map(city => (
              <button
                key={city}
                onClick={() => handleTrendingClick(city)}
                className="text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-4 py-1 rounded-full transition-colors"
              >
                {city}
              </button>
            ))}
          </div> */}
        </div>

        {/* SECONDARY ACTIONS */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/ai-trip-planner"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 group"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            AI Travel Agent
          </Link>

          <Link
            href="/destinations"
            className="px-8 py-4 rounded-2xl font-bold text-white border border-white/30 hover:bg-white/10 transition-all"
          >
            Explore Map
          </Link>
        </div>
      </div>

      {/* VIDEO CONTROLS (BOTTOM RIGHT) */}
      <div className={`absolute bottom-10 right-10 z-20 flex gap-3 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-white/20">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary-gold to-transparent" />
        <ArrowDown className="text-primary-gold w-5 h-5" />
      </div>
    </section>
  );
});

export default Hero;
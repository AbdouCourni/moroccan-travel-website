// components/InteractiveMoroccoMap.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Destination, Place } from '../types';
import { MapPin, Home, ZoomIn, ZoomOut, ArrowRight, Star, Loader2 } from 'lucide-react';
import { pathDAttributes } from '../utils/pathDAttributes';
import { useRouter } from 'next/navigation';
import { getPlacesByDestination, getAllDestinations, getAllRegions, getDestinationsByRegion } from '../lib/firebase-server';

interface Region {
    id: string;
    name: {
        en: string;
        fr: string;
        ar: string;
        es: string;
    };
    color: string;
    destinations: string[];
    pathId?: string;
    viewBox?: string;
}



interface Props {
    destinations: Destination[];
    places: Place[];
}

export default function InteractiveMoroccoMap({ destinations, places }: Props) {
    const { language } = useLanguage();
    const router = useRouter();
    const [viewState, setViewState] = useState<'country' | 'region' | 'destination'>('country');
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [hoveredDestination, setHoveredDestination] = useState<string | null>(null);
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [destinationPlaces, setDestinationPlaces] = useState<Place[]>([]);
    const [loadingPlaces, setLoadingPlaces] = useState<boolean>(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const fillColormap = "#766eeaff";
    const strokeColormap = "#1efe0eff";
    const [regions, setRegions] = useState<Region[]>([]);

    // Filter destinations that should be shown on map
    const visibleDestinations = destinations.filter(dest => dest.showOnMap);
    const topPlaces = places.filter(place => place.rating && place.rating >= 4.0).slice(0, 20);
    useEffect(() => {
        const fetchRegions = async () => {
            const fetchedRegions = await getMoroccanRegions();
            setRegions(fetchedRegions);
        };

        fetchRegions();
    }, []);
    // Fetch places for selected destination
    const fetchPlacesForDestination = async (destinationId: string) => {
        setLoadingPlaces(true);
        try {
            const places = await getPlacesByDestination(destinationId, 20); // Get up to 20 places
            setDestinationPlaces(places);
        } catch (error) {
            console.error('Error fetching places:', error);
            setDestinationPlaces([]);
        } finally {
            setLoadingPlaces(false);
        }
    };

    const handleRegionClick = (region: Region) => {
        setSelectedRegion(region);
        setViewState('region');
        setSelectedDestination(null);
        setSelectedPlace(null);
        setDestinationPlaces([]);
        setZoomLevel(1);
    };

    const handleDestinationClick = async (destination: Destination) => {
        setSelectedDestination(destination);
        setViewState('destination');
        setSelectedPlace(null);
        // Fetch places for this destination
        await fetchPlacesForDestination(destination.id);
    };

    const handlePlaceClick = (place: Place) => {
        setSelectedPlace(place);
    };

    const handleExploreDestination = () => {
        if (selectedDestination) {
            router.push(`/${language}/destinations/${selectedDestination.slug}`);
        }
    };

    const handleExplorePlace = () => {
        if (selectedPlace) {
            router.push(`/${language}/places/${selectedPlace.slug}`);
        }
    };

    const handleBack = () => {
        if (viewState === 'destination') {
            setViewState('region');
            setSelectedDestination(null);
            setSelectedPlace(null);
            setDestinationPlaces([]);
        } else if (viewState === 'region') {
            setViewState('country');
            setSelectedRegion(null);
            setZoomLevel(1);
        }
    };

    const handleShowAll = () => {
        setViewState('country');
        setSelectedRegion(null);
        setSelectedDestination(null);
        setSelectedPlace(null);
        setDestinationPlaces([]);
        setZoomLevel(1);
    };

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    };

    const getDisplayItemsForSidebar = () => {
        if (selectedPlace) {
            return [selectedPlace];
        } else if (viewState === 'destination' && selectedDestination) {
            return destinationPlaces.slice(0, 8); // Show first 8 places
        } else if (viewState === 'region' && selectedRegion) {
            return destinations.filter(dest =>
                selectedRegion.destinations.includes(dest.slug)
            );
        } else {
            return visibleDestinations.filter(dest => dest.showOnMap !== false).slice(0, 12);
        }
    };

    const displayItemsForSidebar = getDisplayItemsForSidebar();

    const getDestinationsForMap = () => {
        if (viewState === 'region' && selectedRegion) {
            return destinations.filter(dest => selectedRegion.destinations.includes(dest.slug));
        }
        return visibleDestinations;
    };

    const destinationsForMap = getDestinationsForMap();

    // Enhanced interactivity for SVG paths
    useEffect(() => {
        if (!svgRef.current || !regions.length) return;

        const svg = svgRef.current;
        const paths = svg.querySelectorAll('.region-path');

        // Store event listeners for cleanup
        const listeners: Array<{ element: Element; type: string; listener: EventListener }> = [];

        paths.forEach((path, index) => {
            const region = regions[index];
            if (!region) return;

            const isSelected = selectedRegion?.id === region.id;
            const isHovered = hoveredRegion === region.id;

            path.setAttribute('style', `
            fill: ${isSelected ? region.color : isHovered ? region.color : fillColormap};
            fill-opacity: ${isSelected ? '0.9' : isHovered ? '0.7' : '0.4'};
            stroke: ${region.color};
            stroke-width: ${isSelected ? '4' : isHovered ? '3' : '1'};
            stroke-opacity: ${isSelected ? '1' : isHovered ? '0.8' : '0.6'};
            transition: all 0.3s ease;
            cursor: pointer;
            filter: ${isSelected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none'};
        `);

            // Create event listeners
            const mouseEnterListener = () => setHoveredRegion(region.id);
            const mouseLeaveListener = () => setHoveredRegion(null);
            const clickListener = () => handleRegionClick(region);

            // Add event listeners
            path.addEventListener('mouseenter', mouseEnterListener);
            path.addEventListener('mouseleave', mouseLeaveListener);
            path.addEventListener('click', clickListener);

            // Store for cleanup
            listeners.push(
                { element: path, type: 'mouseenter', listener: mouseEnterListener },
                { element: path, type: 'mouseleave', listener: mouseLeaveListener },
                { element: path, type: 'click', listener: clickListener }
            );
        });

        // Cleanup event listeners - FIXED VERSION
        return () => {
            listeners.forEach(({ element, type, listener }) => {
                element.removeEventListener(type, listener);
            });
        };
    }, [regions, selectedRegion, hoveredRegion, fillColormap]);

    const getViewBox = () => {
        if (viewState === 'region' && selectedRegion?.viewBox) {
            return selectedRegion.viewBox;
        }
        return "0 0 1282 1299";
    };

    const renderRegionPaths = () => {
        if (viewState === 'region' && selectedRegion) {
            return (
                <g>
                    <path className="base-map" d={pathDAttributes.basemap} fill="#f0f0f0" />
                    <path
                        className="region-path"
                        id={selectedRegion.id}
                        d={pathDAttributes[selectedRegion.id.replace(/-/g, '') as keyof typeof pathDAttributes]}
                        fill={selectedRegion.color}
                        stroke={selectedRegion.color}
                        strokeWidth="3"
                        fillOpacity="0.8"
                        style={{ cursor: 'pointer' }}
                    />
                </g>
            );
        }

        return (
            <g>
                <path className="base-map" d={pathDAttributes.basemap} fill="#e8dde1" />
                <path className="region" id="stroke" d={pathDAttributes.stroke} fill={strokeColormap}
                    stroke="#685c5cff"
                    strokeWidth="2" />
                {regions.map(region => (
                    <path
                        key={region.id}
                        className="region-path"
                        id={region.id}
                        d={pathDAttributes[region.id.replace(/-/g, '') as keyof typeof pathDAttributes]}
                        fill={fillColormap}
                    />
                ))}
            </g>
        );
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Simplified Header */}
                <div className="bg-white rounded-xl shadow-lg px-6 py-4 mb-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {viewState === 'destination' && selectedDestination?.name[language]}
                            {viewState === 'region' && selectedRegion?.name[language]}
                            {viewState === 'country' && (language === 'en' ? 'Morocco' : language === 'fr' ? 'Maroc' : language === 'ar' ? 'المغرب' : 'Marruecos')}
                        </h1>
                        {viewState !== 'country' && (
                            <button
                                onClick={handleShowAll}
                                className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg transition"
                            >
                                <Home size={18} />
                                {language === 'en' ? 'Show All' : language === 'fr' ? 'Tout Voir' : language === 'ar' ? 'عرض الكل' : 'Ver Todo'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Map Container */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 relative">
                        {/* View State Navigation - Moved to top left of map */}
                        <div className="absolute top-4 left-4 z-10">
                            {viewState !== 'country' && (
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg shadow-md transition font-medium"
                                >
                                    ← {language === 'en' ? 'Back' : language === 'fr' ? 'Retour' : language === 'ar' ? 'رجوع' : 'Volver'}
                                </button>
                            )}
                        </div>

                        {/* Zoom Controls - Only in region view */}
                        {viewState === 'region' && (
                            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white rounded-lg shadow-md p-1">
                                <button
                                    onClick={handleZoomOut}
                                    disabled={zoomLevel <= 0.5}
                                    className="p-2 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ZoomOut size={18} />
                                </button>
                                <span className="text-sm font-medium px-2">
                                    {Math.round(zoomLevel * 100)}%
                                </span>
                                <button
                                    onClick={handleZoomIn}
                                    disabled={zoomLevel >= 3}
                                    className="p-2 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ZoomIn size={18} />
                                </button>
                            </div>
                        )}

                        <div className="relative">
                            {/* Interactive SVG Map */}
                            <svg
                                ref={svgRef}
                                viewBox={getViewBox()}
                                className="w-full h-auto transition-all duration-500"
                                style={{
                                    maxHeight: '600px',
                                    transform: viewState === 'region' ? `scale(${zoomLevel})` : 'scale(1)',
                                    transformOrigin: 'center'
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {renderRegionPaths()}

                                {/* Destination markers overlay */}
                                {destinationsForMap.map(destination => {
                                    const region = regions.find(r =>
                                        r.destinations.includes(destination.slug)
                                    );
                                    if (!region || (selectedRegion && selectedRegion.id !== region.id)) return null;

                                    const coords = getDestinationCoordinates(destination.slug);
                                    return (
                                        <g
                                            key={destination.id}
                                            className="cursor-pointer pointer-events-auto"
                                            onMouseEnter={() => setHoveredDestination(destination.slug)}
                                            onMouseLeave={() => setHoveredDestination(null)}
                                            onClick={() => handleDestinationClick(destination)}
                                        >
                                            <circle
                                                cx={coords.x}
                                                cy={coords.y}
                                                r={hoveredDestination === destination.slug ? 8 : 6}
                                                fill={region.color}
                                                stroke="white"
                                                strokeWidth={hoveredDestination === destination.slug ? 3 : 2}
                                                className="transition-all duration-200 drop-shadow-lg"
                                            />
                                            {(hoveredDestination === destination.slug || viewState === 'region') && (
                                                <text
                                                    x={coords.x}
                                                    y={coords.y - (hoveredDestination === destination.slug ? 25 : 15)}
                                                    textAnchor="middle"
                                                    className={`font-bold fill-gray-900 pointer-events-none transition-all duration-200 ${hoveredDestination === destination.slug ? 'text-lg' : 'text-xs'
                                                        }`}

                                                >
                                                    {destination.name[language]}
                                                </text>
                                            )}
                                        </g>
                                    );
                                })}

                                {/* Region labels overlay */}
                                {/* {(viewState === 'country' || viewState === 'region') && (
                                    <>
                                        {MOROCCAN_REGIONS.map(region => {
                                            if (viewState === 'region' && region.id !== selectedRegion?.id) return null;
                                            
                                            return (
                                                <text
                                                    key={region.id}
                                                    x={getRegionCenter(region.id).x}
                                                    y={getRegionCenter(region.id).y}
                                                    textAnchor="middle"
                                                    className={`pointer-events-none ${
                                                        viewState === 'region' ? 'text-lg font-bold' : 'text-sm font-bold'
                                                    }`}
                                                    fill={region.color}
                                                    style={{
                                                        filter: 'drop-shadow(0 1px 1px white) drop-shadow(0 -1px 1px white) drop-shadow(1px 0 1px white) drop-shadow(-1px 0 1px white)',
                                                        opacity: hoveredRegion === region.id || selectedRegion?.id === region.id ? 1 : 0.8
                                                    }}
                                                >
                                                    {region.name[language]}
                                                </text>
                                            );
                                        })}
                                    </>
                                )} */}
                            </svg>

                            {/* Tooltip for hovered region */}
                            {hoveredRegion && viewState === 'country' && (
                                <div
                                    className="absolute bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 pointer-events-none z-10"
                                    style={{
                                        left: getRegionCenter(hoveredRegion).x,
                                        top: getRegionCenter(hoveredRegion).y - 40,
                                        transform: 'translateX(-50%)'
                                    }}
                                >
                                    <div className="text-sm font-semibold text-gray-800">
                                        {regions.find(r => r.id === hoveredRegion)?.name[language]}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        {language === 'en' ? 'Click to explore' :
                                            language === 'fr' ? 'Cliquez pour explorer' :
                                                language === 'ar' ? 'انقر للاستكشاف' :
                                                    'Haz clic para explorar'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="font-bold text-xl mb-6 text-gray-800">
                            {selectedPlace ? selectedPlace.name[language] :
                                viewState === 'destination' ? (language === 'en' ? 'Places' : language === 'fr' ? 'Lieux' : language === 'ar' ? 'الأماكن' : 'Lugares') :
                                    viewState === 'region' ? (language === 'en' ? 'Destinations' : language === 'fr' ? 'Destinations' : language === 'ar' ? 'الوجهات' : 'Destinos') :
                                        (language === 'en' ? 'Top Destinations' : language === 'fr' ? 'Meilleures Destinations' : language === 'ar' ? 'أفضل الوجهات' : 'Principales Destinos')}
                        </h3>

                        {/* Explore Destination Button */}
                        {viewState === 'destination' && selectedDestination && (
                            <div className="mb-6">
                                <button
                                    onClick={handleExploreDestination}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                                >
                                    <span>
                                        {language === 'en' ? `Explore ${selectedDestination.name[language]}` :
                                            language === 'fr' ? `Explorer ${selectedDestination.name[language]}` :
                                                language === 'ar' ? `استكشف ${selectedDestination.name[language]}` :
                                                    `Explorar ${selectedDestination.name[language]}`}
                                    </span>
                                    <ArrowRight size={18} />
                                </button>
                                <p className="text-sm text-gray-600 mt-2 text-center">
                                    {language === 'en' ? `Discover all ${destinationPlaces.length}+ places and activities` :
                                        language === 'fr' ? `Découvrez tous les ${destinationPlaces.length}+ lieux et activités` :
                                            language === 'ar' ? `اكتشف جميع ${destinationPlaces.length}+ الأماكن والأنشطة` :
                                                `Descubre todos los ${destinationPlaces.length}+ lugares y actividades`}
                                </p>
                            </div>
                        )}

                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {/* Loading State */}
                            {loadingPlaces && (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                                    <span className="ml-2 text-gray-600">
                                        {language === 'en' ? 'Loading places...' :
                                            language === 'fr' ? 'Chargement des lieux...' :
                                                language === 'ar' ? 'جاري تحميل الأماكن...' :
                                                    'Cargando lugares...'}
                                    </span>
                                </div>
                            )}

                            {/* No Places State */}
                            {viewState === 'destination' && !loadingPlaces && destinationPlaces.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>
                                        {language === 'en' ? 'No places found for this destination' :
                                            language === 'fr' ? 'Aucun lieu trouvé pour cette destination' :
                                                language === 'ar' ? 'لم يتم العثور على أماكن لهذه الوجهة' :
                                                    'No se encontraron lugares para este destino'}
                                    </p>
                                </div>
                            )}

                            {/* Selected Place Detail View */}
                            {selectedPlace && (
                                <div className="bg-gray-50 rounded-lg p-4 border-2 border-amber-200">
                                    <div className="flex items-start gap-4 mb-4">
                                        <img
                                            src={selectedPlace.images[0]}
                                            alt={selectedPlace.name[language]}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-gray-800">
                                                {selectedPlace.name[language]}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                {selectedPlace.rating && (
                                                    <div className="flex items-center gap-1">
                                                        <Star size={16} className="text-yellow-500 fill-current" />
                                                        <span className="text-sm font-medium">{selectedPlace.rating}</span>
                                                    </div>
                                                )}
                                                <span className="text-sm text-gray-600 capitalize">{selectedPlace.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                                        {selectedPlace.description[language]}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleExplorePlace}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1"
                                        >
                                            {language === 'en' ? 'View Details' :
                                                language === 'fr' ? 'Voir Détails' :
                                                    language === 'ar' ? 'عرض التفاصيل' :
                                                        'Ver Detalles'}
                                        </button>
                                        <button
                                            onClick={() => setSelectedPlace(null)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                                        >
                                            {language === 'en' ? 'Back' :
                                                language === 'fr' ? 'Retour' :
                                                    language === 'ar' ? 'رجوع' :
                                                        'Volver'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Country View */}
                            {viewState === 'country' && (
                                <>
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-sm text-gray-600 mb-3">
                                            {language === 'en' ? 'Regions' : language === 'fr' ? 'Régions' : language === 'ar' ? 'المناطق' : 'Regiones'}
                                        </h4>
                                        <div className="space-y-2">
                                            {regions.map(region => (
                                                <button
                                                    key={region.id}
                                                    onClick={() => handleRegionClick(region)}
                                                    className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-4 h-4 rounded-full transition-transform group-hover:scale-110"
                                                            style={{ backgroundColor: region.color }}
                                                        />
                                                        <span className="font-medium text-gray-800 group-hover:text-amber-700">
                                                            {region.name[language]}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-600 mb-3">
                                            {language === 'en' ? 'Featured Destinations' : language === 'fr' ? 'Destinations en vedette' : language === 'ar' ? 'وجهات مميزة' : 'Destinos destacados'}
                                        </h4>
                                        {displayItemsForSidebar.slice(0, 6).map((dest: any) => (
                                            <div
                                                key={dest.id}
                                                className="p-3 mb-3 rounded-lg border border-gray-200 hover:border-amber-500 transition-colors cursor-pointer group"
                                                onClick={() => handleDestinationClick(dest)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={dest.images[0]}
                                                        alt={dest.name[language]}
                                                        className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-semibold text-sm text-gray-800 truncate group-hover:text-amber-700">
                                                            {dest.name[language]}
                                                        </h5>
                                                        <p className="text-xs text-gray-600 truncate">
                                                            {regions.find(r => r.destinations.includes(dest.slug))?.name[language]}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Region View - Destinations */}
                            {viewState === 'region' && displayItemsForSidebar.map((dest: any) => (
                                <div
                                    key={dest.id}
                                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all cursor-pointer group"
                                    onClick={() => handleDestinationClick(dest)}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={dest.images[0]}
                                            alt={dest.name[language]}
                                            className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-800 truncate group-hover:text-amber-700">
                                                {dest.name[language]}
                                            </h4>
                                            <p className="text-sm text-gray-600 truncate">
                                                {dest.highlights?.[0] || dest.description[language].substring(0, 50)}...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Destination View - Places */}
                            {/* Destination View - Places */}
                            {viewState === 'destination' && !selectedPlace && !loadingPlaces && destinationPlaces.map((place: any) => (
                                <div
                                    key={place.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group"
                                    onClick={() => handlePlaceClick(place)}
                                >
                                    {/* Show first image if available, otherwise show MapPin icon */}
                                    {place.images && place.images.length > 0 ? (
                                        <img
                                            src={place.images[0]}
                                            alt={place.name[language]}
                                            className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                            <MapPin size={20} className="text-green-600" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-medium text-sm text-gray-800 truncate group-hover:text-green-700">
                                            {place.name[language]}
                                        </h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs text-gray-600 capitalize">{place.type}</p>
                                            {place.rating && (
                                                <div className="flex items-center gap-1">
                                                    <Star size={12} className="text-yellow-500 fill-current" />
                                                    <span className="text-xs font-medium">{place.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
// Keep your existing helper functions
function getRegionCenter(regionId: string): { x: number; y: number } {
    const centers: { [key: string]: { x: number; y: number } } = {
        'tangier-tetouan-al-hoceima': { x: 1000, y: 100 },
        'oriental': { x: 1200, y: 200 },
        'fes-meknes': { x: 1000, y: 250 },
        'rabat-sale-kenitra': { x: 850, y: 200 },
        'casablanca-settat': { x: 730, y: 290 },
        'beni-mellal-khenifra': { x: 850, y: 330 },
        'draa-tafilalet': { x: 950, y: 500 },
        'marrakech-safi': { x: 700, y: 395 },
        'souss-massa': { x: 680, y: 575 },
        'guelmim-oued-noun': { x: 600, y: 720 },
        'laayoune-sakia-el-hamra': { x: 400, y: 800 },
        'dakhla-oued-ed-dahab': { x: 230, y: 1100 }
    };
    return centers[regionId] || { x: 641, y: 649 };
}

const getDestinationCoordinates = (slug: string): { x: number; y: number } => {
    const coordinates: { [key: string]: { x: number; y: number } } = {
        // Tanger-Tetouan-Al Hoceima (6)
        'tangier': { x: 930, y: 63 },
        'tetouan': { x: 960, y: 85 },
        'chefchaouen': { x: 970, y: 115 },
        'larache': { x: 905, y: 110 },
        'al-hoceima': { x: 1060, y: 110 },
        'ouezzane': { x: 950, y: 140 },

        // Oriental Region (7)
        'oujda': { x: 1195, y: 150 },
        'nador': { x: 1130, y: 110 },
        'berkane': { x: 1170, y: 140 },
        'taourirt': { x: 1130, y: 165 },
        'jerada': { x: 1175, y: 180 },
        'guercif': { x: 1110, y: 195 },

        // Rabat-Salé-Kenitra (8)
        'rabat': { x: 855, y: 215 },
        'sale': { x: 860, y: 210 },
        'kenitra': { x: 865, y: 200 },
        'skhirat': { x: 845, y: 230 },
        'tiflet': { x: 885, y: 215 },
        'sidi-slimane': { x: 910, y: 190 },
        'sidi-kacem': { x: 930, y: 190 },
        'khemisset': { x: 910, y: 220 },

        // Casablanca-Settat (9)
        'casablanca': { x: 800, y: 250 },
        'mohammedia': { x: 820, y: 235 },
        'settat': { x: 800, y: 280 },
        'berrechid': { x: 800, y: 265 },
        'benslimane': { x: 835, y: 240 },
        'el-jadida': { x: 740, y: 280 },

        'youssoufia': { x: 800, y: 310 },

        // Marrakech-Safi (4)
        'safi': { x: 685, y: 355 },
        'marrakech': { x: 760, y: 410 },
        'chichaoua': { x: 705, y: 412 },
        'essaouira': { x: 645, y: 415 },
        'rehamna': { x: 770, y: 380 },

        // Fès-Meknès (9)
        'fes': { x: 990, y: 220 },
        'meknes': { x: 960, y: 230 },
        'ifrane': { x: 985, y: 260 },
        'azrou': { x: 975, y: 275 },
        'taza': { x: 1050, y: 200 },
        'el-hajeb': { x: 965, y: 255 },
        'sefrou': { x: 1000, y: 240 },
        'boulemane': { x: 1020, y: 280 },

        // Béni Mellal-Khénifra (6)
        'beni-mellal': { x: 885, y: 340 },
        'khouribga': { x: 860, y: 300 },
        'khenifra': { x: 940, y: 290 },
        'azilal': { x: 870, y: 390 },
        'fquih-ben-salah': { x: 865, y: 325 },

        // Draa-Tafilalet (6)
        'errachidia': { x: 1030, y: 400 },
        'midelt': { x: 990, y: 320 },
        'tinghir': { x: 955, y: 415 },
        'zagora': { x: 930, y: 530 },
        'ouarzazate': { x: 840, y: 470 },

        // Souss–Massa (5)
        'agadir': { x: 650, y: 515 },
        'inezgane': { x: 665, y: 525 },
        'ait-melloul': { x: 670, y: 535 },
        'tiznit': { x: 650, y: 570 },
        'taroudant': { x: 705, y: 510 },

        // Guelmim–Oued Noun (4)
        'guelmim': { x: 620, y: 625 },
        'tan-tan': { x: 550, y: 670 },
        'sidi-ifni': { x: 606, y: 600 },
        'assa': { x: 680, y: 670 },

        // Laâyoune–Sakia El Hamra (4)
        'laayoune': { x: 385, y: 775 },
        'tarfaya': { x: 390, y: 710 },
        'boujdour': { x: 265, y: 850 },
        'es-semara': { x: 490, y: 820 },

        // Dakhla–Oued Ed-Dahab (2)
        'dakhla': { x: 145, y: 1047 },
        'aousserd': { x: 270, y: 1150 }
    };

    return coordinates[slug.toLowerCase()] || { x: 641, y: 649 };
};
const REGIONS_CONFIG = {
    'Marrakech-Safi': {
        id: 'marrakech-safi',
        name: { en: 'Marrakech-Safi', fr: 'Marrakech-Safi', ar: 'مراكش آسفي', es: 'Marrakech-Safi' },
        color: '#e53e3e',
        viewBox: '550 250 400 400'
    },
    'Casablanca-Settat': {
        id: 'casablanca-settat',
        name: { en: 'Casablanca-Settat', fr: 'Casablanca-Settat', ar: 'الدار البيضاء - سطات', es: 'Casablanca-Settat' },
        color: '#3182ce',
        viewBox: '650 150 400 400'
    },
    'Rabat-Salé-Kenitra': {
        id: 'rabat-sale-kenitra',
        name: { en: 'Rabat-Salé-Kénitra', fr: 'Rabat-Salé-Kénitra', ar: 'الرباط - سلا - القنيطرة', es: 'Rabat-Salé-Kénitra' },
        color: '#38a169',
        viewBox: '650 80 400 400'
    },
    'Fès-Meknès': {
        id: 'fes-meknes',
        name: { en: 'Fès-Meknès', fr: 'Fès-Meknès', ar: 'فاس - مكناس', es: 'Fès-Meknès' },
        color: '#d69e2e',
        viewBox: '850 95 400 400'
    },
    'Tanger-Tetouan-Al Hoceima': {
        id: 'tangier-tetouan-al-hoceima',
        name: { en: 'Tanger-Tetouan-Al Hoceima', fr: 'Tanger-Tétouan-Al Hoceima', ar: 'طنجة - تطوان - الحسيمة', es: 'Tanger-Tetouan-Al Hoceima' },
        color: '#805ad5',
        viewBox: '850 50 400 400'
    },
    'Souss–Massa': {
        id: 'souss-massa',
        name: { en: 'Souss-Massa', fr: 'Souss-Massa', ar: 'سوس ماسة', es: 'Souss-Massa' },
        color: '#dd6b20',
        viewBox: '600 350 400 400'
    },
    'Draa-Tafilalet': {
        id: 'draa-tafilalet',
        name: { en: 'Drâa-Tafilalet', fr: 'Drâa-Tafilalet', ar: 'درعة - تافيلالت', es: 'Drâa-Tafilalet' },
        color: '#c05621',
        viewBox: '800 250 400 400'
    },
    'Oriental Region': {
        id: 'oriental',
        name: { en: 'Oriental', fr: 'Oriental', ar: 'الشرق', es: 'Oriental' },
        color: '#2c5282',
        viewBox: '900 80 400 400'
    },
    'Béni Mellal-Khénifra': {
        id: 'beni-mellal-khenifra',
        name: { en: 'Béni Mellal-Khénifra', fr: 'Béni Mellal-Khénifra', ar: 'بني ملال خنيفرة', es: 'Béni Mellal-Khénifra' },
        color: '#d53f8c',
        viewBox: '750 200 400 400'
    },
    'Guelmim–Oued Noun': {
        id: 'guelmim-oued-noun',
        name: { en: 'Guelmim-Oued Noun', fr: 'Guelmim-Oued Noun', ar: 'كلميم واد نون', es: 'Guelmim-Oued Noun' },
        color: '#38b2ac',
        viewBox: '500 450 400 400'
    },
    'Laâyoune–Sakia El Hamra': {
        id: 'laayoune-sakia-el-hamra',
        name: { en: 'Laâyoune-Sakia El Hamra', fr: 'Laâyoune-Sakia El Hamra', ar: 'العيون الساقية الحمراء', es: 'Laâyoune-Sakia El Hamra' },
        color: '#ed8936',
        viewBox: '270 650 400 400'
    },
    'Dakhla–Oued Ed-Dahab': {
        id: 'dakhla-oued-ed-dahab',
        name: { en: 'Dakhla-Oued Ed-Dahab', fr: 'Dakhla-Oued Ed-Dahab', ar: 'الداخلة وادي الذهب', es: 'Dakhla-Oued Ed-Dahab' },
        color: '#805ad5',
        viewBox: '80 900 400 400'
    }
};

// Function to get regions with their destinations
export async function getMoroccanRegions(): Promise<Region[]> {
    try {
        const allDestinations = await getAllDestinations();
        const regions = await getAllRegions();

        return regions.map(regionName => {
            const regionConfig = REGIONS_CONFIG[regionName as keyof typeof REGIONS_CONFIG];
            const regionDestinations = allDestinations.filter(dest => dest.region === regionName);

            return {
                id: regionConfig?.id || regionName.toLowerCase().replace(/\s+/g, '-'),
                name: regionConfig?.name || {
                    en: regionName,
                    fr: regionName,
                    ar: regionName,
                    es: regionName
                },
                color: regionConfig?.color || '#718096', // Default gray
                destinations: regionDestinations.map(dest => dest.slug),
                viewBox: regionConfig?.viewBox || '0 0 400 400' // Default viewBox
            } as Region;
        });
    } catch (error) {
        console.error('Error generating regions:', error);
        return [];
    }
}

// Helper function to get a single region with full destination data
export async function getRegionWithDestinations(regionId: string): Promise<(Region & { destinationData: Destination[] }) | null> {
    try {
        const regions = await getMoroccanRegions();
        const region = regions.find(r => r.id === regionId);

        if (!region) return null;

        const destinationData = await getDestinationsByRegion(
            Object.keys(REGIONS_CONFIG).find(key =>
                REGIONS_CONFIG[key as keyof typeof REGIONS_CONFIG].id === regionId
            ) || regionId
        );

        return {
            ...region,
            destinationData
        };
    } catch (error) {
        console.error('Error getting region with destinations:', error);
        return null;
    }
}

export { REGIONS_CONFIG };
// Add your helper functions here (getRegionCenter, getDestinationCoordinates)
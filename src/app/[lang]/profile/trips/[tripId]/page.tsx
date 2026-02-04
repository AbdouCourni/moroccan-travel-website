// app/profile/trips/[tripId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../../hooks/useAuth';
import { getTripPlanById, deleteTripPlan, duplicateTripPlan, updateTripPlan } from '../../../../../../lib/firebase-server';
import { getPlacesByDestination } from '../../../../../../lib/firebase-server';
import type { SavedTripPlan, TripPlan as TripPlanType, Place } from '../../../../../../types';
import {
    ArrowLeft,
    Calendar,
    Users,
    DollarSign,
    MapPin,
    Clock,
    Loader2,
    Sparkles,
    Download,
    Share2,
    Bookmark,
    Trash2,
    Copy,
    Edit2,
    CheckCircle,
    ChevronRight,
    Plane,
    Hotel,
    Utensils,
    Sun,
    Navigation,
    Camera,
    Coffee,
    ShoppingBag
} from 'lucide-react';

// Reuse the TripPlanViewer from AI planner (we'll extract the logic)
export default function TripPlanDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [tripPlan, setTripPlan] = useState<SavedTripPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [placeDetails, setPlaceDetails] = useState<Record<string, Place>>({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const tripId = params.tripId as string;

    useEffect(() => {
        const loadTripPlan = async () => {
            if (!user || authLoading) return;

            try {
                setLoading(true);
                const savedTrip = await getTripPlanById(user.uid, tripId);

                if (!savedTrip) {
                    router.push('/profile');
                    return;
                }

                setTripPlan(savedTrip);

                // Load place details for referenced places
                if (savedTrip.realReferences?.placeIds?.length > 0) {
                    const placesMap: Record<string, Place> = {};
                    // We'll load place details for the first few places to show
                    const placeIdsToLoad = savedTrip.realReferences.placeIds.slice(0, 10);

                    // Note: We need destinationId to fetch places, so we might need to store
                    // destinationId with each placeId in realReferences
                    // For now, we'll just set empty place details
                    setPlaceDetails(placesMap);
                }
            } catch (error) {
                console.error('Error loading trip plan:', error);
                router.push('/profile');
            } finally {
                setLoading(false);
            }
        };

        loadTripPlan();
    }, [user, tripId, authLoading, router]);

    const handleDeleteTrip = async () => {
        if (!user || !tripPlan || !confirm('Are you sure you want to delete this trip plan?')) return;

        try {
            setIsDeleting(true);
            await deleteTripPlan(user.uid, tripPlan.id);
            router.push('/profile');
        } catch (error) {
            console.error('Error deleting trip plan:', error);
            alert('Failed to delete trip plan');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicateTrip = async () => {
        if (!user || !tripPlan) return;

        try {
            setIsDuplicating(true);
            const newTripId = await duplicateTripPlan(user.uid, tripPlan.id);
            router.push(`/profile/trips/${newTripId}`);
        } catch (error) {
            console.error('Error duplicating trip plan:', error);
            alert('Failed to duplicate trip plan');
        } finally {
            setIsDuplicating(false);
        }
    };

    const handleUpdateStatus = async (newStatus: SavedTripPlan['status']) => {
        if (!user || !tripPlan) return;

        try {
            setIsUpdatingStatus(true);
            await updateTripPlan(user.uid, tripPlan.id, { status: newStatus });
            setTripPlan(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) {
            console.error('Error updating trip status:', error);
            alert('Failed to update status');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const exportAsPDF = () => {
        alert('PDF export feature will be implemented soon!');
    };

    const shareTripPlan = () => {
        if (navigator.share) {
            navigator.share({
                title: tripPlan?.title || 'Morocco Trip Plan',
                text: 'Check out my trip plan for Morocco!',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const getStatusBadgeColor = (status: SavedTripPlan['status']) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'planned': return 'bg-blue-100 text-blue-800';
            case 'in-progress': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'favorite': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const formatDate = (date: any) => {
        if (!date) return 'Unknown date';

        // If it's a Firestore Timestamp
        if (date.toDate && typeof date.toDate === 'function') {
            return date.toDate().toLocaleDateString();
        }

        // If it's already a Date object
        if (date instanceof Date) {
            return date.toLocaleDateString();
        }

        // If it's a string
        if (typeof date === 'string') {
            return new Date(date).toLocaleDateString();
        }

        // If it's a number (timestamp)
        if (typeof date === 'number') {
            return new Date(date).toLocaleDateString();
        }

        return 'Invalid date';
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary-gold mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-black mb-2">Loading Trip Plan</h2>
                    <p className="text-gray-600">Fetching your adventure details...</p>
                </div>
            </div>
        );
    }

    if (!tripPlan) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-black mb-4">Trip Plan Not Found</h2>
                    <p className="text-gray-600 mb-6">The trip plan you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/profile')}
                        className="inline-flex items-center gap-2 bg-primary-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-gold/90"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    const generatedPlan = tripPlan.generatedPlan;
    const criteria = tripPlan.criteria;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back button */}
                <button
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Profile
                </button>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-gold to-purple-600 text-white px-4 py-2 rounded-full mb-4">
                                <Sparkles className="w-4 h-4" />
                                <span className="font-semibold">AI-Powered Trip Plan</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">{tripPlan.title}</h1>
                            <p className="text-gray-600 max-w-3xl">
                                Created on {formatDate(tripPlan.createdAt)} • Last updated {formatDate(tripPlan.updatedAt)}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {/* Status Selector */}
                            <div className="relative">
                                <select
                                    value={tripPlan.status}
                                    onChange={(e) => handleUpdateStatus(e.target.value as SavedTripPlan['status'])}
                                    disabled={isUpdatingStatus}
                                    className={`px-4 py-2 rounded-lg border appearance-none ${getStatusBadgeColor(tripPlan.status)} font-medium disabled:opacity-70`}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="planned">Planned</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="favorite">Favorite</option>
                                </select>
                                {isUpdatingStatus && (
                                    <Loader2 className="w-4 h-4 animate-spin absolute right-2 top-3" />
                                )}
                            </div>

                            <button
                                onClick={handleDuplicateTrip}
                                disabled={isDuplicating}
                                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-70"
                            >
                                {isDuplicating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                                Duplicate
                            </button>

                            <button
                                onClick={shareTripPlan}
                                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>

                            <button
                                onClick={exportAsPDF}
                                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                            >
                                <Download className="w-4 h-4" />
                                PDF
                            </button>

                            <button
                                onClick={handleDeleteTrip}
                                disabled={isDeleting}
                                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 disabled:opacity-70"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                            <Calendar className="w-4 h-4" />
                            <span>{criteria?.duration || 0} days</span>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                            <Users className="w-4 h-4" />
                            <span>{criteria?.travelers || 2} traveler{criteria?.travelers > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full">
                            <DollarSign className="w-4 h-4" />
                            <span>${tripPlan.budget?.estimated?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full">
                            <MapPin className="w-4 h-4" />
                            <span>{tripPlan.realReferences?.destinationIds?.length || 0} destinations</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Trip Summary */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-black mb-4">Trip Summary</h2>
                            <p className="text-gray-700 mb-6">{generatedPlan?.summary || tripPlan.title}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-gold">{criteria?.duration || 0}</div>
                                    <div className="text-sm text-gray-600">Days</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-gold">{criteria?.travelers || 2}</div>
                                    <div className="text-sm text-gray-600">Travelers</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-gold">
                                        ${tripPlan.budget?.estimated?.toLocaleString() || '0'}
                                    </div>
                                    <div className="text-sm text-gray-600">Budget</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary-gold">
                                        {tripPlan.realReferences?.placeIds?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Places</div>
                                </div>
                            </div>
                        </div>

                        {/* Cost Breakdown */}
                        {generatedPlan?.budget && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                                    <DollarSign className="w-6 h-6 text-primary-gold" />
                                    Cost Breakdown
                                </h2>
                                <div className="text-center mb-8">
                                    <div className="text-5xl font-bold text-primary-gold mb-2">
                                        ${generatedPlan.budget.summary.totalCost.toLocaleString()}
                                    </div>
                                    <p className="text-gray-600">Total estimated cost</p>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries({
                                        accommodation: generatedPlan.budget.accommodation.total,
                                        activities: generatedPlan.budget.activities.total,
                                        food: generatedPlan.budget.food.total,
                                        transport: generatedPlan.budget.transport.total
                                    }).map(([category, amount]) => (
                                        <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-gold/10 rounded-full flex items-center justify-center">
                                                    <DollarSign className="w-5 h-5 text-primary-gold" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-black capitalize">{category}</div>
                                                    <div className="text-sm text-gray-600">${(amount / (criteria?.travelers || 1)).toLocaleString()}/person</div>
                                                </div>
                                            </div>
                                            <div className="text-xl font-bold text-black">${amount.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Daily Itinerary Preview */}
                        {generatedPlan?.dayPlans && generatedPlan.dayPlans.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-black mb-6">Daily Itinerary</h2>
                                <div className="space-y-6">
                                    {generatedPlan.dayPlans.slice(0, 3).map(day => (
                                        <div key={day.dayNumber} className="border-l-4 border-primary-gold pl-6 py-6 bg-gray-50/50 rounded-r-lg">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-primary-gold to-moroccan-blue text-white rounded-full flex items-center justify-center font-bold text-lg">
                                                    Day {day.dayNumber}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-black">{day.title}</h3>
                                                    <p className="text-gray-600 mt-1">{day.theme}</p>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-semibold text-black mb-3">Morning Activities</h4>
                                                    <ul className="space-y-2">
                                                        {day.morning.slice(0, 2).map((activity, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <div className="w-5 h-5 bg-primary-gold/20 rounded-full flex items-center justify-center mt-0.5">
                                                                    <ChevronRight className="w-3 h-3 text-primary-gold" />
                                                                </div>
                                                                <span className="text-gray-700">{activity.placeName}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-black mb-3">Afternoon Activities</h4>
                                                    <ul className="space-y-2">
                                                        {day.afternoon.slice(0, 2).map((activity, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <div className="w-5 h-5 bg-primary-gold/20 rounded-full flex items-center justify-center mt-0.5">
                                                                    <ChevronRight className="w-3 h-3 text-primary-gold" />
                                                                </div>
                                                                <span className="text-gray-700">{activity.placeName}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {generatedPlan.dayPlans.length > 3 && (
                                        <div className="text-center pt-6 border-t border-gray-200">
                                            <p className="text-gray-600">
                                                + {generatedPlan.dayPlans.length - 3} more days in your itinerary
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Side Info */}
                    <div className="space-y-8">
                        {/* Trip Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-black mb-4">Trip Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-black mb-2">Travel Dates</h3>
                                    <p className="text-gray-700">
                                        {tripPlan.dates.start.toLocaleDateString()} - {tripPlan.dates.end.toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-black mb-2">Destinations</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tripPlan.realReferences?.destinationIds?.map((destId, idx) => (
                                            <span key={destId} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-gold/10 text-primary-gold rounded-full text-sm">
                                                <MapPin className="w-3 h-3" />
                                                Destination {idx + 1}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-black mb-2">Interests</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {criteria?.interests?.slice(0, 5).map((interest, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Packing List Preview */}
                        {generatedPlan?.packingList && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-black mb-4">Packing Essentials</h2>
                                <div className="space-y-3">
                                    {generatedPlan.packingList.clothing?.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                            <span className="text-sm text-gray-700">{item.items[0]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Travel Tips Preview */}
                        {generatedPlan?.travelTips && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-black mb-4">Travel Tips</h2>
                                <ul className="space-y-2">
                                    {generatedPlan.travelTips.general?.safety?.slice(0, 3).map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                                <span className="text-xs font-bold text-blue-600">{idx + 1}</span>
                                            </div>
                                            <span className="text-sm text-gray-700">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/bookings')}
                                className="w-full bg-gradient-to-r from-primary-gold to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Calendar className="w-4 h-4" />
                                Book This Trip
                            </button>
                            <button
                                onClick={exportAsPDF}
                                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export Full Itinerary
                            </button>
                            <button
                                onClick={() => router.push('/ai-trip-planner')}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Create New Plan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notes Section (for user to add notes) */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-black mb-4">My Trip Notes</h2>
                    <textarea
                        placeholder="Add your personal notes, reminders, or updates about this trip..."
                        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                        value={tripPlan.notes || ''}
                        onChange={async (e) => {
                            const newNotes = e.target.value;
                            setTripPlan(prev => prev ? { ...prev, notes: newNotes } : null);
                            if (user) {
                                try {
                                    await updateTripPlan(user.uid, tripPlan.id, { notes: newNotes });
                                } catch (error) {
                                    console.error('Error updating notes:', error);
                                }
                            }
                        }}
                    />
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">Saved automatically</span>
                        <span className="text-sm text-gray-500">{tripPlan.notes?.length || 0}/1000 characters</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
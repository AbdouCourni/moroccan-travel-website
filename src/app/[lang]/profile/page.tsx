// app/profile/page.tsx  
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import type { User as UserType, Place } from '../../../../types';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { getFavoritePlacesForUser } from '../../../../lib/getFavoritePlaces';
import FavoritesHeart from '../../../../components/FavoriteHeart';
// ADD these imports at the top of your existing profile page
import { useRouter } from 'next/navigation';
import type { SavedTripPlan } from '../../../../types';
import { getUserTripPlans, deleteTripPlan } from '../../../../lib/firebase-server';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Eye, 
  Trash2,
  Loader2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function ProfilePage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [favorites, setFavorites] = useState<Place[]>([]);
  const [favLoading, setFavLoading] = useState(true);

  const [tripPlans, setTripPlans] = useState<SavedTripPlan[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  const router = useRouter();


  // Load or create user profile (and ensure favoritesPlaces exists)
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!firebaseUser) {
          setLoading(false);
          return;
        }

        const ref = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data() as any;
          const user: UserType = {
            id: firebaseUser.uid,
            email: data.email || firebaseUser.email || '',
            name: data.name || firebaseUser.displayName || 'User',
            avatar: data.avatar || firebaseUser.photoURL || '',
            role: data.role || 'traveler',
            preferences: data.preferences || { language: 'en', currency: 'USD' },
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
            phone: data.phone || '',
            emailVerified: firebaseUser.emailVerified || false,
            dateOfBirth: data.dateOfBirth?.toDate?.(),
            location: data.location || { country: '', city: '' },
            hostProfile: data.hostProfile || { isVerified: false },
            favoritesPlaces: Array.isArray(data.favoritesPlaces) ? data.favoritesPlaces : [],
          };
          setUserData(user);

          if (!Array.isArray(data.favoritesPlaces)) {
            await setDoc(ref, { favoritesPlaces: [] }, { merge: true });
          }
        } else {
          const defUser: UserType = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            avatar: firebaseUser.photoURL || '',
            role: 'traveler',
            preferences: { language: 'en', currency: 'USD' },
            createdAt: new Date(),
            updatedAt: new Date(),
            phone: '',
            emailVerified: firebaseUser.emailVerified,
            location: { country: '', city: '' },
            hostProfile: { isVerified: false },
            favoritesPlaces: [],
          };
          await setDoc(ref, defUser, { merge: true });
          setUserData(defUser);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) loadUser();
  }, [firebaseUser, authLoading]);

   

  // Load favorite places for the signed-in user
  useEffect(() => {
    const run = async () => {
      if (!firebaseUser) {
        setFavorites([]);
        setFavLoading(false);
        return;
      }
      try {
        setFavLoading(true);
        const places = await getFavoritePlacesForUser(firebaseUser.uid);
        setFavorites(places);
      } finally {
        setFavLoading(false);
      }
    };
    run();
  }, [firebaseUser]);


  // Add this useEffect after your existing useEffect hooks
useEffect(() => {
  const loadTripPlans = async () => {
    if (!firebaseUser) {
      setTripPlans([]);
      setTripsLoading(false);
      return;
    }
    try {
      setTripsLoading(true);
      const plans = await getUserTripPlans(firebaseUser.uid);
      setTripPlans(plans);
    } catch (error) {
      console.error('Error loading trip plans:', error);
      setTripPlans([]);
    } finally {
      setTripsLoading(false);
    }
  };
  
  if (!authLoading) {
    loadTripPlans();
  }
}, [firebaseUser, authLoading]);

  const handleSavePreferences = async () => {
    if (!firebaseUser || !userData) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        name: userData.name,
        email: userData.email,
        preferences: userData.preferences,
        phone: userData.phone,
        location: userData.location,
        updatedAt: new Date(),
      });
      alert('Profile updated successfully!');
    } catch {
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  // Add these functions before the return statement

// Handle trip plan deletion
const handleDeleteTripPlan = async (tripId: string) => {
  if (!firebaseUser || !confirm('Are you sure you want to delete this trip plan?')) return;
  
  try {
    await deleteTripPlan(firebaseUser.uid, tripId);
    setTripPlans(prev => prev.filter(trip => trip.id !== tripId));
    alert('Trip plan deleted successfully!');
  } catch (error) {
    console.error('Error deleting trip plan:', error);
    alert('Failed to delete trip plan');
  }
};

// Get status badge color
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold mx-auto mb-4" />
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p>You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {/* === Profile Info + Preferences (restored UI) === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={userData?.name || ''}
                  onChange={(e) => setUserData(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="mt-1 text-gray-900">{firebaseUser.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {firebaseUser.emailVerified ? '✓ Verified' : '⚠ Not verified'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={userData?.phone || ''}
                  onChange={(e) => setUserData(prev => prev ? { ...prev, phone: e.target.value } : prev)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-gray-900 capitalize">{userData?.role || 'traveler'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-gray-900">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={userData?.preferences?.language || 'en'}
                  onChange={(e) =>
                    setUserData(prev => prev ? {
                      ...prev,
                      preferences: { ...prev.preferences, language: e.target.value as 'en' | 'fr' | 'ar' | 'es' }
                    } : prev)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="ar">Arabic</option>
                  <option value="es">Spanish</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={userData?.preferences?.currency || 'USD'}
                  onChange={(e) =>
                    setUserData(prev => prev ? {
                      ...prev,
                      preferences: { ...prev.preferences, currency: e.target.value as 'USD' | 'EUR' | 'MAD' }
                    } : prev)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="MAD">MAD (DH)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="bg-green-500 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </div>

        {/* Saved Places */}
        <div className="mt-10 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Saved Places</h2>

          {favLoading ? (
            <div className="text-gray-500">Loading your favorites…</div>
          ) : favorites.length === 0 ? (
            <div className="text-gray-600">You haven’t saved any places yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((p) => (
                <div key={p.id} className="rounded-xl overflow-hidden border">
                  <div className="h-40 relative">
                    <img
                      src={(p as any).images?.[0] || '/images/placeholder.jpg'}
                      alt={((p as any).name?.en || (p as any).name || 'Place') as string}
                      className="w-full h-full object-cover"
                    />
                    <FavoritesHeart
                      placeId={p.id}
                      initialIsFavorite={true}
                      className="absolute top-2 right-2"
                      onChange={(isFav: boolean) => {
                        if (!isFav) {
                          setFavorites((prev) => prev.filter((x) => x.id !== p.id));
                        }
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <div className="font-semibold line-clamp-1">
                      {((p as any).name?.en || (p as any).name || (p as any).slug || 'Place') as string}
                    </div>

                    {(p as any).location?.address ? (
                      <div className="text-sm text-gray-600 mt-1">
                        {(p as any).location.address}
                      </div>
                    ) : null}

                    <div className="mt-3">
                      <a
                        href={`/destinations/${(p as any).destinationId}/places/${(p as any).slug}`}
                        className="inline-block bg-yellow-600 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        View details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* === My Trip Plans === */}
<div className="mt-10 bg-white rounded-xl shadow-lg p-6">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-black flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary-gold" />
        My Trip Plans
      </h2>
      <p className="text-gray-600 mt-1">All your AI-generated trip plans in one place</p>
    </div>
    <button
      onClick={() => router.push('/ai-trip-planner')}
      className="flex items-center gap-2 bg-gradient-to-r from-primary-gold to-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
    >
      <Sparkles className="w-4 h-4" />
      Create New Trip
    </button>
  </div>

  {tripsLoading ? (
    <div className="text-center py-12">
      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-gold mb-4" />
      <p className="text-gray-600">Loading your trip plans...</p>
    </div>
  ) : tripPlans.length === 0 ? (
    <div className="text-center py-12 bg-gray-50 rounded-xl">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-gold/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPin className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-black mb-2">No trip plans yet</h3>
      <p className="text-gray-600 mb-6">Create your first AI-powered trip plan</p>
      <button
        onClick={() => router.push('/ai-trip-planner')}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-gold to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg"
      >
        <Sparkles className="w-4 h-4" />
        Plan Your Trip
      </button>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tripPlans.map((trip) => (
        <div key={trip.id} className="bg-white rounded-xl border border-gray-200 hover:border-primary-gold/50 hover:shadow-lg transition-all overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-black text-lg line-clamp-1">{trip.title}</h3>
                <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getStatusBadgeColor(trip.status)}`}>
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => router.push(`/profile/trips/${trip.id}`)}
                  className="p-1.5 text-gray-400 hover:text-primary-gold rounded-full hover:bg-gray-100"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTripPlan(trip.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {trip.dates.start.toLocaleDateString()} - {trip.dates.end.toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>
                  {trip.criteria?.travelers || 2} traveler{trip.criteria?.travelers > 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">
                  {trip.realReferences?.destinationIds?.length || 0} destinations
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>${trip.budget?.estimated?.toLocaleString() || '0'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => router.push(`/profile/trips/${trip.id}`)}
                className="w-full flex items-center justify-center gap-2 bg-primary-gold/10 text-primary-gold hover:bg-primary-gold/20 py-2.5 rounded-lg font-medium transition-colors"
              >
                View Full Itinerary
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
  
  {tripPlans.length > 0 && (
    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
      <p className="text-gray-600">
        Showing {tripPlans.length} trip plan{tripPlans.length !== 1 ? 's' : ''}
      </p>
    </div>
  )}
</div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">Your travel history and activity will appear here.</p>
        </div>
      </div>
    </div>
  );
}




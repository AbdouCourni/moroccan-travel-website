// app/profile/page.tsx  (your code + user info rendering restored)
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import type { User as UserType, Place } from '../../../../types';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { getFavoritePlacesForUser } from '../../../../lib/getFavoritePlaces';
import FavoritesHeart from '../../../../components/FavoriteHeart';

export default function ProfilePage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [favorites, setFavorites] = useState<Place[]>([]);
  const [favLoading, setFavLoading] = useState(true);

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

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">Your travel history and activity will appear here.</p>
        </div>
      </div>
    </div>
  );
}



// // app/profile/page.tsx
// // Fetch and render the current user's favorite places in their profile

// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '../../../../hooks/useAuth';
// import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
// import { db } from '../../../../lib/firebase';
// import { getUserFavoritePlaces } from '../../../../lib/favorites';
// import type { User as UserType, Place as PlaceType } from '../../../../types';
// // If you prefer your existing grid UI, import it and use it instead:
// // import { PlacesGrid } from '../../../components/PlacesGrid';

// export default function ProfilePage() {
//   const { user: firebaseUser, loading: authLoading } = useAuth();
//   const [userData, setUserData] = useState<UserType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // NEW: favorites state
//   const [favoritePlaces, setFavoritePlaces] = useState<PlaceType[]>([]);
//   const [loadingFavorites, setLoadingFavorites] = useState(true);

//   useEffect(() => {
//     const loadUserData = async () => {
//       try {
//         if (!firebaseUser) {
//           setLoading(false);
//           setLoadingFavorites(false);
//           return;
//         }

//         const userRef = doc(db, 'users', firebaseUser.uid);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//           const data = userSnap.data() as any;

//           // Make sure favoritesPlaces exists on the object we put in state
//           const user: UserType = {
//             id: firebaseUser.uid,
//             email: data.email || firebaseUser.email || '',
//             name: data.name || firebaseUser.displayName || 'User',
//             avatar: data.avatar || firebaseUser.photoURL || '',
//             role: data.role || 'traveler',
//             preferences: data.preferences || { language: 'en', currency: 'USD' },
//             createdAt: data.createdAt?.toDate?.() || new Date(),
//             updatedAt: data.updatedAt?.toDate?.() || new Date(),
//             phone: data.phone || '',
//             emailVerified: firebaseUser.emailVerified || false,
//             dateOfBirth: data.dateOfBirth?.toDate?.(),
//             location: data.location || {},
//             hostProfile: data.hostProfile || {},
//             favoritesPlaces: Array.isArray(data.favoritesPlaces) ? data.favoritesPlaces : [], // 👈 ensure present
//           };

//           setUserData(user);
//         } else {
//           // Seed default profile (also with empty favoritesPlaces)
//           const defaultUserData: UserType = {
//             id: firebaseUser.uid,
//             email: firebaseUser.email || '',
//             name: firebaseUser.displayName || 'User',
//             avatar: firebaseUser.photoURL || '',
//             role: 'traveler',
//             preferences: { language: 'en', currency: 'USD' },
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             phone: '',
//             emailVerified: firebaseUser.emailVerified,
//             location: { country: '', city: '' },
//             hostProfile: { isVerified: false },
//             favoritesPlaces: [], // 👈 important
//           };
//           await setDoc(userRef, defaultUserData, { merge: true });
//           setUserData(defaultUserData);
//         }
//       } catch (e) {
//         console.error('Error loading user data:', e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!authLoading) {
//       loadUserData();
//     }
//   }, [firebaseUser, authLoading]);

//   // NEW: load favorite places after we know the user
//   useEffect(() => {
//     const run = async () => {
//       if (!firebaseUser) {
//         setFavoritePlaces([]);
//         setLoadingFavorites(false);
//         return;
//       }
//       try {
//         setLoadingFavorites(true);
//         const places = await getUserFavoritePlaces(firebaseUser.uid);
//         setFavoritePlaces(places);
//       } catch (e) {
//         console.error('Error loading favorite places:', e);
//       } finally {
//         setLoadingFavorites(false);
//       }
//     };
//     run();
//   }, [firebaseUser]);

//   const handleSavePreferences = async () => {
//     if (!firebaseUser || !userData) return;
//     setSaving(true);
//     try {
//       await updateDoc(doc(db, 'users', firebaseUser.uid), {
//         name: userData.name,
//         email: userData.email,
//         preferences: userData.preferences,
//         phone: userData.phone,
//         location: userData.location,
//         updatedAt: new Date(),
//       });
//       alert('Profile updated successfully!');
//     } catch (error) {
//       console.error('Error saving profile:', error);
//       alert('Error saving profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen pt-16 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold mx-auto mb-4" />
//           <div className="text-lg">Loading profile...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!firebaseUser) {
//     return (
//       <div className="min-h-screen pt-16 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
//           <p>You need to be logged in to view your profile.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-16 bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-8">My Profile</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Info (unchanged) */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
//             {/* ... keep your existing inputs/fields ... */}
//           </div>

//           {/* Preferences (unchanged) */}
//           <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
//             <h2 className="text-xl font-semibold mb-4">Preferences</h2>
//             {/* ... keep your existing preferences UI ... */}
//             <button
//               onClick={handleSavePreferences}
//               disabled={saving}
//               className="bg-green-500 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {saving ? (
//                 <span className="flex items-center gap-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//                   Saving...
//                 </span>
//               ) : (
//                 'Save Profile'
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Favorite Places */}
//         <div className="mt-8 bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">My Favorite Places</h2>

//           {loadingFavorites ? (
//             <div className="py-8 text-gray-500">Loading favorites…</div>
//           ) : favoritePlaces.length === 0 ? (
//             <div className="py-8 text-gray-500">You haven’t saved any places yet.</div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {favoritePlaces.map((p) => (
//                 <div key={p.id} className="border rounded-xl overflow-hidden">
//                   <div className="h-40 bg-gray-100">
//                     <img
//                       src={p.images?.[0] || '/images/placeholder.jpg'}
//                       alt={typeof p.name === 'string' ? p.name : p.name?.en || 'Place'}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div className="p-4">
//                     <div className="font-semibold line-clamp-1">
//                       {typeof p.name === 'string' ? p.name : p.name?.en || 'Place'}
//                     </div>
//                     {p.location?.address ? (
//                       <div className="text-sm text-gray-500 mt-1 line-clamp-1">
//                         {p.location.address}
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             // If you’d rather use your fancy card grid, swap the block above with:
//             // <PlacesGrid places={favoritePlaces} slug="__unknown__" columns={3} />
//           )}
//         </div>

//         {/* Recent Activity (unchanged) */}
//         <div className="mt-8 bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
//           <p className="text-gray-600">Your travel history and activity will appear here.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

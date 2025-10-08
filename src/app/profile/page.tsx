// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuth } from '../../../hooks/useAuth';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db } from '../../../lib/firebase';
// import { User as UserType } from '../../../types';

// export default function ProfilePage() {
//   const { user } = useAuth();
//   const [userData, setUserData] = useState<UserType | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//   const loadUserData = async () => {
//     // Your existing loadUserData code here
//   };
  
//   loadUserData();
// }, []);

//   const loadUserData = async () => {
//     try {
//       if (!user) return;
      
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
//       if (userDoc.exists()) {
//         setUserData(userDoc.data() as UserType);
//       }
//     } catch (error) {
//       console.error('Error loading user data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSavePreferences = async () => {
//     if (!user || !userData) return;
    
//     setSaving(true);
//     try {
//       await updateDoc(doc(db, 'users', user.uid), {
//         preferences: userData.preferences,
//         updatedAt: new Date()
//       });
//       alert('Preferences saved successfully!');
//     } catch (error) {
//       console.error('Error saving preferences:', error);
//       alert('Error saving preferences');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-16 flex items-center justify-center">
//         <div className="text-lg">Loading profile...</div>
//       </div>
//     );
//   }

//   if (!user) {
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
//           {/* Profile Info */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <p className="mt-1 text-gray-900">{userData?.name || 'Not set'}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <p className="mt-1 text-gray-900">{user?.email}</p>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Role</label>
//                 <p className="mt-1 text-gray-900 capitalize">{userData?.role || 'traveler'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Preferences */}
//           <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
//             <h2 className="text-xl font-semibold mb-4">Preferences</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
//                 <select
//                   value={userData?.preferences.language || 'en'}
//                   onChange={(e) => setUserData(prev => prev ? {
//                     ...prev,
//                     preferences: { ...prev.preferences, language: e.target.value as 'en' | 'fr' | 'ar' }
//                   } : null)}
//                   className="w-full p-2 border border-gray-300 rounded"
//                 >
//                   <option value="en">English</option>
//                   <option value="fr">French</option>
//                   <option value="ar">Arabic</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
//                 <select
//                   value={userData?.preferences.currency || 'USD'}
//                   onChange={(e) => setUserData(prev => prev ? {
//                     ...prev,
//                     preferences: { ...prev.preferences, currency: e.target.value as 'USD' | 'EUR' | 'MAD' }
//                   } : null)}
//                   className="w-full p-2 border border-gray-300 rounded"
//                 >
//                   <option value="USD">USD ($)</option>
//                   <option value="EUR">EUR (€)</option>
//                   <option value="MAD">MAD (DH)</option>
//                 </select>
//               </div>
//             </div>
//             <button
//               onClick={handleSavePreferences}
//               disabled={saving}
//               className="btn-primary disabled:opacity-50"
//             >
//               {saving ? 'Saving...' : 'Save Preferences'}
//             </button>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="mt-8 bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
//           <p className="text-gray-600">Your travel history and activity will appear here.</p>
//         </div>
//       </div>
//     </div>
//   );
// }
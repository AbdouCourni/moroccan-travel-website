// profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { User as UserType } from '../../../types';

export default function ProfilePage() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!firebaseUser) {
          setLoading(false);
          return;
        }
        
        console.log('Loading user data for:', firebaseUser.uid);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          console.log('User document found:', userDoc.data());
          const data = userDoc.data();
          setUserData({
            id: firebaseUser.uid,
            email: data.email || firebaseUser.email || '',
            name: data.name || firebaseUser.displayName || 'User',
            avatar: data.avatar || firebaseUser.photoURL || '',
            role: data.role || 'traveler',
            preferences: data.preferences || {
              language: 'en',
              currency: 'USD'
            },
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            phone: data.phone || '',
            emailVerified: firebaseUser.emailVerified || false,
            dateOfBirth: data.dateOfBirth?.toDate(),
            location: data.location || {},
            hostProfile: data.hostProfile || {}
          });
        } else {
          console.log('No user document found, creating default...');
          // Create default user data matching your interface
          const defaultUserData: UserType = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            avatar: firebaseUser.photoURL || '',
            role: 'traveler',
            preferences: {
              language: 'en',
              currency: 'USD'
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            phone: '',
            emailVerified: firebaseUser.emailVerified,
            location: {},
            hostProfile: {}
          };
          setUserData(defaultUserData);
          
          // Optionally create the document in Firestore
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultUserData);
            console.log('Default user document created');
          } catch (error) {
            console.error('Error creating user document:', error);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (!authLoading) {
      loadUserData();
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
        updatedAt: new Date()
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleNameChange = (newName: string) => {
    setUserData(prev => prev ? { ...prev, name: newName } : null);
  };

  const handlePhoneChange = (newPhone: string) => {
    setUserData(prev => prev ? { ...prev, phone: newPhone } : null);
  };

  // Show loading while auth is initializing or profile data is loading
  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold mx-auto mb-4"></div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={userData?.name || ''}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="mt-1 text-gray-900">{firebaseUser?.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {firebaseUser.emailVerified ? '✓ Verified' : '⚠ Not verified'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={userData?.phone || ''}
                  onChange={(e) => handlePhoneChange(e.target.value)}
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
                  onChange={(e) => setUserData(prev => prev ? {
                    ...prev,
                    preferences: { 
                      ...prev.preferences, 
                      language: e.target.value as 'en' | 'fr' | 'ar' | 'es'
                    }
                  } : null)}
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
                  onChange={(e) => setUserData(prev => prev ? {
                    ...prev,
                    preferences: { 
                      ...prev.preferences, 
                      currency: e.target.value as 'USD' | 'EUR' | 'MAD'
                    }
                  } : null)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="MAD">MAD (DH)</option>
                </select>
              </div>
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                   value={userData?.location?.country || ''}
                  onChange={(e) => setUserData(prev => prev ? {
                    ...prev, // Ensure all other properties of prev are carried over
                    location: { ...prev.location, country: e.target.value }
                  } : null)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                  placeholder="Enter your country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={userData?.location?.city || ''}
                  onChange={(e) => setUserData(prev => prev ? {
                    ...prev,
                    location: { ...prev.location , city: e.target.value }
                  } : null)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                  placeholder="Enter your city"
                />
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="bg-green-500 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
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
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    destinations: 0,
    accommodations: 0,
    users: 0,
    bookings: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const [destinationsSnap, accommodationsSnap, usersSnap, bookingsSnap] = await Promise.all([
        getDocs(collection(db, 'destinations')),
        getDocs(collection(db, 'accommodations')),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'bookings'))
      ]);

      setStats({
        destinations: destinationsSnap.size,
        accommodations: accommodationsSnap.size,
        users: usersSnap.size,
        bookings: bookingsSnap.size
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please log in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <span className="text-2xl">🏰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Destinations</p>
                <p className="text-2xl font-bold">{stats.destinations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <span className="text-2xl">🏨</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Accommodations</p>
                <p className="text-2xl font-bold">{stats.accommodations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Users</p>
                <p className="text-2xl font-bold">{stats.users}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Bookings</p>
                <p className="text-2xl font-bold">{stats.bookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/destinations" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow block">
            <h3 className="text-lg font-semibold mb-2">Manage Destinations</h3>
            <p className="text-gray-600 text-sm">Add, edit, or remove destination information</p>
          </Link>

          <Link href="/admin/accommodations" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow block">
            <h3 className="text-lg font-semibold mb-2">Manage Accommodations</h3>
            <p className="text-gray-600 text-sm">Manage hotels, riads, and other stays</p>
          </Link>

          <Link href="/admin/bookings" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow block">
            <h3 className="text-lg font-semibold mb-2">View Bookings</h3>
            <p className="text-gray-600 text-sm">Monitor and manage customer bookings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
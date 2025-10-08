'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface UserMenuProps {
  user: any;
  mobile?: boolean;
}

export default function UserMenu({ user, mobile = false }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (mobile) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-8 h-8 bg-primary-gold rounded-full flex items-center justify-center text-white font-semibold">
            {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
          </div>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-semibold">{user.displayName || 'User'}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
            <Link 
              href="/profile" 
              className="block px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link 
              href="/my-bookings" 
              className="block px-4 py-2 hover:bg-gray-100 text-sm"
              onClick={() => setIsOpen(false)}
            >
              My Bookings
            </Link>
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-primary-gold rounded-full flex items-center justify-center text-white font-semibold">
          {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="hidden sm:block text-gray-700">
          {user.displayName || 'User'}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-50">
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold text-gray-900">
              {user.displayName || 'User'}
            </p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
          
          <Link 
            href="/profile" 
            className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </Link>
          
          <Link 
            href="/my-bookings" 
            className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            My Bookings
          </Link>
          
          <Link 
            href="/my-reviews" 
            className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            My Reviews
          </Link>

          {user.role === 'admin' && (
            <Link 
              href="/admin" 
              className="flex items-center px-4 py-3 hover:bg-gray-50 text-sm text-primary-gold font-semibold transition-colors border-t"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin Dashboard
            </Link>
          )}

          <div className="border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 text-red-600 text-sm transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
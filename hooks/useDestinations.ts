// src/hooks/useDestinations.ts
"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, query, limit, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Destination } from '../types';

// List of top 16 Moroccan destinations
const TOP_MOROCCAN_DESTINATIONS = [
  'marrakech',     // The Red City - most famous
  'casablanca',    // Economic capital & Hassan II Mosque
  'fes',           // Cultural & spiritual capital
  'agadir',        // Beach resort city
  'chefchaouen',   // The Blue Pearl
  'essaouira',     // Coastal city with Portuguese heritage
  'rabat',         // Capital city
  'tangier',       // Gateway to Africa/Europe
  'meknes',        // Imperial city
  'ouarzazate',    // Gateway to Sahara & film studios
  'merzouga',      // Sahara desert dunes
  'ifrane',        // Little Switzerland in Atlas Mountains
  'safi',          // Pottery & fishing city
  'el-jadida',     // Portuguese heritage city
  'tetouan',       // Andalusian-influenced city
  'larache'        // Coastal city with Roman ruins
];

export const useDestinations = (limitCount: number = 10) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);

        const destinationsRef = collection(db, 'destinations');
        
        // Get all destinations first
        const q = query(destinationsRef, limit(50)); // Get enough to filter
        const querySnapshot = await getDocs(q);

        const allDestinations: Destination[] = [];
        querySnapshot.forEach((doc) => {
          allDestinations.push({
            id: doc.id,
            ...doc.data()
          } as Destination);
        });

        // Filter to only include top destinations, in the order of TOP_MOROCCAN_DESTINATIONS
        const topDestinations = TOP_MOROCCAN_DESTINATIONS
          .map(slug => allDestinations.find(dest => dest.slug === slug))
          .filter((dest): dest is Destination => dest !== undefined)
          .slice(0, limitCount);

        setDestinations(topDestinations);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [limitCount]);

  return { destinations, loading, error };
};

// Hook to get a single destination by slug
export const useDestination = (slug: string | undefined) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const destinationsRef = collection(db, 'destinations');
        const q = query(destinationsRef, where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setDestination({
            id: doc.id,
            ...doc.data()
          } as Destination);
        } else {
          setError('Destination not found');
        }
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch destination');
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [slug]);

  return { destination, loading, error };
};

// Hook specifically for top destinations (alternative approach)
export const useTopDestinations = (limitCount: number = 16) => {
  return useDestinations(limitCount);
};

// Hook to get all destinations without filtering
export const useAllDestinations = (limitCount: number = 50) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);

        const destinationsRef = collection(db, 'destinations');
        const q = query(destinationsRef, limit(limitCount));
        const querySnapshot = await getDocs(q);

        const allDestinations: Destination[] = [];
        querySnapshot.forEach((doc) => {
          allDestinations.push({
            id: doc.id,
            ...doc.data()
          } as Destination);
        });

        setDestinations(allDestinations);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [limitCount]);

  return { destinations, loading, error };
};

// Hook to search destinations
export const useSearchDestinations = (searchTerm: string, limitCount: number = 10) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);

        const destinationsRef = collection(db, 'destinations');
        const q = query(destinationsRef, limit(50)); // Get all for client-side search
        const querySnapshot = await getDocs(q);

        const allDestinations: Destination[] = [];
        querySnapshot.forEach((doc) => {
          allDestinations.push({
            id: doc.id,
            ...doc.data()
          } as Destination);
        });

        // Client-side search filtering
        const filteredDestinations = allDestinations.filter(dest => 
          dest.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.name.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.name.ar.includes(searchTerm) ||
          dest.name.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.slug.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, limitCount);

        setDestinations(filteredDestinations);
      } catch (err) {
        console.error('Error searching destinations:', err);
        setError(err instanceof Error ? err.message : 'Failed to search destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [searchTerm, limitCount]);

  return { destinations, loading, error };
};
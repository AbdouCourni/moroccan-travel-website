// src/hooks/useDestination.ts
'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Destination } from '../types';

export const useDestination = (slug: string | undefined) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchDestination = async () => {
      try {
        setLoading(true);
        setError(null);

        const destinationsRef = collection(db, 'destinations');
        const q = query(destinationsRef, where('slug', '==', slug));
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
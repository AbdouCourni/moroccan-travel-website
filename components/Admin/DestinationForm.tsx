'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Destination } from '../../types';

interface DestinationFormProps {
  destination?: Destination | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DestinationForm({ destination, onSuccess, onCancel }: DestinationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: destination?.slug || '',
    name: {
      en: destination?.name.en || '',
      fr: destination?.name.fr || '',
      ar: destination?.name.ar || ''
    },
    description: {
      en: destination?.description.en || '',
      fr: destination?.description.fr || '',
      ar: destination?.description.ar || ''
    },
    region: destination?.region || '',
    coordinates: {
      lat: destination?.coordinates.lat || 0,
      lng: destination?.coordinates.lng || 0
    },
    images: destination?.images || [''],
    highlights: destination?.highlights || [''],
    bestSeason: destination?.bestSeason || [],
    activities: destination?.activities || [''],
    travelTips: destination?.travelTips || ['']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const destinationData = {
        ...formData,
        updatedAt: new Date(),
        ...(destination ? {} : { createdAt: new Date() })
      };

      if (destination) {
        // Update existing destination
        await setDoc(doc(db, 'destinations', destination.id), destinationData, { merge: true });
      } else {
        // Create new destination
        await setDoc(doc(db, 'destinations', formData.slug), destinationData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving destination:', error);
      alert('Error saving destination. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addArrayField = (field: keyof typeof formData) => {
    setFormData(prev => {
      const current = prev[field];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [field]: [...current, '']
        };
      }
      // Optionally, handle error or ignore if not array
      return prev;
    });
  };

  const updateArrayField = (field: keyof typeof formData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as string[]).map((item, i) => i === index ? value : item)
        : prev[field]
    }));
  };

  const removeArrayField = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as string[]).filter((_, i) => i !== index)
        : prev[field]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL Identifier)</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <select
            value={formData.region}
            onChange={(e) => setFormData(prev => ({...prev, region: e.target.value}))}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Region</option>
            <option value="Central">Central</option>
            <option value="North">North</option>
            <option value="South">South</option>
            <option value="West">West</option>
            <option value="East">East</option>
          </select>
        </div>
      </div>

      {/* Name Fields */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Names</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">English Name</label>
            <input
              type="text"
              value={formData.name.en}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: { ...prev.name, en: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">French Name</label>
            <input
              type="text"
              value={formData.name.fr}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: { ...prev.name, fr: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arabic Name</label>
            <input
              type="text"
              value={formData.name.ar}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: { ...prev.name, ar: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
      </div>

      {/* Description Fields */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Descriptions</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">English Description</label>
            <textarea
              value={formData.description.en}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: { ...prev.description, en: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">French Description</label>
            <textarea
              value={formData.description.fr}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: { ...prev.description, fr: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arabic Description</label>
            <textarea
              value={formData.description.ar}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: { ...prev.description, ar: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
              required
            />
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Highlights</h3>
          <button
            type="button"
            onClick={() => addArrayField('highlights')}
            className="text-sm text-primary-gold"
          >
            + Add Highlight
          </button>
        </div>
        {formData.highlights.map((highlight, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={highlight}
              onChange={(e) => updateArrayField('highlights', index, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="Enter highlight"
            />
            <button
              type="button"
              onClick={() => removeArrayField('highlights', index)}
              className="px-3 text-red-600"
            >
              ✕
            </button>
          </div>
          ))}
        </div>
  
      </form>
  )}
     
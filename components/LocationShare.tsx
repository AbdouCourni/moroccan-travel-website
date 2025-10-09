// components/LocationShare.tsx
'use client';

import { useState } from 'react';
import { Copy, Share2, MapPin, Check, ExternalLink } from 'lucide-react';

interface LocationShareProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  address?: string;
  placeName: string;
}

export function LocationShare({ coordinates, address, placeName }: LocationShareProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLocation = async () => {
    const locationText = `${placeName}\n${address || ''}\nCoordinates: ${coordinates.lat}, ${coordinates.lng}`;
    const googleMapsUrl = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
    
    if (navigator.share) {
      // Use Web Share API if available
      try {
        await navigator.share({
          title: placeName,
          text: locationText,
          url: googleMapsUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard(`${locationText}\n${googleMapsUrl}`);
    }
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  const copyCoordinates = () => {
    copyToClipboard(`${coordinates.lat}, ${coordinates.lng}`);
  };

  const copyAddress = () => {
    if (address) {
      copyToClipboard(address);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Copy Coordinates */}
      <button
        onClick={copyCoordinates}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 border-gray-700 rounded-lg hover:border-primary-gold hover:text-primary-gold transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Coords'}
      </button>

      {/* Copy Address */}
      {address && (
        <button
          onClick={copyAddress}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 border-gray-700 rounded-lg hover:border-primary-gold hover:text-primary-gold transition-colors"
        >
          <MapPin className="w-4 h-4" />
          Address
        </button>
      )}

      {/* Share Location */}
      <button
        onClick={shareLocation}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 border-gray-700 rounded-lg hover:border-primary-gold hover:text-primary-gold transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {/* Open in Google Maps */}
      <button
        onClick={openInGoogleMaps}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 border-gray-700 rounded-lg hover:border-primary-gold hover:text-primary-gold transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Google Maps
      </button>
    </div>
  );
}
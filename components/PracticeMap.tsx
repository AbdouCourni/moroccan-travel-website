// components/SimpleMap.tsx
'use client';

import { useState } from 'react';

export default function SimpleMap() {
  // State to track selected city
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Simple data
  const cities = [
    { id: 1, name: 'Marrakech', x: 100, y: 200, color: 'bg-red-500' },
    { id: 2, name: 'Casablanca', x: 200, y: 150, color: 'bg-blue-500' },
    { id: 3, name: 'Fes', x: 300, y: 100, color: 'bg-green-500' },
    { id: 4, name: 'Agadir', x: 150, y: 300, color: 'bg-yellow-500' },
  ];

  return (
    // Main container - full width, light background, padding
    <div className="w-full min-h-screen bg-gray-100 p-4">
      
      {/* Header section */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Simple Morocco Map
        </h1>
        <p className="text-gray-600">Click on cities to select them</p>
      </div>

      {/* Content area using flexbox (simpler than grid) */}
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Map container */}
        <div className="flex-1 bg-white rounded-lg shadow p-4">
          
          {/* SVG Map */}
          <div className="relative bg-amber-100 rounded-lg p-4">
            <svg 
              viewBox="0 0 400 400" 
              className="w-full h-64 border-2 border-gray-300 rounded"
            >
              {/* Simple Morocco outline (rectangle for now) */}
              <rect 
                width="400" 
                height="400" 
                fill="#fbbf24" 
                stroke="#d97706" 
                strokeWidth="2" 
              />
              
              {/* City markers */}
              {cities.map(city => (
                <g key={city.id}>
                  {/* Circle marker */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="15"
                    fill={selectedCity === city.name ? '#dc2626' : '#4f46e5'}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setSelectedCity(city.name)}
                  />
                  
                  {/* City name label */}
                  <text
                    x={city.x}
                    y={city.y - 20}
                    textAnchor="middle"
                    className="text-sm font-bold fill-gray-800"
                  >
                    {city.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Selected city info below map */}
          {selectedCity && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <h3 className="font-bold text-lg">
                Selected: {selectedCity}
              </h3>
              <p className="text-gray-700">
                You clicked on {selectedCity}. This is a simple interactive map!
              </p>
            </div>
          )}
        </div>

        {/* Sidebar - City list */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-lg mb-3">Cities List</h3>
          
          <div className="space-y-2">
            {cities.map(city => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.name)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedCity === city.name 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${city.color}`}></div>
                  <span className="font-medium">{city.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
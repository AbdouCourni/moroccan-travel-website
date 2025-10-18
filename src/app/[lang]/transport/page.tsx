//transport/page.tsx
'use client';
import { useEffect } from 'react';
import Link from 'next/link';

function TransferWidget() {
  useEffect(() => {
    // Load the script after component mounts
    const script = document.createElement('script');
    script.src = 'https://tpwdgt.com/content?trs=464804&shmarker=677313&locale=en&show_header=true&powered_by=true&campaign_id=627&promo_id=8951';
    script.charset = 'utf-8';
    script.async = true;

    const container = document.getElementById('transfer-widget-container');
    if (container) {
      container.innerHTML = ''; // Clear loading message
      container.appendChild(script);
    }

    // Cleanup
    return () => {
      if (container && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="border-t pt-6">
      <h4 className="font-semibold mb-4 text-center">Get Instant Transfer Quotes</h4>
      <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
        <div id="transfer-widget-container">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold mx-auto mb-2"></div>
            <p className="text-gray-600">Loading transfer options...</p>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        Compare prices from multiple trusted transfer companies
      </p>
    </div>
  );
}

const transportData = [
  {
    type: 'Train',
    company: 'ONCF (Al Boraq TGV)',
    description: 'High-speed and regular trains connecting major cities',
    routes: ['Casablanca - Tangier', 'Rabat - Marrakech', 'Fes - Casablanca'],
    price: '$$',
    speed: 'Fast',
    comfort: 'High',
    website: 'https://www.oncf.ma'
  },
  {
    type: 'Bus',
    company: 'CTM & Supratours',
    description: 'Comfortable buses connecting cities and towns',
    routes: ['Marrakech - Essaouira', 'Casablanca - Fes', 'Coastal routes'],
    price: '$',
    speed: 'Medium',
    comfort: 'Medium',
    website: 'https://www.ctm.ma'
  },
  {
    type: 'Taxi',
    company: 'Petit & Grand Taxis',
    description: 'Local taxis for city and inter-city travel',
    routes: ['City centers', 'Short inter-city trips'],
    price: '$$',
    speed: 'Variable',
    comfort: 'Medium'
  },
  {
    type: 'Car Rental',
    company: 'Various',
    description: 'Freedom to explore at your own pace',
    routes: ['Anywhere in Morocco'],
    price: '$$$',
    speed: 'Flexible',
    comfort: 'High'
  },
  {
    type: 'Domestic Flights',
    company: 'Royal Air Maroc',
    description: 'Quick connections between major cities',
    routes: ['Casablanca - Marrakech', 'Tangier - Agadir'],
    price: '$$$',
    speed: 'Very Fast',
    comfort: 'High',
    website: 'https://www.royalairmaroc.com'
  }
];

const pickupAffiliates = [
  {
    name: 'Premium Transfers',
    services: ['Airport Pickups', 'City Transfers', 'Private Drivers'],
    coverage: ['Casablanca', 'Marrakech', 'Fes', 'Tangier'],
    rating: 4.8,
    price: '$$$',
    link: 'https://tp.st/bGus82aD',
    isExternal: true
  },
  {
    name: 'Morocco Shuttle',
    services: ['Shared Shuttles', 'Private Transfers', 'Desert Tours'],
    coverage: ['All major cities', 'Desert camps', 'Coastal towns'],
    rating: 4.5,
    price: '$$',
    link: 'https://morocco-shuttle.com',
    isExternal: true
  },
  {
    name: 'Luxury Rides',
    services: ['VIP Transfers', 'Business Class', 'Luxury Vehicles'],
    coverage: ['Major airports', 'City centers', 'Resorts'],
    rating: 4.9,
    price: '$$$$',
    link: '/transfers/luxury',
    isExternal: false
  }
];

export default function TransportPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-amiri text-4xl font-bold text-dark-charcoal">Getting Around Morocco</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Your comprehensive guide to transportation options across the country
          </p>
        </div>
        {/* Pickup & Transfer Booking Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Booking Form */}
            <div className="flex-1">
              <h2 className="font-amiri text-2xl font-bold mb-6">Book a Transfer</h2>

              <div className="space-y-6">



                {/* Instant Booking Widget */}
                <TransferWidget />
              </div>
            </div>

            {/* Affiliate Partners */}
            <div className="flex-1">
              <h3 className="font-amiri text-xl font-bold mb-6">Recommended Transfer Partners</h3>
              <div className="space-y-4">
                {pickupAffiliates.map((affiliate, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-gold transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{affiliate.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">{affiliate.rating}</span>
                        <span className={`px-2 py-1 rounded text-xs ${affiliate.price === '$$$$' ? 'bg-purple-100 text-purple-800' :
                            affiliate.price === '$$$' ? 'bg-red-100 text-red-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {affiliate.price}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-sm font-medium">Services: </span>
                      <span className="text-sm text-gray-600">{affiliate.services.join(', ')}</span>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm font-medium">Coverage: </span>
                      <span className="text-sm text-gray-600">{affiliate.coverage.join(', ')}</span>
                    </div>

                    {affiliate.isExternal ? (
                      <Link
                        href={affiliate.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-gold hover:text-amber-600 font-semibold text-sm inline-flex items-center gap-1"
                      >
                        View Options →
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    ) : (
                      <Link
                        href={affiliate.link}
                        className="text-primary-gold hover:text-amber-600 font-semibold text-sm inline-flex items-center gap-1"
                      >
                        View Options →
                      </Link>
                    )}
                  </div>
                ))}

                {/* Additional Widget Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-800 mb-2">Why Book With Us?</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Compare prices from multiple providers</li>
                    <li>• Instant confirmation</li>
                    <li>• Free cancellation up to 24 hours</li>
                    <li>• English-speaking drivers</li>
                    <li>• 24/7 customer support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transport Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {transportData.map((transport, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-amiri text-xl font-bold">{transport.type}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${transport.price === '$' ? 'bg-green-100 text-green-800' :
                  transport.price === '$$' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {transport.price}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{transport.description}</p>

              <div className="mb-4">
                <span className="font-semibold">Company:</span>
                <p className="text-gray-700">{transport.company}</p>
              </div>

              <div className="mb-4">
                <span className="font-semibold">Popular Routes:</span>
                <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1">
                  {transport.routes.map((route, i) => (
                    <li key={i}>{route}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Speed: {transport.speed}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  Comfort: {transport.comfort}
                </span>
              </div>

              {transport.website && (
                <Link
                  href={transport.website}
                  target="_blank"
                  className="text-primary-gold hover:text-amber-600 font-semibold"
                >
                  Visit Website →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Travel Tips */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="font-amiri text-2xl font-bold mb-6">Travel Tips & Advice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Booking Advice</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Book train tickets in advance during peak season (especially Al Boraq)</li>
                <li>• CTM buses are generally more comfortable than local buses</li>
                <li>• Always agree on taxi prices before starting your journey</li>
                <li>• International driving permit required for car rentals</li>
                <li>• Download transportation apps for real-time schedules</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Best Options by Distance</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Short distances: Local taxis or city buses</li>
                <li>• City-to-city: Trains (where available) or CTM buses</li>
                <li>• Remote areas: Supratours buses or car rental</li>
                <li>• Long distances: Domestic flights or overnight trains</li>
                <li>• Desert trips: 4x4 rentals with experienced drivers</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Important Note</h4>
            <p className="text-blue-700">
              Always check current schedules and book in advance during holidays and peak seasons.
              Transportation options may vary depending on the time of year and current conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link';

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

        {/* Transport Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {transportData.map((transport, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-amiri text-xl font-bold">{transport.type}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  transport.price === '$' ? 'bg-green-100 text-green-800' :
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
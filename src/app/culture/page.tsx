// app/culture/page.tsx
import Link from 'next/link';

const cultureData = [
  {
    category: 'Cuisine',
    title: 'Moroccan Food Culture',
    image: 'https://i.pinimg.com/736x/6a/ab/54/6aab54a833ba7a01a53bd279046d90d6.jpg',
    description: 'Discover the rich flavors of tagines, couscous, and mint tea that make Moroccan cuisine world-famous.',
    highlights: ['Tagine dishes', 'Couscous Fridays', 'Street food markets', 'Pastilla', 'Harira soup'],
    link: '/recipes' // Added link for cuisine category
  },
  {
    category: 'Traditions',
    title: 'Moroccan Hospitality',
    image: 'https://i.pinimg.com/736x/96/a4/de/96a4de224e42ab0f3ee13ac6affc6d0a.jpg',
    description: 'Experience the famous Moroccan welcome and traditional ceremonies that define local culture.',
    highlights: ['Mint tea ritual', 'Hammam culture', 'Family values', 'Wedding celebrations', 'Religious festivals']
  },
  {
    category: 'Markets',
    title: 'Souk Experience',
    image: 'https://i.pinimg.com/736x/90/5b/fc/905bfcf36b01cb0571ccbc6166b702a2.jpg',
    description: 'Immerse yourself in the vibrant atmosphere of traditional markets filled with crafts and spices.',
    highlights: ['Bargaining culture', 'Artisan crafts', 'Spice markets', 'Textile souks', 'Local interactions']
  },
  {
    category: 'Architecture',
    title: 'Islamic & Moorish Design',
    image: 'https://i.pinimg.com/736x/9c/2c/18/9c2c184094d5aa1190b88a3bd5121e2d.jpg',
    description: 'Explore the stunning geometric patterns and architectural marvels across Morocco.',
    highlights: ['Zellij mosaics', 'Riads architecture', 'Mosque designs', 'Kasbah forts', 'Andalusian influence']
  },
  {
    category: 'Music & Arts',
    title: 'Traditional Performances',
    image: 'https://i.pinimg.com/1200x/6f/39/5a/6f395a9f4b1cd7df209cf884947da5b8.jpg',
    description: 'Discover the rich musical heritage and artistic expressions unique to Morocco.',
    highlights: ['Gnawa music', 'Belly dancing', 'Storytelling', 'Carpet weaving', 'Pottery crafts']
  },
  {
    category: 'Festivals',
    title: 'Cultural Celebrations',
    image: 'https://i.pinimg.com/1200x/0d/91/61/0d91610a7abd9f487fb0a03b0cade945.jpg',
    description: 'Participate in colorful festivals that showcase Morocco\'s diverse cultural traditions.',
    highlights: ['Rose Festival', 'Date Festival', 'Marriage Festival', 'Sufi festivals', 'National holidays']
  }
];

const experiencesData = [
  {
    title: 'Cooking Class',
    description: 'Learn to prepare traditional Moroccan dishes with local chefs',
    duration: '3-4 hours',
    price: '$$',
    location: 'Marrakech, Fes, Chefchaouen'
  },
  {
    title: 'Hammam Experience',
    description: 'Traditional steam bath and massage in authentic settings',
    duration: '2 hours',
    price: '$',
    location: 'All major cities'
  },
  {
    title: 'Carpet Weaving Workshop',
    description: 'Discover the art of traditional Berber carpet making',
    duration: 'Half day',
    price: '$$$',
    location: 'Atlas Mountains, Marrakech'
  },
  {
    title: 'Gnawa Music Night',
    description: 'Experience spiritual music and dance performances',
    duration: 'Evening',
    price: '$$',
    location: 'Essaouira, Marrakech'
  }
];

export default function CulturePage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-amiri text-4xl font-bold text-dark-charcoal">Moroccan Culture & Experiences</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Immerse yourself in the rich traditions, cuisine, and artistic heritage of Morocco
          </p>
        </div>

        {/* Cultural Aspects Grid */}
        <section className="mb-16">
          <h2 className="font-amiri text-3xl font-bold text-center mb-8">Aspects of Moroccan Culture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cultureData.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <span className="inline-block bg-moroccan-blue text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-amiri text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="space-y-2 mb-4">
                    {item.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-2 h-2 bg-primary-gold rounded-full mr-2"></div>
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Explore button for Cuisine category */}
                  {item.link && (
                    <Link 
                      href={item.link}
                      className="inline-flex items-center justify-center w-full bg-primary-gold text-black py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-semibold"
                    >
                      Explore Recipes
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rest of your existing sections remain the same */}
        {/* ... Experiences Section ... */}
        {/* ... Cultural Tips Section ... */}
      </div>
    </div>
  );
}
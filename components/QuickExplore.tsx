// components/QuickExplore.tsx
import Link from 'next/link';

const regions = [
  { name: 'Marrakech', image: '/images/marrakech.jpg' },
  { name: 'Fes', image: '/images/fes.jpg' },
  { name: 'Sahara', image: '/images/sahara.jpg' },
  { name: 'Chefchaouen', image: '/images/chefchaouen.jpg' },
];

export default function QuickExplore({ lang }: { lang: string }) {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Explore by Region
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {regions.map((region) => (
            <Link
              key={region.name}
              href={`/${lang}/destinations?region=${region.name}`}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <img
                src={region.image}
                className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {region.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
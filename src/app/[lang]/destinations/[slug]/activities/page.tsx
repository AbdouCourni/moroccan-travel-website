// app/[lang]/destinations/[slug]/activities/page.tsx
import { notFound } from 'next/navigation';
import { getDestinationBySlug, getActivitiesByDestination } from '../../../../../../lib/firebase-server';
import { ActivityCard } from '../../../../../../components/ActivityCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ActivitiesPage({ params }: { params: { slug: string; lang: string } }) {
  // ✅ Fix: Use slug, not destination.id
  const destination = await getDestinationBySlug(params.slug);
  
  if (!destination) {
    notFound();
  }
  
  // ✅ Fix: Pass destination slug instead of id
  const activities = await getActivitiesByDestination(params.slug);
  
  const destinationName = destination.name?.[params.lang as keyof typeof destination.name] || destination.name?.en || 'this destination';
  const lang = params.lang || 'en';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href={`/${lang}/destinations/${params.slug}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-gold transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {destinationName}
          </Link>
          <h1 className="font-amiri text-4xl md:text-5xl font-bold text-dark-charcoal">
            Things to Do in {destinationName}
          </h1>
          <p className="text-gray-600 mt-2">
            Discover {activities.length} amazing activities and experiences
          </p>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No activities found for this destination yet.</p>
            <p className="text-sm text-gray-400 mt-2">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                lang={lang}
                destinationSlug={params.slug}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
// app/[lang]/destinations/[slug]/activities/[activitySlug]/page.tsx
import { notFound } from 'next/navigation';
import { getActivityBySlug, getDestinationBySlug } from '../../../../../../../lib/firebase-server';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Calendar, Star, Wallet, ArrowLeft, Share2, Heart } from 'lucide-react';

export default async function ActivityPage({ params }: { params: { slug: string; activitySlug: string; lang: string } }) {
  const activity = await getActivityBySlug(params.activitySlug);
  const destination = await getDestinationBySlug(params.slug);
  
  if (!activity || !destination) {
    notFound();
  }
  
  const title = activity.title?.[params.lang] || activity.title?.en;
  const description = activity.description?.[params.lang] || activity.description?.en;
  const shortDescription = activity.shortDescription?.[params.lang] || activity.shortDescription?.en;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px]">
        <Image
          src={activity.images?.[0] || '/images/placeholder.jpg'}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <Link 
              href={`/${params.lang}/destinations/${params.slug}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {destination.name?.[params.lang] || destination.name?.en}
            </Link>
            <h1 className="font-amiri text-4xl md:text-6xl font-bold mb-4">{title}</h1>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {activity.duration}
              </span>
              {activity.price?.amount > 0 && (
                <span className="flex items-center gap-1">
                  <Wallet className="w-4 h-4" /> {activity.price.amount} {activity.price.currency}
                </span>
              )}
              {activity.rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {activity.rating}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 leading-relaxed">{shortDescription}</p>
          <h2>About this experience</h2>
          <p>{description}</p>
          
          {activity.tips && activity.tips.length > 0 && (
            <>
              <h2>Insider Tips</h2>
              <ul>
                {activity.tips.map((tip: string, i: number) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </>
          )}
          
          {activity.bestTimeToVisit && activity.bestTimeToVisit.length > 0 && (
            <>
              <h2>Best Time to Visit</h2>
              <p>Best experienced during: {activity.bestTimeToVisit.join(', ')}</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
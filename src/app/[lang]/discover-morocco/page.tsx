// src/app/[lang]/discover-morocco/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Discover Morocco | Complete Travel Guide 2026 | MoroCompase",
  description: "Discover Morocco's hidden gems from the Sahara Desert to the Atlantic coast. Expert local guides, authentic riads, and unforgettable cultural experiences.",
  keywords: ["discover morocco", "morocco travel guide", "morocco tourism", "sahara desert tours"],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://morocompase.com/en/discover-morocco",
  },
};

export default function DiscoverMoroccoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb - helps SEO but isn't a call-to-action button */}
      <div className="text-sm text-gray-500 mb-8">
        <Link href="/en" className="hover:text-amber-600">Home</Link>
        <span className="mx-2">/</span>
        <span>Discover Morocco</span>
      </div>

      <h1 className="text-4xl font-bold mb-6">Discover Morocco</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-600 mb-8">
          Your complete guide to exploring Morocco's diverse landscapes, rich culture, and hidden treasures.
        </p>

        <h2>Why Visit Morocco?</h2>
        <p>Morocco offers an incredible diversity of experiences... [your content here]</p>

        <h2>Top Destinations</h2>
        <ul>
          <li><Link href="/en/marrakech" className="text-amber-600 hover:underline">Marrakech</Link> - The Red City</li>
          <li><Link href="/en/fes" className="text-amber-600 hover:underline">Fez</Link> - Ancient Medina</li>
          <li><Link href="/en/sahara" className="text-amber-600 hover:underline">Sahara Desert</Link> - Merzouga & Zagora</li>
          <li><Link href="/en/chefchaouen" className="text-amber-600 hover:underline">Chefchaouen</Link> - The Blue City</li>
          <li><Link href="/en/nador" className="text-amber-600 hover:underline">Nador</Link> - Mediterranean Coast</li>
        </ul>

        <h2>Travel Tips</h2>
        <p>Best time to visit: Spring (March-May) and Fall (September-November)...</p>

        {/* No big "Explore" button - just useful content */}
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Discover Morocco - Complete Travel Guide",
            "description": "Comprehensive guide to exploring Morocco",
            "url": "https://morocompase.com/en/discover-morocco",
          })
        }}
      />
    </div>
  );
}
// src/app/[lang]/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - MoroCompase',
  description: 'Learn about MoroCompase, your trusted guide to discovering the beauty, culture, and hospitality of Morocco.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-gold/10 to-transparent py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About MoroCompase
          </h1>
          <p className="text-xl text-gray-600">
            Your trusted compass for exploring the magic of Morocco
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <div className="w-20 h-1 bg-primary-gold mx-auto"></div>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            At MoroCompase, we believe that Morocco's rich culture, stunning landscapes, 
            and warm hospitality should be accessible to every traveler. Our mission is to 
            provide authentic, comprehensive, and up-to-date travel guides that help you 
            discover the real Morocco — from bustling medinas to serene deserts, 
            from mountain villages to coastal gems.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <div className="w-20 h-1 bg-primary-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-2">Authenticity</h3>
              <p className="text-gray-600">We share real experiences from local perspectives, not generic tourist information.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">We collaborate with local guides, businesses, and travelers to bring you the best insights.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">We promote responsible travel that benefits local communities and preserves Morocco's heritage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Explore Morocco?</h2>
          <p className="text-gray-600 mb-8">
            Let us be your compass to an unforgettable Moroccan adventure
          </p>
          <a href="/en" className="inline-block bg-primary-gold text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-primary-gold/90 transition">
            Start Exploring
          </a>
        </div>
      </section>
    </main>
  );
}
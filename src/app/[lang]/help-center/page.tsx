// src/app/[lang]/help-center/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Help Center - MoroCompase',
  description: 'Find answers to frequently asked questions about traveling in Morocco, booking stays, and using our platform.',
};

const faqCategories = [
  {
    title: 'Getting Started',
    icon: '🚀',
    questions: [
      { q: 'How do I use MoroCompase?', a: 'MoroCompase is your comprehensive Morocco travel guide. Browse destinations, discover places, read reviews, and plan your perfect Moroccan adventure.' },
      { q: 'Is MoroCompase free to use?', a: 'Yes! All destination guides, travel tips, and cultural information are completely free. Some booking features may require registration.' },
      { q: 'How do I change the language?', a: 'Click the language switcher in the top right corner to switch between English, French, Arabic, and Spanish.' },
    ],
  },
  {
    title: 'Destinations & Places',
    icon: '📍',
    questions: [
      { q: 'How are destinations selected?', a: 'We feature both popular tourist destinations and hidden gems across Morocco, curated by local experts and traveler reviews.' },
      { q: 'Can I suggest a place to add?', a: 'Absolutely! Contact us with your suggestions, and our team will review them for inclusion.' },
      { q: 'Are the opening hours updated?', a: 'We strive to keep all information current, but we recommend checking official sources for last-minute changes.' },
    ],
  },
  {
    title: 'Account & Privacy',
    icon: '🔒',
    questions: [
      { q: 'Do I need an account?', a: 'No account needed to browse. Create an account to save favorites, write reviews, and personalize your experience.' },
      { q: 'How is my data protected?', a: 'We follow industry standards for data protection. Read our Privacy Policy for detailed information.' },
      { q: 'How do I delete my account?', a: 'Contact our support team, and we will assist you with account deletion within 48 hours.' },
    ],
  },
  {
    title: 'Technical Support',
    icon: '💻',
    questions: [
      { q: 'The site is not loading properly', a: 'Try clearing your browser cache, updating your browser, or using a different device. Contact us if issues persist.' },
      { q: 'Images are not displaying', a: 'Check your internet connection. Some images are hosted externally and may load slower.' },
      { q: 'How do I report a bug?', a: 'Email us at info@morocompase.com with screenshots and a description of the issue.' },
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-gold/10 to-transparent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about traveling in Morocco and using MoroCompase
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent shadow-sm"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-gold text-white px-4 py-2 rounded-lg hover:bg-primary-gold/90 transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqCategories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{category.title}</h2>
                <div className="space-y-4">
                  {category.questions.map((item, qIdx) => (
                    <details key={qIdx} className="group">
                      <summary className="font-medium text-gray-800 cursor-pointer hover:text-primary-gold transition list-none flex items-center justify-between">
                        <span>{item.q}</span>
                        <span className="text-primary-gold group-open:rotate-180 transition">▼</span>
                      </summary>
                      <p className="mt-2 text-gray-600 pl-4 border-l-2 border-primary-gold/30">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-300 mb-8">
            Our support team is ready to help you plan your Moroccan adventure
          </p>
          <Link
            href="/en/contact"
            className="inline-block bg-primary-gold text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-primary-gold/90 transition transform hover:scale-105"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}
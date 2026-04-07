// src/app/[lang]/contact/page.tsx
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 mb-8">
            Send us an email and we'll get back to you as soon as possible.
          </p>
          <a
            href="mailto:info@morocompase.com"
            className="inline-block bg-primary-gold text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-gold/90 transition"
          >
            info@morocompase.com
          </a>
          <p className="text-gray-400 text-sm mt-6">
            We typically respond within 24-48 hours
          </p>
        </div>
      </div>
    </main>
  );
}
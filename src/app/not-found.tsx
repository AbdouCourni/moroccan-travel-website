// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">Sorry, we couldn't find the page you're looking for.</p>
        <Link 
          href="/"
          className="bg-primary-gold text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
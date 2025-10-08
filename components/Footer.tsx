import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-charcoal py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-amiri text-2xl font-bold text-primary-gold mb-4">
              MoroCompase
            </h3>
            <p className="text-black">
              Your ultimate guide to discovering the magic of Morocco. From ancient cities to modern experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-black">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/destinations" className="text-black hover:text-primary-gold transition-colors">Destinations</Link></li>
              <li><Link href="/stays" className="text-black hover:text-primary-gold transition-colors">Stays</Link></li>
              <li><Link href="/transport" className="text-black hover:text-primary-gold transition-colors">Transport</Link></li>
              <li><Link href="/culture" className="text-black hover:text-primary-gold transition-colors">Culture</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-black">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-black hover:text-primary-gold transition-colors">Help Center</a></li>
              <li><a href="#" className="text-black hover:text-primary-gold transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-black hover:text-primary-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-black hover:text-primary-gold transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-black">Connect</h4>
            <div className="space-y-2">
              <p className="text-black">info@morocompase.com</p>
              <p className="text-black">+212 XXX XXX XXX</p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-black hover:text-primary-gold transition-colors">FB</a>
                <a href="#" className="text-black hover:text-primary-gold transition-colors">IG</a>
                <a href="#" className="text-black hover:text-primary-gold transition-colors">TW</a>
                <a href="#" className="text-black hover:text-primary-gold transition-colors">YT</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-black">
          <p>&copy; {new Date().getFullYear()} MoroCompase. All rights reserved. Discover the magic of Morocco.</p>
        </div>
      </div>
    </footer>
  );
}
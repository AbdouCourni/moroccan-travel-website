// components/Footer.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { saveSubscriber } from '../lib/firebase-server';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const footerLinks = {
    explore: [
  { name: 'Destinations', href: '/en/destinations' },
  { name: 'Stays', href: '/en/stays' },
  { name: 'Transport', href: '/en/transport' },
  { name: 'Culture', href: '/en/culture' },
  { name: 'Blog', href: '/en/blog' },
  { name: 'Discover Morocco', href: '/en/discover-morocco', highlight: true },
],
    support: [
      { name: 'Help Center', href: '/en/help-center' },
      { name: 'Contact Us', href: '/en/contact' },
      { name: 'Privacy Policy', href: '/en/privacy-policy' },
      { name: 'Terms of Service', href: '/en/terms-of-service' },
      { name: 'About Us', href: '/en/about' },
    ],
    resources: [
      { name: 'Travel Tips', href: '/en/travel-tips' },
      { name: 'Packing Guide', href: '/en/packing-guide' },
      { name: 'Weather Guide', href: '/en/weather' },
      { name: 'Local Customs', href: '/en/customs' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/morocompase', icon: 'FB' },
    { name: 'Instagram', href: 'https://instagram.com/morocompase', icon: 'IG' },
    { name: 'Twitter', href: 'https://twitter.com/morocompase', icon: 'TW' },
    { name: 'YouTube', href: 'https://youtube.com/@morocompase', icon: 'YT' },
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await saveSubscriber(email);
      if (result.success) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
      } else {
        setError('Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-800 pt-12 pb-6 mt-auto border-t border-primary-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 text-center sm:text-left">
            <h3 className="font-amiri text-2xl lg:text-3xl font-bold text-gray-300 mb-4">
              MoroCompase
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md mx-auto sm:mx-0">
              Your ultimate guide to discovering the magic of Morocco. From ancient medinas to Sahara adventures, we curate authentic experiences with local experts.
            </p>
            
            {/* Newsletter Signup */}
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto sm:mx-0">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:border-primary-gold focus:ring-1 focus:ring-primary-gold outline-none text-white placeholder-gray-400"
                  aria-label="Email for newsletter"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-all duration-300 text-sm whitespace-nowrap shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 text-xs mt-2 text-center sm:text-left">
                ✓ Thank you for subscribing!
              </p>
            )}
            {error && (
              <p className="text-red-400 text-xs mt-2 text-center sm:text-left">
                {error}
              </p>
            )}
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-300 border-b border-primary-gold/30 inline-block pb-1">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-gray-300 hover:text-primary-gold transition-all duration-200 text-sm flex items-center gap-2 group ${
                      link.highlight ? 'font-semibold' : ''
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                    {link.highlight && (
                      <span className="ml-auto text-xs bg-primary-gold/20 text-primary-gold px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-300 border-b border-primary-gold/30 inline-block pb-1">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-gold transition-all duration-200 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-gray-300 border-b border-primary-gold/30 inline-block pb-1">
              Connect
            </h4>
            <div className="space-y-4">
              <a 
                href="mailto:info@morocompase.com" 
                className="flex items-center gap-3 text-gray-300 hover:text-primary-gold transition-colors text-sm group"
              >
                <Mail className="w-4 h-4 text-primary-gold" />
                <span>info@morocompase.com</span>
              </a>
              <a 
                href="tel:+212726850011" 
                className="flex items-center gap-3 text-gray-300 hover:text-primary-gold transition-colors text-sm group"
              >
                <Phone className="w-4 h-4 text-primary-gold" />
                <span>+212 726 850 011</span>
              </a>
              <div className="flex items-start gap-3 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 text-primary-gold mt-0.5 flex-shrink-0" />
                <span>Nador, Morocco</span>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-9 h-9 flex items-center justify-center bg-gray-800 hover:bg-primary-gold text-gray-300 hover:text-black rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-gold/20 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} MoroCompase. All rights reserved.
            <span className="hidden sm:inline"> • Discover the magic of Morocco.</span>
          </p>
          
          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-primary-gold text-xs sm:text-sm transition-colors group"
            aria-label="Back to top"
          >
            Back to top
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-wrap justify-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Secure Booking
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Local Experts
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            24/7 Support
          </div>
        </div>
      </div>
    </footer>
  );
}
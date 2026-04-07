// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  // Fixed English language for footer links
  const footerLinks = {
    explore: [
      { name: 'Destinations', href: '/en/destinations' },
      { name: 'Stays', href: '/en/stays' },
      { name: 'Transport', href: '/en/transport' },
      { name: 'Culture', href: '/en/culture' },
      { name: 'Discover Morocco', href: '/en/discover-morocco', highlight: true },
    ],
    support: [
      { name: 'Help Center', href: '/en/help-center' },
      { name: 'Contact Us', href: '/en/contact' },
      { name: 'Privacy Policy', href: '/en/privacy-policy' },
      { name: 'Terms of Service', href: '/en/terms-of-service' },
      { name: 'About Us', href: '/en/about' },
    ],
  };

  const socialLinks = [
    { name: 'FB', href: 'https://facebook.com/morocompase', label: 'Facebook' },
    { name: 'IG', href: 'https://instagram.com/morocompase', label: 'Instagram' },
    { name: 'TW', href: 'https://twitter.com/morocompase', label: 'Twitter' },
    { name: 'YT', href: 'https://youtube.com/@morocompase', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 py-12 mt-auto border-t border-primary-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <h3 className="font-amiri text-2xl lg:text-3xl font-bold text-primary-gold mb-3">
              MoroCompase
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your ultimate guide to discovering the magic of Morocco. From ancient cities to modern experiences.
            </p>
          </div>

          {/* Quick Links - Explore */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-lg lg:text-xl mb-4 text-primary-gold border-b border-primary-gold/30 inline-block pb-1">
              Explore
            </h4>
            <ul className="space-y-3 mt-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-gray-300 hover:text-primary-gold transition-all duration-300 text-sm lg:text-base hover:translate-x-1 inline-block ${
                      link.highlight ? 'font-semibold hover:scale-105' : ''
                    }`}
                  >
                    {link.name}
                    {link.highlight && (
                      <span className="ml-2 text-xs bg-primary-gold/20 text-primary-gold px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-lg lg:text-xl mb-4 text-primary-gold border-b border-primary-gold/30 inline-block pb-1">
              Support
            </h4>
            <ul className="space-y-3 mt-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-gold transition-all duration-300 text-sm lg:text-base hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-lg lg:text-xl mb-4 text-primary-gold border-b border-primary-gold/30 inline-block pb-1">
              Connect
            </h4>
            <div className="space-y-3 mt-3">
              <p className="text-gray-300 text-sm break-words">
                <span className="font-medium text-primary-gold">Email:</span> info@morocompase.com
              </p>
              <p className="text-gray-300 text-sm">
                <span className="font-medium text-primary-gold">Phone:</span> +212 537 123 456
              </p>
              <div className="flex justify-center sm:justify-start space-x-5 mt-5">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-gray-400 hover:text-primary-gold transition-all duration-300 hover:scale-110 text-sm font-medium"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-gold/20 mt-10 pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} MoroCompase. All rights reserved.
            <span className="hidden sm:inline"> Discover the magic of Morocco.</span>
          </p>
          <p className="text-gray-500 text-xs mt-2 sm:hidden">
            Discover the magic of Morocco.
          </p>
        </div>
      </div>
    </footer>
  );
}
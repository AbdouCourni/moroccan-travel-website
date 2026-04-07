// src/app/[lang]/contact/page.tsx
'use client';

import { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: 'General Inquiry',
          message: '',
        });
        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
        <p className="text-green-700 mb-4">
          Thank you for reaching out. We will respond to your message within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-primary-gold hover:underline font-medium"
        >
          Send another message →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error sending message</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent transition"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent transition"
            placeholder="your@email.com"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject <span className="text-red-500">*</span>
        </label>
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent transition"
        >
          <option>General Inquiry</option>
          <option>Destination Information</option>
          <option>Technical Support</option>
          <option>Partnership Opportunity</option>
          <option>Feedback</option>
          <option>Report an Issue</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent transition resize-none"
          placeholder="Tell us how we can help you..."
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform ${
          status === 'loading'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-gold text-gray-900 hover:bg-primary-gold/90 hover:scale-[1.02]'
        }`}
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-gold/10 via-transparent to-primary-gold/5 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-primary-gold mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We would love to hear from you. Send us a message and we will respond within 24 hours.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Get in Touch Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-primary-gold">📬</span> Get in Touch
              </h2>
              
              <div className="space-y-5">
                <div className="flex items-start space-x-4 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">📍</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600 text-sm">123 Mohammed V Avenue, Casablanca, Morocco</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">📧</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600 text-sm">info@morocompase.com</p>
                    <p className="text-gray-600 text-sm">support@morocompase.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">📞</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600 text-sm">+212 537 123 456</p>
                    <p className="text-gray-600 text-xs">Mon-Fri, 9am-6pm (GMT+1)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-primary-gold">🕒</span> Business Hours
              </h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span>Saturday:</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sunday:</span>
                  <span className="font-medium text-gray-400">Closed</span>
                </div>
              </div>
            </div>

            {/* Follow Us Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-primary-gold">📱</span> Follow Us
              </h2>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-500 hover:text-primary-gold transition-all duration-300 hover:scale-110 text-2xl">📘</a>
                <a href="#" className="text-gray-500 hover:text-primary-gold transition-all duration-300 hover:scale-110 text-2xl">📷</a>
                <a href="#" className="text-gray-500 hover:text-primary-gold transition-all duration-300 hover:scale-110 text-2xl">🐦</a>
                <a href="#" className="text-gray-500 hover:text-primary-gold transition-all duration-300 hover:scale-110 text-2xl">▶️</a>
                <a href="#" className="text-gray-500 hover:text-primary-gold transition-all duration-300 hover:scale-110 text-2xl">💼</a>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-500 text-sm">
                  Fill out the form below and we'll get back to you as soon as possible
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
// src/app/[lang]/terms-of-service/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - MoroCompase',
  description: 'Read our terms of service and conditions for using the MoroCompase travel platform.',
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <div className="w-20 h-1 bg-primary-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using MoroCompase ("the Website", "we", "our", "us"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed">
              MoroCompase provides travel guides, destination information, accommodation listings, and cultural content about Morocco. 
              We do not guarantee the accuracy, completeness, or timeliness of any information provided. Users should verify important details 
              directly with service providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You must be at least 13 years old to use our services</li>
              <li>You agree to provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree not to use the website for any illegal or unauthorized purpose</li>
              <li>You agree not to post false, misleading, or malicious content</li>
              <li>You agree not to scrape, copy, or redistribute our content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User-Generated Content</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              By submitting reviews, comments, photos, or other content to MoroCompase, you grant us a non-exclusive, 
              royalty-free, perpetual license to use, modify, and display that content on our platform.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You represent that you own or have permission to share any content you submit, and that your content does not 
              violate any third-party rights or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Booking and Transactions</h2>
            <p className="text-gray-700 leading-relaxed">
              MoroCompase may provide links to third-party booking platforms. We are not responsible for any transactions, 
              cancellations, or disputes between users and third-party service providers. All bookings are subject to the 
              terms and conditions of the respective service provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on MoroCompase, including text, graphics, logos, images, and software, is the property of MoroCompase 
              or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, 
              or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, MoroCompase shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or 
              other intangible losses, resulting from your use of or inability to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed">
              The information on our website is provided "as is" without any representations or warranties, express or implied. 
              We do not warrant that the website will be constantly available, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless MoroCompase and its employees, agents, and affiliates from any claims, 
              damages, losses, or expenses arising from your use of the website or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modifications to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. 
              Your continued use of the website constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of Morocco, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">📧 Email: info@morocompase.com</p>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>By using MoroCompase, you acknowledge that you have read and understood these Terms of Service.</p>
          <Link href="/en/contact" className="text-primary-gold hover:underline mt-2 inline-block">
            Contact us if you have questions →
          </Link>
        </div>
      </div>
    </main>
  );
}
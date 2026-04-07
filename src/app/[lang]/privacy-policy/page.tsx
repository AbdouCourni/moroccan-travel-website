// src/app/[lang]/privacy-policy/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - MoroCompase',
  description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</div>
        
        <div className="prose prose-lg max-w-none">
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, contact support, or leave reviews...</p>
          
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services...</p>
          
          <h2>Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information...</p>
          
          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at privacy@morocompase.com</p>
        </div>
      </div>
    </main>
  );
}
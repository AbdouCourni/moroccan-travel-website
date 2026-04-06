// src/app/page.tsx
import { redirect } from 'next/navigation';

// No metadata object - this page should not be indexed
// Google will follow the 301 redirect instead

export default function RootPage() {
  // Permanent redirect to English version
  // 301 status tells Google this is permanent and to index the target URL
  redirect('/en');
}

// Optional: Explicitly tell Google not to index this redirecting page
export const metadata = {
  robots: {
    index: false,    // Don't index this page
    follow: true,    // But follow the redirect
  },
};
// components/GoogleAnalytics.tsx
'use client';

import { GoogleAnalytics } from '@next/third-parties/google';

export function GoogleAnalyticsWrapper() {
  return (
    <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
  );
}
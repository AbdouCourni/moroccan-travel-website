import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    domains: ['images.unsplash.com', 'your-other-domains.com'],
  },
  // Add this for better production builds
  output: 'standalone',
  /* config options here */
};

export default nextConfig;

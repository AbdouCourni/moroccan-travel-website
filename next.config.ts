import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    domains: ['images.unsplash.com', 'your-other-domains.com'],
  },
  // Add this for better production builds
  output: 'standalone',
   typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
   // Add this to bypass the error temporarily
  // output: 'export',
  // trailingSlash: true,
  /* config options here */
};

export default nextConfig;

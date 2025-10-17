import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    domains: ['images.unsplash.com', 'morocompase.com','i.pinimg.com','i.imgur.com'],
  },
   remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // Allows all HTTP domains (for local development)
      },
    ],
  
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

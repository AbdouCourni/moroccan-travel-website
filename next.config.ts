import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    domains: ['images.unsplash.com', 'morocompase.com','i.pinimg.com','i.imgur.com','https://firebasestorage.googleapis.com'],
  },
 remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This should work now, but domains is preferred
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
  serverExternalPackages: [], 
   // Add this to bypass the error temporarily
  // output: 'export',
  // trailingSlash: true,
  /* config options here */
};

export default nextConfig;

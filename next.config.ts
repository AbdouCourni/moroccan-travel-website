import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    domains: [
      'images.unsplash.com', 
      'morocompase.com',
      'i.pinimg.com',
      'i.imgur.com',
      'firebasestorage.googleapis.com',
      'th.bing.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Catch-all for any hostname
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Build and performance optimizations
  swcMinify: true,
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  
  // HTTP agent for better connection handling
  httpAgentOptions: {
    keepAlive: true,
  },
  
  // Output for production deployment
  output: 'standalone',
  
  // Build error handling
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // External packages configuration
  serverExternalPackages: [],
  
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
    scrollRestoration: true,
    typedRoutes: true,
    turbo: {
      resolveAlias: {
        underscore: 'lodash',
      },
    },
  },
  
  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|react-dom-client)[\\/]/,
              name: 'react-vendor',
              chunks: 'all',
            },
            ui: {
              test: /[\\/]node_modules[\\/](lucide-react|@headlessui|@heroicons)[\\/]/,
              name: 'ui-vendor',
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },
  
  // Headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
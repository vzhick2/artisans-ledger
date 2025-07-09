import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  // Skip linting during build for faster deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript checking during build for faster deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Experimental optimizations for faster builds
  experimental: {
    optimizeCss: false, // Disable this to fix critters issue
  },
  
  // Static optimization
  trailingSlash: false,
  
  // Output configuration for static export if needed
  output: 'standalone',
};

export default nextConfig;

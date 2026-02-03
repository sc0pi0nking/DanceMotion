import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    // Formats to generate (WebP for modern browsers, JPEG fallback)
    formats: ["image/webp", "image/avif"],
    // Cache optimized images
    minimumCacheTTL: 31536000, // 1 year
    // Allow Supabase Storage URLs and external images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Disable optimization in Docker to avoid sharp issues
    unoptimized: process.env.NODE_ENV === 'production',
  },
  
  // Performance: Enable experimental features
  experimental: {
    // Optimize CSS with Turbopack
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

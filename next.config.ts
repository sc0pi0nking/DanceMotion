import type { NextConfig } from "next";

const supabaseHostname = (() => {
  try {
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!rawUrl) return null;
    return new URL(rawUrl).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    // Formats to generate (WebP for modern browsers, JPEG fallback)
    formats: ["image/webp", "image/avif"],
    // Cache optimized images
    minimumCacheTTL: 31536000, // 1 year
    // Restrict remote image loading to Supabase storage + Google review avatars
    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      // Google review author photos (Places API)
      {
        protocol: "https" as const,
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https" as const,
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
    // Optimization enabled (sharp is installed as a dependency)
    unoptimized: false,
  },
  
  // Performance: Enable experimental features
  experimental: {
    // Optimize CSS with Turbopack
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;

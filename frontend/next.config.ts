import type { NextConfig } from "next";
import dns from "node:dns";
import path from "path";

if (dns && typeof (dns as any).setDefaultResultOrder === "function") {
  try {
    (dns as any).setDefaultResultOrder("ipv4first");
  } catch {}
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "fumfjbcixcudjrnezfjl.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/boutiques", destination: "/vendors", permanent: true },
      { source: "/genie", destination: "/aura", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/partner",
        destination: "/partner/index.html",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;


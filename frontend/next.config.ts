import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Copy images to assets folder immediately during configuration setup
try {
  const brainDir = "C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\185fb7a3-cf37-4772-a9b1-b82ccedd9850";
  const targetDir = "d:\\CLOCHE\\cloche\\frontend\\public\\category-images";

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const mappings = {
    "venues.png": "venue_profile_1784907466304.png",
    "bridal-wear.png": "bridal_gown_1784907531518.png",
    "mehendi.png": "mehendi_artist_1784907511565.png",
    "decor-planning.png": "decor_planning_1784907489100.png",
    "jewellery.png": "bridal_jewellery_1784907557855.png",
  };

  for (const [targetName, sourceName] of Object.entries(mappings)) {
    const srcPath = path.join(brainDir, sourceName);
    const destPath = path.join(targetDir, targetName);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
} catch (error) {
  console.error("Failed to copy category images in config:", error);
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;

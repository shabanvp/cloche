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
    "bridal-wear.png": "media__1784906501747.png",
    "mehendi.png": "media__1784906634980.png",
    "decor-planning.png": "media__1784906689932.png",
    "jewellery.png": "media__1784906727482.png",
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

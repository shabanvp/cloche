import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CategoriesShowcase } from "@/components/CategoriesShowcase";
import fs from "fs";
import path from "path";

// Execute image copy script server-side
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
  console.error("Failed to copy category images:", error);
}

export const metadata: Metadata = {
  title: "All Categories | Cloche",
  description: "Browse every Cloche wedding category in a premium, mobile-first layout.",
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col pb-20 md:pb-0">
      <CategoriesShowcase />
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

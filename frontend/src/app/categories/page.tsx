import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CategoriesShowcase } from "@/components/CategoriesShowcase";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "All Categories | Cloche",
  description: "Browse every Cloche wedding category in a premium, mobile-first layout.",
};

export default function CategoriesPage() {
  // Execute image copy script server-side on every render/request
  try {
    const brainDir = "C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\185fb7a3-cf37-4772-a9b1-b82ccedd9850";
    const targetDir = "d:\\CLOCHE\\cloche\\frontend\\public\\category-images";

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    if (fs.existsSync(brainDir)) {
      const files = fs.readdirSync(brainDir);
      
      const findAndCopy = (prefix: string, targetName: string) => {
        const matchingFiles = files.filter(f => f.startsWith(prefix) && f.endsWith(".png"));
        if (matchingFiles.length > 0) {
          // Sort to get the latest file
          matchingFiles.sort();
          const latestFile = matchingFiles[matchingFiles.length - 1];
          const srcPath = path.join(brainDir, latestFile);
          const destPath = path.join(targetDir, targetName);
          fs.copyFileSync(srcPath, destPath);
        }
      };

      findAndCopy("venue_profile", "venues.png");
      findAndCopy("bridal_gown", "bridal-wear.png");
      findAndCopy("mehendi_artist", "mehendi.png");
      findAndCopy("decor_planning", "decor-planning.png");
      findAndCopy("bridal_jewellery", "jewellery.png");
    }
  } catch (error) {
    console.error("Failed to copy category images dynamically:", error);
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col pb-20 md:pb-0">
      <CategoriesShowcase />
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}

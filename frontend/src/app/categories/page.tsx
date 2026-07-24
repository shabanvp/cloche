import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { CategoriesShowcase } from "@/components/CategoriesShowcase";

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

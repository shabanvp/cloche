"use client";

import { BottomNavBar } from "@/components/BottomNavBar";
import { Boutique, Product } from "@/types";
import { DynamicVendorProfileRouter } from "@/components/vendor-templates/DynamicVendorProfileRouter";

interface BoutiqueProfileClientProps {
  boutique: Boutique;
  collections: Product[];
}

export function BoutiqueProfileClient({
  boutique,
  collections,
}: BoutiqueProfileClientProps) {
  const nameLower = (boutique.boutique_name || "").toLowerCase();
  const tagsLower = (boutique.tags || "").toLowerCase();
  const isVenue =
    nameLower.includes("venue") ||
    nameLower.includes("centre") ||
    nameLower.includes("center") ||
    nameLower.includes("hall") ||
    nameLower.includes("palace") ||
    nameLower.includes("resort") ||
    tagsLower.includes("venue") ||
    tagsLower.includes("centre") ||
    tagsLower.includes("center") ||
    tagsLower.includes("hall");

  const resolvedCategory =
    (boutique as any).category ||
    (isVenue
      ? "Wedding Venues"
      : tagsLower.includes("photographer") || nameLower.includes("photo")
      ? "Photographers"
      : "Bridal Wear");

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: "#FBF8F1" }}>
      {/* Dynamic Category Profile Template */}
      <main className="flex-1 w-full">
        <DynamicVendorProfileRouter
          vendorId={String(boutique.id)}
          category={resolvedCategory}
          boutique={boutique}
          collections={collections}
        />
      </main>

      <BottomNavBar activeTab="home" />
    </div>
  );
}

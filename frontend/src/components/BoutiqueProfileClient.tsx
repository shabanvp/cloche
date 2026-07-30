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
  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: "#FBF8F1" }}>
      {/* Dynamic Category Profile Template */}
      <main className="flex-1 w-full">
        <DynamicVendorProfileRouter
          vendorId={String(boutique.id)}
          category={
            (boutique as any).category ||
            (boutique.tags?.includes("Photographer")
              ? "Photographers"
              : boutique.tags?.includes("Venue")
              ? "Wedding Venues"
              : "Bridal Wear")
          }
          boutique={boutique}
          collections={collections}
        />
      </main>

      <BottomNavBar activeTab="home" />
    </div>
  );
}

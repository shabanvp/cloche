"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
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
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: "#F5F0E8" }}>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#F5F0E8]/90 backdrop-blur-md border-b border-gold/10">
        <Link
          href="/boutiques"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F4C45]/10 text-[#0F4C45]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="font-display font-semibold text-charcoal text-sm">{boutique.boutique_name}</span>
        <button onClick={() => setIsWishlisted(!isWishlisted)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0F4C45] shadow-sm">
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </header>

      {/* Dynamic Category Profile Template */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
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
        />
      </main>

      <BottomNavBar activeTab="home" />
    </div>
  );
}

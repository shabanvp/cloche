"use client";

import { BottomNavBar } from "@/components/BottomNavBar";
import { VendorStorefront } from "@/components/VendorStorefront";

interface BoutiqueProfileClientProps {
  profile: any;
}

export function BoutiqueProfileClient({ profile }: BoutiqueProfileClientProps) {
  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: "#FBF8F1" }}>
      <main className="flex-1 w-full">
        <VendorStorefront
          vendor={profile}
          storefront={profile?.storefront || profile?.storefront_config}
        />
      </main>

      <BottomNavBar activeTab="home" />
    </div>
  );
}

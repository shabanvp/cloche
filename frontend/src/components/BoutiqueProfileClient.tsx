"use client";

import { BottomNavBar } from "@/components/BottomNavBar";
import { VendorProfileData, VendorProfileLayout } from "@/components/VendorProfileLayout";

interface BoutiqueProfileClientProps {
  profile: VendorProfileData;
}

export function BoutiqueProfileClient({ profile }: BoutiqueProfileClientProps) {
  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: "#FBF8F1" }}>
      <main className="flex-1 w-full">
        <VendorProfileLayout vendor={profile} />
      </main>

      <BottomNavBar activeTab="home" />
    </div>
  );
}

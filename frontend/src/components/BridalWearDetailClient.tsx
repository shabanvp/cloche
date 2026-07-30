"use client";

import { BridalBoutiqueVendor } from "@/lib/bridalAndInvitationData";
import { DynamicVendorProfileRouter } from "@/components/vendor-templates/DynamicVendorProfileRouter";
import { BottomNavBar } from "@/components/BottomNavBar";

export function BridalWearDetailClient({ boutique }: { boutique: BridalBoutiqueVendor }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F1] pb-24 text-charcoal">
      <main className="flex-1 w-full">
        <DynamicVendorProfileRouter
          vendorId={boutique.id}
          category="Bridal Wear"
          bridalVendor={boutique}
        />
      </main>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CustomizeStoreSection } from "@/components/vendor/sections/CustomizeStoreSection";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity } from "@/lib/vendorStore";
import { VENDOR_CATEGORIES, VendorCategoryConfig } from "@/lib/vendor-categories";
import { normalizeVendorCategoryKey } from "@/lib/vendorStore";
import { BottomNavBar } from "@/components/BottomNavBar";

export default function VendorCustomizeStorePage() {
  const [vendorData, setVendorData] = useState<any>(null);
  const [categoryConfig, setCategoryConfig] = useState<VendorCategoryConfig>(VENDOR_CATEGORIES.caterers || VENDOR_CATEGORIES.photographers);

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      setVendorData(cached);
      const catKey = normalizeVendorCategoryKey(cached.category || "");
      if (VENDOR_CATEGORIES[catKey]) setCategoryConfig(VENDOR_CATEGORIES[catKey]);
    }

    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity && identity.id) {
        setVendorData(identity);
        const catKey = normalizeVendorCategoryKey(identity.category || "");
        if (VENDOR_CATEGORIES[catKey]) setCategoryConfig(VENDOR_CATEGORIES[catKey]);
      }
    });
  }, []);

  const vendorDisplayName = vendorData?.boutique_name || vendorData?.name || "Vendor Partner";

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans antialiased pb-32 pt-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/vendor"
            className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gold/15 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard Hub
          </Link>
        </div>

        <CustomizeStoreSection
          categoryConfig={categoryConfig}
          vendorName={vendorDisplayName}
        />
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}

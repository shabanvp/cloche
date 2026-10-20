"use client";

import { useState, useEffect } from "react";
import { UnifiedVendorDashboard } from "@/components/vendor/UnifiedVendorDashboard";
import { MehendiVendorDashboard } from "@/components/vendor/mehendi/MehendiVendorDashboard";
import { VendorCategoryErrorState } from "@/components/vendor/VendorCategoryErrorState";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity, normalizeVendorCategoryKey, VendorProfileData } from "@/lib/vendorStore";
import { normalizeCategory } from "@/lib/categories";

export default function VendorDashboardPage() {
  const [vendorProfile, setVendorProfile] = useState<VendorProfileData | null>(null);
  const [categoryKey, setCategoryKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check cached identity first for immediate render
    const cached = getActiveVendorIdentity();
    if (cached && cached.category) {
      setVendorProfile(cached);
      setCategoryKey(normalizeVendorCategoryKey(cached.category));
    }

    // 2. Fetch authoritative database record for the logged-in account
    fetchAuthenticatedVendorFromDb().then((profile) => {
      if (profile && profile.category) {
        setVendorProfile(profile);
        setCategoryKey(normalizeVendorCategoryKey(profile.category));
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading && !categoryKey) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-8 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0d3b30] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#0d3b30] uppercase tracking-wider">Loading Vendor Portal...</p>
        </div>
      </div>
    );
  }

  const rawCat = vendorProfile?.category || "";
  const normCat = normalizeCategory(rawCat);

  // If raw category exists but cannot be normalized to a canonical category, show Error State
  if (rawCat && !normCat) {
    return (
      <VendorCategoryErrorState
        rawCategory={rawCat}
        vendorName={vendorProfile?.boutique_name || vendorProfile?.name || "Vendor Partner"}
        vendorCode={vendorProfile?.id ? `VND-${vendorProfile.id.substring(0, 8).toUpperCase()}` : "VND-ACCOUNT"}
      />
    );
  }

  if (categoryKey === "mehendi") {
    return <MehendiVendorDashboard />;
  }

  return <UnifiedVendorDashboard categoryKey={categoryKey || "venues"} />;
}


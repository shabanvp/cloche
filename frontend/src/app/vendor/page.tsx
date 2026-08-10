"use client";

import { useState, useEffect } from "react";
import { UnifiedVendorDashboard } from "@/components/vendor/UnifiedVendorDashboard";
import { MehendiVendorDashboard } from "@/components/vendor/mehendi/MehendiVendorDashboard";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity, normalizeVendorCategoryKey } from "@/lib/vendorStore";

export default function VendorDashboardPage() {
  const [categoryKey, setCategoryKey] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check cached identity first for immediate render
    const cached = getActiveVendorIdentity();
    if (cached && cached.category) {
      setCategoryKey(normalizeVendorCategoryKey(cached.category));
    }

    // 2. Fetch authoritative database record for the logged-in account
    fetchAuthenticatedVendorFromDb().then((profile) => {
      if (profile && profile.category) {
        setCategoryKey(normalizeVendorCategoryKey(profile.category));
      } else if (!categoryKey) {
        // Fallback default
        setCategoryKey("photographers");
      }
    });
  }, []);

  if (!categoryKey) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-8 font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0d3b30] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#0d3b30] uppercase tracking-wider">Loading Vendor Portal...</p>
        </div>
      </div>
    );
  }

  if (categoryKey === "mehendi") {
    return <MehendiVendorDashboard />;
  }

  return <UnifiedVendorDashboard categoryKey={categoryKey} />;
}

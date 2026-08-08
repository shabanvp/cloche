"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { VendorSidebar } from "./VendorSidebar";
import { VendorToast } from "@/components/VendorToast";

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/vendor/login" || pathname === "/vendor/register";
  const isNavigationHub = pathname === "/vendor" || pathname === "/vendor/";
  const isStandaloneOverview = pathname === "/vendor/overview" || pathname === "/vendor/overview/";
  const isStandaloneProfile = pathname === "/vendor/profile" || pathname === "/vendor/profile/";
  const isStandalonePackages = pathname.startsWith("/vendor/packages") || pathname.startsWith("/vendor/collections-pricing");
  const isStandaloneOffers = pathname.startsWith("/vendor/offers");
  const isStandaloneAnalytics = pathname.startsWith("/vendor/analytics");
  const isStandaloneSubscription = pathname.startsWith("/vendor/subscription") || pathname.startsWith("/vendor/membership");
  const isStandaloneCustomizeStore = pathname.startsWith("/vendor/customize-store");

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between font-sans">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <VendorToast />
      </div>
    );
  }

  // Standalone full-width screens (Navigation Hub, Overview, Profile, Collections, Offers, Analytics, Subscription, Customize Store)
  if (isNavigationHub || isStandaloneOverview || isStandaloneProfile || isStandalonePackages || isStandaloneOffers || isStandaloneAnalytics || isStandaloneSubscription || isStandaloneCustomizeStore) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans justify-between">
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
          {children}
        </main>
        <VendorToast />
      </div>
    );
  }

  // Dedicated Management Sub-Pages: Render Sidebar on the left and sub-page content on the right
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between font-sans">
      <main className="flex-1 py-6 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <VendorSidebar />
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </main>
      <Footer />
      <VendorToast />
    </div>
  );
}

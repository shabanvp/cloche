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
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <VendorToast />
      </div>
    );
  }

<<<<<<< HEAD
  // Standalone full-width screens (Navigation Hub, Overview, Profile, Collections & Pricing, Offers, Analytics, Subscription, Customize Store) without sidebar or public footer
  if (isNavigationHub || isStandaloneOverview || isStandaloneProfile || isStandalonePackages || isStandaloneOffers || isStandaloneAnalytics || isStandaloneSubscription || isStandaloneCustomizeStore) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
          {children}
        </main>
      </div>
    );
  }

  // Dedicated Management Sub-Pages: Render Sidebar on the left and sub-page content on the right
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <VendorSidebar />
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {children}
=======
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between font-sans">
      <main className="flex-1 py-6 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {isNavigationHub ? (
          <>
            {/* Mobile View (<1024px): Render standalone mobile profile menu screen */}
            <div className="block lg:hidden">
              {children}
            </div>

            {/* Desktop View (>=1024px): Render Sidebar + Overview Dashboard */}
            <div className="hidden lg:flex flex-row gap-8">
              <VendorSidebar />
              <div className="flex-1 min-w-0">
                {children}
              </div>
            </div>
          </>
        ) : (
          /* Dedicated Sub-Pages: Mobile shows stack, Desktop shows 280px Sidebar + Content */
          <div className="flex flex-col lg:flex-row gap-8">
            <VendorSidebar />
            <div className="flex-1 min-w-0">
              {children}
            </div>
>>>>>>> 3023f2cd567a8ea45f66e0f949275c92824e98d3
          </div>
        )}
      </main>
<<<<<<< HEAD
=======
      
      <Footer />
      <VendorToast />
>>>>>>> 3023f2cd567a8ea45f66e0f949275c92824e98d3
    </div>
  );
}

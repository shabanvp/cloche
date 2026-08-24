"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
  Palette, 
  Package, 
  Calendar, 
  Inbox, 
  Tag, 
  BarChart3, 
  CreditCard, 
  Palette as StorePalette, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Star,
  ArrowLeft
} from "lucide-react";

import { MehendiOverviewSection } from "./sections/MehendiOverviewSection";
import { MehendiProfileSection } from "./sections/MehendiProfileSection";
import { MehendiGallerySection } from "./sections/MehendiGallerySection";
import { MehendiPricingSection } from "./sections/MehendiPricingSection";
import { MehendiEnquiriesSection } from "./sections/MehendiEnquiriesSection";
import { MehendiOffersSection } from "./sections/MehendiOffersSection";
import { MehendiAnalyticsSection } from "./sections/MehendiAnalyticsSection";
import { MehendiSubscriptionSection } from "./sections/MehendiSubscriptionSection";
import { MehendiCustomizeStoreSection } from "./sections/MehendiCustomizeStoreSection";
import { getActiveVendorIdentity, fetchAuthenticatedVendorFromDb, clearActiveVendorIdentity } from "@/lib/vendorStore";
import { VendorCoverHeader } from "../VendorCoverHeader";

export function MehendiVendorDashboard() {
  const router = useRouter();
  // Default right after login: activeTab is null (renders ONLY Cover + Profile Card + Descriptive Menu List)
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [vendorData, setVendorData] = useState<any>(null);

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      setVendorData(cached);
    }

    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity && identity.id) {
        setVendorData(identity);
      }
    });
  }, []);

  const businessName = vendorData?.name || vendorData?.boutique_name || "mehandi by henna";
  const artistName = vendorData?.artistName || "Pooja Marwar";
  const categoryLabel = "MEHENDI ARTISTS";
  const partnerBadge = vendorData?.plan || (vendorData?.isVerified || vendorData?.is_verified ? "Verified Partner" : "Registered Partner");

  const logoUrl = vendorData?.logo || vendorData?.logo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
  const coverUrl = vendorData?.coverImage || vendorData?.cover_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop";

  // Menu List items with icon, bold title, descriptive subtitle, and chevron arrow
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, desc: "Business summary, weekly bookings & performance insights" },
    { id: "profile", label: "Profile", icon: Store, desc: "Business details, contact info, outstation travel radius & working hours" },
    { id: "gallery", label: "Design Gallery", icon: Palette, desc: "Bridal, Arabic, Rajasthani, Indo-Arabic, Minimal/Party" },
    { id: "pricing", label: "Packages & Pricing", icon: Package, desc: "Bridal packages, party rates, per-hand rates & outstation charges" },
    { id: "enquiries", label: "Enquiries", icon: Inbox, desc: "Inbox of customer messages, bride leads & quote replies" },
    { id: "offers", label: "Offers", icon: Tag, desc: "Create & manage seasonal or festive discount coupons" },
    { id: "analytics", label: "Analytics", icon: BarChart3, desc: "Profile views, conversion rate & most-viewed design trends" },
    { id: "subscription", label: "Subscription", icon: CreditCard, desc: "Current plan details & membership billing" },
    { id: "customize-store", label: "Customize Store", icon: StorePalette, desc: "Logo, cover image, store branding theme & live preview" },
  ];

  const handleSignOut = () => {
    clearActiveVendorIdentity();
    router.push("/vendor/login");
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case "overview":
        return <MehendiOverviewSection artistName={artistName} businessName={businessName} onNavigate={(t) => setActiveTab(t)} />;
      case "profile":
        return <MehendiProfileSection artistName={artistName} businessName={businessName} />;
      case "gallery":
        return <MehendiGallerySection />;
      case "pricing":
        return <MehendiPricingSection />;
      case "enquiries":
        return <MehendiEnquiriesSection />;
      case "offers":
        return <MehendiOffersSection />;
      case "analytics":
        return <MehendiAnalyticsSection />;
      case "subscription":
        return <MehendiSubscriptionSection />;
      case "customize-store":
        return <MehendiCustomizeStoreSection artistName={artistName} businessName={businessName} onBack={() => setActiveTab(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans antialiased pb-36 md:pb-16">
      {activeTab === null ? (
        <>
          {/* 1. Cover Image Background Header */}
          <VendorCoverHeader coverUrl={coverUrl} altText={businessName} />

          {/* Main Container */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-20 z-10 space-y-6">
            
            {/* 2. Profile Card Overlapping Cover */}
            <div className="bg-white rounded-3xl shadow-sm border border-gold/15 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                {/* Profile Photo / Logo */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white shrink-0 -mt-14 sm:-mt-16">
                  <img src={logoUrl} alt={businessName} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">{businessName}</h1>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0d3b30]">{categoryLabel}</p>
                  
                  <div className="flex items-center justify-center sm:justify-start pt-1">
                    <span className="inline-flex items-center gap-1.5 bg-[#0d3b30] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-xs">
                      <Star className="w-3 h-3 fill-[#C8A96A]" /> {partnerBadge}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SINGLE DASHBOARD LANDING PAGE (Descriptive Menu List) */}
            <div className="bg-white rounded-3xl border border-gold/15 p-4 sm:p-6 shadow-sm space-y-2 animate-in fade-in duration-200">
              <div className="px-3 py-2 border-b border-gold/10 mb-2">
                <span className="font-serif font-bold text-xs uppercase tracking-widest text-[#0d3b30]">
                  VENDOR DASHBOARD MENU
                </span>
              </div>

              {/* Descriptive Menu List */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl transition-all group text-left border border-transparent hover:border-gold/20 hover:bg-[#FAF7F2] cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#0d3b30]/10 text-[#0d3b30] group-hover:bg-[#0d3b30] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-charcoal group-hover:text-[#0d3b30] transition-colors">{item.label}</h3>
                        <p className="text-xs text-charcoal/60 mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-charcoal/30 group-hover:text-[#0d3b30] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                );
              })}

              {/* Sign Out Action */}
              <div className="pt-3 mt-3 border-t border-gold/10 pb-4">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-4 rounded-2xl text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-red-100/70 text-red-600 flex items-center justify-center shrink-0">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Sign Out</h3>
                      <p className="text-xs text-red-500/80">Log out of your vendor account</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* DEDICATED SECTION PAGE (1 Click Deeper) */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-4 animate-in fade-in duration-300">
          <div className="bg-white px-5 py-3 rounded-2xl border border-gold/15 shadow-xs flex items-center">
            <button
              onClick={() => setActiveTab(null)}
              aria-label="Back to Dashboard Menu"
              className="bg-[#FAF7F2] hover:bg-gold/20 text-[#0d3b30] p-2.5 rounded-xl border border-gold/20 transition-all flex items-center justify-center cursor-pointer group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div>
            {renderActiveSection()}
          </div>
        </div>
      )}
    </div>
  );
}

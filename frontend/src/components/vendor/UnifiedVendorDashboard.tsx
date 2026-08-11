"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
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
import { VENDOR_CATEGORIES, VendorCategoryConfig } from "@/lib/vendor-categories";
import { OverviewSection } from "./sections/OverviewSection";
import { ProfileSection } from "./sections/ProfileSection";
import { AppointmentsSection } from "./sections/AppointmentsSection";
import { EnquiriesSection } from "./sections/EnquiriesSection";
import { OffersSection } from "./sections/OffersSection";
import { AnalyticsSection } from "./sections/AnalyticsSection";
import { SubscriptionSection } from "./sections/SubscriptionSection";
import { CustomizeStoreSection } from "./sections/CustomizeStoreSection";
import { VendorMediaModule } from "./sections/VendorMediaModule";
import { VendorPricingModule } from "./sections/VendorPricingModule";
import { VendorCoverHeader } from "./VendorCoverHeader";
import { getActiveVendorIdentity, fetchAuthenticatedVendorFromDb, clearActiveVendorIdentity } from "@/lib/vendorStore";

import { normalizeVendorCategoryKey } from "@/lib/vendorStore";

interface UnifiedVendorDashboardProps {
  categoryKey?: string;
}

export function UnifiedVendorDashboard({ categoryKey = "caterers" }: UnifiedVendorDashboardProps) {
  const router = useRouter();
  
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(categoryKey);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [vendorData, setVendorData] = useState<any>(null);

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      setVendorData(cached);
      if (cached.category) {
        setActiveCategoryKey(normalizeVendorCategoryKey(cached.category));
      }
    }

    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity && identity.id) {
        setVendorData(identity);
        if (identity.category) {
          setActiveCategoryKey(normalizeVendorCategoryKey(identity.category));
        }
      }
    });
  }, []);

  const categoryConfig: VendorCategoryConfig = VENDOR_CATEGORIES[activeCategoryKey] || VENDOR_CATEGORIES.caterers || VENDOR_CATEGORIES.photographers;

  const mediaTabId = categoryConfig.media.title.toLowerCase().replace(/[^a-z]/g, "");
  const pricingTabId = categoryConfig.pricing.title.toLowerCase().replace(/[^a-z]/g, "");

  const vendorName = vendorData?.name || vendorData?.boutique_name || "Vendor Partner";
  const vendorCategoryName = vendorData?.category || categoryConfig.name;
  const logoUrl = vendorData?.logo || vendorData?.logo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
  const coverUrl = vendorData?.coverImage || vendorData?.cover_image || categoryConfig.sampleMedia?.[0]?.image || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop";
  const partnerBadge = vendorData?.plan || "Platinum Partner";

  // Reusable 11 Navigation items matching exact requested structure
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, desc: "Business summary, weekly bookings & performance insights" },
    { id: "profile", label: "Profile", icon: Store, desc: "Business details, contact info, service area & working hours" },
    { id: mediaTabId, label: categoryConfig.media.title, icon: categoryConfig.icon, desc: categoryConfig.media.subtitle },
    { id: pricingTabId, label: categoryConfig.pricing.title, icon: Package, desc: categoryConfig.pricing.subtitle },
    { id: "appointments", label: "Appointments", icon: Calendar, desc: "Calendar view of upcoming shoots & consultation meetings" },
    { id: "enquiries", label: "Enquiries", icon: Inbox, desc: "Inbox of customer messages, couple leads & quote replies" },
    { id: "offers", label: "Offers", icon: Tag, desc: "Create & manage seasonal or festive discount packages" },
    { id: "analytics", label: "Analytics", icon: BarChart3, desc: "Profile views, conversion rate & most-viewed portfolio pieces" },
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
        return <OverviewSection categoryConfig={categoryConfig} vendorName={vendorName} onNavigate={(t) => setActiveTab(t)} />;
      case "profile":
        return <ProfileSection categoryConfig={categoryConfig} vendorName={vendorName} />;
      case mediaTabId:
        return <VendorMediaModule categoryConfig={categoryConfig} />;
      case pricingTabId:
        return <VendorPricingModule categoryConfig={categoryConfig} />;
      case "appointments":
        return <AppointmentsSection categoryConfig={categoryConfig} />;
      case "enquiries":
        return <EnquiriesSection categoryConfig={categoryConfig} />;
      case "offers":
        return <OffersSection categoryConfig={categoryConfig} />;
      case "analytics":
        return <AnalyticsSection categoryConfig={categoryConfig} />;
      case "subscription":
        return <SubscriptionSection categoryConfig={categoryConfig} />;
      case "customize-store":
        return <CustomizeStoreSection categoryConfig={categoryConfig} vendorName={vendorName} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans antialiased pb-36 md:pb-16">
      {activeTab === null ? (
        <>
          {/* 1. Cover Image Background Header */}
          <VendorCoverHeader coverUrl={coverUrl} altText={vendorName} />

          {/* Main Container */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-20 z-10 space-y-6">
            
            {/* 2. Profile Card Overlapping Cover */}
            <div className="bg-white rounded-3xl shadow-sm border border-gold/15 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white shrink-0 -mt-14 sm:-mt-16">
                  <img src={logoUrl} alt={vendorName} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">{vendorName}</h1>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0F4C45]">{vendorCategoryName}</p>
                  
                  <div className="flex items-center justify-center sm:justify-start pt-1">
                    <span className="inline-flex items-center gap-1.5 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-xs">
                      <Star className="w-3 h-3 fill-[#C8A96A]" /> {partnerBadge}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* REUSABLE DASHBOARD LANDING PAGE (Descriptive Menu List) */}
            <div className="bg-white rounded-3xl border border-gold/15 p-4 sm:p-6 shadow-sm space-y-2 animate-in fade-in duration-200">
              <div className="px-3 py-2 border-b border-gold/10 mb-2">
                <span className="font-serif font-bold text-xs uppercase tracking-widest text-[#0F4C45]">
                  VENDOR DASHBOARD MENU
                </span>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl transition-all group text-left border border-transparent hover:border-gold/20 hover:bg-[#FAF7F2] cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] group-hover:bg-[#0F4C45] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-charcoal group-hover:text-[#0F4C45] transition-colors">{item.label}</h3>
                        <p className="text-xs text-charcoal/60 mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-charcoal/30 group-hover:text-[#0F4C45] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                );
              })}

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
        /* Dedicated Section View (Sub-page) */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-4 animate-in fade-in duration-300">
          <div className="bg-white px-5 py-3 rounded-2xl border border-gold/15 shadow-xs">
            <button
              onClick={() => setActiveTab(null)}
              className="bg-[#FAF7F2] hover:bg-gold/20 text-[#0F4C45] font-bold text-xs px-4 py-2 rounded-xl border border-gold/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard Menu
            </button>
          </div>

          <div>{renderActiveSection()}</div>
        </div>
      )}
    </div>
  );
}

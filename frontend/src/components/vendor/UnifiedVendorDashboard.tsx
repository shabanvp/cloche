"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Package, 
  Calendar, 
  Inbox, 
  Tag, 
  BarChart3, 
  CreditCard, 
  Palette, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Camera,
  Sparkles,
  Palette as PaletteIcon,
  Wand2,
  UtensilsCrossed,
  Mail,
  Gem,
  Menu,
  X,
  Star,
  Check
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

export function UnifiedVendorDashboard() {
  const router = useRouter();
  
  // Category preview state (defaults to venues)
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>("venues");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categoryConfig: VendorCategoryConfig = VENDOR_CATEGORIES[activeCategoryKey] || VENDOR_CATEGORIES.venues;

  // Media module tab ID
  const mediaTabId = categoryConfig.media.title.toLowerCase().replace(/[^a-z]/g, "");
  // Pricing module tab ID
  const pricingTabId = categoryConfig.pricing.title.toLowerCase().replace(/[^a-z]/g, "");

  const vendorName = "Royal Marwar Heritage";
  const vendorLogo = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

  // Navigation Items with Card-Row Data Pattern
  const navItems = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: LayoutDashboard, 
      desc: "Business summary & recent activity" 
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: Store, 
      desc: "Business details, contact & working hours" 
    },
    { 
      id: mediaTabId, 
      label: categoryConfig.media.title, 
      icon: categoryConfig.icon, 
      desc: categoryConfig.media.subtitle,
      isVendorSpecific: true 
    },
    { 
      id: pricingTabId, 
      label: categoryConfig.pricing.title, 
      icon: Package, 
      desc: categoryConfig.pricing.subtitle,
      isVendorSpecific: true 
    },
    { 
      id: "appointments", 
      label: "Appointments", 
      icon: Calendar, 
      desc: "Manage bookings & customer visits" 
    },
    { 
      id: "enquiries", 
      label: "Enquiries", 
      icon: Inbox, 
      desc: "View & respond to customer leads" 
    },
    { 
      id: "offers", 
      label: "Offers", 
      icon: Tag, 
      desc: "Manage promotional discounts & deals" 
    },
    { 
      id: "analytics", 
      label: "Analytics", 
      icon: BarChart3, 
      desc: "Profile views & performance insights" 
    },
    { 
      id: "subscription", 
      label: "Subscription", 
      icon: CreditCard, 
      desc: "Manage current plan & billing" 
    },
    { 
      id: "customize-store", 
      label: "Customize Store", 
      icon: Palette, 
      desc: "Logo, cover image & store branding" 
    },
  ];

  const handleLogout = () => {
    router.push("/vendor/login");
  };

  // Render active main content section
  const renderActiveSection = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewSection categoryConfig={categoryConfig} vendorName={vendorName} onNavigate={(tab) => setActiveTab(tab)} />;
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
        return <OverviewSection categoryConfig={categoryConfig} vendorName={vendorName} onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans antialiased pb-20 lg:pb-12">
      {/* 1. Category Switcher Top Bar (Demo & Review Tool) */}
      <div className="bg-[#0F4C45] text-white border-b border-gold/20 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#C8A96A] text-[#072B27] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
              Category Switcher
            </span>
            <span className="text-xs text-white/90 font-medium hidden sm:inline">
              Preview Dashboard across all 8 Vendor Types:
            </span>
          </div>

          {/* Category Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
            {Object.values(VENDOR_CATEGORIES).map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategoryKey === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryKey(cat.id);
                    // Reset to overview on category switch
                    setActiveTab("overview");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#C8A96A] text-charcoal shadow-sm scale-105"
                      : "bg-white/10 hover:bg-white/20 text-white/90"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Dashboard Container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Desktop View (>=1024px) */}
        <div className="hidden lg:flex gap-6 items-start">
          {/* Sidebar Navigation */}
          <aside className="w-72 shrink-0 sticky top-20">
            <div className="bg-white rounded-3xl shadow-sm border border-gold/15 overflow-hidden">
              
              {/* Vendor Profile Header Card */}
              <div className="p-6 border-b border-gold/15 bg-[#FAF7F2]/80 text-center relative">
                <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden border-2 border-gold/30 bg-white shadow-md">
                  <img src={vendorLogo} alt={vendorName} className="w-full h-full object-cover" />
                </div>

                <h3 className="font-serif font-bold text-lg text-charcoal truncate px-2">{vendorName}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0F4C45] mt-0.5">{categoryConfig.name}</p>
                
                <div className="mt-2.5 flex items-center justify-center gap-1">
                  <span className="inline-flex items-center gap-1 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-[#C8A96A]" /> Verified Partner
                  </span>
                </div>
              </div>

              {/* Navigation Items List */}
              <nav className="p-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left group cursor-pointer ${
                        isActive
                          ? "bg-[#0F4C45] text-white shadow-sm"
                          : "text-charcoal/70 hover:bg-[#FAF7F2] hover:text-[#0F4C45]"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-gold" : "text-charcoal/40 group-hover:text-[#0F4C45]"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.isVendorSpecific && (
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          isActive ? "bg-white/20 text-white" : "bg-[#0F4C45]/10 text-[#0F4C45]"
                        }`}>
                          Module
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="pt-2 mt-2 border-t border-gold/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>

            </div>
          </aside>

          {/* Main Workspace Area */}
          <main className="flex-1 min-w-0">
            {renderActiveSection()}
          </main>
        </div>

        {/* Mobile View (<1024px) */}
        <div className="block lg:hidden space-y-6">
          {/* Mobile Category Banner */}
          <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold/20 overflow-hidden shrink-0">
                <img src={vendorLogo} alt={vendorName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">{vendorName}</h3>
                <p className="text-[11px] font-semibold text-[#0F4C45] uppercase tracking-wider">{categoryConfig.name} Dashboard</p>
              </div>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-[#FAF7F2] p-2.5 rounded-xl text-[#0F4C45] border border-gold/20 font-bold text-xs flex items-center gap-1.5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu List Drawer or Active View */}
          {mobileMenuOpen ? (
            /* Mobile Card/List Menu Grid matching Venue Dashboard spec */
            <div className="bg-white rounded-3xl border border-gold/15 p-4 shadow-sm space-y-1 animate-in fade-in duration-200">
              <div className="px-3 py-2 border-b border-gold/10 mb-2 flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-charcoal">Dashboard Menu</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4C45] bg-[#0F4C45]/10 px-2.5 py-0.5 rounded-full">
                  {categoryConfig.name}
                </span>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group text-left border cursor-pointer ${
                      isActive 
                        ? "bg-[#FAF7F2] border-[#0F4C45] shadow-xs" 
                        : "bg-white border-transparent hover:bg-[#FAF7F2] hover:border-gold/15"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? "bg-[#0F4C45] text-white"
                          : "bg-[#0F4C45]/10 text-[#0F4C45] group-hover:bg-[#0F4C45] group-hover:text-white"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-charcoal group-hover:text-[#0F4C45] transition-colors">{item.label}</h4>
                        <p className="text-[11px] text-charcoal/50">{item.desc}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-charcoal/30 group-hover:text-[#0F4C45] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                );
              })}

              <div className="pt-3 mt-3 border-t border-gold/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-red-100/60 text-red-600 flex items-center justify-center shrink-0">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Sign Out</h4>
                      <p className="text-[11px] text-red-500/80">Log out of your vendor account</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400 shrink-0" />
                </button>
              </div>
            </div>
          ) : (
            <div>{renderActiveSection()}</div>
          )}

          {/* Sticky Mobile Bottom Navigation Bar */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gold/20 p-2 z-40 flex items-center justify-around shadow-lg">
            <button
              onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold cursor-pointer ${
                activeTab === "overview" && !mobileMenuOpen ? "text-[#0F4C45]" : "text-charcoal/50"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab(mediaTabId); setMobileMenuOpen(false); }}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold cursor-pointer ${
                activeTab === mediaTabId && !mobileMenuOpen ? "text-[#0F4C45]" : "text-charcoal/50"
              }`}
            >
              <categoryConfig.icon className="w-5 h-5" />
              <span className="truncate max-w-[65px]">{categoryConfig.media.title.split(' ')[0]}</span>
            </button>

            <button
              onClick={() => { setActiveTab(pricingTabId); setMobileMenuOpen(false); }}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold cursor-pointer ${
                activeTab === pricingTabId && !mobileMenuOpen ? "text-[#0F4C45]" : "text-charcoal/50"
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Pricing</span>
            </button>

            <button
              onClick={() => { setActiveTab("enquiries"); setMobileMenuOpen(false); }}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold cursor-pointer ${
                activeTab === "enquiries" && !mobileMenuOpen ? "text-[#0F4C45]" : "text-charcoal/50"
              }`}
            >
              <Inbox className="w-5 h-5" />
              <span>Leads</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold cursor-pointer ${
                mobileMenuOpen ? "text-[#0F4C45]" : "text-charcoal/50"
              }`}
            >
              <Menu className="w-5 h-5" />
              <span>Menu</span>
            </button>
          </nav>
        </div>

      </div>
    </div>
  );
}

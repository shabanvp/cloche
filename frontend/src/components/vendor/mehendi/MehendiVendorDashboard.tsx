"use client";

import { useState } from "react";
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
  Menu,
  X,
  Sparkles
} from "lucide-react";

import { MehendiOverviewSection } from "./sections/MehendiOverviewSection";
import { MehendiProfileSection } from "./sections/MehendiProfileSection";
import { MehendiGallerySection } from "./sections/MehendiGallerySection";
import { MehendiPricingSection } from "./sections/MehendiPricingSection";
import { MehendiAppointmentsSection } from "./sections/MehendiAppointmentsSection";
import { MehendiEnquiriesSection } from "./sections/MehendiEnquiriesSection";
import { MehendiOffersSection } from "./sections/MehendiOffersSection";
import { MehendiAnalyticsSection } from "./sections/MehendiAnalyticsSection";
import { MehendiSubscriptionSection } from "./sections/MehendiSubscriptionSection";
import { MehendiCustomizeStoreSection } from "./sections/MehendiCustomizeStoreSection";

export function MehendiVendorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const artistName = "Pooja Marwar";
  const businessName = "Marwar Henna Artistry";
  const avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";

  // 11 Mehendi-Only Dashboard Navigation Items with Card/List-Row Data Pattern
  const navItems = [
    { 
      id: "overview", 
      label: "Overview", 
      icon: LayoutDashboard, 
      desc: "Home base: bookings, new enquiries & views" 
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: Store, 
      desc: "Business name, travel areas & working hours" 
    },
    { 
      id: "gallery", 
      label: "Design Gallery", 
      icon: Palette, 
      desc: "Organize Bridal, Arabic, Rajasthani & Minimal henna" 
    },
    { 
      id: "pricing", 
      label: "Packages & Pricing", 
      icon: Package, 
      desc: "Bridal packages, per-hand rates & outstation fees" 
    },
    { 
      id: "appointments", 
      label: "Appointments", 
      icon: Calendar, 
      desc: "Upcoming wedding bookings & trial sessions" 
    },
    { 
      id: "enquiries", 
      label: "Enquiries", 
      icon: Inbox, 
      desc: "Customer messages & custom quote replies" 
    },
    { 
      id: "offers", 
      label: "Offers", 
      icon: Tag, 
      desc: "Seasonal & festive discount coupons" 
    },
    { 
      id: "analytics", 
      label: "Analytics", 
      icon: BarChart3, 
      desc: "Profile impressions & most-viewed designs" 
    },
    { 
      id: "subscription", 
      label: "Subscription", 
      icon: CreditCard, 
      desc: "Current plan details & membership billing" 
    },
    { 
      id: "customize-store", 
      label: "Customize Store", 
      icon: StorePalette, 
      desc: "Logo, cover banner & storefront theme" 
    },
  ];

  const handleSignOut = () => {
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
      case "appointments":
        return <MehendiAppointmentsSection />;
      case "enquiries":
        return <MehendiEnquiriesSection />;
      case "offers":
        return <MehendiOffersSection />;
      case "analytics":
        return <MehendiAnalyticsSection />;
      case "subscription":
        return <MehendiSubscriptionSection />;
      case "customize-store":
        return <MehendiCustomizeStoreSection artistName={artistName} businessName={businessName} />;
      default:
        return <MehendiOverviewSection artistName={artistName} businessName={businessName} onNavigate={(t) => setActiveTab(t)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans antialiased pb-20 lg:pb-12">
      {/* 1. Deep Green Header Bar (#0d3b30) */}
      <header className="bg-[#0d3b30] text-white border-b border-gold/20 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C8A96A] text-[#072B27] font-serif font-bold text-xl flex items-center justify-center shadow-sm">
              M
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg text-white leading-tight">Mehendi Portal</h1>
              <p className="text-[11px] text-[#C8A96A] font-semibold tracking-wider uppercase">Cloche Vendor Network</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" /> 100% Organic Henna Certified
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-red-300 hover:text-white bg-white/10 hover:bg-red-950/40 px-3.5 py-1.5 rounded-xl border border-white/10 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Desktop View (>=1024px) */}
        <div className="hidden lg:flex gap-6 items-start">
          {/* Desktop Sticky Sidebar */}
          <aside className="w-72 shrink-0 sticky top-20">
            <div className="bg-white rounded-3xl shadow-sm border border-gold/15 overflow-hidden">
              
              {/* Profile Card Header */}
              <div className="p-6 border-b border-gold/15 bg-[#FAF7F2]/90 text-center relative">
                <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden border-2 border-gold/30 bg-white shadow-md">
                  <img src={avatarUrl} alt={businessName} className="w-full h-full object-cover" />
                </div>

                <h3 className="font-serif font-bold text-lg text-charcoal truncate px-2">{businessName}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0d3b30] mt-0.5">Mehendi Artist</p>
                
                <div className="mt-2.5 flex items-center justify-center gap-1">
                  <span className="inline-flex items-center gap-1 bg-[#0d3b30] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-[#C8A96A]" /> Platinum Artist
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
                          ? "bg-[#0d3b30] text-white shadow-sm"
                          : "text-charcoal/70 hover:bg-[#FAF7F2] hover:text-[#0d3b30]"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#C8A96A]" : "text-charcoal/40 group-hover:text-[#0d3b30]"}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}

                <div className="pt-2 mt-2 border-t border-gold/10">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>

            </div>
          </aside>

          {/* Workspace Area */}
          <main className="flex-1 min-w-0">
            {renderActiveSection()}
          </main>
        </div>

        {/* Mobile View (<1024px) */}
        <div className="block lg:hidden space-y-6">
          {/* Mobile Profile Banner */}
          <div className="bg-white p-4 rounded-3xl border border-gold/15 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold/20 overflow-hidden shrink-0">
                <img src={avatarUrl} alt={businessName} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-charcoal">{businessName}</h3>
                <p className="text-[11px] font-semibold text-[#0d3b30] uppercase tracking-wider">Mehendi Artist Dashboard</p>
              </div>
            </div>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-[#FAF7F2] p-2.5 rounded-xl text-[#0d3b30] border border-gold/20 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu List Drawer or Active Section */}
          {mobileMenuOpen ? (
            /* Card/List-Row Visual Pattern matching venue dashboard requirement */
            <div className="bg-white rounded-3xl border border-gold/15 p-4 shadow-sm space-y-1 animate-in fade-in duration-200">
              <div className="px-3 py-2 border-b border-gold/10 mb-2 flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-charcoal">Mehendi Dashboard Menu</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d3b30] bg-[#0d3b30]/10 px-2.5 py-0.5 rounded-full">
                  Artist Portal
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
                        ? "bg-[#FAF7F2] border-[#0d3b30] shadow-xs" 
                        : "bg-white border-transparent hover:bg-[#FAF7F2] hover:border-gold/15"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? "bg-[#0d3b30] text-white"
                          : "bg-[#0d3b30]/10 text-[#0d3b30] group-hover:bg-[#0d3b30] group-hover:text-white"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-charcoal group-hover:text-[#0d3b30] transition-colors">{item.label}</h4>
                        <p className="text-[11px] text-charcoal/50">{item.desc}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-charcoal/30 group-hover:text-[#0d3b30] group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                );
              })}

              <div className="pt-3 mt-3 border-t border-gold/10">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-red-100/60 text-red-600 flex items-center justify-center shrink-0">
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

          {/* Sticky Mobile Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gold/20 p-2 z-40 flex items-center justify-around shadow-lg">
            <button
              onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold cursor-pointer ${
                activeTab === "overview" && !mobileMenuOpen ? "text-[#0d3b30]" : "text-charcoal/50"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab("gallery"); setMobileMenuOpen(false); }}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold cursor-pointer ${
                activeTab === "gallery" && !mobileMenuOpen ? "text-[#0d3b30]" : "text-charcoal/50"
              }`}
            >
              <Palette className="w-5 h-5" />
              <span>Gallery</span>
            </button>

            <button
              onClick={() => { setActiveTab("pricing"); setMobileMenuOpen(false); }}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold cursor-pointer ${
                activeTab === "pricing" && !mobileMenuOpen ? "text-[#0d3b30]" : "text-charcoal/50"
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Pricing</span>
            </button>

            <button
              onClick={() => { setActiveTab("enquiries"); setMobileMenuOpen(false); }}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold cursor-pointer ${
                activeTab === "enquiries" && !mobileMenuOpen ? "text-[#0d3b30]" : "text-charcoal/50"
              }`}
            >
              <Inbox className="w-5 h-5" />
              <span>Leads</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold cursor-pointer ${
                mobileMenuOpen ? "text-[#0d3b30]" : "text-charcoal/50"
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

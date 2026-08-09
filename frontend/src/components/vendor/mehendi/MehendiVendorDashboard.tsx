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
import { getActiveVendorIdentity, fetchAuthenticatedVendorFromDb } from "@/lib/vendorStore";

export function MehendiVendorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const partnerBadge = vendorData?.plan || "Platinum Partner";
  const profileCompletion = vendorData?.profile_completion_percentage || 85;

  const logoUrl = vendorData?.logo || vendorData?.logo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
  const coverUrl = vendorData?.coverImage || vendorData?.cover_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop";

  // Strict 11 Navigation List Items (ONLY these 11, nothing more)
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, desc: "Quick summary: bookings, new enquiries, profile views" },
    { id: "profile", label: "Profile", icon: Store, desc: "Business name, contact info, service/travel area, hours" },
    { id: "gallery", label: "Design Gallery", icon: Palette, desc: "Bridal, Arabic, Rajasthani, Indo-Arabic, Minimal/Party" },
    { id: "pricing", label: "Packages & Pricing", icon: Package, desc: "Bridal package, party packages, per-hand rate, travel" },
    { id: "appointments", label: "Appointments", icon: Calendar, desc: "Calendar view of upcoming bookings & trial sessions" },
    { id: "enquiries", label: "Enquiries", icon: Inbox, desc: "Inbox of customer messages & quote replies" },
    { id: "offers", label: "Offers", icon: Tag, desc: "Create & manage seasonal or festive discounts" },
    { id: "analytics", label: "Analytics", icon: BarChart3, desc: "Profile views, conversion, most-viewed designs" },
    { id: "subscription", label: "Subscription", icon: CreditCard, desc: "Current plan details & billing" },
    { id: "customize-store", label: "Customize Store", icon: StorePalette, desc: "Logo, cover image, store branding/theme" },
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
      {/* 1. Cover Image Header Background (Uploaded Cover Photo) */}
      <div className="relative h-48 sm:h-64 lg:h-72 w-full bg-[#0d3b30] overflow-hidden">
        <img 
          src={coverUrl} 
          alt="Mehendi Cover" 
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 sm:-mt-20 z-10">
        
        {/* 2. Profile Section Overlapping Cover */}
        <div className="bg-white rounded-3xl shadow-md border border-gold/15 p-6 mb-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* Profile Photo / Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden shadow-xl bg-white shrink-0 -mt-12 sm:-mt-14">
              <img src={logoUrl} alt={businessName} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">{businessName}</h1>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0d3b30]">{categoryLabel}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="inline-flex items-center gap-1 bg-[#0d3b30] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                  <Star className="w-3 h-3 fill-[#C8A96A]" /> {partnerBadge}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Completion % */}
          <div className="w-full md:w-56 bg-[#FAF7F2] p-3.5 rounded-2xl border border-gold/15 space-y-1.5 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-charcoal">
              <span>Profile Completion</span>
              <span className="text-[#0d3b30]">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gold/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#0d3b30] h-full rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </div>

        {/* Desktop View (>=1024px) */}
        <div className="hidden lg:flex gap-6 items-start">
          {/* 3. Navigation List Sidebar (Strictly 11 Items) */}
          <aside className="w-72 shrink-0 sticky top-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gold/15 p-3 space-y-1">
              <div className="px-3 py-2 border-b border-gold/10 mb-2">
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#0d3b30]">
                  Dashboard Navigation
                </span>
              </div>

              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left group cursor-pointer ${
                      isActive
                        ? "bg-[#0d3b30] text-white shadow-sm"
                        : "text-charcoal/70 hover:bg-[#FAF7F2] hover:text-[#0d3b30]"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? "bg-white/10 text-[#C8A96A]" : "bg-[#0d3b30]/10 text-[#0d3b30]"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-all shrink-0 ${
                      isActive ? "text-white" : "text-charcoal/30 group-hover:text-[#0d3b30] group-hover:translate-x-0.5"
                    }`} />
                  </button>
                );
              })}

              <div className="pt-2 mt-2 border-t border-gold/10">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-100/70 text-red-600 flex items-center justify-center shrink-0">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span>Sign Out</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </aside>

          {/* Active Workspace View */}
          <main className="flex-1 min-w-0">
            {renderActiveSection()}
          </main>
        </div>

        {/* Mobile View (<1024px) */}
        <div className="block lg:hidden space-y-6">
          {/* Mobile Drawer Trigger Bar */}
          <div className="bg-white p-4 rounded-3xl border border-gold/15 shadow-xs flex items-center justify-between">
            <span className="font-serif font-bold text-base text-charcoal">
              {navItems.find(i => i.id === activeTab)?.label || "Overview"}
            </span>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-[#FAF7F2] p-2.5 rounded-xl text-[#0d3b30] border border-gold/20 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation List Drawer or Active Section */}
          {mobileMenuOpen ? (
            /* Card/List-Row Visual Pattern (Icon in rounded square + Bold title + Subtitle + Chevron arrow) */
            <div className="bg-white rounded-3xl border border-gold/15 p-4 shadow-sm space-y-1 animate-in fade-in duration-200">
              <div className="px-3 py-2 border-b border-gold/10 mb-2">
                <span className="font-serif font-bold text-sm text-charcoal">Mehendi Dashboard Menu</span>
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

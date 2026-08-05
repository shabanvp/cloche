"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Tag,
  Plus,
  Crown,
  ChevronRight,
  Edit3,
  Sparkles,
  Ticket
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

function VendorOffersContent() {
  const [businessName, setBusinessName] = useState("Your Business");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedName =
          localStorage.getItem("boutique_name") ||
          localStorage.getItem("vendor_name") ||
          localStorage.getItem("businessName") ||
          localStorage.getItem("user_name");

        if (storedName) setBusinessName(storedName);
      } catch (e) {}
    }
  }, []);

  const offersList = [
    {
      id: "off-1",
      name: "Grand Monsoon Wedding Offer",
      typeBadge: "PERCENTAGE",
      discount: "20% OFF",
      discountColor: "text-emerald font-bold",
      validity: "2026-08-01 – 2026-09-30",
      redemptions: "14 / 50 Redemptions",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      featured: true,
    },
    {
      id: "off-2",
      name: "Luxury Early Bird Package Deal",
      typeBadge: "FLAT",
      discount: "₹50,000 OFF",
      discountColor: "text-emerald font-bold",
      validity: "2026-08-01 – 2026-10-15",
      redemptions: "8 / 20 Redemptions",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      featured: false,
    },
    {
      id: "off-3",
      name: "Complimentary Bridal Suite & Decor Add-on",
      typeBadge: "FREE UPGRADE",
      discount: "Free Deluxe Bridal Suite & Floral Stage Upgrade",
      discountColor: "text-emerald font-semibold text-xs",
      validity: "2026-08-05 – 2026-11-30",
      redemptions: "5 / 15 Redemptions",
      image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=600&q=80",
      featured: false,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto font-sans pb-28">
      {/* Back Navigation & Status Badges */}
      <div className="space-y-4 pt-2">
        <Link
          href="/vendor"
          className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 bg-[#FAF7F2] border border-gold/25 px-3 py-1 rounded-full text-[#0F4C45] text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <Tag className="w-3.5 h-3.5 text-gold" />
            <span>OFFERS & PROMOTIONS ENGINE</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white border border-emerald/20 px-3 py-1 rounded-full text-emerald text-[11px] font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
            <span>Live & Publicly Synced</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">Offers & Promotions</h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Create attractive discounts, flash sales, package deals, and coupon codes to boost booking conversions.
          </p>
        </div>

        {/* Primary Action Button */}
        <div>
          <button className="bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Create Offer
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">ACTIVE OFFERS</p>
            <p className="text-2xl font-serif font-bold text-charcoal mt-1">3</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">UPCOMING</p>
            <p className="text-2xl font-serif font-bold text-amber-600 mt-1">1</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">EXPIRED</p>
            <p className="text-2xl font-serif font-bold text-charcoal/40 mt-1">0</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">REDEMPTIONS</p>
            <p className="text-2xl font-serif font-bold text-purple-600 mt-1">27</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">OFFER VIEWS</p>
            <p className="text-2xl font-serif font-bold text-blue-600 mt-1">2,890</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">BOOKINGS</p>
            <p className="text-2xl font-serif font-bold text-emerald mt-1">27</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">REVENUE</p>
            <p className="text-2xl font-serif font-bold text-[#0F4C45] mt-1">₹82.5L</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gold/15 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">AVG DISCOUNT</p>
            <p className="text-2xl font-serif font-bold text-amber-600 mt-1">18.5%</p>
          </div>
        </div>
      </div>

      {/* Featured Storefront Hero Ribbon Card */}
      <div className="bg-[#0F4C45] text-white p-6 rounded-2xl relative shadow-md space-y-4 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 bg-gold/20 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            <Crown className="w-3 h-3" /> STOREFRONT HERO RIBBON
          </span>
          <span className="text-[11px] text-white/70 font-medium">
            Visible on public venue page
          </span>
        </div>

        <div>
          <h2 className="text-xl font-serif font-bold text-white">
            Grand Monsoon Wedding Offer (20% OFF)
          </h2>
          <p className="text-xs text-white/80 leading-relaxed mt-2">
            This offer is currently nominated as your Storefront Featured Ribbon. Customers visiting your venue page see this offer pinned directly inside your hero section.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="bg-white/10 text-white font-mono px-4 py-2 rounded-xl border border-white/20 text-xs font-bold">
            Coupon: MONSOON20
          </span>
          <span className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/20 text-xs font-bold">
            Redemptions: 14 Bookings
          </span>
        </div>
      </div>

      {/* Quick Campaign Actions */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
        <div>
          <h3 className="text-lg font-serif font-bold text-charcoal">Quick Campaign Actions</h3>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Launch new promotional campaigns or issue customer coupon codes in 1-click.
          </p>
        </div>

        <div className="space-y-2.5">
          <button className="w-full bg-[#0F4C45] hover:bg-[#0F4C45]/90 text-white p-3.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer">
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Launch Discount Offer
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button className="w-full bg-[#FAF7F2] hover:bg-[#F0EAD9] text-charcoal border border-gold/20 p-3.5 rounded-xl font-bold text-xs flex items-center justify-between transition-colors cursor-pointer">
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#0F4C45]" /> Create Coupon Code
            </span>
            <ChevronRight className="w-4 h-4 text-charcoal/50" />
          </button>
        </div>
      </div>

      {/* Active Promotional Offers List */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gold/10 pb-3">
          <h3 className="text-lg font-serif font-bold text-charcoal">
            Active Promotional Offers (3)
          </h3>
          <span className="text-xs font-bold text-[#0F4C45] cursor-pointer hover:underline flex items-center gap-1">
            View All Offers <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="space-y-4">
          {offersList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-gold/10 bg-[#FAF7F2]/50 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gold/20 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#0F4C45] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                      {item.typeBadge}
                    </span>
                    {item.featured && (
                      <span className="bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Crown className="w-2.5 h-2.5" /> Featured Ribbon
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-serif font-bold text-charcoal">{item.name}</h4>
                  <p className={item.discountColor}>{item.discount}</p>
                  <p className="text-[11px] text-charcoal/50">
                    Validity: {item.validity}
                  </p>
                  <p className="text-[11px] text-charcoal/60 font-medium">
                    {item.redemptions}
                  </p>
                </div>
              </div>

              <button className="self-end sm:self-center text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 border border-gold/20 px-3 py-1.5 rounded-lg bg-white cursor-pointer">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}

export default function VendorOffersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-charcoal/50 font-sans">Loading offers...</div>}>
      <VendorOffersContent />
    </Suspense>
  );
}

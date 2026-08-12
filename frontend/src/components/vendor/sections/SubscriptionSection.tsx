"use client";

import { useState, useEffect } from "react";
import { CreditCard, Star, ShieldCheck, Check, Sparkles } from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";
import { getActiveVendorIdentity, fetchAuthenticatedVendorFromDb, showVendorToast } from "@/lib/vendorStore";

interface SubscriptionSectionProps {
  categoryConfig: VendorCategoryConfig;
}

export function SubscriptionSection({ categoryConfig }: SubscriptionSectionProps) {
  const [vendorData, setVendorData] = useState<any>(null);

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached) setVendorData(cached);

    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity) setVendorData(identity);
    });
  }, []);

  const activePlanName = vendorData?.plan || (vendorData?.is_verified ? "Verified Partner" : "Registered Partner");
  const isSubscribed = Boolean(vendorData?.isSubscribed);
  const planCode = vendorData?.planCode || "free";

  const plans = [
    {
      code: "gold",
      name: "Gold Partner",
      price: "₹14,999",
      billing: "/ year",
      current: planCode === "gold",
      badge: planCode === "gold" ? "Active Tier" : "Upgrade",
      features: [
        "Verified Partner Badge & Directory Badge",
        "Listed in Category Search across Kerala",
        "Upto 15 Media & Video Uploads",
        "Direct Phone & WhatsApp Customer Leads",
        "Standard Customer & Priority Email Support"
      ]
    },
    {
      code: "platinum",
      name: "Platinum Signature",
      price: "₹29,999",
      billing: "/ year",
      current: planCode === "platinum",
      badge: planCode === "platinum" ? "Active Tier" : "Most Popular",
      popular: true,
      features: [
        "Featured Top Category Placement",
        "Unlimited High-Res Gallery & 4K Videos",
        "Exclusive Platinum Partner Badge & Trust Shield",
        "Priority Customer Lead Push",
        "0% Commission on Direct Couple Bookings",
        "Dedicated Account Specialist"
      ]
    },
    {
      code: "diamond",
      name: "Diamond Luxury Suite",
      price: "₹49,999",
      billing: "/ year",
      current: planCode === "diamond",
      badge: planCode === "diamond" ? "Active Tier" : "Top Tier",
      features: [
        "Homepage Carousel Spotlight & Featured Stories",
        "Social Media Promotion (2 Dedicated Reels/yr)",
        "3D Virtual Storefront Branding & Custom Badging",
        "Unlimited Instant Leads & Custom Quote Requests",
        "24/7 VIP Concierge Manager & Dedicated Support"
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-[#C8A96A] text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#C8A96A]" /> Active Plan: {activePlanName}
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Subscription & Membership</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Manage your listing plan, billing cycles & platform benefits for {categoryConfig.name}
          </p>
        </div>

        <button 
          onClick={() => showVendorToast("Subscription billing gateway is active. Choose a plan below to upgrade.", "info")}
          className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-gold" /> Manage Billing
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 space-y-5 transition-all relative flex flex-col justify-between ${
              plan.current
                ? "bg-[#FAF7F2] border-[#0F4C45] shadow-md ring-2 ring-[#0F4C45]/20"
                : "bg-white border-gold/15 shadow-xs hover:border-gold/30"
            }`}
          >
            {plan.popular && !plan.current && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                Recommended for {categoryConfig.name}
              </span>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-charcoal">{plan.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  plan.current ? "bg-[#0F4C45] text-white" : "bg-gray-100 text-charcoal/60"
                }`}>
                  {plan.badge}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-serif text-[#0F4C45]">{plan.price}</span>
                <span className="text-xs text-charcoal/50">{plan.billing}</span>
              </div>

              <p className="text-xs text-charcoal/60 pt-1">
                {plan.current ? "Your currently active membership tier" : `Upgrade to unlock premier ${plan.name} visibility & benefits`}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-gold/15 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/70 block">
                Included Benefits:
              </span>
              <ul className="space-y-2 text-xs text-charcoal/80">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#0F4C45] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled={plan.current}
              onClick={() => showVendorToast(`Selected ${plan.name}. Contact Cloche Partner Support to activate.`, "info")}
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                plan.current
                  ? "bg-gray-100 text-charcoal/50 cursor-not-allowed border border-gray-200"
                  : "bg-[#0F4C45] hover:bg-[#072B27] text-white"
              }`}
            >
              {plan.current ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Current Active Plan
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-gold" /> Upgrade to {plan.name}
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

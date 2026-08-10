"use client";

import { CreditCard, Star, ShieldCheck, Check, Sparkles } from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";

interface SubscriptionSectionProps {
  categoryConfig: VendorCategoryConfig;
}

export function SubscriptionSection({ categoryConfig }: SubscriptionSectionProps) {
  const plans = [
    {
      name: "Gold Partner",
      price: "₹14,999",
      billing: "/ year",
      current: false,
      badge: "Standard",
      features: [
        "Verified Partner Badge",
        "Listed in Category Search",
        "Upto 15 Media Uploads",
        "Direct Phone Leads",
        "Standard Customer Support"
      ]
    },
    {
      name: "Platinum Signature",
      price: "₹29,999",
      billing: "/ year",
      current: true,
      badge: "Active Tier",
      popular: true,
      features: [
        "Featured Category Placement",
        "Unlimited High-Res Gallery & Videos",
        "Verified Gold Badge & Trust Shield",
        "Priority Customer Lead Push",
        "0% Commission on Direct Bookings",
        "Dedicated Account Specialist"
      ]
    },
    {
      name: "Diamond Luxury Suite",
      price: "₹49,999",
      billing: "/ year",
      current: false,
      badge: "Top Tier",
      features: [
        "Homepage Carousel Spotlight",
        "Social Media Promotion (2 Reels/yr)",
        "3D Virtual Storefront Branding",
        "Unlimited Leads & Custom Quotes",
        "24/7 VIP Concierge Manager"
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
              <Star className="w-3 h-3 fill-[#C8A96A]" /> Active Plan: Platinum Signature
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Subscription & Membership</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Manage your listing plan, billing cycles & platform benefits for {categoryConfig.name}
          </p>
        </div>

        <button className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer">
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
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                Most Popular for {categoryConfig.name}
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

              <ul className="space-y-2.5 pt-4 border-t border-gold/15 text-xs text-charcoal/80">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F4C45] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled={plan.current}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                plan.current
                  ? "bg-emerald-100 text-emerald-800 cursor-default"
                  : "bg-[#0F4C45] hover:bg-[#072B27] text-white shadow-xs"
              }`}
            >
              {plan.current ? "Current Plan Active" : "Upgrade Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { CreditCard, Star, Check } from "lucide-react";

export function MehendiSubscriptionSection() {
  const plans = [
    {
      name: "Gold Artist Partner",
      price: "₹9,999",
      billing: "/ year",
      current: false,
      features: [
        "Verified Henna Artist Badge",
        "Listed in Mehendi Search",
        "Upto 20 Design Uploads",
        "Direct WhatsApp & Phone Leads",
        "Standard Customer Support"
      ]
    },
    {
      name: "Platinum Signature Artist",
      price: "₹18,999",
      billing: "/ year",
      current: true,
      popular: true,
      features: [
        "Featured Category Placement",
        "Unlimited High-Res Henna Gallery Uploads",
        "100% Organic Stain Guarantee Shield",
        "Direct Bride Lead Notifications",
        "0% Commission on Direct Bookings",
        "Dedicated Account Manager"
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0d3b30] text-[#C8A96A] text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#C8A96A]" /> Active Plan: Platinum Signature Artist
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Subscription & Membership</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Manage your listing plan, billing cycles & platform benefits for your mehendi business
          </p>
        </div>

        <button className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer">
          <CreditCard className="w-4 h-4 text-[#C8A96A]" /> Manage Billing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-6 space-y-5 transition-all relative flex flex-col justify-between ${
              plan.current
                ? "bg-[#FAF7F2] border-[#0d3b30] shadow-md ring-2 ring-[#0d3b30]/15"
                : "bg-white border-gold/15 hover:border-gold/30"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0d3b30] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                Top Rated for Mehendi Artists
              </span>
            )}

            <div className="space-y-3">
              <h3 className="font-serif font-bold text-lg text-charcoal">{plan.name}</h3>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-serif text-[#0d3b30]">{plan.price}</span>
                <span className="text-xs text-charcoal/50">{plan.billing}</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-gold/15 text-xs text-charcoal/80">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0d3b30] shrink-0" />
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
                  : "bg-[#0d3b30] hover:bg-[#072B27] text-white shadow-xs"
              }`}
            >
              {plan.current ? "Current Active Plan" : "Upgrade Tier"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { CreditCard, Star, Check, Sparkles } from "lucide-react";
import { getActiveVendorIdentity, fetchAuthenticatedVendorFromDb, showVendorToast } from "@/lib/vendorStore";

export function MehendiSubscriptionSection() {
  const [vendorData, setVendorData] = useState<any>(null);

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached) setVendorData(cached);

    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity) setVendorData(identity);
    });
  }, []);

  const activePlanName = vendorData?.plan || (vendorData?.is_verified ? "Verified Partner" : "Registered Partner");
  const planCode = vendorData?.planCode || "free";

  const plans = [
    {
      code: "gold",
      name: "Gold Artist Partner",
      price: "₹9,999",
      billing: "/ year",
      current: planCode === "gold",
      features: [
        "Verified Henna Artist Badge",
        "Listed in Mehendi Search across Kerala",
        "Upto 20 Design Uploads",
        "Direct WhatsApp & Phone Leads",
        "Standard Customer Support"
      ]
    },
    {
      code: "platinum",
      name: "Platinum Signature Artist",
      price: "₹18,999",
      billing: "/ year",
      current: planCode === "platinum",
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
              <Star className="w-3 h-3 fill-[#C8A96A]" /> Active Plan: {activePlanName}
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Subscription & Membership</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Manage your listing plan, billing cycles & platform benefits for your mehendi business
          </p>
        </div>

        <button 
          onClick={() => showVendorToast("Subscription billing gateway is active. Choose a plan below to upgrade.", "info")}
          className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-[#C8A96A]" /> Manage Billing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-6 space-y-4 shadow-xs transition-all relative flex flex-col justify-between ${
              plan.current
                ? "bg-[#FAF7F2] border-[#0d3b30] ring-2 ring-[#0d3b30]/20 shadow-sm"
                : "bg-white border-gold/15 hover:border-gold/30"
            }`}
          >
            {plan.popular && !plan.current && (
              <span className="absolute top-4 right-4 bg-[#0d3b30] text-[#C8A96A] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                Recommended
              </span>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-charcoal">{plan.name}</h3>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  plan.current ? "bg-[#0d3b30] text-white" : "bg-gray-100 text-charcoal/60"
                }`}>
                  {plan.current ? "Active Plan" : "Upgrade"}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-serif text-[#0d3b30]">{plan.price}</span>
                <span className="text-xs text-charcoal/50">{plan.billing}</span>
              </div>
            </div>

            <ul className="space-y-2 pt-3 border-t border-gold/15 text-xs text-charcoal/80 flex-1">
              {plan.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#0d3b30] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              disabled={plan.current}
              onClick={() => showVendorToast(`Selected ${plan.name}. Contact Cloche Partner Support to activate.`, "info")}
              className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                plan.current
                  ? "bg-gray-100 text-charcoal/50 cursor-not-allowed border border-gray-200"
                  : "bg-[#0d3b30] hover:bg-[#072B27] text-white"
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

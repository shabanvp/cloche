"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Check, Sparkles, ShieldCheck } from "lucide-react";

export default function VendorSubscriptionPage() {
  const [businessName, setBusinessName] = useState("Your Business");
  const [currentPlan, setCurrentPlan] = useState("Premium Partner");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawUserData = localStorage.getItem("cloche_user_data");
        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          if (u.name || u.boutique_name) setBusinessName(u.name || u.boutique_name);
          if (u.plan) setCurrentPlan(u.plan);
        }
      } catch (e) {}
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto p-4 sm:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-4 gap-4">
        <div>
          <Link href="/vendor" className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
          </Link>
          <h1 className="text-3xl font-display font-bold text-charcoal">Subscription & Membership</h1>
          <p className="text-sm text-charcoal/70 mt-0.5">Manage plan features, badge status, and billing history for {businessName}.</p>
        </div>
      </div>

      {/* Current Active Plan Banner */}
      <div className="bg-gradient-to-r from-[#0B3B2D] to-[#0F4C45] text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-gold">ACTIVE MEMBERSHIP</span>
          </div>
          <h2 className="text-2xl font-display font-bold">{currentPlan} Membership</h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl">
            Your store is featured in premier category searches with verified partner badge, unlimited leads, and priority customer enquiries.
          </p>
        </div>
        <button className="bg-gold text-[#0B3B2D] hover:bg-gold-light px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">
          Upgrade Membership
        </button>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm space-y-4">
          <span className="bg-gray-100 text-charcoal text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            STANDARD VENDOR
          </span>
          <h3 className="text-2xl font-display font-bold text-charcoal">Standard Plan</h3>
          <p className="text-3xl font-bold text-charcoal">Free</p>
          <ul className="space-y-2.5 text-xs text-charcoal/80 pt-2 border-t border-gold/10">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#0F4C45]" /> Basic Store Profile Listing</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#0F4C45]" /> Direct Customer Contact Display</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#0F4C45]" /> Standard Search Visibility</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border-2 border-[#0F4C45] shadow-md space-y-4 relative">
          <span className="bg-[#0F4C45] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full absolute -top-3 right-6">
            CURRENT PLAN
          </span>
          <h3 className="text-2xl font-display font-bold text-charcoal">Premium Partner</h3>
          <p className="text-3xl font-bold text-[#0F4C45]">₹12,499 <span className="text-xs font-normal text-charcoal/60">/ year</span></p>
          <ul className="space-y-2.5 text-xs text-charcoal/80 pt-2 border-t border-gold/10">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#0F4C45]" /> Verified Partner Gold Badge</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#0F4C45]" /> Top Tier Category Search Placement</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#0F4C45]" /> Unlimited Enquiries & Bookings</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#0F4C45]" /> Dedicated Account Specialist Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

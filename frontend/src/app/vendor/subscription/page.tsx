"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Star } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity } from "@/lib/vendorStore";

export default function VendorSubscriptionPage() {
  const [businessName, setBusinessName] = useState("Your Business");
  const [currentPlan, setCurrentPlan] = useState("Registered Partner");

  useEffect(() => {
    const cached = getActiveVendorIdentity();
    if (cached) {
      if (cached.name || cached.boutique_name) setBusinessName(cached.name || cached.boutique_name);
      if (cached.plan) setCurrentPlan(cached.plan);
    }

    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity) {
        if (identity.name || identity.boutique_name) setBusinessName(identity.name || identity.boutique_name);
        if (identity.plan) setCurrentPlan(identity.plan);
      }
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto font-sans pb-28">
      {/* Back Navigation & Header */}
      <div className="space-y-2 pt-2">
        <Link
          href="/vendor"
          aria-label="Back to Dashboard"
          className="bg-[#FAF7F2] hover:bg-gold/20 text-[#0F4C45] p-2.5 rounded-xl border border-gold/20 transition-all inline-flex items-center justify-center cursor-pointer group mb-2"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <h1 className="text-3xl font-serif font-bold text-charcoal">
          Subscription & Membership
        </h1>
        <p className="text-sm text-charcoal/60">
          Manage plan features, badge status, and billing history for {businessName}.
        </p>
      </div>

      {/* Section 1 – Active Membership Card */}
      <div className="bg-[#0F4C45] text-white p-6 sm:p-8 rounded-2xl relative shadow-md overflow-hidden space-y-4">
        {/* Background Watermark Icon */}
        <ShieldCheck className="absolute -right-6 -bottom-6 w-44 h-44 text-white/10 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[#C5A262] text-[11px] font-bold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-[#C5A262]" />
            <span>ACTIVE MEMBERSHIP</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Premium Partner Membership
          </h2>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-xl">
            Your store is featured in premier category searches with verified partner badge, unlimited leads, and priority customer enquiries.
          </p>

          <div className="pt-2">
            <button className="bg-[#C5A262] hover:bg-[#B59252] text-[#0F4C45] font-bold text-xs px-6 py-3 rounded-full uppercase tracking-wider shadow-xs transition-transform active:scale-95 cursor-pointer">
              UPGRADE MEMBERSHIP
            </button>
          </div>
        </div>
      </div>

      {/* Section 2 – Standard Plan Card */}
      <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-4">
        <div>
          <span className="bg-[#FAF7F2] text-charcoal/60 border border-gold/15 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block">
            STANDARD VENDOR
          </span>
          <h3 className="text-xl font-serif font-bold text-charcoal mt-2">Standard Plan</h3>
          <p className="text-3xl font-serif font-bold text-charcoal mt-1">Free</p>
        </div>

        <ul className="space-y-3 text-xs text-charcoal/80 pt-3 border-t border-gold/10">
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0" />
            <span>Basic Store Profile Listing</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0" />
            <span>Direct Customer Contact Display</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0" />
            <span>Standard Search Visibility</span>
          </li>
        </ul>
      </div>

      {/* Section 3 – Premium Partner Plan Card */}
      <div className="bg-white p-6 rounded-2xl border-2 border-[#0F4C45] shadow-xs space-y-4 relative">
        <span className="bg-[#0F4C45] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full absolute -top-3.5 right-6">
          CURRENT PLAN
        </span>

        <div>
          <h3 className="text-xl font-serif font-bold text-charcoal">Premium Partner</h3>
          <p className="text-3xl font-serif font-bold text-[#0F4C45] mt-1">
            ₹12,499 <span className="text-xs font-sans font-normal text-charcoal/50">/ year</span>
          </p>
        </div>

        <ul className="space-y-3 text-xs text-charcoal/80 pt-3 border-t border-gold/10">
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0" />
            <span>Verified Partner Gold Badge</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0" />
            <span>Top Tier Category Search Placement</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0" />
            <span>Unlimited Enquiries & Bookings</span>
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0F4C45] shrink-0" />
            <span>Dedicated Account Specialist Support</span>
          </li>
        </ul>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}

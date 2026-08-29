"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tag, Sparkles, Copy, Check, Clock, ArrowRight, Percent } from "lucide-react";

interface DealItem {
  id: string;
  code: string;
  title: string;
  discount: string;
  description: string;
  expiry: string;
  category: "Vendor Offer" | "Shop Discount" | "Festival Special" | "Invitation Deal";
  bgGradient: string;
}

const SAMPLE_DEALS: DealItem[] = [
  {
    id: "deal-1",
    code: "CLOCHEBRIDE15",
    title: "Bridal Wear & Jewelry Offer",
    discount: "15% OFF",
    description: "Valid on orders above ₹25,000 at featured partner boutiques",
    expiry: "Expires in 5 days",
    category: "Shop Discount",
    bgGradient: "from-[#0F4C45] to-[#1A685F]",
  },
  {
    id: "deal-2",
    code: "WEDDING2026",
    title: "Early Bird Photography Booking",
    discount: "FLAT ₹10,000 OFF",
    description: "On 2-day wedding cinematography packages",
    expiry: "Limited slots",
    category: "Vendor Offer",
    bgGradient: "from-[#9A7B3E] to-[#C8A96A]",
  },
  {
    id: "deal-3",
    code: "INVITEKERALA",
    title: "Animated Invitation Package",
    discount: "50% OFF",
    description: "Get 3 interactive Save-The-Date templates for price of 1",
    expiry: "Festival Special",
    category: "Invitation Deal",
    bgGradient: "from-[#8C3A48] to-[#B34E5F]",
  },
];

export function DealsOffersSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#A97B3E]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#A97B3E]">
              Exclusive Savings
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F4C45] tracking-tight mt-1">
            Deals, Coupons & Special Offers
          </h2>
        </div>

        <Link
          href="/deals"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F4C45] hover:text-[#A97B3E] transition-colors group"
        >
          <span>View All Campaigns</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Deals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_DEALS.map((deal) => {
          const isCopied = copiedCode === deal.code;
          return (
            <div
              key={deal.id}
              className={`relative rounded-3xl p-6 text-white bg-gradient-to-br ${deal.bgGradient} shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4`}
            >
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
                  {deal.category}
                </span>

                <span className="flex items-center gap-1 text-xs text-white/80 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {deal.expiry}
                </span>
              </div>

              <div>
                <span className="font-display text-3xl font-extrabold block text-white tracking-tight">
                  {deal.discount}
                </span>
                <h3 className="font-bold text-lg text-white/95 mt-1">{deal.title}</h3>
                <p className="text-xs text-white/80 font-light mt-1 leading-relaxed">
                  {deal.description}
                </p>
              </div>

              {/* Coupon Code Strip */}
              <div className="pt-2 flex items-center justify-between gap-2 bg-black/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
                <div className="pl-2">
                  <span className="text-[10px] text-white/70 block uppercase tracking-wider">Promo Code</span>
                  <span className="font-mono text-xs font-bold text-white tracking-widest">{deal.code}</span>
                </div>

                <button
                  onClick={() => copyToClipboard(deal.code)}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-[#0F4C45] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#FAF7F2] transition-colors shadow-sm"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0F4C45]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

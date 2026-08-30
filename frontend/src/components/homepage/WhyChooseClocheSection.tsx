"use client";

import React from "react";
import { ShieldCheck, Star, Crown, Lock } from "lucide-react";

interface TrustFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  badge: string;
}

const TRUST_FEATURES: TrustFeature[] = [
  {
    id: "trust-verified",
    title: "100% Verified Vendors",
    description: "Every photographer, boutique, and venue is rigorously background-vetted for authenticity and excellence.",
    icon: ShieldCheck,
    badge: "Verified Quality",
  },
  {
    id: "trust-[#A97B3E]",
    title: "Trusted Real Reviews",
    description: "Read thousands of unedited reviews and photos from real Kerala couples who booked their dream wedding on Cloche.",
    icon: Star,
    badge: "Authentic Feedback",
  },
  {
    id: "trust-marketplace",
    title: "Premium Marketplace",
    description: "Handpicked luxury designers, heritage venues, and top-rated wedding cinematographers all in one place.",
    icon: Crown,
    badge: "Handpicked",
  },
  {
    id: "trust-booking",
    title: "Secure Booking Experience",
    description: "Transparent pricing, direct vendor messaging, and guaranteed booking protection with zero hidden costs.",
    icon: Lock,
    badge: "Guaranteed",
  },
];

export function WhyChooseClocheSection() {
  return (
    <section className="py-12 bg-white border-y border-[#EBE4D8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#A97B3E]">
            The Cloche Guarantee
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F4C45] tracking-tight">
            Why Kerala Couples Choose Cloche
          </h2>
          <p className="text-xs md:text-sm text-[#5C5549] font-light leading-relaxed">
            We simplify your wedding planning with trusted experts, transparent pricing, and direct luxury connections.
          </p>
        </div>

        {/* 4 Trust Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative bg-[#FAF7F2] rounded-3xl p-6 border border-[#EBE4D8] shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#0F4C45] text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#A97B3E] transition-all">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-white text-[#0F4C45] border border-[#EBE4D8] text-[10px] font-bold tracking-wide">
                      {feature.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-[#0F4C45] group-hover:text-[#A97B3E] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[#5C5549] mt-2 font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EBE4D8]/60 flex items-center gap-1.5 text-[11px] font-semibold text-[#0F4C45]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A97B3E]" />
                  <span>Cloche Trust Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

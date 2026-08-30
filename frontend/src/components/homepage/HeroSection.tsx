"use client";

import React from "react";
import Link from "next/link";
import { AutocompleteSearch } from "@/components/AutocompleteSearch";
import { DynamicBannerSlider } from "./DynamicBannerSlider";
import { Camera, MapPin, Sparkles, Paintbrush, Mail, Heart, CheckCircle2 } from "lucide-react";

const QUICK_SHORTCUTS = [
  { label: "Venues", href: "/venues", icon: MapPin, color: "hover:border-[#0F4C45] hover:text-[#0F4C45]" },
  { label: "Photographers", href: "/photographers", icon: Camera, color: "hover:border-[#C8A96A] hover:text-[#9A7B3E]" },
  { label: "Makeup", href: "/makeup", icon: Sparkles, color: "hover:border-[#D7C2A0] hover:text-[#8C6B28]" },
  { label: "Decor", href: "/categories/decor-planning", icon: Paintbrush, color: "hover:border-[#0F4C45] hover:text-[#0F4C45]" },
  { label: "Invitations", href: "/digital-invitations", icon: Mail, color: "hover:border-[#C8A96A] hover:text-[#9A7B3E]" },
];

export function HeroSection() {
  return (
    <section className="relative pt-4 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Dynamic Seasonal Banner Carousel */}
      <DynamicBannerSlider />

      {/* Primary Search CTA & Quick Category Shortcuts */}
      <div className="relative -mt-10 md:-mt-12 z-30 max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-4 md:p-6 shadow-[0_16px_48px_rgba(15,76,69,0.12)] border border-[#EBE4D8]">
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="w-2 h-2 rounded-full bg-[#0F4C45] animate-ping" />
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F4C45]">
            Find Everything For Your Dream Wedding
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <AutocompleteSearch placeholder="Search vendors, venues, makeup artists, photographers or invitations..." />
        </div>

        {/* Quick Category Shortcut Pills */}
        <div className="mt-4 pt-3 border-t border-[#F5EFE6] flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <span className="text-xs font-medium text-[#7A776E] shrink-0">Popular:</span>
          {QUICK_SHORTCUTS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FAF7F2] text-[#2B2B2B] border border-[#EBE4D8] transition-all hover:scale-[1.03] shrink-0 ${item.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

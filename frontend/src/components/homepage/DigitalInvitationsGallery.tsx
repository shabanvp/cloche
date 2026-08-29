"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Eye, Edit3, Download, ArrowRight, Check } from "lucide-react";

interface InvitationItem {
  id: string;
  title: string;
  style: "Trending" | "Premium" | "Traditional" | "Minimal" | "Luxury" | "Floral" | "Modern";
  image: string;
  price: string;
  isAnimated: boolean;
}

const SAMPLE_INVITATIONS: InvitationItem[] = [
  {
    id: "inv-1",
    title: "Royal Kerala Temple Gold",
    style: "Luxury",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    price: "Free / Premium ₹499",
    isAnimated: true,
  },
  {
    id: "inv-2",
    title: "Minimal Botanical Palms",
    style: "Minimal",
    image: "https://images.unsplash.com/photo-1546804784-896d0dca3800?auto=format&fit=crop&w=800&q=80",
    price: "Free",
    isAnimated: false,
  },
  {
    id: "inv-3",
    title: "Floral Romance & Gold Foil",
    style: "Floral",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    price: "Premium ₹299",
    isAnimated: true,
  },
  {
    id: "inv-4",
    title: "Nostalgic Vintage Heritage",
    style: "Traditional",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
    price: "Free / Premium ₹499",
    isAnimated: true,
  },
];

const CATEGORY_TABS = ["All", "Trending", "Luxury", "Minimal", "Floral", "Traditional", "Modern"] as const;

export function DigitalInvitationsGallery() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [previewItem, setPreviewItem] = useState<InvitationItem | null>(null);

  const filtered = activeTab === "All"
    ? SAMPLE_INVITATIONS
    : SAMPLE_INVITATIONS.filter((i) => i.style === activeTab);

  return (
    <section className="py-12 bg-[#FAF7F2] border-y border-[#EBE4D8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A97B3E]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#A97B3E]">
                Save The Date & Web Invites
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#0F4C45] tracking-tight mt-1">
              Digital Wedding Invitations
            </h2>
          </div>

          <Link
            href="/digital-invitations"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F4C45] hover:text-[#A97B3E] transition-colors group"
          >
            <span>Explore All Templates</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Style Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${activeTab === tab ? "bg-[#0F4C45] text-white shadow-sm" : "bg-white text-[#7A776E] border border-[#EBE4D8] hover:border-[#0F4C45]"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Template Artwork Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-3xl overflow-hidden border border-[#EBE4D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Artwork Image Container */}
              <div className="relative h-72 w-full overflow-hidden bg-[#EBE4D8]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#0F4C45] text-[11px] font-bold shadow-sm">
                    {item.style}
                  </span>
                  {item.isAnimated && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96A] text-[#0F4C45] text-[11px] font-bold flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      Animated
                    </span>
                  )}
                </div>

                {/* Hover CTA buttons overlay */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] p-4">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="w-full py-2.5 rounded-full bg-white text-[#0F4C45] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#FAF7F2] transition-colors shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    Quick Preview
                  </button>

                  <Link
                    href={`/digital-invitations?customize=${item.id}`}
                    className="w-full py-2.5 rounded-full bg-[#0F4C45] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#0A3732] transition-colors shadow-md"
                  >
                    <Edit3 className="w-4 h-4" />
                    Customize & Edit
                  </Link>
                </div>
              </div>

              {/* Title & Price Footer */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-[#0F4C45] text-sm line-clamp-1">
                    {item.title}
                  </h3>
                  <span className="text-xs text-[#7A776E]">{item.price}</span>
                </div>

                <Link
                  href={`/digital-invitations?template=${item.id}`}
                  className="p-2 rounded-full bg-[#FAF7F2] text-[#0F4C45] border border-[#EBE4D8] hover:bg-[#0F4C45] hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 font-bold text-lg"
            >
              ✕
            </button>
            <div className="h-80 rounded-2xl overflow-hidden bg-[#EBE4D8]">
              <img src={previewItem.image} alt={previewItem.title} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#0F4C45]">{previewItem.title}</h3>
            <p className="text-xs text-[#7A776E]">Interactive Save-The-Date with RSVP, Google Map location & Music.</p>
            <div className="flex gap-2 pt-2">
              <Link
                href={`/digital-invitations?edit=${previewItem.id}`}
                className="flex-1 py-3 rounded-full bg-[#0F4C45] text-white text-xs font-bold text-center hover:bg-[#0A3732]"
              >
                Customize Template
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

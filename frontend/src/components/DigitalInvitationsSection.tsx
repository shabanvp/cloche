"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Flame } from "lucide-react";

export interface DigitalInviteTemplate {
  id: string;
  name: string;
  category: string;
  image: string;
  badge?: "Free" | "Premium" | "New" | "Trending";
  style: string;
}

export const DIGITAL_INVITE_TEMPLATES: DigitalInviteTemplate[] = [
  {
    id: "tpl-1",
    name: "Sand and Sea",
    category: "Beach & Destination",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    badge: "Free",
    style: "Pastel Teal & Pink Flamingo",
  },
  {
    id: "tpl-2",
    name: "Chirping Birds",
    category: "Botanical & Floral",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80",
    badge: "Trending",
    style: "Heritage Arch & Gold Lattice",
  },
  {
    id: "tpl-3",
    name: "Traditional Ganesha",
    category: "Heritage & Rituals",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=600&q=80",
    badge: "New",
    style: "Temple Gold & Haldi Yellow",
  },
  {
    id: "tpl-4",
    name: "Royal Emerald Mandap",
    category: "Luxury Regal",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    badge: "Premium",
    style: "Deep Emerald & Gold Foil",
  },
  {
    id: "tpl-5",
    name: "Minimalist Botanical Arch",
    category: "Modern Minimal",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
    badge: "Free",
    style: "Sage Green & Eucalyptus",
  },
  {
    id: "tpl-6",
    name: "Monogram Elegance",
    category: "Contemporary",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
    badge: "Trending",
    style: "Gold Crest & Cream Linen",
  },
];

export function DigitalInvitationsSection() {
  return (
    <section className="py-10 sm:py-12 bg-[#FAF7F2] border-y border-gold/15 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold" /> Instant Customization
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-charcoal font-display">
              💌 Digital Wedding Invitations
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 mt-1">
              Create and share beautiful digital wedding invitations with your guests.
            </p>
          </div>

          <Link
            href="/digital-invitations"
            className="hidden sm:flex items-center gap-1.5 text-[#0F4C45] font-bold text-sm hover:underline shrink-0"
          >
            <span>View All Templates</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>

        {/* Templates Grid — 3 visible on mobile side-by-side, 4 on desktop */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {DIGITAL_INVITE_TEMPLATES.slice(0, 4).map((template, idx) => (
            <Link
              key={template.id}
              href={`/digital-invitations#${template.id}`}
              className={`group flex flex-col justify-between ${idx === 3 ? "hidden md:flex" : "flex"}`}
            >
              <div>
                {/* Template Preview Image Container */}
                <div className="relative h-32 sm:h-44 md:h-48 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gold/15 shadow-xs group-hover:shadow-md transition-all">
                  <img
                    src={template.image}
                    alt={template.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {template.badge && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      {template.badge === "Free" && (
                        <span className="bg-emerald-700 text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
                          Free
                        </span>
                      )}
                      {template.badge === "Premium" && (
                        <span className="bg-amber-600 text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm border border-amber-300">
                          Premium
                        </span>
                      )}
                      {template.badge === "New" && (
                        <span className="bg-[#0F4C45] text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
                          New
                        </span>
                      )}
                      {template.badge === "Trending" && (
                        <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> <span className="hidden sm:inline">Trending</span><span className="sm:hidden">Hot</span>
                        </span>
                      )}
                    </div>
                  )}

                  <div className="hidden sm:block absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold text-charcoal shadow-xs border border-gold/10">
                    {template.category}
                  </div>
                </div>

                {/* Card Meta */}
                <div className="mt-2 text-center sm:text-left sm:p-2 sm:mt-0">
                  <h3 className="font-bold text-xs sm:text-base font-display text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                    {template.name}
                  </h3>
                  <p className="hidden sm:block text-xs text-charcoal/60 line-clamp-1 mt-0.5">
                    {template.style}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-5 text-center sm:hidden">
          <Link
            href="/digital-invitations"
            className="w-full inline-flex items-center justify-center gap-2 border border-amber-300/80 bg-white hover:bg-amber-50/50 text-[#0F4C45] text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-all"
          >
            <span>View All Templates</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>

      </div>
    </section>
  );
}

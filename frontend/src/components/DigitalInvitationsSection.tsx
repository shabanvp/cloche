"use client";

import { useState, useEffect, useRef } from "react";
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
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    badge: "Trending",
    style: "Heritage Arch & Gold Lattice",
  },
  {
    id: "tpl-3",
    name: "Traditional Ganesha",
    category: "Heritage & Rituals",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80",
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
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    badge: "Trending",
    style: "Gold Crest & Cream Linen",
  },
];

export function DigitalInvitationsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll carousel loop on mobile screens (< 768px)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      if (window.innerWidth >= 768) return;

      const firstChild = el.firstElementChild as HTMLElement;
      const cardWidth = firstChild ? firstChild.offsetWidth + 16 : 300;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScrollLeft - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-12 bg-[#FAF7F2] border-y border-gold/15 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold" /> Instant Customization
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-display">
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

        {/* Templates Carousel (Mobile) / Grid (Desktop) */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsPaused(false), 3000);
          }}
          className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2"
        >
          {DIGITAL_INVITE_TEMPLATES.slice(0, 4).map((template) => (
            <Link
              key={template.id}
              href={`/digital-invitations#${template.id}`}
              className="flex-shrink-0 w-[85%] sm:w-[300px] md:w-auto snap-center bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Template Preview Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={template.image}
                    alt={template.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  {template.badge && (
                    <div className="absolute top-3 right-3">
                      {template.badge === "Free" && (
                        <span className="bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                          Free
                        </span>
                      )}
                      {template.badge === "Premium" && (
                        <span className="bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-amber-300">
                          Premium
                        </span>
                      )}
                      {template.badge === "New" && (
                        <span className="bg-[#0F4C45] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                          New
                        </span>
                      )}
                      {template.badge === "Trending" && (
                        <span className="bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                          <Flame className="w-3 h-3" /> Trending
                        </span>
                      )}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-charcoal shadow-xs border border-gold/10">
                    {template.category}
                  </div>
                </div>

                {/* Card Meta */}
                <div className="p-4 space-y-1">
                  <h3 className="font-bold text-base font-display text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-charcoal/60 line-clamp-1">
                    {template.style}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/digital-invitations"
            className="w-full inline-flex items-center justify-center gap-2 border border-gold/30 bg-white hover:bg-gold/10 text-[#0F4C45] text-xs font-bold py-3 px-6 rounded-full shadow-xs transition-all"
          >
            <span>View All Templates</span>
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>

      </div>
    </section>
  );
}

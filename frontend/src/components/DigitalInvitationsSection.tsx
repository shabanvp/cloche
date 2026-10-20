"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Flame } from "lucide-react";
import { DIGITAL_INVITE_TEMPLATES } from "@/lib/digitalInvitationsData";
import { InvitationCardPreview } from "@/components/InvitationCardPreview";

export function DigitalInvitationsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll every 4 seconds on mobile (< 768px)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      if (window.innerWidth >= 768) return;

      const firstChild = el.firstElementChild as HTMLElement;
      if (!firstChild) return;

      const cardWidth = firstChild.offsetWidth + 16;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScrollLeft - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Featured 4 templates for desktop layout
  const featuredTemplates = DIGITAL_INVITE_TEMPLATES.slice(0, 4);

  return (
    <section className="pt-3 pb-6 md:pt-4 md:pb-8 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-charcoal font-display">
              Digital Wedding Invitations
            </h2>
          </div>

          <Link
            href="/digital-invitations"
            className="hidden sm:flex items-center gap-1.5 text-[#0F4C45] font-bold text-xs sm:text-sm hover:underline shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
          </Link>
        </div>

        {/* Templates Display — Standardized Padding Grid */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsPaused(false), 3000);
          }}
          className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-3 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible pb-2"
        >
          {featuredTemplates.map((template) => (
            <Link
              key={template.id}
              href={`/digital-invitations/${template.slug}/customize`}
              className="flex-shrink-0 w-[210px] sm:w-[240px] md:w-full snap-center bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between p-2 sm:p-3"
            >
              <div>
                {/* Real Invitation Design Card */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <InvitationCardPreview template={template} compact />

                  {/* Free / Premium / Badge */}
                  {template.badge && (
                    <div className="absolute top-2 right-2 z-20">
                      {template.badge === "Free" && (
                        <span className="bg-emerald-700 text-white text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                          Free
                        </span>
                      )}
                      {template.badge === "Premium" && (
                        <span className="bg-amber-600 text-white text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm border border-amber-300">
                          Premium
                        </span>
                      )}
                      {template.badge === "New" && (
                        <span className="bg-[#0F4C45] text-white text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                          New
                        </span>
                      )}
                      {template.badge === "Trending" && (
                        <span className="bg-rose-600 text-white text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> Trending
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Meta */}
                <div className="p-2 sm:p-2.5 space-y-0.5 text-left">
                  <h3 className="font-bold text-xs sm:text-sm font-display text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                    {template.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-charcoal/60 line-clamp-1">
                    {template.collection} • {template.style}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button (Mobile) */}
        <div className="mt-5 text-center sm:hidden">
          <Link
            href="/digital-invitations"
            className="w-full inline-flex items-center justify-center gap-2 border border-gold/30 bg-white hover:bg-gold/10 text-[#0F4C45] text-xs font-bold py-2.5 px-5 rounded-full shadow-xs transition-all"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </Link>
        </div>

      </div>
    </section>
  );
}

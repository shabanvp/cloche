"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Flame,
  Heart,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import {
  DIGITAL_INVITE_TEMPLATES,
} from "@/lib/digitalInvitationsData";
import { InvitationCardPreview } from "@/components/InvitationCardPreview";

export function DigitalInvitationsClient() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] font-sans flex flex-col justify-between">
      <div>
        {/* Simple Clean Header Bar */}
        <section className="bg-white border-b border-gold/15 py-3.5 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C45] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <h1 className="text-lg sm:text-xl font-bold font-display text-charcoal">
              Digital Wedding Invitations
            </h1>
            <div className="text-xs font-semibold text-[#0F4C45]">
              {DIGITAL_INVITE_TEMPLATES.length} Unique Designs
            </div>
          </div>
        </section>

        {/* Main Content Area — Compact 2-Column Mobile / 4-Column Desktop Cards */}
        <main className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {DIGITAL_INVITE_TEMPLATES.map((template) => {
              const isFav = favorites.has(template.id);
              return (
                <Link
                  key={template.id}
                  href={`/digital-invitations/${template.slug}/customize`}
                  className="bg-white rounded-2xl overflow-hidden border border-gold/15 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between p-1.5 sm:p-2.5 max-w-[240px] w-full mx-auto"
                >
                  <div>
                    {/* Real Invitation Design Render Tile */}
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                      <InvitationCardPreview template={template} compact />

                      {/* Favorite Heart Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, template.id)}
                        className="absolute top-1.5 left-1.5 z-20 bg-white/90 backdrop-blur-xs p-1.5 rounded-full shadow-md text-charcoal/70 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Save to Favorites"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFav ? "text-rose-600 fill-rose-600" : ""
                          }`}
                        />
                      </button>

                      {/* Badge Overlay */}
                      {template.badge && (
                        <div className="absolute top-1.5 right-1.5 z-20">
                          {template.badge === "Free" && (
                            <span className="bg-emerald-700 text-white text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-sm">
                              Free
                            </span>
                          )}
                          {template.badge === "Premium" && (
                            <span className="bg-amber-600 text-white text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-sm border border-amber-300">
                              Premium
                            </span>
                          )}
                          {template.badge === "New" && (
                            <span className="bg-[#0F4C45] text-white text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-sm">
                              New
                            </span>
                          )}
                          {template.badge === "Trending" && (
                            <span className="bg-rose-600 text-white text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                              <Flame className="w-2 h-2" /> Trending
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Info (DESKTOP ONLY — Hidden on Mobile) */}
                    <div className="hidden sm:block p-2 text-left space-y-0.5">
                      <h3 className="font-bold text-xs sm:text-sm font-display text-charcoal group-hover:text-[#0F4C45] transition-colors line-clamp-1">
                        {template.name}
                      </h3>
                      <p className="text-[10px] text-charcoal/60 line-clamp-1">
                        {template.collection} • {template.style}
                      </p>
                    </div>
                  </div>

                  {/* Button (DESKTOP ONLY — Hidden on Mobile) */}
                  <div className="hidden sm:block px-1 pb-1 pt-0.5">
                    <span className="w-full block text-center py-1.5 bg-[#FAF7F2] group-hover:bg-[#0F4C45] text-[#0F4C45] group-hover:text-white font-bold text-[11px] rounded-xl transition-colors">
                      Customize Design →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

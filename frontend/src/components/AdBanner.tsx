"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X, ExternalLink } from "lucide-react";
import { getActiveCampaignsByPlacement, trackAdImpression, trackAdClick, Campaign } from "@/lib/adStore";

type AdBannerProps = {
  placement?: string;
  position?: string;
  category?: string;
  className?: string;
  compact?: boolean;
};

export function AdBanner({ placement, position, category, className = "", compact = false }: AdBannerProps) {
  const activePlacement = placement || position || "Homepage Banner";
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const active = getActiveCampaignsByPlacement(activePlacement, category);
    if (active.length > 0) {
      const selected = active[Math.floor(Math.random() * active.length)];
      setCampaign(selected);
      trackAdImpression(selected.id);
    }
  }, [activePlacement, category]);

  if (!campaign || dismissed) return null;

  const handleClick = (type: "cta" | "whatsapp" | "call" = "cta") => {
    trackAdClick(campaign.id, type);
  };

  // Sticky Mobile Bottom Ad Banner
  if (placement === "Mobile Sticky Banner") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F4C45] text-white p-3 shadow-2xl border-t border-gold/30 flex items-center justify-between sm:hidden animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-gold/30">
            <img src={campaign.mobileBanner || campaign.desktopBanner} alt={campaign.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase font-bold tracking-widest bg-gold/20 text-gold px-1.5 py-0.2 rounded">
                SPONSORED
              </span>
              <span className="text-[10px] text-white/70 truncate">{campaign.vendorName}</span>
            </div>
            <h4 className="text-xs font-semibold truncate leading-snug">{campaign.title}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={campaign.ctaLink || "/"}
            onClick={() => handleClick("cta")}
            className="bg-gold text-charcoal px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm hover:bg-gold/90"
          >
            {campaign.ctaText || "Claim Offer"}
          </Link>
          <button onClick={() => setDismissed(true)} className="text-white/60 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Compact Card Ad
  if (compact) {
    return (
      <div className={`bg-white rounded-2xl border border-gold/20 shadow-sm overflow-hidden relative group p-4 space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest bg-gold/15 text-charcoal px-2 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold" /> Sponsored
          </span>
          <span className="text-xs text-charcoal/50 font-semibold">{campaign.vendorName}</span>
        </div>

        <div className="relative h-40 w-full rounded-xl overflow-hidden">
          <img src={campaign.desktopBanner} alt={campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>

        <div>
          <h4 className="font-display font-semibold text-charcoal text-base">{campaign.title}</h4>
          <p className="text-xs text-charcoal/70 line-clamp-2 mt-1">{campaign.shortDescription}</p>
        </div>

        <Link
          href={campaign.ctaLink || "/"}
          onClick={() => handleClick("cta")}
          className="w-full bg-[#0F4C45] text-white py-2 rounded-xl text-xs font-bold tracking-wider uppercase text-center block shadow-sm hover:bg-[#12584E] transition-colors"
        >
          {campaign.ctaText || "View Details"}
        </Link>
      </div>
    );
  }

  // Full Width Responsive Section Ad
  return (
    <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 my-8 ${className}`}>
      <div className="relative rounded-3xl overflow-hidden bg-charcoal text-white shadow-xl border border-gold/20 group">
        
        {/* Desktop Banner Image */}
        <div className="hidden sm:block absolute inset-0">
          <img src={campaign.desktopBanner} alt={campaign.title} className="w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-transparent" />
        </div>

        {/* Mobile Banner Image */}
        <div className="sm:hidden absolute inset-0">
          <img src={campaign.mobileBanner || campaign.desktopBanner} alt={campaign.title} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/90 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-gold text-charcoal text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> SPONSORED PARTNER
            </span>
            <span className="text-xs text-white/80 font-medium">By {campaign.vendorName}</span>
          </div>

          <h3 className="font-display text-2xl sm:text-4xl font-semibold leading-tight text-ivory">
            {campaign.title}
          </h3>

          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans max-w-xl">
            {campaign.shortDescription}
          </p>

          <div className="pt-2 flex items-center gap-4">
            <Link
              href={campaign.ctaLink || "/"}
              onClick={() => handleClick("cta")}
              className="bg-emerald text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-emerald/90 transition-all flex items-center gap-2"
            >
              {campaign.ctaText || "Book Directly"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Tag, Sparkles, Plus, Calendar, CheckCircle2, Trash2 } from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";

interface OffersSectionProps {
  categoryConfig: VendorCategoryConfig;
}

export function OffersSection({ categoryConfig }: OffersSectionProps) {
  const [offers, setOffers] = useState([
    {
      id: "off-1",
      title: "Early Bird Wedding Discount",
      code: "WED2026",
      discount: "15% OFF",
      validity: "Valid till Sep 30, 2026",
      description: `Get 15% off on full ${categoryConfig.name.toLowerCase()} bookings made 60 days prior to event.`,
      status: "Active",
      usage: "8 redemptions"
    },
    {
      id: "off-2",
      title: "Complimentary Add-On Special",
      code: "FREEADDON",
      discount: "Free Upgrade",
      validity: "Valid till Oct 15, 2026",
      description: "Includes 1 complimentary premium service add-on with any signature package.",
      status: "Active",
      usage: "14 redemptions"
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Promotional Deals
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Offers & Seasonal Coupons</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Manage promotional discounts, promo codes & seasonal deals for couples
          </p>
        </div>

        <button className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer">
          <Plus className="w-4 h-4 text-gold" /> Create New Offer
        </button>
      </div>

      {/* Active Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div 
            key={offer.id}
            className="bg-white rounded-2xl border border-gold/15 p-5 shadow-xs hover:border-gold/30 transition-all space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#C8A96A]/15 text-[#0F4C45] flex items-center justify-center font-bold">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">{offer.title}</h3>
                  <span className="text-[10px] font-mono font-bold text-[#0F4C45] bg-[#0F4C45]/10 px-2 py-0.5 rounded">
                    Code: {offer.code}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {offer.status}
              </span>
            </div>

            <p className="text-xs text-charcoal/70">{offer.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-gold/10 text-xs">
              <span className="text-[#0F4C45] font-bold text-sm">{offer.discount}</span>
              <span className="text-charcoal/50 text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gold" /> {offer.validity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

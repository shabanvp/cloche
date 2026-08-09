"use client";

import { useState } from "react";
import { Tag, Plus, Calendar, Sparkles } from "lucide-react";

export function MehendiOffersSection() {
  const [offers] = useState([
    {
      id: "off-1",
      title: "Early Bird Bridal Discount",
      code: "BRIDE15",
      discount: "15% OFF",
      validity: "Valid till Sep 30, 2026",
      description: "Get 15% off on full length bridal mehendi bookings made 45 days prior to wedding date.",
      status: "Active"
    },
    {
      id: "off-2",
      title: "Complimentary Guest Mehendi Cone Pack",
      code: "FREEORGANIC",
      discount: "Free Gift",
      validity: "Valid till Oct 15, 2026",
      description: "Includes 5 complimentary organic Rajasthani henna cones for family members with any bridal package.",
      status: "Active"
    }
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0d3b30] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Promotions & Coupons
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Offers & Seasonal Discounts</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Create promotional discount codes & festive mehendi packages for brides
          </p>
        </div>

        <button className="bg-[#0d3b30] hover:bg-[#072B27] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer">
          <Plus className="w-4 h-4 text-[#C8A96A]" /> Create Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div 
            key={offer.id}
            className="bg-white rounded-3xl border border-gold/15 p-5 shadow-xs hover:border-gold/30 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#C8A96A]/20 text-[#0d3b30] flex items-center justify-center font-bold">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-charcoal">{offer.title}</h3>
                  <span className="text-[10px] font-mono font-bold text-[#0d3b30] bg-[#0d3b30]/10 px-2 py-0.5 rounded">
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
              <span className="text-[#0d3b30] font-bold text-sm">{offer.discount}</span>
              <span className="text-charcoal/50 text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#C8A96A]" /> {offer.validity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

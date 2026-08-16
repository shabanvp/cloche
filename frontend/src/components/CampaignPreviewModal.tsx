"use client";

import { useState } from "react";
import { X, Monitor, Tablet, Smartphone, Sparkles, ExternalLink, Star } from "lucide-react";
import { Campaign } from "@/lib/adStore";

interface Props {
  campaign: Campaign;
  onClose: () => void;
}

export function CampaignPreviewModal({ campaign, onClose }: Props) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-gold/20 space-y-6 my-8">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-gold/20 text-charcoal px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {campaign.placement}
              </span>
              <span className="text-xs text-charcoal/50">Priority Level {campaign.priority}</span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-charcoal mt-1">{campaign.campaignName}</h3>
          </div>

          {/* Device Toggles */}
          <div className="flex items-center gap-3">
            <div className="bg-[#F8F6F0] p-1 rounded-2xl border border-gold/20 flex items-center gap-1">
              <button
                onClick={() => setDevice("desktop")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  device === "desktop" ? "bg-[#0F4C45] text-white" : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                <Monitor className="w-4 h-4" /> Desktop
              </button>
              <button
                onClick={() => setDevice("tablet")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  device === "tablet" ? "bg-[#0F4C45] text-white" : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                <Tablet className="w-4 h-4" /> Tablet
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  device === "mobile" ? "bg-[#0F4C45] text-white" : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                <Smartphone className="w-4 h-4" /> Mobile
              </button>
            </div>

            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Device Frame Viewport Container */}
        <div className="bg-[#F5F0E8] p-6 rounded-3xl border border-gold/20 flex items-center justify-center min-h-[360px] overflow-hidden">
          <div
            className={`transition-all duration-300 bg-white rounded-2xl overflow-hidden shadow-2xl border border-gold/20 ${
              device === "desktop"
                ? "w-full max-w-3xl"
                : device === "tablet"
                ? "w-[580px]"
                : "w-[340px]"
            }`}
          >
            {/* Mock Device Header Bar */}
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <span>cloche.luxury {device === "mobile" ? "(Mobile View)" : device === "tablet" ? "(Tablet View)" : "(Desktop View)"}</span>
              <span>100%</span>
            </div>

            {/* Banner Rendering */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden shadow-md group">
                <img
                  src={device === "mobile" ? campaign.mobileBanner : campaign.desktopBanner}
                  alt={campaign.title}
                  className="w-full h-56 sm:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent p-5 flex flex-col justify-end text-white">
                  <span className="bg-gold text-charcoal text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full w-fit mb-2 shadow">
                    SPONSORED BY {campaign.vendorName.toUpperCase()}
                  </span>
                  <h4 className="font-display font-semibold text-lg sm:text-2xl leading-tight">{campaign.title}</h4>
                  <p className="text-xs sm:text-sm text-white/90 mt-1 line-clamp-2">{campaign.shortDescription}</p>
                  
                  <div className="mt-3 flex items-center gap-3">
                    <span className="bg-[#0F4C45] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                      {campaign.ctaText} <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] text-white/70">Category: {campaign.vendorCategory}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FBF8F1] p-4 rounded-2xl border border-gold/15 text-xs text-charcoal">
          <div>
            <span className="text-charcoal/50 block text-[10px] uppercase font-bold">Vendor Partner</span>
            <span className="font-bold">{campaign.vendorName}</span>
          </div>
          <div>
            <span className="text-charcoal/50 block text-[10px] uppercase font-bold">Target Location</span>
            <span className="font-semibold">{campaign.targetDistrict || "All Kerala"}</span>
          </div>
          <div>
            <span className="text-charcoal/50 block text-[10px] uppercase font-bold">Campaign Dates</span>
            <span className="font-semibold">{campaign.startDate} to {campaign.endDate}</span>
          </div>
          <div>
            <span className="text-charcoal/50 block text-[10px] uppercase font-bold">Billing Amount</span>
            <span className="font-bold text-emerald">₹{campaign.amount.toLocaleString()} ({campaign.paymentStatus.toUpperCase()})</span>
          </div>
        </div>

      </div>
    </div>
  );
}

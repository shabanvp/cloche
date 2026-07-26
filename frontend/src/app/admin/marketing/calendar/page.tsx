"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredCampaigns, Campaign } from "@/lib/adStore";
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { CampaignPreviewModal } from "@/components/CampaignPreviewModal";

export default function AdminMarketingCalendarPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "timeline">("timeline");
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Campaign Schedule Calendar & Timeline</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Visual calendar of running, upcoming, ending, and draft advertisement campaigns.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="bg-white p-1 rounded-2xl border border-gold/20 flex items-center gap-1">
          {(["timeline", "monthly", "weekly"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                viewMode === mode ? "bg-[#0F4C45] text-white" : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        <Link href="/admin/marketing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview & Campaigns
        </Link>
        <Link href="/admin/marketing/inventory" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Inventory
        </Link>
        <Link href="/admin/marketing/calendar" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Campaign Calendar
        </Link>
        <Link href="/admin/marketing/media" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Media Library
        </Link>
        <Link href="/admin/marketing/contracts" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Contracts & Documents
        </Link>
      </div>

      {/* Color Legend */}
      <div className="bg-white p-4 rounded-2xl border border-gold/15 shadow-sm flex flex-wrap gap-4 text-xs font-semibold text-charcoal">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Active (Green)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Scheduled (Blue)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400"></span> Starting Soon (Yellow)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Ending Soon (Orange)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Expired (Red)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-400"></span> Draft (Gray)</span>
      </div>

      {/* Timeline Grid */}
      <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
        <h3 className="font-display font-semibold text-xl text-charcoal">Active & Scheduled Campaign Schedule</h3>

        <div className="space-y-4">
          {campaigns.map((camp) => {
            const isGreen = camp.status === "active";
            const isGray = camp.status === "draft";
            const isRed = camp.status === "expired";

            return (
              <div
                key={camp.id}
                className="bg-[#FBF8F1] p-4 rounded-2xl border border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                      isGreen ? "bg-emerald-500" : isGray ? "bg-gray-400" : isRed ? "bg-red-500" : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <h4 className="font-display font-semibold text-base text-charcoal">{camp.campaignName}</h4>
                    <p className="text-xs text-charcoal/60">{camp.vendorName} • {camp.placement}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-charcoal/80 font-medium bg-white px-3 py-1.5 rounded-xl border border-gold/15">
                    {camp.startDate} → {camp.endDate}
                  </div>
                  <button
                    onClick={() => setPreviewCampaign(camp)}
                    className="bg-[#0F4C45] text-white p-2 rounded-xl hover:bg-[#12584E] transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {previewCampaign && (
        <CampaignPreviewModal campaign={previewCampaign} onClose={() => setPreviewCampaign(null)} />
      )}

    </div>
  );
}

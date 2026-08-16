"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Phone,
  Calendar,
  Users,
  Building2,
  Sparkles,
  ArrowUpRight,
  MapPin
} from "lucide-react";

export function VenueAnalyticsSection() {
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "1y">("30d");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Venue Performance Analytics</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Analyze couples visiting your venue storefront, visit booking inquiries, and peak wedding season conversions.
          </p>
        </div>

        <div className="bg-[#FAF7F2] p-1 rounded-2xl border border-gold/20 flex text-xs font-bold text-charcoal shrink-0">
          {(["30d", "90d", "1y"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                timeRange === r ? "bg-[#0F4C45] text-white shadow-xs" : "text-charcoal/60 hover:text-charcoal"
              }`}
            >
              {r === "30d" ? "Last 30 Days" : r === "90d" ? "Last Quarter" : "Full Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Storefront Page Views</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +24%
            </span>
          </div>
          <span className="font-serif font-bold text-3xl text-charcoal block">18,420</span>
          <span className="text-[11px] text-charcoal/60">Couples exploring your halls & packages</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Guided Visit Requests</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +18%
            </span>
          </div>
          <span className="font-serif font-bold text-3xl text-[#0F4C45] block">84</span>
          <span className="text-[11px] text-charcoal/60">Prospective wedding families</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Call & WhatsApp Clicks</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +32%
            </span>
          </div>
          <span className="font-serif font-bold text-3xl text-charcoal block">296</span>
          <span className="text-[11px] text-charcoal/60">Direct coordinator connections</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Conversion Rate</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Top Tier
            </span>
          </div>
          <span className="font-serif font-bold text-3xl text-emerald-800 block">4.8%</span>
          <span className="text-[11px] text-charcoal/60">Visit-to-booking confirmation</span>
        </div>
      </div>

      {/* Hall Popularity & Peak Season Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Spaces */}
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-charcoal">Space Popularity Breakdown</h3>
          <div className="space-y-3">
            {[
              { name: "Grand Royal Ballroom", views: "10,240 views", pct: "55%" },
              { name: "Emerald Palm Lawn", views: "5,820 views", pct: "32%" },
              { name: "Sunset Poolside Deck", views: "2,360 views", pct: "13%" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-charcoal">
                  <span>{item.name}</span>
                  <span className="text-[#0F4C45]">{item.views} ({item.pct})</span>
                </div>
                <div className="h-2 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-gold/15">
                  <div
                    className="h-full bg-[#0F4C45] rounded-full transition-all"
                    style={{ width: item.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Demand Wedding Months */}
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-charcoal">Peak Inquired Wedding Seasons</h3>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-[#FAF5EA] p-4 rounded-2xl border border-gold/20 space-y-1">
              <span className="text-[10px] font-bold text-charcoal/50 uppercase block">Oct - Dec</span>
              <span className="font-serif font-bold text-lg text-[#0F4C45]">Peak Season</span>
              <span className="text-[10px] text-emerald-800 font-semibold block">92% Slots Booked</span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 space-y-1">
              <span className="text-[10px] font-bold text-charcoal/50 uppercase block">Jan - Mar</span>
              <span className="font-serif font-bold text-lg text-charcoal">High Demand</span>
              <span className="text-[10px] text-[#0F4C45] font-semibold block">74% Slots Booked</span>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 space-y-1">
              <span className="text-[10px] font-bold text-charcoal/50 uppercase block">Apr - Sep</span>
              <span className="font-serif font-bold text-lg text-charcoal">Moderate</span>
              <span className="text-[10px] text-charcoal/60 font-semibold block">48% Slots Booked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

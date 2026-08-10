"use client";

import { BarChart3, TrendingUp, Eye, Inbox, Star, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";

interface AnalyticsSectionProps {
  categoryConfig: VendorCategoryConfig;
}

export function AnalyticsSection({ categoryConfig }: AnalyticsSectionProps) {
  const performanceData = [
    { label: "Search Impressions", value: "14,250", change: "+18%", positive: true },
    { label: "Profile Page Views", value: "3,480", change: "+24%", positive: true },
    { label: "Enquiries Generated", value: "48", change: "+12%", positive: true },
    { label: "Conversion Rate", value: "14.2%", change: "+2.1%", positive: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Performance Insights
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Analytics & Impressions</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Track storefront engagement, customer reach & lead conversion for your {categoryConfig.name.toLowerCase()} business
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-gold/15 text-xs font-bold text-charcoal">
          <button className="bg-[#0F4C45] text-white px-3 py-1.5 rounded-lg shadow-xs">Last 30 Days</button>
          <button className="text-charcoal/60 hover:text-charcoal px-3 py-1.5">Last 90 Days</button>
        </div>
      </div>

      {/* Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceData.map((item) => (
          <div key={item.label} className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs space-y-2">
            <p className="text-xs text-charcoal/60 font-medium">{item.label}</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-charcoal font-serif">{item.value}</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Chart Placeholder Card */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
          <BarChart3 className="w-4 h-4 text-[#0F4C45]" /> Storefront Engagement & Lead Funnel
        </h3>

        {/* Mock Chart Visual */}
        <div className="h-48 bg-[#FAF7F2] rounded-xl border border-gold/15 p-4 flex items-end justify-between gap-2">
          {[40, 65, 45, 80, 55, 90, 75, 100, 85, 95, 110, 125].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div
                className="w-full bg-[#0F4C45] hover:bg-[#C8A96A] transition-all rounded-t-md"
                style={{ height: `${(height / 125) * 100}%` }}
              />
              <span className="text-[9px] text-charcoal/40 font-mono">W{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

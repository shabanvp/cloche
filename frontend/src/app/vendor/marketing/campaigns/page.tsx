"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredCampaigns, updateCampaignStatus, Campaign } from "@/lib/adStore";
import { Megaphone, Play, Pause, AlertCircle, CheckCircle2, Eye, MousePointerClick, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/Button";

export default function VendorCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
  }, []);

  const handleTogglePause = (id: string, currentStatus: Campaign["status"]) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    updateCampaignStatus(id, nextStatus);
    setCampaigns(getStoredCampaigns());
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">My Ad Campaigns</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Track performance, pause or resume running advertisements, and review campaign approvals.
          </p>
        </div>

        <Link
          href="/vendor/marketing/buy"
          className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Campaign
        </Link>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <Link href="/vendor/marketing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview
        </Link>
        <Link href="/vendor/marketing/buy" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Buy Advertisement
        </Link>
        <Link href="/vendor/marketing/campaigns" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          My Campaigns ({campaigns.length})
        </Link>
        <Link href="/vendor/marketing/analytics" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Analytics
        </Link>
        <Link href="/vendor/marketing/payments" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Payment History
        </Link>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 text-xs uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Campaign & Placement</th>
                <th className="p-4">Package</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Impressions / Clicks</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-xs">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-[#FBF8F1] transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 border border-gold/20">
                        <img src={camp.desktopBanner} alt={camp.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-charcoal text-sm">{camp.title}</div>
                        <div className="text-[11px] text-charcoal/50">{camp.placement} • {camp.targetDistrict || "All Kerala"}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="bg-gold/15 text-charcoal font-semibold px-2.5 py-1 rounded-md">
                      {camp.packageName}
                    </span>
                  </td>

                  <td className="p-4 text-charcoal/80 font-medium">
                    {camp.startDate} to {camp.endDate}
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-charcoal">{camp.impressions.toLocaleString()} views</div>
                    <div className="text-emerald font-semibold">{camp.clicks} clicks ({camp.ctr}% CTR)</div>
                  </td>

                  <td className="p-4">
                    {camp.status === "active" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : camp.status === "pending" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                        <AlertCircle className="w-3 h-3" /> Pending Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                        {camp.status}
                      </span>
                    )}
                  </td>

                  <td className="p-4 pr-6 text-right space-x-2">
                    {camp.status === "active" && (
                      <button
                        onClick={() => handleTogglePause(camp.id, camp.status)}
                        className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <Pause className="w-3.5 h-3.5" /> Pause
                      </button>
                    )}
                    {camp.status === "paused" && (
                      <button
                        onClick={() => handleTogglePause(camp.id, camp.status)}
                        className="bg-emerald/10 text-emerald hover:bg-emerald/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" /> Resume
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

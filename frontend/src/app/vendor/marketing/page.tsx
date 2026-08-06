"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Megaphone, Plus, BarChart3, CreditCard, Sparkles, Eye, MousePointerClick, 
  ArrowRight, Play, Pause, CheckCircle2
} from "lucide-react";
import { getStoredCampaigns, updateCampaignStatus, Campaign } from "@/lib/adStore";

export default function VendorMarketingOverviewPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
  }, []);

  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
  const totalSpent = campaigns.reduce((acc, c) => acc + (c.paymentStatus === "paid" ? c.amount : 0), 0);

  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const pendingCount = campaigns.filter((c) => c.status === "pending").length;

  const handleTogglePause = (id: string, currentStatus: Campaign["status"]) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    updateCampaignStatus(id, nextStatus);
    setCampaigns(getStoredCampaigns());
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/15">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0F4C45]/10 text-[#0F4C45] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> Marketing & Ads Portal
            </span>
          </div>
          <h1 className="text-3xl font-display text-charcoal font-bold mt-2">Vendor Advertising Hub</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Promote your boutique across Cloche homepage, category listings, search results, and mobile banners.
          </p>
        </div>

        <Link
          href="/vendor/marketing/buy"
          className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#135951] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8A96A]" /> Buy Advertisement
        </Link>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <Link href="/vendor/marketing" className="bg-[#0F4C45] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-xs">
          Overview
        </Link>
        <Link href="/vendor/marketing/buy" className="bg-[#FAF7F2] text-charcoal/70 hover:text-[#0F4C45] border border-gold/15 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap">
          Buy Advertisement
        </Link>
        <Link href="/vendor/marketing/campaigns" className="bg-[#FAF7F2] text-charcoal/70 hover:text-[#0F4C45] border border-gold/15 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap">
          My Campaigns ({campaigns.length})
        </Link>
        <Link href="/vendor/marketing/analytics" className="bg-[#FAF7F2] text-charcoal/70 hover:text-[#0F4C45] border border-gold/15 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap">
          Analytics
        </Link>
        <Link href="/vendor/marketing/payments" className="bg-[#FAF7F2] text-charcoal/70 hover:text-[#0F4C45] border border-gold/15 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap">
          Payment History
        </Link>
      </div>

      {/* Analytics KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Active Campaigns</span>
            <Megaphone className="w-5 h-5 text-[#0F4C45]" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">{activeCount}</p>
          <p className="text-xs text-charcoal/60">{pendingCount} pending review</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
            <Eye className="w-5 h-5 text-gold" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">{totalImpressions.toLocaleString()}</p>
          <p className="text-xs text-[#0F4C45] font-semibold">Live Ad Impressions</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Total Clicks</span>
            <MousePointerClick className="w-5 h-5 text-[#0F4C45]" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">{totalClicks.toLocaleString()}</p>
          <p className="text-xs text-[#0F4C45] font-semibold">{avgCtr}% Avg. CTR</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Total Ad Spent</span>
            <CreditCard className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">₹{totalSpent.toLocaleString()}</p>
          <p className="text-xs text-charcoal/60">Across {campaigns.length} campaigns</p>
        </div>
      </div>

      {/* Active Campaigns List or Professional Empty State */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-charcoal">Your Active Advertisements</h3>
          <Link href="/vendor/marketing/campaigns" className="text-xs font-bold uppercase text-[#0F4C45] hover:underline flex items-center gap-1">
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {campaigns.length > 0 ? (
          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div key={camp.id} className="p-4 rounded-xl border border-gold/10 bg-[#FAF7F2] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-gold/20 bg-gray-100">
                    <img src={camp.desktopBanner} alt={camp.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0F4C45]/10 text-[#0F4C45] px-2 py-0.5 rounded">
                        {camp.packageName}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {camp.status}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-charcoal text-base mt-1">{camp.title}</h4>
                    <p className="text-xs text-charcoal/60">Placement: {camp.placement} • Target: {camp.targetDistrict || "All Kerala"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-gold/10 pt-3 md:pt-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-charcoal">{camp.impressions.toLocaleString()} Views</div>
                    <div className="text-[11px] text-[#0F4C45] font-semibold">{camp.clicks} Clicks ({camp.ctr}% CTR)</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {camp.status === "active" && (
                      <button
                        onClick={() => handleTogglePause(camp.id, camp.status)}
                        className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Pause Campaign"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    {camp.status === "paused" && (
                      <button
                        onClick={() => handleTogglePause(camp.id, camp.status)}
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Resume Campaign"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#FAF7F2]/60 rounded-2xl border border-dashed border-gold/20 p-8 space-y-3">
            <Megaphone className="w-10 h-10 text-[#C8A96A] mx-auto opacity-60" />
            <h4 className="text-lg font-display font-bold text-charcoal">No Active Ad Campaigns</h4>
            <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
              Promote your boutique across Cloche homepage hero banners, category listings, and search results to boost customer leads.
            </p>
            <Link
              href="/vendor/marketing/buy"
              className="inline-block mt-3 bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#135951]"
            >
              + Buy Advertisement
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}

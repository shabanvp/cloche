"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Megaphone, Plus, BarChart3, CreditCard, Sparkles, Eye, MousePointerClick, 
  TrendingUp, Calendar, ArrowRight, Play, Pause, AlertCircle, CheckCircle2, Shield
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
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gold/20 text-charcoal px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> Marketing & Ads Portal
            </span>
          </div>
          <h1 className="text-3xl font-display text-charcoal font-semibold mt-2">Vendor Advertising Hub</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Promote your boutique across Cloche homepage, category listings, search results, and mobile banners.
          </p>
        </div>

        <Link
          href="/vendor/marketing/buy"
          className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Buy Advertisement
        </Link>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <Link href="/vendor/marketing" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview
        </Link>
        <Link href="/vendor/marketing/buy" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Buy Advertisement
        </Link>
        <Link href="/vendor/marketing/campaigns" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          My Campaigns ({campaigns.length})
        </Link>
        <Link href="/vendor/marketing/analytics" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Analytics
        </Link>
        <Link href="/vendor/marketing/payments" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Payment History
        </Link>
      </div>

      {/* Analytics KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Active Campaigns</span>
            <Megaphone className="w-5 h-5 text-emerald" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">{activeCount}</p>
          <p className="text-xs text-charcoal/60">{pendingCount} pending admin review</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
            <Eye className="w-5 h-5 text-gold" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">{totalImpressions.toLocaleString()}</p>
          <p className="text-xs text-emerald font-semibold">+18.4% reach boost</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Total Clicks</span>
            <MousePointerClick className="w-5 h-5 text-[#0F4C45]" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">{totalClicks.toLocaleString()}</p>
          <p className="text-xs text-emerald font-semibold">{avgCtr}% Avg. CTR</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Total Ad Spent</span>
            <CreditCard className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">₹{totalSpent.toLocaleString()}</p>
          <p className="text-xs text-charcoal/60">Across {campaigns.length} campaigns</p>
        </div>
      </div>

      {/* Active Campaigns List */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-charcoal">Your Active Advertisements</h3>
          <Link href="/vendor/marketing/campaigns" className="text-xs font-bold uppercase text-[#0F4C45] hover:underline flex items-center gap-1">
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {campaigns.map((camp) => (
            <div key={camp.id} className="p-4 rounded-xl border border-gold/10 bg-[#FBF8F1] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-gold/20 bg-gray-100">
                  <img src={camp.desktopBanner} alt={camp.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gold/20 text-charcoal px-2 py-0.5 rounded">
                      {camp.packageName}
                    </span>
                    {camp.status === "active" ? (
                      <span className="text-[10px] font-bold uppercase text-emerald flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    ) : camp.status === "pending" ? (
                      <span className="text-[10px] font-bold uppercase text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Pending Review
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-gray-500">
                        {camp.status}
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-semibold text-charcoal text-base mt-1">{camp.title}</h4>
                  <p className="text-xs text-charcoal/60">Placement: {camp.placement} • Target: {camp.targetDistrict || "All Kerala"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-gold/10 pt-3 md:pt-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-charcoal">{camp.impressions.toLocaleString()} Views</div>
                  <div className="text-[11px] text-emerald font-semibold">{camp.clicks} Clicks ({camp.ctr}% CTR)</div>
                </div>

                <div className="flex items-center gap-2">
                  {camp.status === "active" && (
                    <button
                      onClick={() => handleTogglePause(camp.id, camp.status)}
                      className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1"
                      title="Pause Campaign"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  )}
                  {camp.status === "paused" && (
                    <button
                      onClick={() => handleTogglePause(camp.id, camp.status)}
                      className="p-2 rounded-lg bg-emerald/10 text-emerald hover:bg-emerald/20 text-xs font-semibold flex items-center gap-1"
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
      </div>

    </div>
  );
}

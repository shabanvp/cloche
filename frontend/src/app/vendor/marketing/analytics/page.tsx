"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredCampaigns, Campaign } from "@/lib/adStore";
import { BarChart3, Eye, MousePointerClick, TrendingUp, Phone, MessageSquare, ExternalLink, ArrowRight } from "lucide-react";

export default function VendorMarketingAnalyticsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
  }, []);

  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalWhatsapp = campaigns.reduce((acc, c) => acc + c.whatsappClicks, 0);
  const totalCalls = campaigns.reduce((acc, c) => acc + c.callClicks, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leadRequests, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Advertisement Analytics & Lead Reports</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Real-time tracking of ad views, website clicks, WhatsApp enquiries, and direct phone calls.
          </p>
        </div>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        <Link href="/vendor/marketing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview
        </Link>
        <Link href="/vendor/marketing/buy" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Buy Advertisement
        </Link>
        <Link href="/vendor/marketing/campaigns" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          My Campaigns
        </Link>
        <Link href="/vendor/marketing/analytics" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Analytics
        </Link>
        <Link href="/vendor/marketing/payments" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Payment History
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Ad Impressions</span>
            <Eye className="w-5 h-5 text-gold" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">{totalImpressions.toLocaleString()}</p>
          <p className="text-xs text-emerald font-semibold">Total banner views</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Ad Clicks</span>
            <MousePointerClick className="w-5 h-5 text-[#0F4C45]" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">{totalClicks.toLocaleString()}</p>
          <p className="text-xs text-emerald font-semibold">Direct user engagement</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Enquiries</span>
            <MessageSquare className="w-5 h-5 text-emerald" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">{totalWhatsapp}</p>
          <p className="text-xs text-emerald font-semibold">Instant chats triggered</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-charcoal/60">
            <span className="text-xs font-bold uppercase tracking-wider">Phone Call Clicks</span>
            <Phone className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">{totalCalls}</p>
          <p className="text-xs text-emerald font-semibold">Direct customer calls</p>
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
        <h3 className="font-display text-xl font-semibold text-charcoal">Campaign Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-3.5 pl-4">Campaign Title</th>
                <th className="p-3.5">Placement</th>
                <th className="p-3.5">Impressions</th>
                <th className="p-3.5">Clicks</th>
                <th className="p-3.5">CTR</th>
                <th className="p-3.5">WhatsApp Leads</th>
                <th className="p-3.5 text-right pr-4">Phone Calls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-[#FBF8F1]">
                  <td className="p-3.5 pl-4 font-bold text-charcoal">{c.title}</td>
                  <td className="p-3.5 text-charcoal/70">{c.placement}</td>
                  <td className="p-3.5 text-charcoal font-medium">{c.impressions.toLocaleString()}</td>
                  <td className="p-3.5 font-bold text-emerald">{c.clicks}</td>
                  <td className="p-3.5 font-bold text-charcoal">{c.ctr}%</td>
                  <td className="p-3.5 text-emerald font-semibold">{c.whatsappClicks} chats</td>
                  <td className="p-3.5 pr-4 text-right font-semibold text-charcoal">{c.callClicks} calls</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

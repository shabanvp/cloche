"use client";

import { useState, useEffect } from "react";
import { 
  Megaphone, Check, X, Pause, Play, Trash2, Eye, ShieldCheck, DollarSign, 
  TrendingUp, Download, Sparkles, Filter, Search, Award, Star, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/Button";
import { getStoredCampaigns, updateCampaignStatus, Campaign, AD_PACKAGES } from "@/lib/adStore";

export default function AdminMarketingPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "sponsored" | "revenue" | "analytics">("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    setCampaigns(getStoredCampaigns());
  }, []);

  const refreshData = () => {
    setCampaigns(getStoredCampaigns());
  };

  const handleApprove = (id: string) => {
    updateCampaignStatus(id, "active");
    refreshData();
    alert("Campaign approved and published live across website!");
  };

  const handleReject = (id: string) => {
    updateCampaignStatus(id, "rejected");
    refreshData();
    alert("Campaign rejected.");
  };

  const handleTogglePause = (id: string, currentStatus: Campaign["status"]) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    updateCampaignStatus(id, nextStatus);
    refreshData();
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && c.status === "active") ||
      (statusFilter === "Pending Approval" && c.status === "pending") ||
      (statusFilter === "Paused" && c.status === "paused") ||
      (statusFilter === "Rejected" && c.status === "rejected");
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.campaignName.toLowerCase().includes(q) ||
      c.vendorName.toLowerCase().includes(q) ||
      c.placement.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = campaigns.reduce((acc, c) => acc + (c.paymentStatus === "paid" ? c.amount : 0), 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Advertisement & Sponsored Listings Management</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Approve vendor campaigns, manage sponsored placements, track ad revenue, and monitor platform performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald/10 text-emerald px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Marketing Control Center
          </span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "campaigns" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          Campaigns & Approvals ({campaigns.filter((c) => c.status === "pending").length} Pending)
        </button>
        <button
          onClick={() => setActiveTab("sponsored")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "sponsored" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          Sponsored Vendors & Placements
        </button>
        <button
          onClick={() => setActiveTab("revenue")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "revenue" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          Revenue & Packages (₹{totalRevenue.toLocaleString()})
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "analytics" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          Analytics & CTR Reports
        </button>
      </div>

      {/* Tab 1: Campaigns & Approvals */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gold/15 shadow-sm">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {["All", "Pending Approval", "Active", "Paused", "Rejected"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    statusFilter === tab ? "bg-charcoal text-white" : "bg-gray-100 text-charcoal/70 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <input
                type="text"
                placeholder="Search vendor or campaign..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FBF8F1] border border-gold/20 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald text-charcoal"
              />
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                    <th className="p-4 pl-6">Campaign & Vendor</th>
                    <th className="p-4">Placement</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Impressions / Clicks</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {filteredCampaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-[#FBF8F1] transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 border border-gold/20">
                            <img src={camp.desktopBanner} alt={camp.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-charcoal text-sm">{camp.campaignName}</div>
                            <div className="text-charcoal/60 text-[11px]">{camp.vendorName} ({camp.vendorCategory})</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="bg-gold/15 text-charcoal font-semibold px-2.5 py-1 rounded-md">
                          {camp.placement}
                        </span>
                      </td>

                      <td className="p-4 text-charcoal/80 font-medium">
                        {camp.startDate} to {camp.endDate}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-emerald">₹{camp.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-emerald uppercase font-bold">{camp.paymentStatus}</div>
                      </td>

                      <td className="p-4">
                        <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          Level {camp.priority}
                        </span>
                      </td>

                      <td className="p-4">
                        {camp.status === "active" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald">
                            <CheckCircle2 className="w-3 h-3" /> Live
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

                      <td className="p-4">
                        <div className="font-bold text-charcoal">{camp.impressions.toLocaleString()} views</div>
                        <div className="text-emerald font-semibold">{camp.clicks} clicks ({camp.ctr}% CTR)</div>
                      </td>

                      <td className="p-4 pr-6 text-right space-x-2">
                        <button
                          onClick={() => setPreviewCampaign(camp)}
                          className="bg-gray-100 text-charcoal hover:bg-gray-200 px-2.5 py-1.5 rounded-lg font-semibold transition-colors"
                          title="Preview Creative"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {camp.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(camp.id)}
                              className="bg-emerald text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald/90 transition-colors inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(camp.id)}
                              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold transition-colors inline-flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}

                        {camp.status === "active" && (
                          <button
                            onClick={() => handleTogglePause(camp.id, camp.status)}
                            className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <Pause className="w-3.5 h-3.5" /> Pause
                          </button>
                        )}

                        {camp.status === "paused" && (
                          <button
                            onClick={() => handleTogglePause(camp.id, camp.status)}
                            className="bg-emerald/10 text-emerald hover:bg-emerald/20 px-3 py-1.5 rounded-lg font-semibold transition-colors inline-flex items-center gap-1"
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
      )}

      {/* Tab 2: Sponsored Vendors */}
      {activeTab === "sponsored" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-4">
            <h3 className="text-xl font-display font-semibold text-charcoal">Sponsored Listing Slots Across Pages</h3>
            <p className="text-xs text-charcoal/70">Manage high-priority sponsored badges displayed on search results and category listing headers.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {["Homepage Hero Banner", "Category Page Top", "Search Results"].map((slot) => {
                const count = campaigns.filter((c) => c.placement === slot && c.status === "active").length;
                return (
                  <div key={slot} className="bg-[#FBF8F1] p-5 rounded-2xl border border-gold/15 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded">
                      Placement Slot
                    </span>
                    <h4 className="font-display font-semibold text-lg text-charcoal">{slot}</h4>
                    <p className="text-xs text-emerald font-bold">{count} Active Sponsored Banners</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Revenue & Packages */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase text-charcoal/60">Total Ad Revenue</span>
              <p className="text-3xl font-display font-bold text-emerald">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase text-charcoal/60">Active Subscriptions</span>
              <p className="text-3xl font-display font-bold text-charcoal">{campaigns.filter((c) => c.status === "active").length} Campaigns</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase text-charcoal/60">Packages Offered</span>
              <p className="text-3xl font-display font-bold text-gold">{AD_PACKAGES.length} Packages</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-4">
            <h3 className="text-xl font-display font-semibold text-charcoal">Overall Ad Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#FBF8F1] p-4 rounded-xl border border-gold/10">
                <div className="text-xs text-charcoal/60">Total Platform Impressions</div>
                <div className="text-2xl font-bold text-charcoal mt-1">{totalImpressions.toLocaleString()}</div>
              </div>
              <div className="bg-[#FBF8F1] p-4 rounded-xl border border-gold/10">
                <div className="text-xs text-charcoal/60">Total Platform Clicks</div>
                <div className="text-2xl font-bold text-emerald mt-1">{totalClicks.toLocaleString()}</div>
              </div>
              <div className="bg-[#FBF8F1] p-4 rounded-xl border border-gold/10">
                <div className="text-xs text-charcoal/60">Average CTR</div>
                <div className="text-2xl font-bold text-gold mt-1">
                  {totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewCampaign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gold/20 space-y-4">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h3 className="font-display text-xl text-charcoal font-semibold">Preview Creative: {previewCampaign.campaignName}</h3>
              <button onClick={() => setPreviewCampaign(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            
            <div className="space-y-3">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-gold/20">
                <img src={previewCampaign.desktopBanner} alt={previewCampaign.title} className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#FBF8F1] p-4 rounded-2xl border border-gold/10 text-xs space-y-1.5">
                <div><strong>Vendor:</strong> {previewCampaign.vendorName} ({previewCampaign.vendorEmail})</div>
                <div><strong>Title:</strong> {previewCampaign.title}</div>
                <div><strong>Description:</strong> {previewCampaign.shortDescription}</div>
                <div><strong>CTA Link:</strong> {previewCampaign.ctaLink}</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setPreviewCampaign(null)} className="bg-charcoal text-white rounded-xl">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

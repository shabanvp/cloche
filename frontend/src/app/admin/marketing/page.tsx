"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Megaphone, Check, X, Pause, Play, Trash2, Eye, ShieldCheck, DollarSign, 
  TrendingUp, Download, Sparkles, Filter, Search, Award, Star, CheckCircle2, AlertCircle, Plus, PhoneCall,
  RefreshCw, MessageSquare, Calendar, Users, FileText, Layers, Clock, Tag, Crown
} from "lucide-react";
import { Button } from "@/components/Button";
import { 
  getStoredCampaigns, updateCampaignStatus, Campaign, AD_PACKAGES, 
  getCampaignRequests, updateCampaignRequestStatus, CampaignRequest,
  renewCampaign, addInternalNoteToCampaign, getCRMLeads, getFollowUps 
} from "@/lib/adStore";
import { getVendorOffers, VendorOffer } from "@/lib/vendorOffersStore";
import { CampaignPreviewModal } from "@/components/CampaignPreviewModal";

function AdminMarketingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as "dashboard" | "campaigns" | "drafts" | "requests" | "revenue" | "analytics" | "offers") || "dashboard";
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);
  const [noteCampaign, setNoteCampaign] = useState<Campaign | null>(null);
  const [newNoteText, setNewNoteText] = useState("");

  const [leadsCount, setLeadsCount] = useState(0);
  const [followUpsCount, setFollowUpsCount] = useState(0);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setCampaigns(getStoredCampaigns());
    setRequests(getCampaignRequests());
    setLeadsCount(getCRMLeads().length);
    setFollowUpsCount(getFollowUps().filter((f) => f.status === "Pending").length);
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

  const handleRenew = (id: string) => {
    const renewed = renewCampaign(id);
    if (renewed) {
      refreshData();
      alert(`Campaign renewed successfully as draft "${renewed.campaignName}"!`);
      router.push("/admin/marketing?tab=drafts");
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteCampaign || !newNoteText.trim()) return;

    addInternalNoteToCampaign(noteCampaign.id, newNoteText, "Marketing Superadmin");
    setNewNoteText("");
    setNoteCampaign(null);
    refreshData();
    alert("Internal admin note saved.");
  };

  const handleExportCSV = () => {
    const headers = "Campaign,Vendor,Placement,Status,Amount,Impressions,Clicks,CTR%\n";
    const rows = campaigns
      .map((c) => `"${c.campaignName}","${c.vendorName}","${c.placement}","${c.status}",${c.amount},${c.impressions},${c.clicks},${c.ctr}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cloche_marketing_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredCampaigns = campaigns.filter((c) => {
    if (activeTab === "drafts") {
      if (c.status !== "draft") return false;
    }
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && c.status === "active") ||
      (statusFilter === "Pending Approval" && c.status === "pending") ||
      (statusFilter === "Draft" && c.status === "draft") ||
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
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Marketing CRM & Advertisement Platform</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Manage vendor ad campaigns, sales leads, follow-ups, revenue reports, and advertisement placements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-white text-charcoal hover:bg-gold/10 border border-gold/20 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Report (CSV)
          </button>
          <Link
            href="/admin/marketing/create"
            className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Advertisement
          </Link>
        </div>
      </div>

      {/* Admin Submenu Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        <Link
          href="/admin/marketing?tab=dashboard"
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "dashboard" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          Dashboard & Widgets
        </Link>
        <Link
          href="/admin/marketing?tab=campaigns"
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "campaigns" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          All Campaigns ({campaigns.filter((c) => c.status === "pending").length} Pending)
        </Link>
        <Link
          href="/admin/marketing?tab=drafts"
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "drafts" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          Draft Campaigns ({campaigns.filter((c) => c.status === "draft").length})
        </Link>
        <Link
          href="/admin/marketing?tab=requests"
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "requests" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          Campaign Requests ({requests.length})
        </Link>
        <Link
          href="/admin/marketing?tab=offers"
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            activeTab === "offers" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          <Tag className="w-4 h-4 text-gold" /> Vendor Offers & Promotions
        </Link>
        <Link
          href="/admin/marketing/leads"
          className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
        >
          <Users className="w-3.5 h-3.5 text-gold" /> Sales Leads ({leadsCount})
        </Link>
        <Link
          href="/admin/marketing/followups"
          className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-emerald" /> Follow-Ups ({followUpsCount})
        </Link>
        <Link
          href="/admin/marketing/inventory"
          className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-gold" /> Inventory
        </Link>
        <Link
          href="/admin/marketing/calendar"
          className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
        >
          <Calendar className="w-3.5 h-3.5 text-blue-600" /> Calendar
        </Link>
        <Link
          href="/admin/marketing/media"
          className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Media Library
        </Link>
        <Link
          href="/admin/marketing/contracts"
          className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-emerald" /> Contracts
        </Link>
        <Link
          href="/admin/marketing?tab=revenue"
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "revenue" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          Revenue (₹{totalRevenue.toLocaleString()})
        </Link>
        <Link
          href="/admin/marketing?tab=analytics"
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === "analytics" ? "bg-[#0F4C45] text-white shadow-md" : "bg-white text-charcoal/70 hover:bg-gold/10"
          }`}
        >
          Analytics & CTR
        </Link>
      </div>

      {/* Tab 1: Dashboard Widgets */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-charcoal/60">
                <span className="text-xs font-bold uppercase">Total Ad Revenue</span>
                <DollarSign className="w-5 h-5 text-emerald" />
              </div>
              <p className="text-3xl font-display font-bold text-emerald">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-charcoal/60">Across all active campaigns</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-charcoal/60">
                <span className="text-xs font-bold uppercase">Sales Leads</span>
                <Users className="w-5 h-5 text-gold" />
              </div>
              <p className="text-3xl font-display font-bold text-charcoal">{leadsCount} Leads</p>
              <Link href="/admin/marketing/leads" className="text-xs text-emerald font-semibold hover:underline block">
                Manage CRM pipeline →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-charcoal/60">
                <span className="text-xs font-bold uppercase">Pending Follow-ups</span>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-3xl font-display font-bold text-charcoal">{followUpsCount} Reminders</p>
              <Link href="/admin/marketing/followups" className="text-xs text-emerald font-semibold hover:underline block">
                View call schedule →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-charcoal/60">
                <span className="text-xs font-bold uppercase">Draft Campaigns</span>
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-display font-bold text-charcoal">
                {campaigns.filter((c) => c.status === "draft").length} Drafts
              </p>
              <Link href="/admin/marketing?tab=drafts" className="text-xs text-emerald font-semibold hover:underline">
                View draft queue →
              </Link>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-3">
              <h3 className="font-display font-semibold text-lg text-charcoal">Direct Admin Creation</h3>
              <p className="text-xs text-charcoal/70">Create ad campaigns for vendors who contacted Cloche directly via phone or WhatsApp.</p>
              <Link href="/admin/marketing/create" className="inline-block bg-[#0F4C45] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">
                Launch Form →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-3">
              <h3 className="font-display font-semibold text-lg text-charcoal">Sales Leads CRM</h3>
              <p className="text-xs text-charcoal/70">Track vendor sales deals from initial contact to negotiation and won deals.</p>
              <Link href="/admin/marketing/leads" className="inline-block bg-[#0F4C45] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">
                Open CRM →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-3">
              <h3 className="font-display font-semibold text-lg text-charcoal">Dynamic Packages</h3>
              <p className="text-xs text-charcoal/70">Manage ad placement pricing, reach estimates, and priority caps.</p>
              <Link href="/admin/marketing/packages" className="inline-block bg-[#0F4C45] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase">
                Manage Packages →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 & 3: Campaigns / Drafts Table */}
      {(activeTab === "campaigns" || activeTab === "drafts") && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gold/15 shadow-sm">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {["All", "Pending Approval", "Active", "Draft", "Paused", "Rejected"].map((tab) => (
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

          <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                    <th className="p-4 pl-6">Campaign & Vendor</th>
                    <th className="p-4">Source</th>
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
                        {camp.createdSource === "admin_created" ? (
                          <span className="bg-emerald/10 text-emerald font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                            Admin Created
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                            Self Service
                          </span>
                        )}
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
                        <div className="text-[10px] text-charcoal/60 font-semibold">{camp.paymentSource || "Paid Online"}</div>
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
                        ) : camp.status === "draft" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                            <FileText className="w-3 h-3" /> Draft
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

                      <td className="p-4 pr-6 text-right space-x-1.5">
                        <button
                          onClick={() => setPreviewCampaign(camp)}
                          className="bg-gray-100 text-charcoal hover:bg-gray-200 p-2 rounded-lg font-semibold transition-colors"
                          title="Interactive Multi-Device Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setNoteCampaign(camp)}
                          className="bg-gold/15 text-charcoal hover:bg-gold/25 p-2 rounded-lg font-semibold transition-colors"
                          title="Internal Admin Notes"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        {camp.status === "pending" || camp.status === "draft" ? (
                          <button
                            onClick={() => handleApprove(camp.id)}
                            className="bg-emerald text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald/90 transition-colors inline-flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Live
                          </button>
                        ) : null}

                        {camp.status === "active" && (
                          <button
                            onClick={() => handleTogglePause(camp.id, camp.status)}
                            className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <Pause className="w-3.5 h-3.5" /> Pause
                          </button>
                        )}

                        <button
                          onClick={() => handleRenew(camp.id)}
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 p-2 rounded-lg font-semibold transition-colors"
                          title="Renew Campaign"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Campaign Requests */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-4">
            <h3 className="text-xl font-display font-semibold text-charcoal">Offline Vendor Assistance Leads</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                    <th className="p-3.5 pl-4">Vendor</th>
                    <th className="p-3.5">Requested Placement</th>
                    <th className="p-3.5">Budget</th>
                    <th className="p-3.5">Notes</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right pr-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FBF8F1]">
                      <td className="p-3.5 pl-4 font-bold text-charcoal">{r.vendorName} ({r.phone})</td>
                      <td className="p-3.5 text-charcoal font-semibold">{r.requestedPlacement}</td>
                      <td className="p-3.5 text-emerald font-bold">{r.budget}</td>
                      <td className="p-3.5 text-charcoal/80 max-w-xs">{r.notes}</td>
                      <td className="p-3.5"><span className="bg-gold/15 text-charcoal font-bold px-2 py-0.5 rounded">{r.status}</span></td>
                      <td className="p-3.5 pr-4 text-right">
                        <Link href={`/admin/marketing/create?vendor=${encodeURIComponent(r.vendorName)}&placement=${encodeURIComponent(r.requestedPlacement)}`}>
                          <Button className="bg-[#0F4C45] text-white rounded-lg text-xs font-bold uppercase">
                            Convert to Campaign
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Revenue & Reports */}
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

          <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-3">
            <h3 className="font-display font-semibold text-lg text-charcoal">Financial & Ad Performance Export</h3>
            <p className="text-xs text-charcoal/70">Export full campaign performance reports including impressions, clicks, CTR, and payments.</p>
            <Button onClick={handleExportCSV} className="bg-[#0F4C45] text-white rounded-xl text-xs font-bold uppercase tracking-wider">
              Download CSV Report
            </Button>
          </div>
        </div>
      )}

      {/* Tab 6: Analytics */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-4">
            <h3 className="text-xl font-display font-semibold text-charcoal">Overall Platform Ad Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Tab 7: Vendor Offers */}
      {activeTab === "offers" && (
        <div className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gold/10 pb-3">
            <div>
              <h3 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
                <Tag className="w-5 h-5 text-gold" /> Vendor Promotional Offers & Coupon Engine
              </h3>
              <p className="text-xs text-charcoal/60 mt-1">
                Monitor live promotional offers created by vendors across the platform. Feature top deals or disable invalid promotions.
              </p>
            </div>
            <Link
              href="/vendor/offers"
              target="_blank"
              className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <span>Manage Vendor Offers</span>
              <Eye className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gold/15 bg-white">
            <table className="w-full text-left text-xs text-charcoal">
              <thead className="bg-[#FBF8F1] font-bold text-[10px] text-charcoal/70 uppercase border-b border-gold/15">
                <tr>
                  <th className="p-3.5">Vendor / Venue</th>
                  <th className="p-3.5">Offer Title</th>
                  <th className="p-3.5">Discount Value</th>
                  <th className="p-3.5">Coupon Code</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Redemptions</th>
                  <th className="p-3.5 text-right">Storefront Ribbon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {getVendorOffers("v-solitaire").map((off) => (
                  <tr key={off.id}>
                    <td className="p-3.5 font-bold">Solitaire Wedding Venue</td>
                    <td className="p-3.5 font-bold text-[#0F4C45]">{off.name}</td>
                    <td className="p-3.5 font-semibold text-emerald-800">
                      {off.discountType === "percentage" ? `${off.discountValue}% OFF` : off.discountValue}
                    </td>
                    <td className="p-3.5 font-mono text-xs">{off.couponCode || "—"}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                        {off.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold">{off.currentRedemptions} / {off.maxRedemptions || "∞"}</td>
                    <td className="p-3.5 text-right">
                      {off.isFeatured ? (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 inline-flex">
                          <Crown className="w-3 h-3 fill-current text-amber-500" /> Featured Ribbon
                        </span>
                      ) : (
                        <span className="text-[10px] text-charcoal/40">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Device Preview Modal */}
      {previewCampaign && (
        <CampaignPreviewModal campaign={previewCampaign} onClose={() => setPreviewCampaign(null)} />
      )}

      {/* Internal Notes Modal */}
      {noteCampaign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddNote} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gold/20 space-y-4">
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h3 className="font-display text-xl text-charcoal font-semibold">Admin Notes: {noteCampaign.campaignName}</h3>
              <button type="button" onClick={() => setNoteCampaign(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3">
              <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-[#FBF8F1] rounded-2xl border border-gold/10 text-xs">
                {noteCampaign.internalNotesList?.length ? (
                  noteCampaign.internalNotesList.map((n) => (
                    <div key={n.id} className="bg-white p-2.5 rounded-xl border border-gold/15 shadow-sm space-y-1">
                      <div className="flex justify-between text-[10px] text-charcoal/50">
                        <span className="font-bold text-charcoal">{n.author}</span>
                        <span>{n.createdAt}</span>
                      </div>
                      <p className="text-charcoal">{n.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-charcoal/50 italic text-center py-3">No internal admin notes yet.</p>
                )}
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 text-xs mb-1">Add New Internal Note</label>
                <textarea
                  required
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="e.g. Vendor requested HD banner update next week..."
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-xs text-charcoal outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-gold/10">
              <Button type="button" variant="ghost" onClick={() => setNoteCampaign(null)}>Cancel</Button>
              <Button type="submit" className="bg-[#0F4C45] text-white rounded-xl text-xs font-bold uppercase">Save Note</Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default function AdminMarketingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-charcoal/60">Loading Marketing Portal...</div>}>
      <AdminMarketingContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Users, Store, Download, DollarSign, ArrowUpRight, Calendar, Layers } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  const monthlyRevenue = [
    { month: "Nov 2025", revenue: "₹1,40,000", vendors: 8, leads: 120 },
    { month: "Dec 2025", revenue: "₹2,10,000", vendors: 14, leads: 185 },
    { month: "Jan 2026", revenue: "₹3,45,000", vendors: 22, leads: 290 },
    { month: "Feb 2026", revenue: "₹4,80,000", vendors: 31, leads: 410 },
    { month: "Mar 2026", revenue: "₹6,20,000", vendors: 42, leads: 580 },
    { month: "Apr 2026", revenue: "₹7,95,000", vendors: 56, leads: 740 },
  ];

  const categoryPerformance = [
    { category: "Bridal Wear", activeVendors: 24, leadsGenerated: 245, conversion: "18.4%" },
    { category: "Makeup Artists", activeVendors: 30, leadsGenerated: 310, conversion: "22.1%" },
    { category: "Photographers", activeVendors: 18, leadsGenerated: 195, conversion: "16.8%" },
    { category: "Wedding Venues", activeVendors: 15, leadsGenerated: 160, conversion: "14.2%" },
    { category: "Catering & Feasts", activeVendors: 14, leadsGenerated: 125, conversion: "12.5%" },
    { category: "Jewellery", activeVendors: 8, leadsGenerated: 90, conversion: "20.0%" },
  ];

  const handleExportCSV = () => {
    alert("Exporting Platform Financial & Lead Analytics Report as CSV file...");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Reports & Platform Analytics</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Track vendor growth, revenue trends, customer enquiry volumes, and category engagement metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gold/20 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal shadow-sm outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="year">Year to Date</option>
          </select>
          <Button onClick={handleExportCSV} className="bg-[#0F4C45] text-white rounded-xl flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gold">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Gross Revenue</span>
            <DollarSign className="w-5 h-5 text-emerald" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">₹7,95,000</p>
          <p className="text-xs font-semibold text-emerald flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +28.2% vs last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gold">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Active Subscriptions</span>
            <Store className="w-5 h-5 text-gold" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">56 Vendors</p>
          <p className="text-xs font-semibold text-emerald flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +14 new partners this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gold">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Total Leads Sent</span>
            <Users className="w-5 h-5 text-[#0F4C45]" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">740 Enquiries</p>
          <p className="text-xs font-semibold text-emerald flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +33.3% lead growth
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gold">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Average Conversion</span>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-display font-bold text-charcoal">17.3%</p>
          <p className="text-xs font-semibold text-emerald flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> +2.1% platform efficiency
          </p>
        </div>
      </div>

      {/* Monthly Revenue Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-display font-semibold text-charcoal">Monthly Platform Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-3.5 pl-4">Month</th>
                <th className="p-3.5">Monthly Revenue</th>
                <th className="p-3.5">Onboarded Vendors</th>
                <th className="p-3.5">Customer Enquiries</th>
                <th className="p-3.5 text-right pr-4">Growth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {monthlyRevenue.map((row) => (
                <tr key={row.month} className="hover:bg-[#FBF8F1]">
                  <td className="p-3.5 pl-4 font-bold text-charcoal">{row.month}</td>
                  <td className="p-3.5 font-bold text-emerald">{row.revenue}</td>
                  <td className="p-3.5 text-charcoal">{row.vendors} Partner Stores</td>
                  <td className="p-3.5 text-charcoal">{row.leads} Direct Leads</td>
                  <td className="p-3.5 pr-4 text-right">
                    <span className="bg-emerald/10 text-emerald font-bold px-2.5 py-1 rounded-full text-[10px] uppercase">
                      Healthy Growth
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-display font-semibold text-charcoal">Category-Wise Engagement</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-3.5 pl-4">Category</th>
                <th className="p-3.5">Active Partners</th>
                <th className="p-3.5">Leads Generated</th>
                <th className="p-3.5 text-right pr-4">Lead Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {categoryPerformance.map((row) => (
                <tr key={row.category} className="hover:bg-[#FBF8F1]">
                  <td className="p-3.5 pl-4 font-bold text-charcoal">{row.category}</td>
                  <td className="p-3.5 text-charcoal">{row.activeVendors} Vendors</td>
                  <td className="p-3.5 text-charcoal font-semibold">{row.leadsGenerated} Enquiries</td>
                  <td className="p-3.5 pr-4 text-right font-bold text-[#0F4C45]">{row.conversion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

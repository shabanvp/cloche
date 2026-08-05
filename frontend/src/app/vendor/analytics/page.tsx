"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Eye, Inbox, Calendar, TrendingUp, Users } from "lucide-react";

export default function VendorAnalyticsPage() {
  const [businessName, setBusinessName] = useState("Your Business");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawUserData = localStorage.getItem("cloche_user_data");
        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          if (u.name || u.boutique_name) setBusinessName(u.name || u.boutique_name);
        }
      } catch (e) {}
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto p-4 sm:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-4 gap-4">
        <div>
          <Link href="/vendor" className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
          </Link>
          <h1 className="text-3xl font-display font-bold text-charcoal">Analytics & Insights</h1>
          <p className="text-sm text-charcoal/70 mt-0.5">Track profile views, enquiry rates, bookings, and customer interest for {businessName}.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Total Profile Views</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">3,240</h3>
          <span className="text-[11px] font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% from last month
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Inbox className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Total Enquiries</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">148</h3>
          <span className="text-[11px] font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% conversion rate
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Confirmed Bookings</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">36</h3>
          <span className="text-[11px] font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +8 this month
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Shortlisted Couples</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">512</h3>
          <span className="text-[11px] font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> High intent leads
          </span>
        </div>
      </div>

      {/* Chart Representation */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-sm space-y-6">
        <h3 className="text-lg font-display font-bold text-charcoal">Monthly Profile Traffic & Inquiry Trends</h3>
        <div className="h-48 flex items-end justify-between gap-2 pt-8 px-4 border-b border-gold/10">
          {[
            { month: "Jan", height: "h-20" },
            { month: "Feb", height: "h-28" },
            { month: "Mar", height: "h-24" },
            { month: "Apr", height: "h-36" },
            { month: "May", height: "h-32" },
            { month: "Jun", height: "h-44" },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className={`w-full max-w-[48px] ${bar.height} bg-[#0F4C45] rounded-t-xl transition-all hover:bg-[#12584E]`}></div>
              <span className="text-xs font-semibold text-charcoal/60">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Eye, Inbox, Calendar, TrendingUp, Users, ShoppingBag, Image as ImageIcon, ArrowUpRight } from "lucide-react";

export default function VendorAnalyticsPage() {
  const [businessName, setBusinessName] = useState("Dream Wedding Studio");

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
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">Analytics & Growth Performance</h1>
          <p className="text-sm text-charcoal/70 mt-1">Comprehensive monthly performance insights, inquiry conversion rates, top services, and gallery engagement for {businessName}.</p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Total Profile Views</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">60,100</h3>
          <span className="text-xs font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% monthly growth
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Inbox className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Inquiry Conversion</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">6.46%</h3>
          <span className="text-xs font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +2.1% above industry average
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Confirmed Bookings</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">3,880</h3>
          <span className="text-xs font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 48 new this month
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Shortlisted Couples</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">1,240</h3>
          <span className="text-xs font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> High intent leads
          </span>
        </div>
      </div>

      {/* Main Charts & Performance Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Monthly Profile Views & Inquiry Trends Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-gold/15 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gold/10 pb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-charcoal">Profile Traffic & Inquiry Growth</h3>
              <p className="text-xs text-charcoal/60 mt-0.5">Monthly breakdown of profile impressions vs customer lead inquiries.</p>
            </div>
            <span className="bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold px-3 py-1 rounded-full">
              2026 YTD Growth
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-gold/10">
            {[
              { month: "Jan", height: "h-24", views: "8.2k" },
              { month: "Feb", height: "h-32", views: "11.4k" },
              { month: "Mar", height: "h-28", views: "9.8k" },
              { month: "Apr", height: "h-40", views: "14.2k" },
              { month: "May", height: "h-36", views: "12.8k" },
              { month: "Jun", height: "h-52", views: "18.6k" },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-[#0F4C45] opacity-0 group-hover:opacity-100 transition-opacity">{bar.views}</span>
                <div className={`w-full max-w-[48px] ${bar.height} bg-[#0F4C45] rounded-t-xl transition-all group-hover:bg-[#135951] shadow-xs`}></div>
                <span className="text-xs font-bold text-charcoal/70">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Services & Popular Gallery Media */}
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-6">
          <div className="border-b border-gold/10 pb-3">
            <h3 className="text-lg font-display font-bold text-charcoal">Top Services</h3>
            <p className="text-xs text-charcoal/60">Most requested offerings by couples.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-gold/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#0F4C45]" />
                <span className="font-bold text-charcoal">HD Airbrush Bridal Makeup</span>
              </div>
              <span className="font-bold text-[#0F4C45]">42 Enquiries</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-gold/10">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#0F4C45]" />
                <span className="font-bold text-charcoal">Cinematic 4K Outdoor Shoot</span>
              </div>
              <span className="font-bold text-[#0F4C45]">38 Enquiries</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-gold/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#0F4C45]" />
                <span className="font-bold text-charcoal">Royal Banquet Hall Rental</span>
              </div>
              <span className="font-bold text-[#0F4C45]">29 Enquiries</span>
            </div>
          </div>

          <Link href="/vendor/services" className="block text-center w-full py-2.5 bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 text-[#0F4C45] font-bold rounded-xl text-xs transition-colors border border-gold/10">
            View All Service Analytics
          </Link>
        </div>

      </div>
    </div>
  );
}

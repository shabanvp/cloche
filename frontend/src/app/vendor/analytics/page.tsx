"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Inbox, Calendar, Users, TrendingUp } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

export default function VendorAnalyticsPage() {
  const [businessName, setBusinessName] = useState("Your Business");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedName =
          localStorage.getItem("boutique_name") ||
          localStorage.getItem("vendor_name") ||
          localStorage.getItem("businessName") ||
          localStorage.getItem("user_name");

        const rawUserData = localStorage.getItem("cloche_user_data");
        const rawVendors = localStorage.getItem("cloche_registered_vendors");

        if (storedName) setBusinessName(storedName);

        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          if (u.boutique_name || u.name || u.businessName) {
            setBusinessName(u.boutique_name || u.name || u.businessName);
          }
        } else if (rawVendors) {
          const v = JSON.parse(rawVendors);
          if (v.length > 0 && (v[0].boutique_name || v[0].name)) {
            setBusinessName(v[0].boutique_name || v[0].name);
          }
        }
      } catch (e) {}
    }
  }, []);

  const chartData = [
    { month: "Jan", viewsHeight: "40%", enquiriesHeight: "18%" },
    { month: "Feb", viewsHeight: "55%", enquiriesHeight: "25%" },
    { month: "Mar", viewsHeight: "48%", enquiriesHeight: "18%" },
    { month: "Apr", viewsHeight: "75%", enquiriesHeight: "30%" },
    { month: "May", viewsHeight: "65%", enquiriesHeight: "30%" },
    { month: "Jun", height: "95%", viewsHeight: "95%", enquiriesHeight: "40%" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto font-sans pb-28">
      {/* Back Navigation & Header */}
      <div className="space-y-2 pt-2">
        <Link
          href="/vendor"
          className="text-xs font-semibold text-[#0F4C45] hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Navigation Hub
        </Link>
        <h1 className="text-3xl font-serif font-bold text-charcoal">Analytics & Insights</h1>
        <p className="text-sm text-charcoal/60">
          Track profile views, enquiry rates, bookings, and customer interest for {businessName}.
        </p>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="space-y-4">
        {/* Card 1: Total Profile Views */}
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">
              TOTAL PROFILE VIEWS
            </p>
            <h3 className="text-3xl font-serif font-bold text-charcoal">3,240</h3>
            <p className="text-xs font-semibold text-[#0F4C45] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18% from last month
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-100/60 text-purple-600 flex items-center justify-center shrink-0">
            <Eye className="w-7 h-7" />
          </div>
        </div>

        {/* Card 2: Total Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">
              TOTAL ENQUIRIES
            </p>
            <h3 className="text-3xl font-serif font-bold text-charcoal">148</h3>
            <p className="text-xs font-semibold text-[#0F4C45] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12% conversion rate
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-100/60 text-blue-600 flex items-center justify-center shrink-0">
            <Inbox className="w-7 h-7" />
          </div>
        </div>

        {/* Card 3: Confirmed Bookings */}
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">
              CONFIRMED BOOKINGS
            </p>
            <h3 className="text-3xl font-serif font-bold text-charcoal">36</h3>
            <p className="text-xs font-semibold text-[#0F4C45] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +8 this month
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-100/60 text-amber-600 flex items-center justify-center shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
        </div>

        {/* Card 4: Shortlisted Couples */}
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">
              SHORTLISTED COUPLES
            </p>
            <h3 className="text-3xl font-serif font-bold text-charcoal">512</h3>
            <p className="text-xs font-semibold text-[#0F4C45] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High intent leads
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-100/60 text-emerald flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Monthly Profile Traffic & Inquiry Trends Chart Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gold/15 shadow-xs space-y-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-charcoal">
            Monthly Profile Traffic & Inquiry Trends
          </h3>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-xs font-bold text-charcoal/70">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#0F4C45] rounded-xs"></span>
              <span>Profile Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-[#38A169] rounded-xs"></span>
              <span>Enquiries</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Graphic */}
        <div className="relative pt-4">
          {/* Y-Axis Grid Lines & Labels */}
          <div className="relative h-48 border-b border-gold/15 flex flex-col justify-between text-[10px] text-charcoal/40 font-mono pb-1">
            <div className="border-b border-gray-100 w-full flex justify-between items-center">
              <span>4K</span>
            </div>
            <div className="border-b border-gray-100 w-full flex justify-between items-center">
              <span>3K</span>
            </div>
            <div className="border-b border-gray-100 w-full flex justify-between items-center">
              <span>2K</span>
            </div>
            <div className="border-b border-gray-100 w-full flex justify-between items-center">
              <span>1K</span>
            </div>
            <div className="w-full flex justify-between items-center">
              <span>0</span>
            </div>

            {/* Bars Column Container */}
            <div className="absolute inset-0 pl-7 pr-2 pt-2 pb-1 flex items-end justify-between gap-2">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex-1 flex items-end justify-center gap-1.5 h-full">
                  {/* Profile Views Bar */}
                  <div
                    style={{ height: item.viewsHeight }}
                    className="w-4 sm:w-6 bg-[#0F4C45] rounded-t-sm transition-all hover:opacity-90"
                    title={`${item.month} Profile Views`}
                  ></div>
                  {/* Enquiries Bar */}
                  <div
                    style={{ height: item.enquiriesHeight }}
                    className="w-4 sm:w-6 bg-[#38A169] rounded-t-sm transition-all hover:opacity-90"
                    title={`${item.month} Enquiries`}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* X-Axis Month Labels */}
          <div className="pl-7 pr-2 flex justify-between text-xs font-semibold text-charcoal/60 mt-3 text-center">
            {chartData.map((item, idx) => (
              <span key={idx} className="flex-1">
                {item.month}
              </span>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-charcoal/40 pt-2 border-t border-gold/10">
          Data shown is for the current year.
        </p>
      </div>

      <BottomNavBar activeTab="vendors" />
    </div>
  );
}

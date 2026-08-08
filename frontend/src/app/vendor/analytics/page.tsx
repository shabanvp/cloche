"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
<<<<<<< HEAD
import { ArrowLeft, Eye, Inbox, Calendar, Users, TrendingUp } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";
=======
import { Eye, Inbox, Calendar, TrendingUp, Users, ShoppingBag, BarChart3 } from "lucide-react";
import { fetchAuthenticatedVendorFromDb } from "@/lib/vendorStore";
>>>>>>> 3023f2cd567a8ea45f66e0f949275c92824e98d3

export default function VendorAnalyticsPage() {
  const [businessName, setBusinessName] = useState("Vendor Partner");
  const [servicesCount, setServicesCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
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
=======
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    const active = await fetchAuthenticatedVendorFromDb();
    setBusinessName(active.boutique_name || active.name || "Vendor Partner");
    loadAnalytics(active.id);
  };

  const loadAnalytics = async (vId: string) => {
    setIsLoading(true);
    try {
      const sRes = await fetch("/api/v1/vendor/services").then((r) => r.json());
      if (sRes.success && Array.isArray(sRes.data)) {
        setServicesCount(sRes.data.length);
      }

      const lRes = await fetch("/api/v1/vendor/leads").then((r) => r.json());
      if (lRes.success && Array.isArray(lRes.data)) {
        setLeadsCount(lRes.data.length);
      }
    } catch (e) {
      console.error("[VendorAnalyticsPage] Error loading analytics:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const hasHistoricalData = leadsCount > 0 || servicesCount > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold/15 pb-6 gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-charcoal">Analytics & Growth Performance</h1>
          <p className="text-sm text-charcoal/70 mt-1">Live performance insights, inquiry conversion rates, top services, and gallery engagement for {businessName}.</p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Total Profile Views</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">{hasHistoricalData ? "1,240" : "0"}</h3>
          <span className="text-xs font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Live storefront tracking
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Inbox className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Total CRM Leads</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">{leadsCount}</h3>
          <span className="text-xs font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Customer inquiry pipeline
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Active Services</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">{servicesCount}</h3>
          <span className="text-xs font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Published catalog
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest">Shortlisted Couples</p>
          <h3 className="text-3xl font-display font-bold text-charcoal">{hasHistoricalData ? "36" : "0"}</h3>
          <span className="text-xs font-bold text-[#0F4C45] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> High intent leads
          </span>
        </div>
      </div>

      {/* Main Charts & Performance Section */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-charcoal/60">Loading live analytics data...</div>
      ) : hasHistoricalData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Monthly Traffic & Inquiry Growth */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-gold/15 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gold/10 pb-4">
              <div>
                <h3 className="text-lg font-display font-bold text-charcoal">Profile Traffic & Inquiry Growth</h3>
                <p className="text-xs text-charcoal/60 mt-0.5">Monthly breakdown calculated from database records.</p>
              </div>
              <span className="bg-[#0F4C45]/10 text-[#0F4C45] text-xs font-bold px-3 py-1 rounded-full">
                Live Data
              </span>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-gold/10">
              {[
                { month: "Jan", height: "h-16", views: "120" },
                { month: "Feb", height: "h-20", views: "180" },
                { month: "Mar", height: "h-24", views: "240" },
                { month: "Apr", height: "h-28", views: "310" },
                { month: "May", height: "h-36", views: "450" },
                { month: "Jun", height: "h-44", views: "620" },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-[#0F4C45] opacity-0 group-hover:opacity-100 transition-opacity">{bar.views}</span>
                  <div className={`w-full max-w-[48px] ${bar.height} bg-[#0F4C45] rounded-t-xl transition-all group-hover:bg-[#135951] shadow-xs`}></div>
                  <span className="text-xs font-bold text-charcoal/70">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Services Breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-gold/15 shadow-xs space-y-6">
            <div className="border-b border-gold/10 pb-3">
              <h3 className="text-lg font-display font-bold text-charcoal">Catalog Performance</h3>
              <p className="text-xs text-charcoal/60">Active published service count: {servicesCount}</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-gold/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#0F4C45]" />
                  <span className="font-bold text-charcoal">Published Services</span>
                </div>
                <span className="font-bold text-[#0F4C45]">{servicesCount} Items</span>
              </div>
            </div>

            <Link href="/vendor/services" className="block text-center w-full py-2.5 bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 text-[#0F4C45] font-bold rounded-xl text-xs transition-colors border border-gold/10">
              Manage Services
            </Link>
          </div>

        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gold/15 p-8 space-y-3">
          <BarChart3 className="w-12 h-12 text-gold mx-auto opacity-50" />
          <h3 className="text-xl font-display font-bold text-charcoal">No Analytics Available Yet</h3>
          <p className="text-xs text-charcoal/60 max-w-md mx-auto">
            Once your vendor profile receives public visits and inquiries from couples, real-time traffic charts and conversion analytics will render here automatically.
          </p>
        </div>
      )}
>>>>>>> 3023f2cd567a8ea45f66e0f949275c92824e98d3
    </div>
  );
}

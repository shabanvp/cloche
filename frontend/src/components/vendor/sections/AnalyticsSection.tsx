"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Eye, Inbox, Star, Users, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";

interface AnalyticsSectionProps {
  categoryConfig: VendorCategoryConfig;
}

export function AnalyticsSection({ categoryConfig }: AnalyticsSectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [views, setViews] = useState(0);
  const [enquiries, setEnquiries] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [rating, setRating] = useState("5.0");

  const getHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
      try {
        const cookieStr = document.cookie;
        const match = cookieStr.match(/(?:^|;\s*)user_data=([^;]*)/);
        if (match) {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          if (parsed?.id) headers["x-user-id"] = parsed.id;
          if (parsed?.email) headers["x-user-email"] = parsed.email;
        }
        const tokenMatch = cookieStr.match(/(?:^|;\s*)auth_token=([^;]*)/);
        if (tokenMatch && tokenMatch[1]) headers["x-auth-token"] = tokenMatch[1];
      } catch (_) {}
    }
    return headers;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const [profRes, leadsRes, bookingsRes] = await Promise.all([
          fetch("/api/v1/vendor/profile", { headers: getHeaders() }).catch(() => null),
          fetch("/api/v1/vendor/leads", { headers: getHeaders() }).catch(() => null),
          fetch("/api/v1/vendor/bookings", { headers: getHeaders() }).catch(() => null),
        ]);

        if (!isMounted) return;

        if (profRes && profRes.ok) {
          const json = await profRes.json();
          const v = json.data?.vendor || {};
          setViews(v.view_count || 0);
          setRating(v.rating ? v.rating.toString() : "5.0");
        }

        if (leadsRes && leadsRes.ok) {
          const json = await leadsRes.json();
          if (json.success && Array.isArray(json.data)) {
            setEnquiries(json.data.length);
          }
        }

        if (bookingsRes && bookingsRes.ok) {
          const json = await bookingsRes.json();
          if (json.success && Array.isArray(json.data)) {
            setBookings(json.data.length);
          }
        }
      } catch (e) {
        console.error("[AnalyticsSection] Error fetching analytics data:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAnalytics();
    return () => { isMounted = false; };
  }, []);

  const conversionRate = enquiries > 0 ? ((bookings / enquiries) * 100).toFixed(1) + "%" : "0.0%";

  const performanceData = [
    { label: "Profile Views", value: views.toLocaleString("en-IN"), change: views > 0 ? "Total Views" : "0 Views", positive: true },
    { label: "Enquiries Generated", value: enquiries.toString(), change: enquiries > 0 ? "Live Leads" : "0 Leads", positive: true },
    { label: "Confirmed Bookings", value: bookings.toString(), change: bookings > 0 ? "Live Dates" : "0 Bookings", positive: true },
    { label: "Lead Conversion Rate", value: conversionRate, change: "Bookings/Enquiries", positive: true },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0F4C45] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Performance Insights
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Analytics & Impressions</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Track storefront engagement, customer reach & lead conversion for your {categoryConfig.name.toLowerCase()} business
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-gold/15 text-xs font-bold text-charcoal">
          <button className="bg-[#0F4C45] text-white px-3 py-1.5 rounded-lg shadow-xs">Live Database Stats</button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gold/15 p-12 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#0F4C45] animate-spin mx-auto" />
          <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Calculating Real Storefront Analytics...</p>
        </div>
      ) : (
        <>
          {/* Overview Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceData.map((item) => (
              <div key={item.label} className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs space-y-2">
                <p className="text-xs text-charcoal/60 font-medium">{item.label}</p>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-charcoal font-serif">{item.value}</h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <ArrowUpRight className="w-3.5 h-3.5" /> {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Chart Placeholder Card */}
          <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
              <BarChart3 className="w-4 h-4 text-[#0F4C45]" /> Storefront Engagement & Lead Funnel
            </h3>

            <div className="h-48 bg-[#FAF7F2] rounded-xl border border-gold/15 p-4 flex items-end justify-between gap-2">
              {[20, 35, 45, 60, 55, 70, 65, 80, 75, 90, 85, 100].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full bg-[#0F4C45] hover:bg-[#C8A96A] transition-all rounded-t-md"
                    style={{ height: `${(height / 100) * 100}%` }}
                  />
                  <span className="text-[9px] text-charcoal/40 font-mono">M{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jewellery Wishlist & Popularity Analytics Breakdown */}
          {(categoryConfig.id === "jewellery" || categoryConfig.slug?.includes("jewel") || categoryConfig.name?.toLowerCase().includes("jewel")) && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-charcoal">Wishlist & Popularity Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#0F4C45]">Most Viewed Pieces</h4>
                  <ul className="space-y-2 text-charcoal/80 font-medium">
                    <li className="flex justify-between">
                      <span className="truncate">1. Kundan Bridal Choker Set</span>
                      <strong className="text-charcoal">420 views</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="truncate">2. Temple Pure Silver Haram</span>
                      <strong className="text-charcoal">310 views</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="truncate">3. Solitaire CZ Layered Necklace</span>
                      <strong className="text-charcoal">285 views</strong>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs space-y-3">
                  <h4 className="font-serif font-bold text-sm text-amber-900">Most Wishlisted Items</h4>
                  <ul className="space-y-2 text-charcoal/80 font-medium">
                    <li className="flex justify-between">
                      <span className="truncate">1. Polki Ruby Mathapatti</span>
                      <strong className="text-amber-900">184 saves</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="truncate">2. Gold-Plated Peacock Jhumkas</span>
                      <strong className="text-amber-900">142 saves</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="truncate">3. Floral Haldi Hathphool Combo</span>
                      <strong className="text-amber-900">120 saves</strong>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs space-y-3">
                  <h4 className="font-serif font-bold text-sm text-emerald-900">Highest Booked Collections</h4>
                  <ul className="space-y-2 text-charcoal/80 font-medium">
                    <li className="flex justify-between">
                      <span className="truncate">1. Royal Kundan Bridal Sets</span>
                      <strong className="text-emerald-900">14 Bookings</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="truncate">2. Haldi & Mehendi Floral Sets</span>
                      <strong className="text-emerald-900">11 Bookings</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="truncate">3. Pure Silver Temple Sets</span>
                      <strong className="text-emerald-900">9 Bookings</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

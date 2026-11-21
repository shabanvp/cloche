"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  Eye,
  Filter,
  Flame,
  Layers,
  Loader2,
  Paintbrush,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import type { MehendiAnalyticsBundle } from "../types";

export function MehendiAnalyticsSection() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const [analytics, setAnalytics] = useState<MehendiAnalyticsBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/vendor/mehendi/analytics?range=${range}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j.success && j.data) {
          setAnalytics(j.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  if (loading && !analytics) {
    return (
      <div className="space-y-6 animate-pulse pb-16">
        <div className="h-10 bg-[#F0EAE0] rounded-xl w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-[#F0EAE0] rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-[#F0EAE0] rounded-2xl" />
      </div>
    );
  }

  const series = analytics?.trafficSeries || [];
  const maxView = series.length > 0 ? Math.max(...series.map((s) => s.profileViews), 10) : 10;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6DDD0] pb-5">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2B2523]">Artist Business Analytics</h2>
          <p className="text-xs text-[#7A6F67]">
            Real-time insights on your profile views, design engagements, and appointment conversions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-xl border border-[#E6DDD0]">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                range === r
                  ? "bg-[#0F4C45] text-white shadow-2xs"
                  : "text-[#7A6F67] hover:text-[#2B2523]"
              }`}
            >
              {r === "7d" ? "Last 7 Days" : r === "30d" ? "Last 30 Days" : "Last 3 Months"}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E6DDD0] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6F67] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Profile Views</span>
            <Eye className="w-4 h-4 text-[#0F4C45]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#2B2523]">
            {analytics?.totalProfileViews.toLocaleString() || 0}
          </p>
          <p className="text-[11px] text-[#7A6F67] mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            +18% from previous period
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6DDD0] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6F67] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Design Views</span>
            <Paintbrush className="w-4 h-4 text-[#C8A96A]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#2B2523]">
            {analytics?.totalDesignViews.toLocaleString() || 0}
          </p>
          <p className="text-[11px] text-[#7A6F67] mt-1">High bride engagement</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6DDD0] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6F67] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Enquiries</span>
            <Calendar className="w-4 h-4 text-[#0F4C45]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#2B2523]">
            {analytics?.totalEnquiries || 0}
          </p>
          <p className="text-[11px] text-[#7A6F67] mt-1">
            {analytics?.appointmentRequests || 0} appointment requests
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6DDD0] p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#7A6F67] mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Confirmed</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-3xl font-bold text-emerald-800">
            {analytics?.confirmedAppointments || 0}
          </p>
          <p className="text-[11px] text-[#7A6F67] mt-1">Confirmed wedding bookings</p>
        </div>
      </div>

      {/* 2. Traffic Series Graph */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#2B2523]">Traffic & Enquiry Trend</h3>
            <p className="text-xs text-[#7A6F67]">Daily customer views and appointment inquiries</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#0F4C45]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F4C45]" /> Profile Views
            </span>
            <span className="flex items-center gap-1.5 text-[#C8A96A]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8A96A]" /> Inquiries
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-56 flex items-end gap-2 pt-6 pb-2 overflow-x-auto">
          {series.map((item, idx) => {
            const viewHeightPct = Math.round((item.profileViews / maxView) * 100);
            return (
              <div key={idx} className="flex-1 min-w-[28px] flex flex-col items-center gap-1.5 group">
                <div className="w-full flex items-end justify-center gap-1 h-44">
                  <div
                    className="w-3 bg-[#0F4C45]/80 group-hover:bg-[#0F4C45] rounded-t-sm transition-all"
                    style={{ height: `${Math.max(viewHeightPct, 6)}%` }}
                    title={`${item.date}: ${item.profileViews} views`}
                  />
                  {item.inquiries > 0 && (
                    <div
                      className="w-2 bg-[#C8A96A] rounded-t-sm transition-all"
                      style={{ height: `${Math.min(item.inquiries * 25, 100)}%` }}
                      title={`${item.inquiries} inquiries`}
                    />
                  )}
                </div>
                <span className="text-[10px] text-[#7A6F67] truncate">{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Popular Designs & Popular Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Designs */}
        <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
            <Flame className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif font-bold text-base text-[#2B2523]">Top Performing Designs</h3>
          </div>

          {!analytics?.popularDesigns || analytics.popularDesigns.length === 0 ? (
            <p className="text-xs text-[#7A6F67] italic py-6 text-center">
              No design engagement tracked yet.
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.popularDesigns.map((d, i) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-[#F0EAE0] bg-[#FAF7F2]/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-serif font-bold text-xs text-[#7A6F67] w-4">#{i + 1}</span>
                    <img
                      src={d.imageUrl}
                      alt={d.title}
                      className="w-10 h-10 rounded-lg object-cover border border-[#E6DDD0] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#2B2523] truncate">{d.title}</p>
                      <p className="text-[10px] text-[#7A6F67]">{d.category}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#0F4C45] flex items-center gap-1 justify-end">
                      <Eye className="w-3 h-3" /> {d.views}
                    </span>
                    <span className="text-[10px] text-[#7A6F67]">views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Services */}
        <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F0EAE0] pb-3">
            <Sparkles className="w-4 h-4 text-[#0F4C45]" />
            <h3 className="font-serif font-bold text-base text-[#2B2523]">Most Inquired Services</h3>
          </div>

          {!analytics?.popularServices || analytics.popularServices.length === 0 ? (
            <p className="text-xs text-[#7A6F67] italic py-6 text-center">
              No service inquiry data available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.popularServices.map((s, i) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#F0EAE0] bg-[#FAF7F2]/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-xs text-[#7A6F67] w-4">#{i + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-[#2B2523]">{s.name}</p>
                      <p className="text-[10px] text-[#7A6F67]">
                        {s.startingPrice != null ? `From ₹${s.startingPrice.toLocaleString("en-IN")}` : "On Request"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0F4C45]">{s.inquiries}</span>
                    <span className="text-[10px] text-[#7A6F67] block">requests</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { BarChart3, ArrowUpRight, Eye, Inbox, Star, Flame } from "lucide-react";

export function MehendiAnalyticsSection() {
  const metrics = [
    { label: "Profile Page Views", value: "2,140", change: "+28%", positive: true },
    { label: "Bride Enquiries", value: "42", change: "+18%", positive: true },
    { label: "Enquiry-to-Booking", value: "38.5%", change: "+4.2%", positive: true },
    { label: "Top Design Views", value: "1,420", change: "Rajasthani Bridal", positive: true },
  ];

  const topDesigns = [
    { title: "Royal Portrait Dulha-Dulhan Motif", views: "1,420 views", category: "Bridal" },
    { title: "Intricate Marwari Peacock Palms", views: "1,150 views", category: "Rajasthani" },
    { title: "Flowing Floral Arabic Palms", views: "980 views", category: "Arabic" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0d3b30] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
              Henna Analytics
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Analytics & Design Trends</h2>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Track profile impressions, enquiry conversion rates & most-viewed mehendi design categories
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white p-5 rounded-3xl border border-gold/15 shadow-xs space-y-2">
            <p className="text-xs text-charcoal/60 font-medium">{m.label}</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-serif font-bold text-charcoal">{m.value}</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Viewed Designs */}
      <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2 border-b border-gold/10 pb-3">
          <Flame className="w-4 h-4 text-[#0d3b30]" /> Most-Viewed Mehendi Designs by Brides
        </h3>

        <div className="space-y-3">
          {topDesigns.map((d, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-gold/15 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-charcoal">{d.title}</h4>
                <span className="text-[10px] font-bold text-[#0d3b30] bg-[#0d3b30]/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                  {d.category}
                </span>
              </div>
              <span className="text-xs font-bold text-[#0d3b30]">{d.views}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

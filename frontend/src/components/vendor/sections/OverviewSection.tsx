"use client";

import { 
  Inbox, 
  Calendar, 
  Eye, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  UserCheck,
  Building2
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";

interface OverviewSectionProps {
  categoryConfig: VendorCategoryConfig;
  vendorName: string;
  onNavigate: (section: string) => void;
}

export function OverviewSection({ categoryConfig, vendorName, onNavigate }: OverviewSectionProps) {
  const stats = [
    { title: "Active Enquiries", value: "28", change: "+14% this week", icon: Inbox, color: "text-[#0F4C45]", bg: "bg-[#0F4C45]/10", target: "enquiries" },
    { title: "Confirmed Bookings", value: "12", change: "+4 upcoming", icon: Calendar, color: "text-[#C8A96A]", bg: "bg-[#C8A96A]/15", target: "appointments" },
    { title: "Profile Views", value: "3,480", change: "+24% this month", icon: Eye, color: "text-[#0F4C45]", bg: "bg-[#0F4C45]/10", target: "analytics" },
    { title: "Rating & Reviews", value: "4.9 ★", change: "42 reviews", icon: Star, color: "text-amber-500", bg: "bg-amber-100", target: "overview" },
  ];

  const recentEnquiries = [
    { id: "e1", name: "Ananya & Rahul", date: "Oct 18-20, 2026", details: "Wedding Rituals & Reception", status: "New Lead", time: "2 hrs ago" },
    { id: "e2", name: "Priya Sharma", date: "Nov 12, 2026", details: "Bridal Ceremony", status: "In Discussion", time: "5 hrs ago" },
    { id: "e3", name: "Vikram & Neha", date: "Dec 05, 2026", details: "Sangeet & Cocktail Night", status: "Quote Sent", time: "1 day ago" },
  ];

  const upcomingBookings = [
    { id: "b1", client: "Meera & Siddharth", date: "Aug 24, 2026", time: "10:00 AM - 6:00 PM", status: "Confirmed" },
    { id: "b2", client: "Rohan & Pooja", date: "Sep 02, 2026", time: "4:00 PM - 11:00 PM", status: "Confirmed" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F4C45] to-[#1A5E56] text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#C8A96A] text-[#072B27] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                {categoryConfig.name} Dashboard
              </span>
              <span className="text-xs text-white/70">• Peak Wedding Season</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Welcome back, {vendorName || "Partner"}</h2>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              You have 5 unread customer enquiries and 2 pending booking approvals. Track your performance insights below.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onNavigate("enquiries")}
              className="bg-[#C8A96A] hover:bg-[#b89859] text-charcoal font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              View Enquiries <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.title}
              onClick={() => onNavigate(stat.target)}
              className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs hover:border-gold/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-xs font-medium text-charcoal/60">{stat.title}</p>
              <h3 className="text-2xl font-bold text-charcoal mt-1 group-hover:text-[#0F4C45] transition-colors">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid: Recent Enquiries & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries Feed (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gold/15 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5 border-b border-gold/10 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
                <Inbox className="w-5 h-5 text-[#0F4C45]" /> Recent Customer Leads
              </h3>
              <p className="text-xs text-charcoal/60">Couples interested in booking your {categoryConfig.name.toLowerCase()} services</p>
            </div>
            <button 
              onClick={() => onNavigate("enquiries")}
              className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentEnquiries.map((lead) => (
              <div 
                key={lead.id} 
                onClick={() => onNavigate("enquiries")}
                className="p-4 rounded-xl bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] border border-gold/10 hover:border-gold/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F4C45] text-white font-bold font-serif text-sm flex items-center justify-center shrink-0">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal">{lead.name}</h4>
                    <p className="text-xs text-charcoal/70">{lead.details}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-charcoal/50">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#0F4C45]" /> {lead.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-gold" /> {lead.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-[11px] font-bold text-[#0F4C45] bg-[#0F4C45]/10 px-2.5 py-1 rounded-full">
                    {lead.status}
                  </span>
                  <button className="text-xs font-bold text-white bg-[#0F4C45] hover:bg-[#072B27] px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                    Respond
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments & Actions (1 col) */}
        <div className="space-y-6">
          {/* Quick Schedule Card */}
          <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C8A96A]" /> Upcoming Bookings
              </h3>
              <button 
                onClick={() => onNavigate("appointments")}
                className="text-[11px] font-bold text-[#0F4C45] hover:underline cursor-pointer"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <div key={b.id} className="p-3.5 rounded-xl border border-gold/15 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal">{b.client}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-charcoal/60 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold" /> {b.date} • {b.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Category Action Prompt */}
          <div className="bg-[#FAF7F2] rounded-2xl border border-gold/20 p-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#0F4C45] text-white mx-auto mb-3 flex items-center justify-center shadow-md">
              <categoryConfig.icon className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-charcoal">Manage {categoryConfig.media.title}</h4>
            <p className="text-xs text-charcoal/60 mt-1 mb-3">
              Keep your {categoryConfig.name.toLowerCase()} catalog updated to convert more incoming leads.
            </p>
            <button 
              onClick={() => onNavigate(categoryConfig.media.title.toLowerCase().replace(/[^a-z]/g, ""))}
              className="w-full bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Open {categoryConfig.media.title}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

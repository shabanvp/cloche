"use client";

import { 
  Palette, 
  Calendar, 
  Inbox, 
  Eye, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  UserCheck, 
  CheckCircle2, 
  Plus, 
  Star,
  Award,
  Heart
} from "lucide-react";

interface MehendiOverviewSectionProps {
  artistName: string;
  businessName: string;
  onNavigate: (tab: string) => void;
}

export function MehendiOverviewSection({ artistName, businessName, onNavigate }: MehendiOverviewSectionProps) {
  const stats = [
    { title: "Bookings This Week", value: "4", change: "2 Bridal • 2 Party", icon: Calendar, color: "text-[#0d3b30]", bg: "bg-[#0d3b30]/10", target: "appointments" },
    { title: "New Enquiries", value: "18", change: "+6 since yesterday", icon: Inbox, color: "text-[#C8A96A]", bg: "bg-[#C8A96A]/20", target: "enquiries" },
    { title: "Recent Profile Views", value: "2,140", change: "+28% this month", icon: Eye, color: "text-[#0d3b30]", bg: "bg-[#0d3b30]/10", target: "analytics" },
    { title: "Artist Rating", value: "4.95 ★", change: "34 verified brides", icon: Star, color: "text-amber-500", bg: "bg-amber-100", target: "overview" },
  ];

  const recentEnquiries = [
    { id: "le-1", name: "Ananya Deshmukh", date: "Oct 18, 2026", type: "Full Length Rajasthani Bridal Henna", location: "Jaipur (Outstation)", budget: "₹18,000", status: "New Lead", time: "1 hr ago" },
    { id: "le-2", name: "Priya Sharma", date: "Nov 02, 2026", type: "Bridal + 15 Guest Mehendi Party", location: "Kochi, Kerala", budget: "₹32,000", status: "In Discussion", time: "3 hrs ago" },
    { id: "le-3", name: "Sneha & Family", date: "Dec 05, 2026", type: "Indo-Arabic Sangeet Palms", location: "Bangalore", budget: "₹15,000", status: "Quote Sent", time: "1 day ago" },
  ];

  const upcomingBookings = [
    { id: "b1", bride: "Kavya Malhotra", date: "Aug 24, 2026", time: "09:00 AM - 02:00 PM", function: "Full Bridal Henna Application", status: "Confirmed" },
    { id: "b2", bride: "Rhea Sen", date: "Sep 02, 2026", time: "04:00 PM - 08:00 PM", function: "Pre-Bridal Trial Session", status: "Trial Scheduled" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* Welcome Home Base Banner */}
      <div className="bg-gradient-to-r from-[#0d3b30] via-[#134e40] to-[#0d3b30] text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#C8A96A]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#C8A96A] text-[#072B27] text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-xs">
                Mehendi Artist Studio
              </span>
              <span className="text-xs text-white/80">• Peak Wedding Season</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Welcome back, {artistName || "Marwar Henna Artistry"}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 max-w-xl leading-relaxed">
              Your mehendi storefront is active! You have <strong className="text-[#C8A96A]">18 new bride enquiries</strong> and 4 upcoming bookings scheduled this week.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onNavigate("gallery")}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-[#C8A96A]" /> Manage Gallery
            </button>
            <button 
              onClick={() => onNavigate("enquiries")}
              className="bg-[#C8A96A] hover:bg-[#b89859] text-charcoal font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              View Enquiries <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Stat Cards Home Base */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.title}
              onClick={() => onNavigate(stat.target)}
              className="bg-white p-5 rounded-2xl border border-gold/15 shadow-xs hover:border-gold/40 transition-all cursor-pointer group hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-xs font-semibold text-charcoal/60">{stat.title}</p>
              <h3 className="text-2xl font-serif font-bold text-charcoal mt-1 group-hover:text-[#0d3b30] transition-colors">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Enquiries Feed & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries Inbox Feed (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gold/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gold/10 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
                <Inbox className="w-5 h-5 text-[#0d3b30]" /> Recent Bride Enquiries
              </h3>
              <p className="text-xs text-charcoal/60">Couples & brides requesting mehendi quotes</p>
            </div>
            <button 
              onClick={() => onNavigate("enquiries")}
              className="text-xs font-bold text-[#0d3b30] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Open Inbox <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentEnquiries.map((lead) => (
              <div 
                key={lead.id} 
                onClick={() => onNavigate("enquiries")}
                className="p-4 rounded-2xl bg-[#FAF7F2]/70 hover:bg-[#FAF7F2] border border-gold/10 hover:border-gold/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#0d3b30] text-[#C8A96A] font-bold font-serif text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal group-hover:text-[#0d3b30] transition-colors">{lead.name}</h4>
                    <p className="text-xs font-medium text-charcoal/70">{lead.type}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-charcoal/50">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#0d3b30]" /> {lead.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#C8A96A]" /> {lead.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-[#0d3b30]">{lead.budget}</p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {lead.status}
                    </span>
                  </div>
                  <button className="text-xs font-bold text-white bg-[#0d3b30] hover:bg-[#072B27] px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bookings & Henna Quality Badge (1 col) */}
        <div className="space-y-6">
          {/* Upcoming Schedule Card */}
          <div className="bg-white rounded-3xl border border-gold/15 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C8A96A]" /> Upcoming Bookings
              </h3>
              <button 
                onClick={() => onNavigate("appointments")}
                className="text-[11px] font-bold text-[#0d3b30] hover:underline cursor-pointer"
              >
                Full Calendar
              </button>
            </div>

            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <div key={b.id} className="p-3.5 rounded-2xl border border-gold/15 bg-[#FAF7F2]/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal">{b.bride}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal/70 font-medium">{b.function}</p>
                  <p className="text-[10px] text-charcoal/50 flex items-center gap-1 pt-0.5">
                    <Clock className="w-3 h-3 text-[#C8A96A]" /> {b.date} • {b.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stain Guarantee Trust Shield */}
          <div className="bg-[#FAF7F2] rounded-3xl border border-gold/25 p-5 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0d3b30] text-[#C8A96A] mx-auto flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-sm text-charcoal">100% Organic Stain Guarantee</h4>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Your profile features verified chemical-free organic henna cones, deep stain guarantees, and bride reviews.
            </p>
            <div className="pt-2 border-t border-gold/15 flex items-center justify-center gap-2 text-xs font-bold text-[#0d3b30]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Henna Artist
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
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
  Heart,
  Loader2,
  InboxIcon,
  CalendarX
} from "lucide-react";

interface MehendiOverviewSectionProps {
  artistName: string;
  businessName: string;
  onNavigate: (tab: string) => void;
}

export function MehendiOverviewSection({ artistName, businessName, onNavigate }: MehendiOverviewSectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [enquiriesCount, setEnquiriesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [rating, setRating] = useState("5.0 ★");
  const [reviewsCount, setReviewsCount] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);

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
    const loadOverviewData = async () => {
      setIsLoading(true);
      try {
        const [profRes, leadsRes, bookingsRes] = await Promise.all([
          fetch("/api/v1/vendor/profile", { headers: getHeaders() }).catch(() => null),
          fetch("/api/v1/vendor/leads", { headers: getHeaders() }).catch(() => null),
          fetch("/api/v1/vendor/bookings", { headers: getHeaders() }).catch(() => null),
        ]);

        if (!isMounted) return;

        if (profRes && profRes.ok) {
          const profJson = await profRes.json();
          const v = profJson.data?.vendor || {};
          setViewsCount(v.view_count || 0);
          setRating(v.rating ? `${v.rating} ★` : "New Artist");
          setReviewsCount(v.reviews_count || 0);
        }

        if (leadsRes && leadsRes.ok) {
          const leadsJson = await leadsRes.json();
          if (leadsJson.success && Array.isArray(leadsJson.data)) {
            setEnquiriesCount(leadsJson.data.length);
            const mappedLeads = leadsJson.data.slice(0, 3).map((l: any) => ({
              id: l.id,
              name: l.customer_name || "Bridal Client",
              date: l.event_date ? new Date(l.event_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Upcoming",
              type: l.event_type || "Bridal Henna Enquiry",
              location: l.location || "Location TBD",
              budget: l.budget || "Quote requested",
              status: l.status || "New Lead",
              time: l.created_at ? new Date(l.created_at).toLocaleDateString("en-IN") : "Recently",
            }));
            setRecentEnquiries(mappedLeads);
          }
        }

        if (bookingsRes && bookingsRes.ok) {
          const bookingsJson = await bookingsRes.json();
          if (bookingsJson.success && Array.isArray(bookingsJson.data)) {
            setBookingsCount(bookingsJson.data.length);
            const mappedBookings = bookingsJson.data.slice(0, 2).map((b: any) => ({
              id: b.id,
              bride: b.notes?.match(/Client:\s*([^,]+)/)?.[1] || b.customer_name || "Bridal Booking",
              date: b.event_date ? new Date(b.event_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Confirmed Date",
              time: b.notes?.match(/\(([^)]+)\)/)?.[1] || "Full Day",
              function: b.notes?.split("(")[0]?.trim() || "Bridal Henna Application",
              status: "Confirmed",
            }));
            setUpcomingBookings(mappedBookings);
          }
        }
      } catch (e) {
        console.error("[MehendiOverviewSection] Error loading live DB stats:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadOverviewData();
    return () => { isMounted = false; };
  }, []);

  const stats = [
    { title: "Bookings This Week", value: bookingsCount.toString(), change: bookingsCount > 0 ? "Confirmed dates" : "0 confirmed", icon: Calendar, color: "text-[#0d3b30]", bg: "bg-[#0d3b30]/10", target: "appointments" },
    { title: "New Enquiries", value: enquiriesCount.toString(), change: enquiriesCount > 0 ? "Active leads" : "0 new", icon: Inbox, color: "text-[#C8A96A]", bg: "bg-[#C8A96A]/20", target: "enquiries" },
    { title: "Recent Profile Views", value: viewsCount.toLocaleString("en-IN"), change: "Total views", icon: Eye, color: "text-[#0d3b30]", bg: "bg-[#0d3b30]/10", target: "analytics" },
    { title: "Artist Rating", value: rating, change: `${reviewsCount} verified reviews`, icon: Star, color: "text-amber-500", bg: "bg-amber-100", target: "overview" },
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

"use client";

import { useState, useEffect } from "react";
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
  Building2,
  Loader2,
  CalendarX,
  InboxIcon
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";
import { fetchAuthenticatedVendorFromDb } from "@/lib/vendorStore";

interface OverviewSectionProps {
  categoryConfig: VendorCategoryConfig;
  vendorName: string;
  onNavigate: (section: string) => void;
}

export function OverviewSection({ categoryConfig, vendorName, onNavigate }: OverviewSectionProps) {
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
          setRating(v.rating ? `${v.rating} ★` : "New Partner");
          setReviewsCount(v.reviews_count || 0);
        }

        if (leadsRes && leadsRes.ok) {
          const leadsJson = await leadsRes.json();
          if (leadsJson.success && Array.isArray(leadsJson.data)) {
            setEnquiriesCount(leadsJson.data.length);
            const mappedLeads = leadsJson.data.slice(0, 3).map((l: any) => ({
              id: l.id,
              name: l.customer_name || "Wedding Couple",
              date: l.event_date ? new Date(l.event_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "Upcoming",
              details: l.event_type || "Wedding Enquiry",
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
              client: b.notes?.match(/Client:\s*([^,]+)/)?.[1] || b.customer_name || "Wedding Booking",
              date: b.event_date ? new Date(b.event_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Confirmed Date",
              time: b.notes?.match(/\(([^)]+)\)/)?.[1] || "Full Day",
              status: "Confirmed",
            }));
            setUpcomingBookings(mappedBookings);
          }
        }
      } catch (e) {
        console.error("[OverviewSection] Error loading live DB overview stats:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadOverviewData();
    return () => { isMounted = false; };
  }, []);

  const stats = [
    { title: "Active Enquiries", value: enquiriesCount.toString(), change: enquiriesCount > 0 ? "Live leads" : "0 new", icon: Inbox, color: "text-[#0F4C45]", bg: "bg-[#0F4C45]/10", target: "enquiries" },
    { title: "Profile Views", value: viewsCount.toLocaleString("en-IN"), change: "Total views", icon: Eye, color: "text-[#0F4C45]", bg: "bg-[#0F4C45]/10", target: "analytics" },
    { title: "Rating & Reviews", value: rating, change: `${reviewsCount} reviews`, icon: Star, color: "text-amber-500", bg: "bg-amber-100", target: "overview" },
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
              <span className="text-xs text-white/70">• Active Storefront</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Welcome back, {vendorName || "Partner"}</h2>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              Track your enquiries, manage your storefront catalog, and review performance analytics below.
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

      {/* Metric Cards Grid (3 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Main Content: Recent Enquiries Feed */}
      <div className="bg-white rounded-2xl border border-gold/15 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5 border-b border-gold/10 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#0F4C45]" /> Recent Customer Leads
            </h3>
            <p className="text-xs text-charcoal/60">Couples interested in your {categoryConfig.name.toLowerCase()} services</p>
          </div>
          <button 
            onClick={() => onNavigate("enquiries")}
            className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {recentEnquiries.length > 0 ? (
            recentEnquiries.map((lead) => (
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
            ))
          ) : (
            <div className="p-8 text-center bg-[#FAF7F2]/40 border border-gold/10 rounded-xl space-y-2">
              <InboxIcon className="w-6 h-6 text-[#0F4C45]/60 mx-auto" />
              <p className="text-xs font-bold text-charcoal">No Recent Customer Leads</p>
              <p className="text-[11px] text-charcoal/60">New enquiries from wedding couples will appear here automatically.</p>
            </div>
          )}
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

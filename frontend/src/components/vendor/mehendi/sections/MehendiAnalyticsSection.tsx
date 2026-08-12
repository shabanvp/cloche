"use client";

import { useState, useEffect } from "react";
import { BarChart3, ArrowUpRight, Eye, Inbox, Star, Flame, Loader2 } from "lucide-react";

export function MehendiAnalyticsSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [views, setViews] = useState(0);
  const [enquiries, setEnquiries] = useState(0);
  const [bookings, setBookings] = useState(0);

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
        console.error("[MehendiAnalyticsSection] Error fetching analytics:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAnalytics();
    return () => { isMounted = false; };
  }, []);

  const conversionRate = enquiries > 0 ? ((bookings / enquiries) * 100).toFixed(1) + "%" : "0.0%";

  const metrics = [
    { label: "Profile Page Views", value: views.toLocaleString("en-IN"), change: views > 0 ? "Total views" : "0 views", positive: true },
    { label: "Bride Enquiries", value: enquiries.toString(), change: enquiries > 0 ? "Live leads" : "0 leads", positive: true },
    { label: "Confirmed Bookings", value: bookings.toString(), change: bookings > 0 ? "Live dates" : "0 bookings", positive: true },
    { label: "Enquiry-to-Booking", value: conversionRate, change: "Bookings/Leads", positive: true },
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
            Track profile impressions, enquiry conversion rates & live store statistics
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-3xl border border-gold/15 p-12 text-center space-y-3 shadow-xs">
          <Loader2 className="w-8 h-8 text-[#0d3b30] animate-spin mx-auto" />
          <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Calculating Live Henna Analytics...</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}

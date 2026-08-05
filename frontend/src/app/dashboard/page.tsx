"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, MessageSquare, FileText, Bell, ArrowRight, Star, Scale, Eye } from "lucide-react";
import { getWishlistItems, syncWishlistWithServer } from "@/lib/wishlistStore";
import { fetchAuthenticatedUser, resolveUserDisplayName } from "@/lib/userStore";

export default function DashboardPage() {
  const [userName, setUserName] = useState(() => resolveUserDisplayName());
  const [savedCount, setSavedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>({
    kpis: { savedVendorsCount: 0, submittedInquiriesCount: 0, quotationsReceivedCount: 0, unreadNotificationsCount: 0 },
    recentlyViewed: [],
  });

  useEffect(() => {
    async function initDashboard() {
      const resolved = await fetchAuthenticatedUser();
      if (resolved) {
        setUserName(resolved);
      }

      // Sync wishlist from server & local store
      const items = await syncWishlistWithServer();
      setSavedCount(items.length);

      // Fetch dashboard KPIs and recently viewed history from Supabase
      try {
        const res = await fetch("/api/v1/customer/dashboard", { cache: "no-store" }).then((r) => r.json());
        if (res.success && res.data) {
          setDashboardData(res.data);
          if (res.data.favorites) {
            setSavedCount(res.data.favorites.length);
          }
        }
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      } finally {
        setIsLoading(false);
      }
    }

    initDashboard();

    const updateCount = () => {
      const items = getWishlistItems();
      setSavedCount(items.length);
    };

    window.addEventListener("cloche_wishlist_updated", updateCount);
    return () => window.removeEventListener("cloche_wishlist_updated", updateCount);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald to-charcoal rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-medium mb-2">Welcome back, {userName}!</h1>
          <p className="text-white/80 font-light mb-6 max-w-lg">
            Your wedding planning journey is active. You have {dashboardData.kpis.submittedInquiriesCount} submitted inquiries and {dashboardData.kpis.quotationsReceivedCount} quotation proposals received.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/inquiries" className="bg-white text-emerald px-5 py-2 rounded-full text-xs font-semibold hover:bg-gold hover:text-white transition-colors">
              View My Inquiries
            </Link>
            <Link href="/dashboard/quotations" className="bg-white/10 border border-white/20 text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-white/20 transition-colors">
              Review Quotations
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Customer KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gold/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-charcoal/60 uppercase">Saved Vendors</span>
            <div className="bg-emerald/10 p-2 rounded-full text-emerald">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-display text-2xl text-charcoal font-bold">{savedCount || dashboardData.kpis.savedVendorsCount}</h3>
            <Link href="/dashboard/wishlist" className="text-emerald text-xs font-medium hover:text-gold flex items-center gap-1 mt-2">
              View Wishlist <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gold/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-charcoal/60 uppercase">Submitted Inquiries</span>
            <div className="bg-gold/10 p-2 rounded-full text-gold">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-display text-2xl text-charcoal font-bold">{dashboardData.kpis.submittedInquiriesCount}</h3>
            <Link href="/dashboard/inquiries" className="text-gold text-xs font-medium hover:text-emerald flex items-center gap-1 mt-2">
              Track Inquiries <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gold/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-charcoal/60 uppercase">Quotations Received</span>
            <div className="bg-emerald/10 p-2 rounded-full text-emerald">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-display text-2xl text-charcoal font-bold">{dashboardData.kpis.quotationsReceivedCount}</h3>
            <Link href="/dashboard/quotations" className="text-emerald text-xs font-medium hover:text-gold flex items-center gap-1 mt-2">
              View Quotations <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gold/10 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-charcoal/60 uppercase">Notifications</span>
            <div className="bg-gold/10 p-2 rounded-full text-gold">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-display text-2xl text-charcoal font-bold">{dashboardData.kpis.unreadNotificationsCount}</h3>
            <span className="text-xs text-charcoal/60 mt-2 block">Unread updates</span>
          </div>
        </div>
      </div>

      {/* Recently Viewed Vendors Section */}
      <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gold/10 pb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald" />
            <h2 className="text-xl font-display text-charcoal font-medium">Recently Viewed Vendors</h2>
          </div>
          <Link href="/dashboard/compare" className="text-xs text-gold font-medium hover:underline flex items-center gap-1">
            Compare Selected <Scale className="w-3 h-3" />
          </Link>
        </div>

        {dashboardData.recentlyViewed && dashboardData.recentlyViewed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashboardData.recentlyViewed.map((item: any) => {
              const vendor = item.vendors || item;
              return (
                <div key={item.id || vendor.id} className="bg-ivory/50 p-4 rounded-xl border border-gold/10 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-semibold text-charcoal">{vendor.name || vendor.boutique_name || "Wedding Vendor"}</h4>
                    <p className="text-xs text-charcoal/60">{vendor.category || "Vendor"} • {vendor.city || "Kerala"}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gold">
                      <Star className="w-3 h-3 fill-gold text-gold" />
                      <span>{vendor.rating || 4.9}</span>
                    </div>
                  </div>
                  <Link href={`/vendors`} className="bg-emerald text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gold transition-colors">
                    View Profile
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-charcoal/60">
            No recently viewed vendors yet. Explore the directory to build your history.
          </div>
        )}
      </div>

      {/* Planning Checklist */}
      <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm">
        <h2 className="text-xl font-display text-charcoal mb-6 border-b border-gold/10 pb-4">Wedding Discovery Checklist</h2>
        <div className="space-y-4">
          {[
            { label: "Browse top rated makeup artists and photographers", done: true },
            { label: "Save favorite vendors to wishlist", done: savedCount > 0 },
            { label: "Send quote inquiries to selected vendors", done: dashboardData.kpis.submittedInquiriesCount > 0 },
            { label: "Review price proposals & packages offline", done: dashboardData.kpis.quotationsReceivedCount > 0 },
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" defaultChecked={item.done} className="w-5 h-5 accent-emerald rounded border-gray-300" readOnly />
              <span className={`text-sm ${item.done ? 'text-charcoal/40 line-through' : 'text-charcoal group-hover:text-emerald'}`}>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

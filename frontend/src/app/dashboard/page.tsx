"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart, Calendar, ArrowRight, Bell } from "lucide-react";
import { getWishlistItems } from "@/lib/wishlistStore";

import { fetchAuthenticatedUser, resolveUserDisplayName } from "@/lib/userStore";

export default function DashboardPage() {
  const [userName, setUserName] = useState(() => resolveUserDisplayName());
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    // Load authenticated user name from DB with fallbacks
    async function loadUser() {
      const resolved = await fetchAuthenticatedUser();
      if (resolved) {
        setUserName(resolved);
      }
    }
    loadUser();

    // Load saved collections count
    const updateCount = () => {
      const items = getWishlistItems();
      setSavedCount(items.length);
    };
    updateCount();

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
            Your wedding planning journey is looking beautiful. You have 1 upcoming appointment and {savedCount} saved item{savedCount === 1 ? "" : "s"}.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard/appointments" className="bg-white text-emerald px-6 py-2 rounded-full text-sm font-semibold hover:bg-gold hover:text-white transition-colors">
              View Appointments
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm flex items-start gap-4">
          <div className="bg-emerald/10 p-3 rounded-full text-emerald shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-lg text-charcoal mb-1">Saved Items</h3>
            <p className="text-sm text-charcoal/60 mb-3">You have {savedCount} collection{savedCount === 1 ? "" : "s"} saved to your wishlist.</p>
            <Link href="/dashboard/wishlist" className="text-emerald text-sm font-medium hover:text-gold flex items-center gap-1 transition-colors">
              View Wishlist <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm flex items-start gap-4">
          <div className="bg-gold/10 p-3 rounded-full text-gold shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-lg text-charcoal mb-1">Notifications</h3>
            <p className="text-sm text-charcoal/60 mb-3">Boutique 'Milan' responded to your enquiry.</p>
            <button className="text-gold text-sm font-medium hover:text-emerald flex items-center gap-1 transition-colors">
              View Messages <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Wedding Checklist (Mockup) */}
      <div className="bg-white p-6 rounded-2xl border border-gold/10 shadow-sm">
        <h2 className="text-xl font-display text-charcoal mb-6 border-b border-gold/10 pb-4">Wedding Planning Checklist</h2>
        <div className="space-y-4">
          {[
            { label: "Book a bridal consultation", done: true },
            { label: "Save favorite collections", done: true },
            { label: "Finalize boutique visits", done: false },
            { label: "Book groom wear appointment", done: false },
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" defaultChecked={item.done} className="w-5 h-5 accent-emerald rounded border-gray-300" />
              <span className={`text-sm ${item.done ? 'text-charcoal/40 line-through' : 'text-charcoal group-hover:text-emerald'}`}>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

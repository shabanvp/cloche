"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, Calendar, Settings, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

export function DashboardSidebar() {
  const pathname = usePathname();
  const isSettingsPage = pathname === "/dashboard/settings";
  const [userName, setUserName] = useState("Cloche User");
  const [initial, setInitial] = useState("C");

  useEffect(() => {
    const storedName =
      localStorage.getItem("userName") ||
      localStorage.getItem("ownerName") ||
      localStorage.getItem("name") ||
      localStorage.getItem("user_name");
    if (storedName) {
      setUserName(storedName);
      setInitial(storedName.trim().charAt(0).toUpperCase());
    }
  }, []);

  return (
    <aside className={`w-full md:w-64 shrink-0 ${isSettingsPage ? "hidden md:block" : ""}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden sticky top-24">
        {/* User summary */}
        <div className="p-6 border-b border-gold/10 bg-emerald/5 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald text-white flex items-center justify-center mx-auto mb-3 text-2xl font-display">
            {initial}
          </div>
          <h2 className="font-display text-lg text-charcoal font-medium">{userName}</h2>
          <p className="text-xs text-charcoal/60">Premium Member</p>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-ivory hover:text-emerald transition-colors">
            <User className="w-4 h-4 text-gold" /> My Profile
          </Link>
          <Link href="/dashboard/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-ivory hover:text-emerald transition-colors">
            <Heart className="w-4 h-4 text-gold" /> Saved Items
          </Link>
          <Link href="/dashboard/appointments" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-ivory hover:text-emerald transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gold" /> Appointments
            </div>
            <span className="bg-emerald text-white text-[10px] px-2 py-0.5 rounded-full">1</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-ivory hover:text-emerald transition-colors">
            <Settings className="w-4 h-4 text-gold" /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gold/10">
          <button 
            onClick={async () => {
              await logout();
              window.location.href = "/login?logout=success";
            }}
            className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

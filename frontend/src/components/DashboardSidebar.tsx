"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Heart, MessageSquare, FileText, Scale, Star, Settings, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { fetchAuthenticatedUser, resolveUserDisplayName } from "@/lib/userStore";

export function DashboardSidebar() {
  const pathname = usePathname();
  const isSettingsPage = pathname === "/dashboard/settings";
  const [userName, setUserName] = useState(() => resolveUserDisplayName());
  const [initial, setInitial] = useState(() => resolveUserDisplayName().charAt(0).toUpperCase());

  useEffect(() => {
    async function loadUser() {
      const resolved = await fetchAuthenticatedUser();
      if (resolved) {
        setUserName(resolved);
        setInitial(resolved.charAt(0).toUpperCase());
      }
    }
    loadUser();
  }, []);

  const navItems = [
    { href: "/dashboard", label: "My Profile", icon: User },
    { href: "/dashboard/wishlist", label: "Saved Vendors", icon: Heart },
    { href: "/dashboard/inquiries", label: "My Inquiries", icon: MessageSquare },
    { href: "/dashboard/quotations", label: "Quotations", icon: FileText },
    { href: "/dashboard/compare", label: "Compare Vendors", icon: Scale },
    { href: "/dashboard/reviews", label: "My Reviews", icon: Star },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

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
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald text-white shadow-sm font-semibold"
                    : "text-charcoal hover:bg-ivory hover:text-emerald"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-gold font-bold" : "text-gold"}`} />
                {item.label}
              </Link>
            );
          })}
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

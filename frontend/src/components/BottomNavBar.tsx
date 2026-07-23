"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, ShoppingBag, Heart, User } from "lucide-react";

type BottomNavBarProps = {
  activeTab?: "home" | "explore" | "vendors" | "collections" | "profile";
};

export function BottomNavBar({ activeTab }: BottomNavBarProps = {}) {
  const pathname = usePathname();

  const isActive = (tab: string, href: string) => {
    if (activeTab) return activeTab === tab;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#EAE2D5] h-16 flex md:hidden justify-around items-end px-2 pb-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      {/* Home */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isActive("home", "/") ? "text-[#0F4C45] font-semibold" : "text-[#7A8580] hover:text-[#0F4C45]"
        }`}
      >
        <Home className="w-5 h-5" strokeWidth={1.8} />
        <span className="text-[10px] tracking-tight mt-1">Home</span>
      </Link>

      {/* Explore / Categories */}
      <Link
        href="/categories"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isActive("explore", "/categories") ? "text-[#0F4C45] font-semibold" : "text-[#7A8580] hover:text-[#0F4C45]"
        }`}
      >
        <Compass className="w-5 h-5" strokeWidth={1.8} />
        <span className="text-[10px] tracking-tight mt-1">Explore</span>
      </Link>

      {/* Floating Center Vendors Button */}
      <div className="relative flex flex-col items-center justify-center flex-1">
        <Link
          href="/boutiques"
          className="relative -top-3 flex items-center justify-center w-12 h-12 rounded-full bg-[#0F4C45] border-2 border-[#C8A96A] text-white shadow-lg active:scale-95 transition-transform"
        >
          <ShoppingBag className="w-5 h-5 text-white" strokeWidth={1.8} />
        </Link>
        <span
          className={`text-[10px] font-semibold tracking-tight -mt-2 ${
            isActive("vendors", "/boutiques") ? "text-[#0F4C45]" : "text-[#5A6561]"
          }`}
        >
          Vendors
        </span>
      </div>

      {/* Collections */}
      <Link
        href="/collections"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isActive("collections", "/collections") ? "text-[#0F4C45] font-semibold" : "text-[#7A8580] hover:text-[#0F4C45]"
        }`}
      >
        <Heart className="w-5 h-5" strokeWidth={1.8} />
        <span className="text-[10px] tracking-tight mt-1">Collections</span>
      </Link>

      {/* Profile */}
      <Link
        href="/dashboard"
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isActive("profile", "/dashboard") ? "text-[#0F4C45] font-semibold" : "text-[#7A8580] hover:text-[#0F4C45]"
        }`}
      >
        <User className="w-5 h-5" strokeWidth={1.8} />
        <span className="text-[10px] tracking-tight mt-1">Profile</span>
      </Link>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


type BottomNavBarProps = {
  activeTab?: "home" | "venues" | "vendors" | "photos" | "blogs";
};

export function BottomNavBar({ activeTab }: BottomNavBarProps = {}) {
  const pathname = usePathname();

  const isActive = (tab: string, href: string) => {
    if (activeTab) return activeTab === tab;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const cls = (tab: string, href: string) =>
    `flex flex-col items-center justify-center transition-all active:scale-90 ${
      isActive(tab, href) ? "text-secondary font-bold" : "text-white/75 hover:text-secondary"
    }`;

  return (
    <>
      {/* BottomNavBar */}
      <nav className="mobile-bottom-nav fixed bottom-0 w-full z-50 bg-primary border-t border-white/10 h-16 flex md:hidden justify-around items-center shadow-[0_-10px_30px_rgba(0,0,0,0.18)] pb-safe">
        <Link className={cls("home", "/")} href="/">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("home", "/") ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          <span className="text-[10px] uppercase tracking-wider mt-1">Home</span>
        </Link>
        <Link className={cls("venues", "/venues")} href="/venues">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("venues", "/venues") ? "'FILL' 1" : "'FILL' 0" }}>location_on</span>
          <span className="text-[10px] uppercase tracking-wider mt-1">Venues</span>
        </Link>
        <Link className={cls("vendors", "/boutiques")} href="/boutiques">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("vendors", "/boutiques") ? "'FILL' 1" : "'FILL' 0" }}>group</span>
          <span className="text-[10px] uppercase tracking-wider mt-1">Vendors</span>
        </Link>
        <Link className={cls("photos", "/inspiration")} href="/inspiration">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("photos", "/inspiration") ? "'FILL' 1" : "'FILL' 0" }}>photo_library</span>
          <span className="text-[10px] uppercase tracking-wider mt-1">Photos</span>
        </Link>
        <Link className={cls("blogs", "/blogs")} href="/blogs">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive("blogs", "/blogs") ? "'FILL' 1" : "'FILL' 0" }}>auto_stories</span>
          <span className="text-[10px] uppercase tracking-wider mt-1">Blogs</span>
        </Link>
      </nav>
      {/* Contextual FAB */}
      <button className="mobile-menu-floating-action fixed bottom-20 right-6 z-40 md:hidden bg-secondary text-primary w-14 h-14 rounded-full shadow-2xl flex items-center justify-center group active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">magic_button</span>
      </button>
    </>
  );
}


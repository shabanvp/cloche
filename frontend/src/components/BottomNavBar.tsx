"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Home, ImageIcon, MapPin, Sparkles, Users } from "lucide-react";

type BottomNavBarProps = {
  activeTab?: "home" | "venues" | "vendors" | "photos" | "blogs";
};

export function BottomNavBar({ activeTab }: BottomNavBarProps = {}) {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup") return null;

  const isActive = (tab: string, href: string) => {
    if (activeTab) return activeTab === tab;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = [
    { tab: "home", label: "Home", href: "/", icon: Home },
    { tab: "venues", label: "Venues", href: "/venues", icon: MapPin },
    { tab: "vendors", label: "Vendors", href: "/boutiques", icon: Users },
    { tab: "photos", label: "Photos", href: "/inspiration", icon: ImageIcon },
    { tab: "blogs", label: "Blogs", href: "/blogs", icon: BookOpenText },
  ];

  return (
    <>
      <Link
        href="/search"
        className="mobile-menu-floating-action fixed bottom-[76px] md:bottom-8 right-6 md:right-8 z-50 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#D4B66E] hover:bg-[#C8A96A] text-[#0F4C45] shadow-[0_10px_24px_rgba(15,76,69,0.28)] hover:shadow-[0_12px_28px_rgba(15,76,69,0.35)] transition-all duration-300 active:scale-95 hover:scale-105"
        aria-label="Search wedding vendors"
      >
        <Sparkles className="h-6 w-6" strokeWidth={1.9} />
      </Link>
      <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 flex h-[64px] items-center justify-around bg-[#0F4C45] px-2 pb-[max(7px,env(safe-area-inset-bottom))] pt-2 text-white shadow-[0_-8px_24px_rgba(0,0,0,0.16)] md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.tab, item.href);

          return (
            <Link
              key={item.tab}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium uppercase leading-none transition-colors ${
                active ? "text-[#D4B66E]" : "text-white hover:text-[#D4B66E]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
              <span className="truncate text-[10px] leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

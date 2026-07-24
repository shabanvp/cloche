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
        className="mobile-menu-floating-action fixed bottom-[88px] right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4B66E] text-[#0F4C45] shadow-[0_10px_24px_rgba(15,76,69,0.28)] transition-transform active:scale-95 md:hidden"
        aria-label="Search wedding vendors"
      >
        <Sparkles className="h-7 w-7" strokeWidth={1.9} />
      </Link>
      <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 flex h-[76px] items-center justify-around bg-[#0F4C45] px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-3 text-white shadow-[0_-8px_24px_rgba(0,0,0,0.16)] md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.tab, item.href);

          return (
            <Link
              key={item.tab}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium uppercase leading-none transition-colors ${
                active ? "text-[#D4B66E]" : "text-white hover:text-[#D4B66E]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-[25px] w-[25px]" strokeWidth={2} />
              <span className="truncate text-[11px] leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

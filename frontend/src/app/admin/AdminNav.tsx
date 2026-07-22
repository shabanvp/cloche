"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export default function AdminNav({ items }: { items: AdminNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin/dashboard"
            ? pathname === "/admin" || pathname.startsWith("/admin/dashboard")
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-white/10 text-white border-l-2 border-gold"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4 opacity-70" /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

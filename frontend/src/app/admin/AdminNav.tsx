"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingBag, 
  LayoutTemplate,
  Tag,
  FileText,
  BookHeart,
  BarChart3, 
  CreditCard,
  Calendar,
  Megaphone,
  ShieldCheck
} from "lucide-react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Real Weddings", icon: BookHeart, href: "/admin/real-weddings" },
  { label: "Vendors", icon: Users, href: "/admin/vendors" },
  { label: "Marketing & Ads", icon: Megaphone, href: "/admin/marketing" },
  { label: "Collections", icon: ShoppingBag, href: "/admin/collections" },
  { label: "Homepage CMS", icon: LayoutTemplate, href: "/admin/homepage" },
  { label: "Categories", icon: Tag, href: "/admin/categories" },
  { label: "Content", icon: FileText, href: "/admin/content" },
  { label: "Appointments", icon: Calendar, href: "/admin/appointments" },
  { label: "Reports", icon: BarChart3, href: "/admin/reports" },
  { label: "Subscriptions", icon: CreditCard, href: "/admin/subscriptions" },
  { label: "System Control", icon: ShieldCheck, href: "/admin/system" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin" || item.href === "/admin/dashboard"
            ? pathname === "/admin" || pathname === "/admin/dashboard"
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

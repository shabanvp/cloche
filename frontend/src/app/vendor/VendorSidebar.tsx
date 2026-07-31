"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Tag, 
  Calendar, 
  Inbox, 
  BarChart3, 
  CreditCard,
  LogOut,
  Camera,
  Brush,
  MapPin,
  Sparkles,
  Shirt,
  Megaphone,
  Palette
} from "lucide-react";
import { useEffect, useState } from "react";
import { logout } from "@/app/actions/auth";

export function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/vendor/login" || pathname === "/vendor/register";

  const [vendorData, setVendorData] = useState<{ name: string; category: string; logo?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        const rawVenues = localStorage.getItem("cloche_registered_venues");
        const list: any[] = [];
        if (rawVendors) list.push(...JSON.parse(rawVendors));
        if (rawVenues) list.push(...JSON.parse(rawVenues));

        if (list.length > 0) {
          const active = list[0];
          setVendorData({
            name: active.boutique_name || active.name || active.businessName || "Vendor Dashboard",
            category: active.category || "Premium Partner",
            logo: active.logo || active.logo_url || active.profile_logo || active.image || "",
          });
          return;
        }
      } catch (e) {}
    }

    const cookies = document.cookie.split(';');
    const userDataCookie = cookies.find(c => c.trim().startsWith('user_data='));
    if (userDataCookie) {
      try {
        const decoded = decodeURIComponent(userDataCookie.split('=')[1]);
        const parsed = JSON.parse(decoded);
        setVendorData(parsed);
      } catch (e) {}
    }
  }, []);

  if (isAuthPage) return null;

  const category = vendorData?.category || "";
  const name = vendorData?.name || "Vendor Dashboard";
  const initial = name.charAt(0).toUpperCase();
  const logoUrl = vendorData?.logo || "";
  const isValidLogo = Boolean(
    logoUrl &&
      typeof logoUrl === "string" &&
      (logoUrl.startsWith("data:image/") || logoUrl.startsWith("http://") || logoUrl.startsWith("https://") || logoUrl.startsWith("/"))
  );

  const normCat = (category || "").toLowerCase().trim();
  const isVenue =
    normCat.includes("venue") ||
    normCat.includes("convention") ||
    normCat.includes("hall") ||
    name.toLowerCase().includes("venue") ||
    name.toLowerCase().includes("convention") ||
    name.toLowerCase().includes("centre") ||
    name.toLowerCase().includes("hall") ||
    !category ||
    category === "Premium Partner";

  // Base navigation items for all vendors
  let navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/vendor" },
    { label: "Profile", icon: Store, href: "/vendor/profile" },
    { label: isVenue ? "Customize Venue Store" : "Customize Store", icon: Palette, href: "/vendor/profile/customize" },
    { label: "Offers", icon: Tag, href: "/vendor/offers" },
    { label: "Appointments", icon: Calendar, href: "/vendor/appointments" },
    { label: "Enquiries", icon: Inbox, href: "/vendor/enquiries" },
  ];

  // Category specific modules
  if (normCat.includes("bridal") || normCat.includes("groom")) {
    navItems.splice(1, 0, { label: "Collections", icon: Shirt, href: "/vendor/collections" });
  } else if (normCat.includes("photo") || normCat.includes("video")) {
    navItems.splice(1, 0, { label: "Portfolio", icon: Camera, href: "/vendor/collections" });
  } else if (normCat.includes("makeup") || normCat.includes("mehendi")) {
    navItems.splice(1, 0, { label: "Bridal Packages", icon: Brush, href: "/vendor/collections" });
  } else if (isVenue) {
    navItems.splice(1, 0, { label: "Halls & Pricing", icon: MapPin, href: "/vendor/collections" });
  } else if (normCat.includes("decor")) {
    navItems.splice(1, 0, { label: "Themes & Gallery", icon: Sparkles, href: "/vendor/collections" });
  } else {
    navItems.splice(1, 0, { label: "Portfolio", icon: ShoppingBag, href: "/vendor/collections" });
  }

  // Common items at the end
  navItems.push(
    { label: "Marketing & Ads", icon: Megaphone, href: "/vendor/marketing" },
    { label: "Analytics", icon: BarChart3, href: "/vendor/analytics" },
    { label: "Subscription", icon: CreditCard, href: "/vendor/subscription" }
  );

  const handleLogout = async () => {
    await logout();
    router.push("/vendor/login");
  };



  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden sticky top-24">
        {/* Boutique summary */}
        <div className="p-6 border-b border-gold/10 bg-charcoal text-white text-center">
          <div className="w-16 h-16 rounded-full bg-ivory text-charcoal flex items-center justify-center mx-auto mb-3 text-2xl font-display shadow-md overflow-hidden relative border-2 border-gold/30">
            {isValidLogo ? (
              <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <h2 className="font-display text-lg font-medium">{name}</h2>
          <p className="text-xs text-white/60">{category || "Premium Partner"}</p>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-emerald text-white" 
                    : "text-charcoal hover:bg-emerald/10 hover:text-emerald"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-70"}`} /> {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gold/10">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

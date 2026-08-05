"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Store, 
  Tag, 
  Calendar, 
  Inbox, 
  LogOut, 
  Shirt, 
  Camera, 
  Brush, 
  MapPin, 
  Sparkles, 
  ShoppingBag, 
  BarChart3, 
  CreditCard,
  Palette,
  Package,
  Layers
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { getCategoryMenuTitles } from "@/lib/vendor-navigation";

export function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === "/vendor/login" || pathname === "/vendor/register";
  const [vendorData, setVendorData] = useState<{ name: string; category: string; logo?: string; plan?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedName =
          localStorage.getItem("boutique_name") ||
          localStorage.getItem("vendor_name") ||
          localStorage.getItem("businessName") ||
          localStorage.getItem("user_name");

        const rawUserData = localStorage.getItem("cloche_user_data");
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        const rawVenues = localStorage.getItem("cloche_registered_venues");

        let resolvedName = storedName || "";
        let resolvedCategory = "Bridal Wear";
        let resolvedLogo = "";
        let resolvedPlan = "Premium Partner";

        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          resolvedName = u.boutique_name || u.businessName || u.name || u.full_name || resolvedName;
          resolvedCategory = u.category || resolvedCategory;
          resolvedLogo = u.logo || u.logo_url || u.image_url || resolvedLogo;
          resolvedPlan = u.plan || resolvedPlan;
        } else if (rawVendors) {
          const list = JSON.parse(rawVendors);
          if (list.length > 0) {
            const active = list[0];
            resolvedName = active.boutique_name || active.name || active.businessName || resolvedName;
            resolvedCategory = active.category || resolvedCategory;
            resolvedLogo = active.logo || active.logo_url || active.image_url || resolvedLogo;
            resolvedPlan = active.plan || resolvedPlan;
          }
        } else if (rawVenues) {
          const list = JSON.parse(rawVenues);
          if (list.length > 0) {
            const active = list[0];
            resolvedName = active.boutique_name || active.name || active.businessName || resolvedName;
            resolvedCategory = active.category || "Wedding Venue";
            resolvedLogo = active.logo || active.logo_url || active.image_url || resolvedLogo;
            resolvedPlan = active.plan || resolvedPlan;
          }
        }

        if (!resolvedName) {
          resolvedName = "Cloche Partner Store";
        }

        setVendorData({
          name: resolvedName,
          category: resolvedCategory,
          logo: resolvedLogo,
          plan: resolvedPlan,
        });
      } catch (e) {}
    }
  }, []);

  if (isAuthPage) return null;

  const category = vendorData?.category || "";
  const name = vendorData?.name || "Vendor Dashboard";
  const initial = name.charAt(0).toUpperCase();
  const logoUrl = vendorData?.logo || "";
  const plan = vendorData?.plan || "Premium Partner";
  const isValidLogo = Boolean(
    logoUrl &&
      typeof logoUrl === "string" &&
      (logoUrl.startsWith("data:image/") || logoUrl.startsWith("http://") || logoUrl.startsWith("https://") || logoUrl.startsWith("/"))
  );

  const titles = getCategoryMenuTitles(category);

  // Clean, essential navigation items
  const navItems = [
    { label: "Navigation Hub", icon: Layers, href: "/vendor" },
    { label: "Overview", icon: LayoutDashboard, href: "/vendor/overview" },
    { label: "Profile", icon: Store, href: "/vendor/profile" },
    { label: titles.mediaTitle, icon: ShoppingBag, href: "/vendor/collections" },
    { label: titles.pricingTitle, icon: Package, href: "/vendor/packages" },
    { label: "Appointments", icon: Calendar, href: "/vendor/appointments" },
    { label: "Enquiries", icon: Inbox, href: "/vendor/enquiries" },
    { label: "Offers", icon: Tag, href: "/vendor/offers" },
    { label: "Analytics", icon: BarChart3, href: "/vendor/analytics" },
    { label: "Subscription", icon: CreditCard, href: "/vendor/subscription" },
    { label: "Customize Store", icon: Palette, href: "/vendor/customize-store" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/vendor/login");
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden sticky top-24">
        
        {/* Vendor Header Profile Info */}
        <div className="p-6 border-b border-gold/10 bg-[#FAF7F2]/60 text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden border-2 border-gold/20 bg-white shadow-sm">
            {isValidLogo ? (
              <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#0F4C45] text-white text-2xl font-bold font-serif flex items-center justify-center">
                {initial}
              </div>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-charcoal truncate px-2">{name}</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/60 mt-0.5">{category || "Vendor Partner"}</p>
          
          <span className="inline-block bg-[#0F4C45] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full mt-2 shadow-xs">
            {plan}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/vendor" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#0F4C45] text-white shadow-sm"
                    : "text-charcoal/70 hover:bg-[#FAF7F2] hover:text-[#0F4C45]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-charcoal/50"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 mt-2 border-t border-gold/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>

      </div>
    </aside>
  );
}

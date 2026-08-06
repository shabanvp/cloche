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
  ShoppingBag, 
  BarChart3, 
  CreditCard,
  Palette,
  Package,
  Layers,
  Star,
  Sparkles,
  MessageSquare,
  HelpCircle,
  FolderKanban
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
        const list = [];
        const rawVendors = localStorage.getItem("cloche_registered_vendors");
        const rawUserData = localStorage.getItem("cloche_user_data");
        
        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          setVendorData({
            name: u.full_name || u.name || u.boutique_name || "Dream Wedding Studio",
            category: u.category || "Photography",
            logo: u.logo || u.logo_url || u.image_url,
            plan: u.plan || "Premium Partner",
          });
          return;
        }

        if (rawVendors) list.push(...JSON.parse(rawVendors));
        
        if (list.length > 0) {
          const active = list[0];
          setVendorData({
            name: active.boutique_name || active.name || active.businessName || "Dream Wedding Studio",
            category: active.category || "Photography",
            logo: active.logo || active.logo_url || active.image_url,
            plan: active.plan || "Premium Partner",
          });
        }
      } catch (e) {}
    }
  }, []);

  if (isAuthPage) return null;

  const category = vendorData?.category || "Photography";
  const name = vendorData?.name || "Dream Wedding Studio";
  const initial = name.charAt(0).toUpperCase();
  const logoUrl = vendorData?.logo || "";
  const plan = vendorData?.plan || "Premium Partner";
  const isValidLogo = Boolean(
    logoUrl &&
      typeof logoUrl === "string" &&
      (logoUrl.startsWith("data:image/") || logoUrl.startsWith("http://") || logoUrl.startsWith("https://") || logoUrl.startsWith("/"))
  );

  const titles = getCategoryMenuTitles(category);

  // Desktop Navigation Items matching design spec
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/vendor/overview" },
    { label: "Profile", icon: Store, href: "/vendor/profile" },
    { label: "Services", icon: ShoppingBag, href: "/vendor/services" },
    { label: "Packages", icon: Package, href: "/vendor/packages" },
    { label: "Gallery", icon: Layers, href: "/vendor/collections" },
    { label: "Portfolio", icon: FolderKanban, href: "/vendor/collections#portfolio" },
    { label: "Pricing", icon: CreditCard, href: "/vendor/packages#pricing" },
    { label: "Offers", icon: Tag, href: "/vendor/offers" },
    { label: "Leads", icon: Inbox, href: "/vendor/enquiries" },
    { label: "Reviews", icon: MessageSquare, href: "/vendor/overview#reviews" },
    { label: "Advertising", icon: Sparkles, href: "/vendor/marketing" },
    { label: "Analytics", icon: BarChart3, href: "/vendor/analytics" },
    { label: "Settings", icon: Palette, href: "/vendor/customize-store" },
    { label: "Support", icon: HelpCircle, href: "/contact" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/vendor/login");
  };

  return (
    <aside className="w-full lg:w-[280px] shrink-0 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-gold/15 overflow-hidden sticky top-24">
        
        {/* Vendor Header Profile Info */}
        <div className="p-6 border-b border-gold/15 bg-[#FAF7F2]/80 text-center relative">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden border-2 border-gold/30 bg-white shadow-md">
            {isValidLogo ? (
              <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#0F4C45] text-white text-2xl font-bold font-serif flex items-center justify-center">
                {initial}
              </div>
            )}
          </div>

          <h3 className="font-display font-bold text-lg text-charcoal truncate px-2">{name}</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/60 mt-0.5">{category}</p>
          
          {/* Premium Badge */}
          <div className="mt-2.5 flex items-center justify-center gap-1">
            <span className="inline-flex items-center gap-1 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
              <Star className="w-3 h-3 fill-[#C8A96A] text-[#C8A96A]" /> {plan}
            </span>
          </div>

          {/* Profile Completion Bar */}
          <div className="mt-4 pt-3 border-t border-gold/10">
            <div className="flex items-center justify-between text-[11px] font-bold text-charcoal/70 mb-1.5">
              <span>Profile Completion</span>
              <span className="text-[#0F4C45]">92%</span>
            </div>
            <div className="w-full bg-gold/20 h-2 rounded-full overflow-hidden">
              <div className="bg-[#0F4C45] h-full rounded-full w-[92%] transition-all duration-500"></div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/vendor" && pathname.startsWith(item.href.split('#')[0]));
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
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
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

      </div>
    </aside>
  );
}

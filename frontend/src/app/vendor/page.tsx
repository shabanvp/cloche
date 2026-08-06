"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Package, 
  Calendar, 
  Inbox, 
  Tag, 
  BarChart3, 
  CreditCard, 
  Palette, 
  LogOut, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { getCategoryMenuTitles } from "@/lib/vendor-navigation";
import { logout } from "@/app/actions/auth";
import VendorOverviewPage from "./overview/page";

export default function VendorProfileMenuPage() {
  const router = useRouter();
  const [vendorData, setVendorData] = useState<{
    name: string;
    category: string;
    logo?: string;
    plan?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawUserData = localStorage.getItem("cloche_user_data");
        const rawVendors = localStorage.getItem("cloche_registered_vendors");

        if (rawUserData) {
          const u = JSON.parse(rawUserData);
          setVendorData({
            name: u.full_name || u.name || u.boutique_name || "Vendor Partner",
            category: u.category || "Bridal Wear",
            logo: u.logo || u.logo_url || u.image_url,
            plan: u.plan || "Premium Partner",
          });
          return;
        }

        if (rawVendors) {
          const list = JSON.parse(rawVendors);
          if (list.length > 0) {
            const active = list[0];
            setVendorData({
              name: active.boutique_name || active.name || active.businessName || "Vendor Partner",
              category: active.category || "Bridal Wear",
              logo: active.logo || active.logo_url || active.image_url,
              plan: active.plan || "Premium Partner",
            });
          }
        }
      } catch (e) {}
    }
  }, []);

  const name = vendorData?.name || "Vendor Partner";
  const category = vendorData?.category || "Bridal Wear";
  const logoUrl = vendorData?.logo || "";
  const plan = vendorData?.plan || "Premium Partner";
  const initial = name.charAt(0).toUpperCase();

  const isValidLogo = Boolean(
    logoUrl &&
      typeof logoUrl === "string" &&
      (logoUrl.startsWith("data:image/") || logoUrl.startsWith("http://") || logoUrl.startsWith("https://") || logoUrl.startsWith("/"))
  );

  const titles = getCategoryMenuTitles(category);

  // Essential navigation items only
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/vendor/overview", desc: "Business summary & recent activity" },
    { label: "Profile", icon: Store, href: "/vendor/profile", desc: "Business details, contact & working hours" },
    { label: titles.mediaTitle, icon: ShoppingBag, href: "/vendor/collections", desc: titles.mediaSubtitle },
    { label: titles.pricingTitle, icon: Package, href: "/vendor/packages", desc: titles.pricingSubtitle },
    { label: "Appointments", icon: Calendar, href: "/vendor/appointments", desc: "Manage bookings & customer visits" },
    { label: "Enquiries", icon: Inbox, href: "/vendor/enquiries", desc: "View & respond to customer leads" },
    { label: "Offers", icon: Tag, href: "/vendor/offers", desc: "Manage promotional discounts & deals" },
    { label: "Analytics", icon: BarChart3, href: "/vendor/analytics", desc: "Profile views & performance insights" },
    { label: "Subscription", icon: CreditCard, href: "/vendor/subscription", desc: "Manage current plan & billing" },
    { label: "Customize Store", icon: Palette, href: "/vendor/customize-store", desc: "Logo, cover image & store branding" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/vendor/login");
  };

  return (
    <>
      {/* Mobile View (<1024px): Preserved Mobile Profile Navigation Screen */}
      <div className="block lg:hidden max-w-md mx-auto animate-in fade-in duration-500 font-sans">
        <div className="bg-white rounded-3xl shadow-sm border border-gold/15 overflow-hidden">
          {/* Vendor Profile Header */}
          <div className="p-8 border-b border-gold/15 bg-[#FAF7F2]/80 text-center relative">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-gold/30 bg-white shadow-md">
              {isValidLogo ? (
                <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#0F4C45] text-white text-3xl font-bold font-serif flex items-center justify-center">
                  {initial}
                </div>
              )}
            </div>

            <h1 className="font-display font-bold text-2xl text-charcoal truncate px-2">{name}</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/60 mt-1">{category || "Vendor Partner"}</p>
            
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <span className="inline-flex items-center gap-1 bg-[#0F4C45] text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" /> {plan}
              </span>
            </div>
          </div>

          {/* Menu Options List */}
          <div className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#FAF7F2] text-charcoal transition-all group border border-transparent hover:border-gold/15"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0 group-hover:bg-[#0F4C45] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-charcoal group-hover:text-[#0F4C45] transition-colors">{item.label}</h3>
                      <p className="text-[11px] text-charcoal/50">{item.desc}</p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-charcoal/30 group-hover:text-[#0F4C45] group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              );
            })}

            <div className="pt-3 mt-3 border-t border-gold/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-100/60 text-red-600 flex items-center justify-center shrink-0">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold">Sign Out</h3>
                    <p className="text-[11px] text-red-500/80">Log out of your vendor account</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View (>=1024px): SaaS Overview Dashboard */}
      <div className="hidden lg:block">
        <VendorOverviewPage />
      </div>
    </>
  );
}

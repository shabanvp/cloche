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
  ArrowRight,
  ShieldCheck,
  Building2
} from "lucide-react";
import { getCategoryMenuTitles } from "@/lib/vendor-navigation";
import { logout } from "@/app/actions/auth";

export default function VendorNavigationHub() {
  const router = useRouter();
  const [vendorData, setVendorData] = useState<{
    name: string;
    category: string;
    logo?: string;
    cover?: string;
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
            cover: u.coverImage || u.cover_image,
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
              cover: active.coverImage || active.cover_image,
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

  // Dedicated menu items for Navigation Hub
  const menuCards = [
    {
      title: "Overview",
      subtitle: "Business summary, statistics & recent activity",
      href: "/vendor/overview",
      icon: LayoutDashboard,
      color: "bg-[#0F4C45]/10 text-[#0F4C45]",
    },
    {
      title: "Profile",
      subtitle: "Business details, contact info, about & working hours",
      href: "/vendor/profile",
      icon: Store,
      color: "bg-amber-500/10 text-amber-700",
    },
    {
      title: titles.mediaTitle,
      subtitle: titles.mediaSubtitle,
      href: "/vendor/collections",
      icon: ShoppingBag,
      color: "bg-purple-500/10 text-purple-700",
    },
    {
      title: titles.pricingTitle,
      subtitle: titles.pricingSubtitle,
      href: "/vendor/packages",
      icon: Package,
      color: "bg-blue-500/10 text-blue-700",
    },
    {
      title: "Appointments",
      subtitle: "Manage customer visits, fittings & bookings",
      href: "/vendor/appointments",
      icon: Calendar,
      color: "bg-orange-500/10 text-orange-700",
    },
    {
      title: "Enquiries",
      subtitle: "View & respond to customer leads & inquiries",
      href: "/vendor/enquiries",
      icon: Inbox,
      color: "bg-teal-500/10 text-teal-700",
    },
    {
      title: "Offers",
      subtitle: "Create & manage promotional discounts & deals",
      href: "/vendor/offers",
      icon: Tag,
      color: "bg-rose-500/10 text-rose-700",
    },
    {
      title: "Analytics",
      subtitle: "Profile views, enquiry rates & performance insights",
      href: "/vendor/analytics",
      icon: BarChart3,
      color: "bg-indigo-500/10 text-indigo-700",
    },
    {
      title: "Subscription",
      subtitle: "Current active plan, badge status & billing history",
      href: "/vendor/subscription",
      icon: CreditCard,
      color: "bg-[#0F4C45]/10 text-[#0F4C45]",
    },
    {
      title: "Customize Store",
      subtitle: "Logo, cover image, store description & branding",
      href: "/vendor/customize-store",
      icon: Palette,
      color: "bg-emerald-500/10 text-emerald-700",
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/vendor/login");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto p-4 sm:p-6 font-sans">
      
      {/* 1. Vendor Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 z-10">
          
          {/* Profile Image / Logo */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-gold/20 bg-ivory overflow-hidden shadow-md shrink-0 flex items-center justify-center">
            {isValidLogo ? (
              <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#0F4C45] text-white text-3xl font-bold font-serif flex items-center justify-center">
                {initial}
              </div>
            )}
          </div>

          {/* Business Details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="bg-gold/15 text-[#0F4C45] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {category || "Wedding Vendor"}
              </span>
              <span className="bg-[#0F4C45] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3 h-3 text-gold" /> {plan}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-charcoal">{name}</h1>
            <p className="text-xs sm:text-sm text-charcoal/70 max-w-md leading-relaxed">
              Vendor Navigation Hub. Select any menu option below to manage your store, profile, portfolio, or inquiries.
            </p>
          </div>

        </div>
      </div>

      {/* 2. Navigation Menu Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold text-charcoal border-b border-gold/10 pb-2">
          Vendor Navigation Menu
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {menuCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                href={card.href}
                className="bg-white rounded-2xl p-6 border border-gold/15 shadow-sm hover:shadow-md hover:border-[#0F4C45]/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-charcoal/30 group-hover:text-[#0F4C45] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-charcoal group-hover:text-[#0F4C45] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-charcoal/60 mt-1 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gold/10 flex items-center justify-between text-xs font-bold text-[#0F4C45]">
                  <span>Open Page</span>
                  <span className="text-[10px] uppercase tracking-wider bg-ivory px-2.5 py-1 rounded-md border border-gold/15">
                    View
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 3. Sign Out Footer Action */}
      <div className="pt-6 border-t border-gold/15 flex justify-center">
        <button
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-600" /> Sign Out of Vendor Dashboard
        </button>
      </div>

    </div>
  );
}

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
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity, clearActiveVendorIdentity, calculateDynamicProfileCompletion } from "@/lib/vendorStore";

export function VendorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === "/vendor/login" || pathname === "/vendor/register";
  const [vendorData, setVendorData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [completionPercentage, setCompletionPercentage] = useState<number | null>(null);

  const loadVendorProfile = async () => {
    const cached = getActiveVendorIdentity();
    if (cached && cached.id) {
      setVendorData(cached);
      setCompletionPercentage(cached.profile_completion_percentage || null);
    }

    try {
      const identity = await fetchAuthenticatedVendorFromDb();
      if (identity && identity.id) {
        setVendorData(identity);

        let servicesCount = 0;
        let packagesCount = 0;
        let galleryCount = 0;

        try {
          const rawServices = localStorage.getItem("cloche_vendor_services");
          if (rawServices) servicesCount = JSON.parse(rawServices).length;
          const rawPackages = localStorage.getItem("cloche_vendor_packages");
          if (rawPackages) packagesCount = JSON.parse(rawPackages).length;
          const rawGallery = localStorage.getItem("cloche_vendor_gallery");
          if (rawGallery) galleryCount = JSON.parse(rawGallery).length;
        } catch (e) {}

        const calculated = calculateDynamicProfileCompletion(identity, servicesCount, packagesCount, galleryCount);
        setCompletionPercentage(calculated);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVendorProfile();

    const handleVendorUpdate = () => {
      loadVendorProfile();
    };

    window.addEventListener("storage", handleVendorUpdate);
    window.addEventListener("cloche_vendor_updated", handleVendorUpdate);
    window.addEventListener("cloche_cms_update", handleVendorUpdate);

    return () => {
      window.removeEventListener("storage", handleVendorUpdate);
      window.removeEventListener("cloche_vendor_updated", handleVendorUpdate);
      window.removeEventListener("cloche_cms_update", handleVendorUpdate);
    };
  }, []);

  if (isAuthPage) return null;

  const hasVendorRecord = Boolean(vendorData && vendorData.id);
  const category = vendorData?.category || "";
  const name = hasVendorRecord
    ? (vendorData?.name || vendorData?.boutique_name || "Vendor Partner")
    : (isLoading ? "" : "No vendor profile found");
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const logoUrl = vendorData?.logo || vendorData?.logo_url || "";
  const plan = vendorData?.plan || "Vendor Partner";
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
    clearActiveVendorIdentity();
    await logout();
    router.push("/vendor/login");
  };

  return (
    <aside className="w-full lg:w-[280px] shrink-0 font-sans">
      <div className="bg-white rounded-2xl shadow-sm border border-gold/15 overflow-hidden sticky top-24">
        
        {/* Vendor Header Profile Info */}
        <div className="p-6 border-b border-gold/15 bg-[#FAF7F2]/80 text-center relative">
          {isLoading && !hasVendorRecord ? (
            /* Loading Skeleton State */
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gold/20 mb-3" />
              <div className="h-5 w-32 bg-gold/20 rounded mb-2" />
              <div className="h-3 w-20 bg-gold/15 rounded mb-4" />
              <div className="w-full bg-gold/15 h-2 rounded-full mt-2" />
            </div>
          ) : (
            <>
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
              {category && <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/60 mt-0.5">{category}</p>}
              
              {/* Premium Badge */}
              <div className="mt-2.5 flex items-center justify-center gap-1">
                <span className="inline-flex items-center gap-1 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                  <Star className="w-3 h-3 fill-[#C8A96A] text-[#C8A96A]" /> {plan}
                </span>
              </div>

              {/* Profile Completion Bar */}
              {completionPercentage !== null && (
                <div className="mt-4 pt-3 border-t border-gold/10">
                  <div className="flex items-center justify-between text-[11px] font-bold text-charcoal/70 mb-1.5">
                    <span>Profile Completion</span>
                    <span className="text-[#0F4C45]">{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gold/20 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#0F4C45] h-full rounded-full transition-all duration-500" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          )}
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

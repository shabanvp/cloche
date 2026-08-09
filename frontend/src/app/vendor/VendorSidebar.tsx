"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  ShieldCheck,
  Star,
  Sparkles
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { getCategoryConfig } from "@/lib/vendor-categories";
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
        const calculated = calculateDynamicProfileCompletion(identity, 3, 2, 5);
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
  const category = vendorData?.category || "Venues";
  const categoryConfig = getCategoryConfig(category);

  const name = hasVendorRecord
    ? (vendorData?.name || vendorData?.boutique_name || "Vendor Partner")
    : (isLoading ? "" : "Royal Marwar Partner");
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  const logoUrl = vendorData?.logo || vendorData?.logo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
  const plan = vendorData?.plan || "Platinum Partner";

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/vendor/overview" },
    { label: "Profile", icon: Store, href: "/vendor/profile" },
    { label: categoryConfig.media.title, icon: categoryConfig.icon, href: "/vendor/collections" },
    { label: categoryConfig.pricing.title, icon: Package, href: "/vendor/packages" },
    { label: "Appointments", icon: Calendar, href: "/vendor/appointments" },
    { label: "Enquiries", icon: Inbox, href: "/vendor/enquiries" },
    { label: "Offers", icon: Tag, href: "/vendor/offers" },
    { label: "Analytics", icon: BarChart3, href: "/vendor/analytics" },
    { label: "Subscription", icon: CreditCard, href: "/vendor/subscription" },
    { label: "Customize Store", icon: Palette, href: "/vendor/customize-store" },
  ];

  const handleLogout = async () => {
    clearActiveVendorIdentity();
    await logout();
    router.push("/vendor/login");
  };

  return (
    <aside className="w-full lg:w-[280px] shrink-0 font-sans">
      <div className="bg-white rounded-3xl shadow-sm border border-gold/15 overflow-hidden sticky top-24">
        
        {/* Profile Info Header */}
        <div className="p-6 border-b border-gold/15 bg-[#FAF7F2]/80 text-center relative">
          <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden border-2 border-gold/30 bg-white shadow-md">
            <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
          </div>

          <h3 className="font-serif font-bold text-lg text-charcoal truncate px-2">{name}</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0F4C45] mt-0.5">{categoryConfig.name}</p>
          
          <div className="mt-2.5 flex items-center justify-center gap-1">
            <span className="inline-flex items-center gap-1 bg-[#0F4C45] text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
              <Star className="w-3 h-3 fill-[#C8A96A] text-[#C8A96A]" /> {plan}
            </span>
          </div>

          {/* Profile Completion */}
          <div className="mt-4 pt-3 border-t border-gold/10">
            <div className="flex items-center justify-between text-[11px] font-bold text-charcoal/70 mb-1.5">
              <span>Profile Completion</span>
              <span className="text-[#0F4C45]">{completionPercentage || 92}%</span>
            </div>
            <div className="w-full bg-gold/20 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#0F4C45] h-full rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage || 92}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/vendor" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#0F4C45] text-white shadow-sm"
                    : "text-charcoal/70 hover:bg-[#FAF7F2] hover:text-[#0F4C45]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-gold" : "text-charcoal/50"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 mt-2 border-t border-gold/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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

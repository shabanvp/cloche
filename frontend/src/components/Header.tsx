"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MessageSquare, Edit3, Smartphone, Menu, X, ChevronDown,
  Home, MapPin, Store, BookHeart, FileText, Mail,
  Lightbulb, Info, CircleHelp, ArrowRight, Users, MessageCircle, CheckCircle2, Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAuthenticatedVendorFromDb, getActiveVendorIdentity } from "@/lib/vendorStore";

type HeaderProps = {
  session?: { token: string; role?: string } | null;
};

export function Header({ session }: HeaderProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isMobileMenuOpen);

    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";

      return () => {
        document.body.classList.remove("mobile-menu-open");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const updateUnread = () => {
      try {
        fetch("/api/v1/messages")
          .then((r) => r.json())
          .then((res) => {
            if (res?.success && typeof res.data?.totalUnread === "number") {
              setUnreadCount(res.data.totalUnread);
            }
          })
          .catch(() => {});
      } catch (e) {}
    };

    updateUnread();
    window.addEventListener("cloche_messages_updated", updateUnread);
    return () => window.removeEventListener("cloche_messages_updated", updateUnread);
  }, []);

  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const { getWishlistItems } = require("@/lib/wishlistStore");
        setWishlistCount(getWishlistItems().length);
      } catch (e) {}
    };

    try {
      const { syncWishlistWithServer } = require("@/lib/wishlistStore");
      syncWishlistWithServer().then(updateCount);
    } catch (e) {
      updateCount();
    }

    window.addEventListener("cloche_wishlist_updated", updateCount);
    return () => window.removeEventListener("cloche_wishlist_updated", updateCount);
  }, []);

  const [vendorState, setVendorState] = useState<{
    name: string;
    category: string;
    logo: string;
    coverImage?: string;
    isVerified?: boolean;
    isVendor: boolean;
  }>({
    name: "",
    category: "",
    logo: "",
    coverImage: "",
    isVerified: false,
    isVendor: false,
  });

  useEffect(() => {
    let isMounted = true;

    const applyVendorData = (identity: any) => {
      if (!isMounted || !identity) return;
      const bName = identity.name || identity.boutique_name || identity.business_name || "";
      if (bName) {
        setVendorState({
          name: bName,
          category: identity.category || "Wedding Services",
          logo: identity.logo || identity.logo_url || "",
          coverImage: identity.coverImage || identity.cover_image || "",
          isVerified: Boolean(identity.isVerified || identity.is_verified),
          isVendor: true,
        });
      }
    };

    // 1. Initial cached vendor check (synchronous)
    const cached = getActiveVendorIdentity();
    if (cached && (cached.name || cached.boutique_name)) {
      applyVendorData(cached);
    }

    // 2. Fetch authenticated vendor's live database record
    fetchAuthenticatedVendorFromDb().then((identity) => {
      if (identity && (identity.name || identity.boutique_name)) {
        applyVendorData(identity);
      } else {
        // If no vendor record returned, check if authenticated customer
        fetch("/api/v1/auth/me")
          .then((res) => (res.ok ? res.json() : null))
          .then((json) => {
            if (json?.data?.user && isMounted) {
              const u = json.data.user;
              const isVendorRole = u.roles?.includes("vendor") || u.roles?.includes("partner") || u.role === "vendor";
              setVendorState({
                name: u.fullName || u.email?.split("@")[0] || "",
                category: isVendorRole ? "Wedding Services" : "Member",
                logo: u.avatarUrl || u.avatar || "",
                isVerified: Boolean(u.isEmailVerified),
                isVendor: isVendorRole,
              });
            }
          })
          .catch(() => {});
      }
    });

    // 3. Listen for live profile updates across dashboard
    const handleProfileUpdate = (e: any) => {
      if (e?.detail) {
        applyVendorData(e.detail);
      } else {
        fetchAuthenticatedVendorFromDb().then(applyVendorData);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("cloche_vendor_profile_updated", handleProfileUpdate);
    }

    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("cloche_vendor_profile_updated", handleProfileUpdate);
      }
    };
  }, [session]);

  if (isAuthRoute) return null;

  let profileLink = "/dashboard";
  if (vendorState.isVendor || session?.role === "vendor" || session?.role === "partner") {
    profileLink = "/vendor";
  } else if (session?.role === "admin") {
    profileLink = "/admin";
  }

  const browseLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Messages", href: "/messages", icon: MessageSquare },
    { label: "Venues", href: "/venues", icon: MapPin },
    { label: "Vendors", href: "/boutiques", icon: Users },
    { label: "Inspiration", href: "/inspiration", icon: Lightbulb },
    { label: "Real Weddings", href: "/real-weddings", icon: BookHeart },
    { label: "Deals", href: "/deals", icon: Sparkles },
    { label: "Aura AI Assistant", href: "/genie", icon: Sparkles },
  ];

  const companyLinks = [
    { label: "About Cloche", href: "/about", icon: Info },
    { label: "For Vendors", href: "/partner", icon: Store },
    { label: "Contact Us", href: "/contact", icon: Mail },
    { label: "Help & Support", href: "/contact", icon: CircleHelp },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isVendorSession = session?.role === "vendor" || session?.role === "partner";

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const MobileMenuLink = ({ item, index }: {
    item: { label: string; href: string; icon: React.ElementType };
    index: number;
  }) => {
    const Icon = item.icon;
    const active = isActiveLink(item.href);

    return (
      <Link
        href={item.href}
        className={`group flex min-h-12 items-center gap-5 rounded-2xl px-3 py-3 transition-all duration-200 ${
          active
            ? "bg-[#123f3a] text-[#F7F3EC] shadow-[inset_3px_0_0_#C8A96A]"
            : "text-[#F7F3EC]/90 hover:bg-white/7 hover:text-[#F7F3EC]"
        }`}
        style={{ animationDelay: `${index * 32}ms` }}
        onClick={closeMobileMenu}
      >
        <Icon className="h-5 w-5 shrink-0 text-[#C8A96A] transition-transform duration-200 group-hover:scale-105" strokeWidth={1.7} />
        <span className="font-sans text-[15px] leading-5 tracking-normal">{item.label}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col shadow-md">
      {/* Top Bar (Hidden on Mobile) */}
      <div className="hidden md:flex justify-between items-center px-4 sm:px-6 lg:px-10 xl:px-12 py-2 text-xs lg:text-sm bg-[#0B3B2D] text-white border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-gray-300">Kerala&apos;s Favourite Wedding Planning Platform</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/review" className="flex items-center gap-2 hover:text-gold transition-colors">
            <Edit3 className="w-4 h-4" />
            <span>Write A Review</span>
          </Link>
          <Link href="/download" className="flex items-center gap-2 hover:text-gold transition-colors">
            <Smartphone className="w-4 h-4" />
            <span>Download App</span>
          </Link>
        </div>
      </div>

      {/* Main Nav - Same dark green header for all pages */}
      <div className="relative flex justify-between items-center px-4 sm:px-6 lg:px-10 xl:px-12 py-2.5 md:py-4 bg-primary text-white">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-11 h-10 md:w-[55px] md:h-[48px] lg:w-[65px] lg:h-[52px] xl:w-[70px] xl:h-[56px]">
            <img src="/logo.png" alt="Cloche Logo" className="absolute inset-0 w-full h-full object-contain scale-[1.75] md:scale-[1.8] lg:scale-[1.9] drop-shadow-sm origin-center" />
          </div>
          <span className="block font-display text-[20px] md:text-2xl lg:text-[28px] font-bold tracking-wide mt-0.5 md:mt-1">Cloche</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 font-semibold text-[14px] xl:text-[15px]">
          <Link href="/venues" className={`transition-colors ${isActiveLink("/venues") ? "text-gold font-bold" : "hover:text-gold"}`}>Venues</Link>
          <Link href="/boutiques" className={`transition-colors ${isActiveLink("/boutiques") ? "text-gold font-bold" : "hover:text-gold"}`}>Vendors</Link>
          <Link href="/inspiration" className={`transition-colors ${isActiveLink("/inspiration") ? "text-gold font-bold" : "hover:text-gold"}`}>Inspiration</Link>
          <Link href="/real-weddings" className={`transition-colors ${isActiveLink("/real-weddings") ? "text-gold font-bold" : "hover:text-gold"}`}>Real Weddings</Link>
          <Link href="/deals" className={`transition-colors ${isActiveLink("/deals") ? "text-gold font-bold" : "hover:text-gold"}`}>Deals</Link>
          <Link 
            href="/genie" 
            className={`transition-colors inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-gold/30 bg-white/5 hover:bg-white/10 ${
              isActiveLink("/genie") || isActiveLink("/aura") ? "text-gold font-bold border-gold shadow-xs" : "text-white/90 hover:text-gold"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>Aura</span>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          <Link
            href="/messages"
            className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Messages & Vendor Enquiries"
            title="Messages & Vendor Enquiries"
          >
            <MessageSquare className="w-[17px] h-[17px] lg:w-5 lg:h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C8A96A] shadow-[0_0_0_2px_#0F4C45]" />
            )}
          </Link>
          
          {session ? (
            <Link href={profileLink} className="hidden md:flex bg-[#12584C] hover:bg-[#186f61] border border-[#1d796b] px-6 py-2 lg:px-8 lg:py-2.5 rounded-full font-semibold transition-colors text-sm lg:text-[15px]">
              Profile
            </Link>
          ) : (
            <Link href="/login" className="hidden md:flex bg-[#12584C] hover:bg-[#186f61] border border-[#1d796b] px-6 py-2 lg:px-8 lg:py-2.5 rounded-full font-semibold transition-colors text-sm lg:text-[15px]">
              Log In
            </Link>
          )}

          <button 
            className="lg:hidden text-white hover:text-gold transition-colors"
            aria-label="Open navigation menu"
            onClick={() => {
              setIsMobileMenuOpen(true);
            }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu (Drawer) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/65 backdrop-blur-[2px] transition-opacity duration-300" 
            onClick={closeMobileMenu}
          ></div>
          
          {/* Sidebar */}
          <div className="relative flex h-[100dvh] w-[76vw] max-w-[340px] flex-col overflow-hidden bg-[#0B3B36] text-[#F7F3EC] shadow-[-28px_0_70px_rgba(0,0,0,0.38)] animate-in slide-in-from-right duration-300 ease-in-out">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(216,195,154,0.16),transparent_30%),linear-gradient(160deg,rgba(8,47,44,0.16),rgba(8,47,44,0.84))]"></div>
            <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-[#082F2C]/80 blur-2xl"></div>

            <button 
              onClick={closeMobileMenu}
              className="absolute right-6 top-[calc(env(safe-area-inset-top)+22px)] z-10 text-[#D8C39A] transition-colors hover:text-[#F7F3EC]"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" strokeWidth={1.35} />
            </button>

            <div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-[calc(env(safe-area-inset-top)+70px)]">
              <Link
                href={vendorState.isVendor || isVendorSession ? "/vendor" : session ? profileLink : "/login"}
                onClick={closeMobileMenu}
                className="mb-8 flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-white/10"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D8C39A]/60 bg-[#0F4C45] text-white shadow-[0_12px_22px_rgba(0,0,0,0.2)]">
                  {vendorState.logo && (vendorState.logo.startsWith("data:") || vendorState.logo.startsWith("http") || vendorState.logo.startsWith("/")) ? (
                    <img src={vendorState.logo} alt={vendorState.name} className="h-full w-full object-cover" />
                  ) : vendorState.isVendor && vendorState.name ? (
                    <span className="font-serif text-2xl font-bold text-white">{vendorState.name.charAt(0).toUpperCase()}</span>
                  ) : session ? (
                    <span className="font-serif text-2xl font-bold text-white">U</span>
                  ) : (
                    <img src="/logo.png" alt="Cloche" className="h-full w-full object-contain scale-[1.35]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="truncate font-display text-[18px] font-bold leading-6 text-[#F7F3EC]">
                      {vendorState.name || (session ? "My Profile" : "Cloche Guest")}
                    </h2>
                    {vendorState.isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-[#C8A96A] shrink-0" />
                    )}
                  </div>
                  <p className="mt-0.5 truncate font-sans text-[13px] leading-5 text-[#D8C39A]">
                    {vendorState.isVendor
                      ? vendorState.category || "Wedding Services"
                      : session
                      ? "View Profile"
                      : "Sign In / Sign Up"}
                  </p>
                </div>
              </Link>

              <nav className="space-y-9">
                <section>
                  <h3 className="mb-4 px-3 font-display text-[15px] font-bold uppercase tracking-[0.08em] text-[#C8A96A]">
                    Browse
                  </h3>
                  <div className="space-y-1">
                    {browseLinks.map((item, index) => (
                      <MobileMenuLink key={`${item.label}-${item.href}`} item={item} index={index} />
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 px-3 font-display text-[15px] font-bold uppercase tracking-[0.08em] text-[#C8A96A]">
                    Company
                  </h3>
                  <div className="space-y-1">
                    {companyLinks.map((item, index) => (
                      <MobileMenuLink key={`${item.label}-${item.href}`} item={item} index={index + browseLinks.length} />
                    ))}
                  </div>
                </section>
              </nav>

              <a
                href="/partner"
                onClick={closeMobileMenu}
                className="mt-9 flex items-center gap-4 rounded-[22px] border border-[#C8A96A]/55 bg-[#F7F3EC] p-3 text-[#082F2C] shadow-[0_18px_34px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:scale-[1.02]"
              >
                <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D8C39A]/55">
                  <img src="/logo.png" alt="" className="h-full w-full object-contain scale-[1.55]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-[18px] font-bold leading-6">List Your Business</p>
                  <p className="mt-1 font-sans text-[14px] leading-5 text-[#082F2C]/80">Grow with Cloche</p>
                </div>
                <ArrowRight className="h-8 w-8 shrink-0 text-[#082F2C]" strokeWidth={1.8} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

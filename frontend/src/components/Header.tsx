"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, Edit3, Smartphone, Menu, X, ChevronDown, Search, User,
  Home, MapPin, Store, BookHeart, FileText, Mail,
  Heart, Lightbulb, Info, CircleHelp, ArrowRight, Users, MessageCircle, CheckCircle2,
  LogOut, LayoutDashboard, Calendar, Sparkles
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { logout } from "@/app/actions/auth";

type HeaderProps = {
  session?: { token: string; role?: string } | null;
};

export function Header({ session }: HeaderProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isAuthRoute) return null;

  let profileLink = "/dashboard";
  if (session?.role === "vendor" || session?.role === "partner") {
    profileLink = "/vendor/profile";
  } else if (session?.role === "admin") {
    profileLink = "/admin";
  }

  const isVendorSession = session?.role === "vendor" || session?.role === "partner";

  const mainNavItems = [
    { label: "Home", href: "/" },
    { label: "Venues", href: "/venues" },
    { label: "Vendors", href: "/vendors" },
    { label: "Collections", href: "/collections" },
    { label: "Real Weddings", href: "/real-weddings" },
    { label: "Blogs", href: "/blogs" },
  ];

  const moreCategoryItems = [
    { label: "Bridal Wear", href: "/categories/bridal-wear" },
    { label: "Groom Wear", href: "/categories/groom-wear" },
    { label: "Photography", href: "/photographers" },
    { label: "Videography", href: "/categories/videography" },
    { label: "Makeup Artists", href: "/makeup" },
    { label: "Mehendi Artists", href: "/categories/mehendi" },
    { label: "Decor & Planning", href: "/categories/decor-planning" },
    { label: "Jewellery", href: "/categories/jewellery" },
    { label: "Invitation Designers", href: "/invitations" },
    { label: "Caterers", href: "/catering" },
    { label: "Wedding Cakes", href: "/categories/cakes" },
    { label: "Entertainment", href: "/categories/entertainment" },
    { label: "Wedding Planners", href: "/categories/wedding-planners" },
    { label: "Honeymoon", href: "/categories/honeymoon" },
    { label: "Rental Services", href: "/categories/rentals" },
    { label: "Gift Stores", href: "/categories/gifts" },
  ];

  const browseLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Venues", href: "/venues", icon: MapPin },
    { label: "Vendors", href: "/vendors", icon: Users },
    { label: "Collections", href: "/collections", icon: Heart },
    { label: "Real Weddings", href: "/real-weddings", icon: BookHeart },
    { label: "Blogs", href: "/blogs", icon: FileText },
  ];

  const companyLinks = [
    { label: "About Cloche", href: "/about", icon: Info },
    { label: "For Vendors", href: "/vendor/register", icon: Store },
    { label: "Contact Us", href: "/contact", icon: Mail },
    { label: "Help & Support", href: "/contact", icon: CircleHelp },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const notifications = session
    ? isVendorSession
      ? [
          {
            title: "Vendor notifications",
            body: "New enquiries, messages, and appointment updates will appear here.",
            href: "/vendor",
          },
          {
            title: "Profile status",
            body: "Keep your profile, images, and collections updated for better visibility.",
            href: "/vendor/profile",
          },
        ]
      : [
          {
            title: "Wedding updates",
            body: "Boutique replies and appointment updates will appear here.",
            href: "/dashboard",
          },
          {
            title: "Saved favourites",
            body: "Check your wishlist for boutiques and collections you saved.",
            href: "/dashboard/wishlist",
          },
        ]
    : [];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    await logout();
    if (typeof window !== "undefined") {
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    window.location.href = "/?logout=success";
  };

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col shadow-md">
      {/* Top Bar (Hidden on Mobile) */}
      <div className="hidden md:flex justify-between items-center px-4 sm:px-6 lg:px-10 xl:px-12 py-2 text-xs lg:text-sm bg-[#0B3B2D] text-white border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-gray-300">India&apos;s Favourite Wedding Marketplace Platform</span>
          <button className="flex items-center gap-1 bg-white text-gray-900 px-3 py-1 rounded-sm font-medium hover:bg-gray-100 transition-colors text-xs">
            All Cities <ChevronDown className="w-3.5 h-3.5" />
          </button>
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

      {/* Main Nav */}
      <div className="relative flex justify-between items-center px-4 sm:px-6 lg:px-10 xl:px-12 py-2.5 md:py-4 bg-primary text-white">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-11 h-10 md:w-[55px] md:h-[48px] lg:w-[65px] lg:h-[52px] xl:w-[70px] xl:h-[56px]">
            <img src="/logo.png" alt="Cloche Logo" className="absolute inset-0 w-full h-full object-contain scale-[1.75] md:scale-[1.8] lg:scale-[1.9] drop-shadow-sm origin-center" />
          </div>
          <span className="block font-display text-[20px] md:text-2xl lg:text-[28px] font-bold tracking-wide mt-0.5 md:mt-1">Cloche</span>
        </Link>

        {/* Desktop Navbar Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-[14px] xl:text-[15px]">
          {mainNavItems.map((item) => {
            const active = isActiveLink(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`py-1 transition-colors relative ${
                  active
                    ? "text-[#C8A96A] font-semibold border-b-2 border-[#C8A96A]"
                    : "hover:text-[#C8A96A] text-white/90"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* "More ▼" Dropdown */}
          <div className="relative" ref={moreDropdownRef}>
            <button
              onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
              className={`flex items-center gap-1.5 py-1 transition-colors ${
                moreCategoryItems.some((c) => isActiveLink(c.href))
                  ? "text-[#C8A96A] font-semibold border-b-2 border-[#C8A96A]"
                  : "hover:text-[#C8A96A] text-white/90"
              }`}
            >
              <span>More</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMoreDropdownOpen ? "rotate-180 text-[#C8A96A]" : ""}`} />
            </button>

            {isMoreDropdownOpen && (
              <div className="absolute top-full left-0 mt-3 w-64 bg-[#0B3B36] border border-[#C8A96A]/30 rounded-2xl shadow-2xl p-2 z-50 grid grid-cols-1 gap-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
                {moreCategoryItems.map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    onClick={() => setIsMoreDropdownOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#F7F3EC]/90 hover:bg-[#12584C] hover:text-[#C8A96A] transition-all flex items-center justify-between"
                  >
                    <span>{cat.label}</span>
                    <ChevronDown className="-rotate-90 w-3 h-3 text-[#C8A96A]/60" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls: Search, Notifications & Account */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          
          {/* Global Search Icon */}
          <Link
            href="/search"
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Search"
          >
            <Search className="w-[17px] h-[17px] lg:w-5 lg:h-5 text-white" />
          </Link>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setIsNotificationsOpen((open) => !open)}
            aria-label="Open notifications"
          >
            <Bell className="w-[17px] h-[17px] lg:w-5 lg:h-5" />
            {session && notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C8A96A] shadow-[0_0_0_2px_#0F4C45]" />
            )}
          </button>

          {/* Account Login / Profile Dropdown */}
          {session ? (
            <div className="relative" ref={accountDropdownRef}>
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="hidden md:flex items-center gap-2 bg-[#12584C] hover:bg-[#186f61] border border-[#1d796b] px-4 py-2 rounded-full font-semibold transition-colors text-xs lg:text-sm"
              >
                <User className="w-4 h-4 text-[#C8A96A]" />
                <span>Account</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70" />
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-[#0B3B36] border border-[#C8A96A]/30 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-xs animate-in fade-in duration-200">
                  <Link
                    href={profileLink}
                    onClick={() => setIsAccountDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-white font-semibold hover:bg-[#12584E]"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#C8A96A]" /> Dashboard
                  </Link>

                  {!isVendorSession && (
                    <>
                      <Link
                        href="/dashboard/wishlist"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-white font-semibold hover:bg-[#12584E]"
                      >
                        <Heart className="w-4 h-4 text-red-400" /> Wishlist
                      </Link>
                      <Link
                        href="/dashboard/appointments"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-white font-semibold hover:bg-[#12584E]"
                      >
                        <Calendar className="w-4 h-4 text-emerald" /> Bookings
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-300 font-semibold hover:bg-red-950/40 text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-400" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex bg-[#12584C] hover:bg-[#186f61] border border-[#1d796b] px-6 py-2 lg:px-8 lg:py-2.5 rounded-full font-semibold transition-colors text-sm lg:text-[15px]">
              Log In
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button 
            className="lg:hidden text-white hover:text-gold transition-colors"
            onClick={() => {
              setIsNotificationsOpen(false);
              setIsMobileMenuOpen(true);
            }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications Panel */}
        {isNotificationsOpen && (
          <div className="absolute right-4 top-[calc(100%+10px)] z-[70] w-[min(calc(100vw-2rem),360px)] overflow-hidden rounded-2xl border border-[#C8A96A]/30 bg-[#F7F3EC] text-[#082F2C] shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between border-b border-[#C8A96A]/20 bg-[#0B3B36] px-4 py-3 text-[#F7F3EC]">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#C8A96A]" />
                <p className="font-display text-lg font-bold">Notifications</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(false)}
                className="text-[#D8C39A] hover:text-white"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto p-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Link
                    key={notification.title}
                    href={notification.href}
                    onClick={() => setIsNotificationsOpen(false)}
                    className="group flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#0B3B36]/8"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B3B36]/10 text-[#0B3B36]">
                      {session ? <MessageCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-sans text-sm font-bold text-[#082F2C]">{notification.title}</span>
                      <span className="mt-1 block font-sans text-xs leading-5 text-[#082F2C]/70">{notification.body}</span>
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#082F2C]/60 font-medium">
                  No new notifications right now.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex justify-end">
          <div 
            className="absolute inset-0 bg-black/65 backdrop-blur-[2px] transition-opacity duration-300" 
            onClick={closeMobileMenu}
          ></div>
          
          <div className="relative flex h-[100dvh] w-[76vw] max-w-[340px] flex-col overflow-hidden bg-[#0B3B36] text-[#F7F3EC] shadow-[-28px_0_70px_rgba(0,0,0,0.38)] animate-in slide-in-from-right duration-300 ease-in-out">
            <button 
              onClick={closeMobileMenu}
              className="absolute right-6 top-[calc(env(safe-area-inset-top)+22px)] z-10 text-[#D8C39A] transition-colors hover:text-[#F7F3EC]"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" strokeWidth={1.35} />
            </button>

            <div className="relative z-[1] flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] pt-[calc(env(safe-area-inset-top)+70px)]">
              <Link
                href={session ? profileLink : "/login"}
                onClick={closeMobileMenu}
                className="mb-8 flex items-center gap-4 rounded-2xl p-1 transition-colors hover:bg-white/7"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D8C39A]/60 bg-[#F7F3EC] shadow-[0_12px_22px_rgba(0,0,0,0.2)]">
                  <img src="/logo.png" alt="" className="h-full w-full object-contain scale-[1.35]" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-display text-[18px] font-bold leading-6 text-[#F7F3EC]">
                    {session ? "My Profile" : "Cloche Guest"}
                  </h2>
                  <p className="mt-0.5 truncate font-sans text-[13px] leading-5 text-[#D8C39A]">
                    {session ? "View Profile" : "Sign In / Sign Up"}
                  </p>
                </div>
              </Link>

              <nav className="space-y-9">
                <section>
                  <h3 className="mb-4 px-3 font-display text-[15px] font-bold uppercase tracking-[0.08em] text-[#C8A96A]">
                    Browse Marketplace
                  </h3>
                  <div className="space-y-1">
                    {browseLinks.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10"
                        >
                          <Icon className="w-4 h-4 text-[#C8A96A]" /> {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

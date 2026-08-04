"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, Edit3, Smartphone, Menu, X, ChevronDown,
  Home, MapPin, Store, BookHeart, FileText, Mail,
  Lightbulb, Info, CircleHelp, ArrowRight, Users, MessageCircle, CheckCircle2, Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";

type HeaderProps = {
  session?: { token: string; role?: string } | null;
};

export function Header({ session }: HeaderProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
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
    if (!isNotificationsOpen) return;

    const closeNotificationsOnScroll = () => {
      setIsNotificationsOpen(false);
    };

    window.addEventListener("scroll", closeNotificationsOnScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", closeNotificationsOnScroll);
    };
  }, [isNotificationsOpen]);

  if (isAuthRoute) return null;

  let profileLink = "/dashboard";
  if (session?.role === "vendor" || session?.role === "partner") {
    profileLink = "/vendor/profile";
  } else if (session?.role === "admin") {
    profileLink = "/admin";
  }

  const browseLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Venues", href: "/venues", icon: MapPin },
    { label: "Vendors", href: "/boutiques", icon: Users },
    { label: "Exclusive Deals", href: "/deals", icon: Sparkles },
    { label: "Real Weddings", href: "/real-weddings", icon: BookHeart },
    { label: "Photos & Inspiration", href: "/inspiration", icon: Lightbulb },
    { label: "Blogs", href: "/blogs", icon: FileText },
  ];

  const companyLinks = [
    { label: "About Cloche", href: "/about", icon: Info },
    { label: "For Vendors", href: "/vendor/register", icon: Store },
    { label: "Contact Us", href: "/contact", icon: Mail },
    { label: "Help & Support", href: "/contact", icon: CircleHelp },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isVendorSession = session?.role === "vendor" || session?.role === "partner";

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
    : [
        {
          title: "Sign in for notifications",
          body: "Log in to see replies, appointment updates, and saved vendor alerts.",
          href: "/login",
        },
      ];

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
          <span className="text-gray-300">India&apos;s Favourite Wedding Planning Platform</span>
          <Link href="/venues" className="flex items-center gap-1 bg-white text-gray-900 px-3 py-1 rounded-sm font-medium hover:bg-gray-100 transition-colors" aria-label="Filter venues by all cities">
            All Cities <ChevronDown className="w-4 h-4" />
          </Link>
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
          <Link href="/inspiration" className={`transition-colors ${isActiveLink("/inspiration") ? "text-gold font-bold" : "hover:text-gold"}`}>Photos</Link>
          <Link href="/real-weddings" className={`transition-colors ${isActiveLink("/real-weddings") ? "text-gold font-bold" : "hover:text-gold"}`}>Real Weddings</Link>
          <Link href="/blogs" className={`transition-colors ${isActiveLink("/blogs") ? "text-gold font-bold" : "hover:text-gold"}`}>Blog</Link>
          <Link href="/e-invites" className={`transition-colors ${isActiveLink("/e-invites") ? "text-gold font-bold" : "hover:text-gold"}`}>E-Invites</Link>
          <Link href="/genie" className={`transition-colors ${isActiveLink("/genie") ? "text-gold font-bold" : "hover:text-gold"}`}>Genie</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          <button
            type="button"
            className="relative w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setIsNotificationsOpen((open) => !open)}
            aria-label="Open notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="w-[17px] h-[17px] lg:w-5 lg:h-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C8A96A] shadow-[0_0_0_2px_#0F4C45]" />
          </button>
          
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
            onClick={() => {
              setIsNotificationsOpen(false);
              setIsMobileMenuOpen(true);
            }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

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
              {notifications.map((notification) => (
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
              ))}
            </div>

            <div className="border-t border-[#C8A96A]/20 px-4 py-3 text-center">
              <Link
                href={session ? profileLink : "/login"}
                onClick={() => setIsNotificationsOpen(false)}
                className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#0B3B36] hover:text-[#C8A96A]"
              >
                {session ? "Open account" : "Login to continue"}
              </Link>
            </div>
          </div>
        )}
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

              <Link
                href="/vendor/register"
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
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

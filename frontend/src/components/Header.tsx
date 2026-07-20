"use client";

import Link from "next/link";
import { 
  Search, Edit3, Smartphone, Menu, X, ChevronDown, 
  User, MapPin, Store, Image as ImageIcon, BookHeart, FileText, Mail, Wand2, ChevronDown as ChevronDownIcon
} from "lucide-react";
import { useState } from "react";

type HeaderProps = {
  session?: { token: string; role?: string } | null;
};

export function Header({ session }: HeaderProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  let profileLink = "/dashboard";
  if (session?.role === "vendor" || session?.role === "partner") {
    profileLink = "/vendor/profile";
  } else if (session?.role === "admin") {
    profileLink = "/admin";
  }

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col shadow-md">
      {/* Top Bar (Hidden on Mobile) */}
      <div className="hidden md:flex justify-between items-center px-4 sm:px-6 lg:px-10 xl:px-12 py-2 text-xs lg:text-sm bg-[#0B3B2D] text-white border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-gray-300">India's Favourite Wedding Planning Platform</span>
          <button className="flex items-center gap-1 bg-white text-gray-900 px-3 py-1 rounded-sm font-medium hover:bg-gray-100 transition-colors">
            All Cities <ChevronDown className="w-4 h-4" />
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
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 xl:px-12 py-4 bg-primary text-white">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-7 h-7 lg:w-8 lg:h-8 bg-white"></div>
          <span className="font-display text-2xl lg:text-[28px] font-bold tracking-wide">Cloche</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 font-semibold text-[14px] xl:text-[15px]">
          <Link href="/categories" className="hover:text-gold transition-colors">Venues</Link>
          <Link href="/boutiques" className="hover:text-gold transition-colors">Vendors</Link>
          <Link href="/inspiration" className="hover:text-gold transition-colors">Photos</Link>
          <Link href="/real-weddings" className="hover:text-gold transition-colors">Real Weddings</Link>
          <Link href="/blog" className="hover:text-gold transition-colors">Blog</Link>
          <Link href="/e-invites" className="hover:text-gold transition-colors">E-Invites</Link>
          <Link href="/genie" className="hover:text-gold transition-colors">Genie</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          <button className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Search className="w-4 h-4 lg:w-5 lg:h-5" />
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
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu (Drawer) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="relative w-[85%] max-w-sm h-full bg-surface shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Top Auth Section */}
            {session ? (
              <Link 
                href={profileLink} 
                className="flex items-center gap-4 p-5 border-b border-outline-variant/30 hover:bg-surface-dim transition-colors mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 rounded-full bg-outline-variant/30 flex items-center justify-center text-on-surface-variant">
                  <User className="w-6 h-6" />
                </div>
                <span className="font-semibold text-[18px] text-on-surface">My Profile</span>
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center gap-4 p-5 border-b border-outline-variant/30 hover:bg-surface-dim transition-colors mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-12 h-12 rounded-full bg-outline-variant/30 flex items-center justify-center text-on-surface-variant">
                  <User className="w-6 h-6" />
                </div>
                <span className="font-semibold text-[18px] text-on-surface">Sign In / Sign Up</span>
              </Link>
            )}

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto py-6">
              <h3 className="px-6 mb-2 font-semibold text-outline uppercase text-[13px] tracking-wider">Wedding Categories</h3>
              
              <div className="flex flex-col">
                <Link href="/categories" className="flex items-center justify-between px-6 py-4 hover:bg-surface-dim transition-colors group" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 text-on-surface">
                    <MapPin className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                    <span className="font-medium text-[16px]">Venues</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-outline-variant" />
                </Link>
                
                <Link href="/boutiques" className="flex items-center justify-between px-6 py-4 hover:bg-surface-dim transition-colors group" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 text-on-surface">
                    <Store className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                    <span className="font-medium text-[16px]">Vendors</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-outline-variant" />
                </Link>
                
                <Link href="/inspiration" className="flex items-center justify-between px-6 py-4 hover:bg-surface-dim transition-colors group" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 text-on-surface">
                    <ImageIcon className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                    <span className="font-medium text-[16px]">Photos</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-outline-variant" />
                </Link>
                
                <Link href="/real-weddings" className="flex items-center justify-between px-6 py-4 hover:bg-surface-dim transition-colors group" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 text-on-surface">
                    <BookHeart className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                    <span className="font-medium text-[16px]">Real Weddings</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-outline-variant" />
                </Link>
                
                <Link href="/blog" className="flex items-center justify-between px-6 py-4 hover:bg-surface-dim transition-colors group" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 text-on-surface">
                    <FileText className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                    <span className="font-medium text-[16px]">Blog</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-outline-variant" />
                </Link>

                <Link href="/e-invites" className="flex items-center justify-between px-6 py-4 hover:bg-surface-dim transition-colors group" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 text-on-surface">
                    <Mail className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                    <span className="font-medium text-[16px]">E-Invites</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-outline-variant" />
                </Link>

                <Link href="/genie" className="flex items-center justify-between px-6 py-4 hover:bg-surface-dim transition-colors group" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 text-on-surface">
                    <Wand2 className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                    <span className="font-medium text-[16px]">Genie</span>
                  </div>
                  <ChevronDownIcon className="w-5 h-5 text-outline-variant" />
                </Link>
              </div>
            </div>
            
            {/* Close Button Inside Sidebar */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-3 right-3 text-on-surface-variant hover:text-primary p-2 bg-surface-dim rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

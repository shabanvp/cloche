"use client";

import Link from "next/link";
import { Search, Edit3, Smartphone, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Link href="/admin/login" className="hidden md:flex bg-[#12584C] hover:bg-[#186f61] border border-[#1d796b] px-6 py-2 lg:px-8 lg:py-2.5 rounded-full font-semibold transition-colors text-sm lg:text-[15px]">
            Log In
          </Link>
          <button 
            className="lg:hidden text-white hover:text-gold transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-primary border-t border-white/20 p-4 flex flex-col gap-4 shadow-lg text-white">
          <Link href="/categories" className="text-lg font-semibold border-b border-white/10 pb-2">Venues</Link>
          <Link href="/boutiques" className="text-lg font-semibold border-b border-white/10 pb-2">Vendors</Link>
          <Link href="/inspiration" className="text-lg font-semibold border-b border-white/10 pb-2">Photos</Link>
          <Link href="/real-weddings" className="text-lg font-semibold border-b border-white/10 pb-2">Real Weddings</Link>
          <Link href="/blog" className="text-lg font-semibold border-b border-white/10 pb-2">Blog</Link>
          <Link href="/e-invites" className="text-lg font-semibold border-b border-white/10 pb-2">E-Invites</Link>
          <Link href="/genie" className="text-lg font-semibold border-b border-white/10 pb-2">Genie</Link>
          <Link href="/admin/login" className="text-lg font-semibold text-gold">Log In</Link>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { Search, Heart, User, Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-ivory/95 backdrop-blur-md sticky top-0 z-50 border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex flex-col items-center">
              <span className="font-display text-2xl tracking-widest text-emerald font-bold uppercase">Cloche</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold mt-1">Weddings of Kerala</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/categories" className="text-sm font-medium text-charcoal hover:text-emerald transition-colors">Categories</Link>
            <Link href="/boutiques" className="text-sm font-medium text-charcoal hover:text-emerald transition-colors">Boutiques</Link>
            <Link href="/collections" className="text-sm font-medium text-charcoal hover:text-emerald transition-colors">Collections</Link>
            <Link href="/inspiration" className="text-sm font-medium text-charcoal hover:text-emerald transition-colors">Inspiration</Link>
            <Link href="/deals" className="text-sm font-medium text-charcoal hover:text-emerald transition-colors">Deals</Link>
          </nav>

          {/* Actions & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4 md:space-x-5 text-charcoal">
            <button aria-label="Search" className="hover:text-gold transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/wishlist" aria-label="Wishlist" className="hover:text-gold transition-colors hidden sm:block">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" aria-label="Account" className="hover:text-gold transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <button 
              aria-label="Menu" 
              className="md:hidden hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-ivory border-t border-gold/10 px-4 py-4 space-y-4 shadow-lg absolute w-full left-0">
          <Link href="/categories" className="block text-sm font-medium text-charcoal hover:text-emerald">Categories</Link>
          <Link href="/boutiques" className="block text-sm font-medium text-charcoal hover:text-emerald">Boutiques</Link>
          <Link href="/collections" className="block text-sm font-medium text-charcoal hover:text-emerald">Collections</Link>
          <Link href="/inspiration" className="block text-sm font-medium text-charcoal hover:text-emerald">Inspiration</Link>
          <Link href="/deals" className="block text-sm font-medium text-charcoal hover:text-emerald">Deals</Link>
          <div className="pt-4 border-t border-gold/10 flex space-x-6">
             <button aria-label="Search" className="hover:text-gold transition-colors flex items-center gap-2 text-sm text-charcoal">
              <Search className="w-5 h-5" /> Search
            </button>
            <Link href="/wishlist" aria-label="Wishlist" className="hover:text-gold transition-colors flex items-center gap-2 text-sm text-charcoal">
              <Heart className="w-5 h-5" /> Wishlist
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

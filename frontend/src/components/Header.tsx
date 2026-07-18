"use client";

import Link from "next/link";
import { Search, Heart, User } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-ivory/80 backdrop-blur-md sticky top-0 z-50 border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex flex-col items-center">
              <span className="font-display text-2xl tracking-widest text-emerald font-bold uppercase">Cloche</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold mt-1">Weddings of Kerala</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/categories" className="text-sm font-medium text-charcoal hover:text-emerald transition-colors">Categories</Link>
            <Link href="/boutiques" className="text-sm font-medium text-charcoal hover:text-emerald transition-colors">Boutiques</Link>
            <Link href="/collections" className="text-sm font-medium text-charcoal hover:text-emerald transition-colors">Collections</Link>
            <Link href="/inspiration" className="text-sm font-medium text-charcoal hover:text-emerald transition-colors">Inspiration</Link>
            <Link href="/deals" className="text-sm font-medium text-charcoal hover:text-emerald transition-colors">Deals</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-5 text-charcoal">
            <button aria-label="Search" className="hover:text-gold transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/wishlist" aria-label="Wishlist" className="hover:text-gold transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" aria-label="Account" className="hover:text-gold transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

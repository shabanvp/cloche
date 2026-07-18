"use client";

import Link from "next/link";
import { Search, Heart, User, Menu, Flower2, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-ivory/98 sticky top-0 z-50 border-b border-[#e7dccb]">
      <div className="mx-auto w-full max-w-[1728px] px-5 sm:px-7 lg:px-10 xl:px-12 2xl:px-14">
        <div className="flex h-[72px] items-center justify-between md:h-[80px] lg:h-[88px] xl:h-[92px] 2xl:h-[96px]">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex flex-col items-center leading-none">
              <Flower2 className="mb-1 h-5 w-5 text-gold sm:h-6 sm:w-6" strokeWidth={1.35} />
              <span className="font-display text-[24px] font-semibold uppercase tracking-[0.15em] text-charcoal sm:text-[28px] lg:text-[31px]">
                Cloche
              </span>
              <span className="mt-1 text-[7px] uppercase tracking-[0.28em] text-charcoal/70 sm:text-[8px]">
                Stories in threads
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
            <Link href="/categories" className="text-[14px] font-semibold text-charcoal transition-colors hover:text-emerald">Categories</Link>
            <Link href="/boutiques" className="text-[14px] font-semibold text-charcoal transition-colors hover:text-emerald">Boutiques</Link>
            <Link href="/collections" className="text-[14px] font-semibold text-charcoal transition-colors hover:text-emerald">Collections</Link>
            <Link href="/inspiration" className="text-[14px] font-semibold text-charcoal transition-colors hover:text-emerald">Inspiration</Link>
            <Link href="/deals" className="text-[14px] font-semibold text-charcoal transition-colors hover:text-emerald">Deals</Link>
          </nav>

          <div className="flex items-center gap-4 text-charcoal sm:gap-5">
            <Link href="/search" aria-label="Search" className="hidden transition-colors hover:text-gold sm:block">
              <Search className="h-5 w-5 lg:h-[22px] lg:w-[22px]" strokeWidth={1.8} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="hidden transition-colors hover:text-gold sm:block">
              <Heart className="h-5 w-5 lg:h-[22px] lg:w-[22px]" strokeWidth={1.8} />
            </Link>
            <Link href="/dashboard" aria-label="Account" className="transition-colors hover:text-gold">
              <User className="h-5 w-5 lg:h-[22px] lg:w-[22px]" strokeWidth={1.8} />
            </Link>
            <button 
              aria-label="Menu" 
              className="transition-colors hover:text-gold lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 w-full border-t border-gold/10 bg-ivory px-5 py-5 shadow-lg lg:hidden">
          <div className="mx-auto grid max-w-[1728px] gap-4 sm:grid-cols-2">
            <Link href="/categories" className="block text-sm font-semibold text-charcoal hover:text-emerald">Categories</Link>
            <Link href="/boutiques" className="block text-sm font-semibold text-charcoal hover:text-emerald">Boutiques</Link>
            <Link href="/collections" className="block text-sm font-semibold text-charcoal hover:text-emerald">Collections</Link>
            <Link href="/inspiration" className="block text-sm font-semibold text-charcoal hover:text-emerald">Inspiration</Link>
            <Link href="/deals" className="block text-sm font-semibold text-charcoal hover:text-emerald">Deals</Link>
          </div>
          <div className="mx-auto mt-5 flex max-w-[1728px] gap-6 border-t border-gold/10 pt-5">
             <Link href="/search" aria-label="Search" className="flex items-center gap-2 text-sm text-charcoal transition-colors hover:text-gold">
              <Search className="h-5 w-5" /> Search
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="flex items-center gap-2 text-sm text-charcoal transition-colors hover:text-gold">
              <Heart className="h-5 w-5" /> Wishlist
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

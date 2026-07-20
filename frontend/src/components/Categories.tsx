"use client";

import Link from "next/link";
import { Camera, Gem, MapPinned, MoreHorizontal, Scissors, Shirt, Sparkles, UserRoundCheck } from "lucide-react";

const CATEGORIES = [
  { name: "Bridal Wear", icon: Sparkles, href: "/search?category=Bridal" },
  { name: "Groom Wear", icon: Shirt, href: "/search?category=Groom" },
  { name: "Jewellery", icon: Gem, href: "/search?category=Jewellery" },
  { name: "Makeup & Hair", icon: Scissors, href: "/search?category=Makeup" },
  { name: "Wedding Planners", icon: UserRoundCheck, href: "#", isComingSoon: true },
  { name: "Photography", icon: Camera, href: "#", isComingSoon: true },
  { name: "Venues", icon: MapPinned, href: "#", isComingSoon: true },
  { name: "More", icon: MoreHorizontal, href: "/categories" },
];

interface CategoriesProps {
  title?: string;
  subtitle?: string;
}

export function Categories({ title, subtitle }: CategoriesProps) {
  return (
    <section className="mx-auto w-full max-w-[1728px] overflow-hidden border-b border-[#e7dccb] px-4 py-12 sm:px-7 sm:py-14 md:py-16 lg:px-10 xl:px-12 2xl:px-14">
      <div className="mb-9 flex items-end justify-between md:mb-11">
        <div>
          <span className="mb-3 block text-[12px] font-medium uppercase tracking-[0.22em] text-[#8f7856]">
            {subtitle || "Browse by Category"}
          </span>
          <h2 className="max-w-[320px] font-display text-[28px] font-normal leading-tight text-charcoal sm:max-w-none sm:text-[30px] lg:text-[36px]">
            {title || "Everything for your big day"}
          </h2>
        </div>
        <Link href="/categories" className="hidden text-[14px] font-semibold text-emerald transition-colors hover:text-gold sm:block">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-8 lg:gap-x-7 xl:gap-x-9">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return category.isComingSoon ? (
            <button 
              key={category.name} 
              onClick={(e) => { e.preventDefault(); alert("Coming Soon!"); }}
              className="group flex min-w-0 flex-col items-center"
            >
              <div className="mb-3 flex aspect-square w-[56px] items-center justify-center rounded-full border border-gold/35 bg-ivory text-gold transition-all duration-300 group-hover:scale-105 group-hover:bg-gold group-hover:text-white sm:mb-4 sm:w-[74px] md:w-[80px] lg:w-[84px] xl:w-[88px]">
                <Icon aria-hidden="true" strokeWidth={1.35} className="h-[23px] w-[23px] sm:h-8 sm:w-8" />
              </div>
              <span className="text-center text-[10px] font-medium leading-snug text-charcoal transition-colors group-hover:text-emerald sm:text-[12px] lg:text-[13px]">
                {category.name}
              </span>
            </button>
          ) : (
            <Link 
              key={category.name} 
              href={category.href}
              className="group flex min-w-0 flex-col items-center"
            >
              <div className="mb-3 flex aspect-square w-[56px] items-center justify-center rounded-full border border-gold/35 bg-ivory text-gold transition-all duration-300 group-hover:scale-105 group-hover:bg-gold group-hover:text-white sm:mb-4 sm:w-[74px] md:w-[80px] lg:w-[84px] xl:w-[88px]">
                <Icon aria-hidden="true" strokeWidth={1.35} className="h-[23px] w-[23px] sm:h-8 sm:w-8" />
              </div>
              <span className="text-center text-[10px] font-medium leading-snug text-charcoal transition-colors group-hover:text-emerald sm:text-[12px] lg:text-[13px]">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

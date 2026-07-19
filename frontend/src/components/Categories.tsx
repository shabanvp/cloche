import Link from "next/link";
import { Camera, Gem, MapPinned, MoreHorizontal, Scissors, Shirt, Sparkles, UserRoundCheck } from "lucide-react";

const CATEGORIES = [
  { name: "Bridal Wear", icon: Sparkles, href: "/categories/bridal" },
  { name: "Groom Wear", icon: Shirt, href: "/categories/groom" },
  { name: "Jewellery", icon: Gem, href: "/categories/jewellery" },
  { name: "Makeup & Hair", icon: Scissors, href: "/categories/makeup" },
  { name: "Wedding Planners", icon: UserRoundCheck, href: "/categories/wedding-planners" },
  { name: "Photography", icon: Camera, href: "/categories/photography" },
  { name: "Venues", icon: MapPinned, href: "/categories/venues" },
  { name: "More", icon: MoreHorizontal, href: "/categories" },
];

interface CategoriesProps {
  title?: string;
  subtitle?: string;
}

export function Categories({ title, subtitle }: CategoriesProps) {
  return (
    <section className="mx-auto w-full max-w-[1728px] border-b border-[#e7dccb] px-5 py-12 sm:px-7 sm:py-14 md:py-16 lg:px-10 xl:px-12 2xl:px-14">
      <div className="mb-9 flex items-end justify-between md:mb-11">
        <div>
          <span className="mb-3 block text-[12px] font-medium uppercase tracking-[0.22em] text-[#8f7856]">
            {subtitle || "Browse by Category"}
          </span>
          <h2 className="font-display text-[32px] font-normal leading-tight text-charcoal sm:text-[30px] lg:text-[36px]">
            {title || "Everything for your big day"}
          </h2>
        </div>
        <Link href="/categories" className="hidden text-[14px] font-semibold text-emerald transition-colors hover:text-gold sm:block">
          View all
        </Link>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-x-6 pb-4 sm:grid sm:grid-cols-4 sm:gap-x-5 sm:gap-y-7 sm:pb-0 md:grid-cols-4 lg:grid-cols-8 lg:gap-x-7 xl:gap-x-9 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <Link 
              key={category.name} 
              href={category.href}
              className="group flex min-w-[72px] shrink-0 snap-start flex-col items-center sm:min-w-0"
            >
              <div className="mb-4 flex aspect-square w-[64px] items-center justify-center rounded-full border border-gold/35 bg-ivory text-gold transition-all duration-300 group-hover:scale-105 group-hover:bg-gold group-hover:text-white sm:w-[74px] md:w-[80px] lg:w-[84px] xl:w-[88px]">
                <Icon aria-hidden="true" strokeWidth={1.35} className="h-[26px] w-[26px] sm:h-8 sm:w-8" />
              </div>
              <span className="text-center text-[11px] font-medium leading-snug text-charcoal transition-colors group-hover:text-emerald sm:text-[12px] lg:text-[13px]">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

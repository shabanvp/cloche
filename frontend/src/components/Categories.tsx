import Link from "next/link";
import { Sparkles, Shirt, Gem, Scissors, Camera, Map, MoreHorizontal } from "lucide-react";

const CATEGORIES = [
  { name: "Bridal Wear", icon: Sparkles, href: "/categories/bridal" },
  { name: "Groom Wear", icon: Shirt, href: "/categories/groom" },
  { name: "Jewellery", icon: Gem, href: "/categories/jewellery" },
  { name: "Makeup & Hair", icon: Scissors, href: "/categories/makeup" },
  { name: "Photography", icon: Camera, href: "/categories/photography" },
  { name: "Venues", icon: Map, href: "/categories/venues" },
  { name: "More", icon: MoreHorizontal, href: "/categories" },
];

export function Categories() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-gold/10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-gold tracking-[0.4em] uppercase text-xs mb-3 block font-bold">Browse by Category</span>
          <h2 className="text-3xl md:text-4xl font-display text-charcoal">Everything for your big day</h2>
        </div>
        <Link href="/categories" className="text-sm font-medium text-emerald hover:text-gold transition-colors hidden sm:block">
          View all
        </Link>
      </div>

      <div className="flex overflow-x-auto pb-6 hide-scrollbar gap-6 md:justify-between snap-x">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <Link 
              key={category.name} 
              href={category.href}
              className="flex flex-col items-center group min-w-[80px] snap-center"
            >
              <div className="w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center mb-4 text-gold group-hover:bg-gold group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-sm bg-white">
                <Icon strokeWidth={1.5} className="w-8 h-8" />
              </div>
              <span className="text-xs font-medium text-charcoal text-center group-hover:text-emerald transition-colors">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

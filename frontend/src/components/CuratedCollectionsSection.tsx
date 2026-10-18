"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Layers } from "lucide-react";

interface CollectionItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  badge: string;
  tags: { label: string; href: string }[];
  primaryHref: string;
}

const CURATED_COLLECTIONS: CollectionItem[] = [
  {
    id: "royal-heritage",
    title: "Royal Heritage & Grand Feasts",
    tagline: "Classical Opulence",
    description: "Regal architecture, heirloom brass detailing, grand sadya banquet halls and classical temple aesthetics.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    badge: "Heritage Signature",
    tags: [
      { label: "Venues", href: "/venues" },
      { label: "Catering", href: "/categories/catering" },
      { label: "Jewellery", href: "/categories/jewellery" },
    ],
    primaryHref: "/venues",
  },
  {
    id: "coastal-backwater",
    title: "Intimate Coastal & Backwater Vows",
    tagline: "Scenic Waterfronts",
    description: "Scenic waterfront lawns, sunset cinematography, breezy floral mandaps and open-air wedding receptions.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    badge: "Destination Edit",
    tags: [
      { label: "Venues", href: "/venues" },
      { label: "Photographers", href: "/photographers" },
      { label: "Decor", href: "/categories/decor-planning" },
    ],
    primaryHref: "/photographers",
  },
  {
    id: "contemporary-luxury",
    title: "Contemporary Luxury & Haute Couture",
    tagline: "Modern Glamour",
    description: "Modern ballroom elegance, bespoke designer sherwanis, contemporary lehengas and international styling.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    badge: "Couture Edit",
    tags: [
      { label: "Bridal Studio", href: "/categories/bridal-studio" },
      { label: "Groom Studio", href: "/categories/groom-studio" },
      { label: "Makeup", href: "/makeup" },
    ],
    primaryHref: "/categories/bridal-studio",
  },
  {
    id: "temple-traditions",
    title: "Temple Ceremonies & Sacred Artistry",
    tagline: "Timeless Rituals",
    description: "Authentic Kerala traditional decor, live nadhaswaram, brass oil lamps and handcrafted bridal mehendi.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    badge: "Traditional Edit",
    tags: [
      { label: "Decor", href: "/categories/decor-planning" },
      { label: "Mehendi", href: "/mehendi-artists" },
      { label: "Invitations", href: "/categories/invitations" },
    ],
    primaryHref: "/categories/decor-planning",
  },
];

export function CuratedCollectionsSection() {
  return (
    <section className="py-12 bg-[#FAF7F2] border-b border-[#C6A568]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#C6A568]/20 text-[#064E43] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A568]" /> Curated For You
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#242321]">
              Curated Wedding Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#242321]/65 max-w-xl">
              Editorial concepts combining verified venues, couture, and artistry for signature Kerala celebrations
            </p>
          </div>

          <Link
            href="/inspiration"
            className="hidden md:inline-flex items-center gap-1 text-sm font-bold text-[#064E43] hover:text-[#C6A568] transition-colors"
          >
            <span>Explore All Inspirations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Collections Grid (2 cols on tablet, 4 on desktop, scrollable on mobile) */}
        <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
          {CURATED_COLLECTIONS.map((col) => (
            <div
              key={col.id}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-auto snap-start bg-white rounded-2xl overflow-hidden border border-[#C6A568]/15 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                  <img
                    src={col.image}
                    alt={col.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-[#064E43]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider border border-white/10">
                    {col.badge}
                  </span>

                  <span className="absolute bottom-2.5 left-3 text-white/90 text-xs font-serif italic">
                    {col.tagline}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <h3 className="font-serif font-bold text-base md:text-lg text-[#242321] group-hover:text-[#064E43] transition-colors leading-snug">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#242321]/65 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>

                  {/* Category Pills inside the collection */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5">
                    {col.tags.map((tag) => (
                      <Link
                        key={tag.label}
                        href={tag.href}
                        className="text-[10.5px] font-semibold text-[#064E43] bg-[#FAF7F2] hover:bg-[#064E43] hover:text-white border border-[#C6A568]/20 px-2.5 py-1 rounded-full transition-colors"
                      >
                        {tag.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="p-4 sm:p-5 pt-0">
                <Link
                  href={col.primaryHref}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#064E43] text-[#064E43] hover:text-white border border-[#C6A568]/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs group-hover:border-[#064E43]"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/inspiration"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-[#C6A568]/20 text-[#064E43] font-bold text-xs shadow-2xs"
          >
            <span>Explore All Inspirations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}

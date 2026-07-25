"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Custom SVG Icons matching Picture 3 aesthetics
function VenueIcon({ className = "w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v2h18V7L12 2z" />
      <path d="M5 9v9" />
      <path d="M9 9v9" />
      <path d="M13 9v9" />
      <path d="M17 9v9" />
      <path d="M3 18h18" />
      <path d="M2 21h20" />
    </svg>
  );
}

function CameraIcon({ className = "w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function MakeupIcon({ className = "w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11v8a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-8" />
      <path d="M7 11h4" />
      <path d="M7 7.5a2.5 2.5 0 0 1 5 0V11H7V7.5z" />
      <path d="M16 4.5l3.5 3.5-7 12H9v-3.5l7-12z" />
    </svg>
  );
}

function DecorIcon({ className = "w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V11a7 7 0 0 1 14 0v10" />
      <path d="M8 21v-7a4 4 0 0 1 8 0v7" />
      <circle cx="12" cy="6" r="1.5" />
      <path d="M7 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      <path d="M17 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
  );
}

function MehendiIcon({ className = "w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V6a2 2 0 0 0-4 0v3" />
      <path d="M14 5V3a2 2 0 0 0-4 0v6" />
      <path d="M10 5a2 2 0 0 0-4 0v6" />
      <path d="M6 10a2 2 0 0 0-2 2v4a8 8 0 0 0 16 0v-5" />
      <circle cx="11" cy="14" r="1" />
    </svg>
  );
}

function DressIcon({ className = "w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6l1.5 4h-9L9 3z" />
      <path d="M7.5 7L4 21h16L16.5 7" />
      <path d="M12 7v14" />
    </svg>
  );
}

function JewelleryIcon({ className = "w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4c0 5.5 2.7 10 6 10s6-4.5 6-10" />
      <path d="M12 14v4" />
      <polygon points="12,18 9,21 15,21" />
      <circle cx="6" cy="4" r="1.5" />
      <circle cx="18" cy="4" r="1.5" />
    </svg>
  );
}

function InvitationsIcon({ className = "w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
      <circle cx="12" cy="13" r="1.5" />
    </svg>
  );
}

function GroomIcon({ className = "w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l-2 5H8L6 3z" />
      <path d="M8 8v13h8V8" />
      <path d="M12 8v13" />
    </svg>
  );
}

function CateringIcon({ className = "w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10h12a6 6 0 0 0-12 0z" />
      <path d="M12 4v2" />
      <path d="M4 14h16v6H4v-6z" />
    </svg>
  );
}

export type CategoryItem = {
  slug: string;
  title: string;
  subtitle: string;
  bgColor: string;
  href: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const showcaseCategories: CategoryItem[] = [
  {
    slug: "venues",
    title: "Venues",
    subtitle: "Banquets, Halls, Heritage Spaces & Gardens",
    bgColor: "#F3EFE6",
    href: "/venues",
    image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80",
    icon: VenueIcon,
  },
  {
    slug: "photographers",
    title: "Photographers",
    subtitle: "Candid, Traditional & Cinematic Stories",
    bgColor: "#E8EFE9",
    href: "/photographers",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    icon: CameraIcon,
  },
  {
    slug: "makeup",
    title: "Bridal Makeup",
    subtitle: "Bridal Makeup, Hair Styling & Salons",
    bgColor: "#F9ECE9",
    href: "/makeup",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    icon: MakeupIcon,
  },
  {
    slug: "decor-planning",
    title: "Decor & Planning",
    subtitle: "Floral Design, Decor Staging & Full Planning",
    bgColor: "#F6EFE2",
    href: "/categories/decor-planning",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    icon: DecorIcon,
  },
  {
    slug: "mehendi",
    title: "Mehendi",
    subtitle: "Bridal Mehendi Artists & Designs",
    bgColor: "#F7EBE5",
    href: "/categories/mehendi",
    image: "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=1200&q=80",
    icon: MehendiIcon,
  },
  {
    slug: "bridal-wear",
    title: "Bridal Wear",
    subtitle: "Lehengas, Sarees, Couture & Accessories",
    bgColor: "#F8F3EA",
    href: "/categories/bridal-wear",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=1200&q=80",
    icon: DressIcon,
  },
  {
    slug: "jewellery",
    title: "Jewellery",
    subtitle: "Bridal Jewellery, Polki, Kundan & Diamonds",
    bgColor: "#E8F1EC",
    href: "/categories/jewellery",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    icon: JewelleryIcon,
  },
  {
    slug: "invitations",
    title: "Invitations",
    subtitle: "Digital Invites, Printed Cards & Stationery",
    bgColor: "#F2ECF4",
    href: "/categories/invitations",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    icon: InvitationsIcon,
  },
  {
    slug: "groom-wear",
    title: "Groom Wear",
    subtitle: "Sherwanis, Tuxedos & Custom Suits",
    bgColor: "#EBEFF3",
    href: "/search?category=Groom",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    icon: GroomIcon,
  },
  {
    slug: "caterers",
    title: "Catering & Food",
    subtitle: "Curated Menus, Tastings & Live Counters",
    bgColor: "#F8F0E5",
    href: "/search?category=Catering",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80",
    icon: CateringIcon,
  },
];

export function CategoriesShowcase() {
  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-2 px-2 sm:px-4 md:px-6">
      <div className="max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto space-y-2 sm:space-y-2.5">
        {showcaseCategories.map((category, idx) => {
          const IconComponent = category.icon;
          return (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
            >
              <Link
                href={category.href}
                className="group relative block overflow-hidden rounded-[12px] sm:rounded-[14px] border border-black/5 shadow-[0_1px_6px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-[0.99]"
                style={{ backgroundColor: category.bgColor }}
              >
                <div className="relative flex min-h-[128px] sm:min-h-[148px] md:min-h-[168px] items-center">
                  {/* Left Text & Icon Section */}
                  <div className="flex flex-1 items-center gap-3 sm:gap-4 px-4 py-5 sm:px-6 sm:py-6 pr-[54%] sm:pr-[52%] z-10">
                    {/* Circle Icon Badge */}
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full border border-black/5 bg-[#FAF7F2] text-[#0F4C45] shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-transform duration-300 group-hover:scale-105">
                      <IconComponent className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>

                    {/* Category Title & Subtitle */}
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <h2 className="font-serif text-[22px] sm:text-[27px] font-bold text-[#0F4C45] leading-[1.08] tracking-tight">
                        {category.title}
                      </h2>
                      <p className="text-[13px] sm:text-[15px] font-sans text-[#5A6561] leading-[1.3] line-clamp-2 mt-1">
                        {category.subtitle}
                      </p>
                    </div>

                    {/* Dark Green Action Chevron Button */}
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#0F4C45] text-white shadow-xs transition-transform duration-300 group-hover:scale-110">
                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
                    </div>
                  </div>

                  {/* Right Slanted Image Section */}
                  <div
                    className="absolute inset-y-0 right-0 w-[54%] sm:w-[52%] overflow-hidden"
                    style={{
                      clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0% 100%)",
                    }}
                  >
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      sizes="(max-width: 640px) 54vw, 52vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={idx < 4}
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/5 via-transparent to-black/10" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

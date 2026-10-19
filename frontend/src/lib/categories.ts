import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  Cake,
  CarFront,
  Camera,
  ChefHat,
  Flower2,
  Gift,
  Gem,
  Mail,
  MapPinned,
  Music2,
  Package,
  Paintbrush,
  Plane,
  Shirt,
  Sparkles,
  Store,
  Users,
  Video,
} from "lucide-react";

export type CategorySlug =
  | "bridal-studio"
  | "groom-studio"
  | "wedding-studio"
  | "venues"
  | "photographers"
  | "videographers"
  | "makeup"
  | "mehendi"
  | "decor-planning"
  | "wedding-planners"
  | "caterers"
  | "jewellery"
  | "invitation-designers"
  | "cakes-desserts"
  | "entertainment"
  | "choreographers"
  | "car-rentals"
  | "flower-decoration"
  | "wedding-gifts"
  | "honeymoon"
  | "rental-services";

export type CanonicalCategoryDefinition = {
  slug: CategorySlug;
  title: string;
  aliases: string[];
  description: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
  badge: string;
  detail: string;
  chips: string[];
  searchPlaceholder: string;
  hasDashboard: boolean;
};

export type CategoryCard = CanonicalCategoryDefinition;

const sharedThumb = {
  weddingVenue: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
  couplePortrait: "/images/wedding-studio-cover.png",
  bridalMakeup: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
  floralDecor: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
  henna: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
  bridalWear: "/images/bridal-studio-cover.png",
  jewellery: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80",
  invitation: "/images/invitations-cover.png",
  cake: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?auto=format&fit=crop&w=1200&q=80",
  entertainment: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
  car: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  flowers: "https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80",
  travel: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  rental: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
};

export interface HomepageCategoryItem {
  label: string;
  href: string;
  img: string;
  alt: string;
  vendorCount?: string;
  badge?: string;
}

export const HOMEPAGE_CATEGORY_STRIP: HomepageCategoryItem[] = [
  {
    label: "Photographers",
    href: "/photographers",
    img: "/images/photographers-cover.png",
    alt: "Wedding Photographers",
    vendorCount: "320 Vendors",
    badge: "Trending",
  },
  {
    label: "Invitations",
    href: "/categories/invitations",
    img: "/images/invitations-cover.png",
    alt: "Wedding Invitations",
    vendorCount: "180+ Designs",
    badge: "Popular",
  },
  {
    label: "Catering",
    href: "/categories/catering",
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80",
    alt: "Wedding Catering",
    vendorCount: "150 Caterers",
  },
  {
    label: "Bridal Studio",
    href: "/categories/bridal-studio",
    img: "/images/bridal-studio-cover.png",
    alt: "Bridal Studio",
    vendorCount: "210 Studios",
    badge: "Most Booked",
  },
  {
    label: "Venues",
    href: "/venues",
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80",
    alt: "Wedding Venues",
    vendorCount: "240 Venues",
  },
  {
    label: "Wedding Studio",
    href: "/categories/wedding-studio",
    img: "/images/wedding-studio-cover.png",
    alt: "Wedding Studio",
    vendorCount: "190 Studios",
  },
  {
    label: "Makeup",
    href: "/makeup",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
    alt: "Bridal Makeup",
    vendorCount: "280 Artists",
  },
  {
    label: "Groom Studio",
    href: "/categories/groom-studio",
    img: "/images/groom-wear-cover.png",
    alt: "Groom Studio",
    vendorCount: "140 Studios",
  },
  {
    label: "Decor",
    href: "/categories/decor-planning",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80",
    alt: "Wedding Decor",
    vendorCount: "175 Planners",
  }
];

export const CANONICAL_VENDOR_CATEGORIES: CanonicalCategoryDefinition[] = [
  {
    slug: "bridal-studio",
    title: "Bridal Studio",
    aliases: [
      "bridal studio",
      "bride studio",
      "bridal wear",
      "bridalwear",
      "bridal boutique",
      "bride's story",
      "brides-story",
      "bridal-wear",
      "bridal-boutique"
    ],
    description: "Exclusive bridal lehengas, silk sarees, Nikah dresses & ceremony couture.",
    icon: Sparkles,
    image: "/images/bridal-studio-cover.png",
    imageAlt: "Luxury bridal couture displayed in a boutique setting.",
    badge: "Bridal Studio",
    detail: "Discover designer bridal lehengas, Christian gowns, Kerala sarees, and ceremony edits.",
    chips: ["Lehengas", "Bridal Sarees", "Gowns", "Custom fits"],
    searchPlaceholder: "Search bridal studios, lehengas, sarees...",
    hasDashboard: true,
  },
  {
    slug: "groom-studio",
    title: "Groom Studio",
    aliases: [
      "groom studio",
      "groom wear",
      "groomwear",
      "groom's story",
      "grooms-story",
      "groom-wear"
    ],
    description: "Bespoke sherwanis, tuxedos, Jodhpuri suits & modern ceremonial groom wear.",
    icon: Shirt,
    image: "/images/groom-wear-cover.png",
    imageAlt: "Elegant wedding fashion styling for the groom.",
    badge: "Groom Studio",
    detail: "Find refined sherwanis, bandhgalas, tuxedos, and tailored groom wear edits.",
    chips: ["Sherwanis", "Tuxedos", "Jodhpuri Suits", "Custom fits"],
    searchPlaceholder: "Search groom studios, sherwanis, suits...",
    hasDashboard: true,
  },
  {
    slug: "wedding-studio",
    title: "Wedding Studio",
    aliases: [
      "wedding studio",
      "wedding story",
      "weddingstory",
      "wedding-story"
    ],
    description: "Complete bridal & groom ceremonial couture, wedding edits & couple ensembles.",
    icon: Store,
    image: "/images/wedding-studio-cover.png",
    imageAlt: "Couples wedding couture and ceremonial edits.",
    badge: "Wedding Studio",
    detail: "Curated wedding fashion studios offering complete bridal and groom ceremonial edits.",
    chips: ["Bridal & Groom", "Couple Edits", "Custom Tailoring"],
    searchPlaceholder: "Search wedding studios, couple couture...",
    hasDashboard: true,
  },
  {
    slug: "venues",
    title: "Wedding Venues",
    aliases: [
      "wedding venues",
      "wedding venue",
      "venues",
      "venue",
      "banquet",
      "banquets",
      "banquet hall",
      "palace",
      "resort"
    ],
    description: "Banquet halls, lawns, and heritage spaces with beautiful settings.",
    icon: MapPinned,
    image: sharedThumb.weddingVenue,
    imageAlt: "A decorated luxury wedding venue with floral arch and aisle seating.",
    badge: "Destination spaces",
    detail: "Browse premium venues designed for vows, receptions, and grand celebrations.",
    chips: ["Banquets", "Lawns", "Heritage venues"],
    searchPlaceholder: "Search venues by name, city, or venue type...",
    hasDashboard: true,
  },
  {
    slug: "photographers",
    title: "Photographers",
    aliases: [
      "photographers",
      "photographer",
      "photography",
      "wedding photographers",
      "wedding photographer"
    ],
    description: "Candid, traditional, and cinematic storytelling for your day.",
    icon: Camera,
    image: "/images/photographers-cover.png",
    imageAlt: "A wedding couple photographed in an intimate portrait moment.",
    badge: "Storytelling",
    detail: "Explore photographers who capture the feeling, the details, and the in-between moments.",
    chips: ["Candid", "Traditional", "Editorial"],
    searchPlaceholder: "Search photographers by name, style, or city...",
    hasDashboard: true,
  },
  {
    slug: "videographers",
    title: "Videographers",
    aliases: [
      "videographers",
      "videographer",
      "videography",
      "wedding videographers"
    ],
    description: "Film teams creating luxury highlights, reels, and feature edits.",
    icon: Video,
    image: sharedThumb.entertainment,
    imageAlt: "A cinematic wedding production setup with lights and motion.",
    badge: "Motion-led",
    detail: "Choose a film style that turns your celebration into a timeless moving story.",
    chips: ["Highlight films", "Reels", "Drone coverage"],
    searchPlaceholder: "Search videographers by style, city...",
    hasDashboard: true,
  },
  {
    slug: "makeup",
    title: "Bridal Makeup",
    aliases: [
      "bridal makeup",
      "makeup",
      "makeup artist",
      "makeup artists",
      "makeup-artist",
      "makeup-artists",
      "bridal makeup & hair"
    ],
    description: "Soft glam, bridal looks, and finishing touches that photograph beautifully.",
    icon: Sparkles,
    image: sharedThumb.bridalMakeup,
    imageAlt: "Premium bridal makeup close-up with warm, polished lighting.",
    badge: "Bridal beauty",
    detail: "Find artists who balance long-wear comfort with polished wedding-day elegance.",
    chips: ["Soft glam", "Hair styling", "Touch-up kits"],
    searchPlaceholder: "Search makeup artists by name, service, or city...",
    hasDashboard: true,
  },
  {
    slug: "mehendi",
    title: "Mehendi Artists",
    aliases: [
      "mehendi artists",
      "mehendi artist",
      "mehendi",
      "mehndi",
      "mehndi artists",
      "mehndi artist",
      "mehendi-artist",
      "mehendi-artists"
    ],
    description: "Traditional motifs, modern detailing, and custom bridal designs.",
    icon: Paintbrush,
    image: sharedThumb.henna,
    imageAlt: "Intricate mehendi patterns on a bride's hands.",
    badge: "Artistry",
    detail: "Browse artists for delicate initials, elaborate patterns, and ceremony-ready detailing.",
    chips: ["Bridal mehendi", "Guest packages", "Custom motifs"],
    searchPlaceholder: "Search mehendi artists by name or design style...",
    hasDashboard: true,
  },
  {
    slug: "decor-planning",
    title: "Decor & Planning",
    aliases: [
      "decor & planning",
      "decor-planning",
      "wedding decorators",
      "decorator",
      "decorators",
      "wedding decor",
      "decor"
    ],
    description: "Florals, staging, and full-event styling with a luxury finish.",
    icon: Flower2,
    image: sharedThumb.floralDecor,
    imageAlt: "A floral wedding stage designed with warm lights and premium styling.",
    badge: "Full service",
    detail: "From mood boards to the final aisle setup, everything is styled with intention.",
    chips: ["Floral design", "Stage styling", "Vendor coordination"],
    searchPlaceholder: "Search wedding planners and decor specialists...",
    hasDashboard: true,
  },
  {
    slug: "wedding-planners",
    title: "Wedding Planners",
    aliases: [
      "wedding planners",
      "wedding planner",
      "planners",
      "planner",
      "event management"
    ],
    description: "Trusted planners for timelines, budgets, and calm execution.",
    icon: BriefcaseBusiness,
    image: sharedThumb.weddingVenue,
    imageAlt: "A wedding planning setup with elegant stationery and floral details.",
    badge: "Planning support",
    detail: "Get structured planning help for the logistics that keep the day effortless.",
    chips: ["Budgeting", "Timeline support", "On-day coordination"],
    searchPlaceholder: "Search wedding planners...",
    hasDashboard: true,
  },
  {
    slug: "caterers",
    title: "Caterers",
    aliases: [
      "caterers",
      "caterer",
      "catering",
      "catering services",
      "wedding caterers",
      "food"
    ],
    description: "Menu curation, tasting tables, and crowd-pleasing service.",
    icon: ChefHat,
    image: sharedThumb.cake,
    imageAlt: "Luxury wedding food presentation on a beautifully styled table.",
    badge: "Hospitality",
    detail: "Discover caterers who balance presentation, flavour, and seamless service.",
    chips: ["Tastings", "Regional menus", "Live counters"],
    searchPlaceholder: "Search caterers by cuisine, food counters...",
    hasDashboard: true,
  },
  {
    slug: "jewellery",
    title: "Jewellery",
    aliases: [
      "jewellery",
      "jewelry",
      "jewellery store",
      "jewellery-store",
      "bridal jewellery"
    ],
    description: "Polki, kundan, and contemporary bridal jewellery edits.",
    icon: Gem,
    image: sharedThumb.jewellery,
    imageAlt: "Premium bridal jewellery arranged with pearls and gold detailing.",
    badge: "Heirloom shine",
    detail: "Shop elegant sets designed to complement traditional and modern bridal looks.",
    chips: ["Polki", "Kundan", "Custom sets"],
    searchPlaceholder: "Search bridal jewellery sets, Kundan, Polki...",
    hasDashboard: true,
  },
  {
    slug: "invitation-designers",
    title: "Invitation Designers",
    aliases: [
      "invitation designers",
      "invitation designer",
      "invitations",
      "invitation",
      "wedding invitations",
      "invitation & cards"
    ],
    description: "Printed suites, digital invites, and signature stationery.",
    icon: Mail,
    image: "/images/invitations-cover.png",
    imageAlt: "Luxury wedding invitation suite with elegant floral stationery.",
    badge: "Paper & digital",
    detail: "Find invitation studios that bring your wedding identity into every card and envelope.",
    chips: ["Printed suites", "Digital invites", "Custom monograms"],
    searchPlaceholder: "Search invitation designers, templates...",
    hasDashboard: true,
  },
  {
    slug: "cakes-desserts",
    title: "Cakes & Desserts",
    aliases: [
      "cakes & desserts",
      "cakes-desserts",
      "cake designer",
      "baker"
    ],
    description: "Statement cakes, dessert tables, and sweet finishing touches.",
    icon: Cake,
    image: sharedThumb.cake,
    imageAlt: "A refined wedding cake and dessert presentation.",
    badge: "Sweet moments",
    detail: "Choose dessert creators who style and serve the final course beautifully.",
    chips: ["Custom cakes", "Dessert tables", "Signature flavours"],
    searchPlaceholder: "Search wedding cakes & bakeries...",
    hasDashboard: false,
  },
  {
    slug: "entertainment",
    title: "Entertainment",
    aliases: [
      "entertainment",
      "dj & music",
      "djs & live bands",
      "wedding entertainment"
    ],
    description: "Live acts, DJs, and show-stopping guest experiences.",
    icon: Music2,
    image: sharedThumb.entertainment,
    imageAlt: "Wedding entertainment with lights and performance energy.",
    badge: "Celebration energy",
    detail: "Book entertainment that keeps the evening moving and the dance floor full.",
    chips: ["Live music", "DJ sets", "Stage acts"],
    searchPlaceholder: "Search wedding entertainment...",
    hasDashboard: false,
  },
  {
    slug: "choreographers",
    title: "Choreographers",
    aliases: ["choreographers", "choreographer"],
    description: "First-dance routines and family performances, made simple.",
    icon: Users,
    image: sharedThumb.entertainment,
    imageAlt: "A wedding dance rehearsal moment with performance lighting.",
    badge: "Dance direction",
    detail: "Find choreography partners who make every performance feel polished and fun.",
    chips: ["Family routines", "First dances", "Performance sets"],
    searchPlaceholder: "Search wedding choreographers...",
    hasDashboard: false,
  },
  {
    slug: "car-rentals",
    title: "Car Rentals",
    aliases: ["car rentals", "car rental", "car-rental"],
    description: "Vintage arrivals, luxury transport, and wedding day logistics.",
    icon: CarFront,
    image: sharedThumb.car,
    imageAlt: "A premium vintage car ready for wedding arrival photography.",
    badge: "Arrival details",
    detail: "Rent elegant transport that complements your entry, exit, and photo moments.",
    chips: ["Vintage cars", "Luxury sedans", "Procession vehicles"],
    searchPlaceholder: "Search wedding car rentals...",
    hasDashboard: false,
  },
  {
    slug: "flower-decoration",
    title: "Flower Decoration",
    aliases: ["flower decoration", "flower-decoration"],
    description: "Aisle styling, mandap florals, and scented venue details.",
    icon: Flower2,
    image: sharedThumb.flowers,
    imageAlt: "Fresh floral arrangements in warm premium lighting.",
    badge: "Botanical styling",
    detail: "Bring the venue to life with florals that feel cohesive, lush, and premium.",
    chips: ["Mandaps", "Aisles", "Table florals"],
    searchPlaceholder: "Search floral decorators...",
    hasDashboard: false,
  },
  {
    slug: "wedding-gifts",
    title: "Wedding Gifts",
    aliases: ["wedding gifts", "wedding-gifts", "gift shop", "gift store"],
    description: "Curated favours and keepsakes for guests and family.",
    icon: Gift,
    image: sharedThumb.rental,
    imageAlt: "Elegant wedding favour boxes and keepsake gifting details.",
    badge: "Thoughtful gifting",
    detail: "Pick gifts that feel personal, polished, and worth remembering after the celebration.",
    chips: ["Guest favours", "Return gifts", "Curated hampers"],
    searchPlaceholder: "Search wedding favours and gifts...",
    hasDashboard: false,
  },
  {
    slug: "honeymoon",
    title: "Honeymoon",
    aliases: ["honeymoon", "honeymoon planner", "travel"],
    description: "Romantic getaways and travel planning after the celebration.",
    icon: Plane,
    image: sharedThumb.travel,
    imageAlt: "A serene travel scene for a honeymoon getaway.",
    badge: "After the vows",
    detail: "Explore destination ideas and curated travel experiences for your first trip together.",
    chips: ["Beach escapes", "Romantic stays", "Travel planning"],
    searchPlaceholder: "Search honeymoon packages and travel planners...",
    hasDashboard: false,
  },
  {
    slug: "rental-services",
    title: "Rental Services",
    aliases: ["rental services", "rental-services", "rental store"],
    description: "Furniture, props, and event essentials for a seamless setup.",
    icon: Package,
    image: sharedThumb.rental,
    imageAlt: "Premium event props and rental items arranged for a wedding setup.",
    badge: "Event essentials",
    detail: "Find the practical details that make your venue feel complete and polished.",
    chips: ["Furniture", "Props", "Event essentials"],
    searchPlaceholder: "Search event rental services...",
    hasDashboard: false,
  },
];

/**
 * SINGLE CANONICAL REGISTRATION DROPDOWN LIST
 * Derived directly from CANONICAL_VENDOR_CATEGORIES to ensure absolute 1-to-1 sync.
 */
export const VENDOR_REGISTRATION_CATEGORIES: string[] = CANONICAL_VENDOR_CATEGORIES.map(
  (c) => c.title
);

/**
 * Normalizes any raw category string (slug, title, or alias) into a canonical category object.
 * Returns null if the category string is completely unmapped or unrecognized.
 */
export function normalizeCategory(rawCategory: string | null | undefined): CanonicalCategoryDefinition | null {
  if (!rawCategory) return null;
  let clean = rawCategory.toLowerCase().trim();

  // Strip generated random suffixes like "-4599" or "-3744" if present
  clean = clean.replace(/-\d{3,5}$/, "");

  // 1. Direct match on canonical slug
  const bySlug = CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === clean);
  if (bySlug) return bySlug;

  // 2. Direct match on canonical title (case-insensitive)
  const byTitle = CANONICAL_VENDOR_CATEGORIES.find((c) => c.title.toLowerCase() === clean);
  if (byTitle) return byTitle;

  // 3. Match against aliases
  const byAlias = CANONICAL_VENDOR_CATEGORIES.find((c) =>
    c.aliases.some((alias) => alias.toLowerCase() === clean)
  );
  if (byAlias) return byAlias;

  // 4. Fuzzy fallback for legacy string variants
  if (clean.includes("bride") && (clean.includes("studio") || clean.includes("boutique") || clean.includes("wear") || clean.includes("story"))) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "bridal-studio") || null;
  }
  if (clean.includes("groom") && (clean.includes("studio") || clean.includes("wear") || clean.includes("story"))) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "groom-studio") || null;
  }
  if (clean.includes("wedding") && (clean.includes("studio") || clean.includes("story"))) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "wedding-studio") || null;
  }
  if (clean.includes("photo") || clean.includes("camera") || clean.includes("video") || clean.includes("film")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "photographers") || null;
  }
  if (clean.includes("makeup") || clean.includes("glam") || clean.includes("beauty")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "makeup") || null;
  }
  if (clean.includes("mehendi") || clean.includes("henna") || clean.includes("mehndi")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "mehendi") || null;
  }
  if (clean.includes("venue") || clean.includes("palace") || clean.includes("lawn") || clean.includes("banquet")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "venues") || null;
  }
  if (clean.includes("cater") || clean.includes("food") || clean.includes("dining")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "caterers") || null;
  }
  if (clean.includes("invite") || clean.includes("card") || clean.includes("papyrus")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "invitation-designers") || null;
  }
  if (clean.includes("jewel") || clean.includes("polki") || clean.includes("gold") || clean.includes("ornament")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "jewellery") || null;
  }
  if (clean.includes("decor") || clean.includes("planner")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "decor-planning") || null;
  }

  // Unrecognized
  return null;
}

export const categories: CategoryCard[] = CANONICAL_VENDOR_CATEGORIES;

const categoryMap = new Map(categories.map((category) => [category.slug, category]));

export function getCategoryBySlug(slug: string): CategoryCard | null {
  const norm = normalizeCategory(slug);
  return norm ? categoryMap.get(norm.slug) ?? norm : null;
}

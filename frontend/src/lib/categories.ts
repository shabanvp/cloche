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
  weddingVenue: "/images/venues-cover.png",
  couplePortrait: "/images/wedding-studio-cover.png",
  bridalMakeup: "/images/makeup-cover.png",
  floralDecor: "/images/decor-planning-cover.png",
  henna: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
  bridalWear: "/images/bridal-studio-cover.png",
  jewellery: "/images/jewellery-cover.png",
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
    img: "/images/photographers-cover-new.jpg",
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
    img: "/images/venues-cover.png",
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
    img: "/images/makeup-cover.png",
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
    img: "/images/decor-planning-cover.png",
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
    image: sharedThumb.floralDecor,
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
 * COMPLETE DATABASE CATEGORY UUID MAP (All 37 verified Supabase vendor_categories)
 * Ensures 100% authoritative resolution directly from database foreign keys.
 */
export const DB_CATEGORY_UUID_MAP: Record<string, CategorySlug> = {
  // Venues
  "c48253f9-f7e8-4cea-b296-22a4cf8890dc": "venues",
  "a399b49f-cb4a-43cf-ae1b-0412adf1def6": "venues",

  // Makeup
  "06260436-4efe-488f-afe2-4f41e3d9d0f1": "makeup",
  "6b83da0e-0a96-4d6c-acd4-b1f6156fcbdc": "makeup",

  // Mehendi
  "554d5532-9201-4af5-be43-41e9c1775b0f": "mehendi",
  "1b8af477-920d-43e8-8c20-a191e934f170": "mehendi",

  // Photography & Videography
  "f31182bb-8edb-4356-8a80-fc3ba8e3557b": "photographers",
  "5ea30983-409d-4263-b059-0061c3e583d3": "photographers",
  "04b8ec8d-547b-4496-8f19-29e5a1266cc3": "videographers",

  // Bridal Studio & Wear
  "2c7e34e1-5945-473b-95ea-a1db34c6c01b": "bridal-studio",
  "2dbc5693-441e-4862-9665-14b84f0a3224": "bridal-studio",
  "320dd9e4-a7ae-462a-9c07-ce87e9a9775a": "bridal-studio",
  "ef5e9695-ab30-4956-b313-a036c9734259": "bridal-studio",

  // Groom Studio & Wear
  "83d80c46-baae-464a-865e-5a5601890401": "groom-studio",
  "b16079a5-4317-4edd-ba04-a2a8ac34f017": "groom-studio",

  // Wedding Studio
  "3c71464e-89cd-4ffe-aaeb-ae6e95bcacff": "wedding-studio",

  // Catering
  "d4136a98-75f1-4b6d-8cc6-ce0804a44c96": "caterers",
  "a4332a96-8f1f-4a64-bf96-2a9ad53d40b7": "caterers",

  // Decor & Planning
  "2aa8b8c6-c08d-4b85-9dc7-dfbbd85d935c": "decor-planning",
  "697350dd-7410-461f-a8de-d0c44c315411": "decor-planning",
  "b32e1241-eb9c-4cb4-8a26-327dfbc83085": "wedding-planners",
  "0a02500f-575a-4730-8f04-826048891db6": "wedding-planners",

  // Jewellery
  "5466a413-0225-4622-833f-ef71edc2331a": "jewellery",
  "59264ef6-683d-4092-90c9-42fec2ca3900": "jewellery",

  // Invitations
  "f00cf9ac-0f5b-4703-8806-4d25103ecf9b": "invitation-designers",
  "048a9853-dfc2-4d41-ad9f-237e5ef1ff3d": "invitation-designers",

  // Cakes & Desserts
  "4999a399-7c55-4888-9b7a-ceb7bda2a9e1": "cakes-desserts",

  // Car Rental
  "c01f459c-a2ce-44b9-bb4e-e3957b165018": "car-rentals",

  // Flower Decoration
  "e91a6f1d-b52c-47a8-8efe-1da6940da8a9": "flower-decoration",

  // Gifts
  "0821bf63-6b02-4439-9940-bbf2b2bd06b2": "wedding-gifts",

  // Honeymoon
  "df6d44b0-eb67-4b5d-b7d1-b735339a81cf": "honeymoon",

  // Rental Services
  "5b272e74-3fdc-4f1c-966d-3dc7850aa2aa": "rental-services",

  // Entertainment & Dance
  "7f50c55c-beae-4cf0-8e23-27cfe5e54ce5": "choreographers",
  "9c218105-b61a-4550-982e-90a2ac9b6ce8": "entertainment",
  "35bbad46-6424-4dfc-928f-3152b1d5b69f": "entertainment",
  "83970cf4-f705-4ba2-af08-ad3a41384a40": "entertainment",

  // Other
  "b227bbd5-394c-4eb6-bc69-c26c9d7319d4": "wedding-studio",
};

/**
 * SINGLE CANONICAL REGISTRATION DROPDOWN LIST
 * Derived directly from CANONICAL_VENDOR_CATEGORIES to ensure absolute 1-to-1 sync.
 */
export const VENDOR_REGISTRATION_CATEGORIES: string[] = CANONICAL_VENDOR_CATEGORIES.map(
  (c) => c.title
);

/**
 * Normalizes any raw category identifier (UUID, slug, title, or alias) into a canonical category object.
 * Returns null if the category string is completely unmapped or unrecognized.
 */
export function normalizeCategory(rawCategory: string | null | undefined): CanonicalCategoryDefinition | null {
  if (!rawCategory) return null;
  const rawTrimmed = String(rawCategory).trim();
  const rawLower = rawTrimmed.toLowerCase();

  // 0. Direct UUID lookup from database category identifiers
  if (DB_CATEGORY_UUID_MAP[rawTrimmed] || DB_CATEGORY_UUID_MAP[rawLower]) {
    const slug = DB_CATEGORY_UUID_MAP[rawTrimmed] || DB_CATEGORY_UUID_MAP[rawLower];
    const match = CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === slug);
    if (match) return match;
  }

  // Strip generated random suffixes like "-4599" or "-3744" if present
  let clean = rawLower.replace(/-\d{3,5}$/, "");

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
  if (clean.includes("bride") && (clean.includes("studio") || clean.includes("boutique") || clean.includes("wear") || clean.includes("story") || clean.includes("lehenga") || clean.includes("saree"))) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "bridal-studio") || null;
  }
  if (clean.includes("groom") && (clean.includes("studio") || clean.includes("wear") || clean.includes("story") || clean.includes("sherwani") || clean.includes("suit"))) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "groom-studio") || null;
  }
  if (clean.includes("wedding") && (clean.includes("studio") || clean.includes("story"))) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "wedding-studio") || null;
  }
  if (clean.includes("video") || clean.includes("film") || clean.includes("cinemat")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "videographers") || null;
  }
  if (clean.includes("photo") || clean.includes("camera")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "photographers") || null;
  }
  if (clean.includes("makeup") || clean.includes("glam") || clean.includes("beauty")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "makeup") || null;
  }
  if (clean.includes("mehendi") || clean.includes("henna") || clean.includes("mehndi")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "mehendi") || null;
  }
  if (clean.includes("venue") || clean.includes("palace") || clean.includes("lawn") || clean.includes("banquet") || clean.includes("auditorium") || clean.includes("resort")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "venues") || null;
  }
  if (clean.includes("cater") || clean.includes("food") || clean.includes("dining") || clean.includes("sadya")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "caterers") || null;
  }
  if (clean.includes("invite") || clean.includes("card") || clean.includes("papyrus") || clean.includes("stationery")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "invitation-designers") || null;
  }
  if (clean.includes("jewel") || clean.includes("polki") || clean.includes("gold") || clean.includes("ornament") || clean.includes("diamond")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "jewellery") || null;
  }
  if (clean.includes("planner") || clean.includes("planners")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "wedding-planners") || null;
  }
  if (clean.includes("decor") || clean.includes("mandap") || clean.includes("stage")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "decor-planning") || null;
  }
  if (clean.includes("cake") || clean.includes("bake") || clean.includes("dessert")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "cakes-desserts") || null;
  }
  if (clean.includes("car") || clean.includes("transport")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "car-rentals") || null;
  }
  if (clean.includes("flower") || clean.includes("floral")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "flower-decoration") || null;
  }
  if (clean.includes("gift") || clean.includes("favor")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "wedding-gifts") || null;
  }
  if (clean.includes("honeymoon") || clean.includes("travel") || clean.includes("trip")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "honeymoon") || null;
  }
  if (clean.includes("rental")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "rental-services") || null;
  }
  if (clean.includes("dj") || clean.includes("music") || clean.includes("band") || clean.includes("entertain")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "entertainment") || null;
  }
  if (clean.includes("choreo") || clean.includes("dance")) {
    return CANONICAL_VENDOR_CATEGORIES.find((c) => c.slug === "choreographers") || null;
  }

  return null;
}

/**
 * Gets a high quality category-specific fallback image so cards never show
 * the wrong category's cover image.
 */
export function getCategoryFallbackImage(category: string | null | undefined): string {
  const norm = normalizeCategory(category);
  if (norm?.image) return norm.image;

  const cat = (category || "").toLowerCase();
  if (cat.includes("venue") || cat.includes("hall") || cat.includes("palace") || cat.includes("resort") || cat.includes("auditorium")) {
    return "/images/venues-cover.png";
  }
  if (cat.includes("photo") || cat.includes("camera") || cat.includes("video")) {
    return "/images/photographers-cover.png";
  }
  if (cat.includes("makeup") || cat.includes("glam") || cat.includes("beauty")) {
    return "/images/makeup-cover.png";
  }
  if (cat.includes("mehendi") || cat.includes("mehndi") || cat.includes("henna")) {
    return "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80";
  }
  if (cat.includes("bridal") || cat.includes("sari") || cat.includes("lehenga")) {
    return "/images/bridal-studio-cover.png";
  }
  if (cat.includes("groom") || cat.includes("sherwani") || cat.includes("suit")) {
    return "/images/groom-wear-cover.png";
  }
  if (cat.includes("cater") || cat.includes("food") || cat.includes("sadya")) {
    return "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80";
  }
  if (cat.includes("decor") || cat.includes("flower") || cat.includes("planner")) {
    return "/images/decor-planning-cover.png";
  }
  if (cat.includes("invite") || cat.includes("card")) {
    return "/images/invitations-cover.png";
  }
  if (cat.includes("jewel") || cat.includes("gold") || cat.includes("ornament")) {
    return "/images/jewellery-cover.png";
  }
  return "/images/wedding-studio-cover.png";
}

/**
 * Resolves the primary public category discovery URL (e.g. /venues, /makeup, /photographers)
 */
export function getCategoryDiscoveryHref(category: string | null | undefined): string {
  const norm = normalizeCategory(category);
  const slug = norm?.slug;

  if (slug === "venues") return "/venues";
  if (slug === "photographers") return "/photographers";
  if (slug === "makeup") return "/makeup";
  if (slug === "mehendi") return "/mehendi-artists";
  if (slug === "caterers") return "/catering";
  if (slug === "decor-planning") return "/decor-planning";
  if (slug === "invitation-designers") return "/invitations";
  if (slug === "jewellery") return "/jewellery";
  if (slug === "bridal-studio") return "/categories/bridal-studio";
  if (slug === "groom-studio") return "/categories/groom-studio";
  if (slug === "wedding-studio") return "/wedding-story";
  if (slug) return `/categories/${slug}`;

  return "/vendors";
}

/**
 * Resolves the canonical profile URL for any vendor
 */
export function getCategoryStorefrontHref(vendorIdOrSlug: string): string {
  return `/boutiques/${vendorIdOrSlug}`;
}

export const categories: CategoryCard[] = CANONICAL_VENDOR_CATEGORIES;

const categoryMap = new Map(categories.map((category) => [category.slug, category]));

export function getCategoryBySlug(slug: string): CategoryCard | null {
  const norm = normalizeCategory(slug);
  return norm ? categoryMap.get(norm.slug) ?? norm : null;
}


import { 
  Building2, 
  Camera, 
  Sparkles, 
  Palette as PaletteIcon, 
  Wand2, 
  UtensilsCrossed, 
  Mail, 
  Gem,
  Shirt,
  Store,
  LucideIcon
} from "lucide-react";

import { VENDOR_REGISTRATION_CATEGORIES, normalizeCategory } from "./categories";
export { VENDOR_REGISTRATION_CATEGORIES };


// ==========================================
// 1. PUBLIC CATEGORY LISTING TYPES & DATA
// ==========================================

export interface VendorCategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  rating: number;
  reviewsCount: number;
  location: string;
  startingPrice: string;
  badge?: string;
  verified?: boolean;
  specialtyTag?: string;
  subCategory?: string;
  priceSuffix?: string;
}

export interface CategoryConfig {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  searchPlaceholder: string;
  subFilters: Array<{ label: string; value: string }>;
  subCategories?: Array<{ id: string; name: string }>;
  vendors: VendorCategoryItem[];
  priceSuffix?: string;
}

export const VENDOR_CATEGORIES_DATA: Record<string, CategoryConfig> = {
  venues: {
    slug: "venues",
    title: "Wedding Venues",
    subtitle: "Explore luxury banquet halls, royal palaces, grand lawns & beachside resorts",
    heroImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search venues by name, city, or venue type...",
    priceSuffix: " / event",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Banquet Halls", value: "banquet" },
      { label: "Grand Lawns", value: "lawn" },
      { label: "Palaces", value: "palace" },
      { label: "Resorts", value: "resort" }
    ],
    subCategories: [
      { id: "all", name: "All Venues" },
      { id: "banquet", name: "Banquet Halls" },
      { id: "lawn", name: "Grand Lawns" },
      { id: "palace", name: "Heritage Palaces" },
      { id: "resort", name: "Beach Resorts" }
    ],
    vendors: []
  },
  photographers: {
    slug: "photographers",
    title: "Wedding Photographers",
    subtitle: "Capture timeless candid moments, cinematic wedding films & pre-wedding shoots",
    heroImage: "/images/photographers-cover.png",
    searchPlaceholder: "Search photographers by name, style, or city...",
    priceSuffix: " / day",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Candid", value: "candid" },
      { label: "Cinematic", value: "cinematic" },
      { label: "Pre-Wedding", value: "pre-wedding" }
    ],
    subCategories: [
      { id: "all", name: "All Photographers" },
      { id: "candid", name: "Candid Photography" },
      { id: "cinematic", name: "Cinematic Film" },
      { id: "pre-wedding", name: "Pre-Wedding Shoot" }
    ],
    vendors: []
  },
  makeup: {
    slug: "makeup",
    title: "Bridal Makeup & Hair",
    subtitle: "Transform your wedding look with expert HD & airbrush makeup artists",
    heroImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search makeup artists by name, service, or city...",
    priceSuffix: " / function",
    subFilters: [
      { label: "All", value: "all" },
      { label: "HD Bridal", value: "hd" },
      { label: "Airbrush Glam", value: "airbrush" },
      { label: "Party Makeup", value: "party" }
    ],
    subCategories: [
      { id: "all", name: "All Artists" },
      { id: "hd", name: "HD Bridal" },
      { id: "airbrush", name: "Airbrush Glam" },
      { id: "party", name: "Party Makeup" }
    ],
    vendors: []
  },
  "makeup-artists": {
    slug: "makeup-artists",
    title: "Bridal Makeup & Hair",
    subtitle: "Transform your wedding look with expert HD & airbrush makeup artists",
    heroImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search makeup artists by name, service, or city...",
    priceSuffix: " / function",
    subFilters: [
      { label: "All", value: "all" },
      { label: "HD Bridal", value: "hd" },
      { label: "Airbrush Glam", value: "airbrush" },
      { label: "Party Makeup", value: "party" }
    ],
    subCategories: [
      { id: "all", name: "All Artists" },
      { id: "hd", name: "HD Bridal" },
      { id: "airbrush", name: "Airbrush Glam" },
      { id: "party", name: "Party Makeup" }
    ],
    vendors: []
  },
  mehendi: {
    slug: "mehendi",
    title: "Mehndi & Henna Artists",
    subtitle: "Bespoke bridal henna designs, Rajasthani figure portraits & Arabic patterns",
    heroImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search mehendi artists by name or design style...",
    priceSuffix: " / bridal",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Rajasthani", value: "rajasthani" },
      { label: "Arabic", value: "arabic" },
      { label: "Bridal Henna", value: "bridal" }
    ],
    subCategories: [
      { id: "all", name: "All Designs" },
      { id: "rajasthani", name: "Rajasthani Bridal" },
      { id: "arabic", name: "Arabic Style" }
    ],
    vendors: []
  },
  "mehendi-artists": {
    slug: "mehendi-artists",
    title: "Mehndi & Henna Artists",
    subtitle: "Bespoke bridal henna designs, Rajasthani figure portraits & Arabic patterns",
    heroImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search mehendi artists by name or design style...",
    priceSuffix: " / bridal",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Rajasthani", value: "rajasthani" },
      { label: "Arabic", value: "arabic" },
      { label: "Bridal Henna", value: "bridal" }
    ],
    subCategories: [
      { id: "all", name: "All Designs" },
      { id: "rajasthani", name: "Rajasthani Bridal" },
      { id: "arabic", name: "Arabic Style" }
    ],
    vendors: []
  },
  planners: {
    slug: "planners",
    title: "Wedding Planners & Decor",
    subtitle: "End-to-end wedding execution, royal mandap decors & theme management",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search wedding planners and decor specialists...",
    priceSuffix: " / event",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Full Planning", value: "full" },
      { label: "Decor Only", value: "decor" }
    ],
    subCategories: [
      { id: "all", name: "All Planners" },
      { id: "full", name: "Full Planning" },
      { id: "decor", name: "Decor Only" }
    ],
    vendors: []
  },
  "decor-planning": {
    slug: "decor-planning",
    title: "Wedding Decor & Planning",
    subtitle: "End-to-end wedding execution, floral stage mandaps, lighting & theme design",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search wedding planners and decor specialists...",
    priceSuffix: " / event",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Floral Mandap", value: "floral" },
      { label: "Lighting & Stage", value: "stage" },
      { label: "Full Planning", value: "full" }
    ],
    subCategories: [
      { id: "all", name: "All Planners" },
      { id: "full", name: "Full Planning" },
      { id: "decor", name: "Decor Only" }
    ],
    vendors: []
  },
  caterers: {
    slug: "caterers",
    title: "Wedding Caterers",
    subtitle: "Gourmet multi-cuisine feasts, live food stalls & royal thali buffets",
    heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search caterers by cuisine, food counters...",
    priceSuffix: " / plate",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Pure Veg & Jain", value: "veg" },
      { label: "Multi-Cuisine", value: "multi" }
    ],
    subCategories: [
      { id: "all", name: "All Caterers" },
      { id: "veg", name: "Pure Veg & Jain" },
      { id: "multi", name: "Multi-Cuisine" }
    ],
    vendors: []
  },
  catering: {
    slug: "catering",
    title: "Wedding Catering & Food",
    subtitle: "Gourmet multi-cuisine feasts, live food stalls & royal thali buffets",
    heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search caterers by cuisine, food counters...",
    priceSuffix: " / plate",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Pure Veg & Jain", value: "veg" },
      { label: "Multi-Cuisine", value: "multi" },
      { label: "Live Counters", value: "live" }
    ],
    subCategories: [
      { id: "all", name: "All Caterers" },
      { id: "veg", name: "Pure Veg & Jain" },
      { id: "multi", name: "Multi-Cuisine" }
    ],
    vendors: []
  },
  invitations: {
    slug: "invitations",
    title: "Wedding Invitations",
    subtitle: "Luxury boxed card suites, digital video e-invites & custom seed paper",
    heroImage: "/images/invitations-cover.png",
    searchPlaceholder: "Search invitation designers, templates...",
    priceSuffix: " / card",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Boxed Cards", value: "boxed" },
      { label: "Digital Video", value: "digital" }
    ],
    subCategories: [
      { id: "all", name: "All Invitations" },
      { id: "boxed", name: "Boxed Cards" },
      { id: "digital", name: "Digital Video Invite" }
    ],
    vendors: []
  },
  jewellery: {
    slug: "jewellery",
    title: "Bridal Jewellery",
    subtitle: "Luxury Kundan chokers, uncut Polki sets, heritage gold & bridal rentals",
    heroImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search bridal jewellery sets, Kundan, Polki...",
    priceSuffix: " rental",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Polki & Kundan", value: "polki" },
      { label: "Bridal Rental", value: "rental" }
    ],
    subCategories: [
      { id: "all", name: "All Jewellery" },
      { id: "polki", name: "Polki & Kundan" },
      { id: "rental", name: "Bridal Rental" }
    ],
    vendors: []
  },
  boutiques: {
    slug: "boutiques",
    title: "Bridal Boutiques & Wear",
    subtitle: "Designer lehengas, sherwanis, sarees & bespoke bridal couture",
    heroImage: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search bridal boutiques, designer lehengas...",
    priceSuffix: " / outfit",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Bridal Lehengas", value: "lehenga" },
      { label: "Groom Wear", value: "groom" }
    ],
    subCategories: [
      { id: "all", name: "All Apparel" },
      { id: "lehenga", name: "Bridal Lehengas" },
      { id: "groom", name: "Groom Wear" }
    ],
    vendors: []
  },
  "bridal-studio": {
    slug: "bridal-studio",
    title: "Bridal Studio & Couture",
    subtitle: "Discover bespoke designer bridal lehengas, sarees, gowns & bridal studio creations",
    heroImage: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search bridal studios, lehengas, sarees...",
    priceSuffix: " / outfit",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Bridal Lehengas", value: "lehenga" },
      { label: "Sarees & Silks", value: "saree" },
      { label: "Gowns", value: "gown" }
    ],
    subCategories: [
      { id: "all", name: "All Bridal Collections" },
      { id: "lehenga", name: "Bridal Lehengas" },
      { id: "saree", name: "Sarees & Silks" },
      { id: "gown", name: "Gowns" }
    ],
    vendors: []
  },
  "groom-studio": {
    slug: "groom-studio",
    title: "Groom Studio & Sherwanis",
    subtitle: "Tailored sherwanis, bandhgalas, tuxedos, indo-western suits & kurtas",
    heroImage: "/images/groom-wear-cover.png",
    searchPlaceholder: "Search groom studios, sherwanis, suits...",
    priceSuffix: " / outfit",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Sherwanis", value: "sherwani" },
      { label: "Suits & Tuxedos", value: "suit" },
      { label: "Kurtas", value: "kurta" }
    ],
    subCategories: [
      { id: "all", name: "All Groom Collections" },
      { id: "sherwani", name: "Sherwanis" },
      { id: "suit", name: "Suits & Tuxedos" },
      { id: "kurta", name: "Kurtas" }
    ],
    vendors: []
  },
  "wedding-studio": {
    slug: "wedding-studio",
    title: "Wedding Studio & Couple Couture",
    subtitle: "Complete bridal & groom ceremonial couture, wedding edits & couple ensembles",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search wedding studios, couple couture...",
    priceSuffix: " / outfit",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Bridal Collections", value: "bridal" },
      { label: "Groom Collections", value: "groom" },
      { label: "Couple Edits", value: "couple" }
    ],
    subCategories: [
      { id: "all", name: "All Wedding Collections" },
      { id: "bridal", name: "Bridal Collections" },
      { id: "groom", name: "Groom Collections" }
    ],
    vendors: []
  },
  "bridal-wear": {
    slug: "bridal-studio",
    title: "Bridal Studio & Couture",
    subtitle: "Discover bespoke designer bridal lehengas, sarees, gowns & bridal studio creations",
    heroImage: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search bridal studios, lehengas, sarees...",
    priceSuffix: " / outfit",
    subFilters: [
      { label: "All", value: "all" },
      { label: "Bridal Lehengas", value: "lehenga" }
    ],
    subCategories: [
      { id: "all", name: "All Bridal Collections" }
    ],
    vendors: []
  },
  "groom-wear": {
    slug: "groom-studio",
    title: "Groom Studio & Sherwanis",
    subtitle: "Tailored sherwanis, bandhgalas, tuxedos, indo-western suits & kurtas",
    heroImage: "/images/groom-wear-cover.png",
    searchPlaceholder: "Search groom studios, sherwanis, suits...",
    priceSuffix: " / outfit",
    subFilters: [
      { label: "All", value: "all" }
    ],
    subCategories: [
      { id: "all", name: "All Groom Collections" }
    ],
    vendors: []
  },
  "brides-story": {
    slug: "bridal-studio",
    title: "Bridal Studio & Couture",
    subtitle: "Exclusive bridal lehengas, silk sarees, Nikah dresses, gowns & ceremony couture",
    heroImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search bridal studio collections...",
    priceSuffix: " / outfit",
    subFilters: [
      { label: "All", value: "all" }
    ],
    subCategories: [
      { id: "all", name: "All Bridal Collections" }
    ],
    vendors: []
  },
  "grooms-story": {
    slug: "groom-studio",
    title: "Groom Studio & Sherwanis",
    subtitle: "Bespoke sherwanis, tuxedos, suits, Jodhpuri sets & ceremonial groom wear",
    heroImage: "/images/groom-wear-cover.png",
    searchPlaceholder: "Search groom studio collections...",
    priceSuffix: " / outfit",
    subFilters: [
      { label: "All", value: "all" }
    ],
    subCategories: [
      { id: "all", name: "All Groom Collections" }
    ],
    vendors: []
  },
  "wedding-story": {
    slug: "wedding-studio",
    title: "Wedding Studio & Couple Couture",
    subtitle: "Complete bridal & groom ceremonial couture, wedding edits & couple ensembles",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    searchPlaceholder: "Search couple wedding couture...",
    priceSuffix: " / outfit",
    subFilters: [
      { label: "All", value: "all" }
    ],
    subCategories: [
      { id: "all", name: "All Ensembles" }
    ],
    vendors: []
  }
};

export function getPublicCategoryConfig(categorySlug?: string): CategoryConfig {
  const s = (categorySlug || "").toLowerCase().trim();
  if (VENDOR_CATEGORIES_DATA[s]) {
    return VENDOR_CATEGORIES_DATA[s];
  }
  
  if (s === "bridal-studio" || s === "bridal studio" || s === "bride studio" || s === "bride-studio" || s === "bridal-wear" || s === "bridalwear" || s === "brides-story" || s.includes("bridal")) {
    return VENDOR_CATEGORIES_DATA["bridal-studio"];
  }
  if (s === "groom-studio" || s === "groom studio" || s === "groom-wear" || s === "groomwear" || s === "grooms-story" || s.includes("groom")) {
    return VENDOR_CATEGORIES_DATA["groom-studio"];
  }
  if (s === "wedding-studio" || s === "wedding studio" || s === "wedding-story" || s === "weddingstory" || s.includes("wedding-studio")) {
    return VENDOR_CATEGORIES_DATA["wedding-studio"];
  }
  if (s === "catering" || s === "caterer" || s === "caterers" || s.includes("cater")) {
    return VENDOR_CATEGORIES_DATA["catering"] || VENDOR_CATEGORIES_DATA["caterers"];
  }
  if (s === "decor-planning" || s === "decorators" || s === "decorator" || s === "planners" || s === "wedding-planner" || s.includes("decor") || s.includes("plan")) {
    return VENDOR_CATEGORIES_DATA["decor-planning"] || VENDOR_CATEGORIES_DATA["planners"];
  }
  if (s === "jewellery" || s === "jewellery-store" || s === "jewelry" || s.includes("jewel")) {
    return VENDOR_CATEGORIES_DATA["jewellery"];
  }
  if (s === "invitations" || s === "invitation-designer" || s.includes("invit")) {
    return VENDOR_CATEGORIES_DATA["invitations"];
  }
  if (s === "makeup" || s === "makeup-artists" || s === "makeup-artist" || s.includes("makeup")) {
    return VENDOR_CATEGORIES_DATA["makeup-artists"] || VENDOR_CATEGORIES_DATA["makeup"];
  }
  if (s === "mehendi" || s === "mehendi-artists" || s === "mehendi-artist" || s === "mehndi" || s.includes("mehendi") || s.includes("mehndi")) {
    return VENDOR_CATEGORIES_DATA["mehendi-artists"] || VENDOR_CATEGORIES_DATA["mehendi"];
  }
  if (s === "photographers" || s === "photographer" || s.includes("photo") || s.includes("video")) {
    return VENDOR_CATEGORIES_DATA["photographers"];
  }
  if (s === "venues" || s === "wedding-venue" || s === "venue" || s.includes("venue")) {
    return VENDOR_CATEGORIES_DATA["venues"];
  }

  return VENDOR_CATEGORIES_DATA["wedding-studio"] || VENDOR_CATEGORIES_DATA.venues;
}


// ==========================================
// 2. UNIFIED VENDOR DASHBOARD CONFIGURATIONS
// ==========================================

export interface VendorCategoryConfig {
  id: string;
  name: string;
  slug?: string;
  badge: string;
  icon: LucideIcon;
  media: {
    title: string;
    subtitle: string;
    itemTypeLabel: string;
    tags: string[];
    emptyPrompt: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    itemTypeLabel: string;
    pricingFields: string[];
    emptyPrompt: string;
  };
  sampleMedia: Array<{
    id: string;
    title: string;
    category: string;
    image: string;
    capacity?: string;
    details?: string;
  }>;
  samplePricing: Array<{
    id: string;
    name: string;
    price: string;
    unit?: string;
    features: string[];
    popular?: boolean;
    badge?: string;
  }>;
}

export const VENDOR_CATEGORIES: Record<string, VendorCategoryConfig> = {
  venues: {
    id: "venues",
    name: "VENUES",
    badge: "Banquet & Lawns",
    icon: Building2,
    media: {
      title: "Gallery & Halls",
      subtitle: "Banquet halls, lawns, outdoor spaces & indoor/AC halls",
      itemTypeLabel: "Hall / Space",
      tags: ["All", "Banquet Hall", "Grand Lawn", "Poolside Terrace", "Courtyard"],
      emptyPrompt: "No halls or spaces added yet. Showcase your banquet halls and outdoor venues to attract couples!"
    },
    pricing: {
      title: "Halls & Pricing",
      subtitle: "Rental rates, guest capacity & slot fees (day/evening)",
      itemTypeLabel: "Space Pricing Slot",
      pricingFields: ["Hall Rental Fee", "Guest Capacity Range", "Morning/Evening Slot Fee", "Security Deposit"],
      emptyPrompt: "No pricing slots configured. Add rental fees and guest capacity for your venue spaces."
    },
    sampleMedia: [
      {
        id: "v-1",
        title: "Grand Royal Ballroom",
        category: "Banquet Hall",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop",
        capacity: "500 - 1200 Guests",
        details: "Centralized AC, Luxury Crystal Chandeliers, Attached Bridal Suite"
      },
      {
        id: "v-2",
        title: "Emerald Palm Lawn",
        category: "Grand Lawn",
        image: "https://images.unsplash.com/photo-1545232979-fbf34fd36666?q=80&w=800&auto=format&fit=crop",
        capacity: "800 - 2500 Guests",
        details: "Lush Greenery, Covered Live Catering Area, Valet Parking"
      },
      {
        id: "v-3",
        title: "Sunset Poolside Deck",
        category: "Poolside Terrace",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
        capacity: "150 - 400 Guests",
        details: "Ideal for Haldi, Cocktail & Mehendi Ceremonies"
      }
    ],
    samplePricing: [
      {
        id: "vp-1",
        name: "Grand Ballroom Evening Slot",
        price: "₹2,50,000",
        unit: "per slot (6 hrs)",
        features: ["Upto 1,000 guest capacity", "AC included for 6 hours", "Basic stage lighting", "2 Deluxe Green Rooms"],
        popular: true,
        badge: "Most Popular"
      },
      {
        id: "vp-2",
        name: "Emerald Lawn Full Day Rental",
        price: "₹4,00,000",
        unit: "full day (12 hrs)",
        features: ["Upto 2,500 guest capacity", "Full lawn access + Gazebo", "Power backup generator", "Dedicated valet team"],
        badge: "Best Value"
      }
    ]
  },

  photographers: {
    id: "photographers",
    name: "Photographers",
    badge: "Photo & Video",
    icon: Camera,
    media: {
      title: "Portfolio",
      subtitle: "Albums grouped by wedding, pre-wedding & engagement",
      itemTypeLabel: "Photo Album",
      tags: ["All", "Wedding Day", "Pre-Wedding Shoot", "Engagement", "Traditional Rituals"],
      emptyPrompt: "No albums added to portfolio yet. Upload high-res photo albums to display your artistic style!"
    },
    pricing: {
      title: "Packages & Pricing",
      subtitle: "Coverage hours, deliverables & add-ons like drone & prints",
      itemTypeLabel: "Photography Package",
      pricingFields: ["Coverage Hours", "Team Size", "Deliverable Photos & Teaser", "Drone / Album Add-ons"],
      emptyPrompt: "No packages created yet. Create photo and video packages for wedding couples."
    },
    sampleMedia: [
      {
        id: "ph-1",
        title: "Royal Jaipur Palace Wedding",
        category: "Wedding Day",
        image: "/images/photographers-cover.png",
        details: "120 Color Graded Photos • 4K Cinematic Teaser Film"
      },
      {
        id: "ph-2",
        title: "Udaipur Sunset Pre-Wedding",
        category: "Pre-Wedding Shoot",
        image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
        details: "Lake Pichola Boat & Fort Shoot • 45 Edited Portraits"
      },
      {
        id: "ph-3",
        title: "Rings & Rituals Engagement",
        category: "Engagement",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
        details: "Candid Moments • Family Group Portraits"
      }
    ],
    samplePricing: [
      {
        id: "php-1",
        name: "Bridal Signature Package",
        price: "₹1,20,000",
        unit: "per day (2 days)",
        features: ["2 Senior Candid Photographers", "1 Traditional Cinematographer", "4K 3-Min Teaser + Full Film", "350 Hard Cover Flush Mount Album"],
        popular: true,
        badge: "Best Seller"
      },
      {
        id: "php-2",
        name: "Pre-Wedding Destination Shoot",
        price: "₹65,000",
        unit: "1-day shoot",
        features: ["Full Day Outdoor Shoot", "Drone Aerial Photography", "40 Fine-Art Retouched Images", "Instagram Reels Edit"],
        badge: "Trending"
      }
    ]
  },

  makeup: {
    id: "makeup",
    name: "MAKEUP ARTISTS",
    badge: "Bridal & Beauty",
    icon: Sparkles,
    media: {
      title: "Portfolio",
      subtitle: "Bridal, Party, Engagement, HD/Airbrush, Reception looks",
      itemTypeLabel: "Look Transformation",
      tags: ["All", "HD Bridal Makeup", "Airbrush Glam", "Reception Sangeet", "Party Makeup"],
      emptyPrompt: "No look transformations in gallery. Upload before & after transformations to win brides!"
    },
    pricing: {
      title: "Packages & Pricing",
      subtitle: "Bridal package, party/guest rates, trial session charges & travel/outstation fees",
      itemTypeLabel: "Makeup Package",
      pricingFields: ["Bridal HD/Airbrush Fee", "Pre-Bridal Trial Charge", "Party Makeup Rate", "Travel / Outstation Fee"],
      emptyPrompt: "No beauty packages defined. Set your bridal, sangeet, and trial rates."
    },
    sampleMedia: [
      {
        id: "mk-1",
        title: "Royal Red Bridal Transformation",
        category: "HD Bridal Makeup",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
        details: "Airbrush Base • Dewy Finish • Customized Lashes & Hair Styling"
      },
      {
        id: "mk-2",
        title: "Pastel Sangeet Glow",
        category: "Reception Sangeet",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
        details: "Smokey Eye • Hollywood Waves Hairstyling • Draping Included"
      }
    ],
    samplePricing: [
      {
        id: "mkp-1",
        name: "Luxury HD Bridal Look",
        price: "₹35,000",
        unit: "per function",
        features: ["Premium HD Makeup Products", "Intricate Bridal Hairstyling", "Outfit Draping & Lash Extensions", "Complimentary Touch-Up Kit"],
        popular: true,
        badge: "Bride Choice"
      },
      {
        id: "mkp-2",
        name: "Bridal + 2 Party Makeup Combo",
        price: "₹55,000",
        unit: "package",
        features: ["1 HD Bridal Makeup", "2 Guest / Relative Party Makeups", "Hair Accessories Included", "Venue Travel within City"],
        badge: "Combo Discount"
      }
    ]
  },

  mehendi: {
    id: "mehendi",
    name: "Mehendi Artists",
    badge: "Henna Art",
    icon: PaletteIcon,
    media: {
      title: "Design Gallery",
      subtitle: "Arabic, Rajasthani & Indo-Arabic style categories",
      itemTypeLabel: "Henna Design",
      tags: ["All", "Rajasthani Bridal", "Arabic Style", "Indo-Arabic Figure", "Minimalist Modern"],
      emptyPrompt: "No mehendi designs uploaded. Showcase your intricate henna patterns and bridal portraits!"
    },
    pricing: {
      title: "Packages & Pricing",
      subtitle: "Bridal, per-guest & per-hand pricing structures",
      itemTypeLabel: "Mehendi Package",
      pricingFields: ["Full Bridal Package Rate", "Per-Hand Rate", "Per-Guest Hour Rate", "Organic Stain Guarantee"],
      emptyPrompt: "No pricing packages created yet. Define per-hand, bridal, and guest group rates."
    },
    sampleMedia: [
      {
        id: "mh-1",
        title: "Portrait Bridal Dulha-Dulhan Pattern",
        category: "Rajasthani Bridal",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
        details: "Elbow Length • Custom Portrait Figures • Organic Rajasthani Henna"
      },
      {
        id: "mh-2",
        title: "Bold Flowing Arabic Vines",
        category: "Arabic Style",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
        details: "Fast Application • Deep Dark Stain • Modern Geometric Accents"
      }
    ],
    samplePricing: [
      {
        id: "mhp-1",
        name: "Royal Full Length Bridal Henna",
        price: "₹18,000",
        unit: "full bridal",
        features: ["Both hands till elbow", "Feet application till calf", "Customized Baraat & Portrait Motif", "Chemical-Free Organic Henna Cones"],
        popular: true,
        badge: "Top Choice"
      },
      {
        id: "mhp-2",
        name: "Guest Mehendi Party Team (10 Guests)",
        price: "₹15,000",
        unit: "group booking",
        features: ["2 Assistant Artists for 4 hours", "Arabic & Floral Palms for 10 Guests", "Fast 15-min per guest application"],
        badge: "Group Saver"
      }
    ]
  },

  planners: {
    id: "planners",
    name: "EVENT PLANNERS & DECORATORS",
    badge: "Decor & Management",
    icon: Wand2,
    media: {
      title: "Theme Portfolio",
      subtitle: "Traditional, Royal, Minimal, Destination & Floral themes from past events",
      itemTypeLabel: "Theme Concept",
      tags: ["All", "Royal Marwar Stage", "Boho Chic Mandap", "Floral Tunnel Entrance", "Sangeet Glam Stage"],
      emptyPrompt: "No themes in portfolio. Upload images of past setups, mandaps, and stage designs!"
    },
    pricing: {
      title: "Packages & Pricing",
      subtitle: "Full planning vs. decor-only, vendor tie-up network & per-event packages",
      itemTypeLabel: "Event Package",
      pricingFields: ["Decor Setup Cost", "End-to-End Planning Fee", "Lighting & Truss Setup", "Vendor Coordination Fee"],
      emptyPrompt: "No planning/decor packages listed. Set up options for decor-only or full planning."
    },
    sampleMedia: [
      {
        id: "pl-1",
        title: "Pastel Royal Mandap under Stars",
        category: "Boho Chic Mandap",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        details: "Real Fresh Exotic Flowers • Fairy Light Canopy • Custom Seating"
      },
      {
        id: "pl-2",
        title: "Mirror & Marigold Sangeet Arena",
        category: "Sangeet Glam Stage",
        image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop",
        details: "LED Screen Background • Intelligent Moving Head Lights • DJ Setup"
      }
    ],
    samplePricing: [
      {
        id: "plp-1",
        name: "Complete Wedding Planning & Execution",
        price: "₹3,50,000",
        unit: "management fee",
        features: ["End-to-end 3-day wedding management", "Vendor negotiation & contract management", "RSVP & Guest Hospitality Desk", "On-site Event Managers (6 personnel)"],
        popular: true,
        badge: "Full Service"
      },
      {
        id: "plp-2",
        name: "Bespoke Royal Mandap & Entrance Decor",
        price: "₹2,20,000",
        unit: "per event",
        features: ["Fresh Flower Dome Mandap", "Grand Entrance Pathway & Arch", "Stage Backdrops & Couple Sofa", "Ambient Mood Lighting"],
        badge: "Decor Only"
      }
    ]
  },

  caterers: {
    id: "caterers",
    name: "CATERERS",
    badge: "Food & Beverage",
    icon: UtensilsCrossed,
    media: {
      title: "Menu Management",
      subtitle: "Cuisines offered, Veg/Non-Veg/Jain options, live counters & dessert/sweets",
      itemTypeLabel: "Menu Category / Counter",
      tags: ["All", "North Indian Buffet", "Live Street Food Counters", "Royal Mughlai", "Jain Special", "Gourmet Desserts"],
      emptyPrompt: "No menu items or live counters added. Highlight signature cuisines and live food stalls!"
    },
    pricing: {
      title: "Packages & Pricing",
      subtitle: "Per-plate rates, minimum guest count & tasting session scheduling",
      itemTypeLabel: "Catering Menu Package",
      pricingFields: ["Per-Plate Rate (Veg)", "Per-Plate Rate (Non-Veg)", "Live Counters Included", "Tasting Session Charge"],
      emptyPrompt: "No catering pricing packages added. Set per-plate charges and minimum guest counts."
    },
    sampleMedia: [
      {
        id: "ct-1",
        title: "Royal Rajasthani & Marwari Thali spread",
        category: "North Indian Buffet",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
        details: "14 Starters • 18 Main Course Dishes • Pure Desi Ghee Prep"
      },
      {
        id: "ct-2",
        title: "Artisanal Live Chaat & Wood-Fired Pizza",
        category: "Live Street Food Counters",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
        details: "Customized Live Chef Stations • Clean & Hygienic Uniformed Staff"
      }
    ],
    samplePricing: [
      {
        id: "ctp-1",
        name: "Royal Diamond Feast (Pure Veg / Jain)",
        price: "₹1,450",
        unit: "per plate (Min 300 guests)",
        features: ["8 Welcome Drinks & Mocktails", "12 Starter Dishes", "4 Live Food Counters", "5 Premium Desserts + Ice Cream Bar"],
        popular: true,
        badge: "Most Ordered"
      },
      {
        id: "ctp-2",
        name: "Gourmet International & Mughlai Buffet",
        price: "₹1,850",
        unit: "per plate (Min 250 guests)",
        features: ["Veg & Non-Veg Multi-Cuisine", "Live Sushi & Wood-Fired Pizza Station", "Mughlai Handi Biryani Special", "Includes Uniformed Service Staff & Cutlery"],
        badge: "Premium Luxury"
      }
    ]
  },

  invitations: {
    id: "invitations",
    name: "INVITATIONS",
    badge: "Cards & Digital",
    icon: Mail,
    media: {
      title: "Design Catalog",
      subtitle: "Traditional, Modern/Minimal, Digital/E-Invite, Royal/Premium & Regional templates",
      itemTypeLabel: "Invitation Design",
      tags: ["All", "Boxed Royal Acrylic", "Eco-Friendly Seed Paper", "Animated Video Invite", "Gold Foil Minimalist"],
      emptyPrompt: "No invitation samples in catalog. Upload digital invite videos and physical card photos!"
    },
    pricing: {
      title: "Pricing & Customization",
      subtitle: "Per-card rates, digital vs. print pricing, customization tiers & bulk order discounts",
      itemTypeLabel: "Pricing Tier",
      pricingFields: ["Per Card Base Price", "Bulk Order Discount (500+)", "Wax Seal / Gold Foil Extra", "Digital Video Invite Fee"],
      emptyPrompt: "No pricing structure configured. Add unit card prices and volume discount tiers."
    },
    sampleMedia: [
      {
        id: "inv-1",
        title: "Luxury Rigid Box with Brass Latch & Sweets Container",
        category: "Boxed Royal Acrylic",
        image: "/images/invitations-cover.png",
        details: "Velvet Insert • Custom Monogram Wax Seal • Metallic Gold Leafing"
      },
      {
        id: "inv-2",
        title: "Cinematic 3D Palace Wedding E-Invite Video",
        category: "Animated Video Invite",
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
        details: "WhatsApp Ready • Music Included • RSVP Link Integrated"
      }
    ],
    samplePricing: [
      {
        id: "invp-1",
        name: "Royal Acrylic Box Card Set",
        price: "₹380",
        unit: "per card (Min 200 units)",
        features: ["Acrylic main card with gold foil", "3 Inserts (Haldi, Mehendi, Wedding)", "Customized Box Case", "Includes outer delivery box"],
        popular: true,
        badge: "Trending"
      },
      {
        id: "invp-2",
        name: "Custom Animated WhatsApp Video Package",
        price: "₹12,000",
        unit: "flat fee",
        features: ["60-sec 4K Video Invitation", "Custom Couple Illustration", "3 Rounds of Revisions", "Matching Save-the-Date PDF"],
        badge: "Digital Special"
      }
    ]
  },

  jewellery: {
    id: "jewellery",
    name: "JEWELLERY",
    badge: "Bridal Ornaments",
    icon: Gem,
    media: {
      title: "Collection Catalog",
      subtitle: "Bridal Sets, Temple Jewellery, Antique, Contemporary & Accessories",
      itemTypeLabel: "Jewellery Piece / Set",
      tags: ["All", "Kundan Bridal Choker", "Polki & Emerald Set", "Temple Gold Neckpieces", "Mathapatti & Nath"],
      emptyPrompt: "No jewellery collections cataloged. Upload photos of bridal Kundan, Polki, and Gold sets!"
    },
    pricing: {
      title: "Pricing & Rental",
      subtitle: "Rental vs. purchase options, per-piece rates & security deposit terms",
      itemTypeLabel: "Collection Price Tag",
      pricingFields: ["Purchase Price", "3-Day Rental Charge", "Security Deposit Amount", "Custom Fitting Charge"],
      emptyPrompt: "No pricing tags added yet. Add rental fees, deposit requirements, and purchase rates."
    },
    sampleMedia: [
      {
        id: "jw-1",
        title: "Royal Uncut Polki & Colombian Emerald Bridal Set",
        category: "Polki & Emerald Set",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
        details: "Includes Choker, Long Haar, Jhumkas, Mathapatti & Haathphool"
      },
      {
        id: "jw-2",
        title: "22K Antique Temple Gold Heritage Necklace",
        category: "Temple Gold Neckpieces",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
        details: "Handcrafted Nakshi Work • Certified Hallmarked Gold"
      }
    ],
    samplePricing: [
      {
        id: "jwp-1",
        name: "Polki Heritage Bridal Set (3-Day Rental)",
        price: "₹28,000",
        unit: "3-day rental",
        features: ["Full 7-piece bridal set", "Sanitized & Polished prior to event", "Security Deposit: ₹50,000 (Refundable)", "Free fitting alteration"],
        popular: true,
        badge: "Rental Special"
      },
      {
        id: "jwp-2",
        name: "Custom Made Kundan Choker Purchase",
        price: "₹2,45,000",
        unit: "direct purchase",
        features: ["Hallmarked 22K Gold Base", "Certified Uncut Diamonds", "Lifetime Cleaning Guarantee", "Insured Delivery"],
        badge: "Buy Fine Jewellery"
      }
    ]
  },
  "bridal-studio": {
    id: "bridal-studio",
    name: "BRIDAL STUDIO",
    badge: "Bridal Couture & Lehengas",
    icon: Sparkles,
    media: {
      title: "Bridal Collections",
      subtitle: "Bespoke bridal lehengas, silk sarees, Nikah dresses & ceremony gowns",
      itemTypeLabel: "Bridal Outfit / Lehenga",
      tags: ["All", "Bridal Lehengas", "Silk Sarees", "Gowns", "Nikah Couture"],
      emptyPrompt: "No bridal outfits added yet. Showcase your luxury bridal collections!"
    },
    pricing: {
      title: "Bridal Packages & Pricing",
      subtitle: "Outfit purchase/rental rates, trial sessions & custom fitting fees",
      itemTypeLabel: "Outfit Package",
      pricingFields: ["Bridal Lehenga Price", "3-Day Rental Charge", "Custom Fitting Fee", "Home Trial Fee"],
      emptyPrompt: "No bridal pricing packages configured yet. Add your outfit rates."
    },
    sampleMedia: [
      {
        id: "bs-1",
        title: "Velvet Royal Maroon Bridal Lehenga",
        category: "Bridal Lehengas",
        image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800&auto=format&fit=crop",
        details: "Hand-Embroidered Zardozi • Custom Fits Available"
      }
    ],
    samplePricing: [
      {
        id: "bsp-1",
        name: "Signature Zardozi Bridal Lehenga",
        price: "₹85,000",
        unit: "per outfit",
        features: ["Bespoke Measurements", "Dupatta Draping Included", "Custom Color Dyeing", "Free Fitting Revisions"],
        popular: true,
        badge: "Bride Favorite"
      }
    ]
  },
  "groom-studio": {
    id: "groom-studio",
    name: "GROOM STUDIO",
    badge: "Groom Couture & Sherwanis",
    icon: Shirt,
    media: {
      title: "Groom Collections",
      subtitle: "Bespoke sherwanis, bandhgalas, tuxedos, Jodhpuri suits & kurtas",
      itemTypeLabel: "Groom Ensemble",
      tags: ["All", "Sherwanis", "Bandhgalas", "Tuxedos", "Jodhpuri Suits"],
      emptyPrompt: "No groom ensembles added yet. Showcase your bespoke groom couture!"
    },
    pricing: {
      title: "Groom Packages & Pricing",
      subtitle: "Bespoke tailoring fees, rental charges & accessory packages",
      itemTypeLabel: "Groom Package",
      pricingFields: ["Sherwani Purchase Price", "Tuxedo Rental Charge", "Custom Tailoring Charge", "Safas & Accessories"],
      emptyPrompt: "No groom pricing packages configured yet. Set up custom suit and sherwani rates."
    },
    sampleMedia: [
      {
        id: "gs-1",
        title: "Royal Raw Silk Embroidered Sherwani",
        category: "Sherwanis",
        image: "/images/groom-wear-cover.png",
        details: "Includes Safa, Stole & Matching Mojaris"
      }
    ],
    samplePricing: [
      {
        id: "gsp-1",
        name: "Bespoke Silk Sherwani Set",
        price: "₹45,000",
        unit: "per set",
        features: ["Tailored Fit Guarantee", "Matching Safa Included", "Premium Silk Fabric", "Free Alterations"],
        popular: true,
        badge: "Top Seller"
      }
    ]
  },
  "wedding-studio": {
    id: "wedding-studio",
    name: "WEDDING STUDIO",
    badge: "Couple & Ceremony Couture",
    icon: Store,
    media: {
      title: "Wedding Collections",
      subtitle: "Complete bridal & groom ceremonial couture, wedding edits & couple ensembles",
      itemTypeLabel: "Wedding Ensemble",
      tags: ["All", "Bridal Couture", "Groom Couture", "Couple Ensembles", "Ceremony Edits"],
      emptyPrompt: "No wedding studio collections added yet. Showcase your bridal and groom wedding edits!"
    },
    pricing: {
      title: "Wedding Packages & Pricing",
      subtitle: "Couple ensemble packages, bridal & groom combos & wedding edits",
      itemTypeLabel: "Studio Package",
      pricingFields: ["Couple Combo Rate", "Bridal Studio Rate", "Groom Studio Rate", "Styling Session Charge"],
      emptyPrompt: "No studio packages configured yet. Add couple ensemble rates and combo deals."
    },
    sampleMedia: [
      {
        id: "ws-1",
        title: "Royal Heritage Couple Wedding Edit",
        category: "Couple Ensembles",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        details: "Matching Pastel Tones • Full Bridal Lehenga & Groom Sherwani"
      }
    ],
    samplePricing: [
      {
        id: "wsp-1",
        name: "Royal Bride & Groom Couple Ensemble",
        price: "₹1,20,000",
        unit: "couple package",
        features: ["Complete Bridal Lehenga", "Matching Groom Sherwani Set", "Styling & Fitting Sessions", "Complimentary Accessories"],
        popular: true,
        badge: "Best Value"
      }
    ]
  }
};

export function getCategoryConfig(categoryKey: string): VendorCategoryConfig | null {
  const norm = normalizeCategory(categoryKey);
  if (norm && VENDOR_CATEGORIES[norm.slug]) {
    return VENDOR_CATEGORIES[norm.slug];
  }

  // Direct lookup check & alias mapping
  const rawKey = (categoryKey || "").toLowerCase().trim();
  if (VENDOR_CATEGORIES[rawKey]) {
    return VENDOR_CATEGORIES[rawKey];
  }

  if (rawKey.includes("bride") || rawKey.includes("bridal") || rawKey.includes("boutique")) {
    return VENDOR_CATEGORIES["bridal-studio"];
  }
  if (rawKey.includes("groom") || rawKey.includes("sherwani")) {
    return VENDOR_CATEGORIES["groom-studio"];
  }
  if (rawKey.includes("wedding") && rawKey.includes("studio")) {
    return VENDOR_CATEGORIES["wedding-studio"];
  }

  // Strictly return null for unrecognized categories — NO SILENT FALLBACK TO VENUES
  return null;
}

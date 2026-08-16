// ─────────────────────────────────────────────────────────────────────────────
// CLOCHE INSPIRATION DATA
//
// ARCHITECTURE:
//   - Dynamic categories → Pexels API via /api/v1/inspiration/photos?category=X
//   - "Color Themes" → static editorial palettes (not photo-searchable)
//   - Collections → curated groupings that map to Pexels category queries
//   - No hardcoded photo IDs. No fabricated titles for API photos.
//   - Photographer attribution required by Pexels ToS — always rendered.
// ─────────────────────────────────────────────────────────────────────────────

export interface ColorSwatch {
  name: string;
  hex: string;
}

export type InspirationCategory =
  | "Wedding Photos"
  | "Trending Decor"
  | "Bridal Looks"
  | "Groom Looks"
  | "Mehendi Designs"
  | "Stage Designs"
  | "Color Themes"
  | "Seasonal Trends";

// Shape of a photo from the Pexels API server route
export interface DynamicInspirationPhoto {
  id: string;
  category: InspirationCategory;
  src: { large2x: string; large: string; medium: string };
  width: number;
  height: number;
  // Pexels attribution — required by ToS on every display
  photographer: string;
  photographer_url: string;
  pexels_url: string;
  alt: string | null;
}

// Static editorial Color Theme palettes
export interface StaticColorTheme {
  id: string;
  category: "Color Themes";
  title: string;
  image: string;
  aspectRatio: "portrait" | "tall" | "square" | "landscape";
  description: string;
  colorTheme: ColorSwatch[];
  tags: string[];
}

export type InspirationItem = DynamicInspirationPhoto | StaticColorTheme;

export function isStaticColorTheme(item: InspirationItem): item is StaticColorTheme {
  return item.category === "Color Themes";
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY PILLS (8 core content types)
// ─────────────────────────────────────────────────────────────────────────────
export const INSPIRATION_CATEGORIES: { id: string; label: string; emoji: string; isStatic?: boolean }[] = [
  { id: "All", label: "All", emoji: "✨" },
  { id: "Wedding Photos", label: "Wedding Photos", emoji: "📸" },
  { id: "Stage Designs", label: "Stage & Mandap", emoji: "✨" },
  { id: "Trending Decor", label: "Trending Decor", emoji: "💐" },
  { id: "Bridal Looks", label: "Bridal Looks", emoji: "👰" },
  { id: "Groom Looks", label: "Groom Looks", emoji: "🤵" },
  { id: "Mehendi Designs", label: "Mehendi", emoji: "🌿" },
  { id: "Seasonal Trends", label: "Seasonal Trends", emoji: "🌸" },
  { id: "Color Themes", label: "Color Themes", emoji: "🎨", isStatic: true },
];

export const DYNAMIC_CATEGORIES: InspirationCategory[] = [
  "Wedding Photos", "Trending Decor", "Bridal Looks",
  "Groom Looks", "Mehendi Designs", "Stage Designs", "Seasonal Trends",
];

// ─────────────────────────────────────────────────────────────────────────────
// CURATED COLLECTIONS (maps to a category for API fetching)
// ─────────────────────────────────────────────────────────────────────────────
export interface InspirationCollection {
  id: string;
  label: string;
  emoji: string;
  category: InspirationCategory | "Color Themes";
  gradient: string; // Tailwind gradient classes for the card bg
  badge?: string;
}

export const INSPIRATION_COLLECTIONS: InspirationCollection[] = [
  { id: "trending", label: "Trending This Week", emoji: "🔥", category: "Wedding Photos", gradient: "from-orange-500 to-rose-600", badge: "Hot" },
  { id: "kerala", label: "Kerala Weddings", emoji: "💍", category: "Wedding Photos", gradient: "from-[#0F4C45] to-[#12584E]", badge: "Local" },
  { id: "luxury", label: "Luxury Weddings", emoji: "👑", category: "Stage Designs", gradient: "from-amber-600 to-yellow-500" },
  { id: "minimal", label: "Minimal Weddings", emoji: "🌿", category: "Trending Decor", gradient: "from-stone-400 to-stone-600" },
  { id: "pastel", label: "Pastel Themes", emoji: "🌸", category: "Color Themes", gradient: "from-pink-300 to-purple-400" },
  { id: "stage", label: "Stage Decoration", emoji: "✨", category: "Stage Designs", gradient: "from-violet-500 to-indigo-600" },
  { id: "photography", label: "Photography Ideas", emoji: "📸", category: "Wedding Photos", gradient: "from-slate-600 to-gray-800" },
  { id: "bridal", label: "Bridal Looks", emoji: "👰", category: "Bridal Looks", gradient: "from-rose-400 to-pink-600" },
  { id: "groom", label: "Groom Looks", emoji: "🤵", category: "Groom Looks", gradient: "from-blue-600 to-indigo-700" },
  { id: "mehendi", label: "Mehendi", emoji: "🌼", category: "Mehendi Designs", gradient: "from-orange-400 to-amber-600" },
  { id: "floral", label: "Floral Decoration", emoji: "💐", category: "Trending Decor", gradient: "from-emerald-400 to-teal-600" },
  { id: "destination", label: "Destination Weddings", emoji: "🏖", category: "Seasonal Trends", gradient: "from-sky-400 to-blue-600" },
  { id: "monsoon", label: "Monsoon Weddings", emoji: "🌧", category: "Seasonal Trends", gradient: "from-teal-500 to-cyan-700" },
  { id: "reception", label: "Reception Ideas", emoji: "🎉", category: "Stage Designs", gradient: "from-purple-500 to-pink-600" },
];

// ─────────────────────────────────────────────────────────────────────────────
// VENDOR DISCOVERY LINKS per category
// Maps inspiration categories to real Cloche vendor directory routes
// ─────────────────────────────────────────────────────────────────────────────
export const CATEGORY_VENDOR_LINKS: Record<string, { label: string; href: string; emoji: string }[]> = {
  "Stage Designs": [
    { label: "Browse Decorators", href: "/categories/decor-planning", emoji: "🌸" },
    { label: "Browse Venues", href: "/venues", emoji: "🏛" },
  ],
  "Trending Decor": [
    { label: "Browse Decorators", href: "/categories/decor-planning", emoji: "💐" },
  ],
  "Bridal Looks": [
    { label: "Browse Makeup Artists", href: "/makeup-artists", emoji: "💄" },
    { label: "Browse Bridal Wear", href: "/bridal-wear", emoji: "👰" },
  ],
  "Groom Looks": [
    { label: "Browse Groom Wear", href: "/groom-wear", emoji: "🤵" },
  ],
  "Mehendi Designs": [
    { label: "Browse Mehendi Artists", href: "/mehendi-artists", emoji: "🌿" },
  ],
  "Wedding Photos": [
    { label: "Browse Photographers", href: "/photographers", emoji: "📸" },
  ],
  "Seasonal Trends": [
    { label: "Browse Venues", href: "/venues", emoji: "🏛" },
    { label: "Browse Decorators", href: "/categories/decor-planning", emoji: "💐" },
  ],
  "Color Themes": [
    { label: "Browse Decorators", href: "/categories/decor-planning", emoji: "🎨" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// STATIC COLOR THEMES (editorial)
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_COLOR_THEMES: StaticColorTheme[] = [
  {
    id: "color-emerald-gold",
    category: "Color Themes",
    title: "Royal Emerald & Champagne Gold",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square",
    description: "The Cloche signature palette — deep forest greens and brushed champagne gold. Perfect for luxury Kerala weddings.",
    colorTheme: [
      { name: "Cloche Emerald", hex: "#0F4C45" },
      { name: "Champagne Gold", hex: "#C8A96A" },
      { name: "Pearl Ivory", hex: "#FAF7F2" },
      { name: "Forest Canopy", hex: "#064E3B" },
      { name: "Mahogany", hex: "#451A03" },
    ],
    tags: ["Emerald", "Gold", "Luxury", "Royal", "Cloche Signature"],
  },
  {
    id: "color-pastel-blossom",
    category: "Color Themes",
    title: "Pastel Blossom: Peach, Blush & Lavender",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description: "Airy and romantic — soft peach organza, French lavender, and blush spray roses for spring celebrations.",
    colorTheme: [
      { name: "Soft Peach", hex: "#FFEDD5" },
      { name: "Dusty Blush", hex: "#FCE7F3" },
      { name: "French Lavender", hex: "#EDE9FE" },
      { name: "Sage Mist", hex: "#DCFCE7" },
      { name: "Silver Frost", hex: "#E2E8F0" },
    ],
    tags: ["Pastel", "Blush", "Lavender", "Spring", "Romantic"],
  },
  {
    id: "color-terracotta-rust",
    category: "Color Themes",
    title: "Terracotta, Ochre & Rust",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall",
    description: "Warm earthy tones inspired by Kerala terracotta architecture — burnt sienna, mustard silks, and rustic teakwood.",
    colorTheme: [
      { name: "Terracotta", hex: "#9A3412" },
      { name: "Sunset Rust", hex: "#C2410C" },
      { name: "Mustard Ochre", hex: "#CA8A04" },
      { name: "Earthen Sand", hex: "#D6D3D1" },
      { name: "Teak Bark", hex: "#292524" },
    ],
    tags: ["Terracotta", "Rust", "Ochre", "Earth Tone", "Boho"],
  },
  {
    id: "color-crimson-ruby",
    category: "Color Themes",
    title: "Royal Crimson & Temple Gold",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square",
    description: "The classic South Indian bridal palette — deep crimson silk, zardozi gold, temple ruby, and sandalwood.",
    colorTheme: [
      { name: "Sindoor Crimson", hex: "#991B1B" },
      { name: "Zardozi Gold", hex: "#C8A96A" },
      { name: "Temple Ruby", hex: "#7F1D1D" },
      { name: "Sandalwood", hex: "#A16207" },
      { name: "Jasmine White", hex: "#FFFBEB" },
    ],
    tags: ["Crimson", "Red", "Gold", "Temple", "South Indian"],
  },
  {
    id: "color-ivory-champagne",
    category: "Color Themes",
    title: "Ivory & Champagne Elegance",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "landscape",
    description: "Refined minimalism in ivory, champagne, and warm whites — ideal for Christian and civil ceremonies.",
    colorTheme: [
      { name: "Bridal Ivory", hex: "#FAFAF8" },
      { name: "Champagne", hex: "#F7E7CE" },
      { name: "Warm Pearl", hex: "#E8E0D4" },
      { name: "Blush Flush", hex: "#FCE7F3" },
      { name: "Rose Gold", hex: "#E8B4B8" },
    ],
    tags: ["Ivory", "Champagne", "White", "Minimal", "Christian Wedding"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AURA CONTEXTUAL PROMPTS for the Inspiration page
// ─────────────────────────────────────────────────────────────────────────────
export const AURA_INSPIRATION_PROMPTS = [
  "Show luxury Kerala wedding decorations",
  "Suggest a royal reception theme",
  "Show pastel stage decorations",
  "Plan a ₹10 lakh Kerala wedding",
  "Find traditional Kasavu bridal styling",
];

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT BOARDS (shown when user first opens "My Boards")
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_BOARDS = [
  { id: "dream-wedding", name: "❤️ Dream Wedding" },
  { id: "reception", name: "💍 Reception" },
  { id: "bridal-looks", name: "👰 Bridal Looks" },
  { id: "decor", name: "🎨 Decor" },
  { id: "photography", name: "📸 Photography" },
];

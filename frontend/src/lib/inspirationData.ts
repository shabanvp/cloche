// ─────────────────────────────────────────────────────────────────────────────
// CLOCHE INSPIRATION DATA
//
// ARCHITECTURE:
//   - Categories backed by Pexels API (dynamically fetched via
//     GET /api/v1/inspiration/photos?category=X) — no hardcoded photo IDs.
//   - "Color Themes" is STATIC and EDITORIAL — hand-curated palettes.
//     These are not photo-searchable; they stay here as genuine curation.
//   - ALL other category items are now fetched live; this file exports only
//     the category metadata, Color Theme items, and supporting constants.
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

// Shape of a photo returned from the server API (/api/v1/inspiration/photos)
export interface DynamicInspirationPhoto {
  id: string;
  category: InspirationCategory;
  // Image URLs from Pexels
  src: {
    large2x: string;
    large: string;
    medium: string;
  };
  width: number;
  height: number;
  // Attribution — required by Pexels ToS
  photographer: string;
  photographer_url: string;
  pexels_url: string; // link to original Pexels page
  alt: string | null; // Pexels-provided alt text (used as caption; never invented)
}

// Shape of a static Color Theme item (kept editorial)
export interface StaticColorTheme {
  id: string;
  category: "Color Themes";
  title: string;
  image: string; // Still a verified Unsplash image for palette preview
  aspectRatio: "portrait" | "tall" | "square" | "landscape";
  description: string;
  colorTheme: ColorSwatch[];
  tags: string[];
}

// Union type used throughout the app
export type InspirationItem = DynamicInspirationPhoto | StaticColorTheme;

// Type guard
export function isStaticColorTheme(item: InspirationItem): item is StaticColorTheme {
  return item.category === "Color Themes";
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// "Color Themes" is marked as static so the client knows not to call the API.
// ─────────────────────────────────────────────────────────────────────────────
export const INSPIRATION_CATEGORIES: {
  id: string;
  label: string;
  isStatic?: boolean;
}[] = [
  { id: "All", label: "All Inspirations" },
  { id: "Wedding Photos", label: "Wedding Photos" },
  { id: "Trending Decor", label: "Trending Decor" },
  { id: "Bridal Looks", label: "Bridal Looks" },
  { id: "Groom Looks", label: "Groom Looks" },
  { id: "Mehendi Designs", label: "Mehendi Designs" },
  { id: "Stage Designs", label: "Stage Designs" },
  { id: "Color Themes", label: "Color Themes", isStatic: true },
  { id: "Seasonal Trends", label: "Seasonal Trends" },
];

// Dynamic categories (those backed by the Pexels API)
export const DYNAMIC_CATEGORIES: InspirationCategory[] = [
  "Wedding Photos",
  "Trending Decor",
  "Bridal Looks",
  "Groom Looks",
  "Mehendi Designs",
  "Stage Designs",
  "Seasonal Trends",
];

// ─────────────────────────────────────────────────────────────────────────────
// STATIC EDITORIAL: COLOR THEMES
// These are genuine hand-curated palette boards, not photo searches.
// Titles and descriptions are written by a human editor, not auto-generated.
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_COLOR_THEMES: StaticColorTheme[] = [
  {
    id: "color-theme-emerald-gold",
    category: "Color Themes",
    title: "Royal Emerald & Champagne Gold",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square",
    description:
      "A distinguished imperial palette balancing deep forest greens, brushed champagne gold accents, pearl ivory silks, and rich mahogany woodwork. The Cloche signature palette.",
    colorTheme: [
      { name: "Cloche Emerald", hex: "#0F4C45" },
      { name: "Champagne Gold", hex: "#C8A96A" },
      { name: "Pearl Ivory", hex: "#FAF7F2" },
      { name: "Forest Canopy", hex: "#064E3B" },
      { name: "Mahogany Warmth", hex: "#451A03" },
    ],
    tags: ["Emerald", "Gold", "Luxury", "Royal", "Cloche Signature"],
  },
  {
    id: "color-theme-pastel-blossom",
    category: "Color Themes",
    title: "Pastel Blossom: Peach, Blush & Lavender",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description:
      "An airy, romantic color story blending soft peach organza, French lavender hydrangeas, blush spray roses, and brushed silver candle holders.",
    colorTheme: [
      { name: "Soft Peach", hex: "#FFEDD5" },
      { name: "Dusty Blush", hex: "#FCE7F3" },
      { name: "French Lavender", hex: "#EDE9FE" },
      { name: "Sage Mist", hex: "#DCFCE7" },
      { name: "Silver Frost", hex: "#E2E8F0" },
    ],
    tags: ["Pastel", "Blush", "Lavender", "Spring Wedding", "Romantic"],
  },
  {
    id: "color-theme-terracotta-rust",
    category: "Color Themes",
    title: "Sunset Ochre, Terracotta & Rust",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall",
    description:
      "Warm earthy tones inspired by Kerala terracotta architecture, burnt sienna marigolds, mustard silks, and rustic raw teakwood.",
    colorTheme: [
      { name: "Terracotta Clay", hex: "#9A3412" },
      { name: "Sunset Rust", hex: "#C2410C" },
      { name: "Mustard Ochre", hex: "#CA8A04" },
      { name: "Earthen Sand", hex: "#D6D3D1" },
      { name: "Teak Bark", hex: "#292524" },
    ],
    tags: ["Terracotta", "Rust", "Ochre", "Earth Tone", "Boho"],
  },
  {
    id: "color-theme-crimson-ruby",
    category: "Color Themes",
    title: "Royal Crimson & Temple Ruby",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square",
    description:
      "The classic south Indian bridal palette: deep crimson silk, zardozi gold, temple ruby accents, and sandalwood warmth.",
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
    id: "color-theme-ivory-champagne",
    category: "Color Themes",
    title: "Ivory & Champagne Elegance",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "landscape",
    description:
      "Refined minimalism in ivory, champagne, and warm whites — ideal for Christian and inter-faith ceremonies with clean, editorial styling.",
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
// AURA AI CONTEXTUAL PROMPTS for the Inspiration page
// ─────────────────────────────────────────────────────────────────────────────
export const AURA_INSPIRATION_PROMPTS = [
  "Show luxury Kerala wedding stage decorations",
  "Suggest pastel wedding color palettes for 2026",
  "Find traditional Kasavu bridal styling ideas",
  "Show outdoor mandap designs with floral pools",
  "Suggest wedding photo poses for backwaters",
];

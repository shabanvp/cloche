// ─────────────────────────────────────────────────────────────────────────────
// CLOCHE INSPIRATION DATA — AI WEDDING DISCOVERY & PLANNING PLATFORM
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

export interface DynamicInspirationPhoto {
  id: string;
  category: InspirationCategory;
  src: { large2x: string; large: string; medium: string };
  width: number;
  height: number;
  photographer: string;
  photographer_url: string;
  pexels_url: string;
  alt: string | null;
  // Computed planning metadata
  estimatedBudget?: string;
  styleTag?: string;
  locationTag?: string;
}

export interface StaticColorTheme {
  id: string;
  category: "Color Themes";
  title: string;
  image: string;
  aspectRatio: "portrait" | "tall" | "square" | "landscape";
  description: string;
  colorTheme: ColorSwatch[];
  tags: string[];
  estimatedBudget: string;
  styleTag: string;
  locationTag: string;
}

export type InspirationItem = DynamicInspirationPhoto | StaticColorTheme;

export function isStaticColorTheme(item: InspirationItem): item is StaticColorTheme {
  return item.category === "Color Themes";
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. BUDGET & PLANNING METADATA HELPERS
// Answers: "What is this style?" and "How much will it cost?"
// ─────────────────────────────────────────────────────────────────────────────
export interface InspirationPlanningProfile {
  styleName: string;
  vibe: string;
  estimatedCostRange: string;
  costTier: "budget" | "mid" | "luxury";
  breakdown: { item: string; cost: string }[];
  keyElements: string[];
  keralaTouch: string;
  recommendedVendors: { label: string; href: string; emoji: string; subtitle: string }[];
  auraPrompt: string;
  disclaimer: string;
}

const GENERAL_DISCLAIMER =
  "Typical market benchmark range for Kerala weddings. Actual costs vary based on custom requirements, materials, season, and vendor selection. Connect with verified vendors for exact quotations.";

export function getInspirationPlanningProfile(item: InspirationItem): InspirationPlanningProfile {
  const category = item.category;
  const isTheme = isStaticColorTheme(item);
  const titleOrAlt = (isTheme ? item.title : item.alt || "").toLowerCase();

  // Stage & Mandap Designs
  if (category === "Stage Designs" || titleOrAlt.includes("mandap") || titleOrAlt.includes("stage")) {
    const isUltra = titleOrAlt.includes("royal") || titleOrAlt.includes("luxury") || titleOrAlt.includes("gold");
    return {
      styleName: isUltra ? "Royal Kerala Mandap & Stage" : "Contemporary Floral Stage Design",
      vibe: "Opulent, traditional, and ambient-lit for grand ceremonies",
      estimatedCostRange: isUltra ? "₹2.8L – ₹5.5L" : "₹1.5L – ₹3.0L",
      costTier: isUltra ? "luxury" : "mid",
      breakdown: [
        { item: "Fresh Floral Arch & Backdrop", cost: isUltra ? "₹1.2L – ₹2.5L" : "₹70k – ₹1.4L" },
        { item: "Antique Brass Urulis & Hanging Vilakku", cost: isUltra ? "₹50k – ₹90k" : "₹30k – ₹50k" },
        { item: "Warm Architectural Flood Lighting", cost: isUltra ? "₹60k – ₹1.1L" : "₹30k – ₹60k" },
        { item: "Custom Stage Platform & Drapery", cost: isUltra ? "₹50k – ₹1.0L" : "₹20k – ₹50k" },
      ],
      keyElements: ["Hand-strung tuberoses", "Golden brass bells", "Warm amber uplighting", "Traditional Peeta seating"],
      keralaTouch: "Nilavilakku oil lamps with fresh lotus flower water arrangements",
      recommendedVendors: [
        { label: "Stage Decorators", href: "/categories/decor-planning", emoji: "🌸", subtitle: "Decor & Floral Artists" },
        { label: "Wedding Venues", href: "/venues", emoji: "🏛", subtitle: "Convention Centres & Resorts" },
        { label: "Decor & Lighting", href: "/categories/decor-planning", emoji: "✨", subtitle: "Atmosphere & AV" },
      ],
      auraPrompt: `Plan a ${isUltra ? "Royal Kerala Mandap" : "Modern Floral Stage"} within a ₹${isUltra ? "4 Lakh" : "2 Lakh"} decor budget in Kochi/Trivandrum`,
      disclaimer: GENERAL_DISCLAIMER,
    };
  }

  // Bridal Looks & Saree
  if (category === "Bridal Looks" || titleOrAlt.includes("bride") || titleOrAlt.includes("saree") || titleOrAlt.includes("lehenga")) {
    const isKasavu = titleOrAlt.includes("kasavu") || titleOrAlt.includes("kerala") || titleOrAlt.includes("traditional");
    return {
      styleName: isKasavu ? "Traditional Kerala Kasavu Bridal" : "Royal South Indian / Fusion Bridal",
      vibe: "Timeless, radiant, and culturally authentic with gold accents",
      estimatedCostRange: "₹45,000 – ₹1.2 Lakh",
      costTier: "mid",
      breakdown: [
        { item: "HD / Airbrush Bridal Makeup & Hair", cost: "₹25k – ₹50k" },
        { item: "Pure Zari Silk Saree / Lehenga", cost: "₹20k – ₹70k" },
        { item: "Temple Jewellery Set (Rental/Custom)", cost: "₹15k – ₹45k" },
        { item: "Fresh Jasmine & Lotus Gajra Styling", cost: "₹3k – ₹8k" },
      ],
      keyElements: ["Dewy long-lasting HD makeup", "Intricate hair braid with jasmine", "Temple gold jewellery", "Kasavu border drape"],
      keralaTouch: "Traditional Mullamottu Mala and Kasavu border with antique gold jhumkas",
      recommendedVendors: [
        { label: "Bridal Makeup Artists", href: "/makeup-artists", emoji: "💄", subtitle: "Certified Airbrush & HD Artists" },
        { label: "Bridal Boutiques", href: "/bridal-wear", emoji: "👰", subtitle: "Kasavu & Designer Sarees" },
        { label: "Temple Jewellery", href: "/jewellery", emoji: "👑", subtitle: "Bridal Ornaments & Rentals" },
      ],
      auraPrompt: "Recommend top bridal makeup artists and Kasavu saree boutiques in Kerala under ₹60,000",
      disclaimer: GENERAL_DISCLAIMER,
    };
  }

  // Groom Looks
  if (category === "Groom Looks" || titleOrAlt.includes("groom") || titleOrAlt.includes("sherwani") || titleOrAlt.includes("kurta")) {
    return {
      styleName: "Regal Kerala Groom Styling",
      vibe: "Sophisticated, crisp silk tailoring with subtle metallic embroidery",
      estimatedCostRange: "₹25,000 – ₹65,000",
      costTier: "mid",
      breakdown: [
        { item: "Pure Silk Kurta & Kasavu Mundu", cost: "₹12k – ₹30k" },
        { item: "Custom Tailored Bandhgala / Sherwani", cost: "₹15k – ₹35k" },
        { item: "Grooming & Styling Session", cost: "₹5k – ₹12k" },
      ],
      keyElements: ["Handwoven raw silk", "Embroidered Angavastram drape", "Leather Mojaris / Kolhapuris"],
      keralaTouch: "Pure gold Kasavu border on fine Thrissur silk Mundu",
      recommendedVendors: [
        { label: "Groom Wear Boutiques", href: "/groom-wear", emoji: "🤵", subtitle: "Sherwanis, Kurtas & Suits" },
        { label: "Men's Grooming", href: "/makeup-artists", emoji: "✂️", subtitle: "Hair & Grooming Styling" },
      ],
      auraPrompt: "Find luxury Kerala groom wear boutiques for silk Mundu and designer Bandhgalas in Kochi",
      disclaimer: GENERAL_DISCLAIMER,
    };
  }

  // Mehendi Designs
  if (category === "Mehendi Designs" || titleOrAlt.includes("mehendi") || titleOrAlt.includes("henna")) {
    return {
      styleName: "Intricate Arabic & Malabar Henna Art",
      vibe: "Delicate storytelling patterns with deep organic stain",
      estimatedCostRange: "₹12,000 – ₹35,000",
      costTier: "budget",
      breakdown: [
        { item: "Bridal Full Arm & Feet Mehendi", cost: "₹8k – ₹22k" },
        { item: "Guest Mehendi (Up to 30 guests)", cost: "₹5k – ₹15k" },
        { item: "Organic 100% Herbal Cones & Sealant", cost: "Included" },
      ],
      keyElements: ["Dulha-Dulhan portrait motifs", "Lotus and peacock mesh", "Organic natural dye"],
      keralaTouch: "Malabar Sufi night celebration styling with colorful cushions & marigolds",
      recommendedVendors: [
        { label: "Mehendi Artists", href: "/mehendi-artists", emoji: "🌿", subtitle: "Top Henna Artists in Kerala" },
        { label: "Mehendi Event Decor", href: "/categories/decor-planning", emoji: "🎉", subtitle: "Colorful Seating & Props" },
      ],
      auraPrompt: "Suggest mehendi artists and colorful backyard decor ideas in Kerala under ₹25,000",
      disclaimer: GENERAL_DISCLAIMER,
    };
  }

  // Wedding Photos
  if (category === "Wedding Photos" || titleOrAlt.includes("photo") || titleOrAlt.includes("couple")) {
    return {
      styleName: "Cinematic Candid Wedding Storytelling",
      vibe: "Warm editorial captures, emotional candid portraits, and golden hour drone shots",
      estimatedCostRange: "₹1.2L – ₹3.2L (Full 2-Day Package)",
      costTier: "mid",
      breakdown: [
        { item: "2 Traditional + 2 Candid Photographers", cost: "₹60k – ₹1.5L" },
        { item: "Cinematic 4K Wedding Film & Teaser", cost: "₹40k – ₹1.1L" },
        { item: "Aerial 4K Drone Coverage", cost: "₹20k – ₹40k" },
        { item: "Premium Leather Bound Photo Album", cost: "₹15k – ₹30k" },
      ],
      keyElements: ["Backwater sunset golden hour", "Candid temple ritual tears & smiles", "Editorial couple portraits"],
      keralaTouch: "Drone footage of traditional houseboat arrival on Vembanad Lake",
      recommendedVendors: [
        { label: "Wedding Photographers", href: "/photographers", emoji: "📸", subtitle: "Candid & Cinematic Teams" },
        { label: "Cinematic Videography", href: "/photographers", emoji: "🎥", subtitle: "4K Films & Drone Coverage" },
      ],
      auraPrompt: "Find top candid wedding photographers in Kerala with backwater destination experience",
      disclaimer: GENERAL_DISCLAIMER,
    };
  }

  // Color Themes (Editorial Palettes)
  if (category === "Color Themes" || isTheme) {
    return {
      styleName: isTheme ? item.title : "Curated Wedding Color Story",
      vibe: "Harmonious visual theme tying stage, bridal silks, invitations, and tablescape together",
      estimatedCostRange: "₹2.5L – ₹6.0L (Comprehensive Theme Execution)",
      costTier: "luxury",
      breakdown: [
        { item: "Color-Coordinated Mandap & Florals", cost: "₹1.5L – ₹3.5L" },
        { item: "Custom Table Linens & Centerpieces", cost: "₹40k – ₹1.0L" },
        { item: "Themed Invitation Suites & Welcome Signage", cost: "₹25k – ₹60k" },
        { item: "Ambient Color-Matched Uplighting", cost: "₹40k – ₹90k" },
      ],
      keyElements: ["Cohesive 5-tone palette", "Natural botanical foliage", "Custom welcome board typography"],
      keralaTouch: "Gold-bordered accents inspired by Travancore heritage and backwater flora",
      recommendedVendors: [
        { label: "Wedding Planners & Decor", href: "/categories/decor-planning", emoji: "📋", subtitle: "Full Theme & Concept Execution" },
        { label: "Decor & Lighting", href: "/categories/decor-planning", emoji: "🎨", subtitle: "Floral & Stage Designers" },
        { label: "Invitation Designers", href: "/invitations", emoji: "💌", subtitle: "Matching Stationery & E-Invites" },
      ],
      auraPrompt: `How do I execute a ${isTheme ? item.title : "Luxury Color Palette"} wedding in Kerala with decor, lighting, and attire?`,
      disclaimer: GENERAL_DISCLAIMER,
    };
  }

  // Default / Decor / Seasonal
  return {
    styleName: "Luxury Kerala Destination Decor",
    vibe: "Seamless blend of tropical Kerala greenery and modern bespoke celebration styling",
    estimatedCostRange: "₹2.0L – ₹4.8L",
    costTier: "mid",
    breakdown: [
      { item: "Entrance Tunnel & Photo Booth", cost: "₹50k – ₹1.2L" },
      { item: "Main Ceremony Backdrop", cost: "₹90k – ₹2.2L" },
      { item: "Ambient Fairy Lights & Lanterns", cost: "₹40k – ₹90k" },
      { item: "Dining Tablescape & Centerpieces", cost: "₹30k – ₹70k" },
    ],
    keyElements: ["Coconut leaf weaving", "Cascading orchids", "Fairy light canopy", "Rustic wooden signage"],
    keralaTouch: "Traditional vettila-pakku trays with brass nilavilakku lighting paths",
    recommendedVendors: [
      { label: "Wedding Decorators", href: "/categories/decor-planning", emoji: "💐", subtitle: "Floral & Concept Specialists" },
      { label: "Venues & Resorts", href: "/venues", emoji: "🏛", subtitle: "Lakeside & Lawn Spaces" },
      { label: "Caterers", href: "/catering", emoji: "🍛", subtitle: "Grand Kerala Sadya & Multi-Cuisine" },
    ],
    auraPrompt: "Create a complete wedding decor and vendor checklist for a Kerala outdoor lawn reception",
    disclaimer: GENERAL_DISCLAIMER,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. DAILY INSPIRATION SPOTLIGHT
// ─────────────────────────────────────────────────────────────────────────────
export interface DailySpotlight {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  category: InspirationCategory;
  styleName: string;
  estimatedBudget: string;
  location: string;
  story: string;
  palette: ColorSwatch[];
  keyHighlights: string[];
  vendorShortlist: { label: string; href: string; emoji: string }[];
}

export const DAILY_INSPIRATION_SPOTLIGHT: DailySpotlight = {
  id: "spotlight-kerala-lotus-mandap",
  title: "The Floating Nilavilakku & Lotus Mandap at Kumarakom Waters",
  subtitle: "Today's Curated Kerala Luxury Spotlight",
  badge: "✨ Daily Inspiration Spotlight",
  image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85",
  category: "Stage Designs",
  styleName: "Heritage Royal Kasavu & Lotus Waterfront Mandap",
  estimatedBudget: "₹3.5L – ₹5.8L (Stage, Florals & Lighting)",
  location: "Kumarakom Lake Resort, Kottayam",
  story:
    "An ethereal sunset ceremony concept set against Vembanad Lake. Featuring an open-canopy timber mandap framed by thousands of pink temple lotus blooms, hand-woven banana trunk pillars, and 108 brass nilavilakku lamps floating on natural uruli pools.",
  palette: [
    { name: "Lotus Pink", hex: "#F472B6" },
    { name: "Temple Gold", hex: "#C8A96A" },
    { name: "Cloche Emerald", hex: "#0F4C45" },
    { name: "Jasmine Cream", hex: "#FFFBEB" },
    { name: "Teak Wood", hex: "#451A03" },
  ],
  keyHighlights: [
    "108 floating oil lamps with rose petals",
    "Open 360° lakeview mandap structure",
    "Live traditional Nadaswaram & Chenda melam entrance",
    "Handloom Kasavu drapery with brass bell tassels",
  ],
  vendorShortlist: [
    { label: "Book Kottayam Decorators", href: "/categories/decor-planning", emoji: "🌸" },
    { label: "Explore Kumarakom Venues", href: "/venues", emoji: "🏛" },
    { label: "Find Candid Photographers", href: "/photographers", emoji: "📸" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. AI MOOD BOARD GENERATOR RECIPES & DATA
// ─────────────────────────────────────────────────────────────────────────────
export interface AIMoodBoardInput {
  weddingType: string;
  colorTheme: string;
  budgetTier: string;
  venueSetting: string;
}

export interface AIMoodBoardResult {
  title: string;
  conceptDescription: string;
  totalEstimatedBudget: string;
  palette: ColorSwatch[];
  budgetAllocation: { category: string; percentage: number; amount: string; emoji: string }[];
  stylingChecklist: string[];
  recommendedVendorCategories: { label: string; href: string; emoji: string; count: number }[];
  suggestedAuraPrompt: string;
}

export const MOODBOARD_OPTIONS = {
  weddingTypes: [
    { id: "kerala-hindu", label: "Traditional Kerala Hindu", icon: "🪔", desc: "Kasavu, lotus mandap & Sadya" },
    { id: "royal-nikah", label: "Royal Malabar Nikah", icon: "🌙", desc: "Zardozi, Sufi decor & Biryani feast" },
    { id: "christian-matrimony", label: "Elegant Christian Matrimony", icon: "🕊️", desc: "Ivory laces, church aisle & reception" },
    { id: "beach-destination", label: "Kovalam Beachfront Destination", icon: "🏖️", desc: "Sunset vows, fairy lights & cocktails" },
    { id: "modern-minimal", label: "Contemporary Minimalist", icon: "🌿", desc: "Pastel florals, pampas grass & glasshouse" },
  ],
  colorThemes: [
    { id: "emerald-gold", label: "Royal Emerald & Gold", previewHex: ["#0F4C45", "#C8A96A", "#FAF7F2"] },
    { id: "pastel-blush", label: "Pastel Peach & Lavender", previewHex: ["#FFEDD5", "#FCE7F3", "#EDE9FE"] },
    { id: "sunset-rust", label: "Terracotta & Sunset Rust", previewHex: ["#9A3412", "#CA8A04", "#D6D3D1"] },
    { id: "temple-crimson", label: "Temple Crimson & Ruby", previewHex: ["#991B1B", "#C8A96A", "#FFFBEB"] },
    { id: "ivory-champagne", label: "Ivory & Champagne Luxe", previewHex: ["#FAFAF8", "#F7E7CE", "#E8E0D4"] },
  ],
  budgetTiers: [
    { id: "intimate", label: "Intimate / Boutique", range: "₹4L – ₹8 Lakhs", desc: "50-150 guests" },
    { id: "grand", label: "Grand Celebration", range: "₹8L – ₹18 Lakhs", desc: "200-450 guests" },
    { id: "luxury", label: "Ultra Luxury Destination", range: "₹18L – ₹40+ Lakhs", desc: "500+ guests" },
  ],
  venueSettings: [
    { id: "backwater-lawn", label: "Backwater Lawn & Lakefront", icon: "🌊" },
    { id: "heritage-palace", label: "Heritage Palace / Kovilakam", icon: "👑" },
    { id: "five-star-ballroom", label: "5-Star Luxury Ballroom", icon: "✨" },
    { id: "cliff-beach", label: "Kovalam / Varkala Cliff Beach", icon: "🏖️" },
    { id: "hilltop-estate", label: "Munnar / Wayanad Hilltop", icon: "⛰️" },
  ],
};

export function generateAIMoodBoard(input: AIMoodBoardInput): AIMoodBoardResult {
  const typeObj = MOODBOARD_OPTIONS.weddingTypes.find((t) => t.id === input.weddingType) || MOODBOARD_OPTIONS.weddingTypes[0];
  const colorObj = MOODBOARD_OPTIONS.colorThemes.find((c) => c.id === input.colorTheme) || MOODBOARD_OPTIONS.colorThemes[0];
  const budgetObj = MOODBOARD_OPTIONS.budgetTiers.find((b) => b.id === input.budgetTier) || MOODBOARD_OPTIONS.budgetTiers[1];
  const venueObj = MOODBOARD_OPTIONS.venueSettings.find((v) => v.id === input.venueSetting) || MOODBOARD_OPTIONS.venueSettings[0];

  const paletteMap: Record<string, ColorSwatch[]> = {
    "emerald-gold": [
      { name: "Cloche Emerald", hex: "#0F4C45" },
      { name: "Brushed Gold", hex: "#C8A96A" },
      { name: "Pearl Ivory", hex: "#FAF7F2" },
      { name: "Forest Green", hex: "#064E3B" },
      { name: "Warm Amber", hex: "#D97706" },
    ],
    "pastel-blush": [
      { name: "Soft Peach", hex: "#FFEDD5" },
      { name: "Dusty Blush", hex: "#FCE7F3" },
      { name: "French Lavender", hex: "#EDE9FE" },
      { name: "Sage Mist", hex: "#DCFCE7" },
      { name: "Pearl White", hex: "#FFFFFF" },
    ],
    "sunset-rust": [
      { name: "Terracotta Clay", hex: "#9A3412" },
      { name: "Sunset Rust", hex: "#C2410C" },
      { name: "Mustard Ochre", hex: "#CA8A04" },
      { name: "Earthen Sand", hex: "#D6D3D1" },
      { name: "Charcoal Teak", hex: "#292524" },
    ],
    "temple-crimson": [
      { name: "Sindoor Crimson", hex: "#991B1B" },
      { name: "Temple Gold", hex: "#C8A96A" },
      { name: "Ruby Red", hex: "#7F1D1D" },
      { name: "Sandalwood", hex: "#A16207" },
      { name: "Jasmine Cream", hex: "#FFFBEB" },
    ],
    "ivory-champagne": [
      { name: "Bridal Ivory", hex: "#FAFAF8" },
      { name: "Champagne Sparkle", hex: "#F7E7CE" },
      { name: "Warm Pearl", hex: "#E8E0D4" },
      { name: "Blush Frost", hex: "#FCE7F3" },
      { name: "Rose Gold", hex: "#E8B4B8" },
    ],
  };

  const budgetSplitMap: Record<string, { decor: string; catering: string; photo: string; styling: string; av: string }> = {
    intimate: { decor: "₹2.2 Lakhs", catering: "₹2.5 Lakhs", photo: "₹1.2 Lakhs", styling: "₹60,000", av: "₹50,000" },
    grand: { decor: "₹4.5 Lakhs", catering: "₹5.5 Lakhs", photo: "₹2.2 Lakhs", styling: "₹1.2 Lakhs", av: "₹1.5 Lakhs" },
    luxury: { decor: "₹10.5 Lakhs", catering: "₹12.0 Lakhs", photo: "₹4.5 Lakhs", styling: "₹2.5 Lakhs", av: "₹3.5 Lakhs" },
  };

  const splits = budgetSplitMap[input.budgetTier] || budgetSplitMap.grand;

  return {
    title: `${colorObj.label} — ${typeObj.label} at ${venueObj.label}`,
    conceptDescription: `A tailored ${typeObj.label} concept designed for ${venueObj.label}. Featuring an elevated ${colorObj.label} palette, cohesive floral arrangements, atmospheric lighting, and authentic Kerala heritage nuances.`,
    totalEstimatedBudget: budgetObj.range,
    palette: paletteMap[input.colorTheme] || paletteMap["emerald-gold"],
    budgetAllocation: [
      { category: "Stage, Mandap & Florals", percentage: 32, amount: splits.decor, emoji: "🌸" },
      { category: "Grand Feast / Sadya & Catering", percentage: 36, amount: splits.catering, emoji: "🍛" },
      { category: "Candid & Drone Photography", percentage: 16, amount: splits.photo, emoji: "📸" },
      { category: "Bridal & Groom Couture", percentage: 9, amount: splits.styling, emoji: "👰" },
      { category: "Lighting, Sound & Entertainment", percentage: 7, amount: splits.av, emoji: "✨" },
    ],
    stylingChecklist: [
      `Custom ${colorObj.label} mandap canopy tailored for ${venueObj.label}`,
      "Color-matched aisle runner with cascading fresh floral borders",
      "Ambient architectural uplighting calibrated to sunset timings",
      "Bespoke welcome mirror / acrylic signage with couple's monogram",
      "Theme-coordinated guest dining tablescapes with brass nilavilakku centerpieces",
      "Dedicated photo booth backdrop with fresh botanicals and warm fairy lights",
    ],
    recommendedVendorCategories: [
      { label: "Decorators & Floral Designers", href: "/categories/decor-planning", emoji: "🌸", count: 48 },
      { label: "Wedding Venues & Resorts", href: "/venues", emoji: "🏛", count: 62 },
      { label: "Candid Photographers", href: "/photographers", emoji: "📸", count: 35 },
      { label: "Bridal Makeup & Styling", href: "/makeup-artists", emoji: "💄", count: 54 },
      { label: "Wedding Planners", href: "/categories/wedding-planners", emoji: "📋", count: 28 },
    ],
    suggestedAuraPrompt: `I want to plan a ${typeObj.label} wedding with a ${colorObj.label} theme at ${venueObj.label} for a budget of ${budgetObj.range}. Give me a complete milestone timeline, shortlist top verified Kerala vendors, and breakdown my daily planning checklist.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CATEGORY PILLS & POPULAR AUTOCOMPLETE SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────────────
export interface InspirationCategoryItem {
  id: string;
  label: string;
  emoji: string;
  image: string;
  isStatic?: boolean;
}

export const INSPIRATION_CATEGORIES: InspirationCategoryItem[] = [
  {
    id: "All",
    label: "All Categories",
    emoji: "✨",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "Bridal Looks",
    label: "Bridal Looks",
    emoji: "👰",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "Stage Designs",
    label: "Stage & Mandap",
    emoji: "✨",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "Trending Decor",
    label: "Trending Decor",
    emoji: "💐",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "Groom Looks",
    label: "Groom Looks",
    emoji: "🤵",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "Mehendi Designs",
    label: "Mehendi Designs",
    emoji: "🌿",
    image: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "Wedding Photos",
    label: "Wedding Photos",
    emoji: "📸",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "Color Themes",
    label: "Color Themes",
    emoji: "🎨",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=400&q=80",
    isStatic: true,
  },
  {
    id: "Seasonal Trends",
    label: "Seasonal Trends",
    emoji: "🌸",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=400&q=80",
  },
];

export const DYNAMIC_CATEGORIES: InspirationCategory[] = [
  "Wedding Photos",
  "Trending Decor",
  "Bridal Looks",
  "Groom Looks",
  "Mehendi Designs",
  "Stage Designs",
  "Seasonal Trends",
];

// Smart Autocomplete Suggestions for Search
export const SMART_SEARCH_SUGGESTIONS = [
  { text: "Luxury Mandap", category: "Stage Designs", type: "Style" },
  { text: "Traditional Kasavu Bridal", category: "Bridal Looks", type: "Kerala Heritage" },
  { text: "Royal Reception", category: "Stage Designs", type: "Style" },
  { text: "Pastel Wedding Theme", category: "Color Themes", type: "Palette" },
  { text: "Kovalam Beach Reception", category: "Seasonal Trends", type: "Destination" },
  { text: "Backwater Houseboat Entry", category: "Wedding Photos", type: "Experience" },
  { text: "Malabar Mehendi Night", category: "Mehendi Designs", type: "Celebration" },
  { text: "Budget under ₹3 Lakhs", category: "Trending Decor", type: "Budget" },
  { text: "Lotus & Nilavilakku Decor", category: "Stage Designs", type: "Kerala Heritage" },
  { text: "Monsoon Glasshouse Mandap", category: "Seasonal Trends", type: "Seasonal" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. TOP COLLECTIONS & TRENDING IN KERALA (16 Curated Cards)
// ─────────────────────────────────────────────────────────────────────────────
export interface InspirationCollection {
  id: string;
  label: string;
  emoji: string;
  category: InspirationCategory | "Color Themes";
  gradient: string;
  badge?: string;
  subtext: string;
}

export const INSPIRATION_COLLECTIONS: InspirationCollection[] = [
  { id: "trending", label: "Trending in Kerala", emoji: "🔥", category: "Wedding Photos", gradient: "from-orange-500 to-rose-600", badge: "Hot", subtext: "Viral Kerala wedding moments" },
  { id: "kasavu", label: "Kasavu & Gold Royalty", emoji: "👑", category: "Bridal Looks", gradient: "from-[#0F4C45] to-[#12584E]", badge: "Heritage", subtext: "Pure silk & temple jewellery" },
  { id: "mandap", label: "Luxury Mandap Stages", emoji: "✨", category: "Stage Designs", gradient: "from-amber-600 to-yellow-500", badge: "Popular", subtext: "Fresh lotus & brass bells" },
  { id: "backwaters", label: "Backwater Destination", emoji: "🌊", category: "Seasonal Trends", gradient: "from-teal-600 to-emerald-800", subtext: "Kumarakom & Alleppey vows" },
  { id: "pastel", label: "Pastel Blossom Themes", emoji: "🌸", category: "Color Themes", gradient: "from-pink-400 to-purple-500", subtext: "Peach, lavender & blush" },
  { id: "beach", label: "Kovalam Beach Weddings", emoji: "🏖️", category: "Seasonal Trends", gradient: "from-sky-500 to-blue-700", subtext: "Sunset cliffside ceremonies" },
  { id: "mehendi", label: "Malabar Mehendi Nights", emoji: "🌿", category: "Mehendi Designs", gradient: "from-amber-500 to-orange-600", subtext: "Intricate Sufi & bridal henna" },
  { id: "minimal", label: "Minimal Botanical Decor", emoji: "🌿", category: "Trending Decor", gradient: "from-stone-500 to-stone-700", subtext: "Pampas, glass & eucalyptus" },
  { id: "monsoon", label: "Monsoon Glasshouse", emoji: "🌧️", category: "Seasonal Trends", gradient: "from-teal-500 to-cyan-700", subtext: "Rain-friendly luxury setups" },
  { id: "reception", label: "Grand Royal Receptions", emoji: "🎉", category: "Stage Designs", gradient: "from-purple-600 to-indigo-700", subtext: "Crystal chandeliers & staging" },
  { id: "photography", label: "Candid Couple Stories", emoji: "📸", category: "Wedding Photos", gradient: "from-slate-700 to-gray-900", subtext: "Emotional & editorial shots" },
  { id: "groom", label: "Kerala Groom Couture", emoji: "🤵", category: "Groom Looks", gradient: "from-blue-600 to-indigo-800", subtext: "Silk mundus & bandhgalas" },
  { id: "crimson", label: "Temple Crimson & Ruby", emoji: "❤️", category: "Color Themes", gradient: "from-red-600 to-rose-900", subtext: "Classic south Indian red" },
  { id: "terracotta", label: "Terracotta & Sunset Rust", emoji: "🏺", category: "Color Themes", gradient: "from-amber-700 to-red-800", subtext: "Earthy bohemian tones" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. VENDOR DIRECTORY MAPPINGS
// ─────────────────────────────────────────────────────────────────────────────
export const CATEGORY_VENDOR_LINKS: Record<string, { label: string; href: string; emoji: string; sub: string }[]> = {
  "Stage Designs": [
    { label: "Stage Decorators", href: "/categories/decor-planning", emoji: "🌸", sub: "Mandap & Stage Designers" },
    { label: "Wedding Venues", href: "/venues", emoji: "🏛", sub: "Resorts & Convention Halls" },
    { label: "Flower Decorators", href: "/categories/flower-decoration", emoji: "💐", sub: "Fresh Floral Supply" },
  ],
  "Trending Decor": [
    { label: "Decor & Lighting", href: "/categories/decor-planning", emoji: "💐", sub: "Thematic Event Decor" },
    { label: "Wedding Planners", href: "/categories/wedding-planners", emoji: "📋", sub: "Full Event Production" },
  ],
  "Bridal Looks": [
    { label: "Bridal Makeup", href: "/makeup-artists", emoji: "💄", sub: "HD & Airbrush Specialists" },
    { label: "Bridal Boutiques", href: "/bridal-wear", emoji: "👰", sub: "Kasavu, Sarees & Lehengas" },
    { label: "Temple Jewellery", href: "/jewellery", emoji: "👑", sub: "Gold & Diamond Sets" },
  ],
  "Groom Looks": [
    { label: "Groom Wear", href: "/groom-wear", emoji: "🤵", sub: "Sherwanis & Silk Mundus" },
  ],
  "Mehendi Designs": [
    { label: "Mehendi Artists", href: "/mehendi-artists", emoji: "🌿", sub: "Bridal & Guest Henna" },
    { label: "Event Decorators", href: "/categories/decor-planning", emoji: "🎉", sub: "Colorful Seating Props" },
  ],
  "Wedding Photos": [
    { label: "Photographers", href: "/photographers", emoji: "📸", sub: "Candid & Portrait Masters" },
    { label: "Videographers", href: "/categories/videographers", emoji: "🎥", sub: "4K Cinematic Films & Drone" },
  ],
  "Seasonal Trends": [
    { label: "Destination Venues", href: "/venues", emoji: "🏖️", sub: "Backwater & Beach Resorts" },
    { label: "Wedding Planners", href: "/categories/wedding-planners", emoji: "📋", sub: "Destination Logistics" },
  ],
  "Color Themes": [
    { label: "Wedding Planners", href: "/categories/wedding-planners", emoji: "🎨", sub: "Palette Concept Execution" },
    { label: "Decor Designers", href: "/categories/decor-planning", emoji: "💐", sub: "Color-Matched Staging" },
    { label: "Invitation Designers", href: "/invitations", emoji: "💌", sub: "Matching Stationery" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. STATIC EDITORIAL COLOR THEMES
// ─────────────────────────────────────────────────────────────────────────────
export const STATIC_COLOR_THEMES: StaticColorTheme[] = [
  {
    id: "color-emerald-gold",
    category: "Color Themes",
    title: "Royal Emerald & Champagne Gold",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square",
    description: "The Cloche signature luxury palette — deep forest greens, polished brass nilavilakku, and brushed champagne gold silks.",
    colorTheme: [
      { name: "Cloche Emerald", hex: "#0F4C45" },
      { name: "Champagne Gold", hex: "#C8A96A" },
      { name: "Pearl Ivory", hex: "#FAF7F2" },
      { name: "Forest Canopy", hex: "#064E3B" },
      { name: "Mahogany Warmth", hex: "#451A03" },
    ],
    tags: ["Emerald", "Gold", "Luxury", "Royal", "Cloche Signature"],
    estimatedBudget: "₹3.5L – ₹6.5L",
    styleTag: "Royal Heritage",
    locationTag: "Kochi / Trivandrum Palace",
  },
  {
    id: "color-pastel-blossom",
    category: "Color Themes",
    title: "Pastel Blossom: Peach, Blush & Lavender",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description: "Airy, romantic, and modern — soft peach organza drapery, French lavender hydrangeas, and blush spray roses.",
    colorTheme: [
      { name: "Soft Peach", hex: "#FFEDD5" },
      { name: "Dusty Blush", hex: "#FCE7F3" },
      { name: "French Lavender", hex: "#EDE9FE" },
      { name: "Sage Mist", hex: "#DCFCE7" },
      { name: "Silver Frost", hex: "#E2E8F0" },
    ],
    tags: ["Pastel", "Blush", "Lavender", "Spring", "Romantic"],
    estimatedBudget: "₹2.2L – ₹4.5L",
    styleTag: "Modern Romantic",
    locationTag: "Kumarakom Lawn",
  },
  {
    id: "color-terracotta-rust",
    category: "Color Themes",
    title: "Terracotta, Ochre & Sunset Rust",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall",
    description: "Warm earthy tones inspired by Kerala terracotta architecture — burnt sienna marigolds, mustard silks, and raw teakwood.",
    colorTheme: [
      { name: "Terracotta Clay", hex: "#9A3412" },
      { name: "Sunset Rust", hex: "#C2410C" },
      { name: "Mustard Ochre", hex: "#CA8A04" },
      { name: "Earthen Sand", hex: "#D6D3D1" },
      { name: "Teak Bark", hex: "#292524" },
    ],
    tags: ["Terracotta", "Rust", "Ochre", "Earth Tone", "Boho"],
    estimatedBudget: "₹1.8L – ₹3.8L",
    styleTag: "Earthy Bohemian",
    locationTag: "Calicut Beachside",
  },
  {
    id: "color-crimson-ruby",
    category: "Color Themes",
    title: "Royal Crimson & Temple Gold",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square",
    description: "The timeless South Indian bridal story — deep crimson silk, zardozi gold embroidery, ruby stones, and fragrant jasmine.",
    colorTheme: [
      { name: "Sindoor Crimson", hex: "#991B1B" },
      { name: "Zardozi Gold", hex: "#C8A96A" },
      { name: "Temple Ruby", hex: "#7F1D1D" },
      { name: "Sandalwood", hex: "#A16207" },
      { name: "Jasmine White", hex: "#FFFBEB" },
    ],
    tags: ["Crimson", "Red", "Gold", "Temple", "South Indian"],
    estimatedBudget: "₹3.0L – ₹6.0L",
    styleTag: "Temple Heritage",
    locationTag: "Guruvayur / Thrissur",
  },
  {
    id: "color-ivory-champagne",
    category: "Color Themes",
    title: "Ivory & Champagne Elegance",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "landscape",
    description: "Refined minimalism in ivory, champagne, and warm whites — ideal for church ceremonies and sunset cocktail receptions.",
    colorTheme: [
      { name: "Bridal Ivory", hex: "#FAFAF8" },
      { name: "Champagne", hex: "#F7E7CE" },
      { name: "Warm Pearl", hex: "#E8E0D4" },
      { name: "Blush Flush", hex: "#FCE7F3" },
      { name: "Rose Gold", hex: "#E8B4B8" },
    ],
    tags: ["Ivory", "Champagne", "White", "Minimal", "Christian Wedding"],
    estimatedBudget: "₹2.5L – ₹5.0L",
    styleTag: "Classic Elegance",
    locationTag: "Kochi Cathedral & Ballroom",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 8. AURA CONTEXTUAL PROMPTS
// ─────────────────────────────────────────────────────────────────────────────
export const AURA_INSPIRATION_PROMPTS = [
  "Show luxury Kerala wedding decorations",
  "Suggest a royal reception theme under ₹5 Lakhs",
  "Show pastel stage decorations for backwaters",
  "Plan a complete ₹10 Lakh Kerala wedding budget",
  "Find traditional Kasavu bridal makeup & jewellery",
];

// ─────────────────────────────────────────────────────────────────────────────
// 9. DEFAULT USER BOARDS
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_BOARDS = [
  { id: "dream-wedding", name: "❤️ Dream Wedding" },
  { id: "reception", name: "💍 Reception Ideas" },
  { id: "bridal-looks", name: "👰 Bridal Looks" },
  { id: "decor", name: "🎨 Decor & Florals" },
  { id: "photography", name: "📸 Photography Poses" },
];

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

export interface InspirationItem {
  id: string;
  title: string;
  category: InspirationCategory;
  image: string;
  aspectRatio: "portrait" | "tall" | "square" | "landscape";
  description: string;
  colorTheme?: ColorSwatch[];
  tags: string[];
  city?: string;
  season?: string;
  style?: string;
}

export const INSPIRATION_CATEGORIES: { id: string; label: string; count?: number }[] = [
  { id: "All", label: "All Inspirations" },
  { id: "Wedding Photos", label: "Wedding Photos" },
  { id: "Trending Decor", label: "Trending Decor" },
  { id: "Bridal Looks", label: "Bridal Looks" },
  { id: "Groom Looks", label: "Groom Looks" },
  { id: "Mehendi Designs", label: "Mehendi Designs" },
  { id: "Stage Designs", label: "Stage Designs" },
  { id: "Color Themes", label: "Color Themes" },
  { id: "Seasonal Trends", label: "Seasonal Trends" },
];

export const INSPIRATION_ITEMS: InspirationItem[] = [
  // 1. STAGE DESIGNS
  {
    id: "insp-stage-1",
    title: "Cascading Orchid & Brass Bell Mandap Stage",
    category: "Stage Designs",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall",
    description: "A breathtaking traditional Kerala stage concept featuring hand-strung white tuberoses, cascading fresh orchids, and antique brass hanging temple bells with warm ambient flood lighting.",
    colorTheme: [
      { name: "Antique Brass Gold", hex: "#C8A96A" },
      { name: "Temple Jasmine White", hex: "#F8F6F2" },
      { name: "Deep Forest Green", hex: "#0F4C45" },
      { name: "Ochre Saffron", hex: "#D97706" },
      { name: "Lotus Pink", hex: "#F472B6" }
    ],
    tags: ["Stage", "Mandap", "Floral", "Brass Bells", "Traditional Kerala", "Orchids"],
    city: "Thrissur",
    style: "Royal Heritage",
    season: "Winter"
  },
  {
    id: "insp-stage-2",
    title: "Minimalist Geometry & Pampas Floral Arch Stage",
    category: "Stage Designs",
    image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description: "A contemporary chic reception stage with soft ivory arched frames, warm Edison bulb illumination, and neutral pampas grass interwoven with blush English garden roses.",
    colorTheme: [
      { name: "Ivory Cream", hex: "#FAF7F2" },
      { name: "Blush Rose", hex: "#E8C8C8" },
      { name: "Edison Amber", hex: "#F59E0B" },
      { name: "Dusty Cedar", hex: "#A87676" },
      { name: "Soft Linen", hex: "#E5E0D8" }
    ],
    tags: ["Stage", "Reception", "Minimal", "Pampas Grass", "Modern Chic", "Pastel"],
    city: "Kochi",
    style: "Modern Minimal",
    season: "Spring"
  },
  {
    id: "insp-stage-3",
    title: "Royal Mughal Dome & Velvet Lotus Mandap",
    category: "Stage Designs",
    image: "https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square",
    description: "A palatial stage installation reminiscent of Mughal architecture with carved golden pillars, velvet drapery in crimson red, and an expansive 30-foot floral chandelier.",
    colorTheme: [
      { name: "Royal Crimson", hex: "#881337" },
      { name: "Palace Gold", hex: "#D4AF37" },
      { name: "Imperial Ruby", hex: "#9F1239" },
      { name: "Warm Champagne", hex: "#F7E7CE" },
      { name: "Emerald Accent", hex: "#064E3B" }
    ],
    tags: ["Stage", "Royal Wedding", "Mughal", "Floral Chandelier", "Luxury"],
    city: "Trivandrum",
    style: "Royal Heritage",
    season: "Winter"
  },

  // 2. BRIDAL LOOKS
  {
    id: "insp-bridal-1",
    title: "Handwoven Crimson Kanchipuram with Antique Gold Border",
    category: "Bridal Looks",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall",
    description: "Pure mulberry silk crimson red Kanchipuram saree intricately handwoven with Mayil (peacock) motifs, paired with an embroidered zardozi blouse and fresh malligai veni.",
    colorTheme: [
      { name: "Sindoor Crimson", hex: "#991B1B" },
      { name: "Zardozi Gold", hex: "#C8A96A" },
      { name: "Fresh Jasmine", hex: "#FFFFFA" },
      { name: "Raw Silk Ochre", hex: "#B45309" },
      { name: "Deep Maroon", hex: "#450A0A" }
    ],
    tags: ["Bridal", "Kanchipuram", "Silk Saree", "Red Saree", "Traditional Kerala", "Malligai"],
    city: "Thrissur",
    style: "Traditional Kerala",
    season: "All Season"
  },
  {
    id: "insp-bridal-2",
    title: "Pastel Mint & Rose Quartz Embroidered Lehenga",
    category: "Bridal Looks",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description: "A dreamy pastel bridal ensemble with fine threadwork, Swarovski crystal highlights, and a sheer organza dupatta draped in effortless modern symmetry.",
    colorTheme: [
      { name: "Mint Frost", hex: "#D1FAE5" },
      { name: "Rose Quartz", hex: "#FBCFE8" },
      { name: "Champagne Shimmer", hex: "#FDE68A" },
      { name: "Soft Ivory", hex: "#F9FAFB" },
      { name: "Muted Olive", hex: "#6EE7B7" }
    ],
    tags: ["Bridal", "Lehenga", "Pastel", "Reception", "Organza", "Swarovski"],
    city: "Kochi",
    style: "Modern Minimal",
    season: "Spring"
  },
  {
    id: "insp-bridal-3",
    title: "Kasavu Kerala Bride with Heritage Temple Polki",
    category: "Bridal Looks",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square",
    description: "Classic Kerala bride styling featuring a double-layered golden Kasavu saree, Nagapadam necklace, Palakka mala, and natural dewy glass-skin bridal makeup.",
    colorTheme: [
      { name: "Kasavu Gold", hex: "#EAB308" },
      { name: "Off-White Cream", hex: "#FAF5FF" },
      { name: "Emerald Palakka", hex: "#047857" },
      { name: "Ruby Nagapadam", hex: "#BE123C" },
      { name: "Natural Bronze", hex: "#78350F" }
    ],
    tags: ["Bridal", "Kasavu", "Palakka Mala", "Temple Jewellery", "Kerala Bride", "Dewy Glam"],
    city: "Kozhikode",
    style: "Traditional Kerala",
    season: "All Season"
  },

  // 3. GROOM LOOKS
  {
    id: "insp-groom-1",
    title: "Raw Silk Ivory Sherwani with Heritage Resham Zari",
    category: "Groom Looks",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall",
    description: "Regal structured raw silk sherwani finished with mother-of-pearl buttons, a subtle tonal resham zari stole, and handcrafted bullion wire juttis.",
    colorTheme: [
      { name: "Raw Ivory", hex: "#FDFBF7" },
      { name: "Muted Gold", hex: "#D4AF37" },
      { name: "Parchment Warmth", hex: "#E2D9CC" },
      { name: "Charcoal Accent", hex: "#262626" },
      { name: "Pearl Luster", hex: "#F5F5F4" }
    ],
    tags: ["Groom", "Sherwani", "Raw Silk", "Royal Groom", "Ivory"],
    city: "Kochi",
    style: "Royal Heritage",
    season: "Winter"
  },
  {
    id: "insp-groom-2",
    title: "Bespoke Emerald Green Bandhgala Suit",
    category: "Groom Looks",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description: "Contemporary tailored deep emerald bandhgala crafted from Italian wool-silk blend, complemented by antique crest buttons and an understated metallic lapel brooch.",
    colorTheme: [
      { name: "Cloche Emerald", hex: "#0F4C45" },
      { name: "Crest Gold", hex: "#C8A96A" },
      { name: "Midnight Teal", hex: "#115E59" },
      { name: "Tuxedo Black", hex: "#171717" },
      { name: "Crisp White", hex: "#FFFFFF" }
    ],
    tags: ["Groom", "Bandhgala", "Emerald", "Reception", "Evening Wear"],
    city: "Trivandrum",
    style: "Modern Minimal",
    season: "Winter"
  },

  // 4. TRENDING DECOR
  {
    id: "insp-decor-1",
    title: "Floating Lotus Urulis & Brass Diya Welcome Walkway",
    category: "Trending Decor",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "landscape",
    description: "A tranquil entryway featuring tiered Kerala brass urulis floating with fresh pink lotus petals, marigold garlands, and rows of glowing earthen oil lamps.",
    colorTheme: [
      { name: "Marigold Yellow", hex: "#F59E0B" },
      { name: "Lotus Petal", hex: "#EC4899" },
      { name: "Antique Brass", hex: "#B45309" },
      { name: "Water Reflection", hex: "#0284C7" },
      { name: "Deep Twilight", hex: "#1E293B" }
    ],
    tags: ["Decor", "Uruli", "Lotus", "Walkway", "Diya", "Entrance Decor", "Kerala Wedding"],
    city: "Kochi",
    style: "Traditional Kerala",
    season: "All Season"
  },
  {
    id: "insp-decor-2",
    title: "Bohemian Sunset Beachside Canopy & Fairy Lights",
    category: "Trending Decor",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description: "A magical coastal dinner setup with wooden bamboo trusses, flowing sheer muslin drapes, macrame accents, and thousands of ambient fairy lights against the Arabian Sea.",
    colorTheme: [
      { name: "Sunset Tangerine", hex: "#FB923C" },
      { name: "Sand Warmth", hex: "#D6D3D1" },
      { name: "Fairy Gold", hex: "#FEF08A" },
      { name: "Ocean Teal", hex: "#0F766E" },
      { name: "Driftwood Brown", hex: "#78716C" }
    ],
    tags: ["Decor", "Beachside", "Boho", "Fairy Lights", "Coastal Wedding", "Dinner Canopy"],
    city: "Alappuzha",
    style: "Beachside Glamour",
    season: "Winter"
  },
  {
    id: "insp-decor-3",
    title: "Botanical Glasshouse Conservatory Table Decor",
    category: "Trending Decor",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square",
    description: "Long imperial dining tables adorned with lush Italian ruscus garlands, white hydrangeas, tall crystal taper candles, and gold-rimmed charger plates.",
    colorTheme: [
      { name: "Botanical Leaf", hex: "#15803D" },
      { name: "Hydrangea White", hex: "#F8FAFC" },
      { name: "Taper Amber", hex: "#FDE047" },
      { name: "Gold Rim", hex: "#CA8A04" },
      { name: "Slate Grey", hex: "#475569" }
    ],
    tags: ["Decor", "Table Decor", "Centerpieces", "Candlelight", "Botanical", "Reception"],
    city: "Munnar",
    style: "Garden Romance",
    season: "Summer"
  },

  // 5. MEHENDI DESIGNS
  {
    id: "insp-mehendi-1",
    title: "Intricate Royal Dulha-Dulhan Storyline Mehendi",
    category: "Mehendi Designs",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall",
    description: "Detailed bridal bridal henna incorporating personalized portraits of the couple, wedding date glyphs, temple procession jharokha arches, and micro-mandala palms.",
    colorTheme: [
      { name: "Deep Henna Stain", hex: "#78350F" },
      { name: "Warm Terracotta", hex: "#C2410C" },
      { name: "Ochre Powder", hex: "#D97706" },
      { name: "Ivory Base", hex: "#FFFBEB" },
      { name: "Coffee Hue", hex: "#451A03" }
    ],
    tags: ["Mehendi", "Bridal Henna", "Dulha Dulhan", "Storyline", "Intricate", "Full Hand"],
    city: "Thrissur",
    style: "Royal Heritage",
    season: "All Season"
  },
  {
    id: "insp-mehendi-2",
    title: "Organic Arabic Floral Vines & Mandala Palms",
    category: "Mehendi Designs",
    image: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description: "Light and airy Indo-Arabic floral vines winding through the fingers with negative space accents and symmetrical central lotus mandalas.",
    colorTheme: [
      { name: "Mahogany Henna", hex: "#7C2D12" },
      { name: "Burnt Cinnamon", hex: "#9A3412" },
      { name: "Skin Tone Rose", hex: "#FED7AA" },
      { name: "Almond Cream", hex: "#FEF3C7" },
      { name: "Dark Walnut", hex: "#3B1408" }
    ],
    tags: ["Mehendi", "Arabic", "Mandala", "Floral Vines", "Negative Space", "Minimal"],
    city: "Kochi",
    style: "Modern Minimal",
    season: "All Season"
  },

  // 6. WEDDING PHOTOS
  {
    id: "insp-photo-1",
    title: "Candid Sunset Silhouette on Kumarakom Backwaters",
    category: "Wedding Photos",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "landscape",
    description: "A timeless emotional portrait of the bride and groom at the bow of a traditional Kerala wooden boat as the golden hour reflections shimmer across the backwaters.",
    colorTheme: [
      { name: "Golden Glow", hex: "#F59E0B" },
      { name: "Backwater Cyan", hex: "#0E7490" },
      { name: "Silhouette Navy", hex: "#0F172A" },
      { name: "Sunset Crimson", hex: "#BE123C" },
      { name: "Warm Mist", hex: "#FEF3C7" }
    ],
    tags: ["Photography", "Backwaters", "Kumarakom", "Sunset", "Candid", "Couple Portrait"],
    city: "Alappuzha",
    style: "Traditional Kerala",
    season: "Monsoon"
  },
  {
    id: "insp-photo-2",
    title: "The Joyful Haldi Floral Shower Celebration",
    category: "Wedding Photos",
    image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description: "An unscripted burst of pure happiness captured during the haldi ceremony with cascading yellow marigold petals caught in mid-air motion.",
    colorTheme: [
      { name: "Haldi Saffron", hex: "#EAB308" },
      { name: "Marigold Orange", hex: "#EA580C" },
      { name: "Sunlight Yellow", hex: "#FACC15" },
      { name: "Pool Turquoise", hex: "#06B6D4" },
      { name: "Pure White", hex: "#FFFFFF" }
    ],
    tags: ["Photography", "Haldi", "Candid", "Flower Shower", "Celebration", "Joy"],
    city: "Thrissur",
    style: "Traditional Kerala",
    season: "Summer"
  },
  {
    id: "insp-photo-3",
    title: "The Emotional Tali Kettu Wedding Ritual Moment",
    category: "Wedding Photos",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall",
    description: "High-speed macro capture of the holy thali tying ceremony surrounded by glowing brass nilavilakkus and family blessings.",
    colorTheme: [
      { name: "Sacred Gold", hex: "#D97706" },
      { name: "Nilavilakku Glow", hex: "#FBBF24" },
      { name: "Kasavu Thread", hex: "#FDE68A" },
      { name: "Charcoal Depth", hex: "#1C1917" },
      { name: "Sandalwood", hex: "#A16207" }
    ],
    tags: ["Photography", "Ritual", "Tali Kettu", "Nilavilakku", "Sacred", "Kerala Wedding"],
    city: "Kozhikode",
    style: "Traditional Kerala",
    season: "Winter"
  },

  // 7. COLOR THEMES
  {
    id: "insp-color-1",
    title: "Royal Emerald & Champagne Gold Theme",
    category: "Color Themes",
    image: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "square",
    description: "A distinguished imperial palette balancing deep forest greens, brushed champagne gold accents, pearl ivory silks, and rich mahogany woodwork.",
    colorTheme: [
      { name: "Cloche Emerald", hex: "#0F4C45" },
      { name: "Champagne Gold", hex: "#C8A96A" },
      { name: "Pearl Ivory", hex: "#FAF7F2" },
      { name: "Forest Canopy", hex: "#064E3B" },
      { name: "Mahogany Warmth", hex: "#451A03" }
    ],
    tags: ["Color Theme", "Emerald", "Gold", "Luxury", "Royal Theme", "Palette"],
    city: "Kochi",
    style: "Royal Heritage",
    season: "Winter"
  },
  {
    id: "insp-color-2",
    title: "Pastel Blossom: Peach, Blush & Lavender Theme",
    category: "Color Themes",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description: "An airy, romantic color story blending soft peach organza, French lavender hydrangeas, blush spray roses, and brushed silver candle holders.",
    colorTheme: [
      { name: "Soft Peach", hex: "#FFEDD5" },
      { name: "Dusty Blush", hex: "#FCE7F3" },
      { name: "French Lavender", hex: "#EDE9FE" },
      { name: "Sage Mist", hex: "#DCFCE7" },
      { name: "Silver Frost", hex: "#E2E8F0" }
    ],
    tags: ["Color Theme", "Pastel", "Blush", "Lavender", "Spring Wedding", "Romantic"],
    city: "Munnar",
    style: "Garden Romance",
    season: "Spring"
  },
  {
    id: "insp-color-3",
    title: "Sunset Ochre, Terracotta & Rust Autumn Theme",
    category: "Color Themes",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall",
    description: "Warm earthy tones inspired by Kerala terracotta architecture, burnt sienna marigolds, mustard silks, and rustic raw teakwood.",
    colorTheme: [
      { name: "Terracotta Clay", hex: "#9A3412" },
      { name: "Sunset Rust", hex: "#C2410C" },
      { name: "Mustard Ochre", hex: "#CA8A04" },
      { name: "Earthen Sand", hex: "#D6D3D1" },
      { name: "Teak Bark", hex: "#292524" }
    ],
    tags: ["Color Theme", "Terracotta", "Rust", "Ochre", "Earth Tone", "Boho"],
    city: "Palakkad",
    style: "Boho Chic",
    season: "Monsoon"
  },

  // 8. SEASONAL TRENDS
  {
    id: "insp-season-1",
    title: "Monsoon Palace Courtyard Wedding Under Glass Domes",
    category: "Seasonal Trends",
    image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "landscape",
    description: "Celebrating Kerala's romantic monsoon season under transparent climate-controlled glass pavilions with rain drumming softly while guests stay dry.",
    colorTheme: [
      { name: "Raindrop Glass", hex: "#E0F2FE" },
      { name: "Wet Slate", hex: "#334155" },
      { name: "Fern Green", hex: "#166534" },
      { name: "Warm Edison", hex: "#F59E0B" },
      { name: "Ivory Chiffon", hex: "#F8FAFC" }
    ],
    tags: ["Seasonal", "Monsoon Wedding", "Glass Pavilion", "Palace", "Kerala Monsoon"],
    city: "Kochi",
    style: "Royal Heritage",
    season: "Monsoon"
  },
  {
    id: "insp-season-2",
    title: "Sun-Drenched Winter Lawn Festivities in Munnar",
    category: "Seasonal Trends",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "tall",
    description: "Crisp winter morning ceremonies in the misty tea plantations with open-air amphitheater seating, hot spice tea stations, and pine needle floral paths.",
    colorTheme: [
      { name: "Pine Forest", hex: "#064E3B" },
      { name: "Morning Mist", hex: "#F1F5F9" },
      { name: "Chai Spice", hex: "#92400E" },
      { name: "Winter Sun", hex: "#FEF08A" },
      { name: "Wood Smoke", hex: "#475569" }
    ],
    tags: ["Seasonal", "Winter Wedding", "Munnar", "Hill Station", "Tea Plantation", "Outdoor"],
    city: "Munnar",
    style: "Garden Romance",
    season: "Winter"
  },
  {
    id: "insp-season-3",
    title: "Vibrant Summer Poolside Sangeet & Neon Drapes",
    category: "Seasonal Trends",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "portrait",
    description: "High-energy summer evening pool party setup with tropical palm centerpieces, color-pop neon pink and turquoise cushions, and floating LED water balls.",
    colorTheme: [
      { name: "Neon Pink", hex: "#EC4899" },
      { name: "Pool Turquoise", hex: "#06B6D4" },
      { name: "Citrus Lime", hex: "#84CC16" },
      { name: "Sunny Mango", hex: "#F59E0B" },
      { name: "Night Indigo", hex: "#312E81" }
    ],
    tags: ["Seasonal", "Summer Wedding", "Sangeet", "Pool Party", "Vibrant", "Color Pop"],
    city: "Kochi",
    style: "Modern Minimal",
    season: "Summer"
  }
];

export const AURA_INSPIRATION_PROMPTS = [
  "Show luxury Kerala wedding stage decorations",
  "Suggest pastel wedding color palettes for 2026",
  "Find traditional Kasavu bridal styling ideas",
  "Show outdoor mandap designs with floral pools",
  "Suggest wedding photo poses for backwaters",
];

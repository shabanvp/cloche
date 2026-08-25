export interface DigitalInviteTemplate {
  id: string;
  slug: string;
  name: string;
  collection:
    | "Royal Palace"
    | "Kerala Traditional"
    | "Floral"
    | "Watercolor"
    | "Luxury Black & Gold"
    | "Islamic Wedding"
    | "South Indian Temple"
    | "Beach Wedding"
    | "Mountain"
    | "Garden Wedding"
    | "Vintage"
    | "Modern Minimal"
    | "Luxury Emerald"
    | "Boho"
    | "Celestial"
    | "Destination Wedding"
    | "Engagement"
    | "Mehendi"
    | "Haldi"
    | "Reception";
  category:
    | "Wedding Cards"
    | "Save the Date"
    | "Video Invitations"
    | "Reception"
    | "Engagement"
    | "Mehendi"
    | "Haldi"
    | "Sangeet";
  type: "card" | "video" | "multi-page";
  image: string;
  badge: "Free" | "Premium" | "New" | "Trending";
  style: string;
  themeColor: string;
  bgGradient: string;
  fontStyle: string;
  musicTrack?: string;
  pages: {
    title: string;
    description: string;
    bgStyle: string;
  }[];
}

export const INVITATION_COLLECTIONS = [
  "All",
  "Royal Palace",
  "Kerala Traditional",
  "Floral",
  "Watercolor",
  "Luxury Black & Gold",
  "Islamic Wedding",
  "South Indian Temple",
  "Beach Wedding",
  "Mountain",
  "Garden Wedding",
  "Vintage",
  "Modern Minimal",
  "Luxury Emerald",
  "Boho",
  "Celestial",
  "Destination Wedding",
  "Engagement",
  "Mehendi",
  "Haldi",
  "Reception",
] as const;

export const DIGITAL_INVITATION_CATEGORIES = [
  "All",
  "Wedding Cards",
  "Save the Date",
  "Video Invitations",
  "Reception",
  "Engagement",
  "Mehendi",
  "Haldi",
  "Sangeet",
] as const;

export const DIGITAL_INVITATION_FILTERS = [
  "All",
  "Trending",
  "Premium",
  "Free",
  "New",
] as const;

// Unsplash high quality wedding photo assets pool
const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80",
];

// Helper to build 100+ unique handcrafted templates across all 20 collections
function generate100Templates(): DigitalInviteTemplate[] {
  const collectionsData: {
    collection: DigitalInviteTemplate["collection"];
    templates: {
      name: string;
      category: DigitalInviteTemplate["category"];
      type: DigitalInviteTemplate["type"];
      badge: DigitalInviteTemplate["badge"];
      style: string;
      themeColor: string;
      bgGradient: string;
      fontStyle: string;
      musicTrack?: string;
    }[];
  }[] = [
    {
      collection: "Royal Palace",
      templates: [
        { name: "Taj Lake Palace Chandelier", category: "Wedding Cards", type: "multi-page", badge: "Premium", style: "Golden Arches & Marble Heraldry", themeColor: "#B45309", bgGradient: "from-amber-950 via-yellow-900 to-amber-900", fontStyle: "Cinzel" },
        { name: "Udaivilas Regal Court", category: "Save the Date", type: "card", badge: "Trending", style: "Embossed Gold & Royal Crest", themeColor: "#78350F", bgGradient: "from-yellow-950 via-amber-900 to-red-950", fontStyle: "Playfair Display" },
        { name: "Jodhpur Fort Grandeur", category: "Video Invitations", type: "video", badge: "New", style: "Animated Palace Arch & Orchestra", themeColor: "#991B1B", bgGradient: "from-red-950 via-rose-950 to-amber-950", fontStyle: "Cormorant Garamond", musicTrack: "Royal Shehnai & Sitar Symphony" },
        { name: "Jaipur City Palace Lattice", category: "Wedding Cards", type: "multi-page", badge: "Free", style: "Pink City Fresco & Gold Foil", themeColor: "#BE123C", bgGradient: "from-rose-950 via-pink-900 to-amber-950", fontStyle: "Great Vibes" },
        { name: "Rambagh Palace Evening", category: "Reception", type: "multi-page", badge: "Premium", style: "Candlelight Courtyard & Marble", themeColor: "#1E1B4B", bgGradient: "from-indigo-950 via-slate-900 to-amber-950", fontStyle: "Cinzel" },
      ],
    },
    {
      collection: "Kerala Traditional",
      templates: [
        { name: "Kumarakom Backwater Sunset", category: "Wedding Cards", type: "multi-page", badge: "Trending", style: "Banana Leaf & Nilavilakku Lamps", themeColor: "#0F4C45", bgGradient: "from-emerald-950 via-[#0F4C45] to-teal-950", fontStyle: "Playfair Display" },
        { name: "Guruvayur Temple Muhurtham", category: "Save the Date", type: "card", badge: "Free", style: "Traditional Kasavu Saree Border", themeColor: "#D97706", bgGradient: "from-amber-900 via-yellow-900 to-emerald-950", fontStyle: "Cinzel" },
        { name: "Kathakali Royal Heritage", category: "Video Invitations", type: "video", badge: "New", style: "Animated Kathakali & Chenda Melam", themeColor: "#15803D", bgGradient: "from-green-950 via-emerald-900 to-teal-950", fontStyle: "Montserrat", musicTrack: "Traditional Nadaswaram & Thavil" },
        { name: "Munnar Tea Gardens Union", category: "Engagement", type: "multi-page", badge: "Free", style: "Misty Green & Jasmine Garlands", themeColor: "#047857", bgGradient: "from-[#0F4C45] via-teal-900 to-emerald-950", fontStyle: "Cormorant Garamond" },
        { name: "Vembanad Houseboat Voyage", category: "Reception", type: "card", badge: "Premium", style: "Palm Shadow & Sunset Gold", themeColor: "#B45309", bgGradient: "from-amber-950 via-[#0F4C45] to-emerald-950", fontStyle: "Great Vibes" },
      ],
    },
    {
      collection: "Floral",
      templates: [
        { name: "Pastel Peony Romance", category: "Save the Date", type: "multi-page", badge: "Free", style: "Hand-drawn Soft Pink Peonies", themeColor: "#BE185D", bgGradient: "from-rose-950 via-pink-900 to-pink-950", fontStyle: "Great Vibes" },
        { name: "White Rose Minimalist", category: "Wedding Cards", type: "card", badge: "Trending", style: "Ivory Linen & Pearl Roses", themeColor: "#475569", bgGradient: "from-slate-900 via-zinc-800 to-[#0F4C45]", fontStyle: "Playfair Display" },
        { name: "Cherry Blossom Spring", category: "Engagement", type: "multi-page", badge: "New", style: "Soft Sakura Petals & Gold Dust", themeColor: "#DB2777", bgGradient: "from-fuchsia-950 via-[#0F4C45] to-rose-950", fontStyle: "Cormorant Garamond" },
        { name: "Vintage Botanical Garden", category: "Haldi", type: "card", badge: "Free", style: "Eucalyptus Leaves & Marigold", themeColor: "#CA8A04", bgGradient: "from-amber-950 via-[#0F4C45] to-yellow-950", fontStyle: "Montserrat" },
        { name: "Hydrangea Luxe Bloom", category: "Reception", type: "video", badge: "Premium", style: "Animated Petal Shower & Harp", themeColor: "#6D28D9", bgGradient: "from-purple-950 via-slate-900 to-indigo-950", fontStyle: "Cinzel", musicTrack: "Soft Romantic Harp Score" },
      ],
    },
    {
      collection: "Watercolor",
      templates: [
        { name: "Sunset Horizon Wash", category: "Save the Date", type: "card", badge: "Trending", style: "Blushed Terracotta Brush Strokes", themeColor: "#C2410C", bgGradient: "from-orange-950 via-amber-900 to-rose-950", fontStyle: "Playfair Display" },
        { name: "Teal Lagoon Watercolor", category: "Wedding Cards", type: "multi-page", badge: "Free", style: "Liquid Emerald & Metallic Gold Foil", themeColor: "#0F4C45", bgGradient: "from-teal-950 via-[#0F4C45] to-emerald-900", fontStyle: "Cormorant Garamond" },
        { name: "Lavender Dream Canvas", category: "Mehendi", type: "card", badge: "New", style: "Pastel Purple Gradient & Henna Motif", themeColor: "#7E22CE", bgGradient: "from-purple-950 via-pink-950 to-indigo-950", fontStyle: "Great Vibes" },
        { name: "Ocean Breeze Splash", category: "Sangeet", type: "video", badge: "Premium", style: "Animated Watercolor Waves", themeColor: "#0284C7", bgGradient: "from-sky-950 via-teal-900 to-slate-950", fontStyle: "Cinzel", musicTrack: "Acoustic Ocean Guitar" },
        { name: "Monochrome Ink & Wash", category: "Reception", type: "multi-page", badge: "Free", style: "Charcoal Fluid Art & Gold Crest", themeColor: "#334155", bgGradient: "from-slate-950 via-charcoal to-zinc-900", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Luxury Black & Gold",
      templates: [
        { name: "Black Velvet Gold Foil", category: "Wedding Cards", type: "multi-page", badge: "Premium", style: "Black Velvet Texture & 24k Gold Crest", themeColor: "#D97706", bgGradient: "from-[#0F4C45] via-black to-slate-950", fontStyle: "Cinzel" },
        { name: "Midnight Geometric Lattice", category: "Save the Date", type: "card", badge: "Trending", style: "Art Deco Gold Lines on Obsidian", themeColor: "#B45309", bgGradient: "from-zinc-950 via-[#0F4C45] to-black", fontStyle: "Playfair Display" },
        { name: "Royal Obsidian Chandelier", category: "Reception", type: "video", badge: "New", style: "Animated Sparkling Gold Lights", themeColor: "#CA8A04", bgGradient: "from-neutral-950 via-amber-950 to-black", fontStyle: "Cormorant Garamond", musicTrack: "Gala Symphony Score" },
        { name: "Gothic Gold Monogram", category: "Sangeet", type: "multi-page", badge: "Premium", style: "Embossed Calligraphy on Noir Matte", themeColor: "#EAB308", bgGradient: "from-slate-950 via-[#0F4C45] to-[#0F4C45]", fontStyle: "Great Vibes" },
        { name: "Elegance Noir Minimalist", category: "Engagement", type: "card", badge: "Free", style: "Sleek Matte Black & Gold Foil", themeColor: "#F59E0B", bgGradient: "from-[#0F4C45] via-black to-zinc-900", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Islamic Wedding",
      templates: [
        { name: "Arabesque Gold Geometry", category: "Wedding Cards", type: "multi-page", badge: "Premium", style: "Traditional Islamic Arch & Arabesque", themeColor: "#0F4C45", bgGradient: "from-emerald-950 via-[#0F4C45] to-teal-950", fontStyle: "Cinzel" },
        { name: "Crescent Moon Nikkah", category: "Save the Date", type: "card", badge: "Trending", style: "Gold Crescent & Starry Night", themeColor: "#B45309", bgGradient: "from-indigo-950 via-blue-950 to-slate-900", fontStyle: "Playfair Display" },
        { name: "Marrakech Royal Pavilion", category: "Reception", type: "multi-page", badge: "New", style: "Mosaics & Gold Calligraphy", themeColor: "#BE123C", bgGradient: "from-rose-950 via-[#0F4C45] to-amber-950", fontStyle: "Cormorant Garamond" },
        { name: "Teal Tile Walima Suite", category: "Video Invitations", type: "video", badge: "Free", style: "Animated Geometric Tiles & Sitar", themeColor: "#0D9488", bgGradient: "from-teal-950 via-emerald-950 to-slate-900", fontStyle: "Great Vibes", musicTrack: "Arabic Oud & Flute Melody" },
        { name: "White Damask Blessing", category: "Wedding Cards", type: "card", badge: "Free", style: "Ivory Damask & Gold Crescent", themeColor: "#D97706", bgGradient: "from-[#0F4C45] via-[#145C54] to-[#0F4C45]", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "South Indian Temple",
      templates: [
        { name: "Madurai Meenakshi Gopuram", category: "Wedding Cards", type: "multi-page", badge: "Premium", style: "Brass Kuthuvilakku & Temple Arch", themeColor: "#B45309", bgGradient: "from-amber-950 via-yellow-900 to-red-950", fontStyle: "Cinzel" },
        { name: "Kanjeevaram Silk Weaver", category: "Save the Date", type: "card", badge: "Trending", style: "Rich Gold Zari Border & Jasmine", themeColor: "#991B1B", bgGradient: "from-red-950 via-rose-900 to-amber-950", fontStyle: "Playfair Display" },
        { name: "Tanjore Temple Sanctum", category: "Video Invitations", type: "video", badge: "New", style: "Animated Brass Lamp & Nadaswaram", themeColor: "#D97706", bgGradient: "from-yellow-950 via-amber-900 to-[#0F4C45]", fontStyle: "Cormorant Garamond", musicTrack: "Traditional Nadaswaram & Thavil" },
        { name: "Chennai Jasmine Garland", category: "Engagement", type: "multi-page", badge: "Free", style: "Fresh Mallipoo Flowers & Gold Leaf", themeColor: "#047857", bgGradient: "from-emerald-950 via-green-900 to-amber-950", fontStyle: "Great Vibes" },
        { name: "Mysore Palace Kalyanam", category: "Wedding Cards", type: "card", badge: "Free", style: "Haldi Yellow & Crimson Lotus", themeColor: "#CA8A04", bgGradient: "from-yellow-900 via-amber-950 to-red-900", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Beach Wedding",
      templates: [
        { name: "Goa Sunset Palms", category: "Save the Date", type: "card", badge: "Free", style: "Tropical Palm Fronds & Sea Breeze", themeColor: "#0284C7", bgGradient: "from-sky-950 via-teal-900 to-indigo-950", fontStyle: "Playfair Display" },
        { name: "Maldives Coral Romance", category: "Wedding Cards", type: "multi-page", badge: "Trending", style: "Aqua Waters & Sandy Gold Foil", themeColor: "#0D9488", bgGradient: "from-teal-950 via-[#0F4C45] to-emerald-950", fontStyle: "Great Vibes" },
        { name: "Bali Cliffside Sunset", category: "Video Invitations", type: "video", badge: "New", style: "Animated Wave Motion & Waves Audio", themeColor: "#E11D48", bgGradient: "from-rose-950 via-orange-950 to-amber-950", fontStyle: "Cormorant Garamond", musicTrack: "Acoustic Ocean Guitar" },
        { name: "Phuket Tropical Canopy", category: "Reception", type: "multi-page", badge: "Premium", style: "Hibiscus Flowers & Bamboo Lattice", themeColor: "#059669", bgGradient: "from-emerald-950 via-teal-950 to-slate-900", fontStyle: "Cinzel" },
        { name: "Seashell Pearl Minimalism", category: "Engagement", type: "card", badge: "Free", style: "Soft Pearl Sands & Gold Script", themeColor: "#D97706", bgGradient: "from-[#0F4C45] via-[#145C54] to-charcoal", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Mountain",
      templates: [
        { name: "Manali Snowy Pines", category: "Save the Date", type: "multi-page", badge: "Trending", style: "Mist Mountains & Pine Woodland", themeColor: "#334155", bgGradient: "from-slate-950 via-[#0F4C45] to-indigo-950", fontStyle: "Playfair Display" },
        { name: "Shimla Heritage Lodge", category: "Wedding Cards", type: "card", badge: "Free", style: "Rustic Cedar Wood & Gold Crest", themeColor: "#B45309", bgGradient: "from-amber-950 via-orange-950 to-stone-900", fontStyle: "Cinzel" },
        { name: "Kashmir Dal Lake Reflections", category: "Video Invitations", type: "video", badge: "New", style: "Animated Mountain Lake & Flute", themeColor: "#0F4C45", bgGradient: "from-[#0F4C45] via-teal-900 to-sky-950", fontStyle: "Cormorant Garamond", musicTrack: "Mountain Flute Serenade" },
        { name: "Swiss Alps Destination", category: "Reception", type: "multi-page", badge: "Premium", style: "Chalet Luxury & Gold Snowflake", themeColor: "#475569", bgGradient: "from-blue-950 via-slate-900 to-cyan-950", fontStyle: "Great Vibes" },
        { name: "Mussoorie Hills Sunset", category: "Engagement", type: "card", badge: "Free", style: "Pine Silhouette & Sunset Rose", themeColor: "#BE185D", bgGradient: "from-rose-950 via-slate-900 to-indigo-950", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Garden Wedding",
      templates: [
        { name: "English Rose Gazebo", category: "Wedding Cards", type: "multi-page", badge: "Free", style: "Floral Gazebo & Ivy Vines", themeColor: "#BE185D", bgGradient: "from-rose-950 via-emerald-950 to-[#0F4C45]", fontStyle: "Great Vibes" },
        { name: "Fairy Light Botanical", category: "Save the Date", type: "card", badge: "Trending", style: "Sparkling Canopy & Olive Leaves", themeColor: "#059669", bgGradient: "from-emerald-950 via-green-950 to-[#0F4C45]", fontStyle: "Playfair Display" },
        { name: "Tuscan Cypress Garden", category: "Reception", type: "video", badge: "Premium", style: "Animated Garden Pathway & Strings", themeColor: "#B45309", bgGradient: "from-amber-950 via-[#0F4C45] to-emerald-950", fontStyle: "Cinzel", musicTrack: "Romantic Classical Violin" },
        { name: "Verdant Willow Arch", category: "Engagement", type: "multi-page", badge: "New", style: "Weeping Willow & Gold Monogram", themeColor: "#047857", bgGradient: "from-green-950 via-teal-950 to-[#0F4C45]", fontStyle: "Cormorant Garamond" },
        { name: "Glasshouse Conservatory", category: "Wedding Cards", type: "card", badge: "Free", style: "Botanical Glasshouse & Gold Trims", themeColor: "#0F4C45", bgGradient: "from-teal-950 via-[#0F4C45] to-slate-900", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Vintage",
      templates: [
        { name: "Aged Parchment Wax Seal", category: "Wedding Cards", type: "multi-page", badge: "Trending", style: "Textured Parchment & Red Wax Crest", themeColor: "#B45309", bgGradient: "from-amber-950 via-stone-900 to-yellow-950", fontStyle: "Cinzel" },
        { name: "Antique Copperplate Flourish", category: "Save the Date", type: "card", badge: "Free", style: "Hand-engraved Ornaments & Sepia", themeColor: "#78350F", bgGradient: "from-stone-950 via-amber-950 to-stone-900", fontStyle: "Great Vibes" },
        { name: "Royal Victorian Lace", category: "Reception", type: "multi-page", badge: "Premium", style: "Intricate Lace Border & Gold Lettering", themeColor: "#991B1B", bgGradient: "from-red-950 via-[#0F4C45] to-amber-950", fontStyle: "Playfair Display" },
        { name: "Heritage Postcard Gazette", category: "Video Invitations", type: "video", badge: "New", style: "Animated Stamp & Vintage Gramophone", themeColor: "#CA8A04", bgGradient: "from-yellow-950 via-amber-950 to-stone-950", fontStyle: "Cormorant Garamond", musicTrack: "Vintage Gramophone Waltz" },
        { name: "Classic Regency Cream", category: "Engagement", type: "card", badge: "Free", style: "Damask Frame & Monogram Stamp", themeColor: "#475569", bgGradient: "from-[#0F4C45] via-[#145C54] to-charcoal", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Modern Minimal",
      templates: [
        { name: "Editorial Serif Statement", category: "Save the Date", type: "card", badge: "Free", style: "Clean High Contrast Typography", themeColor: "#0F4C45", bgGradient: "from-slate-950 via-charcoal to-[#0F4C45]", fontStyle: "Playfair Display" },
        { name: "Architectural Grid Studio", category: "Wedding Cards", type: "multi-page", badge: "Trending", style: "Structured Layout & Subscribed Lines", themeColor: "#334155", bgGradient: "from-zinc-950 via-slate-900 to-charcoal", fontStyle: "Montserrat" },
        { name: "Monochrome Noir Minimal", category: "Reception", type: "card", badge: "New", style: "Bespoke White Space & Minimal Crest", themeColor: "#0F172A", bgGradient: "from-black via-slate-950 to-zinc-900", fontStyle: "Cinzel" },
        { name: "Clean Type Motion", category: "Video Invitations", type: "video", badge: "Premium", style: "Smooth Motion Typography & Piano", themeColor: "#0F4C45", bgGradient: "from-[#0F4C45] via-teal-950 to-[#0F4C45]", fontStyle: "Cormorant Garamond", musicTrack: "Minimalist Piano Harmony" },
        { name: "Contemporary Line Art", category: "Engagement", type: "multi-page", badge: "Free", style: "Single Line Silhouette & Sage Accent", themeColor: "#059669", bgGradient: "from-emerald-950 via-[#0F4C45] to-slate-900", fontStyle: "Great Vibes" },
      ],
    },
    {
      collection: "Luxury Emerald",
      templates: [
        { name: "Royal Emerald Gold Crest", category: "Wedding Cards", type: "multi-page", badge: "Premium", style: "Deep Emerald Velvet & 24k Gold Foil", themeColor: "#0F4C45", bgGradient: "from-emerald-950 via-[#0F4C45] to-teal-950", fontStyle: "Cinzel" },
        { name: "Malachite Lattice Realm", category: "Save the Date", type: "card", badge: "Trending", style: "Geometric Emerald Patterns", themeColor: "#047857", bgGradient: "from-[#0F4C45] via-emerald-900 to-teal-950", fontStyle: "Playfair Display" },
        { name: "Emerald & Diamond Regency", category: "Reception", type: "video", badge: "New", style: "Animated Sparkling Gemstones", themeColor: "#0D9488", bgGradient: "from-teal-950 via-[#0F4C45] to-emerald-950", fontStyle: "Cormorant Garamond", musicTrack: "Gala Symphony Score" },
        { name: "Jade Botanical Royalty", category: "Mehendi", type: "multi-page", badge: "Free", style: "Gold Foil Botanical Vines", themeColor: "#059669", bgGradient: "from-green-950 via-[#0F4C45] to-emerald-950", fontStyle: "Great Vibes" },
        { name: "Velvet Emerald Monogram", category: "Sangeet", type: "card", badge: "Free", style: "Matte Emerald & Gold Monogram", themeColor: "#10B981", bgGradient: "from-emerald-950 via-[#145C54] to-charcoal", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Boho",
      templates: [
        { name: "Pampas Grass Terracotta", category: "Save the Date", type: "card", badge: "Trending", style: "Dried Palms & Warm Earth Tones", themeColor: "#C2410C", bgGradient: "from-orange-950 via-stone-900 to-amber-950", fontStyle: "Great Vibes" },
        { name: "Bohemian Sunset Arch", category: "Wedding Cards", type: "multi-page", badge: "Free", style: "Warm Neutral Tones & Sun Motif", themeColor: "#B45309", bgGradient: "from-amber-950 via-[#0F4C45] to-[#0F4C45]", fontStyle: "Playfair Display" },
        { name: "Macrame & Botanical Wreath", category: "Engagement", type: "multi-page", badge: "New", style: "Natural Fibers & Eucalyptus", themeColor: "#15803D", bgGradient: "from-stone-950 via-green-950 to-[#0F4C45]", fontStyle: "Cormorant Garamond" },
        { name: "Desert Rose Oasis", category: "Mehendi", type: "video", badge: "Premium", style: "Animated Pampas & Acoustic Guitar", themeColor: "#BE185D", bgGradient: "from-rose-950 via-orange-950 to-[#0F4C45]", fontStyle: "Cinzel", musicTrack: "Acoustic Sunset Guitar" },
        { name: "Clay & Eucalyptus Minimal", category: "Reception", type: "card", badge: "Free", style: "Earth Clay Colorway & Gold Foil", themeColor: "#A16207", bgGradient: "from-yellow-950 via-stone-900 to-[#0F4C45]", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Celestial",
      templates: [
        { name: "Midnight Moon & Starry Sky", category: "Save the Date", type: "card", badge: "Trending", style: "Constellations & Gold Moon Phases", themeColor: "#1E1B4B", bgGradient: "from-indigo-950 via-[#0F4C45] to-blue-950", fontStyle: "Cinzel" },
        { name: "Cosmic Union Galaxy", category: "Wedding Cards", type: "multi-page", badge: "Premium", style: "Deep Sapphire Nebula & Gold Dust", themeColor: "#312E81", bgGradient: "from-blue-950 via-indigo-950 to-[#0F4C45]", fontStyle: "Playfair Display" },
        { name: "Starlight Ceremony Motion", category: "Video Invitations", type: "video", badge: "New", style: "Animated Falling Shooting Stars", themeColor: "#4338CA", bgGradient: "from-[#0F4C45] via-indigo-950 to-[#0F4C45]", fontStyle: "Cormorant Garamond", musicTrack: "Celestial Harp Serenade" },
        { name: "Zodiac Monogram Crest", category: "Engagement", type: "multi-page", badge: "Free", style: "Gold Constellation Crest", themeColor: "#6366F1", bgGradient: "from-indigo-900 via-slate-950 to-[#0F4C45]", fontStyle: "Great Vibes" },
        { name: "Aurora Borealis Dream", category: "Reception", type: "card", badge: "Free", style: "Northern Lights Gradient & Gold", themeColor: "#0D9488", bgGradient: "from-teal-950 via-emerald-950 to-indigo-950", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Destination Wedding",
      templates: [
        { name: "Udaipur Lake Palace Suite", category: "Wedding Cards", type: "multi-page", badge: "Premium", style: "Udaipur Pavilions & Boat Arrival", themeColor: "#B45309", bgGradient: "from-amber-950 via-yellow-900 to-[#0F4C45]", fontStyle: "Cinzel" },
        { name: "Santorini Cliffside White", category: "Save the Date", type: "card", badge: "Trending", style: "Aegean Blue Dome & Bougainvillea", themeColor: "#0284C7", bgGradient: "from-sky-950 via-[#0F4C45] to-[#0F4C45]", fontStyle: "Playfair Display" },
        { name: "Paris Eiffel Romance", category: "Engagement", type: "multi-page", badge: "New", style: "Parisian Lattice & Pastel Rose", themeColor: "#BE185D", bgGradient: "from-pink-950 via-rose-950 to-slate-900", fontStyle: "Great Vibes" },
        { name: "Dubai Skyline Gold", category: "Reception", type: "video", badge: "Premium", style: "Animated Glittering Towers & Oud", themeColor: "#D97706", bgGradient: "from-yellow-950 via-amber-950 to-black", fontStyle: "Cormorant Garamond", musicTrack: "Arabic Oud & Flute Melody" },
        { name: "Bali Jungle Villa", category: "Save the Date", type: "card", badge: "Free", style: "Emerald Palms & Sacred Temple", themeColor: "#059669", bgGradient: "from-emerald-950 via-[#0F4C45] to-[#0F4C45]", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Engagement",
      templates: [
        { name: "Solitaire Diamond Crest", category: "Engagement", type: "card", badge: "Trending", style: "Sparkling Diamond Emblem & Gold", themeColor: "#0284C7", bgGradient: "from-sky-950 via-indigo-950 to-slate-900", fontStyle: "Cinzel" },
        { name: "We Said Yes Ring Wreath", category: "Engagement", type: "multi-page", badge: "Free", style: "Rose Gold Rings & Floral Arch", themeColor: "#BE185D", bgGradient: "from-rose-950 via-[#0F4C45] to-[#0F4C45]", fontStyle: "Great Vibes" },
        { name: "Sunset Toast Motion", category: "Video Invitations", type: "video", badge: "New", style: "Animated Champagne Glasses", themeColor: "#D97706", bgGradient: "from-amber-950 via-orange-950 to-[#0F4C45]", fontStyle: "Cormorant Garamond", musicTrack: "Acoustic Sunset Guitar" },
        { name: "Modern Minimal Ring", category: "Engagement", type: "card", badge: "Free", style: "Clean Line Art Ring & White Space", themeColor: "#0F4C45", bgGradient: "from-[#0F4C45] via-teal-950 to-slate-900", fontStyle: "Playfair Display" },
        { name: "Luxe Monogram Ring", category: "Engagement", type: "multi-page", badge: "Premium", style: "Foil Monogram & Velvet Background", themeColor: "#78350F", bgGradient: "from-amber-950 via-[#0F4C45] to-emerald-950", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Mehendi",
      templates: [
        { name: "Henna Paisley Fiesta", category: "Mehendi", type: "multi-page", badge: "Trending", style: "Traditional Henna Motifs & Marigold", themeColor: "#047857", bgGradient: "from-emerald-950 via-yellow-900 to-[#0F4C45]", fontStyle: "Great Vibes" },
        { name: "Pastel Marigold Canopy", category: "Mehendi", type: "card", badge: "Free", style: "Yellow Marigold Garland Border", themeColor: "#CA8A04", bgGradient: "from-yellow-900 via-amber-950 to-emerald-950", fontStyle: "Playfair Display" },
        { name: "Dhol Beats Motion", category: "Video Invitations", type: "video", badge: "New", style: "Animated Dhol & Festive Confetti", themeColor: "#D97706", bgGradient: "from-amber-950 via-orange-900 to-red-950", fontStyle: "Cormorant Garamond", musicTrack: "Festive Dhol & Shehnai Beats" },
        { name: "Teal & Saffron Mehendi", category: "Mehendi", type: "multi-page", badge: "Premium", style: "Dual Toned Jewel Foil & Henna", themeColor: "#0D9488", bgGradient: "from-teal-950 via-[#0F4C45] to-amber-950", fontStyle: "Cinzel" },
        { name: "Minimalist Henna Blossom", category: "Mehendi", type: "card", badge: "Free", style: "Single Henna Bloom & Sand Background", themeColor: "#0F4C45", bgGradient: "from-[#0F4C45] via-[#145C54] to-charcoal", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Haldi",
      templates: [
        { name: "Turmeric Gold Ceremony", category: "Haldi", type: "card", badge: "Free", style: "Sunlit Yellow & Brass Thali Motifs", themeColor: "#D97706", bgGradient: "from-yellow-900 via-amber-950 to-orange-950", fontStyle: "Great Vibes" },
        { name: "Marigold Shower Bliss", category: "Haldi", type: "multi-page", badge: "Trending", style: "Falling Yellow Petals & Floral Gate", themeColor: "#CA8A04", bgGradient: "from-amber-900 via-yellow-950 to-red-950", fontStyle: "Playfair Display" },
        { name: "Uptown Haldi Poolside", category: "Video Invitations", type: "video", badge: "New", style: "Animated Yellow Flowers & Upbeat Beat", themeColor: "#EAB308", bgGradient: "from-yellow-950 via-orange-950 to-amber-900", fontStyle: "Cormorant Garamond", musicTrack: "Upbeat Haldi Celebration" },
        { name: "Traditional Brass & Lotus", category: "Haldi", type: "multi-page", badge: "Premium", style: "Embossed Brass Bowls & Lotus", themeColor: "#B45309", bgGradient: "from-amber-950 via-yellow-900 to-red-900", fontStyle: "Cinzel" },
        { name: "Minimal Yellow Ray", category: "Haldi", type: "card", badge: "Free", style: "Clean Yellow Gradient & Golden Text", themeColor: "#EAB308", bgGradient: "from-yellow-900 via-amber-950 to-stone-900", fontStyle: "Montserrat" },
      ],
    },
    {
      collection: "Reception",
      templates: [
        { name: "Royal Gala Stage Lights", category: "Reception", type: "multi-page", badge: "Premium", style: "Chandelier Glow & Velvet Stage", themeColor: "#991B1B", bgGradient: "from-rose-950 via-red-950 to-amber-950", fontStyle: "Cinzel" },
        { name: "Champagne Toast Evening", category: "Reception", type: "card", badge: "Trending", style: "Gold Sparkle & Champagne Bubbles", themeColor: "#B45309", bgGradient: "from-amber-950 via-yellow-950 to-black", fontStyle: "Playfair Display" },
        { name: "Grand Symphony Waltz", category: "Video Invitations", type: "video", badge: "New", style: "Animated Ballroom Lights & Strings", themeColor: "#4338CA", bgGradient: "from-indigo-950 via-purple-950 to-slate-950", fontStyle: "Cormorant Garamond", musicTrack: "Gala Symphony Score" },
        { name: "Burgundy Velvet Luxury", category: "Reception", type: "multi-page", badge: "Free", style: "Deep Wine Velvet & Gold Script", themeColor: "#881337", bgGradient: "from-rose-950 via-red-950 to-[#0F4C45]", fontStyle: "Great Vibes" },
        { name: "Midnight Orchestra Suite", category: "Reception", type: "card", badge: "Free", style: "Dark Navy & Gold Foil Monogram", themeColor: "#1E3A8A", bgGradient: "from-blue-950 via-slate-900 to-black", fontStyle: "Montserrat" },
      ],
    },
  ];

  const generatedTemplates: DigitalInviteTemplate[] = [];
  let counter = 1;

  collectionsData.forEach(({ collection, templates }) => {
    templates.forEach((tpl) => {
      const templateId = `tpl-${counter}`;
      const slug = `${tpl.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${counter}`;
      const imageIndex = (counter - 1) % PRESET_IMAGES.length;

      generatedTemplates.push({
        id: templateId,
        slug,
        name: tpl.name,
        collection,
        category: tpl.category,
        type: tpl.type,
        image: PRESET_IMAGES[imageIndex],
        badge: tpl.badge,
        style: tpl.style,
        themeColor: tpl.themeColor,
        bgGradient: tpl.bgGradient,
        fontStyle: tpl.fontStyle,
        musicTrack: tpl.musicTrack,
        pages: [
          {
            title: `${tpl.name} — Welcome`,
            description: `Cordially invite you to celebrate the joyous union in ${collection} style.`,
            bgStyle: tpl.bgGradient,
          },
          {
            title: "Ceremony & Itinerary",
            description: `Traditional rituals and celebratory feasts scheduled with love.`,
            bgStyle: tpl.bgGradient,
          },
          {
            title: "Venue & Map Location",
            description: "Grand Pavilion Resort & Hotel Ballroom",
            bgStyle: tpl.bgGradient,
          },
          {
            title: "RSVP & Warm Regards",
            description: "Kindly confirm your gracious presence by RSVP date.",
            bgStyle: tpl.bgGradient,
          },
        ],
      });

      counter++;
    });
  });

  return generatedTemplates;
}

export const DIGITAL_INVITE_TEMPLATES: DigitalInviteTemplate[] = generate100Templates();

export type TemplateFamily =
  | "royal-palace"
  | "floral-garden"
  | "watercolor"
  | "kerala-heritage"
  | "south-indian-temple"
  | "islamic-luxury"
  | "christian-cathedral"
  | "beach-wedding"
  | "mountain-wedding"
  | "vintage-letter"
  | "royal-scroll"
  | "passport-invitation"
  | "boarding-pass"
  | "newspaper-announcement"
  | "magazine-cover"
  | "scrapbook"
  | "photo-album"
  | "botanical-minimal"
  | "luxury-black-gold"
  | "celestial"
  | "mandala"
  | "peacock-theme"
  | "lotus-theme"
  | "art-deco"
  | "contemporary-abstract";

export interface DigitalInviteTemplate {
  id: string;
  slug: string;
  name: string;
  collection: string;
  family: TemplateFamily;
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
  badge: "Free" | "Premium" | "New" | "Trending";
  style: string;
  themeColor: string;
  fontStyle?: string;
  musicTrack?: string;
  pages: {
    title: string;
    description: string;
  }[];
}

export const DIGITAL_INVITE_TEMPLATES: DigitalInviteTemplate[] = [
  {
    id: "tpl-1",
    slug: "royal-palace-grandeur",
    name: "Royal Palace Grandeur",
    collection: "Royal Palace",
    family: "royal-palace",
    category: "Wedding Cards",
    type: "multi-page",
    badge: "Premium",
    style: "Large palace artwork & luxury gold details",
    themeColor: "#D4AF37",
    fontStyle: "Cinzel",
    pages: [{ title: "Shubh Vivah", description: "Royal Palace Union" }],
  },
  {
    id: "tpl-2",
    slug: "floral-garden-romance",
    name: "Floral Garden Romance",
    collection: "Floral Garden",
    family: "floral-garden",
    category: "Wedding Cards",
    type: "card",
    badge: "Trending",
    style: "Oversized garden flowers framing the invitation",
    themeColor: "#EE7214",
    fontStyle: "Cormorant Garamond",
    pages: [{ title: "Garden Vows", description: "Blooming Love" }],
  },
  {
    id: "tpl-3",
    slug: "watercolor-pastel-wash",
    name: "Watercolor Pastel Wash",
    collection: "Watercolor",
    family: "watercolor",
    category: "Save the Date",
    type: "card",
    badge: "Free",
    style: "Hand-painted floral watercolor artwork",
    themeColor: "#0F4C45",
    fontStyle: "Great Vibes",
    pages: [{ title: "Watercolor Sunset", description: "Pastel Vows" }],
  },
  {
    id: "tpl-4",
    slug: "kerala-kasavu-heritage",
    name: "Kerala Kasavu Heritage",
    collection: "Kerala Heritage",
    family: "kerala-heritage",
    category: "Wedding Cards",
    type: "multi-page",
    badge: "Trending",
    style: "Kasavu gold zari, Nilavilakku, & banana leaves",
    themeColor: "#F59E0B",
    fontStyle: "Playfair Display",
    pages: [{ title: "Subha Vivaham", description: "Kerala Kasavu Feast" }],
  },
  {
    id: "tpl-5",
    slug: "south-indian-gopuram",
    name: "South Indian Temple Sanctum",
    collection: "South Indian Temple",
    family: "south-indian-temple",
    category: "Wedding Cards",
    type: "multi-page",
    badge: "New",
    style: "Temple entrance & Dravidian motifs",
    themeColor: "#991B1B",
    fontStyle: "Cinzel",
    pages: [{ title: "Subha Muhurtham", description: "Divine Temple Union" }],
  },
  {
    id: "tpl-6",
    slug: "islamic-arabesque-luxury",
    name: "Islamic Arabesque Luxury",
    collection: "Islamic Luxury",
    family: "islamic-luxury",
    category: "Wedding Cards",
    type: "multi-page",
    badge: "Premium",
    style: "Geometric patterns & Arabic-inspired gold artwork",
    themeColor: "#D4AF37",
    fontStyle: "Cinzel",
    pages: [{ title: "Bismillah Nikkah", description: "Walima Feast" }],
  },
  {
    id: "tpl-7",
    slug: "christian-cathedral-stained-glass",
    name: "Cathedral Grace Christian",
    collection: "Christian Cathedral",
    family: "christian-cathedral",
    category: "Wedding Cards",
    type: "card",
    badge: "Free",
    style: "Stained-glass arch & church motifs",
    themeColor: "#94A3B8",
    fontStyle: "Cinzel",
    pages: [{ title: "Holy Matrimony", description: "Cathedral Covenant" }],
  },
  {
    id: "tpl-8",
    slug: "beach-wedding-sunset",
    name: "Beach Sunset Waves",
    collection: "Beach Wedding",
    family: "beach-wedding",
    category: "Save the Date",
    type: "card",
    badge: "Trending",
    style: "Ocean waves, tropical palm trees & sunset",
    themeColor: "#38BDF8",
    fontStyle: "Playfair Display",
    pages: [{ title: "Sunset Vows", description: "Barefoot by the Sea" }],
  },
  {
    id: "tpl-9",
    slug: "mountain-alpine-pines",
    name: "Mountain Alpine Pines",
    collection: "Mountain Wedding",
    family: "mountain-wedding",
    category: "Save the Date",
    type: "card",
    badge: "Free",
    style: "Snow peaks, pine forests & mountain theme",
    themeColor: "#64748B",
    fontStyle: "Playfair Display",
    pages: [{ title: "Alpine Vows", description: "Lakeside Mountain Union" }],
  },
  {
    id: "tpl-10",
    slug: "vintage-parchment-letter",
    name: "Vintage Letter & Wax Seal",
    collection: "Vintage Letter",
    family: "vintage-letter",
    category: "Wedding Cards",
    type: "card",
    badge: "Trending",
    style: "Old paper, handwritten calligraphy & red wax seal",
    themeColor: "#8C6D53",
    fontStyle: "Cinzel",
    pages: [{ title: "Vintage Letter", description: "Solemn Vows" }],
  },
  {
    id: "tpl-11",
    slug: "royal-decree-scroll",
    name: "Royal Proclamation Scroll",
    collection: "Royal Scroll",
    family: "royal-scroll",
    category: "Wedding Cards",
    type: "multi-page",
    badge: "Premium",
    style: "Ancient unrolled scroll with wooden handles",
    themeColor: "#8B4513",
    fontStyle: "Cinzel",
    pages: [{ title: "Royal Decree", description: "Proclamation of Marriage" }],
  },
  {
    id: "tpl-12",
    slug: "republic-wedding-passport",
    name: "Passport To Love",
    collection: "Passport Invitation",
    family: "passport-invitation",
    category: "Save the Date",
    type: "card",
    badge: "New",
    style: "Official navy & gold embossed passport cover",
    themeColor: "#F59E0B",
    fontStyle: "Montserrat",
    pages: [{ title: "Wedding Passport", description: "Entry Permit to Love" }],
  },
  {
    id: "tpl-13",
    slug: "airline-boarding-pass",
    name: "Airline Boarding Pass",
    collection: "Boarding Pass Invitation",
    family: "boarding-pass",
    category: "Save the Date",
    type: "card",
    badge: "Trending",
    style: "Flight ticket with barcode & gate details",
    themeColor: "#38BDF8",
    fontStyle: "Montserrat",
    pages: [{ title: "Boarding Pass", description: "Flight LOVE-2026" }],
  },
  {
    id: "tpl-14",
    slug: "vintage-newspaper-chronicle",
    name: "The Wedding Chronicle Newspaper",
    collection: "Newspaper Announcement",
    family: "newspaper-announcement",
    category: "Save the Date",
    type: "card",
    badge: "Free",
    style: "Vintage 1920s newspaper front-page headline",
    themeColor: "#78716C",
    fontStyle: "Playfair Display",
    pages: [{ title: "Newspaper Headline", description: "Couple To Wed!" }],
  },
  {
    id: "tpl-15",
    slug: "vogue-luxury-magazine-cover",
    name: "Harper Luxury Magazine",
    collection: "Magazine Cover",
    family: "magazine-cover",
    category: "Wedding Cards",
    type: "multi-page",
    badge: "Premium",
    style: "Glossy luxury wedding magazine cover",
    themeColor: "#D4AF37",
    fontStyle: "Playfair Display",
    pages: [{ title: "Magazine Issue", description: "Harper Wedding Feature" }],
  },
  {
    id: "tpl-16",
    slug: "craft-paper-scrapbook",
    name: "Handmade Scrapbook & Tapes",
    collection: "Scrapbook",
    family: "scrapbook",
    category: "Save the Date",
    type: "card",
    badge: "Free",
    style: "Handmade paper, polaroid tapes & stickers",
    themeColor: "#B45309",
    fontStyle: "Great Vibes",
    pages: [{ title: "Scrapbook Memories", description: "Taped Polaroids" }],
  },
  {
    id: "tpl-17",
    slug: "museum-photo-album-frame",
    name: "Museum Photo Album Frame",
    collection: "Photo Album",
    family: "photo-album",
    category: "Wedding Cards",
    type: "card",
    badge: "Trending",
    style: "Large framed photo matting & clean caption",
    themeColor: "#71717A",
    fontStyle: "Playfair Display",
    pages: [{ title: "Photo Album", description: "Framed Couple Portrait" }],
  },
  {
    id: "tpl-18",
    slug: "architectural-botanical-minimal",
    name: "Architectural Botanical Minimal",
    collection: "Botanical Minimal",
    family: "botanical-minimal",
    category: "Save the Date",
    type: "card",
    badge: "New",
    style: "Generous white space & line eucalyptus art",
    themeColor: "#047857",
    fontStyle: "Montserrat",
    pages: [{ title: "Botanical Lines", description: "Minimal White Space" }],
  },
  {
    id: "tpl-19",
    slug: "black-velvet-24k-gold",
    name: "Black Velvet 24k Gold Foil",
    collection: "Luxury Black & Gold",
    family: "luxury-black-gold",
    category: "Wedding Cards",
    type: "multi-page",
    badge: "Premium",
    style: "Obsidian black marble & metallic 24k gold foil",
    themeColor: "#D4AF37",
    fontStyle: "Cinzel",
    pages: [{ title: "Black & Gold Gala", description: "Opulent Dinner Banquet" }],
  },
  {
    id: "tpl-20",
    slug: "celestial-galaxy-constellations",
    name: "Celestial Moon & Constellations",
    collection: "Celestial",
    family: "celestial",
    category: "Save the Date",
    type: "card",
    badge: "Trending",
    style: "Midnight indigo sky, moon phase & stars",
    themeColor: "#818CF8",
    fontStyle: "Cinzel",
    pages: [{ title: "Written In The Stars", description: "Starlight Vows" }],
  },
  {
    id: "tpl-21",
    slug: "sacred-radial-mandala",
    name: "Sacred Radial Mandala",
    collection: "Mandala",
    family: "mandala",
    category: "Wedding Cards",
    type: "multi-page",
    badge: "Trending",
    style: "Large sacred radial mandala artwork hero",
    themeColor: "#F43F5E",
    fontStyle: "Playfair Display",
    pages: [{ title: "Mandala Shubh Vivah", description: "Sacred Radial Union" }],
  },
  {
    id: "tpl-22",
    slug: "royal-peacock-feather-splendour",
    name: "Peacock Feather Splendour",
    collection: "Peacock Theme",
    family: "peacock-theme",
    category: "Wedding Cards",
    type: "multi-page",
    badge: "Premium",
    style: "Full-height vertical peacock feather panel",
    themeColor: "#0D9488",
    fontStyle: "Playfair Display",
    pages: [{ title: "Peacock Splendour", description: "Teal Cyan Feathers" }],
  },
  {
    id: "tpl-23",
    slug: "sacred-blooming-lotus",
    name: "Sacred Blooming Lotus",
    collection: "Lotus Theme",
    family: "lotus-theme",
    category: "Wedding Cards",
    type: "card",
    badge: "Free",
    style: "Sacred pink lotus flowers & water pond art",
    themeColor: "#F472B6",
    fontStyle: "Great Vibes",
    pages: [{ title: "Pink Lotus Union", description: "Sacred Water Blooms" }],
  },
  {
    id: "tpl-24",
    slug: "1920s-gatsby-art-deco",
    name: "1920s Gatsby Art Deco",
    collection: "Art Deco",
    family: "art-deco",
    category: "Reception",
    type: "card",
    badge: "Trending",
    style: "1920s Gatsby metallic gold geometric lattice",
    themeColor: "#EAB308",
    fontStyle: "Cinzel",
    pages: [{ title: "Art Deco Gala", description: "1920s Gatsby Glamour" }],
  },
  {
    id: "tpl-25",
    slug: "terracotta-contemporary-abstract",
    name: "Terracotta Contemporary Abstract",
    collection: "Contemporary Abstract",
    family: "contemporary-abstract",
    category: "Save the Date",
    type: "card",
    badge: "New",
    style: "Modern terracota abstract geometric shapes",
    themeColor: "#F97316",
    fontStyle: "Montserrat",
    pages: [{ title: "Contemporary Abstract", description: "Modern Arch Geometry" }],
  },
];

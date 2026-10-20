export interface VendorCreditItem {
  vendor_id: string;
  role: string;
  business_name?: string;
  slug?: string;
  category?: string;
}

export interface GalleryPhotoItem {
  url: string;
  caption?: string;
  category?: string;
}

export interface RealWeddingStoryDb {
  id: string;
  slug: string;
  title: string;
  couple_names: string | null;
  city: string | null;
  wedding_date: string | null;
  style: string;
  cover_image_url: string;
  gallery: GalleryPhotoItem[];
  story_text: string;
  short_story: string | null;
  vendor_credits: VendorCreditItem[];
  status: "pending_review" | "published" | "rejected";
  rejection_reason?: string | null;
  submitted_by?: string | null;
  submitter_name?: string | null;
  submitter_email?: string | null;
  submitted_at: string;
  view_count: number;
  like_count: number;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
}

export interface StorySubmissionPayload {
  title: string;
  couple_names?: string;
  city?: string;
  wedding_date?: string;
  style?: string;
  cover_image_url: string;
  gallery?: (string | GalleryPhotoItem)[];
  story_text: string;
  short_story?: string;
  vendor_credits?: VendorCreditItem[];
  submitted_by?: string;
  submitter_name?: string;
  submitter_email?: string;
}

export const KERALA_REAL_WEDDING_STORIES: RealWeddingStoryDb[] = [
  {
    id: "story-kerala-1",
    slug: "meera-arjun-royal-backwater-kumarakom",
    title: "Meera & Arjun's Serene Backwater Sanctuary Wedding in Kumarakom",
    couple_names: "Meera & Arjun",
    city: "Kumarakom, Kottayam",
    wedding_date: "January 18, 2026",
    style: "Traditional Kerala",
    cover_image_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
    short_story: "A majestic backwater wedding amidst lotus-filled waters in Kumarakom featuring gold zari Kasavu sarees, royal thali ceremony, and a grand 28-dish Sadhya.",
    story_text: "Set along the tranquil backwaters of Vembanad Lake in Kumarakom, Meera and Arjun celebrated their traditional Kerala wedding with timeless heritage elegance. Meera stunned in a handwoven Kanchipuram Kasavu silk saree complemented by temple jewellery from Malabar Gold. Arjun arrived in an ivory silk shirt and traditional kasavu mundu. The mandap was built over water adorned with fresh marigolds and lotus blossoms.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop", caption: "Meera & Arjun Backwater Mandap" },
      { url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop", caption: "Royal Entrance & Floral Mandap" },
      { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop", caption: "Traditional Sadya Feast" },
      { url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop", caption: "Sunset Lake Portrait" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-1", role: "Photographer", business_name: "Light & Magic Weddings", slug: "light-magic-weddings", category: "Photographers" },
      { vendor_id: "v-venue-1", role: "Venue", business_name: "Kumarakom Lake Resort", slug: "kumarakom-lake-resort", category: "Venues" },
      { vendor_id: "v-bridal-1", role: "Bridal Wear", business_name: "Seematti Silks", slug: "seematti-silks", category: "Bridal Wear" },
      { vendor_id: "v-makeup-1", role: "Makeup Artist", business_name: "Makeover by Renju Renjimar", slug: "renju-renjimar-makeup", category: "Makeup Artists" },
      { vendor_id: "v-cater-1", role: "Catering", business_name: "Vinayaka Catering Kochi", slug: "vinayaka-catering", category: "Catering" }
    ],
    status: "published",
    submitted_at: "2026-01-20T10:00:00Z",
    view_count: 1420,
    like_count: 384,
    is_featured: true,
    is_trending: true,
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-01-20T10:00:00Z"
  },
  {
    id: "story-kerala-2",
    slug: "anjali-siddharth-bolgatty-palace-kochi",
    title: "Anjali & Siddharth's Grand Colonial Palace Celebration in Kochi",
    couple_names: "Anjali & Siddharth",
    city: "Bolgatty Island, Kochi",
    wedding_date: "November 24, 2025",
    style: "Royal & Heritage",
    cover_image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    short_story: "A fairy-tale island wedding at Kochi's historic Bolgatty Palace blending royal Dutch-colonial heritage with modern botanical elegance.",
    story_text: "Nestled on Bolgatty Island in Kochi, Anjali and Siddharth's royal heritage wedding brought together 800 guests under a canopy of fairy lights, white orchids, and brass lamps. The dusk ceremony overlooked the Kochi harbor as sunset painted the sky in shades of gold and violet.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop", caption: "Bolgatty Palace Lawns Decor" },
      { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop", caption: "Night Illumination & Couple Vows" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-2", role: "Photographer", business_name: "Weva Photography", slug: "weva-photography", category: "Photographers" },
      { vendor_id: "v-venue-2", role: "Venue", business_name: "Bolgatty Palace Resort", slug: "bolgatty-palace-resort", category: "Venues" },
      { vendor_id: "v-decor-2", role: "Decorator", business_name: "Melodia Events Kochi", slug: "melodia-events", category: "Decorators" }
    ],
    status: "published",
    submitted_at: "2025-11-26T10:00:00Z",
    view_count: 980,
    like_count: 245,
    is_featured: true,
    is_trending: false,
    created_at: "2025-11-26T10:00:00Z",
    updated_at: "2025-11-26T10:00:00Z"
  },
  {
    id: "story-kerala-3",
    slug: "diya-aarav-cliffside-varkala",
    title: "Dr. Diya & Dr. Aarav's Cliffside Ocean Sunset Wedding in Varkala",
    couple_names: "Dr. Diya & Dr. Aarav",
    city: "Varkala, Trivandrum",
    wedding_date: "December 12, 2025",
    style: "Beach & Waterfront",
    cover_image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
    short_story: "A breathless sunset beach wedding on the Arabian Sea cliffs in Varkala with pastel floral arches and seaside live acoustic music.",
    story_text: "Overlooking the crimson cliffs of Varkala Beach, Diya and Aarav exchanged vows as the sun dipped into the Arabian Sea. Guests were treated to fresh coconut water, coastal fusion cuisine, and an evening lit by glowing lanterns.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop", caption: "Cliffside Sunset Vows" },
      { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop", caption: "Seaside Arch Details" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-3", role: "Photographer", business_name: "Candid Frames Kerala", slug: "candid-frames-kerala", category: "Photographers" },
      { vendor_id: "v-venue-3", role: "Venue", business_name: "Taj Gateway Varkala", slug: "taj-gateway-varkala", category: "Venues" }
    ],
    status: "published",
    submitted_at: "2025-12-14T10:00:00Z",
    view_count: 1150,
    like_count: 310,
    is_featured: false,
    is_trending: true,
    created_at: "2025-12-14T10:00:00Z",
    updated_at: "2025-12-14T10:00:00Z"
  },
  {
    id: "story-kerala-4",
    slug: "aleena-aswin-st-marys-cathedral-calicut",
    title: "Aleena & Aswin's Cathedral Ceremony & Riverside Gala in Kozhikode",
    couple_names: "Aleena & Aswin",
    city: "Kozhikode (Calicut)",
    wedding_date: "February 14, 2026",
    style: "Destination Wedding",
    cover_image_url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
    short_story: "An elegant Christian wedding with cathedral vows followed by a grand riverside reception along the Chaliyar River at The Raviz Kadavu.",
    story_text: "Celebrating their love in Kozhikode, Aleena and Aswin began their special day with a traditional Cathedral service. Aleena wore a custom champagne veil gown designed by Kalyanan Silks, followed by a lavish reception along the Chaliyar River.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop", caption: "Cathedral Vows" },
      { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop", caption: "Chaliyar River Banquet" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-4", role: "Photographer", business_name: "Calicut Wedding Stories", slug: "calicut-wedding-stories", category: "Photographers" },
      { vendor_id: "v-venue-4", role: "Venue", business_name: "The Raviz Kadavu", slug: "raviz-kadavu-calicut", category: "Venues" }
    ],
    status: "published",
    submitted_at: "2026-02-16T10:00:00Z",
    view_count: 870,
    like_count: 205,
    is_featured: false,
    is_trending: false,
    created_at: "2026-02-16T10:00:00Z",
    updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "story-kerala-5",
    slug: "pooja-nikhil-heritage-mansion-thrissur",
    title: "Pooja & Nikhil's Cultural Marigold Celebration in Thrissur",
    couple_names: "Pooja & Nikhil",
    city: "Thrissur",
    wedding_date: "March 03, 2026",
    style: "Traditional Kerala",
    cover_image_url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
    short_story: "A vibrant Kerala wedding celebrating Thrissur's rich cultural artforms with Chenda Melam, Kathakali artists, and traditional floral decor.",
    story_text: "Deeply rooted in Kerala's cultural heartland of Thrissur, Pooja and Nikhil's celebration began with an energetic Panchavadyam procession and grand brass lamp illumination inside Hyatt Regency Thrissur.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop", caption: "Chenda Melam Procession" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-5", role: "Photographer", business_name: "Thrissur Wedding Reels", slug: "thrissur-wedding-reels", category: "Photographers" },
      { vendor_id: "v-venue-5", role: "Venue", business_name: "Hyatt Regency Thrissur", slug: "hyatt-regency-thrissur", category: "Venues" }
    ],
    status: "published",
    submitted_at: "2026-03-05T10:00:00Z",
    view_count: 760,
    like_count: 180,
    is_featured: false,
    is_trending: false,
    created_at: "2026-03-05T10:00:00Z",
    updated_at: "2026-03-05T10:00:00Z"
  },
  {
    id: "story-kerala-6",
    slug: "nikhita-varun-munnar-hills-destination",
    title: "Nikhita & Varun's Misty Tea Estate Wedding in Munnar",
    couple_names: "Nikhita & Varun",
    city: "Munnar, Idukki",
    wedding_date: "April 05, 2026",
    style: "Minimalist",
    cover_image_url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop",
    short_story: "An intimate eco-luxury wedding amongst the misty tea gardens of Munnar with white linen drapes and acoustic music.",
    story_text: "Tucked away in the misty hills of Munnar, Nikhita and Varun chose an intimate destination wedding with 100 close friends and family surrounded by tea estates and rolling green mountains.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop", caption: "Munnar Tea Estate Backdrop" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-6", role: "Photographer", business_name: "Munnar Lens Stories", slug: "munnar-lens-stories", category: "Photographers" },
      { vendor_id: "v-venue-6", role: "Venue", business_name: "Windermere Estate Munnar", slug: "windermere-estate-munnar", category: "Venues" }
    ],
    status: "published",
    submitted_at: "2026-04-07T10:00:00Z",
    view_count: 940,
    like_count: 220,
    is_featured: false,
    is_trending: true,
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-07T10:00:00Z"
  }
];

export function generateStorySlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${base || "wedding"}-${randomSuffix}`;
}

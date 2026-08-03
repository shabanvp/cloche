export type VendorCredit = {
  category: string;
  name: string;
  link: string;
};

export type GalleryPhoto = {
  url: string;
  category: "Ceremony" | "Reception" | "Bridal Entry" | "Couple Portraits" | "Decor" | "Food" | "Family" | "Dance";
  caption: string;
};

export type RealWeddingStory = {
  slug: string;
  title: string;
  brideGroom: string;
  location: string;
  city: string;
  date: string;
  style: "Royal" | "Destination" | "Beach" | "Traditional Kerala" | "Minimal" | "Luxury" | "Garden";
  heroImage: string;
  coverImages: string[];
  shortStory: string;
  fullStory: string;
  likes: string;
  views: string;
  featured: boolean;
  trending: boolean;
  latest: boolean;
  photographerName: string;
  photographerLink: string;
  vendorCredits: VendorCredit[];
  gallery: GalleryPhoto[];
  videoThumbnail: string;
  videoReelUrl: string;
};

export const REAL_WEDDINGS_DATA: RealWeddingStory[] = [
  {
    slug: "ananya-rohan-udaipur",
    title: "A Royal Lakefront Palace Celebration in Udaipur",
    brideGroom: "Ananya & Rohan",
    location: "Sapphire Palace Resort, Udaipur",
    city: "Udaipur",
    date: "February 2026",
    style: "Royal",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    coverImages: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80",
    ],
    shortStory: "Surrounded by Lake Pichola's glowing golden waters, Ananya and Rohan tied the knot in a 3-day royal palace extravaganza featuring hand-embroidered Zardozi couture and floral mandaps.",
    fullStory: "Ananya and Rohan's royal Udaipur wedding was a majestic fusion of heritage grandeur and contemporary elegance. Held over three magical days at Sapphire Palace Resort, the celebrations commenced with a sunset lakeside Mehendi, followed by a regal Sangeet in the courtyard illuminated by 2,00,0 diyas.",
    likes: "2.4K",
    views: "18.5K",
    featured: true,
    trending: true,
    latest: true,
    photographerName: "Memory Lanes Photography",
    photographerLink: "/boutiques/v-30",
    vendorCredits: [
      { category: "Venue", name: "Sapphire Palace Resort Udaipur", link: "/boutiques/v-solitaire" },
      { category: "Photographer", name: "Memory Lanes Photography", link: "/boutiques/v-30" },
      { category: "Bridal Wear", name: "Aurelia Brides Couture", link: "/boutiques/v-22" },
      { category: "Makeup Artist", name: "Subhashini Makeup Studio", link: "/makeup" },
      { category: "Decor & Planning", name: "Royal Floral Decors", link: "/categories/decor-planning" },
      { category: "Jewellery", name: "Kalyan Heritage Jewellery", link: "/categories/jewellery" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", category: "Ceremony", caption: "Sunset Pheras at Lake Pichola" },
      { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", category: "Bridal Entry", caption: "Ananya's royal bridal entrance under floral phoolon ki chhadar" },
      { url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80", category: "Couple Portraits", caption: "Royal portrait in palace corridors" },
      { url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", category: "Decor", caption: "Lotus floating stage decor" },
    ],
    videoThumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    videoReelUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    slug: "kavya-kabir-kochi",
    title: "Waterfront Backwater Serenade in Bolgatty Island",
    brideGroom: "Kavya & Kabir",
    location: "Grand Solitaire Island Resort",
    city: "Kochi",
    date: "January 2026",
    style: "Traditional Kerala",
    heroImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1600&q=80",
    coverImages: [
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    ],
    shortStory: "A breathtaking traditional Kanjivaram silk wedding amidst coconut groves and backwater vistas in Bolgatty, Kochi.",
    fullStory: "Kavya and Kabir celebrated their union with an authentic Kerala traditional Muhurtham ceremony followed by a grand waterfront lawn reception at Grand Solitaire Island Resort.",
    likes: "1.9K",
    views: "14.2K",
    featured: true,
    trending: true,
    latest: false,
    photographerName: "Magic Motion Media",
    photographerLink: "/boutiques/v-30",
    vendorCredits: [
      { category: "Venue", name: "Grand Solitaire Island Resort", link: "/boutiques/v-solitaire" },
      { category: "Photographer", name: "Magic Motion Media", link: "/boutiques/v-30" },
      { category: "Bridal Wear", name: "Seematti Kanchipuram Silks", link: "/categories/bridal-wear" },
      { category: "Catering", name: "Kerala Sadhya Feasts", link: "/catering" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80", category: "Ceremony", caption: "Traditional Kerala Muhurtham Pheras" },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", category: "Reception", caption: "Waterfront lawn reception stage" },
    ],
    videoThumbnail: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
    videoReelUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    slug: "priya-sid-goa",
    title: "Sunset Beachfront Wedding Rituals in South Goa",
    brideGroom: "Priya & Sid",
    location: "Azure Shore Resort, Goa",
    city: "Goa",
    date: "December 2025",
    style: "Beach",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80",
    coverImages: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    ],
    shortStory: "Pastel mandaps, golden sunset pheras, and barefoot beach afterparty vibes overlooking the Arabian sea.",
    fullStory: "Priya and Sid brought their dream destination wedding to life along the golden sands of Benaulim Beach in South Goa.",
    likes: "1.5K",
    views: "11.8K",
    featured: false,
    trending: true,
    latest: true,
    photographerName: "Stories by Joseph Radhik",
    photographerLink: "/photographers",
    vendorCredits: [
      { category: "Venue", name: "Azure Shore Resort Goa", link: "/venues" },
      { category: "Photographer", name: "Stories by Joseph Radhik", link: "/photographers" },
    ],
    gallery: [
      { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", category: "Couple Portraits", caption: "Sunset beach portrait" },
    ],
    videoThumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    videoReelUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

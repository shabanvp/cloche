export type VenueCmsData = {
  id: string;
  vendorId: string;
  category: "Wedding Venue";
  lastUpdated: string;
  status: "Draft" | "Published";

  // 1. Business Profile
  businessProfile: {
    businessName: string;
    tagline: string;
    description: string;
    city: string;
    district: string;
    address: string;
    contactNumber: string;
    whatsapp: string;
    email: string;
    website: string;
    instagram: string;
    isVerified: boolean;
  };

  // 2. Hero Gallery
  heroGallery: {
    coverImage: string;
    images: { id: string; url: string; caption?: string }[];
  };

  // 3. Venue Information
  venueInfo: {
    startingPrice: string;
    minGuests: number;
    maxGuests: number;
    venueType: "Indoor" | "Outdoor" | "Indoor + Outdoor";
    roomsCount: number;
    parkingCapacity: string;
    bridalSuiteAvailable: boolean;
    powerBackupAvailable: boolean;
    inhouseDecoration: "Compulsory" | "Allowed" | "Not Allowed";
    musicPolicy: "DJ Allowed till 10 PM" | "Live Band & DJ Allowed" | "Strict Acoustic Only";
    foodPolicy: "In-house Catering Only" | "External Catering Allowed" | "Both Allowed";
    alcoholPolicy: "Allowed with Permit" | "In-house Bar Only" | "Not Allowed";
  };

  // 4. Amenities
  amenities: {
    parking: boolean;
    valet: boolean;
    wifi: boolean;
    generator: boolean;
    kidsArea: boolean;
    garden: boolean;
    swimmingPool: boolean;
    stage: boolean;
    decoration: boolean;
    wheelchairAccess: boolean;
  };

  // 5. Packages
  packages: {
    id: string;
    name: string;
    price: string;
    description: string;
    includedServices: string[];
    isPopular?: boolean;
    isFeatured?: boolean;
  }[];

  // 6. Availability & Calendar
  availability: {
    blockedDates: string[];
    specialOffers?: string;
  };

  // 7. Gallery & Media
  gallery: {
    photos: string[];
    videos: string[];
    panoramas360: string[];
  };

  // 8. Reviews Management
  reviewsList: {
    id: string;
    author: string;
    rating: number;
    text: string;
    date: string;
    replyText?: string;
    isPinned?: boolean;
  }[];

  // 9. FAQ
  faqs: { id: string; question: string; answer: string }[];

  // 10. SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
  };
};

export type CmsVersionSnapshot = {
  versionId: string;
  timestamp: string;
  data: VenueCmsData;
};

// ----------------------------------------------------
// DEFAULT INITIAL VENUE CMS DATA
// ----------------------------------------------------

export const DEFAULT_VENUE_CMS: VenueCmsData = {
  id: "venue-cms-hyatt",
  vendorId: "v-hyatt",
  category: "Wedding Venue",
  lastUpdated: new Date().toISOString(),
  status: "Published",
  businessProfile: {
    businessName: "Grand Hyatt Kochi Bolgatty",
    tagline: "Luxury Waterfront Island Wedding Destination",
    description: "Situated on the serene Bolgatty Island, Grand Hyatt Kochi offers 100,000 sq.ft of luxurious indoor & outdoor wedding spaces with backwater views.",
    city: "Kochi",
    district: "Ernakulam",
    address: "Bolgatty Island, Kochi, Kerala 682050",
    contactNumber: "+91 484 266 1234",
    whatsapp: "+91 98950 11223",
    email: "events.kochi@hyatt.com",
    website: "https://hyatt.com",
    instagram: "@grandhyattkochi",
    isVerified: true,
  },
  heroGallery: {
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80",
    images: [
      { id: "h1", url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80", caption: "Waterfront Lawn Setup" },
      { id: "h2", url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", caption: "Pillarless Ballroom" },
      { id: "h3", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80", caption: "Resort Entrance" },
    ],
  },
  venueInfo: {
    startingPrice: "₹2,50,000 / day",
    minGuests: 250,
    maxGuests: 3000,
    venueType: "Indoor + Outdoor",
    roomsCount: 264,
    parkingCapacity: "500+ Luxury Cars",
    bridalSuiteAvailable: true,
    powerBackupAvailable: true,
    inhouseDecoration: "Allowed",
    musicPolicy: "DJ Allowed till 10 PM",
    foodPolicy: "In-house Catering Only",
    alcoholPolicy: "Allowed with Permit",
  },
  amenities: {
    parking: true,
    valet: true,
    wifi: true,
    generator: true,
    kidsArea: true,
    garden: true,
    swimmingPool: true,
    stage: true,
    decoration: true,
    wheelchairAccess: true,
  },
  packages: [
    {
      id: "pkg-1",
      name: "Royal Waterfront Lawn Sponsorship",
      price: "₹4,50,000 / day",
      description: "Full outdoor lawn rental with backwater stage setup.",
      includedServices: ["Up to 1500 Guests", "Valet Parking", "Heliport Access", "Bridal Suite"],
      isPopular: true,
      isFeatured: true,
    },
    {
      id: "pkg-2",
      name: "Grand Ballroom Banquet Package",
      price: "₹2,80,000 / day",
      description: "Pillarless air-conditioned ballroom with acoustic lighting.",
      includedServices: ["Up to 800 Guests", "Bridal Suite Included", "Stage Setup"],
      isPopular: false,
    },
  ],
  availability: {
    blockedDates: ["2026-08-15", "2026-10-24", "2026-11-12"],
    specialOffers: "20% discount on weekday monsoon wedding bookings in August!",
  },
  gallery: {
    photos: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    ],
    videos: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    panoramas360: [],
  },
  reviewsList: [
    {
      id: "rev-1",
      author: "Rahul & Ananya",
      rating: 5,
      date: "3 weeks ago",
      text: "The backwater lawn view for our reception was magical! World class hospitality by Hyatt team.",
      replyText: "Thank you Rahul & Ananya! It was an honor hosting your royal wedding.",
      isPinned: true,
    },
  ],
  faqs: [
    { id: "faq-1", question: "What is the advance booking deposit percentage?", answer: "We require a 25% deposit at the time of contract signing to secure your date." },
    { id: "faq-2", question: "Do you allow outside decorators?", answer: "Yes, empanelled luxury decor partners are permitted." },
  ],
  seo: {
    metaTitle: "Grand Hyatt Kochi Bolgatty | Luxury Wedding Venue Kerala",
    metaDescription: "Host your dream waterfront wedding at Grand Hyatt Kochi Bolgatty. 100,000 sq.ft venue with backwater views.",
    keywords: "Kochi wedding venue, luxury resort wedding, Hyatt Bolgatty wedding",
    ogImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
  },
};

// ----------------------------------------------------
// STORAGE HELPERS & VERSION CONTROL
// ----------------------------------------------------

const VENUE_CMS_KEY = "cloche_venue_cms_data_v1";
const VENUE_VERSIONS_KEY = "cloche_venue_cms_versions_v1";

export function getVenueCmsData(vendorId: string): VenueCmsData {
  if (typeof window === "undefined") return DEFAULT_VENUE_CMS;
  try {
    const raw = localStorage.getItem(VENUE_CMS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(VENUE_CMS_KEY, JSON.stringify(DEFAULT_VENUE_CMS));
    return DEFAULT_VENUE_CMS;
  } catch (e) {
    return DEFAULT_VENUE_CMS;
  }
}

export function saveVenueCmsData(data: VenueCmsData, status: "Draft" | "Published" = "Draft"): void {
  if (typeof window === "undefined") return;
  try {
    const updated = { ...data, status, lastUpdated: new Date().toISOString() };
    localStorage.setItem(VENUE_CMS_KEY, JSON.stringify(updated));

    // Save snapshot in version history if published
    if (status === "Published") {
      const history = getVenueVersionHistory();
      const snapshot: CmsVersionSnapshot = {
        versionId: `v-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        data: updated,
      };
      localStorage.setItem(VENUE_VERSIONS_KEY, JSON.stringify([snapshot, ...history.slice(0, 9)]));
    }
  } catch (e) {}
}

export function getVenueVersionHistory(): CmsVersionSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VENUE_VERSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function restoreVenueVersion(snapshot: CmsVersionSnapshot): VenueCmsData {
  saveVenueCmsData(snapshot.data, "Published");
  return snapshot.data;
}

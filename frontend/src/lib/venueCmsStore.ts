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
  id: "venue-cms-solitaire",
  vendorId: "v-solitaire",
  category: "Wedding Venue",
  lastUpdated: new Date().toISOString(),
  status: "Published",
  businessProfile: {
    businessName: "Grand Solitaire Island Resort",
    tagline: "Luxury Waterfront Island Wedding Destination",
    description: "Situated on the serene Bolgatty Island, Grand Solitaire Island Resort offers 100,000 sq.ft of luxurious indoor & outdoor wedding spaces with backwater views.",
    city: "Kochi",
    district: "Ernakulam",
    address: "Bolgatty Island, Kochi, Kerala 682050",
    contactNumber: "+91 484 266 1234",
    whatsapp: "+91 98950 11223",
    email: "events.kochi@solitaire.com",
    website: "https://solitaire.com",
    instagram: "@grandsolitaire",
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

export function transformRegisteredToCmsData(reg: any): VenueCmsData {
  const targetId = reg.id || reg.slug || "venue-cms-custom";
  const cover = reg.image || reg.coverImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80";
  const galleryPhotos = Array.isArray(reg.images) && reg.images.length > 0
    ? reg.images
    : [cover, "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80"];

  return {
    id: targetId,
    vendorId: reg.vendorId || targetId,
    category: "Wedding Venue",
    status: "Published",
    lastUpdated: new Date().toISOString(),
    businessProfile: {
      businessName: reg.name || reg.boutique_name || reg.businessName || "Wedding Venue",
      tagline: reg.tagline || "Premier Wedding & Event Venue",
      description: reg.description || "A magnificent wedding destination equipped with modern amenities and world-class hospitality.",
      city: reg.city || "Kochi",
      district: reg.district || reg.state || "Ernakulam",
      address: reg.address || `${reg.city || "Kochi"}, Kerala`,
      contactNumber: reg.contactNumber || reg.phone || "+919876543210",
      whatsapp: reg.whatsapp || reg.phone || "+919876543210",
      email: reg.email || "contact@weddingvenue.com",
      website: reg.website || "https://cloche.com",
      instagram: reg.instagram || "@cloche_venues",
      isVerified: true,
    },
    heroGallery: {
      coverImage: cover,
      images: galleryPhotos.map((url: string, idx: number) => ({ id: `h-${idx}`, url, caption: `Gallery Photo ${idx + 1}` })),
    },
    venueInfo: {
      venueType: "Indoor + Outdoor",
      minGuests: 250,
      maxGuests: 2000,
      roomsCount: 25,
      startingPrice: reg.startingPrice || "₹50,000 / day",
      bridalSuiteAvailable: true,
      powerBackupAvailable: true,
      parkingCapacity: "300 vehicles",
      inhouseDecoration: "Allowed",
      musicPolicy: "Live Band & DJ Allowed",
      foodPolicy: "Both Allowed",
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
    gallery: {
      photos: galleryPhotos,
      videos: [],
      panoramas360: [],
    },
    packages: Array.isArray(reg.packages) && reg.packages.length > 0
      ? reg.packages
      : [
          { id: "p1", name: "Silver Wedding Package", price: reg.startingPrice || "₹50,000 / day", description: "Includes main hall, basic seating, and bridal room access.", isPopular: false },
          { id: "p2", name: "Royal Gold Package", price: "₹1,50,000 / day", description: "Full resort access, lawn, in-house sound, lighting, and valet.", isPopular: true },
        ],
    availability: {
      blockedDates: [],
      specialOffers: "Early Bird Discount",
    },
    reviewsList: reg.reviewsList || [
      { id: "r1", author: "Verified Couple", rating: 5, date: "Recent", text: `Hosting our wedding at ${reg.name || "this venue"} was an extraordinary experience!` },
    ],
    faqs: [
      { id: "f1", question: "What is the advance booking amount?", answer: "We require 25% at the time of booking confirmation." },
      { id: "f2", question: "Are outside catering teams allowed?", answer: "Yes, both in-house and empanelled outside caterers are welcome." },
    ],
    seo: {
      metaTitle: `${reg.name || "Wedding Venue"} | Cloche`,
      metaDescription: `Book ${reg.name || "Wedding Venue"} for your dream wedding.`,
      keywords: `${reg.name}, wedding venue, Kerala weddings`,
      ogImage: cover,
    },
  };
}

export function getVenueCmsData(venueId?: string): VenueCmsData {
  if (typeof window === "undefined") return DEFAULT_VENUE_CMS;
  try {
    if (venueId) {
      const specificRaw = localStorage.getItem(`cloche_venue_cms_${venueId}`);
      if (specificRaw) return JSON.parse(specificRaw);
    }
    const raw = localStorage.getItem(VENUE_CMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!venueId || parsed.id === venueId || parsed.vendorId === venueId) {
        return parsed;
      }
    }
    // Check registered venues in localStorage
    const regRaw = localStorage.getItem("cloche_registered_venues");
    if (regRaw) {
      const regList = JSON.parse(regRaw);
      if (Array.isArray(regList) && regList.length > 0) {
        const match = venueId
          ? regList.find((v: any) => v.id === venueId || v.vendorId === venueId || v.slug === venueId)
          : regList[0];
        if (match) {
          return transformRegisteredToCmsData(match);
        }
      }
    }

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

    if (data.id) {
      localStorage.setItem(`cloche_venue_cms_${data.id}`, JSON.stringify(updated));
    }
    if (data.vendorId && data.vendorId !== data.id) {
      localStorage.setItem(`cloche_venue_cms_${data.vendorId}`, JSON.stringify(updated));
    }

    // Also update registered venues cache list
    const venueDetailPayload = convertCmsToVenueDetail(updated);
    const existingRaw = localStorage.getItem("cloche_registered_venues");
    let existingList: any[] = existingRaw ? JSON.parse(existingRaw) : [];
    if (!Array.isArray(existingList)) existingList = [];
    const existingIndex = existingList.findIndex((v) => v.id === data.id || v.id === data.vendorId);
    if (existingIndex >= 0) {
      existingList[existingIndex] = { ...existingList[existingIndex], ...venueDetailPayload };
    } else {
      existingList.unshift(venueDetailPayload);
    }
    localStorage.setItem("cloche_registered_venues", JSON.stringify(existingList));

    // Save snapshot in version history if published
    if (status === "Published") {
      const history = getVenueVersionHistory(data.id);
      const snapshot: CmsVersionSnapshot = {
        versionId: `v-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        data: updated,
      };
      const versionKey = data.id ? `cloche_venue_cms_versions_${data.id}` : VENUE_VERSIONS_KEY;
      localStorage.setItem(versionKey, JSON.stringify([snapshot, ...history.slice(0, 9)]));
    }
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

export function transformRegisteredToCmsData(reg: any): VenueCmsData {
  const targetId = reg.id || reg.slug || "venue-cms-custom";
  const cover = reg.image || reg.coverImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80";
  const galleryPhotos = Array.isArray(reg.images) && reg.images.length > 0
    ? reg.images
    : [cover, "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80"];

  return {
    id: targetId,
    vendorId: reg.vendorId || targetId,
    category: "Wedding Venue",
    status: "Published",
    lastUpdated: new Date().toISOString(),
    businessProfile: {
      businessName: reg.name || reg.boutique_name || reg.businessName || "Wedding Venue",
      tagline: reg.tagline || "Premier Wedding & Event Venue",
      description: reg.description || "A magnificent wedding destination equipped with modern amenities and world-class hospitality.",
      city: reg.city || "Kochi",
      district: reg.district || reg.state || "Ernakulam",
      address: reg.address || `${reg.city || "Kochi"}, Kerala`,
      contactNumber: reg.contactNumber || reg.phone || "+919876543210",
      whatsapp: reg.whatsapp || reg.phone || "+919876543210",
      email: reg.email || "contact@weddingvenue.com",
      website: reg.website || "https://cloche.com",
      instagram: reg.instagram || "@cloche_venues",
      isVerified: true,
    },
    heroGallery: {
      coverImage: cover,
      images: galleryPhotos.map((url: string, idx: number) => ({ id: `h-${idx}`, url, caption: `Gallery Photo ${idx + 1}` })),
    },
    venueInfo: {
      venueType: "Indoor + Outdoor",
      minGuests: 250,
      maxGuests: 2000,
      roomsCount: 25,
      startingPrice: reg.startingPrice || "₹50,000 / day",
      bridalSuiteAvailable: true,
      powerBackupAvailable: true,
      parkingCapacity: "300 vehicles",
      inhouseDecoration: "Allowed",
      musicPolicy: "Live Band & DJ Allowed",
      foodPolicy: "Both Allowed",
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
    gallery: {
      photos: galleryPhotos,
      videos: [],
      panoramas360: [],
    },
    packages: Array.isArray(reg.packages) && reg.packages.length > 0
      ? reg.packages
      : [
          { id: "p1", name: "Silver Wedding Package", price: reg.startingPrice || "₹50,000 / day", description: "Includes main hall, basic seating, and bridal room access.", isPopular: false },
          { id: "p2", name: "Royal Gold Package", price: "₹1,50,000 / day", description: "Full resort access, lawn, in-house sound, lighting, and valet.", isPopular: true },
        ],
    availability: {
      blockedDates: [],
      specialOffers: "Early Bird Discount",
    },
    reviewsList: reg.reviewsList || [
      { id: "r1", author: "Verified Couple", rating: 5, date: "Recent", text: `Hosting our wedding at ${reg.name || "this venue"} was an extraordinary experience!` },
    ],
    faqs: [
      { id: "f1", question: "What is the advance booking amount?", answer: "We require 25% at the time of booking confirmation." },
      { id: "f2", question: "Are outside catering teams allowed?", answer: "Yes, both in-house and empanelled outside caterers are welcome." },
    ],
    seo: {
      metaTitle: `${reg.name || "Wedding Venue"} | Cloche`,
      metaDescription: `Book ${reg.name || "Wedding Venue"} for your dream wedding.`,
      keywords: `${reg.name}, wedding venue, Kerala weddings`,
      ogImage: cover,
    },
  };
}

export function getVenueCmsData(venueId?: string): VenueCmsData {
  if (typeof window === "undefined") return DEFAULT_VENUE_CMS;
  try {
    if (venueId) {
      const specificRaw = localStorage.getItem(`cloche_venue_cms_${venueId}`);
      if (specificRaw) return JSON.parse(specificRaw);
    }
    const raw = localStorage.getItem(VENUE_CMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!venueId || parsed.id === venueId || parsed.vendorId === venueId) {
        return parsed;
      }
    }
    // Check registered venues in localStorage
    const regRaw = localStorage.getItem("cloche_registered_venues");
    if (regRaw) {
      const regList = JSON.parse(regRaw);
      if (Array.isArray(regList) && regList.length > 0) {
        const match = venueId
          ? regList.find((v: any) => v.id === venueId || v.vendorId === venueId || v.slug === venueId)
          : regList[0];
        if (match) {
          return transformRegisteredToCmsData(match);
        }
      }
    }

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

    if (data.id) {
      localStorage.setItem(`cloche_venue_cms_${data.id}`, JSON.stringify(updated));
    }
    if (data.vendorId && data.vendorId !== data.id) {
      localStorage.setItem(`cloche_venue_cms_${data.vendorId}`, JSON.stringify(updated));
    }

    // Also update registered venues cache list
    const venueDetailPayload = convertCmsToVenueDetail(updated);
    const existingRaw = localStorage.getItem("cloche_registered_venues");
    let existingList: any[] = existingRaw ? JSON.parse(existingRaw) : [];
    if (!Array.isArray(existingList)) existingList = [];
    const existingIndex = existingList.findIndex((v) => v.id === data.id || v.id === data.vendorId);
    if (existingIndex >= 0) {
      existingList[existingIndex] = { ...existingList[existingIndex], ...venueDetailPayload };
    } else {
      existingList.unshift(venueDetailPayload);
    }
    localStorage.setItem("cloche_registered_venues", JSON.stringify(existingList));

    // Save snapshot in version history if published
    if (status === "Published") {
      const history = getVenueVersionHistory(data.id);
      const snapshot: CmsVersionSnapshot = {
        versionId: `v-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        data: updated,
      };
      const versionKey = data.id ? `cloche_venue_cms_versions_${data.id}` : VENUE_VERSIONS_KEY;
      localStorage.setItem(versionKey, JSON.stringify([snapshot, ...history.slice(0, 9)]));
    }

    // Dispatch global events for instant client reactivity across tabs/components
    window.dispatchEvent(new CustomEvent("cloche_cms_update", { detail: updated }));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {}
}

export function getVenueVersionHistory(venueId?: string): CmsVersionSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const versionKey = venueId ? `cloche_venue_cms_versions_${venueId}` : VENUE_VERSIONS_KEY;
    const raw = localStorage.getItem(versionKey);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function restoreVenueVersion(snapshot: CmsVersionSnapshot): VenueCmsData {
  saveVenueCmsData(snapshot.data, "Published");
  return snapshot.data;
}

export function convertCmsToVenueDetail(cms: VenueCmsData): VenueDetail {
  const amenitiesList = [
    { icon: "restaurant", label: "Catering" },
    { icon: "celebration", label: "Decor" },
    { icon: "local_parking", label: "Valet Parking" },
    { icon: "bed", label: "Bridal Suite" },
  ];

  if (cms.amenities?.parking) amenitiesList.push({ icon: "local_parking", label: "Parking" });
  if (cms.amenities?.wifi) amenitiesList.push({ icon: "wifi", label: "Free Wi-Fi" });
  if (cms.amenities?.generator) amenitiesList.push({ icon: "bolt", label: "Power Backup" });
  if (cms.amenities?.garden) amenitiesList.push({ icon: "park", label: "Lawn Garden" });
  if (cms.amenities?.swimmingPool) amenitiesList.push({ icon: "pool", label: "Swimming Pool" });
  if (cms.amenities?.stage) amenitiesList.push({ icon: "living", label: "Stage Setup" });

  const packagesList = (cms.packages || []).map((pkg) => ({
    name: pkg.name,
    price: pkg.price,
    guests: pkg.description || "Package Offer",
    tag: pkg.isPopular ? "Most Loved" : undefined,
  }));

  const primaryReview = cms.reviewsList && cms.reviewsList[0]
    ? {
        couple: cms.reviewsList[0].author,
        date: cms.reviewsList[0].date,
        rating: cms.reviewsList[0].rating,
        text: cms.reviewsList[0].text,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
      }
    : {
        couple: "Verified Guest",
        date: "Recent",
        rating: 5,
        text: "Magnificent venue and great service!",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
      };

  return {
    id: cms.vendorId || cms.id,
    name: cms.businessProfile.businessName,
    location: `${cms.businessProfile.city}, ${cms.businessProfile.district}`,
    city: cms.businessProfile.city,
    rating: 4.9,
    reviews: (cms.reviewsList || []).length || 24,
    image: cms.heroGallery.coverImage,
    images: (cms.heroGallery.images || []).map((i) => i.url),
    totalPhotos: (cms.heroGallery.images || []).length + (cms.gallery?.photos || []).length,
    tags: ["Luxury", "Wedding Venue", cms.venueInfo.venueType],
    capacity: `${cms.venueInfo.minGuests} – ${cms.venueInfo.maxGuests} Guests`,
    spaceType: cms.venueInfo.venueType,
    startingPrice: cms.venueInfo.startingPrice,
    verified: cms.businessProfile.isVerified !== false,
    amenities: amenitiesList,
    packages: packagesList,
    review: primaryReview,
    reviewsList: cms.reviewsList || [],
    faqs: cms.faqs || [],
    similar: [
      { id: "palace-estate", name: "The Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=400&q=80" },
      { id: "sapphire-lake-palace", name: "Sapphire Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=400&q=80" },
      { id: "celestia-grand-palace", name: "Celestia Grand Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
      { id: "moonstone-fort-resort", name: "Moonstone Fort Resort", city: "Sawai Madhopur", rating: 4.9, reviews: 75, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80" },
    ],
  };
}

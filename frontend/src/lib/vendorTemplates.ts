export type CategoryType = 
  | "Wedding Venues"
  | "Wedding Venue"
  | "Photographers"
  | "Bridal Studio"
  | "Groom Studio"
  | "Wedding Studio"
  | "Makeup Artists"
  | "Mehendi Artists"
  | "Decor & Planning"
  | "Jewellery"
  | "Invitation Designers"
  | "Caterers"
  | "Cakes & Desserts"
  | "Entertainment"
  | "Honeymoon";

export type VendorSectionVisibility = {
  heroBanner: boolean;
  gallery: boolean;
  packages: boolean;
  categoryFields: boolean;
  aboutStory: boolean;
  amenitiesOrSpecs: boolean;
  reviews: boolean;
  locationMap: boolean;
  contactCTA: boolean;
  awardsOrFAQ: boolean;
};

export type VendorProfileConfig = {
  id: string;
  vendorId: string;
  category: CategoryType;
  businessName: string;
  tagline: string;
  logo: string;
  coverImage: string;
  aboutText: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  website: string;
  city: string;
  district: string;
  address: string;
  businessHours: string;
  workingHours?: any;
  working_hours?: string;
  mapCoordinates?: string;
  
  // Section Toggles
  visibility: VendorSectionVisibility;

  // Category Specific Data
  venueSpecs?: {
    guestCapacity: string;
    indoorOutdoor: "Indoor Hall" | "Outdoor Lawn" | "Both Indoor & Outdoor";
    roomsCount: number;
    parkingCapacity: string;
    cateringOption: "In-house Catering" | "External Allowed" | "Both";
  };

  photographerSpecs?: {
    photographyStyles: string[];
    cameraEquipment: string[];
    awards: string[];
    videoReelUrl?: string;
  };

  bridalWearSpecs?: {
    collectionTypes: string[];
    customizationAvailable: boolean;
    trialBookingAvailable: boolean;
    startingPrice: string;
  };

  makeupSpecs?: {
    bridalLookTypes: string[];
    brandsUsed: string[];
    travelToVenue: boolean;
    beforeAfterGallery?: { before: string; after: string; label: string }[];
  };

  decorSpecs?: {
    themesOffered: string[];
    stageStyles: string[];
    lightingTypes: string[];
  };

  jewellerySpecs?: {
    goldPurity: string[];
    diamondCertification: string;
    customOrders: boolean;
  };

  // General Media & Packages
  galleryImages: string[];
  packagesList: { name: string; price: string; description: string; features: string[] }[];
};

export const DEFAULT_VENDOR_CONFIGS: Record<string, VendorProfileConfig> = {
  "v-solitaire": {
    id: "cfg-solitaire",
    vendorId: "v-solitaire",
    category: "Wedding Venues",
    businessName: "Grand Solitaire Island Resort",
    tagline: "Luxury Waterfront Island Wedding Destination",
    logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1600&q=80",
    aboutText: "Situated on the serene Bolgatty Island, Grand Solitaire Island Resort offers 100,000 sq.ft of luxurious indoor & outdoor wedding spaces with backwater views.",
    phone: "+91 484 266 1234",
    whatsapp: "+91 98950 11223",
    email: "events.kochi@solitaire.com",
    instagram: "@grandsolitaire",
    website: "https://solitaire.com",
    city: "Kochi",
    district: "Ernakulam",
    address: "Bolgatty Island, Kochi, Kerala 682050",
    businessHours: "Daily: 24/7 Event Booking & Front Desk",
    visibility: {
      heroBanner: true,
      gallery: true,
      packages: true,
      categoryFields: true,
      aboutStory: true,
      amenitiesOrSpecs: true,
      reviews: true,
      locationMap: true,
      contactCTA: true,
      awardsOrFAQ: true,
    },
    venueSpecs: {
      guestCapacity: "250 to 3,000 Guests",
      indoorOutdoor: "Both Indoor & Outdoor",
      roomsCount: 264,
      parkingCapacity: "500+ Cars",
      cateringOption: "In-house Catering",
    },
    galleryImages: [
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    ],
    packagesList: [
      { name: "Royal Waterfront Lawn Package", price: "₹4,50,000 / day", description: "Full outdoor lawn rental with backwater stage setup.", features: ["Up to 1500 Guests", "Valet Parking", "Heliport Access"] },
      { name: "Grand Ballroom Banquet Package", price: "₹2,80,000 / day", description: "Pillarless air-conditioned ballroom with acoustic lighting.", features: ["Up to 800 Guests", "Bridal Suite Included"] }
    ]
  },
  "v-30": {
    id: "cfg-memory",
    vendorId: "v-30",
    category: "Photographers",
    businessName: "Memory Lanes Photography",
    tagline: "Cinematic & Candid Wedding Storytelling Across Kerala",
    logo: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1600&q=80",
    aboutText: "Award-winning team capturing timeless candid moments, pre-wedding destination films, and traditional Kerala wedding rituals.",
    phone: "+91 98470 55443",
    whatsapp: "+91 98470 55443",
    email: "info@memorylanes.in",
    instagram: "@memorylanes_films",
    website: "https://memorylanes.in",
    city: "Kozhikode",
    district: "Kozhikode",
    address: "Focus Mall Road, Kozhikode, Kerala",
    businessHours: "Mon – Sat: 9:30 AM – 7:30 PM (Sun Closed)",
    visibility: {
      heroBanner: true,
      gallery: true,
      packages: true,
      categoryFields: true,
      aboutStory: true,
      amenitiesOrSpecs: true,
      reviews: true,
      locationMap: true,
      contactCTA: true,
      awardsOrFAQ: true,
    },
    photographerSpecs: {
      photographyStyles: ["Candid Photography", "Cinematic Films", "Traditional Portraiture", "Drone Aerial Shoots"],
      cameraEquipment: ["Sony A7IV / FX3", "Canon R5 Cinema", "DJI Mavic 3 Pro Drones", "Prime Master Lenses"],
      awards: ["Top 10 Wedding Photographers in South India 2025", "Fearless Photographers Award Winners"],
      videoReelUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    galleryImages: [
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    ],
    packagesList: [
      { name: "Complete Wedding 2-Day Film Package", price: "₹1,20,000", description: "Coverage of Mehendi, Wedding & Reception.", features: ["2 Candid Photographers", "2 Cinematographers", "Drone Shoot", "300 Softcover Teaser Album"] }
    ]
  },
  "v-22": {
    id: "cfg-aurelia",
    vendorId: "v-22",
    category: "Bridal Studio",
    businessName: "Aurelia Brides Couture",
    tagline: "Handcrafted Zardozi Lehengas & Heritage Silk Ensembles",
    logo: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80",
    aboutText: "Bespoke bridal wear boutique specializing in custom royal lehengas, Banarasi silk sarees, and customized bridal veils.",
    phone: "+91 96551 25480",
    whatsapp: "+91 96551 25480",
    email: "aurelia.brides@gmail.com",
    instagram: "@aureliabrides",
    website: "https://aureliabrides.com",
    city: "Kochi",
    district: "Ernakulam",
    address: "MG Road, Kochi, Kerala",
    businessHours: "Mon – Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 5:00 PM",
    visibility: {
      heroBanner: true,
      gallery: true,
      packages: true,
      categoryFields: true,
      aboutStory: true,
      amenitiesOrSpecs: true,
      reviews: true,
      locationMap: true,
      contactCTA: true,
      awardsOrFAQ: true,
    },
    bridalWearSpecs: {
      collectionTypes: ["Zardozi Velvet Lehengas", "Banarasi Heritage Sarees", "Customized Bridal Veils", "Reception Gowns"],
      customizationAvailable: true,
      trialBookingAvailable: true,
      startingPrice: "₹45,000",
    },
    galleryImages: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594938298596-70f594f74246?auto=format&fit=crop&w=800&q=80",
    ],
    packagesList: [
      { name: "Bespoke Royal Bridal Lehenga Package", price: "₹85,000", description: "Custom hand-embroidered Zardozi lehenga with trial fittings.", features: ["Custom Color Choice", "Double Dupatta Set", "Express 3-Week Delivery"] }
    ]
  },
  "kalki-couture": {
    id: "cfg-kalki",
    vendorId: "kalki-couture",
    category: "Bridal Studio",
    businessName: "Kalki Couture",
    tagline: "Contemporary Bridal Lehengas & Luxury Indo-Western Couture",
    logo: "https://images.unsplash.com/photo-1594938298596-70f594f74246?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1594938298596-70f594f74246?auto=format&fit=crop&w=1600&q=80",
    aboutText: "Leading luxury couture brand offering exquisite pastel bridal lehengas, silk shararas, and designer reception gowns.",
    phone: "+91 98920 44112",
    whatsapp: "+91 98920 44112",
    email: "contact@kalkicouture.in",
    instagram: "@kalkicouture",
    website: "https://kalkicouture.in",
    city: "Kochi",
    district: "Ernakulam",
    address: "Lulu Mall Avenue, Edappally, Kochi, Kerala",
    businessHours: "Tue – Sun: 10:30 AM – 8:30 PM (Mon Closed)",
    visibility: {
      heroBanner: true,
      gallery: true,
      packages: true,
      categoryFields: true,
      aboutStory: true,
      amenitiesOrSpecs: true,
      reviews: true,
      locationMap: true,
      contactCTA: true,
      awardsOrFAQ: true,
    },
    bridalWearSpecs: {
      collectionTypes: ["Pastel Bridal Lehengas", "Silk Shararas", "Reception Gowns", "Anarkalis"],
      customizationAvailable: true,
      trialBookingAvailable: true,
      startingPrice: "₹38,000",
    },
    galleryImages: [
      "https://images.unsplash.com/photo-1594938298596-70f594f74246?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    ],
    packagesList: [
      { name: "Signature Pastel Bridal Couture Package", price: "₹65,000", description: "Designer lehenga set with custom trial fitting.", features: ["Personal Stylist Consultation", "Custom Blouse Stitching"] }
    ]
  }
};

const PROFILE_CONFIG_STORAGE_KEY = "cloche_vendor_profile_configs_v1";

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function createDefaultConfig(vendorId: string, category: CategoryType): VendorProfileConfig {
  const cleanId = vendorId.toLowerCase().replace(/[^a-z0-9]/g, "");
  const formattedName = vendorId
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const hashVal = simpleHash(vendorId);
  const phoneSuffix = 100000 + (hashVal % 900000);
  const vendorPhone = `+91 9847${phoneSuffix}`;
  const vendorEmail = `contact@${cleanId || "vendor"}.in`;

  let defaultHours = "Mon – Sat: 10:00 AM – 8:00 PM";
  if (category === "Wedding Venues" || category === "Wedding Venue") {
    defaultHours = "Daily: 9:00 AM – 10:00 PM";
  } else if (category === "Photographers") {
    defaultHours = "Mon – Sat: 9:30 AM – 7:30 PM (Sun Closed)";
  } else if (category === "Makeup Artists" || category === "Mehendi Artists") {
    defaultHours = "Tue – Sun: 9:00 AM – 7:00 PM (Mon Closed)";
  } else if (category === "Decor & Planning") {
    defaultHours = "Mon – Sat: 10:00 AM – 7:00 PM";
  } else if (category.includes("Studio") || category.includes("Wear")) {
    defaultHours = "Mon – Sat: 10:00 AM – 8:00 PM | Sun: 11:00 AM – 5:00 PM";
  }

  return {
    id: `cfg-${vendorId}`,
    vendorId,
    category,
    businessName: formattedName || "Boutique Partner",
    tagline: `Exclusive ${category} Specialist`,
    logo: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=400&q=80",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1600&q=80",
    aboutText: `Welcome to ${formattedName}. We provide bespoke ${category.toLowerCase()} services tailored to your wedding vision.`,
    phone: vendorPhone,
    whatsapp: vendorPhone,
    email: vendorEmail,
    instagram: `@${cleanId}`,
    website: `https://${cleanId}.in`,
    city: "Kochi",
    district: "Ernakulam",
    address: `${formattedName} Studio, Ernakulam, Kerala`,
    businessHours: defaultHours,
    visibility: {
      heroBanner: true,
      gallery: true,
      packages: true,
      categoryFields: true,
      aboutStory: true,
      amenitiesOrSpecs: true,
      reviews: true,
      locationMap: true,
      contactCTA: true,
      awardsOrFAQ: true,
    },
    galleryImages: [
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
    ],
    packagesList: [
      { name: `Signature ${category} Package`, price: "₹50,000", description: "Comprehensive service package for weddings.", features: ["Direct Booking", "Priority Consultation"] }
    ]
  };
}

export function getVendorProfileConfig(vendorId: string, category: CategoryType = "Wedding Venues"): VendorProfileConfig {
  if (typeof window === "undefined") {
    return DEFAULT_VENDOR_CONFIGS[vendorId] || createDefaultConfig(vendorId, category);
  }

  try {
    const raw = localStorage.getItem(PROFILE_CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[vendorId]) return parsed[vendorId];
    }
  } catch (e) {}

  return DEFAULT_VENDOR_CONFIGS[vendorId] || createDefaultConfig(vendorId, category);
}

export function saveVendorProfileConfig(config: VendorProfileConfig): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PROFILE_CONFIG_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : DEFAULT_VENDOR_CONFIGS;
    existing[config.vendorId] = config;
    localStorage.setItem(PROFILE_CONFIG_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {}
}

import { 
  Building2, 
  Camera, 
  Sparkles, 
  Palette as PaletteIcon, 
  Wand2, 
  UtensilsCrossed, 
  Mail, 
  Gem,
  LucideIcon
} from "lucide-react";

export interface VendorCategoryConfig {
  id: string;
  name: string;
  badge: string;
  icon: LucideIcon;
  media: {
    title: string;
    subtitle: string;
    itemTypeLabel: string;
    tags: string[];
    emptyPrompt: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    itemTypeLabel: string;
    pricingFields: string[];
    emptyPrompt: string;
  };
  sampleMedia: Array<{
    id: string;
    title: string;
    category: string;
    image: string;
    capacity?: string;
    details?: string;
  }>;
  samplePricing: Array<{
    id: string;
    name: string;
    price: string;
    unit?: string;
    features: string[];
    popular?: boolean;
    badge?: string;
  }>;
}

export const VENDOR_CATEGORIES: Record<string, VendorCategoryConfig> = {
  venues: {
    id: "venues",
    name: "Venues",
    badge: "Banquet & Lawns",
    icon: Building2,
    media: {
      title: "Gallery & Halls",
      subtitle: "Showcase banquet halls, lawns & outdoor spaces",
      itemTypeLabel: "Hall / Space",
      tags: ["All", "Banquet Hall", "Grand Lawn", "Poolside Terrace", "Courtyard"],
      emptyPrompt: "No halls or spaces added yet. Showcase your banquet halls and outdoor venues to attract couples!"
    },
    pricing: {
      title: "Halls & Pricing",
      subtitle: "Configure hall rental rates, guest capacity & slot fees",
      itemTypeLabel: "Space Pricing Slot",
      pricingFields: ["Hall Rental Fee", "Guest Capacity Range", "Morning/Evening Slot Fee", "Security Deposit"],
      emptyPrompt: "No pricing slots configured. Add rental fees and guest capacity for your venue spaces."
    },
    sampleMedia: [
      {
        id: "v-1",
        title: "Grand Royal Ballroom",
        category: "Banquet Hall",
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop",
        capacity: "500 - 1200 Guests",
        details: "Centralized AC, Luxury Crystal Chandeliers, Attached Bridal Suite"
      },
      {
        id: "v-2",
        title: "Emerald Palm Lawn",
        category: "Grand Lawn",
        image: "https://images.unsplash.com/photo-1545232979-fbf34fd36666?q=80&w=800&auto=format&fit=crop",
        capacity: "800 - 2500 Guests",
        details: "Lush Greenery, Covered Live Catering Area, Valet Parking"
      },
      {
        id: "v-3",
        title: "Sunset Poolside Deck",
        category: "Poolside Terrace",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
        capacity: "150 - 400 Guests",
        details: "Ideal for Haldi, Cocktail & Mehendi Ceremonies"
      }
    ],
    samplePricing: [
      {
        id: "vp-1",
        name: "Grand Ballroom Evening Slot",
        price: "₹2,50,000",
        unit: "per slot (6 hrs)",
        features: ["Upto 1,000 guest capacity", "AC included for 6 hours", "Basic stage lighting", "2 Deluxe Green Rooms"],
        popular: true,
        badge: "Most Popular"
      },
      {
        id: "vp-2",
        name: "Emerald Lawn Full Day Rental",
        price: "₹4,00,000",
        unit: "full day (12 hrs)",
        features: ["Upto 2,500 guest capacity", "Full lawn access + Gazebo", "Power backup generator", "Dedicated valet team"],
        badge: "Best Value"
      }
    ]
  },

  photographers: {
    id: "photographers",
    name: "Photographers",
    badge: "Photo & Video",
    icon: Camera,
    media: {
      title: "Portfolio",
      subtitle: "Albums grouped by wedding, pre-wedding & engagement",
      itemTypeLabel: "Photo Album",
      tags: ["All", "Wedding Day", "Pre-Wedding Shoot", "Engagement", "Traditional Rituals"],
      emptyPrompt: "No albums added to portfolio yet. Upload high-res photo albums to display your artistic style!"
    },
    pricing: {
      title: "Packages & Pricing",
      subtitle: "Coverage hours, deliverables & add-ons like drone & prints",
      itemTypeLabel: "Photography Package",
      pricingFields: ["Coverage Hours", "Team Size", "Deliverable Photos & Teaser", "Drone / Album Add-ons"],
      emptyPrompt: "No packages created yet. Create photo and video packages for wedding couples."
    },
    sampleMedia: [
      {
        id: "ph-1",
        title: "Royal Jaipur Palace Wedding",
        category: "Wedding Day",
        image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
        details: "120 Color Graded Photos • 4K Cinematic Teaser Film"
      },
      {
        id: "ph-2",
        title: "Udaipur Sunset Pre-Wedding",
        category: "Pre-Wedding Shoot",
        image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
        details: "Lake Pichola Boat & Fort Shoot • 45 Edited Portraits"
      },
      {
        id: "ph-3",
        title: "Rings & Rituals Engagement",
        category: "Engagement",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
        details: "Candid Moments • Family Group Portraits"
      }
    ],
    samplePricing: [
      {
        id: "php-1",
        name: "Bridal Signature Package",
        price: "₹1,20,000",
        unit: "per day (2 days)",
        features: ["2 Senior Candid Photographers", "1 Traditional Cinematographer", "4K 3-Min Teaser + Full Film", "350 Hard Cover Flush Mount Album"],
        popular: true,
        badge: "Best Seller"
      },
      {
        id: "php-2",
        name: "Pre-Wedding Destination Shoot",
        price: "₹65,000",
        unit: "1-day shoot",
        features: ["Full Day Outdoor Shoot", "Drone Aerial Photography", "40 Fine-Art Retouched Images", "Instagram Reels Edit"],
        badge: "Trending"
      }
    ]
  },

  makeup: {
    id: "makeup",
    name: "Makeup Artists",
    badge: "Bridal & Beauty",
    icon: Sparkles,
    media: {
      title: "Portfolio",
      subtitle: "Before/after shots & bridal look categories",
      itemTypeLabel: "Look Transformation",
      tags: ["All", "HD Bridal Makeup", "Airbrush Glam", "Reception Sangeet", "Party Makeup"],
      emptyPrompt: "No look transformations in gallery. Upload before & after transformations to win brides!"
    },
    pricing: {
      title: "Packages & Pricing",
      subtitle: "Bridal, party & trial rates + outstation travel charges",
      itemTypeLabel: "Makeup Package",
      pricingFields: ["Bridal HD/Airbrush Fee", "Pre-Bridal Trial Charge", "Party Makeup Rate", "Travel / Outstation Fee"],
      emptyPrompt: "No beauty packages defined. Set your bridal, sangeet, and trial rates."
    },
    sampleMedia: [
      {
        id: "mk-1",
        title: "Royal Red Bridal Transformation",
        category: "HD Bridal Makeup",
        image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
        details: "Airbrush Base • Dewy Finish • Customized Lashes & Hair Styling"
      },
      {
        id: "mk-2",
        title: "Pastel Sangeet Glow",
        category: "Reception Sangeet",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
        details: "Smokey Eye • Hollywood Waves Hairstyling • Draping Included"
      }
    ],
    samplePricing: [
      {
        id: "mkp-1",
        name: "Luxury HD Bridal Look",
        price: "₹35,000",
        unit: "per function",
        features: ["Premium HD Makeup Products", "Intricate Bridal Hairstyling", "Outfit Draping & Lash Extensions", "Complimentary Touch-Up Kit"],
        popular: true,
        badge: "Bride Choice"
      },
      {
        id: "mkp-2",
        name: "Bridal + 2 Party Makeup Combo",
        price: "₹55,000",
        unit: "package",
        features: ["1 HD Bridal Makeup", "2 Guest / Relative Party Makeups", "Hair Accessories Included", "Venue Travel within City"],
        badge: "Combo Discount"
      }
    ]
  },

  mehendi: {
    id: "mehendi",
    name: "Mehendi Artists",
    badge: "Henna Art",
    icon: PaletteIcon,
    media: {
      title: "Design Gallery",
      subtitle: "Arabic, Rajasthani & Indo-Arabic style categories",
      itemTypeLabel: "Henna Design",
      tags: ["All", "Rajasthani Bridal", "Arabic Style", "Indo-Arabic Figure", "Minimalist Modern"],
      emptyPrompt: "No mehendi designs uploaded. Showcase your intricate henna patterns and bridal portraits!"
    },
    pricing: {
      title: "Packages & Pricing",
      subtitle: "Bridal, per-guest & per-hand pricing structures",
      itemTypeLabel: "Mehendi Package",
      pricingFields: ["Full Bridal Package Rate", "Per-Hand Rate", "Per-Guest Hour Rate", "Organic Stain Guarantee"],
      emptyPrompt: "No pricing packages created yet. Define per-hand, bridal, and guest group rates."
    },
    sampleMedia: [
      {
        id: "mh-1",
        title: "Portrait Bridal Dulha-Dulhan Pattern",
        category: "Rajasthani Bridal",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
        details: "Elbow Length • Custom Portrait Figures • Organic Rajasthani Henna"
      },
      {
        id: "mh-2",
        title: "Bold Flowing Arabic Vines",
        category: "Arabic Style",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
        details: "Fast Application • Deep Dark Stain • Modern Geometric Accents"
      }
    ],
    samplePricing: [
      {
        id: "mhp-1",
        name: "Royal Full Length Bridal Henna",
        price: "₹18,000",
        unit: "full bridal",
        features: ["Both hands till elbow", "Feet application till calf", "Customized Baraat & Portrait Motif", "Chemical-Free Organic Henna Cones"],
        popular: true,
        badge: "Top Choice"
      },
      {
        id: "mhp-2",
        name: "Guest Mehendi Party Team (10 Guests)",
        price: "₹15,000",
        unit: "group booking",
        features: ["2 Assistant Artists for 4 hours", "Arabic & Floral Palms for 10 Guests", "Fast 15-min per guest application"],
        badge: "Group Saver"
      }
    ]
  },

  planners: {
    id: "planners",
    name: "Event Planners & Decorators",
    badge: "Decor & Management",
    icon: Wand2,
    media: {
      title: "Theme Portfolio",
      subtitle: "Past events & bespoke wedding themes executed",
      itemTypeLabel: "Theme Concept",
      tags: ["All", "Royal Marwar Stage", "Boho Chic Mandap", "Floral Tunnel Entrance", "Sangeet Glam Stage"],
      emptyPrompt: "No themes in portfolio. Upload images of past setups, mandaps, and stage designs!"
    },
    pricing: {
      title: "Packages & Pricing",
      subtitle: "Full planning vs decor-only & vendor network management",
      itemTypeLabel: "Event Package",
      pricingFields: ["Decor Setup Cost", "End-to-End Planning Fee", "Lighting & Truss Setup", "Vendor Coordination Fee"],
      emptyPrompt: "No planning/decor packages listed. Set up options for decor-only or full planning."
    },
    sampleMedia: [
      {
        id: "pl-1",
        title: "Pastel Royal Mandap under Stars",
        category: "Boho Chic Mandap",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        details: "Real Fresh Exotic Flowers • Fairy Light Canopy • Custom Seating"
      },
      {
        id: "pl-2",
        title: "Mirror & Marigold Sangeet Arena",
        category: "Sangeet Glam Stage",
        image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop",
        details: "LED Screen Background • Intelligent Moving Head Lights • DJ Setup"
      }
    ],
    samplePricing: [
      {
        id: "plp-1",
        name: "Complete Wedding Planning & Execution",
        price: "₹3,50,000",
        unit: "management fee",
        features: ["End-to-end 3-day wedding management", "Vendor negotiation & contract management", "RSVP & Guest Hospitality Desk", "On-site Event Managers (6 personnel)"],
        popular: true,
        badge: "Full Service"
      },
      {
        id: "plp-2",
        name: "Bespoke Royal Mandap & Entrance Decor",
        price: "₹2,20,000",
        unit: "per event",
        features: ["Fresh Flower Dome Mandap", "Grand Entrance Pathway & Arch", "Stage Backdrops & Couple Sofa", "Ambient Mood Lighting"],
        badge: "Decor Only"
      }
    ]
  },

  caterers: {
    id: "caterers",
    name: "Caterers",
    badge: "Food & Beverage",
    icon: UtensilsCrossed,
    media: {
      title: "Menu Management",
      subtitle: "Cuisines offered, veg, non-veg & Jain food items",
      itemTypeLabel: "Menu Category / Counter",
      tags: ["All", "North Indian Buffet", "Live Street Food Counters", "Royal Mughlai", "Jain Special", "Gourmet Desserts"],
      emptyPrompt: "No menu items or live counters added. Highlight signature cuisines and live food stalls!"
    },
    pricing: {
      title: "Packages & Pricing",
      subtitle: "Per-plate rates & tasting appointment schedule rules",
      itemTypeLabel: "Catering Menu Package",
      pricingFields: ["Per-Plate Rate (Veg)", "Per-Plate Rate (Non-Veg)", "Live Counters Included", "Tasting Session Charge"],
      emptyPrompt: "No catering pricing packages added. Set per-plate charges and minimum guest counts."
    },
    sampleMedia: [
      {
        id: "ct-1",
        title: "Royal Rajasthani & Marwari Thali spread",
        category: "North Indian Buffet",
        image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
        details: "14 Starters • 18 Main Course Dishes • Pure Desi Ghee Prep"
      },
      {
        id: "ct-2",
        title: "Artisanal Live Chaat & Wood-Fired Pizza",
        category: "Live Street Food Counters",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
        details: "Customized Live Chef Stations • Clean & Hygienic Uniformed Staff"
      }
    ],
    samplePricing: [
      {
        id: "ctp-1",
        name: "Royal Diamond Feast (Pure Veg / Jain)",
        price: "₹1,450",
        unit: "per plate (Min 300 guests)",
        features: ["8 Welcome Drinks & Mocktails", "12 Starter Dishes", "4 Live Food Counters", "5 Premium Desserts + Ice Cream Bar"],
        popular: true,
        badge: "Most Ordered"
      },
      {
        id: "ctp-2",
        name: "Gourmet International & Mughlai Buffet",
        price: "₹1,850",
        unit: "per plate (Min 250 guests)",
        features: ["Veg & Non-Veg Multi-Cuisine", "Live Sushi & Wood-Fired Pizza Station", "Mughlai Handi Biryani Special", "Includes Uniformed Service Staff & Cutlery"],
        badge: "Premium Luxury"
      }
    ]
  },

  invitations: {
    id: "invitations",
    name: "Invitations",
    badge: "Cards & Digital",
    icon: Mail,
    media: {
      title: "Design Catalog",
      subtitle: "Templates, digital video samples & luxury print samples",
      itemTypeLabel: "Invitation Design",
      tags: ["All", "Boxed Royal Acrylic", "Eco-Friendly Seed Paper", "Animated Video Invite", "Gold Foil Minimalist"],
      emptyPrompt: "No invitation samples in catalog. Upload digital invite videos and physical card photos!"
    },
    pricing: {
      title: "Pricing",
      subtitle: "Per-card rates, bulk discount tiers & customization fees",
      itemTypeLabel: "Pricing Tier",
      pricingFields: ["Per Card Base Price", "Bulk Order Discount (500+)", "Wax Seal / Gold Foil Extra", "Digital Video Invite Fee"],
      emptyPrompt: "No pricing structure configured. Add unit card prices and volume discount tiers."
    },
    sampleMedia: [
      {
        id: "inv-1",
        title: "Luxury Rigid Box with Brass Latch & Sweets Container",
        category: "Boxed Royal Acrylic",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop",
        details: "Velvet Insert • Custom Monogram Wax Seal • Metallic Gold Leafing"
      },
      {
        id: "inv-2",
        title: "Cinematic 3D Palace Wedding E-Invite Video",
        category: "Animated Video Invite",
        image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
        details: "WhatsApp Ready • Music Included • RSVP Link Integrated"
      }
    ],
    samplePricing: [
      {
        id: "invp-1",
        name: "Royal Acrylic Box Card Set",
        price: "₹380",
        unit: "per card (Min 200 units)",
        features: ["Acrylic main card with gold foil", "3 Inserts (Haldi, Mehendi, Wedding)", "Customized Box Case", "Includes outer delivery box"],
        popular: true,
        badge: "Trending"
      },
      {
        id: "invp-2",
        name: "Custom Animated WhatsApp Video Package",
        price: "₹12,000",
        unit: "flat fee",
        features: ["60-sec 4K Video Invitation", "Custom Couple Illustration", "3 Rounds of Revisions", "Matching Save-the-Date PDF"],
        badge: "Digital Special"
      }
    ]
  },

  jewellery: {
    id: "jewellery",
    name: "Jewellery",
    badge: "Bridal Ornaments",
    icon: Gem,
    media: {
      title: "Collection Catalog",
      subtitle: "Bridal sets & luxury accessories by category",
      itemTypeLabel: "Jewellery Piece / Set",
      tags: ["All", "Kundan Bridal Choker", "Polki & Emerald Set", "Temple Gold Neckpieces", "Mathapatti & Nath"],
      emptyPrompt: "No jewellery collections cataloged. Upload photos of bridal Kundan, Polki, and Gold sets!"
    },
    pricing: {
      title: "Pricing",
      subtitle: "Rental vs purchase options & security deposit terms",
      itemTypeLabel: "Collection Price Tag",
      pricingFields: ["Purchase Price", "3-Day Rental Charge", "Security Deposit Amount", "Custom Fitting Charge"],
      emptyPrompt: "No pricing tags added yet. Add rental fees, deposit requirements, and purchase rates."
    },
    sampleMedia: [
      {
        id: "jw-1",
        title: "Royal Uncut Polki & Colombian Emerald Bridal Set",
        category: "Polki & Emerald Set",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
        details: "Includes Choker, Long Haar, Jhumkas, Mathapatti & Haathphool"
      },
      {
        id: "jw-2",
        title: "22K Antique Temple Gold Heritage Necklace",
        category: "Temple Gold Neckpieces",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
        details: "Handcrafted Nakshi Work • Certified Hallmarked Gold"
      }
    ],
    samplePricing: [
      {
        id: "jwp-1",
        name: "Polki Heritage Bridal Set (3-Day Rental)",
        price: "₹28,000",
        unit: "3-day rental",
        features: ["Full 7-piece bridal set", "Sanitized & Polished prior to event", "Security Deposit: ₹50,000 (Refundable)", "Free fitting alteration"],
        popular: true,
        badge: "Rental Special"
      },
      {
        id: "jwp-2",
        name: "Custom Made Kundan Choker Purchase",
        price: "₹2,45,000",
        unit: "direct purchase",
        features: ["Hallmarked 22K Gold Base", "Certified Uncut Diamonds", "Lifetime Cleaning Guarantee", "Insured Delivery"],
        badge: "Buy Fine Jewellery"
      }
    ]
  }
};

export function getCategoryConfig(categoryKey: string): VendorCategoryConfig {
  const normalizedKey = (categoryKey || "").toLowerCase().trim();
  
  if (normalizedKey.includes("photo") || normalizedKey.includes("video") || normalizedKey.includes("film")) {
    return VENDOR_CATEGORIES.photographers;
  }
  if (normalizedKey.includes("makeup") || normalizedKey.includes("beauty")) {
    return VENDOR_CATEGORIES.makeup;
  }
  if (normalizedKey.includes("mehendi") || normalizedKey.includes("henna")) {
    return VENDOR_CATEGORIES.mehendi;
  }
  if (normalizedKey.includes("planner") || normalizedKey.includes("decor") || normalizedKey.includes("event")) {
    return VENDOR_CATEGORIES.planners;
  }
  if (normalizedKey.includes("cater") || normalizedKey.includes("food")) {
    return VENDOR_CATEGORIES.caterers;
  }
  if (normalizedKey.includes("invitation") || normalizedKey.includes("card")) {
    return VENDOR_CATEGORIES.invitations;
  }
  if (normalizedKey.includes("jewel") || normalizedKey.includes("ornament")) {
    return VENDOR_CATEGORIES.jewellery;
  }
  
  // Default to venues
  return VENDOR_CATEGORIES.venues;
}

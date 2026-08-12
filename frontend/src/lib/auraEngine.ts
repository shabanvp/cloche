export interface AuraVendorItem {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  startingPrice: string;
  logo: string;
  coverImage: string;
  isVerified: boolean;
  slug: string;
  detailUrl: string;
}

export interface AuraResponse {
  reply: string;
  groundedVendors: AuraVendorItem[];
  categoryUrl?: string;
  actionRequired?: "signup" | "login" | "none";
  topic: "vendors" | "culture" | "planning" | "action_declined" | "general";
}

const CATEGORY_MAP: Record<string, { slug: string; name: string; url: string }> = {
  venue: { slug: "wedding-venues", name: "Wedding Venues", url: "/venues" },
  venues: { slug: "wedding-venues", name: "Wedding Venues", url: "/venues" },
  resort: { slug: "wedding-venues", name: "Wedding Venues", url: "/venues" },
  hall: { slug: "wedding-venues", name: "Wedding Venues", url: "/venues" },
  palace: { slug: "wedding-venues", name: "Wedding Venues", url: "/venues" },
  lawn: { slug: "wedding-venues", name: "Wedding Venues", url: "/venues" },
  
  photo: { slug: "photographers", name: "Photographers", url: "/photographers" },
  photographer: { slug: "photographers", name: "Photographers", url: "/photographers" },
  photographers: { slug: "photographers", name: "Photographers", url: "/photographers" },
  photography: { slug: "photographers", name: "Photographers", url: "/photographers" },
  videography: { slug: "photographers", name: "Photographers", url: "/photographers" },
  video: { slug: "photographers", name: "Photographers", url: "/photographers" },

  makeup: { slug: "makeup-artists", name: "Bridal Makeup Artists", url: "/makeup-artists" },
  "makeup-artist": { slug: "makeup-artists", name: "Bridal Makeup Artists", url: "/makeup-artists" },
  "makeup-artists": { slug: "makeup-artists", name: "Bridal Makeup Artists", url: "/makeup-artists" },
  mua: { slug: "makeup-artists", name: "Bridal Makeup Artists", url: "/makeup-artists" },
  beauty: { slug: "makeup-artists", name: "Bridal Makeup Artists", url: "/makeup-artists" },

  cater: { slug: "catering", name: "Wedding Catering", url: "/catering" },
  caterer: { slug: "catering", name: "Wedding Catering", url: "/catering" },
  caterers: { slug: "catering", name: "Wedding Catering", url: "/catering" },
  catering: { slug: "catering", name: "Wedding Catering", url: "/catering" },
  food: { slug: "catering", name: "Wedding Catering", url: "/catering" },
  sadya: { slug: "catering", name: "Wedding Catering", url: "/catering" },

  decor: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },
  decorator: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },
  decorators: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },
  planner: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },
  planners: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },

  bridal: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },
  saree: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },
  lehenga: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },
  boutique: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },
  boutiques: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },

  groom: { slug: "groom-wear", name: "Groom Wear Stores", url: "/groom-wear" },
  sherwani: { slug: "groom-wear", name: "Groom Wear Stores", url: "/groom-wear" },
  suit: { slug: "groom-wear", name: "Groom Wear Stores", url: "/groom-wear" },
  tuxedo: { slug: "groom-wear", name: "Groom Wear Stores", url: "/groom-wear" },

  jewel: { slug: "jewellery", name: "Jewellery Stores", url: "/jewellery" },
  jewellery: { slug: "jewellery", name: "Jewellery Stores", url: "/jewellery" },
  jewelry: { slug: "jewellery", name: "Jewellery Stores", url: "/jewellery" },
  gold: { slug: "jewellery", name: "Jewellery Stores", url: "/jewellery" },
  diamond: { slug: "jewellery", name: "Jewellery Stores", url: "/jewellery" },

  mehendi: { slug: "mehendi-artists", name: "Mehendi Artists", url: "/mehendi-artists" },
  mehndi: { slug: "mehendi-artists", name: "Mehendi Artists", url: "/mehendi-artists" },
  henna: { slug: "mehendi-artists", name: "Mehendi Artists", url: "/mehendi-artists" },

  invite: { slug: "invitations", name: "Wedding Invitations", url: "/invitations" },
  invites: { slug: "invitations", name: "Wedding Invitations", url: "/invitations" },
  invitation: { slug: "invitations", name: "Wedding Invitations", url: "/invitations" },
  cards: { slug: "invitations", name: "Wedding Invitations", url: "/invitations" },

  cake: { slug: "cake-designer", name: "Cake Designers", url: "/vendors?category=cake-designer" },
  cakes: { slug: "cake-designer", name: "Cake Designers", url: "/vendors?category=cake-designer" },
  baker: { slug: "cake-designer", name: "Cake Designers", url: "/vendors?category=cake-designer" },

  car: { slug: "car-rental", name: "Wedding Car Rentals", url: "/vendors?category=car-rental" },
  cars: { slug: "car-rental", name: "Wedding Car Rentals", url: "/vendors?category=car-rental" },
};

const CITY_LIST = [
  "kochi", "cochin", "calicut", "kozhikode", "trivandrum", "thiruvananthapuram", 
  "thrissur", "kottayam", "alappuzha", "alleppey", "kannur", "palakkad", 
  "kollam", "malappuram", "wayanad", "idukki", "kasaragod", "jaipur", 
  "bangalore", "bengaluru", "chennai", "delhi", "mumbai", "hyderabad", "goa"
];

function extractCategoryAndCity(query: string): { category?: { slug: string; name: string; url: string }; city?: string } {
  const lower = query.toLowerCase();
  let matchedCategory: { slug: string; name: string; url: string } | undefined;
  let matchedCity: string | undefined;

  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    const regex = new RegExp(`\\b${key}\\b`, "i");
    if (regex.test(lower)) {
      matchedCategory = cat;
      break;
    }
  }

  for (const c of CITY_LIST) {
    const regex = new RegExp(`\\b${c}\\b`, "i");
    if (regex.test(lower)) {
      if (c === "cochin") matchedCity = "Kochi";
      else if (c === "kozhikode") matchedCity = "Calicut";
      else if (c === "thiruvananthapuram") matchedCity = "Trivandrum";
      else if (c === "alleppey") matchedCity = "Alappuzha";
      else if (c === "bengaluru") matchedCity = "Bangalore";
      else matchedCity = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  return { category: matchedCategory, city: matchedCity };
}

/**
 * Executes a strictly grounded query to Cloche's real live vendor directory.
 * Never fabricates vendor names, ratings, or prices.
 */
export async function queryAuraAssistant(rawQuery: string): Promise<AuraResponse> {
  const query = (rawQuery || "").trim();
  const lower = query.toLowerCase();

  // 1. Guardrail: Action Requests (Bookings, Quotation generation, Vendor profile edits)
  const actionKeywords = ["book", "booking", "send quote", "request quote", "generate quote", "edit my profile", "update my boutique", "create lead", "hire"];
  const isActionRequest = actionKeywords.some((w) => lower.includes(w));

  if (isActionRequest && (lower.includes("quote") || lower.includes("book") || lower.includes("edit") || lower.includes("hire"))) {
    return {
      reply: "I am currently in guest discovery mode, so I cannot directly book services, generate custom quotation documents, or modify vendor accounts. You can connect directly with vendors via phone or WhatsApp on their profile pages, or sign up for a Cloche account to manage inquiries.",
      groundedVendors: [],
      actionRequired: "signup",
      topic: "action_declined",
    };
  }

  // 2. Cultural & Tradition Inquiries (Curated authentic guidance)
  if (lower.includes("sadya") || lower.includes("sadhya")) {
    return {
      reply: "A traditional Kerala Wedding Sadya is an elaborate vegetarian feast served on a banana leaf, featuring over 24 authentic items including Parippu with Ghee, Sambar, Aviyal, Thoran, Olan, Kalan, Pachadi, Ginger Puli Inji, Pappadam, and Payasam (Ada Pradhaman & Paal Payasam). Our verified wedding caterers offer authentic traditional masters (cooks) and modern live counters.",
      groundedVendors: [],
      categoryUrl: "/catering",
      topic: "culture",
    };
  }

  if (lower.includes("manthrakodi") || lower.includes("minnu") || (lower.includes("christian") && lower.includes("wedding"))) {
    return {
      reply: "In traditional Kerala Christian weddings, the groom ties the Minnu (a gold pendant with 7 beads forming a cross) around the bride's neck and presents the Manthrakodi (the blessed bridal sari given by the groom's family). For bridal attire and custom jewellery, explore our verified bridal wear boutiques and jewellery stores.",
      groundedVendors: [],
      categoryUrl: "/bridal-wear",
      topic: "culture",
    };
  }

  if (lower.includes("nikah") || (lower.includes("muslim") && lower.includes("wedding"))) {
    return {
      reply: "Kerala Muslim weddings feature the sacred Nikah ceremony officiated by the Qazi with the Mahr, followed by celebratory Oppana folk dance, Mehendi night (Mailanchi Raavu), and a lavish Biryani and Thalassery cuisine banquet. Discover our verified catering and mehendi partners for authentic arrangements.",
      groundedVendors: [],
      categoryUrl: "/mehendi-artists",
      topic: "culture",
    };
  }

  if (lower.includes("hindu") && (lower.includes("wedding") || lower.includes("ritual") || lower.includes("tradition"))) {
    return {
      reply: "Kerala Hindu weddings are solemn, elegant ceremonies typically held during an auspicious morning Muhurtham. Key rituals include Kanyadaanam, Thali Kettu (Mangalsutra), and Pudava Koda (gifting of the auspicious Kasavu saree), concluded with a grand Sadya feast. Explore our banquet halls, grand lawns, and Kerala traditional caterers.",
      groundedVendors: [],
      categoryUrl: "/venues",
      topic: "culture",
    };
  }

  // 3. Real Vendor Discovery: Intent Parsing & Live API Fetch
  const { category, city } = extractCategoryAndCity(query);

  if (category || city || lower.includes("find") || lower.includes("search") || lower.includes("recommend") || lower.includes("vendor")) {
    const params = new URLSearchParams();
    if (category) params.set("category", category.slug);
    if (city) params.set("city", city);
    params.set("limit", "12");

    try {
      const res = await fetch(`/api/v1/public/vendors?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const rawItems = Array.isArray(json.data) ? json.data : [];

        const groundedVendors: AuraVendorItem[] = rawItems.map((v: any) => {
          const catSlug = v.categorySlug || "vendors";
          let detailUrl = `/boutiques/${v.slug || v.vendorCode || v.id}`;
          if (catSlug.includes("venue")) detailUrl = `/venues/${v.id}`;
          else if (catSlug.includes("photo")) detailUrl = `/photographers/${v.id}`;
          else if (catSlug.includes("makeup")) detailUrl = `/makeup-artists/${v.id}`;
          else if (catSlug.includes("cater")) detailUrl = `/catering/${v.id}`;
          else if (catSlug.includes("bridal")) detailUrl = `/bridal-wear/${v.id}`;
          else if (catSlug.includes("groom")) detailUrl = `/groom-wear/${v.id}`;
          else if (catSlug.includes("jewel")) detailUrl = `/jewellery/${v.id}`;
          else if (catSlug.includes("mehendi")) detailUrl = `/mehendi-artists/${v.id}`;
          else if (catSlug.includes("invite")) detailUrl = `/invitations/${v.id}`;

          return {
            id: v.id,
            name: v.name || "Vendor Partner",
            category: v.category || "Wedding Vendor",
            categorySlug: catSlug,
            city: v.city || "Kerala",
            state: v.state || "India",
            rating: Number(v.rating ?? 0),
            reviewCount: Number(v.reviewCount ?? 0),
            startingPrice: v.startingPrice || "Contact for pricing",
            logo: v.logo || v.logoUrl || "",
            coverImage: v.coverImage || "",
            isVerified: Boolean(v.isVerified),
            slug: v.slug || v.id,
            detailUrl,
          };
        });

        if (groundedVendors.length > 0) {
          const categoryName = category?.name || "wedding vendor";
          const locationName = city ? ` in ${city}` : "";
          return {
            reply: `Here are ${groundedVendors.length} verified ${categoryName}${locationName} registered on Cloche:`,
            groundedVendors,
            categoryUrl: category?.url || "/vendors",
            topic: "vendors",
          };
        } else {
          // Strict honest fallback: 0 vendors found in DB
          const categoryName = category?.name || "vendors";
          const locationName = city ? ` in ${city}` : "";
          return {
            reply: `I searched our live vendor database for ${categoryName}${locationName}, but there are currently no registered vendors matching those exact criteria. You can browse all available ${categoryName} across Kerala or explore our directory.`,
            groundedVendors: [],
            categoryUrl: category?.url || "/vendors",
            topic: "vendors",
          };
        }
      }
    } catch (err) {
      console.error("[AuraEngine] Live API fetch error:", err);
    }
  }

  // 4. Default Aura Greeting & Discovery Assistance
  return {
    reply: "Hi, I'm Aura, your Cloche AI Wedding Assistant. How can I help you today? You can ask me to find verified wedding venues, photographers, bridal makeup artists, caterers, or jewellery stores across Kerala, or ask for traditional Kerala wedding planning guidance!",
    groundedVendors: [],
    topic: "general",
  };
}

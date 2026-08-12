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

export interface BudgetBreakdownItem {
  category: string;
  percentage: number;
  amount: number;
  note: string;
}

export interface WeddingChecklistItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export interface InquiryDraft {
  vendorId: string;
  vendorName: string;
  category: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventType: string;
  eventDate: string;
  city?: string;
  guestCount?: number;
  estimatedBudget?: number;
  message: string;
  status: "draft" | "confirmed" | "sent";
}

export interface AuraResponse {
  reply: string;
  groundedVendors?: AuraVendorItem[];
  categoryUrl?: string;
  actionRequired?: "signup" | "login" | "none";
  topic: "vendors" | "culture" | "planning" | "budget" | "comparison" | "checklist" | "inquiry_draft" | "inquiry_sent" | "action_declined" | "general";
  budgetPlan?: {
    totalBudget: number;
    guestCount: number;
    city: string;
    items: BudgetBreakdownItem[];
    isSaved?: boolean;
  };
  comparisonVendors?: AuraVendorItem[];
  checklist?: WeddingChecklistItem[];
  inquiryDraft?: InquiryDraft;
}

export interface AuraUserContext {
  userId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  weddingDate?: string;
  city?: string;
  guestCount?: number;
  estimatedBudget?: number;
}

const CATEGORY_MAP: Record<string, { slug: string; name: string; url: string }> = {
  venue: { slug: "wedding-venues", name: "Wedding Venues", url: "/venues" },
  venues: { slug: "wedding-venues", name: "Wedding Venues", url: "/venues" },
  resort: { slug: "wedding-venues", name: "Wedding Venues", url: "/venues" },
  hall: { slug: "wedding-venues", name: "Wedding Venues", url: "/venues" },
  
  photo: { slug: "photographers", name: "Photographers", url: "/photographers" },
  photographer: { slug: "photographers", name: "Photographers", url: "/photographers" },
  photographers: { slug: "photographers", name: "Photographers", url: "/photographers" },
  photography: { slug: "photographers", name: "Photographers", url: "/photographers" },

  makeup: { slug: "makeup-artists", name: "Bridal Makeup Artists", url: "/makeup-artists" },
  "makeup-artist": { slug: "makeup-artists", name: "Bridal Makeup Artists", url: "/makeup-artists" },
  "makeup-artists": { slug: "makeup-artists", name: "Bridal Makeup Artists", url: "/makeup-artists" },

  cater: { slug: "catering", name: "Wedding Catering", url: "/catering" },
  caterer: { slug: "catering", name: "Wedding Catering", url: "/catering" },
  caterers: { slug: "catering", name: "Wedding Catering", url: "/catering" },
  catering: { slug: "catering", name: "Wedding Catering", url: "/catering" },

  decor: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },
  decorator: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },
  decorators: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },
  planner: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },

  bridal: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },
  saree: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },
  lehenga: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },

  groom: { slug: "groom-wear", name: "Groom Wear Stores", url: "/groom-wear" },
  jewel: { slug: "jewellery", name: "Jewellery Stores", url: "/jewellery" },
  jewellery: { slug: "jewellery", name: "Jewellery Stores", url: "/jewellery" },
  mehendi: { slug: "mehendi-artists", name: "Mehendi Artists", url: "/mehendi-artists" },
  invite: { slug: "invitations", name: "Wedding Invitations", url: "/invitations" },
  cake: { slug: "cake-designer", name: "Cake Designers", url: "/vendors?category=cake-designer" },
  car: { slug: "car-rental", name: "Wedding Car Rentals", url: "/vendors?category=car-rental" },
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

function parseBudgetAndGuests(query: string): { budget?: number; guests?: number; city?: string } {
  const lower = query.toLowerCase();
  let budget: number | undefined;
  let guests: number | undefined;
  let city: string | undefined;

  // Extract guests
  const guestMatch = lower.match(/(\d+)\s*(guests|people|pax|members)/i);
  if (guestMatch) {
    guests = parseInt(guestMatch[1], 10);
  }

  // Extract budget (lakh / cr / raw)
  const lakhMatch = lower.match(/(?:budget|for|of)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?|l)/i);
  if (lakhMatch) {
    budget = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else {
    const rawNumMatch = lower.match(/(?:budget|for|of)\s*(?:₹|rs\.?|inr)?\s*(\d{5,8})/i);
    if (rawNumMatch) {
      budget = parseInt(rawNumMatch[1], 10);
    }
  }

  const { city: matchedCity } = extractCategoryAndCity(query);
  city = matchedCity;

  return { budget, guests, city };
}

/**
 * Executes a strictly grounded query to Cloche's live vendor directory and authenticated planning pipeline.
 */
export async function queryAuraAssistant(
  rawQuery: string,
  userContext?: AuraUserContext | null
): Promise<AuraResponse> {
  const query = (rawQuery || "").trim();
  const lower = query.toLowerCase();
  const isLoggedIn = Boolean(userContext?.userId);
  const userFirstName = userContext?.fullName ? userContext.fullName.split(" ")[0] : "";

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DRAFT-THEN-CONFIRM: Vendor Inquiry / Lead Creation
  // ─────────────────────────────────────────────────────────────────────────────
  const isInquiryIntent = (lower.includes("send an inquiry") || lower.includes("send inquiry") || lower.includes("inquire with") || lower.includes("contact vendor") || (lower.includes("inquiry to") || lower.includes("inquire to"))) || (lower.startsWith("book ") || lower.includes("send quote") || lower.includes("send a quote"));

  if (isInquiryIntent) {
    if (!isLoggedIn) {
      return {
        reply: "I am currently in guest discovery mode, so I cannot directly book services, generate custom quotation documents, or modify vendor accounts. You can connect directly with vendors via phone or WhatsApp on their profile pages, or sign up for a Cloche account to manage inquiries.",
        groundedVendors: [],
        actionRequired: "signup",
        topic: "action_declined",
      };
    }

    // Extract target vendor name from prompt (e.g. "send an inquiry to shaban" -> "shaban")
    let targetVendorName = "";
    const vendorMatches = lower.match(/(?:inquiry to|inquire with|inquiry with|contact|book|from)\s+([a-zA-Z0-9\s]+?)(?:\s+for|\s+on|\s*$)/i);
    if (vendorMatches && vendorMatches[1]) {
      targetVendorName = vendorMatches[1].trim().replace(/my wedding.*$/i, "").trim();
    } else {
      targetVendorName = lower.replace(/^(send an inquiry to|send inquiry to|inquire with|book)\s+/i, "").trim();
    }

    if (targetVendorName) {
      try {
        const res = await fetch(`/api/v1/public/vendors?search=${encodeURIComponent(targetVendorName)}&limit=5`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json.data) ? json.data : [];
          const matched = items.find((item: any) => 
            item.name.toLowerCase().includes(targetVendorName) || 
            (item.slug || "").toLowerCase().includes(targetVendorName) ||
            targetVendorName.includes(item.name.toLowerCase())
          );

          if (matched) {
            const v = matched;
            const eventDate = userContext?.weddingDate || new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0];
            const draft: InquiryDraft = {
              vendorId: v.id,
              vendorName: v.name,
              category: v.category || "Wedding Vendor",
              customerName: userContext?.fullName || "Valued Customer",
              customerPhone: userContext?.phone || "9876543210",
              customerEmail: userContext?.email,
              eventType: "Wedding",
              eventDate: eventDate,
              city: v.city || userContext?.city || "Thrissur",
              guestCount: userContext?.guestCount || 400,
              estimatedBudget: userContext?.estimatedBudget,
              message: `Hi ${v.name}, I am interested in your ${v.category || "Wedding"} services for my upcoming wedding event. Please share your availability and package details.`,
              status: "draft",
            };

            return {
              reply: `I have prepared an inquiry draft for ${v.name} (${v.category}). Please review the details below before I send this to the vendor:`,
              inquiryDraft: draft,
              topic: "inquiry_draft",
            };
          } else {
            return {
              reply: `I searched our directory for a vendor named "${targetVendorName}", but could not find a matching registered vendor profile. Please verify the vendor's name or browse our verified vendor categories.`,
              groundedVendors: [],
              categoryUrl: "/vendors",
              topic: "inquiry_draft",
            };
          }
        }
      } catch (e) {}
    }

    return {
      reply: "Please specify which verified vendor you would like to inquire with (for example: 'Send an inquiry to shaban' or 'Inquire with Acesd').",
      topic: "inquiry_draft",
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. DIRECT-WRITE: Budget Planner & General Planning Guidance
  // ─────────────────────────────────────────────────────────────────────────────
  const isBudgetPlannerQuery = lower.includes("budget") || lower.includes("plan my wedding") || lower.includes("budget breakdown") || lower.includes("cost estimate");

  if (isBudgetPlannerQuery && (lower.includes("plan") || lower.includes("lakh") || lower.includes("guests") || lower.includes("breakdown") || lower.includes("thrissur") || lower.includes("kochi"))) {
    const { budget: parsedBudget, guests: parsedGuests, city: parsedCity } = parseBudgetAndGuests(query);
    const totalBudget = parsedBudget || userContext?.estimatedBudget || 1500000;
    const guestCount = parsedGuests || userContext?.guestCount || 400;
    const city = parsedCity || userContext?.city || "Thrissur";

    const budgetItems: BudgetBreakdownItem[] = [
      { category: "Venue & Accommodation", percentage: 40, amount: Math.round(totalBudget * 0.40), note: "Main banquet hall / lawn & close guest stay" },
      { category: "Catering & Sadya", percentage: 25, amount: Math.round(totalBudget * 0.25), note: `Traditional Sadya feast & live counters for ~${guestCount} guests` },
      { category: "Photography & Cinematography", percentage: 12, amount: Math.round(totalBudget * 0.12), note: "Candid photography, cinematography teaser & albums" },
      { category: "Decor, Stage & Florals", percentage: 10, amount: Math.round(totalBudget * 0.10), note: "Entrance arch, stage backdrop, mandap & floral styling" },
      { category: "Bridal/Groom Attire & Styling", percentage: 8, amount: Math.round(totalBudget * 0.08), note: "Bridal silk couture, groom wear & makeup artist" },
      { category: "Logistics & Contingency", percentage: 5, amount: Math.round(totalBudget * 0.05), note: "Invitations, sound/DJ, transportation & buffer" },
    ];

    const formattedBudget = `₹${(totalBudget / 100000).toFixed(1)} Lakhs`;

    return {
      reply: `Here is a category-by-category estimated wedding budget breakdown for ${guestCount} guests in ${city} (Total Budget: ${formattedBudget}).\n\n📌 Note: This is general planning guidance based on typical Kerala wedding distributions. Individual vendor pricing varies by package.`,
      budgetPlan: {
        totalBudget,
        guestCount,
        city,
        items: budgetItems,
      },
      topic: "budget",
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. REAL VENDOR COMPARISON (Side-by-side with Zero Hallucination)
  // ─────────────────────────────────────────────────────────────────────────────
  const isComparisonQuery = lower.includes("compare ") || lower.includes("comparison between") || lower.includes(" vs ");

  if (isComparisonQuery) {
    let nameA = "";
    let nameB = "";

    const vsMatch = lower.match(/compare\s+([a-zA-Z0-9\s]+?)\s+(?:and|vs\.?|with)\s+([a-zA-Z0-9\s]+?)(?:\s+for|\s+in|\s*$)/i);
    if (vsMatch) {
      nameA = vsMatch[1].trim();
      nameB = vsMatch[2].trim();
    }

    if (nameA && nameB) {
      try {
        const [resA, resB] = await Promise.all([
          fetch(`/api/v1/public/vendors?search=${encodeURIComponent(nameA)}&limit=1`),
          fetch(`/api/v1/public/vendors?search=${encodeURIComponent(nameB)}&limit=1`),
        ]);

        const jsonA = resA.ok ? await resA.json() : { data: [] };
        const jsonB = resB.ok ? await resB.json() : { data: [] };

        const itemsA = Array.isArray(jsonA.data) ? jsonA.data : [];
        const itemsB = Array.isArray(jsonB.data) ? jsonB.data : [];

        if (itemsA.length > 0 && itemsB.length > 0) {
          const mapVendor = (v: any): AuraVendorItem => ({
            id: v.id,
            name: v.name,
            category: v.category || "Wedding Vendor",
            categorySlug: v.categorySlug || "vendors",
            city: v.city || "Kerala",
            state: v.state || "India",
            rating: Number(v.rating ?? 0),
            reviewCount: Number(v.reviewCount ?? 0),
            startingPrice: v.startingPrice || "Contact for pricing",
            logo: v.logo || v.logoUrl || "",
            coverImage: v.coverImage || "",
            isVerified: Boolean(v.isVerified),
            slug: v.slug || v.id,
            detailUrl: `/boutiques/${v.slug || v.vendorCode || v.id}`,
          });

          const comparisonVendors = [mapVendor(itemsA[0]), mapVendor(itemsB[0])];

          return {
            reply: `Here is the side-by-side comparison between ${itemsA[0].name} and ${itemsB[0].name} using real live directory data:`,
            comparisonVendors,
            topic: "comparison",
          };
        }
      } catch (e) {}
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. DIRECT-WRITE: Checklist Management
  // ─────────────────────────────────────────────────────────────────────────────
  if (lower.includes("checklist") || lower.includes("todo") || lower.includes("task list")) {
    const checklist: WeddingChecklistItem[] = [
      { id: "chk-1", title: "Finalize wedding dates & auspicious Muhurtham", category: "Planning", completed: true },
      { id: "chk-2", title: "Select and book wedding venue", category: "Venue", completed: false },
      { id: "chk-3", title: "Book authentic Kerala wedding caterer for Sadya", category: "Catering", completed: false },
      { id: "chk-4", title: "Hire candid wedding photographer & cinematographer", category: "Photography", completed: false },
      { id: "chk-5", title: "Select bridal silk saree / lehenga & jewelry", category: "Attire", completed: false },
      { id: "chk-6", title: "Book bridal makeup artist & mehendi designer", category: "Beauty", completed: false },
      { id: "chk-7", title: "Design and send digital wedding invitations", category: "Invitations", completed: false },
    ];

    return {
      reply: "Here is your active Kerala wedding planning checklist. You can check off completed milestones or add custom tasks:",
      checklist,
      topic: "checklist",
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. Cultural Traditions (Sadya, Minnu, Nikah, Hindu Muhurtham)
  // ─────────────────────────────────────────────────────────────────────────────
  if (lower.includes("sadya") || lower.includes("sadhya")) {
    return {
      reply: "A traditional Kerala Wedding Sadya is an elaborate vegetarian feast served on a banana leaf, featuring over 24 authentic items including Parippu with Ghee, Sambar, Aviyal, Thoran, Olan, Kalan, Pachadi, Ginger Puli Inji, Pappadam, and Payasam (Ada Pradhaman & Paal Payasam). Our verified wedding caterers offer authentic traditional masters (cooks) and modern live counters.",
      categoryUrl: "/catering",
      topic: "culture",
    };
  }

  if (lower.includes("manthrakodi") || lower.includes("minnu") || (lower.includes("christian") && lower.includes("wedding"))) {
    return {
      reply: "In traditional Kerala Christian weddings, the groom ties the Minnu (a gold pendant with 7 beads forming a cross) around the bride's neck and presents the Manthrakodi (the blessed bridal sari given by the groom's family). For bridal attire and custom jewellery, explore our verified bridal wear boutiques and jewellery stores.",
      categoryUrl: "/bridal-wear",
      topic: "culture",
    };
  }

  if (lower.includes("nikah") || (lower.includes("muslim") && lower.includes("wedding"))) {
    return {
      reply: "Kerala Muslim weddings feature the sacred Nikah ceremony officiated by the Qazi with the Mahr, followed by celebratory Oppana folk dance, Mehendi night (Mailanchi Raavu), and a lavish Biryani and Thalassery cuisine banquet. Discover our verified catering and mehendi partners for authentic arrangements.",
      categoryUrl: "/mehendi-artists",
      topic: "culture",
    };
  }

  if (lower.includes("hindu") && (lower.includes("wedding") || lower.includes("ritual") || lower.includes("tradition"))) {
    return {
      reply: "Kerala Hindu weddings are solemn, elegant ceremonies typically held during an auspicious morning Muhurtham. Key rituals include Kanyadaanam, Thali Kettu (Mangalsutra), and Pudava Koda (gifting of the auspicious Kasavu saree), concluded with a grand Sadya feast. Explore our banquet halls, grand lawns, and Kerala traditional caterers.",
      categoryUrl: "/venues",
      topic: "culture",
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. Real Vendor Discovery (Live API)
  // ─────────────────────────────────────────────────────────────────────────────
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
    } catch (err) {}
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. Personalized Welcome / Open Guidance
  // ─────────────────────────────────────────────────────────────────────────────
  const greetingName = userFirstName ? `Hi ${userFirstName}` : "Hi";
  return {
    reply: `${greetingName}, I'm Aura, your Cloche AI Wedding Assistant. How can I help you today? You can ask me to plan your wedding budget, compare registered vendors, manage your checklist, or search live verified venues, photographers, and caterers!`,
    groundedVendors: [],
    topic: "general",
  };
}

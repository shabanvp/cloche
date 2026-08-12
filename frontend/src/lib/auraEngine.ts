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

export interface PackageDraft {
  vendorId: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  status: "draft";
}

export interface ProfileDraft {
  vendorId: string;
  businessName: string;
  currentAbout: string;
  proposedAbout: string;
  currentTagline?: string;
  proposedTagline?: string;
  status: "draft";
}

export interface ReviewResponseDraft {
  reviewId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  proposedReply: string;
  status: "draft";
}

export interface LeadsSummaryData {
  totalCount: number;
  newCount: number;
  recentLeads: Array<{
    id: string;
    customerName: string;
    eventType: string;
    eventDate: string;
    city: string;
    estimatedBudget?: number;
    status: string;
  }>;
}

export interface AuraResponse {
  reply: string;
  groundedVendors?: AuraVendorItem[];
  categoryUrl?: string;
  actionRequired?: "signup" | "login" | "none";
  topic: 
    | "vendors" 
    | "culture" 
    | "planning" 
    | "budget" 
    | "comparison" 
    | "checklist" 
    | "inquiry_draft" 
    | "inquiry_sent" 
    | "action_declined" 
    | "vendor_package_draft" 
    | "vendor_profile_draft" 
    | "vendor_pricing_advice" 
    | "vendor_review_reply_draft" 
    | "vendor_leads_summary" 
    | "vendor_growth_advice" 
    | "general";
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
  packageDraft?: PackageDraft;
  profileDraft?: ProfileDraft;
  reviewDraft?: ReviewResponseDraft;
  leadsSummary?: LeadsSummaryData;
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

export interface AuraVendorContext {
  vendorId: string;
  businessName: string;
  category: string;
  categorySlug?: string;
  city: string;
  state: string;
  about?: string;
  tagline?: string;
  rating: number;
  reviewCount: number;
  startingPrice?: string;
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
  planners: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },

  bridal: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },
  boutique: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },
  boutiques: { slug: "bridal-wear", name: "Bridal Boutiques & Wear", url: "/bridal-wear" },

  groom: { slug: "groom-wear", name: "Groom Wear", url: "/groom-wear" },

  mehendi: { slug: "mehendi", name: "Mehendi Artists", url: "/mehendi-artists" },
  mehndi: { slug: "mehendi", name: "Mehendi Artists", url: "/mehendi-artists" },
  henna: { slug: "mehendi", name: "Mehendi Artists", url: "/mehendi-artists" },

  invitation: { slug: "invitations", name: "Invitations & Stationery", url: "/invitations" },
  invitations: { slug: "invitations", name: "Invitations & Stationery", url: "/invitations" },
  invite: { slug: "invitations", name: "Invitations & Stationery", url: "/invitations" },
  invites: { slug: "invitations", name: "Invitations & Stationery", url: "/invitations" },

  jewel: { slug: "jewellery", name: "Wedding Jewellery", url: "/jewellery" },
  jewellery: { slug: "jewellery", name: "Wedding Jewellery", url: "/jewellery" },
  jewelry: { slug: "jewellery", name: "Wedding Jewellery", url: "/jewellery" },
};

const KERALA_CITIES = [
  "thrissur", "kochi", "cochin", "ernakulam", "trivandrum", 
  "thiruvananthapuram", "kozhikode", "calicut", "kottayam", 
  "alappuzha", "alleppey", "kollam", "palakkad", "malappuram", 
  "kannur", "wayanad", "kasaragod", "pathanamthitta", "idukki"
];

function extractCategoryAndCity(query: string): { category?: { slug: string; name: string; url: string }; city?: string } {
  const lower = query.toLowerCase();
  
  let matchedCategory: { slug: string; name: string; url: string } | undefined;
  for (const [kw, cat] of Object.entries(CATEGORY_MAP)) {
    const reg = new RegExp(`\\b${kw}\\b`, "i");
    if (reg.test(lower)) {
      matchedCategory = cat;
      break;
    }
  }

  let matchedCity: string | undefined;
  for (const c of KERALA_CITIES) {
    const reg = new RegExp(`\\b${c}\\b`, "i");
    if (reg.test(lower)) {
      matchedCity = c.charAt(0).toUpperCase() + c.slice(1);
      if (c === "ernakulam" || c === "cochin") matchedCity = "Kochi";
      if (c === "thiruvananthapuram") matchedCity = "Trivandrum";
      if (c === "calicut") matchedCity = "Kozhikode";
      if (c === "alleppey") matchedCity = "Alappuzha";
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

  const guestMatch = lower.match(/(\d+)\s*(guests|people|pax|members)/i);
  if (guestMatch) {
    guests = parseInt(guestMatch[1], 10);
  }

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
  userContext?: AuraUserContext | null,
  vendorContext?: AuraVendorContext | null
): Promise<AuraResponse> {
  const query = (rawQuery || "").trim();
  const lower = query.toLowerCase();
  const isLoggedInCustomer = Boolean(userContext?.userId);
  const isVendorUser = Boolean(vendorContext?.vendorId);

  // ─────────────────────────────────────────────────────────────────────────────
  // PHASE 3: VENDOR DASHBOARD BUSINESS ASSISTANT (STRICTLY GROUNDED & DRAFT-THEN-CONFIRM)
  // ─────────────────────────────────────────────────────────────────────────────
  if (isVendorUser && vendorContext) {
    const vName = vendorContext.businessName || "your business";
    const vCat = vendorContext.category || "Wedding Services";
    const vCity = vendorContext.city || "Kerala";

    // 1. Package Creation (Draft-then-Confirm)
    const isPackageCreateIntent = lower.includes("package") || lower.includes("create a package") || lower.includes("add package") || lower.includes("pricing package") || lower.includes("build package");
    if (isPackageCreateIntent) {
      let pkgName = `Premium ${vCat} Wedding Package`;
      let tagline = `Complete professional ${vCat.toLowerCase()} coverage for traditional & contemporary celebrations`;
      let price = 65000;
      let features = [
        `Full event day coverage by senior team`,
        `Dedicated consultations & customized theme alignment`,
        `High-resolution curated final deliverables`,
        `On-time setup & venue coordination`
      ];

      if (vCat.toLowerCase().includes("photo")) {
        pkgName = "Royal Cinematic & Traditional Photography";
        tagline = "Full day candid photography, cinematography & 4K highlight teaser";
        price = 85000;
        features = [
          "2 Senior Candid Photographers & 1 Traditional Videographer",
          "1 Drone Cinematographer (Venue & Muhurtham aerials)",
          "350+ Curated high-res color-graded photographs",
          "4K Cinematic Wedding Film (3-5 min teaser + full documentary)",
          "Premium Handcrafted 40-page Flush Mount Album"
        ];
      } else if (vCat.toLowerCase().includes("makeup")) {
        pkgName = "Signature Bridal HD & Airbrush Glow";
        tagline = "Flawless bridal makeup, hairstyling, saree draping & touch-ups";
        price = 25000;
        features = [
          "HD / Airbrush Waterproof Bridal Makeup",
          "Custom Traditional & Contemporary Bridal Hairstyling",
          "Intricate Silk Saree / Lehenga Draping",
          "Premium lashes, lenses & floral hair ornamentation",
          "Complimentary Pre-Wedding Skin Prep Consultation"
        ];
      } else if (vCat.toLowerCase().includes("mehendi") || vCat.toLowerCase().includes("henna")) {
        pkgName = "Royal Bridal Organic Rajasthani Henna";
        tagline = "Intricate custom bridal figures, portrait motifs & dark stain formulation";
        price = 15000;
        features = [
          "Elbow-length bridal arms with customized couple portraits",
          "Full bridal feet & leg intricate traditional motifs",
          "100% Organic Hand-Mixed Rajasthani Henna Paste",
          "Special essential oil deep stain care formula",
          "Guest party henna application for up to 5 immediate family members"
        ];
      } else if (vCat.toLowerCase().includes("decor")) {
        pkgName = "Royal Heritage Stage & Floral Mandap";
        tagline = "Bespoke stage styling, grand entrance arch & ambient venue illumination";
        price = 120000;
        features = [
          "Custom 30ft designer stage backdrop with imported fresh florals",
          "Traditional Jasmine & Lotus Mandap styling",
          "Grand welcome walkway arch with mood lighting",
          "VIP & dining seating floral centerpieces",
          "Complete on-site coordination & teardown"
        ];
      } else if (vCat.toLowerCase().includes("cater")) {
        pkgName = "Grand 28-Curry Kerala Sadya Feast";
        tagline = "Authentic banana leaf feast with double payasam & live service";
        price = 450; // per pax
        features = [
          "28-Dish Traditional Kerala Sadya on pure banana leaves",
          "Palada Pradhaman & Parippu Payasam with Boli",
          "Live hot appam & stew counter option",
          "Uniformed hospitality service team & water service",
          "Eco-friendly waste management & hygiene clearance"
        ];
      }

      const draft: PackageDraft = {
        vendorId: vendorContext.vendorId,
        name: pkgName,
        tagline: tagline,
        description: `Experience premier ${vCat.toLowerCase()} service tailored for Kerala weddings by ${vName}. Includes end-to-end management and quality assurance.`,
        price: price,
        features: features,
        isPopular: true,
        status: "draft"
      };

      const priceDisplay = price > 1000 ? `₹${price.toLocaleString("en-IN")}` : `₹${price} / pax`;

      return {
        reply: `I have prepared a package draft tailored for your ${vCat} storefront in ${vCity}. Review the proposed package details below and tap "Save Package" to add it to your catalog:`,
        packageDraft: draft,
        topic: "vendor_package_draft"
      };
    }

    // 2. Profile Description / SEO Text (Draft-then-Confirm with Before & After)
    const isProfileRewriteIntent = lower.includes("description") || lower.includes("rewrite") || lower.includes("seo") || lower.includes("about") || lower.includes("profile text") || lower.includes("improve bio");
    if (isProfileRewriteIntent) {
      const currentAbout = vendorContext.about || "No profile description currently provided.";
      const currentTagline = vendorContext.tagline || "";
      const proposedTagline = `Premier ${vCat} in ${vCity} • Creating unforgettable Kerala wedding celebrations`;
      const proposedAbout = `${vName} is one of ${vCity}'s most trusted ${vCat.toLowerCase()} specialists, dedicated to bringing dream Kerala weddings to life. With unmatched attention to detail, traditional authenticity, and modern aesthetic elegance, we deliver personalized experiences tailored to your family's unique vision. From auspicious Muhurtham moments to grand wedding receptions across ${vCity} and Kerala, our experienced team ensures flawless execution, premium quality, and timeless memories.`;

      const draft: ProfileDraft = {
        vendorId: vendorContext.vendorId,
        businessName: vName,
        currentAbout: currentAbout,
        proposedAbout: proposedAbout,
        currentTagline: currentTagline,
        proposedTagline: proposedTagline,
        status: "draft"
      };

      return {
        reply: `I've crafted an SEO-optimized storefront description for ${vName} highlighting your ${vCat} services in ${vCity}. Here is a before → after comparison. Please review and tap "Approve & Update Storefront" to save:`,
        profileDraft: draft,
        topic: "vendor_profile_draft"
      };
    }

    // 3. Pricing Suggestions (Regional Benchmarks)
    const isPricingAdviceIntent = lower.includes("pricing") || lower.includes("charge") || lower.includes("how much") || lower.includes("rate") || lower.includes("cost") || lower.includes("market price");
    if (isPricingAdviceIntent) {
      let adviceText = `Here are general market planning benchmarks for ${vCat} in ${vCity} based on typical Kerala wedding scales:\n\n`;
      if (vCat.toLowerCase().includes("photo")) {
        adviceText += `• Essential Traditional Coverage: ₹45,000 – ₹65,000\n• Signature Candid & Cinematography: ₹75,000 – ₹1,20,000\n• Luxury Multi-Day Heritage Package: ₹1,50,000 – ₹2,80,000\n\n`;
      } else if (vCat.toLowerCase().includes("makeup")) {
        adviceText += `• HD Bridal Package: ₹15,000 – ₹22,000\n• Airbrush Luxury Bridal: ₹25,000 – ₹35,000\n• Multi-Event Package (Engagement + Muhurtham): ₹35,000 – ₹55,000\n\n`;
      } else if (vCat.toLowerCase().includes("mehendi") || vCat.toLowerCase().includes("henna")) {
        adviceText += `• Per-Hand Traditional Rate: ₹500 – ₹1,200 per hand\n• Complete Bridal Henna (Elbows & Feet): ₹10,000 – ₹22,000\n• Sangeet / Guest Party Hourly Rate: ₹2,500 – ₹4,500 / hour\n\n`;
      } else if (vCat.toLowerCase().includes("decor")) {
        adviceText += `• Intimate Mandap & Stage Styling: ₹50,000 – ₹90,000\n• Premium Floral Stage & Grand Arch: ₹1,10,000 – ₹2,50,000\n• Full Venue Thematic Transformation: ₹3,00,000 – ₹7,00,000\n\n`;
      } else if (vCat.toLowerCase().includes("cater")) {
        adviceText += `• Standard Kerala Banana Leaf Sadya: ₹300 – ₹450 / pax\n• Grand 28-Curry Royal Sadya with Live Counters: ₹500 – ₹750 / pax\n• Multi-Cuisine Reception Buffet: ₹650 – ₹1,100 / pax\n\n`;
      } else {
        adviceText += `• Standard Service Package: ₹30,000 – ₹60,000\n• Premium Bespoke Package: ₹70,000 – ₹1,50,000\n\n`;
      }

      adviceText += `*Note: These benchmarks are general regional market suggestions for ${vCity}. Your final rates should reflect team overhead, exclusive gear, travel, and custom client requests. Would you like me to draft a new package with one of these price tiers?*`;

      return {
        reply: adviceText,
        topic: "vendor_pricing_advice"
      };
    }

    // 4. Review Response Drafting (Grounded on Real Database Reviews)
    const isReviewReplyIntent = lower.includes("review") || lower.includes("feedback") || lower.includes("rating") || lower.includes("respond to review");
    if (isReviewReplyIntent) {
      try {
        const revRes = await fetch(`/api/v1/customer/reviews?vendor_id=${encodeURIComponent(vendorContext.vendorId)}`).catch(() => null);
        let realReviews: any[] = [];
        if (revRes && revRes.ok) {
          const revJson = await revRes.json();
          realReviews = Array.isArray(revJson.data) ? revJson.data : [];
        }

        if (realReviews.length === 0) {
          const currentRating = vendorContext.rating > 0 ? `★ ${vendorContext.rating.toFixed(1)}` : "0 (New)";
          return {
            reply: `You currently have ${vendorContext.reviewCount} reviews (${currentRating} rating) on your storefront. Once couples leave reviews for your completed weddings, I will help you craft heartfelt, professional responses here.`,
            topic: "vendor_review_reply_draft"
          };
        }

        const targetReview = realReviews[0];
        const custName = targetReview.customer_name || targetReview.user_name || "the couple";
        const revText = targetReview.review_text || targetReview.review || targetReview.comment || "Great service!";
        const replyText = `Thank you so much, ${custName}! It was an absolute pleasure and honor for the ${vName} team to be part of your special wedding celebration. We wish you both a lifetime of happiness, love, and joy!`;

        const draft: ReviewResponseDraft = {
          reviewId: targetReview.id,
          customerName: custName,
          rating: targetReview.rating || 5,
          reviewText: revText,
          proposedReply: replyText,
          status: "draft"
        };

        return {
          reply: `I found a real review from ${custName} on your profile. Here is the exact review and a proposed draft response for your approval before posting:`,
          reviewDraft: draft,
          topic: "vendor_review_reply_draft"
        };
      } catch (e) {
        return {
          reply: `You currently have ${vendorContext.reviewCount} reviews on your storefront. No pending unreplied reviews were found.`,
          topic: "vendor_review_reply_draft"
        };
      }
    }

    // 5. Enquiry / Leads Summarization (Read-Only)
    const isLeadsSummaryIntent = lower.includes("enquir") || lower.includes("lead") || lower.includes("inquiries") || lower.includes("leads this week") || lower.includes("my bookings");
    if (isLeadsSummaryIntent) {
      try {
        const leadRes = await fetch("/api/v1/vendor/leads").catch(() => null);
        let leads: any[] = [];
        if (leadRes && leadRes.ok) {
          const leadJson = await leadRes.json();
          leads = Array.isArray(leadJson.data) ? leadJson.data : [];
        }

        const totalLeads = leads.length;
        const newLeads = leads.filter((l: any) => l.status === "new" || l.status === "pending").length;
        const mappedRecent = leads.slice(0, 5).map((l: any) => ({
          id: l.id,
          customerName: l.customer_name || "Valued Client",
          eventType: l.event_type || "Wedding",
          eventDate: l.event_date || "Date TBA",
          city: l.city || vCity,
          estimatedBudget: l.estimated_budget,
          status: l.status || "new"
        }));

        let summaryReply = `Here is the current real-time summary of enquiries for ${vName}:\n\n`;
        summaryReply += `• Total Enquiries: **${totalLeads}**\n`;
        summaryReply += `• Awaiting Follow-up / New: **${newLeads}**\n\n`;

        if (totalLeads === 0) {
          summaryReply += `You do not have any new enquiries at the moment. As couples browse ${vCat} in ${vCity}, new requests will appear instantly here and in your Enquiries tab.`;
        } else {
          summaryReply += `Recent Inquiries:\n`;
          mappedRecent.forEach((r: any, idx: number) => {
            const bDisplay = r.estimatedBudget ? ` • Budget: ₹${(r.estimatedBudget / 100000).toFixed(1)}L` : "";
            summaryReply += `${idx + 1}. **${r.customerName}** — ${r.eventType} in ${r.city} on ${r.eventDate}${bDisplay} (*${r.status}*)\n`;
          });
          summaryReply += `\n*You can view full customer contact numbers and chat notes directly in your Enquiries tab.*`;
        }

        return {
          reply: summaryReply,
          leadsSummary: {
            totalCount: totalLeads,
            newCount: newLeads,
            recentLeads: mappedRecent
          },
          topic: "vendor_leads_summary"
        };
      } catch (e) {
        return {
          reply: `Could not fetch your latest enquiries from the database right now. Please open your Enquiries dashboard tab directly.`,
          topic: "vendor_leads_summary"
        };
      }
    }

    // 6. Growth & Conversion Guidance (Read-Only)
    const isGrowthAdviceIntent = lower.includes("booking") || lower.includes("grow") || lower.includes("more clients") || lower.includes("conversion") || lower.includes("tips") || lower.includes("advice");
    if (isGrowthAdviceIntent) {
      return {
        reply: `Here are 4 proven ways to maximize your wedding booking conversions on Cloche:\n\n` +
          `1. **Showcase 6+ High-Resolution Photos**: Couples look for authentic Muhurtham, stage, and candid shots in your portfolio gallery.\n` +
          `2. **Publish Tiered Packages**: Providing transparent starting rates and clear feature lists reduces initial hesitation and brings higher-intent couples.\n` +
          `3. **Fast Lead Response**: Couples on Cloche typically contact 2-3 vendors simultaneously. Responding within 2 hours increases conversion by over 40%.\n` +
          `4. **Gather Verified Reviews**: After each wedding, ask the couple to leave a review on Cloche to build public trust.\n\n` +
          `Would you like me to help you draft a new package or refine your storefront description?`,
        topic: "vendor_growth_advice"
      };
    }

    // Default Vendor Welcome Response
    return {
      reply: `Hi ${vName}, I'm Aura — your Cloche Vendor Business Assistant. I can help you draft new packages, refine your SEO storefront description, analyze your live enquiries, and check regional pricing benchmarks. What would you like to work on?`,
      topic: "general"
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. DRAFT-THEN-CONFIRM: Vendor Inquiry / Lead Creation (Customer Flow)
  // ─────────────────────────────────────────────────────────────────────────────
  const isInquiryIntent = (lower.includes("send an inquiry") || lower.includes("send inquiry") || lower.includes("inquire with") || lower.includes("contact vendor") || (lower.includes("inquiry to") || lower.includes("inquire to"))) || (lower.startsWith("book ") || lower.includes("send quote") || lower.includes("send a quote"));

  if (isInquiryIntent) {
    if (!isLoggedInCustomer) {
      return {
        reply: "I am currently in guest discovery mode, so I cannot directly book services, generate custom quotation documents, or modify vendor accounts. You can connect directly with vendors via phone or WhatsApp on their profile pages, or sign up for a Cloche account to manage inquiries.",
        groundedVendors: [],
        actionRequired: "signup",
        topic: "action_declined",
      };
    }

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
  // 2. DIRECT-WRITE: Budget Planner & General Planning Guidance (Customer Flow)
  // ─────────────────────────────────────────────────────────────────────────────
  const isBudgetPlannerQuery = lower.includes("budget") || lower.includes("plan my wedding") || lower.includes("budget breakdown") || lower.includes("cost estimate");

  if (isBudgetPlannerQuery) {
    const { budget, guests, city } = parseBudgetAndGuests(query);
    const totalBudget = budget || userContext?.estimatedBudget || 1500000;
    const totalGuests = guests || userContext?.guestCount || 400;
    const targetCity = city || userContext?.city || "Thrissur";

    const breakdownItems: BudgetBreakdownItem[] = [
      {
        category: "Venue & Accommodation",
        percentage: 40,
        amount: Math.round(totalBudget * 0.40),
        note: `Main banquet hall / auditorium & stay for outstation guests in ${targetCity}`,
      },
      {
        category: "Catering & Sadya",
        percentage: 25,
        amount: Math.round(totalBudget * 0.25),
        note: `Authentic banana leaf Sadya & reception catering for ~${totalGuests} guests`,
      },
      {
        category: "Photography & Cinematography",
        percentage: 12,
        amount: Math.round(totalBudget * 0.12),
        note: "Candid photography, traditional video coverage & cinematic teaser film",
      },
      {
        category: "Decor, Stage & Florals",
        percentage: 10,
        amount: Math.round(totalBudget * 0.10),
        note: "Entrance arch, stage backdrop, mandap styling & fresh floral work",
      },
      {
        category: "Bridal Attire, Makeup & Styling",
        percentage: 8,
        amount: Math.round(totalBudget * 0.08),
        note: "Kanchipuram silk sarees / lehenga, groom wear & certified bridal MUA",
      },
      {
        category: "Logistics, Invitations & Contingency",
        percentage: 5,
        amount: Math.round(totalBudget * 0.05),
        note: "Digital invites, transport, Chenda Melam / audio setup & contingency buffer",
      },
    ];

    const budgetLakhs = (totalBudget / 100000).toFixed(1);
    const replyText = `Here is an estimated wedding budget plan for **${totalGuests} guests** in **${targetCity}** with an overall budget of **₹${budgetLakhs} Lakhs**.\n\n*Please note: This breakdown is general planning guidance based on typical Kerala wedding distributions and is distinct from vendor quotes.*`;

    return {
      reply: replyText,
      budgetPlan: {
        totalBudget,
        guestCount: totalGuests,
        city: targetCity,
        items: breakdownItems,
        isSaved: false,
      },
      topic: "budget",
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. VENDOR COMPARISON: Strictly Grounded Live Comparison
  // ─────────────────────────────────────────────────────────────────────────────
  const isComparisonQuery = lower.includes("compare ") || (lower.includes(" vs ") && !lower.includes("http"));

  if (isComparisonQuery) {
    let vendorAName = "";
    let vendorBName = "";

    const vsMatch = lower.match(/(?:compare\s+)?([a-zA-Z0-9\s]+?)\s+(?:and|vs|versus)\s+([a-zA-Z0-9\s]+?)(?:\s+for|\s+in|\s*$)/i);
    if (vsMatch) {
      vendorAName = vsMatch[1].replace(/^compare\s+/i, "").trim();
      vendorBName = vsMatch[2].replace(/for.*$/i, "").trim();
    }

    if (vendorAName && vendorBName) {
      try {
        const [resA, resB] = await Promise.all([
          fetch(`/api/v1/public/vendors?search=${encodeURIComponent(vendorAName)}&limit=1`),
          fetch(`/api/v1/public/vendors?search=${encodeURIComponent(vendorBName)}&limit=1`),
        ]);

        if (resA.ok && resB.ok) {
          const [jsonA, jsonB] = await Promise.all([resA.json(), resB.json()]);
          const itemsA = Array.isArray(jsonA.data) ? jsonA.data : [];
          const itemsB = Array.isArray(jsonB.data) ? jsonB.data : [];

          if (itemsA.length > 0 && itemsB.length > 0) {
            const vA = itemsA[0];
            const vB = itemsB[0];

            const comparisonVendors: AuraVendorItem[] = [
              {
                id: vA.id,
                name: vA.name,
                category: vA.category || "Vendor",
                categorySlug: vA.categorySlug || "vendors",
                city: vA.city || "Kerala",
                state: vA.state || "Kerala",
                rating: Number(vA.rating || 0),
                reviewCount: Number(vA.reviewCount || 0),
                startingPrice: vA.startingPrice || "Contact for pricing",
                logo: vA.logo || "",
                coverImage: vA.coverImage || "",
                isVerified: Boolean(vA.isVerified),
                slug: vA.slug || "",
                detailUrl: `/boutiques/${vA.slug}`,
              },
              {
                id: vB.id,
                name: vB.name,
                category: vB.category || "Vendor",
                categorySlug: vB.categorySlug || "vendors",
                city: vB.city || "Kerala",
                state: vB.state || "Kerala",
                rating: Number(vB.rating || 0),
                reviewCount: Number(vB.reviewCount || 0),
                startingPrice: vB.startingPrice || "Contact for pricing",
                logo: vB.logo || "",
                coverImage: vB.coverImage || "",
                isVerified: Boolean(vB.isVerified),
                slug: vB.slug || "",
                detailUrl: `/boutiques/${vB.slug}`,
              },
            ];

            const ratingA = vA.rating > 0 ? `★ ${vA.rating.toFixed(1)} (${vA.reviewCount} reviews)` : "New (0 reviews)";
            const ratingB = vB.rating > 0 ? `★ ${vB.rating.toFixed(1)} (${vB.reviewCount} reviews)` : "New (0 reviews)";

            const summaryText = `Here is a side-by-side comparison of **${vA.name}** and **${vB.name}** based on their verified profiles:\n\n` +
              `• **${vA.name}** (${vA.category}): Located in ${vA.city}, Rating: ${ratingA}, Starting Price: ${vA.startingPrice || "Contact for pricing"}\n` +
              `• **${vB.name}** (${vB.category}): Located in ${vB.city}, Rating: ${ratingB}, Starting Price: ${vB.startingPrice || "Contact for pricing"}\n\n` +
              `Both vendors are registered on Cloche. Tap below to inspect their full portfolios and services.`;

            return {
              reply: summaryText,
              comparisonVendors,
              topic: "comparison",
            };
          }
        }
      } catch (e) {}
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. CHECKLIST MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  const isChecklistQuery = lower.includes("checklist") || lower.includes("milestone") || lower.includes("todo") || lower.includes("to-do") || lower.includes("tasks");

  if (isChecklistQuery) {
    const checklistItems: WeddingChecklistItem[] = [
      { id: "chk-1", title: "Finalize wedding dates & auspicious Muhurtham", category: "Planning", completed: true },
      { id: "chk-2", title: "Select and book wedding venue / auditorium", category: "Venue", completed: false },
      { id: "chk-3", title: "Book authentic Kerala wedding caterer for Sadya", category: "Catering", completed: false },
      { id: "chk-4", title: "Hire candid wedding photographer & cinematographer", category: "Photography", completed: false },
      { id: "chk-5", title: "Select bridal silk saree / lehenga & jewelry", category: "Attire", completed: false },
      { id: "chk-6", title: "Book bridal makeup artist & mehendi designer", category: "Beauty", completed: false },
      { id: "chk-7", title: "Design and send digital wedding invitations", category: "Invitations", completed: false },
      { id: "chk-8", title: "Arrange Chenda Melam / Nadaswaram & transport", category: "Music & Logistics", completed: false },
    ];

    return {
      reply: `Here is your customized Kerala wedding planning milestone checklist. As you complete milestones, your progress is saved to your account:`,
      checklist: checklistItems,
      topic: "checklist",
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. GUEST DISCOVERY: Category / City / Vendor Discovery
  // ─────────────────────────────────────────────────────────────────────────────
  const { category, city } = extractCategoryAndCity(query);

  let searchUrl = "/api/v1/public/vendors?limit=4";
  if (category) searchUrl += `&category=${encodeURIComponent(category.slug)}`;
  if (city) searchUrl += `&city=${encodeURIComponent(city)}`;

  try {
    const res = await fetch(searchUrl);
    if (!res.ok) throw new Error("Failed to fetch vendors");
    const json = await res.json();
    const items = Array.isArray(json.data) ? json.data : [];

    const groundedVendors: AuraVendorItem[] = items.map((v: any) => ({
      id: v.id,
      name: v.name,
      category: v.category || category?.name || "Wedding Vendor",
      categorySlug: v.categorySlug || category?.slug || "vendors",
      city: v.city || city || "Kerala",
      state: v.state || "Kerala",
      rating: Number(v.rating || 0),
      reviewCount: Number(v.reviewCount || 0),
      startingPrice: v.startingPrice || "Contact for pricing",
      logo: v.logo || "",
      coverImage: v.coverImage || "",
      isVerified: Boolean(v.isVerified),
      slug: v.slug || "",
      detailUrl: `/boutiques/${v.slug}`,
    }));

    if (groundedVendors.length === 0) {
      const scopeDesc = [category?.name, city].filter(Boolean).join(" in ");
      return {
        reply: `We currently do not have registered verified vendors for ${scopeDesc || "your search query"} on Cloche. We are actively expanding our partner network across Kerala. You can explore all available categories below.`,
        groundedVendors: [],
        categoryUrl: category?.url || "/vendors",
        topic: "vendors",
      };
    }

    const count = groundedVendors.length;
    let intro = `I found ${count} verified vendor${count > 1 ? "s" : ""} on Cloche`;
    if (category) intro += ` for **${category.name}**`;
    if (city) intro += ` in **${city}**`;
    intro += ":";

    return {
      reply: intro,
      groundedVendors,
      categoryUrl: category?.url,
      topic: "vendors",
    };
  } catch (err) {
    return {
      reply: "I am currently having trouble connecting to our live vendor directory. Please explore our categories directly.",
      categoryUrl: "/vendors",
      topic: "general",
    };
  }
}

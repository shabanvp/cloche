export type AdPackage = {
  id: string;
  name: string;
  description: string;
  placement: string;
  weeklyPrice: number;
  monthlyPrice: number;
  maxDurationDays: number;
  estimatedReach: string;
  priorityLevel: number;
  desktopBannerSize: string;
  mobileBannerSize: string;
  isFestivalSpecial?: boolean;
};

export const AD_PACKAGES: AdPackage[] = [
  {
    id: "pkg-hero",
    name: "Homepage Hero Banner",
    description: "Maximum prime placement right on Cloche homepage hero banner.",
    placement: "Homepage Hero Banner",
    weeklyPrice: 4999,
    monthlyPrice: 14999,
    maxDurationDays: 90,
    estimatedReach: "120,000+ views/mo",
    priorityLevel: 10,
    desktopBannerSize: "1920x600 px",
    mobileBannerSize: "800x800 px",
  },
  {
    id: "pkg-featured-section",
    name: "Featured Homepage Section",
    description: "Premium full-width showcase between popular homepage sections.",
    placement: "Homepage Between Categories",
    weeklyPrice: 3499,
    monthlyPrice: 9999,
    maxDurationDays: 60,
    estimatedReach: "85,000+ views/mo",
    priorityLevel: 9,
    desktopBannerSize: "1400x400 px",
    mobileBannerSize: "750x450 px",
  },
  {
    id: "pkg-category-top",
    name: "Featured Category Placement",
    description: "Appear right at the top of category listing pages (e.g. Photographers, Bridal Wear).",
    placement: "Category Page Top",
    weeklyPrice: 2499,
    monthlyPrice: 7499,
    maxDurationDays: 60,
    estimatedReach: "50,000+ views/mo",
    priorityLevel: 8,
    desktopBannerSize: "1200x350 px",
    mobileBannerSize: "600x300 px",
  },
  {
    id: "pkg-sponsored-search",
    name: "Sponsored Search Result",
    description: "Boost your vendor listing with a Sponsored badge at the top of search results.",
    placement: "Search Results",
    weeklyPrice: 1999,
    monthlyPrice: 5999,
    maxDurationDays: 60,
    estimatedReach: "40,000+ searches/mo",
    priorityLevel: 8,
    desktopBannerSize: "Listing Card Badge",
    mobileBannerSize: "Listing Card Badge",
  },
  {
    id: "pkg-sponsored-profile",
    name: "Sponsored Vendor Profile",
    description: "Appear as a recommended partner on related vendor detail pages.",
    placement: "Vendor Profile Top",
    weeklyPrice: 1499,
    monthlyPrice: 4499,
    maxDurationDays: 30,
    estimatedReach: "25,000+ views/mo",
    priorityLevel: 7,
    desktopBannerSize: "300x250 px",
    mobileBannerSize: "300x250 px",
  },
  {
    id: "pkg-sidebar-infeed",
    name: "Sidebar / In-feed Banner",
    description: "Native banner embedded between vendor cards in category feeds.",
    placement: "Category Page Middle",
    weeklyPrice: 1299,
    monthlyPrice: 3999,
    maxDurationDays: 30,
    estimatedReach: "30,000+ views/mo",
    priorityLevel: 6,
    desktopBannerSize: "1200x250 px",
    mobileBannerSize: "600x200 px",
  },
  {
    id: "pkg-blog-native",
    name: "Blog Page Advertisement",
    description: "Native contextual banner inside popular wedding editorial articles.",
    placement: "Blog Pages",
    weeklyPrice: 999,
    monthlyPrice: 2999,
    maxDurationDays: 30,
    estimatedReach: "20,000+ reads/mo",
    priorityLevel: 5,
    desktopBannerSize: "800x300 px",
    mobileBannerSize: "400x250 px",
  },
  {
    id: "pkg-mobile-sticky",
    name: "Mobile Sticky Banner",
    description: "High-impact floating bottom banner exclusive to mobile browsers.",
    placement: "Mobile Sticky Banner",
    weeklyPrice: 1799,
    monthlyPrice: 4999,
    maxDurationDays: 30,
    estimatedReach: "65,000+ mobile views/mo",
    priorityLevel: 9,
    desktopBannerSize: "Mobile Only",
    mobileBannerSize: "640x120 px",
  },
  {
    id: "pkg-festival",
    name: "Festival Campaign",
    description: "Target high-demand seasons: Onam, Eid, Christmas, Wedding Season & New Year.",
    placement: "Homepage Featured Vendors",
    weeklyPrice: 3999,
    monthlyPrice: 11999,
    maxDurationDays: 45,
    estimatedReach: "150,000+ festival views",
    priorityLevel: 10,
    desktopBannerSize: "1400x450 px",
    mobileBannerSize: "750x500 px",
    isFestivalSpecial: true,
  },
];

export type InternalNote = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
};

export type TimelineEvent = {
  id: string;
  event: string;
  status: "completed" | "current" | "pending";
  date: string;
  time: string;
  admin: string;
  notes?: string;
};

export type Campaign = {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  campaignName: string;
  packageId: string;
  packageName: string;
  placement: string;
  title: string;
  shortDescription: string;
  ctaText: string;
  ctaLink: string;
  desktopBanner: string;
  mobileBanner: string;
  tabletBanner?: string;
  videoBannerUrl?: string;
  vendorCategory: string;
  targetCategories: string[];
  targetDistrict?: string;
  targetCity?: string;
  startDate: string;
  endDate: string;
  billingCycle: "weekly" | "monthly";
  amount: number;
  priority: number;
  status: "pending" | "active" | "paused" | "rejected" | "expired" | "draft";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  impressions: number;
  clicks: number;
  ctr: number;
  whatsappClicks: number;
  callClicks: number;
  leadRequests: number;
  createdSource?: "vendor_self_service" | "admin_created";
  paymentSource?: "Vendor Paid Online" | "Bank Transfer" | "UPI" | "Cash" | "Manual Payment";
  invoiceNumber?: string;
  paymentReference?: string;
  notes?: string;
  internalNotesList?: InternalNote[];
  timeline?: TimelineEvent[];
  createdAt: string;
};

export type CRMLead = {
  id: string;
  vendorName: string;
  businessName: string;
  phone: string;
  whatsapp: string;
  email: string;
  interestedPackage: string;
  budget: string;
  source: "Website" | "Phone" | "WhatsApp" | "Instagram" | "Referral" | "Walk-in";
  status: "New" | "Contacted" | "Negotiation" | "Waiting" | "Won" | "Lost";
  assignedStaff: string;
  nextFollowUpDate: string;
  internalNotes: string;
  createdAt: string;
};

export type FollowUp = {
  id: string;
  leadId?: string;
  vendorName: string;
  reminderDate: string;
  reminderTime: string;
  reminderType: "Phone Call" | "WhatsApp" | "Email" | "Meeting";
  status: "Pending" | "Completed" | "Missed";
  notes: string;
  createdAt: string;
};

export type CampaignRequest = {
  id: string;
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  requestedPlacement: string;
  budget: string;
  notes: string;
  status: "New" | "Contacted" | "Waiting for Banner" | "Waiting for Payment" | "Ready" | "Completed" | "Cancelled";
  createdAt: string;
};

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-01",
    vendorId: "v-22",
    vendorName: "Aurelia Brides",
    vendorEmail: "meharoofanasrin20@gmail.com",
    campaignName: "Aurelia Royal Zardozi Wedding Offer",
    packageId: "pkg-hero",
    packageName: "Homepage Hero Banner",
    placement: "Homepage Hero Banner",
    title: "Exclusive 25% Off Royal Bridal Collections",
    shortDescription: "Handcrafted Zardozi Lehengas & Designer Silk Ensembles in Ernakulam.",
    ctaText: "Explore Collection",
    ctaLink: "/categories/bridal-wear",
    desktopBanner: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80",
    mobileBanner: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    vendorCategory: "Bridal Wear",
    targetCategories: ["Bridal Wear", "All"],
    targetDistrict: "Ernakulam",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    billingCycle: "monthly",
    amount: 14999,
    priority: 10,
    status: "active",
    paymentStatus: "paid",
    impressions: 14500,
    clicks: 820,
    ctr: 5.65,
    whatsappClicks: 210,
    callClicks: 95,
    leadRequests: 48,
    createdAt: "2026-04-01"
  },
  {
    id: "camp-02",
    vendorId: "v-30",
    vendorName: "Memory Lanes Photography",
    vendorEmail: "info@memorylanes.in",
    campaignName: "Kerala Destination Wedding Shoots",
    packageId: "pkg-category-top",
    packageName: "Featured Category Placement",
    placement: "Category Page Top",
    title: "Book Your 2026 Wedding Film - Free Pre-Wedding Shoot",
    shortDescription: "Award-winning candid & cinematic wedding photography across Kerala.",
    ctaText: "View Portfolio & Rates",
    ctaLink: "/photographers",
    desktopBanner: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80",
    mobileBanner: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80",
    vendorCategory: "Photographers",
    targetCategories: ["Photographers"],
    targetDistrict: "Kozhikode",
    startDate: "2026-04-10",
    endDate: "2026-07-10",
    billingCycle: "monthly",
    amount: 7499,
    priority: 9,
    status: "active",
    paymentStatus: "paid",
    impressions: 9800,
    clicks: 640,
    ctr: 6.53,
    whatsappClicks: 180,
    callClicks: 75,
    leadRequests: 32,
    createdAt: "2026-04-10"
  },
  {
    id: "camp-03",
    vendorId: "v-26",
    vendorName: "Royal Groom Couture",
    vendorEmail: "shabanmuhammed26@gmail.com",
    campaignName: "Groom Sherwani Festive Discount",
    packageId: "pkg-featured-section",
    packageName: "Featured Homepage Section",
    placement: "Homepage Between Categories",
    title: "Bespoke Groom Sherwanis & Tuxedos",
    shortDescription: "Tailored luxury groom outfits with complimentary turban & accessories.",
    ctaText: "Book Appointment",
    ctaLink: "/categories/groom-wear",
    desktopBanner: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80",
    mobileBanner: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=750&q=80",
    vendorCategory: "Groom Wear",
    targetCategories: ["Groom Wear", "All"],
    targetDistrict: "Malappuram",
    startDate: "2026-04-15",
    endDate: "2026-05-15",
    billingCycle: "weekly",
    amount: 3499,
    priority: 8,
    status: "active",
    paymentStatus: "paid",
    impressions: 6200,
    clicks: 390,
    ctr: 6.29,
    whatsappClicks: 110,
    callClicks: 40,
    leadRequests: 19,
    createdAt: "2026-04-15"
  },
  {
    id: "camp-04",
    vendorId: "v-15",
    vendorName: "Faces by Leena Bhushan",
    vendorEmail: "info@facesbyleena.com",
    campaignName: "HD Airbrush Bridal Glam Launch",
    packageId: "pkg-sponsored-search",
    packageName: "Sponsored Search Result",
    placement: "Search Results",
    title: "Faces by Leena - Celebrity HD Bridal Makeup",
    shortDescription: "Signature airbrush bridal makeovers & customized reception styling.",
    ctaText: "Check Availability",
    ctaLink: "/makeup",
    desktopBanner: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    mobileBanner: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    vendorCategory: "Makeup Artists",
    targetCategories: ["Makeup Artists"],
    targetDistrict: "Kochi",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    billingCycle: "monthly",
    amount: 5999,
    priority: 9,
    status: "active",
    paymentStatus: "paid",
    impressions: 11200,
    clicks: 780,
    ctr: 6.96,
    whatsappClicks: 240,
    callClicks: 110,
    leadRequests: 54,
    createdAt: "2026-04-01"
  },
  {
    id: "camp-05",
    vendorId: "v-40",
    vendorName: "Malabar Gold & Diamonds",
    vendorEmail: "support@malabargold.com",
    campaignName: "Malabar Wedding Jewellery Fest",
    packageId: "pkg-mobile-sticky",
    packageName: "Mobile Sticky Banner",
    placement: "Mobile Sticky Banner",
    title: "Malabar Bridal Jewelry Fest - 0% Making Charge Offer",
    shortDescription: "Explore traditional Kerala gold & uncut diamond polki sets.",
    ctaText: "Claim Offer",
    ctaLink: "/categories/jewellery",
    desktopBanner: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    mobileBanner: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=640&q=80",
    vendorCategory: "Jewellery",
    targetCategories: ["Jewellery"],
    targetDistrict: "Kozhikode",
    startDate: "2026-04-05",
    endDate: "2026-05-31",
    billingCycle: "monthly",
    amount: 4999,
    priority: 9,
    status: "active",
    paymentStatus: "paid",
    impressions: 18400,
    clicks: 1250,
    ctr: 6.79,
    whatsappClicks: 320,
    callClicks: 140,
    leadRequests: 82,
    createdAt: "2026-04-05"
  }
];

const LOCAL_STORAGE_KEY = "cloche_ad_campaigns_db_v1";

export function getStoredCampaigns(): Campaign[] {
  if (typeof window === "undefined") return INITIAL_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CAMPAIGNS));
      return INITIAL_CAMPAIGNS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_CAMPAIGNS;
  }
}

export function saveStoredCampaigns(campaigns: Campaign[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(campaigns));
  } catch (e) {}
}

export function createCampaignRecord(newCampaign: Partial<Campaign>): Campaign {
  const existing = getStoredCampaigns();
  const pkg = AD_PACKAGES.find((p) => p.id === newCampaign.packageId) || AD_PACKAGES[0];

  const created: Campaign = {
    id: `camp-${Date.now()}`,
    vendorId: newCampaign.vendorId || "v-partner",
    vendorName: newCampaign.vendorName || "Partner Vendor",
    vendorEmail: newCampaign.vendorEmail || "vendor@cloche.com",
    campaignName: newCampaign.campaignName || `${newCampaign.vendorName || "Vendor"} Ad Campaign`,
    packageId: pkg.id,
    packageName: pkg.name,
    placement: pkg.placement,
    title: newCampaign.title || "Special Wedding Offer",
    shortDescription: newCampaign.shortDescription || "Book directly on Cloche for exclusive discounts.",
    ctaText: newCampaign.ctaText || "View Offer",
    ctaLink: newCampaign.ctaLink || "/",
    desktopBanner: newCampaign.desktopBanner || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=80",
    mobileBanner: newCampaign.mobileBanner || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=750&q=80",
    videoBannerUrl: newCampaign.videoBannerUrl,
    vendorCategory: newCampaign.vendorCategory || "Bridal Wear",
    targetCategories: newCampaign.targetCategories?.length ? newCampaign.targetCategories : ["All"],
    targetDistrict: newCampaign.targetDistrict || "All Districts",
    targetCity: newCampaign.targetCity || "All Cities",
    startDate: newCampaign.startDate || new Date().toISOString().split("T")[0],
    endDate: newCampaign.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    billingCycle: newCampaign.billingCycle || "monthly",
    amount: newCampaign.billingCycle === "weekly" ? pkg.weeklyPrice : pkg.monthlyPrice,
    priority: pkg.priorityLevel,
    status: "pending",
    paymentStatus: "paid",
    impressions: 0,
    clicks: 0,
    ctr: 0,
    whatsappClicks: 0,
    callClicks: 0,
    leadRequests: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };

  const updated = [created, ...existing];
  saveStoredCampaigns(updated);
  return created;
}

export function updateCampaignStatus(id: string, status: Campaign["status"]): void {
  const existing = getStoredCampaigns();
  const updated = existing.map((c) => (c.id === id ? { ...c, status } : c));
  saveStoredCampaigns(updated);
}

export function trackAdImpression(campaignId: string): void {
  const existing = getStoredCampaigns();
  const updated = existing.map((c) => {
    if (c.id === campaignId) {
      const impressions = c.impressions + 1;
      const ctr = impressions > 0 ? Number(((c.clicks / impressions) * 100).toFixed(2)) : 0;
      return { ...c, impressions, ctr };
    }
    return c;
  });
  saveStoredCampaigns(updated);
}

export function trackAdClick(campaignId: string, clickType: "cta" | "whatsapp" | "call" = "cta"): void {
  const existing = getStoredCampaigns();
  const updated = existing.map((c) => {
    if (c.id === campaignId) {
      const clicks = c.clicks + 1;
      const whatsappClicks = clickType === "whatsapp" ? c.whatsappClicks + 1 : c.whatsappClicks;
      const callClicks = clickType === "call" ? c.callClicks + 1 : c.callClicks;
      const leadRequests = clickType === "cta" ? c.leadRequests + 1 : c.leadRequests;
      const ctr = c.impressions > 0 ? Number(((clicks / c.impressions) * 100).toFixed(2)) : 0;
      return { ...c, clicks, whatsappClicks, callClicks, leadRequests, ctr };
    }
    return c;
  });
  saveStoredCampaigns(updated);
}

export function getActiveCampaignsByPlacement(placement: string, category?: string): Campaign[] {
  const all = getStoredCampaigns();
  const today = new Date().toISOString().split("T")[0];

  return all.filter((c) => {
    if (c.status !== "active") return false;
    if (c.placement !== placement) return false;
    if (c.startDate > today || c.endDate < today) return false;
    if (category && category !== "All" && c.targetCategories?.length) {
      if (!c.targetCategories.includes("All") && !c.targetCategories.includes(category)) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => b.priority - a.priority);
}

export function createAdminCampaignRecord(data: Partial<Campaign>): Campaign {
  const existing = getStoredCampaigns();
  const pkg = AD_PACKAGES.find((p) => p.id === data.packageId || p.placement === data.placement) || AD_PACKAGES[0];

  const created: Campaign = {
    id: `camp-admin-${Date.now()}`,
    vendorId: data.vendorId || "v-offline",
    vendorName: data.vendorName || "Offline Partner Vendor",
    vendorEmail: data.vendorEmail || "contact@cloche.com",
    campaignName: data.campaignName || `Admin Created - ${data.vendorName || "Vendor"} Ad`,
    packageId: pkg.id,
    packageName: pkg.name,
    placement: data.placement || pkg.placement,
    title: data.title || "Exclusive Partner Spotlight",
    shortDescription: data.shortDescription || "Featured partner promotion on Cloche.",
    ctaText: data.ctaText || "Explore Offer",
    ctaLink: data.ctaLink || "/",
    desktopBanner: data.desktopBanner || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80",
    mobileBanner: data.mobileBanner || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    videoBannerUrl: data.videoBannerUrl,
    vendorCategory: data.vendorCategory || "Bridal Wear",
    targetCategories: data.targetCategories?.length ? data.targetCategories : ["All"],
    targetDistrict: data.targetDistrict || "All Districts",
    targetCity: data.targetCity || "All Cities",
    startDate: data.startDate || new Date().toISOString().split("T")[0],
    endDate: data.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    billingCycle: data.billingCycle || "monthly",
    amount: data.amount || pkg.monthlyPrice,
    priority: data.priority || pkg.priorityLevel,
    status: data.status || "active",
    paymentStatus: data.paymentStatus || "paid",
    impressions: data.impressions || 0,
    clicks: data.clicks || 0,
    ctr: 0,
    whatsappClicks: 0,
    callClicks: 0,
    leadRequests: 0,
    createdSource: "admin_created",
    paymentSource: data.paymentSource || "Bank Transfer",
    invoiceNumber: data.invoiceNumber || `INV-ADM-${Math.floor(1000 + Math.random() * 9000)}`,
    paymentReference: data.paymentReference || "BANK-REF-OK",
    notes: data.notes || "Admin created directly via Marketing Portal.",
    createdAt: new Date().toISOString().split("T")[0],
  };

  const updated = [created, ...existing];
  saveStoredCampaigns(updated);
  return created;
}

const REQUESTS_STORAGE_KEY = "cloche_ad_requests_db_v1";

export const INITIAL_REQUESTS: CampaignRequest[] = [
  {
    id: "req-01",
    vendorName: "IHA Designs",
    contactPerson: "Iha Director",
    phone: "+91 98471 99887",
    email: "contactbrandyy@gmail.com",
    requestedPlacement: "Homepage Hero Banner",
    budget: "₹15,000 / month",
    notes: "Vendor called directly asking for Onam festival hero banner spotlight.",
    status: "Waiting for Banner",
    createdAt: "2026-04-18"
  },
  {
    id: "req-02",
    vendorName: "Leela Raviz Kovalam",
    contactPerson: "Marketing Head",
    phone: "+91 471 305 1234",
    email: "weddings.kovalam@theleela.com",
    requestedPlacement: "Featured Category Placement",
    budget: "₹10,000 / month",
    notes: "Beachfront wedding resort sponsorship.",
    status: "Contacted",
    createdAt: "2026-04-20"
  }
];

export function getCampaignRequests(): CampaignRequest[] {
  if (typeof window === "undefined") return INITIAL_REQUESTS;
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REQUESTS;
  }
}

export function saveCampaignRequests(requests: CampaignRequest[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
  } catch (e) {}
}

export function updateCampaignRequestStatus(id: string, status: CampaignRequest["status"]): void {
  const existing = getCampaignRequests();
  const updated = existing.map((r) => (r.id === id ? { ...r, status } : r));
  saveCampaignRequests(updated);
}

export function renewCampaign(campaignId: string): Campaign | null {
  const existing = getStoredCampaigns();
  const target = existing.find((c) => c.id === campaignId);
  if (!target) return null;

  const today = new Date();
  const nextMonth = new Date(today.getTime() + 30 * 86400000);

  const renewed: Campaign = {
    ...target,
    id: `camp-renew-${Date.now()}`,
    campaignName: `${target.campaignName} (Renewed)`,
    startDate: today.toISOString().split("T")[0],
    endDate: nextMonth.toISOString().split("T")[0],
    status: "draft",
    paymentStatus: "pending",
    impressions: 0,
    clicks: 0,
    ctr: 0,
    whatsappClicks: 0,
    callClicks: 0,
    leadRequests: 0,
    notes: `Renewed from campaign ${target.id}`,
    internalNotesList: [
      ...(target.internalNotesList || []),
      {
        id: `note-${Date.now()}`,
        text: `Campaign renewed from previous campaign ${target.id}`,
        author: "System Admin",
        createdAt: new Date().toLocaleDateString(),
      },
    ],
    timeline: [
      {
        id: `tl-1`,
        event: "Campaign Renewed",
        status: "completed",
        date: today.toLocaleDateString(),
        time: today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        admin: "Marketing Admin",
        notes: "Renewal draft created.",
      },
    ],
    createdAt: today.toISOString().split("T")[0],
  };

  const updated = [renewed, ...existing];
  saveStoredCampaigns(updated);
  return renewed;
}

export function addInternalNoteToCampaign(campaignId: string, text: string, author = "Admin"): void {
  const existing = getStoredCampaigns();
  const updated = existing.map((c) => {
    if (c.id === campaignId) {
      const note: InternalNote = {
        id: `note-${Date.now()}`,
        text,
        author,
        createdAt: new Date().toLocaleString(),
      };
      return {
        ...c,
        internalNotesList: [...(c.internalNotesList || []), note],
      };
    }
    return c;
  });
  saveStoredCampaigns(updated);
}

// ----------------------------------------------------
// CRM LEADS & FOLLOW UPS STORE
// ----------------------------------------------------

const LEADS_STORAGE_KEY = "cloche_crm_leads_v1";
const FOLLOWUPS_STORAGE_KEY = "cloche_crm_followups_v1";
const PACKAGES_STORAGE_KEY = "cloche_ad_packages_v1";

export const INITIAL_CRM_LEADS: CRMLead[] = [
  {
    id: "lead-101",
    vendorName: "Kalyan Silks Kochi",
    businessName: "Kalyan Silks Pvt Ltd",
    phone: "+91 484 238 0000",
    whatsapp: "+91 94470 12345",
    email: "marketing@kalyansilks.com",
    interestedPackage: "Homepage Hero Banner",
    budget: "₹50,000 / mo",
    source: "Phone",
    status: "Negotiation",
    assignedStaff: "Arun V (Marketing Exec)",
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    internalNotes: "Requested 15% discount for 3-month contract.",
    createdAt: "2026-04-15",
  },
  {
    id: "lead-102",
    vendorName: "Boutique De Royal",
    businessName: "Boutique De Royal LLP",
    phone: "+91 98951 88776",
    whatsapp: "+91 98951 88776",
    email: "royal.boutique@gmail.com",
    interestedPackage: "Featured Category Placement",
    budget: "₹10,000 / mo",
    source: "Instagram",
    status: "New",
    assignedStaff: "Rhea S",
    nextFollowUpDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    internalNotes: "Inquired via Instagram DM for bridal wear category top slot.",
    createdAt: "2026-04-22",
  },
];

export const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: "fup-01",
    leadId: "lead-101",
    vendorName: "Kalyan Silks Kochi",
    reminderDate: new Date().toISOString().split("T")[0],
    reminderTime: "14:30",
    reminderType: "Phone Call",
    status: "Pending",
    notes: "Call Mr. Ramesh regarding Hero Banner contract approval.",
    createdAt: "2026-04-20",
  },
  {
    id: "fup-02",
    leadId: "lead-102",
    vendorName: "Boutique De Royal",
    reminderDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    reminderTime: "11:00",
    reminderType: "WhatsApp",
    status: "Pending",
    notes: "Send media kit & package pricing PDF on WhatsApp.",
    createdAt: "2026-04-22",
  },
];

export function getCRMLeads(): CRMLead[] {
  if (typeof window === "undefined") return INITIAL_CRM_LEADS;
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_CRM_LEADS));
      return INITIAL_CRM_LEADS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_CRM_LEADS;
  }
}

export function saveCRMLeads(leads: CRMLead[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {}
}

export function createCRMLead(lead: Partial<CRMLead>): CRMLead {
  const existing = getCRMLeads();
  const created: CRMLead = {
    id: `lead-${Date.now()}`,
    vendorName: lead.vendorName || "New Lead Vendor",
    businessName: lead.businessName || lead.vendorName || "Business",
    phone: lead.phone || "+91 ",
    whatsapp: lead.whatsapp || lead.phone || "+91 ",
    email: lead.email || "vendor@lead.com",
    interestedPackage: lead.interestedPackage || "Homepage Hero Banner",
    budget: lead.budget || "₹10,000 / mo",
    source: lead.source || "Website",
    status: lead.status || "New",
    assignedStaff: lead.assignedStaff || "Marketing Admin",
    nextFollowUpDate: lead.nextFollowUpDate || new Date().toISOString().split("T")[0],
    internalNotes: lead.internalNotes || "Lead created from CRM.",
    createdAt: new Date().toISOString().split("T")[0],
  };

  const updated = [created, ...existing];
  saveCRMLeads(updated);
  return created;
}

export function updateCRMLeadStatus(id: string, status: CRMLead["status"]): void {
  const existing = getCRMLeads();
  const updated = existing.map((l) => (l.id === id ? { ...l, status } : l));
  saveCRMLeads(updated);
}

export function getFollowUps(): FollowUp[] {
  if (typeof window === "undefined") return INITIAL_FOLLOWUPS;
  try {
    const raw = localStorage.getItem(FOLLOWUPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FOLLOWUPS_STORAGE_KEY, JSON.stringify(INITIAL_FOLLOWUPS));
      return INITIAL_FOLLOWUPS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FOLLOWUPS;
  }
}

export function saveFollowUps(followUps: FollowUp[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FOLLOWUPS_STORAGE_KEY, JSON.stringify(followUps));
  } catch (e) {}
}

export function createFollowUp(fup: Partial<FollowUp>): FollowUp {
  const existing = getFollowUps();
  const created: FollowUp = {
    id: `fup-${Date.now()}`,
    leadId: fup.leadId,
    vendorName: fup.vendorName || "Vendor Lead",
    reminderDate: fup.reminderDate || new Date().toISOString().split("T")[0],
    reminderTime: fup.reminderTime || "10:00",
    reminderType: fup.reminderType || "Phone Call",
    status: fup.status || "Pending",
    notes: fup.notes || "Follow up scheduled.",
    createdAt: new Date().toISOString().split("T")[0],
  };

  const updated = [created, ...existing];
  saveFollowUps(updated);
  return created;
}

export function completeFollowUp(id: string): void {
  const existing = getFollowUps();
  const updated = existing.map((f) => (f.id === id ? { ...f, status: "Completed" as const } : f));
  saveFollowUps(updated);
}

// ----------------------------------------------------
// DYNAMIC AD PACKAGES MANAGEMENT (CRUD)
// ----------------------------------------------------

export function getDynamicPackages(): AdPackage[] {
  if (typeof window === "undefined") return AD_PACKAGES;
  try {
    const raw = localStorage.getItem(PACKAGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(AD_PACKAGES));
      return AD_PACKAGES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return AD_PACKAGES;
  }
}

export function saveDynamicPackages(pkgs: AdPackage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(pkgs));
  } catch (e) {}
}

export function createAdPackage(pkg: Partial<AdPackage>): AdPackage {
  const existing = getDynamicPackages();
  const created: AdPackage = {
    id: `pkg-${Date.now()}`,
    name: pkg.name || "Custom Package",
    description: pkg.description || "Custom marketing package placement.",
    placement: pkg.placement || "Homepage Hero Banner",
    weeklyPrice: pkg.weeklyPrice || 1999,
    monthlyPrice: pkg.monthlyPrice || 5999,
    maxDurationDays: pkg.maxDurationDays || 30,
    estimatedReach: pkg.estimatedReach || "30,000+ views/mo",
    priorityLevel: pkg.priorityLevel || 5,
    desktopBannerSize: pkg.desktopBannerSize || "1200x400 px",
    mobileBannerSize: pkg.mobileBannerSize || "600x300 px",
    isFestivalSpecial: pkg.isFestivalSpecial || false,
  };
  const updated = [...existing, created];
  saveDynamicPackages(updated);
  return created;
}



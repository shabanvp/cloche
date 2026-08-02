"use client";

export type OfferType =
  | "percentage"
  | "flat"
  | "cashback"
  | "free_upgrade"
  | "free_addon"
  | "bundle"
  | "bogo"
  | "limited_time"
  | "coupon"
  | "early_bird"
  | "last_minute"
  | "festival"
  | "anniversary";

export type OfferStatus = "draft" | "scheduled" | "active" | "paused" | "expired";

export type DiscountType = "percentage" | "flat" | "complimentary";

export interface VendorOffer {
  id: string;
  vendorId: string;
  name: string;
  type: OfferType;
  discountType: DiscountType;
  discountValue: string; // e.g. "20" for 20%, "50000" for ₹50,000, or "Free Deluxe Bridal Suite"
  packageIds: string[]; // ["all"] or array of specific package IDs/names
  couponCode?: string;
  banner?: string;
  mobileBanner?: string;
  squareBanner?: string;
  status: OfferStatus;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  bookingWindow?: string;
  maxRedemptions?: number;
  currentRedemptions: number;
  perCustomerLimit?: number;
  minBookingAmount?: number;
  minGuests?: number;
  applicableDays?: ("weekdays" | "weekend")[];
  blackoutDates?: string[];
  ctaText: "Book Now" | "Claim Offer" | "Contact Vendor" | "Get Quote" | "Use Coupon";
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSaleEndsAt?: string; // YYYY-MM-DDTHH:mm
  termsAndConditions?: string;
  analytics: {
    views: number;
    clicks: number;
    bookings: number;
    revenue: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CouponCode {
  id: string;
  vendorId: string;
  code: string;
  discountDisplay: string; // e.g. "10% OFF", "₹25,000 OFF"
  minBookingValue?: number;
  maxUses?: number;
  currentUses: number;
  status: "active" | "paused" | "expired";
  expiresAt: string;
}

// Sample pre-populated offers for initial experience
const DEFAULT_SAMPLE_OFFERS: VendorOffer[] = [
  {
    id: "off-001",
    vendorId: "v-solitaire",
    name: "Grand Monsoon Wedding Offer",
    type: "percentage",
    discountType: "percentage",
    discountValue: "20",
    packageIds: ["all"],
    couponCode: "MONSOON20",
    banner: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80",
    status: "active",
    startDate: "2026-08-01",
    endDate: "2026-09-30",
    bookingWindow: "Aug 1 – Sep 30, 2026",
    maxRedemptions: 50,
    currentRedemptions: 14,
    perCustomerLimit: 1,
    minBookingAmount: 150000,
    minGuests: 250,
    applicableDays: ["weekdays", "weekend"],
    ctaText: "Claim Offer",
    isFeatured: true,
    isFlashSale: false,
    termsAndConditions: "Applicable on direct bookings for August & September 2026. Cannot be combined with other ongoing promotions.",
    analytics: {
      views: 1240,
      clicks: 480,
      bookings: 14,
      revenue: 4200000,
    },
    createdAt: "2026-08-01T10:00:00Z",
    updatedAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "off-002",
    vendorId: "v-solitaire",
    name: "Luxury Early Bird Package Deal",
    type: "flat",
    discountType: "flat",
    discountValue: "50000",
    packageIds: ["Royal Gold Package", "Royal Banquet Package"],
    couponCode: "EARLYBIRD50K",
    banner: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    status: "active",
    startDate: "2026-08-01",
    endDate: "2026-10-15",
    bookingWindow: "Book 60 days in advance",
    maxRedemptions: 20,
    currentRedemptions: 8,
    perCustomerLimit: 1,
    minBookingAmount: 300000,
    minGuests: 500,
    applicableDays: ["weekdays", "weekend"],
    ctaText: "Book Now",
    isFeatured: false,
    isFlashSale: true,
    flashSaleEndsAt: "2026-08-15T23:59:59",
    termsAndConditions: "Valid when booking at least 60 days in advance of wedding date. Subject to hall availability.",
    analytics: {
      views: 890,
      clicks: 310,
      bookings: 8,
      revenue: 2800000,
    },
    createdAt: "2026-08-01T11:00:00Z",
    updatedAt: "2026-08-01T11:00:00Z",
  },
  {
    id: "off-003",
    vendorId: "v-solitaire",
    name: "Complimentary Bridal Suite & Decor Add-on",
    type: "free_upgrade",
    discountType: "complimentary",
    discountValue: "Free Deluxe Bridal Suite & Floral Stage Upgrade",
    packageIds: ["Silver Wedding Package"],
    couponCode: "BRIDALVIPTREAT",
    banner: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    status: "active",
    startDate: "2026-08-05",
    endDate: "2026-11-30",
    bookingWindow: "Valid for 2026 bookings",
    maxRedemptions: 15,
    currentRedemptions: 5,
    perCustomerLimit: 1,
    minBookingAmount: 100000,
    minGuests: 200,
    applicableDays: ["weekdays"],
    ctaText: "Get Quote",
    isFeatured: false,
    isFlashSale: false,
    termsAndConditions: "Includes complimentary 24-hour stay in Deluxe Bridal Suite plus customized floral stage entrance decor.",
    analytics: {
      views: 640,
      clicks: 215,
      bookings: 5,
      revenue: 1250000,
    },
    createdAt: "2026-08-02T08:00:00Z",
    updatedAt: "2026-08-02T08:00:00Z",
  },
  {
    id: "off-004",
    vendorId: "v-solitaire",
    name: "Weekday Celebration Discount",
    type: "percentage",
    discountType: "percentage",
    discountValue: "15",
    packageIds: ["all"],
    couponCode: "WEEKDAY15",
    banner: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    status: "scheduled",
    startDate: "2026-09-01",
    endDate: "2026-12-15",
    bookingWindow: "Mon – Thu Event Dates",
    maxRedemptions: 30,
    currentRedemptions: 0,
    perCustomerLimit: 1,
    minBookingAmount: 75000,
    minGuests: 150,
    applicableDays: ["weekdays"],
    ctaText: "Book Now",
    isFeatured: false,
    isFlashSale: false,
    termsAndConditions: "Valid exclusively for Monday through Thursday event dates.",
    analytics: {
      views: 120,
      clicks: 35,
      bookings: 0,
      revenue: 0,
    },
    createdAt: "2026-08-02T09:00:00Z",
    updatedAt: "2026-08-02T09:00:00Z",
  },
];

const DEFAULT_SAMPLE_COUPONS: CouponCode[] = [
  {
    id: "coup-1",
    vendorId: "v-solitaire",
    code: "WELCOME10",
    discountDisplay: "10% OFF",
    minBookingValue: 50000,
    maxUses: 100,
    currentUses: 32,
    status: "active",
    expiresAt: "2026-12-31",
  },
  {
    id: "coup-2",
    vendorId: "v-solitaire",
    code: "LUXURY25",
    discountDisplay: "₹25,000 OFF",
    minBookingValue: 200000,
    maxUses: 30,
    currentUses: 11,
    status: "active",
    expiresAt: "2026-10-31",
  },
  {
    id: "coup-3",
    vendorId: "v-solitaire",
    code: "BIGDAY50",
    discountDisplay: "₹50,000 OFF",
    minBookingValue: 400000,
    maxUses: 15,
    currentUses: 6,
    status: "active",
    expiresAt: "2026-09-30",
  },
  {
    id: "coup-4",
    vendorId: "v-solitaire",
    code: "EARLYBIRD",
    discountDisplay: "15% OFF",
    minBookingValue: 150000,
    maxUses: 50,
    currentUses: 18,
    status: "active",
    expiresAt: "2026-11-15",
  },
];

function getOffersStorageKey(vendorId: string): string {
  return `cloche_vendor_offers_${vendorId || "v-solitaire"}`;
}

function getCouponsStorageKey(vendorId: string): string {
  return `cloche_vendor_coupons_${vendorId || "v-solitaire"}`;
}

/**
 * Retrieve all vendor offers for a given vendor
 */
export function getVendorOffers(vendorId: string = "v-solitaire"): VendorOffer[] {
  if (typeof window === "undefined") return DEFAULT_SAMPLE_OFFERS;
  try {
    const raw = localStorage.getItem(getOffersStorageKey(vendorId));
    if (!raw) {
      localStorage.setItem(getOffersStorageKey(vendorId), JSON.stringify(DEFAULT_SAMPLE_OFFERS));
      return DEFAULT_SAMPLE_OFFERS;
    }
    const parsed: VendorOffer[] = JSON.parse(raw);
    
    // Auto-update expired statuses based on date
    const today = new Date().toISOString().split("T")[0];
    let modified = false;
    const updated = parsed.map((off) => {
      if (off.status === "active" && off.endDate < today) {
        modified = true;
        return { ...off, status: "expired" as OfferStatus };
      }
      return off;
    });

    if (modified) {
      localStorage.setItem(getOffersStorageKey(vendorId), JSON.stringify(updated));
    }
    return updated;
  } catch (e) {
    console.error("Error reading vendor offers store:", e);
    return DEFAULT_SAMPLE_OFFERS;
  }
}

/**
 * Save or update a vendor offer
 */
export function saveVendorOffer(offer: Partial<VendorOffer> & { name: string; vendorId: string }): VendorOffer {
  const existing = getVendorOffers(offer.vendorId);
  const now = new Date().toISOString();
  
  let targetId = offer.id;
  if (!targetId) {
    targetId = `off-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  }

  // If this offer is marked featured, un-feature all other offers for this vendor
  let finalOffersList = existing;
  if (offer.isFeatured) {
    finalOffersList = existing.map((o) => ({ ...o, isFeatured: false }));
  }

  const newOfferObj: VendorOffer = {
    id: targetId,
    vendorId: offer.vendorId || "v-solitaire",
    name: offer.name,
    type: offer.type || "percentage",
    discountType: offer.discountType || "percentage",
    discountValue: offer.discountValue || "10",
    packageIds: offer.packageIds && offer.packageIds.length > 0 ? offer.packageIds : ["all"],
    couponCode: offer.couponCode || "",
    banner: offer.banner || "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80",
    mobileBanner: offer.mobileBanner || offer.banner,
    squareBanner: offer.squareBanner || offer.banner,
    status: offer.status || "active",
    startDate: offer.startDate || new Date().toISOString().split("T")[0],
    endDate: offer.endDate || "2026-12-31",
    bookingWindow: offer.bookingWindow || "Limited period promotion",
    maxRedemptions: offer.maxRedemptions || 50,
    currentRedemptions: offer.currentRedemptions || 0,
    perCustomerLimit: offer.perCustomerLimit || 1,
    minBookingAmount: offer.minBookingAmount || 0,
    minGuests: offer.minGuests || 0,
    applicableDays: offer.applicableDays || ["weekdays", "weekend"],
    blackoutDates: offer.blackoutDates || [],
    ctaText: offer.ctaText || "Claim Offer",
    isFeatured: Boolean(offer.isFeatured),
    isFlashSale: Boolean(offer.isFlashSale),
    flashSaleEndsAt: offer.flashSaleEndsAt,
    termsAndConditions: offer.termsAndConditions || "Standard venue booking terms apply.",
    analytics: offer.analytics || { views: 0, clicks: 0, bookings: 0, revenue: 0 },
    createdAt: offer.createdAt || now,
    updatedAt: now,
  };

  const existingIndex = finalOffersList.findIndex((o) => o.id === targetId);
  let updatedList: VendorOffer[];
  if (existingIndex >= 0) {
    updatedList = [...finalOffersList];
    updatedList[existingIndex] = newOfferObj;
  } else {
    updatedList = [newOfferObj, ...finalOffersList];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(getOffersStorageKey(offer.vendorId), JSON.stringify(updatedList));
    window.dispatchEvent(new Event("cloche_offers_updated"));
  }

  return newOfferObj;
}

/**
 * Delete a vendor offer
 */
export function deleteVendorOffer(offerId: string, vendorId: string = "v-solitaire"): boolean {
  const existing = getVendorOffers(vendorId);
  const filtered = existing.filter((o) => o.id !== offerId);
  if (typeof window !== "undefined") {
    localStorage.setItem(getOffersStorageKey(vendorId), JSON.stringify(filtered));
    window.dispatchEvent(new Event("cloche_offers_updated"));
  }
  return true;
}

/**
 * Toggle status of a vendor offer (active, paused, expired, etc.)
 */
export function toggleOfferStatus(offerId: string, status: OfferStatus, vendorId: string = "v-solitaire"): boolean {
  const existing = getVendorOffers(vendorId);
  const updated = existing.map((o) => (o.id === offerId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
  if (typeof window !== "undefined") {
    localStorage.setItem(getOffersStorageKey(vendorId), JSON.stringify(updated));
    window.dispatchEvent(new Event("cloche_offers_updated"));
  }
  return true;
}

/**
 * Set an offer as Featured (un-features all others for this vendor)
 */
export function toggleFeaturedOffer(offerId: string, vendorId: string = "v-solitaire"): boolean {
  const existing = getVendorOffers(vendorId);
  const updated = existing.map((o) => ({
    ...o,
    isFeatured: o.id === offerId ? !o.isFeatured : false,
    updatedAt: new Date().toISOString(),
  }));
  if (typeof window !== "undefined") {
    localStorage.setItem(getOffersStorageKey(vendorId), JSON.stringify(updated));
    window.dispatchEvent(new Event("cloche_offers_updated"));
  }
  return true;
}

/**
 * Record offer analytics view/click/booking
 */
export function incrementOfferAnalytics(
  offerId: string,
  metric: "views" | "clicks" | "bookings",
  revenueAmount: number = 0,
  vendorId: string = "v-solitaire"
): void {
  const existing = getVendorOffers(vendorId);
  const updated = existing.map((o) => {
    if (o.id === offerId) {
      const analytics = { ...o.analytics };
      if (metric === "views") analytics.views += 1;
      if (metric === "clicks") analytics.clicks += 1;
      if (metric === "bookings") {
        analytics.bookings += 1;
        analytics.revenue += revenueAmount;
      }
      return {
        ...o,
        currentRedemptions: metric === "bookings" ? o.currentRedemptions + 1 : o.currentRedemptions,
        analytics,
      };
    }
    return o;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(getOffersStorageKey(vendorId), JSON.stringify(updated));
  }
}

/**
 * Retrieve active offers for public profile display
 */
export function getActiveOffersForVenue(vendorId: string = "v-solitaire"): VendorOffer[] {
  const offers = getVendorOffers(vendorId);
  return offers.filter((o) => o.status === "active");
}

/**
 * Coupon management helper methods
 */
export function getVendorCoupons(vendorId: string = "v-solitaire"): CouponCode[] {
  if (typeof window === "undefined") return DEFAULT_SAMPLE_COUPONS;
  try {
    const raw = localStorage.getItem(getCouponsStorageKey(vendorId));
    if (!raw) {
      localStorage.setItem(getCouponsStorageKey(vendorId), JSON.stringify(DEFAULT_SAMPLE_COUPONS));
      return DEFAULT_SAMPLE_COUPONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SAMPLE_COUPONS;
  }
}

export function saveVendorCoupon(coupon: Partial<CouponCode> & { code: string; vendorId: string }): CouponCode {
  const existing = getVendorCoupons(coupon.vendorId);
  const targetId = coupon.id || `coup-${Date.now()}`;
  const newCoup: CouponCode = {
    id: targetId,
    vendorId: coupon.vendorId || "v-solitaire",
    code: coupon.code.toUpperCase().replace(/[^A-Z0-9]/g, ""),
    discountDisplay: coupon.discountDisplay || "10% OFF",
    minBookingValue: coupon.minBookingValue || 50000,
    maxUses: coupon.maxUses || 50,
    currentUses: coupon.currentUses || 0,
    status: coupon.status || "active",
    expiresAt: coupon.expiresAt || "2026-12-31",
  };

  const idx = existing.findIndex((c) => c.id === targetId);
  let updatedList: CouponCode[];
  if (idx >= 0) {
    updatedList = [...existing];
    updatedList[idx] = newCoup;
  } else {
    updatedList = [newCoup, ...existing];
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(getCouponsStorageKey(coupon.vendorId), JSON.stringify(updatedList));
  }
  return newCoup;
}

export function toggleCouponStatus(couponId: string, status: "active" | "paused" | "expired", vendorId: string = "v-solitaire"): void {
  const existing = getVendorCoupons(vendorId);
  const updated = existing.map((c) => (c.id === couponId ? { ...c, status } : c));
  if (typeof window !== "undefined") {
    localStorage.setItem(getCouponsStorageKey(vendorId), JSON.stringify(updated));
  }
}

export function deleteVendorCoupon(couponId: string, vendorId: string = "v-solitaire"): void {
  const existing = getVendorCoupons(vendorId);
  const filtered = existing.filter((c) => c.id !== couponId);
  if (typeof window !== "undefined") {
    localStorage.setItem(getCouponsStorageKey(vendorId), JSON.stringify(filtered));
  }
}

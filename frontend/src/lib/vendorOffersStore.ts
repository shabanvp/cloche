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
  discountValue: string;
  packageIds: string[];
  couponCode?: string;
  banner?: string;
  mobileBanner?: string;
  squareBanner?: string;
  status: OfferStatus;
  startDate: string;
  endDate: string;
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
  flashSaleEndsAt?: string;
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
  discountDisplay: string;
  minBookingValue?: number;
  maxUses?: number;
  currentUses: number;
  status: "active" | "paused" | "expired";
  expiresAt: string;
}

function getOffersStorageKey(vendorId: string): string {
  return `cloche_vendor_offers_${vendorId || "v-registered"}`;
}

function getCouponsStorageKey(vendorId: string): string {
  return `cloche_vendor_coupons_${vendorId || "v-registered"}`;
}

function persistOffersToStorage(vendorId: string, list: VendorOffer[]) {
  if (typeof window === "undefined") return;
  const json = JSON.stringify(list);
  localStorage.setItem(getOffersStorageKey(vendorId), json);
  window.dispatchEvent(new Event("cloche_offers_updated"));
  window.dispatchEvent(new Event("cloche_vendor_updated"));
  window.dispatchEvent(new Event("cloche_cms_update"));
  window.dispatchEvent(new Event("storage"));
}

/**
 * Retrieve all vendor offers from DB & cache
 */
export function getVendorOffers(vendorId: string = "v-registered"): VendorOffer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getOffersStorageKey(vendorId));
    if (!raw) return [];
    
    const parsed: VendorOffer[] = JSON.parse(raw);
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
      persistOffersToStorage(vendorId, updated);
    }
    return updated;
  } catch (e) {
    return [];
  }
}

function mapDbOffer(row: any): VendorOffer {
  return {
    id: String(row.id),
    vendorId: String(row.vendor_id),
    name: row.name || "Offer",
    type: row.offer_type || "percentage",
    discountType: row.discount_type || "percentage",
    discountValue: String(row.discount_value || "0"),
    packageIds: Array.isArray(row.package_ids) ? row.package_ids : ["all"],
    couponCode: row.coupon_code || "",
    banner: row.banner_url || "",
    mobileBanner: row.mobile_banner_url || row.banner_url || "",
    squareBanner: row.square_banner_url || row.banner_url || "",
    status: row.status || "active",
    startDate: row.start_date || new Date().toISOString().split("T")[0],
    endDate: row.end_date || new Date().toISOString().split("T")[0],
    bookingWindow: row.booking_window || "",
    maxRedemptions: Number(row.max_redemptions || 0),
    currentRedemptions: Number(row.current_redemptions || 0),
    perCustomerLimit: Number(row.per_customer_limit || 0),
    minBookingAmount: Number(row.min_booking_amount || 0),
    minGuests: Number(row.min_guests || 0),
    applicableDays: Array.isArray(row.applicable_days) ? row.applicable_days : [],
    blackoutDates: Array.isArray(row.blackout_dates) ? row.blackout_dates : [],
    ctaText: row.cta_text || "Claim Offer",
    isFeatured: Boolean(row.is_featured),
    isFlashSale: Boolean(row.is_flash_sale),
    flashSaleEndsAt: row.flash_sale_ends_at || undefined,
    termsAndConditions: row.terms_and_conditions || "",
    analytics: row.analytics || { views: 0, clicks: 0, bookings: 0, revenue: 0 },
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  };
}

export async function loadVendorOffersFromDb(vendorId: string): Promise<VendorOffer[]> {
  if (typeof window === "undefined") return [];
  try {
    const res = await fetch("/api/v1/vendor/offers").then((r) => r.json());
    if (!res.success || !Array.isArray(res.data)) return getVendorOffers(vendorId);
    const offers = res.data.map(mapDbOffer);
    persistOffersToStorage(vendorId, offers);
    return offers;
  } catch (e) {
    return getVendorOffers(vendorId);
  }
}

/**
 * Save or update a vendor offer in DB & storage
 */
export function saveVendorOffer(offer: Partial<VendorOffer> & { name: string; vendorId: string }): VendorOffer {
  const existing = getVendorOffers(offer.vendorId);
  const now = new Date().toISOString();
  
  let targetId = offer.id;
  if (!targetId) {
    targetId = `off-${Date.now()}`;
  }

  let finalOffersList = existing;
  if (offer.isFeatured) {
    finalOffersList = existing.map((o) => ({ ...o, isFeatured: false }));
  }

  const newOfferObj: VendorOffer = {
    id: targetId,
    vendorId: offer.vendorId || "v-registered",
    name: offer.name,
    type: offer.type || "percentage",
    discountType: offer.discountType || "percentage",
    discountValue: offer.discountValue || "10",
    packageIds: offer.packageIds && offer.packageIds.length > 0 ? offer.packageIds : ["all"],
    couponCode: offer.couponCode || "",
    banner: offer.banner || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
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

  persistOffersToStorage(offer.vendorId, updatedList);

  // Sync to Supabase DB
  try {
    fetch("/api/v1/vendor/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      id: newOfferObj.id,
      name: newOfferObj.name,
      offer_type: newOfferObj.type,
      discount_type: newOfferObj.discountType,
      discount_value: newOfferObj.discountValue,
      coupon_code: newOfferObj.couponCode,
      banner_url: newOfferObj.banner,
      status: newOfferObj.status,
      start_date: newOfferObj.startDate,
      end_date: newOfferObj.endDate,
      is_featured: newOfferObj.isFeatured,
      is_flash_sale: newOfferObj.isFlashSale,
      }),
    }).catch(() => null);
  } catch (e) {}

  return newOfferObj;
}

/**
 * Delete a vendor offer
 */
export function deleteVendorOffer(offerId: string, vendorId: string = "v-registered"): boolean {
  const existing = getVendorOffers(vendorId);
  const filtered = existing.filter((o) => o.id !== offerId);
  persistOffersToStorage(vendorId, filtered);
  try {
    fetch(`/api/v1/vendor/offers?id=${encodeURIComponent(offerId)}`, { method: "DELETE" }).catch(() => null);
  } catch (e) {}
  return true;
}

/**
 * Toggle status of a vendor offer
 */
export function toggleOfferStatus(offerId: string, status: OfferStatus, vendorId: string = "v-registered"): boolean {
  const existing = getVendorOffers(vendorId);
  const updated = existing.map((o) => (o.id === offerId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
  persistOffersToStorage(vendorId, updated);
  try {
    fetch("/api/v1/vendor/offers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: offerId, status }),
    }).catch(() => null);
  } catch (e) {}
  return true;
}

/**
 * Set an offer as Featured
 */
export function toggleFeaturedOffer(offerId: string, vendorId: string = "v-registered"): boolean {
  const existing = getVendorOffers(vendorId);
  const updated = existing.map((o) => ({
    ...o,
    isFeatured: o.id === offerId ? !o.isFeatured : false,
    updatedAt: new Date().toISOString(),
  }));
  persistOffersToStorage(vendorId, updated);
  const target = updated.find((o) => o.id === offerId);
  try {
    fetch("/api/v1/vendor/offers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: offerId, is_featured: Boolean(target?.isFeatured) }),
    }).catch(() => null);
  } catch (e) {}
  return true;
}

/**
 * Retrieve active offers for public profile display
 */
export function getActiveOffersForVenue(vendorId: string = "v-registered"): VendorOffer[] {
  const offers = getVendorOffers(vendorId);
  return offers.filter((o) => o.status === "active");
}

/**
 * Coupon management helper methods
 */
export function getVendorCoupons(vendorId: string = "v-registered"): CouponCode[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getCouponsStorageKey(vendorId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveVendorCoupon(coupon: Partial<CouponCode> & { code: string; vendorId: string }): CouponCode {
  const existing = getVendorCoupons(coupon.vendorId);
  const targetId = coupon.id || `coup-${Date.now()}`;
  const newCoup: CouponCode = {
    id: targetId,
    vendorId: coupon.vendorId || "v-registered",
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

export function toggleCouponStatus(couponId: string, status: "active" | "paused" | "expired", vendorId: string = "v-registered"): void {
  const existing = getVendorCoupons(vendorId);
  const updated = existing.map((c) => (c.id === couponId ? { ...c, status } : c));
  if (typeof window !== "undefined") {
    localStorage.setItem(getCouponsStorageKey(vendorId), JSON.stringify(updated));
  }
}

export function deleteVendorCoupon(couponId: string, vendorId: string = "v-registered"): void {
  const existing = getVendorCoupons(vendorId);
  const filtered = existing.filter((c) => c.id !== couponId);
  if (typeof window !== "undefined") {
    localStorage.setItem(getCouponsStorageKey(vendorId), JSON.stringify(filtered));
  }
}

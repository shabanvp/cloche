/**
 * CLOCHE PLATFORM - PRODUCTION SUPABASE DATABASE CLIENT & REPOSITORY LAYER
 * 
 * Provides unified Supabase PostgreSQL database integration for:
 * - Vendor Profiles & Venues
 * - Cloudinary Multi-Photo Gallery & Custom Amenities
 * - Offers & Coupon Engine
 * - Advertisements & Marketing Campaigns
 * - Bookings & Quote Inquiries
 * - Customer Reviews & Wishlists
 */

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cloche-prod.supabase.co",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key",
  };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("cloche-prod.supabase.co")
  );
}

/**
 * Lightweight Supabase REST API Query Wrapper
 */
export async function supabaseFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: Error | null }> {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return { data: null, error: new Error("Supabase is not configured yet.") };
  }

  try {
    const res = await fetch(`${url}/rest/v1/${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: new Error(`Supabase API error (${res.status}): ${errText}`) };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ----------------------------------------------------
// DATABASE REPOSITORY METHOD WRAPPERS
// ----------------------------------------------------

/**
 * Fetch Vendor Profile from Supabase
 */
export async function fetchVendorProfileFromDb(vendorId: string) {
  return supabaseFetch(`vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`);
}

/**
 * Fetch Venue Gallery Photos from Supabase
 */
export async function fetchVenueGalleryFromDb(vendorId: string) {
  return supabaseFetch(`venue_gallery?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc&select=*`);
}

/**
 * Save Venue Gallery Photo to Supabase
 */
export async function saveVenueGalleryToDb(photoRecord: {
  vendor_id: string;
  public_id?: string;
  secure_url: string;
  folder?: string;
  alt_text?: string;
  sort_order?: number;
  is_cover?: boolean;
}) {
  return supabaseFetch(`venue_gallery`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(photoRecord),
  });
}

/**
 * Fetch Active Vendor Offers from Supabase
 */
export async function fetchOffersFromDb(vendorId: string) {
  return supabaseFetch(`offers?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.desc&select=*`);
}

/**
 * Save or Update Vendor Offer in Supabase
 */
export async function saveOfferToDb(offerRecord: Record<string, any>) {
  return supabaseFetch(`offers`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(offerRecord),
  });
}

/**
 * Delete Vendor Offer from Supabase
 */
export async function deleteOfferFromDb(offerId: string) {
  return supabaseFetch(`offers?id=eq.${encodeURIComponent(offerId)}`, {
    method: "DELETE",
  });
}

/**
 * Save Booking / Quote Request to Supabase
 */
export async function saveBookingToDb(bookingRecord: Record<string, any>) {
  return supabaseFetch(`bookings`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(bookingRecord),
  });
}

/**
 * Save Review to Supabase
 */
export async function saveReviewToDb(reviewRecord: Record<string, any>) {
  return supabaseFetch(`reviews`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(reviewRecord),
  });
}

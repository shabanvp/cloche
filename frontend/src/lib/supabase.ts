import { deleteImageFromCloudinary } from "./cloudinary";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceKey: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://fumfjbcixcudjrnezfjl.supabase.co";

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "sb_secret_UrI6GZ8y25k5U8HheVLKnQ_LRbo08ox";

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    serviceKey;

  return {
    url,
    anonKey,
    serviceKey,
  };
}

export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return Boolean(config.url && (config.serviceKey || config.anonKey));
}

/**
 * Lightweight Supabase REST API Query Wrapper (Using Service Key for Administrative Writes)
 */
export async function supabaseFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: Error | null }> {
  const { url, serviceKey } = getSupabaseConfig();
  if (!url || !serviceKey) {
    return { data: null, error: new Error("Supabase is not configured yet.") };
  }

  let res: Response | null = null;
  let lastErr: any = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      res = await fetch(`${url}/rest/v1/${endpoint}`, {
        ...options,
        cache: options.cache || "no-store",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          ...options.headers,
        },
      });
      break;
    } catch (err: any) {
      lastErr = err;
      if (attempt < 2) await new Promise((r) => setTimeout(r, 350));
    }
  }

  if (!res) {
    return { data: null, error: lastErr || new Error("Supabase fetch failed after retries.") };
  }

  try {
    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: new Error(`Supabase API error (${res.status}): ${errText}`) };
    }

    const text = await res.text();
    if (!text || text.trim().length === 0) {
      return { data: null, error: null };
    }

    const data = JSON.parse(text);
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

// ----------------------------------------------------
// SUPABASE AUTH GOTRUE API HELPERS
// ----------------------------------------------------

export async function signUpWithSupabaseAuth(
  email: string,
  password: string,
  dataMetadata: Record<string, any> = {},
  emailRedirectTo: string = "https://cloche-six.vercel.app/auth/callback"
): Promise<{ user: any | null; session: any | null; error: Error | null }> {
  const { url, anonKey, serviceKey } = getSupabaseConfig();
  const apiKey = serviceKey || anonKey;
  if (!url || !apiKey) {
    return { user: null, session: null, error: new Error("Supabase credentials unconfigured.") };
  }

  // 1. Prefer Admin API creation with email_confirm: true when serviceKey is available.
  // This bypasses Supabase GoTrue's 3-email-per-hour rate limit ("email rate limit exceeded") completely.
  if (serviceKey) {
    try {
      const adminRes = await fetch(`${url}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          email,
          password,
          email_confirm: true,
          user_metadata: dataMetadata,
        }),
      });

      const adminData = await adminRes.json().catch(() => ({}));
      if (adminRes.ok && adminData?.id) {
        return { user: adminData, session: null, error: null };
      }

      const adminMsg = String(adminData?.msg || adminData?.message || adminData?.error_description || "");
      const lower = adminMsg.toLowerCase();
      if (
        adminRes.status === 422 ||
        adminRes.status === 409 ||
        lower.includes("already") ||
        lower.includes("exists") ||
        lower.includes("registered")
      ) {
        return { user: null, session: null, error: new Error("User already registered") };
      }
    } catch (adminErr) {
      console.warn("[SUPABASE_AUTH] Admin user creation fallback:", adminErr);
    }
  }

  // 2. Fallback to standard signup endpoint
  try {
    const res = await fetch(`${url}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey || apiKey,
      },
      body: JSON.stringify({
        email,
        password,
        data: dataMetadata,
        gotrue_meta_security: {},
        options: {
          emailRedirectTo,
        },
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const rawMsg = data.msg || data.message || data.error_description || "Supabase Auth signup failed.";
      const cleanMsg = rawMsg.toLowerCase().includes("rate limit")
        ? "Signup limit reached. Please wait a minute or log in if you already have an account."
        : rawMsg;
      return { user: null, session: null, error: new Error(cleanMsg) };
    }

    return { user: data.user || data, session: data.session || null, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err };
  }
}

export async function signInWithSupabaseAuth(
  email: string,
  password: string
): Promise<{ user: any | null; session: any | null; error: Error | null }> {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return { user: null, session: null, error: new Error("Supabase credentials unconfigured.") };
  }

  try {
    const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { user: null, session: null, error: new Error(data.error_description || data.msg || data.message || "Invalid login credentials.") };
    }

    return { user: data.user, session: data, error: null };
  } catch (err: any) {
    return { user: null, session: null, error: err };
  }
}

export async function deleteAdminSupabaseUser(authUserId: string): Promise<{ success: boolean; error: Error | null }> {
  const { url, serviceKey } = getSupabaseConfig();
  if (!url || !serviceKey || !authUserId) {
    return { success: false, error: new Error("Missing parameters for admin user deletion.") };
  }

  try {
    const res = await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(authUserId)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: new Error(`Failed to delete Auth user: ${errText}`) };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export async function resendSupabaseAuthEmail(
  email: string,
  emailRedirectTo: string = "https://cloche-six.vercel.app/auth/callback"
): Promise<{ success: boolean; error: Error | null }> {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return { success: false, error: new Error("Supabase credentials unconfigured.") };
  }

  try {
    const res = await fetch(`${url}/auth/v1/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
      },
      body: JSON.stringify({
        type: "signup",
        email,
        options: {
          emailRedirectTo,
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: new Error(data.msg || data.message || data.error_description || "Failed to resend confirmation email.") };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

// ----------------------------------------------------
// DATABASE REPOSITORY METHOD WRAPPERS
// ----------------------------------------------------


export async function fetchVenueGalleryFromDb(vendorId: string) {
  return supabaseFetch(`venue_gallery?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc&select=*`);
}

export async function saveVenueGalleryToDb(photoRecord: Record<string, any>) {
  return supabaseFetch(`venue_gallery`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(photoRecord),
  });
}

export async function fetchOffersFromDb(vendorId: string) {
  return supabaseFetch(`offers?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.desc&select=*`);
}

export async function saveOfferToDb(offerRecord: Record<string, any>) {
  return supabaseFetch(`offers`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(offerRecord),
  });
}

export async function deleteOfferFromDb(offerId: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`offers?id=eq.${encodeURIComponent(offerId)}${vendorFilter}`, {
    method: "DELETE",
  });
}

export async function saveBookingToDb(bookingRecord: Record<string, any>) {
  return supabaseFetch(`bookings`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(bookingRecord),
  });
}

export async function saveReviewToDb(reviewRecord: Record<string, any>) {
  return supabaseFetch(`reviews`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(reviewRecord),
  });
}

// ----------------------------------------------------
// MAKEUP ARTIST REPOSITORY HELPERS
// ----------------------------------------------------

export async function fetchMakeupProfileBySlug(slug: string) {
  return supabaseFetch(`vendors?slug=eq.${encodeURIComponent(slug)}&select=*,makeup_profiles(*)`);
}

export async function fetchMakeupServicesByVendor(vendorId: string) {
  return supabaseFetch(`makeup_services?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.asc&select=*`);
}

export async function fetchMakeupPackagesByVendor(vendorId: string) {
  return supabaseFetch(`makeup_packages?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.asc&select=*`);
}

export async function fetchMakeupPortfolioByVendor(vendorId: string) {
  return supabaseFetch(`makeup_portfolio?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc&select=*`);
}

export async function fetchMakeupVideosByVendor(vendorId: string) {
  return supabaseFetch(`makeup_videos?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`);
}

export async function fetchMakeupReviewsByVendor(vendorId: string) {
  return supabaseFetch(`makeup_reviews?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.desc&select=*`);
}

export async function fetchMakeupFaqsByVendor(vendorId: string) {
  return supabaseFetch(`makeup_faqs?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc&select=*`);
}

export async function fetchMakeupAwardsByVendor(vendorId: string) {
  return supabaseFetch(`makeup_awards?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`);
}

export async function saveMakeupServiceToDb(serviceRecord: Record<string, any>) {
  return supabaseFetch(`makeup_services`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(serviceRecord),
  });
}

export async function deleteMakeupServiceFromDb(id: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`makeup_services?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "DELETE",
  });
}

export async function saveMakeupPackageToDb(packageRecord: Record<string, any>) {
  return supabaseFetch(`makeup_packages`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(packageRecord),
  });
}

export async function deleteMakeupPackageFromDb(id: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`makeup_packages?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "DELETE",
  });
}

export async function saveMakeupPortfolioToDb(portfolioRecord: Record<string, any>) {
  return supabaseFetch(`makeup_portfolio`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(portfolioRecord),
  });
}

export async function deleteMakeupPortfolioFromDb(id: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`makeup_portfolio?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "DELETE",
  });
}

export async function saveMakeupVideoToDb(videoRecord: Record<string, any>) {
  return supabaseFetch(`makeup_videos`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(videoRecord),
  });
}

export async function deleteMakeupVideoFromDb(id: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`makeup_videos?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "DELETE",
  });
}

export async function saveMakeupFaqToDb(faqRecord: Record<string, any>) {
  return supabaseFetch(`makeup_faqs`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(faqRecord),
  });
}

export async function deleteMakeupFaqFromDb(id: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`makeup_faqs?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "DELETE",
  });
}

export async function saveMakeupAwardToDb(awardRecord: Record<string, any>) {
  return supabaseFetch(`makeup_awards`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(awardRecord),
  });
}

export async function deleteMakeupAwardFromDb(id: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`makeup_awards?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "DELETE",
  });
}

// ----------------------------------------------------
// MULTI-CATEGORY SERVICES, PACKAGES & CATALOG HELPERS
// ----------------------------------------------------

export async function fetchVendorServicesFromDb(vendorId: string) {
  return supabaseFetch(`vendor_services?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&order=sort_order.asc,created_at.desc&select=*,vendor_service_images(*)`);
}

export async function saveVendorServiceToDb(record: Record<string, any>) {
  return supabaseFetch(`vendor_services`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(record),
  });
}

export async function softDeleteVendorServiceFromDb(id: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`vendor_services?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "PATCH",
    body: JSON.stringify({ deleted_at: new Date().toISOString(), is_active: false }),
  });
}

export async function fetchVendorPackagesFromDb(vendorId: string) {
  return supabaseFetch(`vendor_service_packages?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&order=sort_order.asc,created_at.desc&select=*`);
}

export async function saveVendorPackageToDb(record: Record<string, any>) {
  return supabaseFetch(`vendor_service_packages`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(record),
  });
}

export async function softDeleteVendorPackageFromDb(id: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`vendor_service_packages?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "PATCH",
    body: JSON.stringify({ deleted_at: new Date().toISOString(), is_active: false }),
  });
}

export async function fetchVendorCatalogFromDb(vendorId: string) {
  return supabaseFetch(`vendor_catalog_items?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&order=sort_order.asc,created_at.desc&select=*,vendor_catalog_images(*)`);
}

export async function saveVendorCatalogItemToDb(record: Record<string, any>) {
  return supabaseFetch(`vendor_catalog_items`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(record),
  });
}

export async function softDeleteVendorCatalogItemFromDb(id: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`vendor_catalog_items?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "PATCH",
    body: JSON.stringify({ deleted_at: new Date().toISOString(), is_available: false }),
  });
}

// ----------------------------------------------------
// VENDOR GALLERY & SHOWCASE MEDIA HELPERS
// ----------------------------------------------------

export async function fetchVendorGalleryFromDb(vendorId: string) {
  if (!vendorId) return { data: [], error: null };
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(vendorId)) return { data: [], error: null };

  const start = Date.now();
  const { data, error } = await supabaseFetch(`vendor_gallery?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.desc&select=*,media(*)`);
  console.log(`[DB:FETCH] table=vendor_gallery vendor_id=${vendorId} rows=${Array.isArray(data) ? data.length : 0} ms=${Date.now() - start}`);

  if (!error && Array.isArray(data)) {
    const formatted = data.map((g: any) => ({
      id: g.id,
      vendor_id: g.vendor_id,
      media_id: g.media_id,
      title: g.caption || "Showcase Photo",
      caption: g.caption || "",
      image_url: g.media?.cdn_url || g.media?.file_path || "",
      is_cover: Boolean(g.is_cover),
      sort_order: g.sort_order || 0,
      created_at: g.created_at
    }));
    return { data: formatted, error: null };
  }
  return { data: [], error };
}

export async function saveVendorGalleryItemInDb(item: {
  id?: string;
  vendor_id: string;
  title?: string;
  category?: string;
  image_url: string;
  is_cover?: boolean;
}) {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!item.vendor_id || !UUID_REGEX.test(item.vendor_id)) {
    return { data: null, error: new Error("Valid vendor UUID is required.") };
  }
  const resolvedVendorId = item.vendor_id;
  
  let mediaId: string | null = null;

  // 1. Check if media row already exists for file_path
  try {
    const existingRes = await supabaseFetch(`media?file_path=eq.${encodeURIComponent(item.image_url)}&select=id`);
    if (!existingRes.error && Array.isArray(existingRes.data) && existingRes.data.length > 0) {
      mediaId = existingRes.data[0].id;
    }
  } catch (e) {}

  // 2. If not found, insert new media row into media table
  if (!mediaId) {
    const startMedia = Date.now();
    const mediaRes = await supabaseFetch(`media`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        vendor_id: resolvedVendorId,
        bucket_name: "vendor-gallery",
        file_path: item.image_url,
        cdn_url: item.image_url,
        original_name: item.title ? `${item.title.substring(0, 30)}.jpg` : "showcase_photo.jpg",
        mime_type: "image/jpeg",
        file_size_bytes: 102400,
        media_type: "image"
      })
    });

    console.log(`[DB:INSERT] table=media vendor_id=${resolvedVendorId} ms=${Date.now() - startMedia}`);
    const mediaRow = Array.isArray(mediaRes.data) ? mediaRes.data[0] : mediaRes.data;
    if (mediaRow?.id) {
      mediaId = mediaRow.id;
    } else {
      const retryRes = await supabaseFetch(`media?file_path=eq.${encodeURIComponent(item.image_url)}&select=id`);
      if (!retryRes.error && Array.isArray(retryRes.data) && retryRes.data.length > 0) {
        mediaId = retryRes.data[0].id;
      }
    }
  }

  if (!mediaId) {
    return { data: null, error: new Error("Unable to resolve media_id for gallery item") };
  }

  // 3. Insert into vendor_gallery table with resolved media_id
  const startGallery = Date.now();
  const galleryPayload: Record<string, any> = {
    vendor_id: resolvedVendorId,
    media_id: mediaId,
    caption: item.title || "Showcase Photo",
    is_cover: Boolean(item.is_cover),
  };

  const res = await supabaseFetch(`vendor_gallery`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(galleryPayload),
  });

  console.log(`[DB:INSERT] table=vendor_gallery vendor_id=${resolvedVendorId} ms=${Date.now() - startGallery}`);
  return res;
}

export async function deleteVendorGalleryItemInDb(id: string, vendorId?: string) {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(id)) return { data: null, error: null };
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";

  try {
    const existingRes = await supabaseFetch(`vendor_gallery?id=eq.${encodeURIComponent(id)}${vendorFilter}&select=media_id,media(public_id)`);
    if (!existingRes.error && Array.isArray(existingRes.data) && existingRes.data.length > 0) {
      const pubId = existingRes.data[0].media?.public_id;
      if (pubId) {
        deleteImageFromCloudinary(pubId).catch(() => null);
      }
    }
  } catch (e) {}

  return supabaseFetch(`vendor_gallery?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "DELETE",
  });
}

// ----------------------------------------------------
// LEAD CRM PIPELINE, TASKS & QUOTATIONS HELPERS
// ----------------------------------------------------

export async function fetchVendorLeadsFromDb(vendorId: string, statusFilter?: string) {
  let query = `leads?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&order=created_at.desc&select=*,lead_notes(*),lead_tasks(*),lead_activities(*)`;
  if (statusFilter && statusFilter !== "all") {
    query = `leads?vendor_id=eq.${encodeURIComponent(vendorId)}&status=eq.${encodeURIComponent(statusFilter)}&deleted_at=is.null&order=created_at.desc&select=*,lead_notes(*),lead_tasks(*),lead_activities(*)`;
  }
  return supabaseFetch(query);
}

export async function saveLeadToDb(record: Record<string, any>) {
  return supabaseFetch(`leads`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(record),
  });
}

export async function updateLeadStatusInDb(id: string, status: string, vendorId?: string) {
  const vendorFilter = vendorId ? `&vendor_id=eq.${encodeURIComponent(vendorId)}` : "";
  return supabaseFetch(`leads?id=eq.${encodeURIComponent(id)}${vendorFilter}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  });
}

export async function saveLeadNoteToDb(record: Record<string, any>) {
  return supabaseFetch(`lead_notes`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(record),
  });
}

export async function saveLeadTaskToDb(record: Record<string, any>) {
  return supabaseFetch(`lead_tasks`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(record),
  });
}

export async function saveLeadActivityToDb(leadId: string, activityType: string, description: string, userId?: string) {
  return supabaseFetch(`lead_activities`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      lead_id: leadId,
      user_id: userId || null,
      activity_type: activityType,
      description,
    }),
  });
}

export async function fetchVendorQuotationsFromDb(vendorId: string) {
  return supabaseFetch(`quotations?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.desc&select=*,quotation_items(*),leads(*)`);
}

export async function saveQuotationToDb(quotationRecord: Record<string, any>) {
  return supabaseFetch(`quotations`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(quotationRecord),
  });
}

export async function saveQuotationItemsToDb(items: Record<string, any>[]) {
  return supabaseFetch(`quotation_items`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(items),
  });
}

// ----------------------------------------------------
// PHASE 8 BOOKING LIFECYCLE, ESCROW & LEDGER HELPERS
// ----------------------------------------------------

export async function fetchVendorBookingsFromDb(vendorId: string, statusFilter?: string) {
  let query = `bookings?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&order=event_date.asc&select=*,booking_timeline(*),booking_payments(*),escrow_accounts(*),leads(*)`;
  if (statusFilter && statusFilter !== "all") {
    query = `bookings?vendor_id=eq.${encodeURIComponent(vendorId)}&status=eq.${encodeURIComponent(statusFilter)}&deleted_at=is.null&order=event_date.asc&select=*,booking_timeline(*),booking_payments(*),escrow_accounts(*),leads(*)`;
  }
  return supabaseFetch(query);
}

export async function convertQuoteToBookingInDb(quotationId: string, vendorId: string, createdBy?: string) {
  return supabaseFetch(`rpc/convert_quotation_to_booking_atomic`, {
    method: "POST",
    body: JSON.stringify({
      p_quotation_id: quotationId,
      p_vendor_id: vendorId,
      p_created_by: createdBy || null,
    }),
  });
}

export async function recordLedgerPaymentInDb(paymentData: Record<string, any>) {
  const { url, serviceKey, anonKey } = getSupabaseConfig();
  const apiKey = serviceKey || anonKey;
  if (!url || !apiKey) return { data: null, error: new Error("Credentials unconfigured.") };

  return supabaseFetch(`payment_records`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(paymentData),
  });
}

export async function recordEscrowTransactionInDb(escrowTxData: Record<string, any>) {
  return supabaseFetch(`escrow_transactions`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(escrowTxData),
  });
}

// ----------------------------------------------------
// PHASE 9 CUSTOMER PORTAL DISCOVERY HELPERS
// ----------------------------------------------------

export async function resolveVendorUuid(vendorId: string): Promise<string | null> {
  if (!vendorId) return null;
  const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(String(vendorId));
  if (isUuid) return String(vendorId);

  try {
    const existing = await supabaseFetch(
      `vendors?vendor_code=eq.${encodeURIComponent(String(vendorId))}&select=id`
    );
    if (existing.data && Array.isArray(existing.data) && existing.data.length > 0) {
      return existing.data[0].id;
    }
  } catch (e) {}

  return null;
}

export async function resolveUserUuid(customerId: string, email?: string): Promise<string | null> {
  if (!customerId && !email) return null;
  if (customerId) {
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(String(customerId));
    if (isUuid) return String(customerId);
  }

  if (email) {
    try {
      const existing = await supabaseFetch(`users?email=eq.${encodeURIComponent(email)}&select=id`);
      if (existing.data && Array.isArray(existing.data) && existing.data.length > 0) {
        return existing.data[0].id;
      }
    } catch (e) {}
  }

  return null;
}

export async function fetchCustomerFavoritesFromDb(customerId: string) {
  const resolvedCustId = await resolveUserUuid(customerId);
  const targetId = resolvedCustId || customerId;

  console.log("[fetchCustomerFavoritesFromDb] Fetching for customer_id:", targetId);

  // 1. Try embedded select query
  const embeddedRes = await supabaseFetch(
    `customer_favorites?customer_id=eq.${encodeURIComponent(targetId)}&select=*,vendors(*,vendor_categories(id,name,slug),vendor_profiles(*,logo_media:media!logo_media_id(cdn_url),cover_media:media!cover_media_id(cdn_url)))`
  );

  if (!embeddedRes.error && Array.isArray(embeddedRes.data)) {
    console.log("[fetchCustomerFavoritesFromDb] Embedded fetch succeeded, count:", embeddedRes.data.length);
    return embeddedRes;
  }

  console.log("[fetchCustomerFavoritesFromDb] Embedded fetch fallback, error:", embeddedRes.error);

  // 2. Fallback to simple select if PostgREST schema relationship is missing
  const simpleRes = await supabaseFetch(
    `customer_favorites?customer_id=eq.${encodeURIComponent(targetId)}&select=*`
  );

  if (!simpleRes.error && Array.isArray(simpleRes.data) && simpleRes.data.length > 0) {
    const vendorIds = simpleRes.data.map((fav: any) => fav.vendor_id).filter(Boolean);
    if (vendorIds.length > 0) {
      const filter = `id=in.(${vendorIds.map((id: string) => encodeURIComponent(id)).join(",")})`;
      const vendorsRes = await supabaseFetch(`vendors?${filter}&select=*,vendor_categories(id,name,slug),vendor_profiles(*,logo_media:media!logo_media_id(cdn_url),cover_media:media!cover_media_id(cdn_url))`);
      const vendorsMap = new Map();
      if (Array.isArray(vendorsRes.data)) {
        vendorsRes.data.forEach((v: any) => vendorsMap.set(v.id, v));
      }

      const merged = simpleRes.data.map((fav: any) => ({
        ...fav,
        vendors: vendorsMap.get(fav.vendor_id) || null,
      }));

      console.log("[fetchCustomerFavoritesFromDb] Fallback fetch merged count:", merged.length);
      return { data: merged, error: null };
    }
  }

  return simpleRes;
}

export async function saveFavoriteVendorInDb(customerId: string, vendorId: string, userEmail?: string) {
  const resolvedCustId = await resolveUserUuid(customerId, userEmail);
  const resolvedVendId = await resolveVendorUuid(vendorId);

  console.log("[saveFavoriteVendorInDb] Resolved customer_id:", resolvedCustId);
  console.log("[saveFavoriteVendorInDb] Resolved vendor_id:", resolvedVendId);

  if (!resolvedCustId || !resolvedVendId) {
    const err = new Error("Unable to resolve valid Customer or Vendor identity.");
    console.error("[saveFavoriteVendorInDb] Error:", err.message);
    return { data: null, error: err };
  }

  // 1. Check if record already exists
  const existing = await supabaseFetch(
    `customer_favorites?customer_id=eq.${encodeURIComponent(resolvedCustId)}&vendor_id=eq.${encodeURIComponent(resolvedVendId)}&select=*`
  );

  if (!existing.error && Array.isArray(existing.data) && existing.data.length > 0) {
    console.log("[saveFavoriteVendorInDb] Record already exists in DB:", existing.data[0]);
    return { data: existing.data[0], error: null };
  }

  // 2. Insert new record
  const insertRes = await supabaseFetch(`customer_favorites`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ customer_id: resolvedCustId, vendor_id: resolvedVendId }),
  });

  console.log("[saveFavoriteVendorInDb] Insert Result:", insertRes.data);
  console.log("[saveFavoriteVendorInDb] Database Error (if any):", insertRes.error);

  return insertRes;
}

export async function removeFavoriteVendorInDb(customerId: string, vendorId: string) {
  const resolvedCustId = await resolveUserUuid(customerId);
  const resolvedVendId = await resolveVendorUuid(vendorId);

  const targetCustId = resolvedCustId || customerId;
  const targetVendId = resolvedVendId || vendorId;

  console.log("[removeFavoriteVendorInDb] Removing customer_id:", targetCustId, "vendor_id:", targetVendId);

  const deleteRes = await supabaseFetch(
    `customer_favorites?customer_id=eq.${encodeURIComponent(targetCustId)}&vendor_id=eq.${encodeURIComponent(targetVendId)}`,
    { method: "DELETE" }
  );

  console.log("[removeFavoriteVendorInDb] Delete Result Error:", deleteRes.error);
  return deleteRes;
}

export async function fetchRecentlyViewedFromDb(customerId: string) {
  const { data, error } = await supabaseFetch(
    `customer_recently_viewed?customer_id=eq.${encodeURIComponent(customerId)}&order=viewed_at.desc&limit=20&select=*,vendors(*)`
  );
  if (error || !Array.isArray(data)) return { data: [], error };

  // Filter out duplicates in-memory as additional safeguard
  const seenVendors = new Set<string>();
  const uniqueItems = data.filter((item: any) => {
    const vId = item.vendor_id || item.vendors?.id;
    if (!vId || seenVendors.has(String(vId))) return false;
    seenVendors.add(String(vId));
    return true;
  });

  return { data: uniqueItems.slice(0, 10), error: null };
}

export async function saveRecentlyViewedInDb(customerId: string, vendorId: string) {
  // 1. Check if entry already exists to update viewed_at without duplicating
  const existing = await supabaseFetch(
    `customer_recently_viewed?customer_id=eq.${encodeURIComponent(customerId)}&vendor_id=eq.${encodeURIComponent(vendorId)}&select=id`
  );

  if (existing.data && Array.isArray(existing.data) && existing.data.length > 0) {
    const rowId = existing.data[0].id;
    return supabaseFetch(`customer_recently_viewed?id=eq.${encodeURIComponent(rowId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ viewed_at: new Date().toISOString() }),
    });
  }

  return supabaseFetch(`customer_recently_viewed`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ customer_id: customerId, vendor_id: vendorId, viewed_at: new Date().toISOString() }),
  });
}

export async function fetchComparisonsFromDb(customerId: string) {
  let res = await supabaseFetch(`vendor_comparisons?customer_id=eq.${encodeURIComponent(customerId)}&select=*,vendor_comparison_items(*,vendors(*))`);
  
  if (!res.data || !Array.isArray(res.data) || res.data.length === 0) {
    // Create default comparison list for customer
    const created = await supabaseFetch(`vendor_comparisons`, {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ customer_id: customerId, comparison_name: "My Vendor Comparison" }),
    });
    if (created.data && Array.isArray(created.data) && created.data.length > 0) {
      return supabaseFetch(`vendor_comparisons?id=eq.${encodeURIComponent(created.data[0].id)}&select=*,vendor_comparison_items(*,vendors(*))`);
    }
  }
  return res;
}

export async function addVendorToComparisonInDb(customerId: string, vendorId: string) {
  const compRes = await fetchComparisonsFromDb(customerId);
  if (!compRes.data || compRes.data.length === 0) return { data: null, error: new Error("Comparison list unavailable.") };

  const compId = compRes.data[0].id;
  const existingItems = compRes.data[0].vendor_comparison_items || [];

  if (existingItems.length >= 4) {
    return { data: null, error: new Error("Maximum 4 vendors can be added to comparison list.") };
  }

  return supabaseFetch(`vendor_comparison_items`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ comparison_id: compId, vendor_id: vendorId }),
  });
}

export async function removeVendorFromComparisonInDb(customerId: string, vendorId: string) {
  const compRes = await fetchComparisonsFromDb(customerId);
  if (!compRes.data || compRes.data.length === 0) return { data: null, error: null };

  const compId = compRes.data[0].id;
  return supabaseFetch(
    `vendor_comparison_items?comparison_id=eq.${encodeURIComponent(compId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`,
    { method: "DELETE" }
  );
}

export async function fetchCustomerNotificationsFromDb(customerId: string, category?: string, limit: number = 20, offset: number = 0) {
  let endpoint = `customer_notifications?customer_id=eq.${encodeURIComponent(customerId)}`;
  if (category && category !== "all") {
    endpoint += `&notification_type=eq.${encodeURIComponent(category)}`;
  }
  endpoint += `&order=created_at.desc&limit=${limit}&offset=${offset}`;

  return supabaseFetch(endpoint);
}

export async function markCustomerNotificationReadInDb(notificationId: string, customerId: string) {
  return supabaseFetch(`customer_notifications?id=eq.${encodeURIComponent(notificationId)}&customer_id=eq.${encodeURIComponent(customerId)}`, {
    method: "PATCH",
    body: JSON.stringify({ is_read: true }),
  });
}

export async function markAllCustomerNotificationsReadInDb(customerId: string) {
  return supabaseFetch(`customer_notifications?customer_id=eq.${encodeURIComponent(customerId)}&is_read=eq.false`, {
    method: "PATCH",
    body: JSON.stringify({ is_read: true }),
  });
}

export async function deleteCustomerNotificationInDb(notificationId: string, customerId: string) {
  return supabaseFetch(`customer_notifications?id=eq.${encodeURIComponent(notificationId)}&customer_id=eq.${encodeURIComponent(customerId)}`, {
    method: "DELETE",
  });
}

export async function fetchEligibleVendorsForReviewFromDb(customerId: string) {
  // Fetch vendors from leads (submitted inquiries)
  const leadsRes = await supabaseFetch(`leads?customer_id=eq.${encodeURIComponent(customerId)}&select=vendor_id,vendors(*)`);
  // Fetch vendors from quotations
  const quotesRes = await supabaseFetch(`quotations?select=vendor_id,vendors(*),leads!inner(customer_id)&leads.customer_id=eq.${encodeURIComponent(customerId)}`);

  const vendorMap = new Map<string, any>();

  if (leadsRes.data && Array.isArray(leadsRes.data)) {
    leadsRes.data.forEach((lead: any) => {
      if (lead.vendor_id && lead.vendors) {
        vendorMap.set(String(lead.vendor_id), lead.vendors);
      }
    });
  }

  if (quotesRes.data && Array.isArray(quotesRes.data)) {
    quotesRes.data.forEach((quote: any) => {
      if (quote.vendor_id && quote.vendors) {
        vendorMap.set(String(quote.vendor_id), quote.vendors);
      }
    });
  }

  return Array.from(vendorMap.values());
}

export async function recalculateVendorRatingInDb(vendorId: string) {
  try {
    // 1. Fetch all published reviews for this vendor
    const res = await supabaseFetch(
      `reviews?vendor_id=eq.${encodeURIComponent(vendorId)}&status=eq.published&select=rating`
    );

    const reviews = Array.isArray(res.data) ? res.data : [];
    const count = reviews.length;
    let avgRating = 0;

    if (count > 0) {
      const sum = reviews.reduce((acc: number, r: any) => acc + Number(r.rating || 0), 0);
      avgRating = Math.round((sum / count) * 10) / 10;
    }

    // 2. Update vendor_profiles rating and review_count denormalized columns
    await supabaseFetch(`vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        rating: avgRating,
        review_count: count,
        updated_at: new Date().toISOString(),
      }),
    });

    return { success: true, rating: avgRating, review_count: count };
  } catch (err: any) {
    console.error("Error recalculating vendor rating:", err);
    return { success: false, error: err.message };
  }
}

export async function saveCustomerReviewInDb(reviewData: Record<string, any>) {
  const { customer_id, vendor_id, rating, review, title } = reviewData;

  // 1. Check if customer already reviewed this vendor
  const existing = await supabaseFetch(
    `reviews?customer_id=eq.${encodeURIComponent(customer_id)}&vendor_id=eq.${encodeURIComponent(vendor_id)}&select=id`
  );

  if (existing.data && Array.isArray(existing.data) && existing.data.length > 0) {
    return {
      data: null,
      error: new Error("You have already submitted a review for this vendor. You can edit or delete your existing review from your dashboard."),
    };
  }

  // 2. Insert into official reviews table
  const insertPayload = {
    customer_id,
    vendor_id,
    rating: Math.max(1, Math.min(5, Math.round(Number(rating)))),
    title: title || "",
    review_text: String(review).trim(),
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const res = await supabaseFetch(`reviews`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(insertPayload),
  });

  if (res.error) {
    // Catch unique constraint if hit concurrently
    if (res.error.message?.includes("uq_reviews_vendor_customer") || res.error.message?.includes("duplicate key")) {
      return {
        data: null,
        error: new Error("You have already submitted a review for this vendor. You can edit or delete your existing review from your dashboard."),
      };
    }
    return res;
  }

  // 3. Trigger recalculation of vendor rating & review count
  await recalculateVendorRatingInDb(vendor_id);

  return res;
}

export async function deleteCustomerReviewInDb(reviewId: string, customerId: string) {
  // 1. Fetch review to get vendor_id
  const getRes = await supabaseFetch(
    `reviews?id=eq.${encodeURIComponent(reviewId)}&customer_id=eq.${encodeURIComponent(customerId)}&select=id,vendor_id`
  );

  const review = Array.isArray(getRes.data) && getRes.data.length > 0 ? getRes.data[0] : null;

  // 2. Delete from reviews table
  const deleteRes = await supabaseFetch(
    `reviews?id=eq.${encodeURIComponent(reviewId)}&customer_id=eq.${encodeURIComponent(customerId)}`,
    { method: "DELETE" }
  );

  // 3. Recalculate vendor rating if deleted
  if (review?.vendor_id) {
    await recalculateVendorRatingInDb(review.vendor_id);
  }

  return deleteRes;
}

export async function fetchCustomerReviewsFromDb(customerId: string) {
  return supabaseFetch(
    `reviews?customer_id=eq.${encodeURIComponent(customerId)}&order=created_at.desc&select=id,rating,title,review_text,status,created_at,vendor_id,vendors(id,vendor_code,vendor_profiles(business_name,city))`
  );
}

export async function updateReviewStatusByAdminInDb(reviewId: string, status: "published" | "flagged" | "hidden") {
  // 1. Fetch review to get vendor_id
  const getRes = await supabaseFetch(
    `reviews?id=eq.${encodeURIComponent(reviewId)}&select=id,vendor_id`
  );
  const review = Array.isArray(getRes.data) && getRes.data.length > 0 ? getRes.data[0] : null;

  // 2. Update status
  const updateRes = await supabaseFetch(`reviews?id=eq.${encodeURIComponent(reviewId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      status,
      updated_at: new Date().toISOString(),
    }),
  });

  // 3. Recalculate vendor rating (hidden reviews excluded from average)
  if (review?.vendor_id) {
    await recalculateVendorRatingInDb(review.vendor_id);
  }

  return updateRes;
}

export async function updateCustomerUserProfileInDb(userId: string, profileData: Record<string, any>) {
  // Filter payload to only include valid Supabase users table columns
  const validColumns = [
    "full_name",
    "name",
    "email",
    "phone",
    "avatar_url",
    "password_hash",
    "is_active",
    "is_verified",
    "updated_at",
  ];

  const sanitized: Record<string, any> = {};
  for (const [key, val] of Object.entries(profileData)) {
    if (validColumns.includes(key)) {
      sanitized[key] = val;
    }
  }
  sanitized.updated_at = new Date().toISOString();

  return supabaseFetch(`users?id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(sanitized),
  });
}

export async function updateQuotationCustomerStatusInDb(quotationId: string, customerId: string, status: string, notes?: string) {
  // Update quotation status (e.g. customer_interested, revision_requested, archived)
  const res = await supabaseFetch(`quotations?id=eq.${encodeURIComponent(quotationId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      status,
      updated_at: new Date().toISOString(),
    }),
  });

  if (res.data && Array.isArray(res.data) && res.data.length > 0) {
    const q = res.data[0];
    if (status === "customer_interested" && q.vendor_id && q.lead_id) {
      // Record lead activity to alert vendor without creating a booking
      await saveLeadActivityToDb(q.lead_id, "customer_interested", `Customer marked quotation #${q.quotation_number || quotationId} as Interested.`, customerId);
    }
  }

  return res;
}

// ----------------------------------------------------
// VENDOR PORTAL DIRECT DATABASE PERSISTENCE HELPERS
// ----------------------------------------------------

export async function fetchVendorProfileFromDb(vendorIdOrUserId: string) {
  if (!vendorIdOrUserId) return { data: null, error: new Error("Vendor ID is required") };

  const start = Date.now();
  const res = await supabaseFetch(
    `vendors?or=(id.eq.${encodeURIComponent(vendorIdOrUserId)},user_id.eq.${encodeURIComponent(vendorIdOrUserId)},vendor_code.eq.${encodeURIComponent(vendorIdOrUserId)})&select=*,vendor_categories(id,name,slug),vendor_profiles(*),vendor_contacts(*),vendor_addresses(*),vendor_social_links(*)`
  );

  console.log(`[DB:FETCH] table=vendors vendorIdOrUserId=${vendorIdOrUserId} rows=${Array.isArray(res.data) ? res.data.length : 0} ms=${Date.now() - start}`);

  if (!res.error && Array.isArray(res.data) && res.data.length > 0) {
    return { data: res.data[0], error: null };
  }

  return { data: null, error: new Error("Vendor record not found in database.") };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function firstRow<T = any>(value: any): T | null {
  return Array.isArray(value) && value.length > 0 ? value[0] : null;
}

function asArray<T = any>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}

function money(value: unknown) {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount <= 0) return "";
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function mediaUrl(row: any) {
  return row?.cdn_url || row?.secure_url || row?.file_path || row?.url || "";
}

async function resolvePublicVendor(identifier: string, options?: { includeNonActive?: boolean }) {
  const id = encodeURIComponent(identifier);
  const statusFilter = options?.includeNonActive ? "" : "&status=eq.active";

  if (UUID_RE.test(identifier)) {
    const byId = await supabaseFetch(`vendors?id=eq.${id}&deleted_at=is.null${statusFilter}&select=*,vendor_categories(name,slug)`);
    const vendor = firstRow(byId.data);
    if (vendor) return { vendor, error: null };
  }

  const byCode = await supabaseFetch(`vendors?vendor_code=eq.${id}&deleted_at=is.null${statusFilter}&select=*,vendor_categories(name,slug)`);
  const codeVendor = firstRow(byCode.data);
  if (codeVendor) return { vendor: codeVendor, error: null };

  const byProfileSlug = await supabaseFetch(`vendor_profiles?slug=eq.${id}&select=vendor_id`);
  const profileSlug = firstRow(byProfileSlug.data);
  if (profileSlug?.vendor_id) {
    const byVendorId = await supabaseFetch(`vendors?id=eq.${encodeURIComponent(profileSlug.vendor_id)}&deleted_at=is.null${statusFilter}&select=*,vendor_categories(name,slug)`);
    const vendor = firstRow(byVendorId.data);
    if (vendor) return { vendor, error: null };
  }

  // Fallback direct vendor_profiles id lookup
  const byProfileId = await supabaseFetch(`vendor_profiles?id=eq.${id}&select=*,vendor_id`);
  const profRow = firstRow(byProfileId.data);
  if (profRow?.vendor_id) {
    const byV = await supabaseFetch(`vendors?id=eq.${encodeURIComponent(profRow.vendor_id)}&deleted_at=is.null${statusFilter}&select=*,vendor_categories(name,slug)`);
    const v = firstRow(byV.data);
    if (v) return { vendor: v, error: null };
  }

  // Check by boutique slug or id
  const boutiqueStatus = options?.includeNonActive ? "" : "&status=eq.active";
  const byBoutiqueSlug = await supabaseFetch(`boutiques?or=(slug.eq.${id},id.eq.${id})${boutiqueStatus}&select=id`);
  const bRow = firstRow(byBoutiqueSlug.data);
  if (bRow?.id) {
    const byBId = await supabaseFetch(`vendors?id=eq.${encodeURIComponent(bRow.id)}&deleted_at=is.null${statusFilter}&select=*,vendor_categories(name,slug)`);
    const vendor = firstRow(byBId.data);
    if (vendor) return { vendor, error: null };
  }

  // Fallback: if identifier is a mock id like 'venue-1', resolve an actual venue
  if (identifier.toLowerCase().includes("venue")) {
    const venueCatRes = await supabaseFetch(`vendor_categories?slug=ilike.*venue*&select=id`);
    const catId = firstRow(venueCatRes.data)?.id;
    if (catId) {
      const byCat = await supabaseFetch(`vendors?category_id=eq.${encodeURIComponent(catId)}&deleted_at=is.null${statusFilter}&order=updated_at.desc&limit=1&select=*,vendor_categories(name,slug)`);
      const v = firstRow(byCat.data);
      if (v) return { vendor: v, error: null };
    }
  }

  return { vendor: null, error: byProfileSlug.error || byCode.error || null };
}

export async function fetchPublicVendorProfileFromDb(identifier: string, options?: { includeNonActive?: boolean }) {
  if (!identifier) return { data: null, error: new Error("Vendor slug or ID is required.") };

  const start = Date.now();
  const resolved = await resolvePublicVendor(identifier, options);
  if (!resolved.vendor) {
    return { data: null, error: resolved.error || new Error("Vendor not found in database.") };
  }

  const vendor: any = resolved.vendor;
  const vendorId = String(vendor.id);
  const categorySlug = (vendor.vendor_categories?.slug || vendor.category || "").toLowerCase();

  const getCategoryTableName = (slug: string): string => {
    const s = (slug || "").toLowerCase();
    if (s.includes("venue")) return "venue_details";
    if (s.includes("photo") || s.includes("video")) return "photographer_details";
    if (s.includes("makeup")) return "makeup_details";
    if (s.includes("cater")) return "catering_details";
    if (s.includes("decor") || s.includes("planner")) return "decorator_details";
    if (s.includes("bridal") || s.includes("boutique") || s.includes("groom") || s.includes("wedding-story") || s.includes("wedding-studio")) return "bridal_wear_details";
    if (s.includes("jewel")) return "jewellery_details";
    if (s.includes("mehendi") || s.includes("mehndi")) return "mehndi_details";
    if (s.includes("invite") || s.includes("card") || s.includes("e-invite") || s.includes("digital-invitation")) return "invitation_details";
    if (s.includes("entertain") || s.includes("dhol") || s.includes("choreo")) return "entertainment_details";
    return "catering_details";
  };

  const extTable = getCategoryTableName(categorySlug);

  const [
    profileRes,
    contactsRes,
    addressRes,
    hoursRes,
    socialRes,
    servicesRes,
    packagesRes,
    galleryRes,
    catalogRes,
    reviewsRes,
    bookingsRes,
    categoryExtRes,
    versionsRes,
  ] = await Promise.all([
    supabaseFetch(`vendor_profiles?or=(vendor_id.eq.${encodeURIComponent(vendorId)},id.eq.${encodeURIComponent(vendorId)})&select=*`),
    supabaseFetch(`vendor_contacts?vendor_id=eq.${encodeURIComponent(vendorId)}&order=is_primary.desc,created_at.asc&select=*`),
    supabaseFetch(`vendor_addresses?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.asc&select=*`),
    supabaseFetch(`vendor_business_hours?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`),
    supabaseFetch(`vendor_social_links?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`),
    supabaseFetch(`vendor_services?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&status=eq.published&is_active=eq.true&order=sort_order.asc,created_at.desc&select=*,vendor_service_images(*)`),
    supabaseFetch(`vendor_service_packages?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&status=eq.published&is_active=eq.true&order=sort_order.asc,created_at.desc&select=*`),
    fetchVendorGalleryFromDb(vendorId),
    supabaseFetch(`vendor_catalog_items?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&status=eq.published&is_available=eq.true&order=sort_order.asc,created_at.desc&select=*,vendor_catalog_images(*)`),
    supabaseFetch(`reviews?vendor_id=eq.${encodeURIComponent(vendorId)}&status=eq.published&order=created_at.desc&select=*`),
    supabaseFetch(`bookings?vendor_id=eq.${encodeURIComponent(vendorId)}&status=eq.completed&select=id`),
    supabaseFetch(`${extTable}?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`).catch(() => ({ data: [], error: null })),
    supabaseFetch(`vendor_profile_versions?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.desc&limit=1&select=id,version_number,vendor_profile_version_sections(*)`).catch(() => ({ data: [], error: null })),
  ]);

  console.log(`[DB:FETCH] public_vendor_profile vendor_id=${vendorId} extTable=${extTable} ms=${Date.now() - start}`);
  console.log(`[RUNTIME_TRACE 5a] Storefront DB fetch request identifier=${identifier}, resolved vendorId=${vendorId}`);

  const profile: any = firstRow(profileRes.data) || {};
  const contact: any = firstRow(contactsRes.data) || {};
  const address: any = firstRow(addressRes.data) || {};
  const categoryDetailRaw: any = firstRow(categoryExtRes.data) || {};
  const services = asArray<any>(servicesRes.data);
  const packages = asArray<any>(packagesRes.data);
  const gallery = asArray<any>(galleryRes.data);
  const catalog = asArray<any>(catalogRes.data);
  const reviews = asArray<any>(reviewsRes.data);
  const completedProjects = asArray(bookingsRes.data).length;

  // Extract saved draft version sections (storefront rich customization, venue spaces, packages, etc.)
  const latestVersion = firstRow(versionsRes?.data);
  const versionSections = asArray<any>(latestVersion?.vendor_profile_version_sections);
  const categoryDetailsSection = versionSections.find((s: any) => s.section_name === "category_details")?.section_payload || {};
  const versionProfile = categoryDetailsSection.profile || {};
  const versionCategoryDetails = categoryDetailsSection.categoryDetails || {};
  const versionSf = versionProfile.storefront || {};

  const categoryDetail = {
    ...versionCategoryDetails,
    ...categoryDetailRaw,
  };

  const mediaIds = [profile.logo_media_id, profile.cover_media_id].filter(Boolean);
  const mediaRes = mediaIds.length
    ? await supabaseFetch(`media?id=in.(${mediaIds.map((m) => encodeURIComponent(String(m))).join(",")})&select=*`)
    : { data: [], error: null };
  const mediaById = new Map(asArray<any>(mediaRes.data).map((row) => [String(row.id), row]));

  const logoUrl = mediaUrl(mediaById.get(String(profile.logo_media_id))) || profile.logo_url || profile.logo || "";
  const coverUrl =
    mediaUrl(mediaById.get(String(profile.cover_media_id))) ||
    profile.cover_image ||
    profile.coverImage ||
    gallery.find((item) => item.is_cover)?.image_url ||
    "";

  const packagePrices = packages.map((pkg) => Number(pkg.discount_price || pkg.price || 0)).filter((price) => price > 0);
  const servicePrices = services.map((svc) => Number(svc.base_price || svc.price || 0)).filter((price) => price > 0);
  const startingAmount =
    packagePrices.length > 0 ? Math.min(...packagePrices) : servicePrices.length > 0 ? Math.min(...servicePrices) : Number(profile.starting_price || 0);
  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : Number(profile.rating || 0);

  const socialLinks = asArray<any>(socialRes.data).reduce<Record<string, string>>((acc, row) => {
    if (row.platform && row.url) acc[String(row.platform)] = String(row.url);
    return acc;
  }, {});

  const businessHours = asArray<any>(hoursRes.data).map((row) => ({
    day: row.day_of_week,
    value: row.is_closed ? "Closed" : [row.open_time, row.close_time].filter(Boolean).join(" - ") || "Not available",
  }));

  const fullAddress = [address.address_line1, address.address_line2, address.city || profile.city, address.state || profile.state, address.pincode]
    .filter(Boolean)
    .join(", ");

  const ownerName = contact.contact_name || vendor.owner_name || profile.owner_name || "";
  const cityVal = profile.city || address.city || "";
  const stateVal = profile.state || address.state || "";
  const serviceAreasVal = vendor.service_areas || profile.service_areas || "";
  let sfRaw: Record<string, any> = {
    ...(versionSf && typeof versionSf === "object" ? versionSf : {}),
  };
  if (typeof profile.storefront === "object" && profile.storefront !== null) {
    sfRaw = { ...sfRaw, ...profile.storefront };
  } else if (typeof profile.storefront === "string") {
    try {
      sfRaw = { ...sfRaw, ...JSON.parse(profile.storefront) };
    } catch (e) {
      // ignore
    }
  }
  const rawSfWH = typeof sfRaw.workingHours === "object" && sfRaw.workingHours !== null ? sfRaw.workingHours : {};

  const workingHoursVal =
    vendor.working_hours ||
    profile.working_hours ||
    profile.workingHours ||
    (rawSfWH.openingTime || rawSfWH.closingTime
      ? `${rawSfWH.openingTime || "10:00 AM"} - ${rawSfWH.closingTime || "08:00 PM"}`
      : categoryDetail.opening_time
      ? `${categoryDetail.opening_time} - ${categoryDetail.closing_time || "08:00 PM"}`
      : "");
  const experienceYearsVal = vendor.experience_years || profile.experience || profile.years_of_experience || "";

  const sfHighlights =
    sfRaw.storeHighlights ||
    categoryDetail.venue_highlights ||
    categoryDetail.mehendi_highlights ||
    categoryDetail.decor_highlights ||
    profile.store_highlights ||
    [];

  const sfCollections = sfRaw.featuredCollections || categoryDetail.featured_halls || profile.featured_collections || [];

  const sfBusinessInfo = {
    experienceYears: sfRaw.businessInfo?.experienceYears || categoryDetail.years_in_business || profile.experience || "",
    rentalAvailable: sfRaw.businessInfo?.rentalAvailable ?? profile.rental_available ?? profile.rentalAvailable ?? false,
    homeDeliveryAvailable: sfRaw.businessInfo?.homeDeliveryAvailable ?? profile.home_delivery_available ?? profile.homeDeliveryAvailable ?? false,
    homeTrialAvailable: sfRaw.businessInfo?.homeTrialAvailable ?? profile.home_trial_available ?? profile.homeTrialAvailable ?? false,
    customJewelleryAvailable: sfRaw.businessInfo?.customJewelleryAvailable ?? profile.custom_jewellery_available ?? profile.customJewelleryAvailable ?? false,
    collectionsCount: sfRaw.businessInfo?.collectionsCount || profile.collections_count || profile.collectionsCount || "",
    guestCapacity: sfRaw.businessInfo?.guestCapacity || categoryDetail.guest_capacity || profile.guest_capacity || "",
    parkingCapacity: sfRaw.businessInfo?.parkingCapacity || categoryDetail.parking_capacity || profile.parking_capacity || "",
  };

  const sfWorkingHours = {
    workingDays: rawSfWH.workingDays || profile.working_days || profile.workingDays || categoryDetail.working_days || vendor.working_days || "",
    openingTime: rawSfWH.openingTime || profile.opening_time || profile.openingTime || categoryDetail.opening_time || vendor.opening_time || "",
    closingTime: rawSfWH.closingTime || profile.closing_time || profile.closingTime || categoryDetail.closing_time || vendor.closing_time || "",
    weeklyOff: rawSfWH.weeklyOff || profile.weekly_off || profile.weeklyOff || categoryDetail.weekly_holidays || categoryDetail.weekly_off || vendor.weekly_off || "",
    holidayNotice: rawSfWH.holidayNotice || profile.holiday_notice || profile.holidayNotice || categoryDetail.public_holiday_availability || categoryDetail.holiday_notice || vendor.holiday_notice || "",
    rawString: workingHoursVal,
  };

  const dbBusinessName = profile.business_name || vendor.boutique_name || vendor.name || "";

  const mergedStorefront = {
    ...sfRaw,
    businessName: dbBusinessName || sfRaw.businessName || "Unnamed Vendor",
    theme: profile.color_theme || sfRaw.theme || "emerald",
    brandColors: sfRaw.brandColors || null,
    coverImage: coverUrl || sfRaw.coverImage || "",
    logo: logoUrl || sfRaw.logo || "",
    tagline: profile.tagline || sfRaw.tagline || "",
    about: profile.about || profile.description || sfRaw.about || "",
    storeHighlights: sfHighlights,
    featuredCollections: sfCollections,
    galleryLayout: profile.gallery_layout || sfRaw.galleryLayout || "grid",
    gallery: gallery.map((item) => ({ url: item.image_url || item.url, caption: item.caption })).length > 0
      ? gallery.map((item) => ({ url: item.image_url || item.url, caption: item.caption }))
      : sfRaw.gallery || [],
    actionButtons: sfRaw.actionButtons || profile.action_buttons || profile.actionButtons || {
      callNow: true,
      whatsapp: true,
      bookAppointment: true,
      viewCollection: true,
      getQuote: true,
      visitStore: true,
    },
    businessInfo: sfBusinessInfo,
    workingHours: sfWorkingHours,
    socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : sfRaw.socialLinks || {},
    contactInfo: {
      phone: contact.phone || vendor.phone || sfRaw.contactInfo?.phone || "",
      whatsapp: contact.whatsapp || contact.phone || vendor.whatsapp || sfRaw.contactInfo?.whatsapp || "",
      email: contact.email || vendor.email || sfRaw.contactInfo?.email || "",
      address: fullAddress || address.address_line1 || sfRaw.contactInfo?.address || "",
      googleMaps: (address.latitude && address.longitude ? `https://www.google.com/maps?q=${address.latitude},${address.longitude}` : address.google_maps_url) || sfRaw.contactInfo?.googleMaps || "",
    },
  };

  const returnedAbout = profile.about || profile.description || sfRaw.about || "";
  console.log(`[RUNTIME_TRACE 5b] Storefront DB profile row about:`, profile.about, "description:", profile.description, "sfRaw.about:", sfRaw.about);
  console.log(`[RUNTIME_TRACE 5c] Storefront final returned about:`, returnedAbout);

  return {
    data: {
      id: vendorId,
      status: vendor.status || "active",
      publicationStatus: vendor.publication_status || "published",
      publication_status: vendor.publication_status || "published",
      slug: profile.slug || vendor.vendor_code || vendorId,
      name: profile.business_name || vendor.boutique_name || vendor.name || "Unnamed Vendor",
      ownerName: ownerName,
      owner_name: ownerName,
      category: vendor.vendor_categories?.slug || categorySlug || "",
      categoryLabel: vendor.vendor_categories?.name || "Vendor Partner",
      location: [cityVal, stateVal].filter(Boolean).join(", "),
      city: cityVal,
      state: stateVal,
      district: stateVal,
      rating: Number(averageRating.toFixed(1)),
      reviews: reviews.length,
      image: coverUrl,
      cover_image: coverUrl,
      coverImage: coverUrl,
      logo: logoUrl,
      logo_url: logoUrl,
      tagline: profile.tagline || sfRaw.tagline || "",
      subtitle: profile.tagline || sfRaw.tagline || "",
      about: profile.about || profile.description || sfRaw.about || "",
      description: profile.about || profile.description || sfRaw.about || "",
      colorTheme: profile.color_theme || sfRaw.theme || "emerald",
      galleryLayout: profile.gallery_layout || sfRaw.galleryLayout || "grid",
      introVideo: profile.intro_video_url || profile.intro_video || "",
      instagram: socialLinks.instagram || contact.instagram || "",
      facebook: socialLinks.facebook || contact.facebook || "",
      youtube: socialLinks.youtube || contact.youtube || "",
      website: socialLinks.website || contact.website || "",
      serviceAreas: serviceAreasVal,
      service_areas: serviceAreasVal,
      workingHours: sfWorkingHours,
      working_hours: workingHoursVal,
      experienceYears: experienceYearsVal,
      experience_years: experienceYearsVal,
      membershipBadge: vendor.plan || profile.plan || "Verified Partner",
      plan: vendor.plan || profile.plan || "Partner",
      isVerified: Boolean(vendor.is_verified || vendor.is_kyc_verified),
      isFeatured: Boolean(vendor.is_featured || profile.is_featured),
      phone: contact.phone || vendor.phone || "",
      whatsapp: contact.whatsapp || contact.phone || vendor.whatsapp || "",
      email: contact.email || vendor.email || "",
      address: fullAddress || address.address_line1 || "",
      googleMaps: address.latitude && address.longitude ? `https://www.google.com/maps?q=${address.latitude},${address.longitude}` : "",
      socialLinks,
      businessHours,
      startingPrice: startingAmount > 0 ? money(startingAmount) : "",
      startingPriceLabel: startingAmount > 0 ? `${money(startingAmount)} onwards` : "Contact for pricing",
      cuisineTypes: categoryDetail.cuisine_types || profile.cuisine_types || [],
      serviceTypes: categoryDetail.service_types || profile.service_types || [],
      serviceLocations: categoryDetail.service_locations || profile.service_locations || [],
      cateringSpecialities: categoryDetail.catering_specialities || profile.catering_specialities || [],
      categoryDetails: categoryDetail,
      // Venue specific fields
      storeHighlights: sfHighlights,
      venueHighlights: sfHighlights,
      featuredHalls: categoryDetail.featured_halls || profile.featured_halls || profile.featuredHalls || sfRaw.featuredHalls || [],
      facilities: categoryDetail.facilities || profile.facilities || sfRaw.facilities || [],
      yearsInBusiness: categoryDetail.years_in_business || sfRaw.yearStarted || experienceYearsVal,
      yearStarted: categoryDetail.years_in_business || sfRaw.yearStarted || experienceYearsVal,
      guestCapacity: categoryDetail.guest_capacity || (categoryDetail.max_capacity ? `${categoryDetail.max_capacity} Guests` : "") || sfRaw.guestCapacity || sfRaw.capacity || profile.guest_capacity || profile.guestCapacity || "",
      minGuestCapacity: categoryDetail.min_guest_capacity || sfRaw.minGuestCapacity || "",
      numberOfHalls: categoryDetail.number_of_halls || sfRaw.numberOfHalls || "",
      roomsCount: categoryDetail.rooms_count || (categoryDetail.guest_rooms ? `${categoryDetail.guest_rooms} Rooms` : "") || sfRaw.roomsCount || sfRaw.guestRooms || profile.rooms_count || profile.roomsCount || "",
      indoorCapacity: categoryDetail.indoor_capacity || sfRaw.indoorCapacity || "",
      outdoorCapacity: categoryDetail.outdoor_capacity || sfRaw.outdoorCapacity || "",
      diningCapacity: categoryDetail.dining_capacity || sfRaw.diningCapacity || "",
      parkingCapacity: categoryDetail.parking_capacity ? (String(categoryDetail.parking_capacity).includes("Car") ? categoryDetail.parking_capacity : `${categoryDetail.parking_capacity} Cars`) : (sfRaw.parkingCapacity || sfRaw.parking || profile.parking_capacity || ""),
      venueType: categoryDetail.venue_type || sfRaw.venueType || profile.venue_type || profile.venueType || "",
      shortDescription: profile.short_description || profile.shortDescription || sfRaw.shortDescription || "",
      hasIndoorSpace: categoryDetail.has_indoor_space ?? profile.has_indoor_space ?? sfRaw.hasIndoorSpace ?? true,
      hasOutdoorSpace: categoryDetail.has_outdoor_space ?? profile.has_outdoor_space ?? sfRaw.hasOutdoorSpace ?? true,
      hasRooftopSpace: categoryDetail.has_rooftop_space ?? profile.has_rooftop_space ?? sfRaw.hasRooftopSpace ?? false,
      hasBridalRoom: categoryDetail.has_bridal_room ?? profile.has_bridal_room ?? sfRaw.hasBridalRoom ?? true,
      hasGroomRoom: categoryDetail.has_groom_room ?? profile.has_groom_room ?? sfRaw.hasGroomRoom ?? true,
      vegPrice: categoryDetail.veg_plate_price || categoryDetail.veg_price || sfRaw.vegPrice || profile.veg_price || profile.vegPrice || "",
      nonVegPrice: categoryDetail.non_veg_plate_price || categoryDetail.non_veg_price || sfRaw.nonVegPrice || profile.non_veg_price || profile.nonVegPrice || "",
      decorStartingPrice: categoryDetail.rental_cost || categoryDetail.decor_starting_price || sfRaw.decorStartingPrice || profile.decor_starting_price || profile.decorStartingPrice || "",
      contactForPricing: Boolean(categoryDetail.contact_for_pricing ?? sfRaw.contactForPricing ?? profile.contact_for_pricing ?? false),
      policySwitches: categoryDetail.policy_switches || profile.policy_switches || sfRaw.policySwitches || {},
      decorationPolicy: categoryDetail.decoration_rules || profile.decoration_rules || sfRaw.decorationPolicy || "",
      cancellationPolicyText: categoryDetail.cancellation_policy || profile.cancellation_policy || sfRaw.cancellationPolicyText || "",
      faqs: categoryDetail.faqs || profile.faqs || sfRaw.faqs || [],
      availabilityNote: categoryDetail.availability_note || profile.availability_note || sfRaw.availabilityNote || "",
      blockedDates: categoryDetail.blocked_dates || profile.blocked_dates || sfRaw.blockedDates || "",
      contactPreferences: categoryDetail.contact_preferences || profile.contact_preferences || sfRaw.contactPreferences || {},
      languagesSpoken: categoryDetail.languages_spoken || sfRaw.languagesSpoken || "",
      contactActions: categoryDetail.contact_actions || sfRaw.contactActions || ["Call Now", "WhatsApp", "Request Quote", "Get Directions", "Website"],
      openingTime: categoryDetail.opening_time || profile.opening_time || sfRaw.openingTime || "",
      closingTime: categoryDetail.closing_time || profile.closing_time || sfRaw.closingTime || "",
      weeklyHolidays: categoryDetail.weekly_holidays || profile.weekly_holidays || sfRaw.weeklyOff || "",
      publicHolidayAvailability: categoryDetail.public_holiday_availability || profile.public_holiday_availability || "",
      venueVisitTimings: categoryDetail.venue_visit_timings || profile.venue_visit_timings || "",
      advanceAppointmentRequired: categoryDetail.advance_appointment_required || false,
      advanceBookingRequired: categoryDetail.advance_booking_required || profile.advance_booking_required || "",
      advancePaymentPolicy: categoryDetail.advance_payment_policy || profile.advance_payment_policy || "",
      cancellationPolicy: categoryDetail.cancellation_policy || profile.cancellation_policy || "",
      refundPolicy: categoryDetail.refund_policy || profile.refund_policy || "",
      overtimeCharges: categoryDetail.overtime_charges || profile.overtime_charges || "",
      decorationRules: categoryDetail.decoration_rules || profile.decoration_rules || "",
      outsideCateringPolicy: categoryDetail.outside_catering_policy || profile.outside_catering_policy || "",
      outsidePhotographyPolicy: categoryDetail.outside_photography_policy || profile.outside_photography_policy || "",
      noiseRestrictions: categoryDetail.noise_restrictions || profile.noise_restrictions || "",
      alcoholPolicy: categoryDetail.alcohol_policy || profile.alcohol_policy || "",
      eventTimingRules: categoryDetail.event_timing_rules || profile.event_timing_rules || "",
      hallImages: categoryDetail.hall_images || sfRaw.hallImages || [],
      // Mehendi Artist specific fields
      mehendiHighlights: sfHighlights,
      mehendi_highlights: sfHighlights,
      featuredPackages: categoryDetail.featured_packages || profile.featured_packages || profile.featuredPackages || [],
      featured_packages: categoryDetail.featured_packages || profile.featured_packages || profile.featuredPackages || [],
      maxBridesPerDay: categoryDetail.max_brides_per_day || profile.max_brides_per_day || profile.maxBridesPerDay || "",
      max_brides_per_day: categoryDetail.max_brides_per_day || profile.max_brides_per_day || profile.maxBridesPerDay || "",
      organicHennaCertified: Boolean(categoryDetail.organic_henna_certified ?? profile.organic_henna_certified ?? false),
      organic_henna_certified: Boolean(categoryDetail.organic_henna_certified ?? profile.organic_henna_certified ?? false),
      teamSize: categoryDetail.team_size || profile.team_size || profile.teamSize || "",
      team_size: categoryDetail.team_size || profile.team_size || profile.teamSize || "",
      outstationAvailable: Boolean(categoryDetail.outstation_available ?? profile.outstation_available ?? false),
      outstation_available: Boolean(categoryDetail.outstation_available ?? profile.outstation_available ?? false),
      stainCarePolicy: categoryDetail.stain_care_policy || profile.stain_care_policy || profile.stainCarePolicy || "",
      stain_care_policy: categoryDetail.stain_care_policy || profile.stain_care_policy || profile.stainCarePolicy || "",
      groupBookingPolicy: categoryDetail.group_booking_policy || profile.group_booking_policy || profile.groupBookingPolicy || "",
      group_booking_policy: categoryDetail.group_booking_policy || profile.group_booking_policy || profile.groupBookingPolicy || "",
      travelPolicy: categoryDetail.travel_policy || profile.travel_policy || profile.travelPolicy || "",
      travel_policy: categoryDetail.travel_policy || profile.travel_policy || profile.travelPolicy || "",
      // Wedding Decorator specific fields
      decorHighlights: sfHighlights,
      decor_highlights: sfHighlights,
      featuredThemes: categoryDetail.featured_themes || profile.featured_themes || profile.featuredThemes || [],
      featured_themes: categoryDetail.featured_themes || profile.featured_themes || profile.featuredThemes || [],
      eventsCompleted: categoryDetail.events_completed || profile.events_completed || profile.eventsCompleted || "",
      events_completed: categoryDetail.events_completed || profile.events_completed || profile.eventsCompleted || "",
      decorServices: categoryDetail.decor_services || profile.decor_services || profile.decorServices || [],
      decor_services: categoryDetail.decor_services || profile.decor_services || profile.decorServices || [],
      setupTeardownPolicy: categoryDetail.setup_teardown_policy || profile.setup_teardown_policy || profile.setupTeardownPolicy || "",
      setup_teardown_policy: categoryDetail.setup_teardown_policy || profile.setup_teardown_policy || profile.setupTeardownPolicy || "",
      propertyDamagePolicy: categoryDetail.property_damage_policy || profile.property_damage_policy || profile.propertyDamagePolicy || "",
      property_damage_policy: categoryDetail.property_damage_policy || profile.property_damage_policy || profile.propertyDamagePolicy || "",
      siteSurveyAvailable: Boolean(categoryDetail.site_survey_available ?? profile.site_survey_available ?? false),
      site_survey_available: Boolean(categoryDetail.site_survey_available ?? profile.site_survey_available ?? false),
      storefront: mergedStorefront,
      featuredCollections: sfCollections,
      actionButtons: mergedStorefront.actionButtons,
      rentalAvailable: sfBusinessInfo.rentalAvailable,
      homeDeliveryAvailable: sfBusinessInfo.homeDeliveryAvailable,
      homeTrialAvailable: sfBusinessInfo.homeTrialAvailable,
      customJewelleryAvailable: sfBusinessInfo.customJewelleryAvailable,
      collectionsCount: sfBusinessInfo.collectionsCount,
      workingDays: sfWorkingHours.workingDays,
      weeklyOff: sfWorkingHours.weeklyOff,
      holidayNotice: sfWorkingHours.holidayNotice,
      stats: [
        { icon: "star", value: reviews.length > 0 ? averageRating.toFixed(1) : "N/A", label: "Average Rating" },
        { icon: "users", value: reviews.length > 0 ? String(reviews.length) : "0", label: "Review Count" },
        { icon: "sparkles", value: completedProjects > 0 ? String(completedProjects) : "0", label: "Completed Projects" },
      ],
      highlightsTitle: "Gallery & Portfolio",
      highlights: gallery.map((item) => ({
        name: item.title || item.caption || "Showcase Photo",
        image: item.image_url,
      })),
      galleryImages: gallery.map((item) => item.image_url).filter(Boolean),
      services: services.map((svc) => ({
        name: svc.name,
        description: svc.description || "",
        price: money(svc.base_price || svc.price),
        pricingType: svc.pricing_type || "",
      })),
      packages: packages.map((pkg) => ({
        name: pkg.name,
        tagline: pkg.tagline || "",
        description: pkg.description || "",
        price: money(pkg.discount_price || pkg.price),
        originalPrice: pkg.discount_price ? money(pkg.price) : "",
        features: Array.isArray(pkg.features) ? pkg.features : [],
        isPopular: Boolean(pkg.is_popular),
      })),
      userReviews: reviews.map((review) => ({
        author: review.customer_name || "Verified Customer",
        rating: Number(review.rating || 0),
        text: review.review_text || review.title || "",
        date: review.created_at || "",
      })),
      collections: catalog.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        image: item.image_url || item.vendor_catalog_images?.[0]?.image_url || "",
        price: money(item.price),
      })),
      amenities: [],
    },
    error: null,
  };
}

export async function saveVendorProfileInDb(vendorId: string, profileData: Record<string, any>) {
  if (!vendorId) return { data: null, error: new Error("Vendor ID is required") };

  const start = Date.now();

  // 1. Update vendor_profiles table
  const profilePayload: Record<string, any> = {
    vendor_id: vendorId,
    business_name: profileData.business_name || profileData.boutique_name || profileData.name,
    tagline: profileData.tagline || null,
    about: profileData.about || profileData.description || null,
    city: profileData.city || profileData.district || "Kochi",
    state: profileData.state || "Kerala",
    pincode: profileData.pincode || null,
    updated_at: new Date().toISOString(),
  };

  const profileRes = await supabaseFetch(`vendor_profiles`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(profilePayload),
  });

  console.log(`[DB:PATCH] table=vendor_profiles vendor_id=${vendorId} ms=${Date.now() - start}`);

  // 2. Upsert primary contact in vendor_contacts table
  if (profileData.phone || profileData.whatsapp || profileData.email) {
    const contactPayload = {
      vendor_id: vendorId,
      phone: profileData.phone || null,
      whatsapp: profileData.whatsapp || profileData.phone || null,
      email: profileData.email || null,
      is_primary: true,
      updated_at: new Date().toISOString(),
    };

    await supabaseFetch(`vendor_contacts`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(contactPayload),
    }).catch(() => null);
  }

  // 3. Upsert social links in vendor_social_links table
  if (profileData.instagram) {
    await supabaseFetch(`vendor_social_links`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ vendor_id: vendorId, platform: "instagram", url: profileData.instagram }),
    }).catch(() => null);
  }
  if (profileData.website) {
    await supabaseFetch(`vendor_social_links`, {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({ vendor_id: vendorId, platform: "website", url: profileData.website }),
    }).catch(() => null);
  }

  // 4. Update completion percentage on vendors table
  await supabaseFetch(`vendors?id=eq.${encodeURIComponent(vendorId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      profile_completion_percentage: profileData.profile_completion_percentage || 80,
      updated_at: new Date().toISOString(),
    }),
  }).catch(() => null);

  return profileRes;
}





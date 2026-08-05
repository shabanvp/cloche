/**
 * CLOCHE PLATFORM - PRODUCTION SUPABASE DATABASE CLIENT & REPOSITORY LAYER
 * 
 * Configured with live Render & Supabase environment credentials
 */

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

  try {
    const res = await fetch(`${url}/rest/v1/${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
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
// SUPABASE AUTH GOTRUE API HELPERS
// ----------------------------------------------------

export async function signUpWithSupabaseAuth(
  email: string,
  password: string,
  dataMetadata: Record<string, any> = {},
  emailRedirectTo: string = "https://cloche-six.vercel.app/auth/callback"
): Promise<{ user: any | null; session: any | null; error: Error | null }> {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return { user: null, session: null, error: new Error("Supabase credentials unconfigured.") };
  }

  try {
    const res = await fetch(`${url}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
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

    const data = await res.json();
    if (!res.ok) {
      return { user: null, session: null, error: new Error(data.msg || data.message || data.error_description || "Supabase Auth signup failed.") };
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

export async function fetchVendorProfileFromDb(vendorId: string) {
  return supabaseFetch(`vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`);
}

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

export async function deleteOfferFromDb(offerId: string) {
  return supabaseFetch(`offers?id=eq.${encodeURIComponent(offerId)}`, {
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

export async function deleteMakeupServiceFromDb(id: string) {
  return supabaseFetch(`makeup_services?id=eq.${encodeURIComponent(id)}`, {
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

export async function deleteMakeupPackageFromDb(id: string) {
  return supabaseFetch(`makeup_packages?id=eq.${encodeURIComponent(id)}`, {
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

export async function deleteMakeupPortfolioFromDb(id: string) {
  return supabaseFetch(`makeup_portfolio?id=eq.${encodeURIComponent(id)}`, {
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

export async function deleteMakeupVideoFromDb(id: string) {
  return supabaseFetch(`makeup_videos?id=eq.${encodeURIComponent(id)}`, {
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

export async function deleteMakeupFaqFromDb(id: string) {
  return supabaseFetch(`makeup_faqs?id=eq.${encodeURIComponent(id)}`, {
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

export async function deleteMakeupAwardFromDb(id: string) {
  return supabaseFetch(`makeup_awards?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

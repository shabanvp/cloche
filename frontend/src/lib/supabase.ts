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

export async function softDeleteVendorServiceFromDb(id: string) {
  return supabaseFetch(`vendor_services?id=eq.${encodeURIComponent(id)}`, {
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

export async function softDeleteVendorPackageFromDb(id: string) {
  return supabaseFetch(`vendor_service_packages?id=eq.${encodeURIComponent(id)}`, {
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

export async function softDeleteVendorCatalogItemFromDb(id: string) {
  return supabaseFetch(`vendor_catalog_items?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ deleted_at: new Date().toISOString(), is_available: false }),
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

export async function updateLeadStatusInDb(id: string, status: string) {
  return supabaseFetch(`leads?id=eq.${encodeURIComponent(id)}`, {
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

export async function fetchCustomerFavoritesFromDb(customerId: string) {
  return supabaseFetch(`customer_favorites?customer_id=eq.${encodeURIComponent(customerId)}&select=*,vendors(*)`);
}

export async function saveFavoriteVendorInDb(customerId: string, vendorId: string) {
  return supabaseFetch(`customer_favorites`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ customer_id: customerId, vendor_id: vendorId }),
  });
}

export async function removeFavoriteVendorInDb(customerId: string, vendorId: string) {
  return supabaseFetch(`customer_favorites?customer_id=eq.${encodeURIComponent(customerId)}&vendor_id=eq.${encodeURIComponent(vendorId)}`, {
    method: "DELETE",
  });
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

export async function saveCustomerReviewInDb(reviewData: Record<string, any>) {
  // Verify interaction before inserting
  const eligible = await fetchEligibleVendorsForReviewFromDb(reviewData.customer_id);
  const isEligible = eligible.some((v) => String(v.id) === String(reviewData.vendor_id));

  if (!isEligible && eligible.length > 0) {
    return { data: null, error: new Error("You can only submit reviews for vendors you have inquired with or received quotations from.") };
  }

  return supabaseFetch(`customer_review_drafts`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(reviewData),
  });
}

export async function deleteCustomerReviewInDb(reviewId: string, customerId: string) {
  return supabaseFetch(`customer_review_drafts?id=eq.${encodeURIComponent(reviewId)}&customer_id=eq.${encodeURIComponent(customerId)}`, {
    method: "DELETE",
  });
}

export async function fetchCustomerReviewsFromDb(customerId: string) {
  return supabaseFetch(`customer_review_drafts?customer_id=eq.${encodeURIComponent(customerId)}&order=created_at.desc&select=*,vendors(*)`);
}

export async function updateCustomerUserProfileInDb(userId: string, profileData: Record<string, any>) {
  // Updates existing users table record directly
  return supabaseFetch(`users?id=eq.${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      ...profileData,
      updated_at: new Date().toISOString(),
    }),
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






import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";
import type { AuthenticatedUser } from "@/lib/rbac";

const PHOTOGRAPHER_TOKENS = new Set([
  "photographer",
  "photographers",
  "wedding photographer",
  "wedding photographers",
  "photography",
  "wedding photography",
]);

export function isPhotographerCategory(value?: string | null): boolean {
  if (!value) return false;
  const normalized = value.toLowerCase().trim();
  return PHOTOGRAPHER_TOKENS.has(normalized) || normalized.includes("photograph");
}

export interface PhotographerAuthContext {
  user: AuthenticatedUser;
  userId: string;
  vendorId: string;
  ownerName: string;
  businessName: string;
  slug: string;
  vendor: {
    id: string;
    user_id: string;
    vendor_code: string | null;
    status: string;
    publication_status: string;
    category_id: string | null;
    profile_completion_percentage?: number | null;
    is_verified?: boolean | null;
  };
}

export async function requireAuthenticatedPhotographer(
  req: Request
): Promise<{ context: PhotographerAuthContext | null; response: NextResponse | null }> {
  const auth = await requireAuthenticatedVendor(req);
  if (auth.response || !auth.vendorId || !auth.user) {
    return {
      context: null,
      response:
        auth.response ||
        NextResponse.json({ error: "Unauthorized: Vendor authentication required." }, { status: 401 }),
    };
  }

  const userId = auth.user.userId || auth.user.id;
  const vendorId = auth.vendorId;

  const { data: vendorRows } = await supabaseFetch<any[]>(
    `vendors?id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&select=id,user_id,vendor_code,status,publication_status,category_id,profile_completion_percentage,is_verified,vendor_categories(id,name,slug)&limit=1`
  );

  const vendorRow = Array.isArray(vendorRows) && vendorRows.length > 0 ? vendorRows[0] : null;
  if (!vendorRow) {
    return {
      context: null,
      response: NextResponse.json({ error: "Photographer vendor profile not found." }, { status: 404 }),
    };
  }

  const cat = Array.isArray(vendorRow.vendor_categories)
    ? vendorRow.vendor_categories[0]
    : vendorRow.vendor_categories;

  if (!isPhotographerCategory(cat?.slug) && !isPhotographerCategory(cat?.name)) {
    return {
      context: null,
      response: NextResponse.json(
        { error: "Forbidden: This endpoint is restricted to Photographer vendor accounts." },
        { status: 403 }
      ),
    };
  }

  const [{ data: profileRows }, { data: userRows }] = await Promise.all([
    supabaseFetch<any[]>(
      `vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}&select=business_name,slug&limit=1`
    ),
    supabaseFetch<any[]>(
      `users?id=eq.${encodeURIComponent(userId)}&select=id,email,full_name,name,phone&limit=1`
    ),
  ]);

  const profileRow = Array.isArray(profileRows) && profileRows.length > 0 ? profileRows[0] : null;
  const userRow = Array.isArray(userRows) && userRows.length > 0 ? userRows[0] : null;

  const ownerName =
    userRow?.full_name ||
    userRow?.name ||
    auth.user.fullName ||
    auth.user.email?.split("@")[0] ||
    "Photographer";

  return {
    context: {
      user: auth.user,
      userId,
      vendorId,
      ownerName: String(ownerName).trim(),
      businessName: String(profileRow?.business_name || ownerName || "Photography Studio").trim(),
      slug: String(profileRow?.slug || vendorId).trim(),
      vendor: {
        id: vendorRow.id,
        user_id: vendorRow.user_id,
        vendor_code: vendorRow.vendor_code || null,
        status: vendorRow.status || "active",
        publication_status: vendorRow.publication_status || "published",
        category_id: vendorRow.category_id || null,
        profile_completion_percentage: vendorRow.profile_completion_percentage ?? 0,
        is_verified: Boolean(vendorRow.is_verified),
      },
    },
    response: null,
  };
}

export async function verifyVendorOwnedRow(
  table: string,
  rowId: string,
  vendorId: string,
  extraFilter = ""
): Promise<boolean> {
  if (!rowId || !vendorId) return false;
  const filter = extraFilter ? `&${extraFilter}` : "";
  const { data } = await supabaseFetch<any[]>(
    `${table}?id=eq.${encodeURIComponent(rowId)}&vendor_id=eq.${encodeURIComponent(vendorId)}${filter}&select=id&limit=1`
  );
  return Array.isArray(data) && data.length > 0;
}

export async function checkPublicPhotographerOwner(
  req: Request,
  vendorId: string
): Promise<boolean> {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (!auth.vendorId) return false;
    return auth.vendorId === vendorId;
  } catch {
    return false;
  }
}

export function getPublicStorageBaseUrl(): string {
  const { url } = getSupabaseConfig();
  return url;
}


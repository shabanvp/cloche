import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";
import type { AuthenticatedUser } from "@/lib/rbac";

const MEHENDI_TOKENS = new Set([
  "mehendi",
  "mehndi",
  "henna",
  "mehendi-artist",
  "mehendi artists",
  "mehendi artist",
  "mehndi artist",
  "mehndi artists",
  "mehendi-artists",
  "bridal mehendi",
  "bridal-mehendi",
]);

export function isMehendiCategory(value?: string | null): boolean {
  if (!value) return false;
  const normalized = value.toLowerCase().trim();
  return (
    MEHENDI_TOKENS.has(normalized) ||
    normalized.includes("mehendi") ||
    normalized.includes("mehndi") ||
    normalized.includes("henna")
  );
}

export interface MehendiAuthContext {
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

export async function requireAuthenticatedMehendi(
  req: Request
): Promise<{ context: MehendiAuthContext | null; response: NextResponse | null }> {
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
      response: NextResponse.json({ error: "Mehendi artist vendor profile not found." }, { status: 404 }),
    };
  }

  const cat = Array.isArray(vendorRow.vendor_categories)
    ? vendorRow.vendor_categories[0]
    : vendorRow.vendor_categories;

  if (!isMehendiCategory(cat?.slug) && !isMehendiCategory(cat?.name)) {
    return {
      context: null,
      response: NextResponse.json(
        { error: "Forbidden: This endpoint is restricted to Mehendi Artist vendor accounts." },
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
    "Mehendi Artist";

  const businessName =
    profileRow?.business_name ||
    auth.vendor?.boutique_name ||
    auth.vendor?.name ||
    `${ownerName}'s Henna Art`;

  const slug = profileRow?.slug || vendorId;

  return {
    context: {
      user: auth.user,
      userId,
      vendorId,
      ownerName,
      businessName,
      slug,
      vendor: vendorRow,
    },
    response: null,
  };
}


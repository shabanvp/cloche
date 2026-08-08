import { NextResponse } from "next/server";
import { getAuthenticatedUser, type AuthenticatedUser } from "./rbac";
import { supabaseFetch } from "./supabase";

export type VendorAuthResult =
  | { user: AuthenticatedUser; vendorId: string; response: null }
  | { user: null; vendorId: null; response: NextResponse };

function authError(status: number, code: string, message: string) {
  return NextResponse.json(
    { success: false, statusCode: status, error: { code, message } },
    { status }
  );
}

export async function requireAuthenticatedVendor(req: Request): Promise<VendorAuthResult> {
  const user = getAuthenticatedUser(req as any);
  if (!user) {
    console.warn("[VendorAuth] Unauthorized request: missing or invalid authentication token.");
    return {
      user: null,
      vendorId: null,
      response: authError(401, "UNAUTHORIZED", "Vendor authentication required."),
    };
  }

  const userId = user.userId || user.id;
  const email = user.email || "";

  console.log(`[VendorAuth] Resolving vendor identity: userId=${userId}, email=${email}`);

  // 1. Query vendors by user_id or id (both are valid columns on vendors table)
  const filter = `or=(user_id.eq.${encodeURIComponent(userId)},id.eq.${encodeURIComponent(userId)})`;
  let vendorRes = await supabaseFetch(
    `vendors?${filter}&deleted_at=is.null&select=id&limit=1`
  );

  console.log({ table: "vendors", query: filter, data: vendorRes.data, error: vendorRes.error });

  // 2. Fallback: if not found by user_id/id and email exists, resolve users.id by email -> vendors.user_id
  if (!vendorRes.error && (!Array.isArray(vendorRes.data) || vendorRes.data.length === 0) && email) {
    console.log(`[VendorAuth] Fallback user lookup by email=${email}`);
    const userRes = await supabaseFetch(`users?email=eq.${encodeURIComponent(email)}&select=id&limit=1`);
    console.log({ table: "users", query: `email=eq.${email}`, data: userRes.data, error: userRes.error });

    if (!userRes.error && Array.isArray(userRes.data) && userRes.data[0]?.id) {
      const dbUserId = userRes.data[0].id;
      vendorRes = await supabaseFetch(
        `vendors?user_id=eq.${encodeURIComponent(dbUserId)}&deleted_at=is.null&select=id&limit=1`
      );
      console.log({ table: "vendors", query: `user_id=eq.${dbUserId}`, data: vendorRes.data, error: vendorRes.error });
    }
  }

  if (vendorRes.error) {
    console.error("[VendorAuth] Supabase query exception:", vendorRes.error);
    return {
      user: null,
      vendorId: null,
      response: authError(500, "VENDOR_LOOKUP_FAILED", vendorRes.error.message),
    };
  }

  if (!Array.isArray(vendorRes.data) || !vendorRes.data[0]?.id) {
    console.warn(`[VendorAuth] No vendor record found for user_id=${userId}, email=${email}`);
    return {
      user: null,
      vendorId: null,
      response: authError(404, "VENDOR_NOT_FOUND", "No vendor record found for this account."),
    };
  }

  const vendorId = vendorRes.data[0].id;
  console.log(`[VendorAuth] Successfully authenticated vendor: userId=${userId}, vendorId=${vendorId}`);

  return {
    user,
    vendorId,
    response: null,
  };
}

export async function vendorOwnsRecord(table: string, id: string, vendorId: string) {
  if (!id || !vendorId) return false;

  const res = await supabaseFetch(
    `${table}?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(vendorId)}&select=id`
  );

  return !res.error && Array.isArray(res.data) && res.data.length > 0;
}

export async function vendorOwnsLead(leadId: string, vendorId: string) {
  return vendorOwnsRecord("leads", leadId, vendorId);
}

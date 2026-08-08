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
    return {
      user: null,
      vendorId: null,
      response: authError(401, "UNAUTHORIZED", "Vendor authentication required."),
    };
  }

  // Single fast OR query to resolve vendor ID without sequential roundtrips
  const filter = user.email
    ? `or=(user_id.eq.${encodeURIComponent(user.userId)},id.eq.${encodeURIComponent(user.userId)},email.eq.${encodeURIComponent(user.email)})`
    : `or=(user_id.eq.${encodeURIComponent(user.userId)},id.eq.${encodeURIComponent(user.userId)})`;

  const vendorRes = await supabaseFetch(
    `vendors?${filter}&deleted_at=is.null&select=id&limit=1`
  );

  if (vendorRes.error) {
    return {
      user: null,
      vendorId: null,
      response: authError(500, "VENDOR_LOOKUP_FAILED", vendorRes.error.message),
    };
  }

  if (!Array.isArray(vendorRes.data) || !vendorRes.data[0]?.id) {
    return {
      user: null,
      vendorId: null,
      response: authError(404, "VENDOR_NOT_FOUND", "No vendor record found for this account."),
    };
  }

  return {
    user,
    vendorId: vendorRes.data[0].id,
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

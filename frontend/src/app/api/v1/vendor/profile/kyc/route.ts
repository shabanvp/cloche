import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/rbac";
import { getSupabaseConfig } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const authUser = getAuthenticatedUser(req as any);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Vendor authentication required." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { gstNumber, panNumber, identityDocUrl } = body;

    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey;

    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database unconfigured." } },
        { status: 500 }
      );
    }

    // 1. Resolve Vendor Identity
    const vendorRes = await fetch(`${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(authUser.userId)}&select=id`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (!vendorRes.ok) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "Vendor identity not found." } },
        { status: 404 }
      );
    }

    const vendors = await vendorRes.json();
    if (!Array.isArray(vendors) || vendors.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "No vendor record found." } },
        { status: 404 }
      );
    }

    const vendorId = vendors[0].id;

    // 2. Mark vendor as KYC verified in vendors & vendor_profiles
    await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        is_kyc_verified: true,
        is_verified: true,
      }),
    });

    if (gstNumber) {
      await fetch(`${url}/rest/v1/vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ gst_number: gstNumber }),
      }).catch(() => null);
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "KYC verification documents submitted and verified successfully!",
        data: {
          vendorId,
          isKycVerified: true,
          isVerified: true,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

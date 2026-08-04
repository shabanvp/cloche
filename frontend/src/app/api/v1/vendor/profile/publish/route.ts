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

    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;

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

    // 2. Update publication status and onboarding stage
    await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        publication_status: "published",
        onboarding_stage: "submitted_for_review",
        profile_completion_percentage: 100,
      }),
    });

    // 3. Mark latest draft version as published
    const verRes = await fetch(`${url}/rest/v1/vendor_profile_versions?vendor_id=eq.${encodeURIComponent(vendorId)}&order=version_number.desc&limit=1&select=id`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    }).catch(() => null);

    if (verRes && verRes.ok) {
      const verRows = await verRes.json();
      if (Array.isArray(verRows) && verRows.length > 0) {
        await fetch(`${url}/rest/v1/vendor_profile_versions?id=eq.${encodeURIComponent(verRows[0].id)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            status: "published",
            published_at: new Date().toISOString(),
          }),
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Vendor profile submitted and published successfully!",
        data: {
          vendorId,
          publicationStatus: "published",
          profileCompletionPercentage: 100,
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

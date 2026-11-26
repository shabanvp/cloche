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
    const { stage, completionPercentage, profileUpdates } = body;

    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey;
    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database unconfigured." } },
        { status: 500 }
      );
    }

    // 1. Fetch vendor by user_id
    const vendorRes = await fetch(`${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(authUser.userId)}&select=id`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (!vendorRes.ok) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "Vendor account not found." } },
        { status: 404 }
      );
    }

    const vendors = await vendorRes.json();
    if (!Array.isArray(vendors) || vendors.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "No vendor record associated with user." } },
        { status: 404 }
      );
    }

    const vendorId = vendors[0].id;
    const updatePayload: any = {};

    if (stage) updatePayload.onboarding_stage = stage;
    if (typeof completionPercentage === "number") updatePayload.profile_completion_percentage = completionPercentage;

    if (stage === "submitted_for_review" || stage === "completed" || stage === "published") {
      updatePayload.status = "active";
      updatePayload.publication_status = "published";
      updatePayload.is_verified = true;
    }

    // 2. Update core vendor record
    if (Object.keys(updatePayload).length > 0) {
      await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(vendorId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(updatePayload),
      });
    }

    // 3. Update vendor profile if fields provided
    if (profileUpdates && typeof profileUpdates === "object") {
      await fetch(`${url}/rest/v1/vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(profileUpdates),
      });
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Onboarding progress updated successfully.",
        data: {
          vendorId,
          stage: updatePayload.onboarding_stage || stage,
          profileCompletionPercentage: updatePayload.profile_completion_percentage || completionPercentage,
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

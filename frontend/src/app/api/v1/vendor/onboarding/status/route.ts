import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/rbac";
import { getSupabaseConfig } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const authUser = getAuthenticatedUser(req as any);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Vendor authentication required." } },
        { status: 401 }
      );
    }

    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database unconfigured." } },
        { status: 500 }
      );
    }

    // 1. Fetch vendor core identity by user_id
    const vendorRes = await fetch(
      `${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(authUser.userId)}&select=id,vendor_code,status,publication_status,onboarding_stage,profile_completion_percentage,is_verified,is_kyc_verified,vendor_categories(name,slug),vendor_profiles(*)`,
      {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      }
    );

    if (!vendorRes.ok) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "Vendor profile not found." } },
        { status: 404 }
      );
    }

    const vendors = await vendorRes.json();
    if (!Array.isArray(vendors) || vendors.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "No vendor account associated with this user." } },
        { status: 404 }
      );
    }

    const vendor = vendors[0];
    const profile = Array.isArray(vendor.vendor_profiles) && vendor.vendor_profiles.length > 0 ? vendor.vendor_profiles[0] : null;

    const checklist = [
      { id: 1, key: "registration", title: "Business Registration", completed: true, stage: "registration_started" },
      { id: 2, key: "details", title: "Business Details & Contact Info", completed: vendor.profile_completion_percentage >= 40, stage: "business_details_added" },
      { id: 3, key: "services", title: "Services & Pricing Packages", completed: vendor.profile_completion_percentage >= 60, stage: "services_added" },
      { id: 4, key: "portfolio", title: "Photo & Video Portfolio", completed: vendor.profile_completion_percentage >= 80, stage: "portfolio_added" },
      { id: 5, key: "review", title: "Admin Quality Review", completed: vendor.publication_status === "published", stage: "submitted_for_review" },
    ];

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: {
          vendorId: vendor.id,
          vendorCode: vendor.vendor_code,
          status: vendor.status,
          publicationStatus: vendor.publication_status,
          onboardingStage: vendor.onboarding_stage,
          profileCompletionPercentage: vendor.profile_completion_percentage,
          category: vendor.vendor_categories?.name || "Vendor",
          profile,
          checklist,
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

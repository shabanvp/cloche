import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/rbac";
import { getSupabaseConfig } from "@/lib/supabase";

function getCategoryTable(categorySlug: string): string {
  const slug = (categorySlug || "").toLowerCase();
  if (slug.includes("venue")) return "venue_details";
  if (slug.includes("photo") || slug.includes("video")) return "photographer_details";
  if (slug.includes("makeup")) return "makeup_details";
  if (slug.includes("cater")) return "catering_details";
  if (slug.includes("decor")) return "decorator_details";
  if (slug.includes("bridal") || slug.includes("boutique")) return "bridal_wear_details";
  if (slug.includes("jewel")) return "jewellery_details";
  if (slug.includes("mehendi") || slug.includes("mehndi")) return "mehndi_details";
  if (slug.includes("invite") || slug.includes("card")) return "invitation_details";
  if (slug.includes("entertain") || slug.includes("dhol") || slug.includes("choreo")) return "entertainment_details";
  return "category_extension_template";
}

export async function GET(req: Request) {
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

    // 1. Fetch vendor core identity by user_id
    let vendorRes = await fetch(
      `${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(authUser.userId)}&select=*,vendor_categories(id,name,slug),vendor_profiles(*),vendor_contacts(*),vendor_addresses(*)`,
      {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }
    );

    let vendors = vendorRes.ok ? await vendorRes.json() : [];

    // If no vendor record exists yet for this authenticated user, auto-provision vendor record
    if (!Array.isArray(vendors) || vendors.length === 0) {
      const vCode = `VND-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const createRes = await fetch(`${url}/rest/v1/vendors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: authUser.userId,
          vendor_code: vCode,
          status: "active",
          publication_status: "published",
          profile_completion_percentage: 80,
          is_verified: true,
        }),
      }).catch(() => null);

      if (createRes && createRes.ok) {
        const createdVendors = await createRes.json();
        if (Array.isArray(createdVendors) && createdVendors.length > 0) {
          const newVendor = createdVendors[0];
          await fetch(`${url}/rest/v1/vendor_profiles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: apiKey,
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              vendor_id: newVendor.id,
              business_name: authUser.fullName || "New Vendor",
              city: "Kochi",
              state: "Kerala",
            }),
          }).catch(() => null);

          // Re-query newly created vendor
          const refetch = await fetch(
            `${url}/rest/v1/vendors?id=eq.${encodeURIComponent(newVendor.id)}&select=*,vendor_categories(id,name,slug),vendor_profiles(*),vendor_contacts(*),vendor_addresses(*)`,
            { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } }
          );
          if (refetch.ok) vendors = await refetch.json();
        }
      }
    }

    if (!Array.isArray(vendors) || vendors.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "No vendor record found for user." } },
        { status: 404 }
      );
    }

    const vendor = vendors[0];
    const profile = Array.isArray(vendor.vendor_profiles) && vendor.vendor_profiles.length > 0 ? vendor.vendor_profiles[0] : null;

    console.log(`[VENDOR_AUTH_DEBUG] Authenticated User ID: ${authUser.userId}`);
    console.log(`[VENDOR_AUTH_DEBUG] Authenticated Email: ${authUser.email}`);
    console.log(`[VENDOR_AUTH_DEBUG] Vendor ID resolved from database: ${vendor.id}`);
    console.log(`[VENDOR_AUTH_DEBUG] Business Name: ${profile?.business_name || vendor.boutique_name || authUser.fullName}`);
    console.log(`[VENDOR_AUTH_DEBUG] Category: ${vendor.vendor_categories?.name || vendor.category || "Vendor"}`);
    console.log(`[VENDOR_AUTH_DEBUG] SQL/API Query: vendors?user_id=eq.${authUser.userId}`);
    const contacts = Array.isArray(vendor.vendor_contacts) ? vendor.vendor_contacts : [];
    const addresses = Array.isArray(vendor.vendor_addresses) ? vendor.vendor_addresses : [];
    const categorySlug = vendor.vendor_categories?.slug || "general";
    const extensionTable = getCategoryTable(categorySlug);

    // 2. Fetch category specific details
    let categoryDetails: any = null;
    if (vendor.id) {
      const extRes = await fetch(`${url}/rest/v1/${extensionTable}?vendor_id=eq.${encodeURIComponent(vendor.id)}&select=*`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }).catch(() => null);

      if (extRes && extRes.ok) {
        const extRows = await extRes.json();
        if (Array.isArray(extRows) && extRows.length > 0) {
          categoryDetails = extRows[0];
        }
      }
    }

    // 3. Fetch current profile versions metadata
    let versions: any[] = [];
    const verRes = await fetch(`${url}/rest/v1/vendor_profile_versions?vendor_id=eq.${encodeURIComponent(vendor.id)}&order=version_number.desc&select=*`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    }).catch(() => null);

    if (verRes && verRes.ok) {
      const verRows = await verRes.json();
      if (Array.isArray(verRows)) versions = verRows;
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: {
          vendor: {
            id: vendor.id,
            vendorCode: vendor.vendor_code,
            status: vendor.status,
            publicationStatus: vendor.publication_status,
            onboardingStage: vendor.onboarding_stage,
            profileCompletionPercentage: vendor.profile_completion_percentage,
            isVerified: vendor.is_verified,
            isKycVerified: vendor.is_kyc_verified,
            category: vendor.vendor_categories,
          },
          profile,
          contacts,
          addresses,
          categoryExtensionTable: extensionTable,
          categoryDetails,
          versions,
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

export async function PUT(req: Request) {
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

    const body = await req.json();
    const { profile, contact, address, categoryDetails, changeSummary } = body;

    // 1. Fetch vendor core record
    const vendorRes = await fetch(`${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(authUser.userId)}&select=id,publication_status,vendor_categories(slug)`, {
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
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "No vendor record associated with user." } },
        { status: 404 }
      );
    }

    const vendor = vendors[0];
    const vendorId = vendor.id;
    const categorySlug = vendor.vendor_categories?.slug || "general";
    const extensionTable = getCategoryTable(categorySlug);

    // 2. Update Vendor Profile in vendor_profiles table
    if (profile && typeof profile === "object") {
      const profilePayload = {
        business_name: profile.businessName || profile.business_name,
        tagline: profile.tagline || null,
        about: profile.about || profile.description || null,
        city: profile.city || "Kochi",
        state: profile.state || "Kerala",
        pincode: profile.pincode || null,
        starting_price: profile.startingPrice || profile.starting_price || null,
        updated_at: new Date().toISOString(),
      };

      await fetch(`${url}/rest/v1/vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(profilePayload),
      });
    }

    // 3. Upsert Category Specific Extension Details
    if (categoryDetails && typeof categoryDetails === "object") {
      const extPayload = {
        vendor_id: vendorId,
        ...categoryDetails,
        updated_at: new Date().toISOString(),
      };

      await fetch(`${url}/rest/v1/${extensionTable}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(extPayload),
      });
    }

    // 4. Create Draft Version Metadata in vendor_profile_versions
    const nextVersionNum = Math.floor(Date.now() / 1000);
    const verRes = await fetch(`${url}/rest/v1/vendor_profile_versions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        vendor_id: vendorId,
        version_number: nextVersionNum,
        status: "draft",
        change_summary: changeSummary || "Updated business & category attributes",
        created_by: authUser.userId,
      }),
    });

    let versionId: string | null = null;
    if (verRes.ok) {
      const verRows = await verRes.json();
      if (Array.isArray(verRows) && verRows.length > 0) {
        versionId = verRows[0].id;
      }
    }

    // 5. Store Version Sections Payload
    if (versionId) {
      await fetch(`${url}/rest/v1/vendor_profile_version_sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          version_id: versionId,
          section_name: "category_details",
          section_payload: { profile, categoryDetails },
        }),
      });
    }

    // 6. Recalculate Profile Completion Percentage
    let completion = 60;
    if (profile?.business_name || profile?.businessName) completion += 10;
    if (profile?.about || profile?.description) completion += 10;
    if (categoryDetails && Object.keys(categoryDetails).length > 0) completion += 20;
    const finalCompletion = Math.min(100, completion);

    await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        profile_completion_percentage: finalCompletion,
        onboarding_stage: finalCompletion >= 80 ? "services_added" : "business_details_added",
      }),
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Vendor profile & category attributes updated successfully.",
        data: {
          vendorId,
          versionNumber: nextVersionNum,
          profileCompletionPercentage: finalCompletion,
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

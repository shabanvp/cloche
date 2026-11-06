import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/rbac";
import { getSupabaseConfig } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Category slug/key to canonical Supabase vendor_categories UUID mapping
const CATEGORY_MAP: Record<string, string> = {
  venue: "c48253f9-f7e8-4cea-b296-22a4cf8890dc",
  venues: "c48253f9-f7e8-4cea-b296-22a4cf8890dc",
  "wedding-venue": "c48253f9-f7e8-4cea-b296-22a4cf8890dc",
  "wedding-venues": "c48253f9-f7e8-4cea-b296-22a4cf8890dc",
  photographer: "5ea30983-409d-4263-b059-0061c3e583d3",
  photographers: "5ea30983-409d-4263-b059-0061c3e583d3",
  "wedding-photographer": "5ea30983-409d-4263-b059-0061c3e583d3",
  "wedding-photographers": "5ea30983-409d-4263-b059-0061c3e583d3",
  videographer: "04b8ec8d-547b-4496-8f19-29e5a1266cc3",
  videographers: "04b8ec8d-547b-4496-8f19-29e5a1266cc3",
  bridal: "2c7e34e1-5945-473b-95ea-a1db34c6c01b",
  "bridal-studio": "2c7e34e1-5945-473b-95ea-a1db34c6c01b",
  groom: "83d80c46-baae-464a-865e-5a5601890401",
  "groom-studio": "83d80c46-baae-464a-865e-5a5601890401",
  studio: "3c71464e-89cd-4ffe-aaeb-ae6e95bcacff",
  "wedding-studio": "3c71464e-89cd-4ffe-aaeb-ae6e95bcacff",
  decorator: "697350dd-7410-461f-a8de-d0c44c315411",
  decorators: "697350dd-7410-461f-a8de-d0c44c315411",
  "wedding-decorators": "697350dd-7410-461f-a8de-d0c44c315411",
  makeup: "06260436-4efe-488f-afe2-4f41e3d9d0f1",
  "makeup-artist": "06260436-4efe-488f-afe2-4f41e3d9d0f1",
  "makeup-artists": "06260436-4efe-488f-afe2-4f41e3d9d0f1",
  "bridal-makeup": "06260436-4efe-488f-afe2-4f41e3d9d0f1",
  jewellery: "5466a413-0225-4622-833f-ef71edc2331a",
  "jewellery-store": "59264ef6-683d-4092-90c9-42fec2ca3900",
  invitation: "f00cf9ac-0f5b-4703-8806-4d25103ecf9b",
  invitations: "f00cf9ac-0f5b-4703-8806-4d25103ecf9b",
  "invitation-designer": "048a9853-dfc2-4d41-ad9f-237e5ef1ff3d",
  planner: "0a02500f-575a-4730-8f04-826048891db6",
  planners: "0a02500f-575a-4730-8f04-826048891db6",
  "wedding-planner": "b32e1241-eb9c-4cb4-8a26-327dfbc83085",
  caterer: "a4332a96-8f1f-4a64-bf96-2a9ad53d40b7",
  catering: "a4332a96-8f1f-4a64-bf96-2a9ad53d40b7",
  "catering-services": "a4332a96-8f1f-4a64-bf96-2a9ad53d40b7",
};

export async function POST(req: Request) {
  try {
    const authUser = getAuthenticatedUser(req as any);
    const body = await req.json().catch(() => ({}));

    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;

    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database unconfigured." } },
        { status: 500 }
      );
    }

    const targetVendorId = body.vendorId || body.vendor_id || body.id;
    const targetUserId = body.userId || body.user_id || authUser?.userId || authUser?.id;
    const targetEmail = (body.email || authUser?.email || "").toString().trim().toLowerCase();
    const categoryKey = (body.categoryKey || body.category || "").toString().trim().toLowerCase();
    const categoryId = body.categoryId || CATEGORY_MAP[categoryKey];

    // 1. Resolve Target Vendor Record
    let vendorId: string | null = null;
    let existingVendor: any = null;

    if (targetVendorId) {
      const vRes = await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(targetVendorId)}&select=*,vendor_profiles(*)`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (vRes.ok) {
        const rows = await vRes.json();
        if (Array.isArray(rows) && rows.length > 0) {
          existingVendor = rows[0];
          vendorId = existingVendor.id;
        }
      }
    }

    if (!vendorId && targetUserId) {
      const vRes = await fetch(`${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(targetUserId)}&select=*,vendor_profiles(*)`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (vRes.ok) {
        const rows = await vRes.json();
        if (Array.isArray(rows) && rows.length > 0) {
          existingVendor = rows[0];
          vendorId = existingVendor.id;
        }
      }
    }

    if (!vendorId && targetEmail) {
      // Lookup public.users by email
      const uRes = await fetch(`${url}/rest/v1/users?email=ilike.${encodeURIComponent(targetEmail)}&select=id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (uRes.ok) {
        const uRows = await uRes.json();
        if (Array.isArray(uRows) && uRows.length > 0) {
          const matchedUserId = uRows[0].id;
          const vRes = await fetch(`${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(matchedUserId)}&select=*,vendor_profiles(*)`, {
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          });
          if (vRes.ok) {
            const rows = await vRes.json();
            if (Array.isArray(rows) && rows.length > 0) {
              existingVendor = rows[0];
              vendorId = existingVendor.id;
            }
          }
        }
      }
    }

    if (!vendorId && targetEmail) {
      // Lookup vendor_contacts by email
      const cRes = await fetch(`${url}/rest/v1/vendor_contacts?email=ilike.${encodeURIComponent(targetEmail)}&select=vendor_id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (cRes.ok) {
        const cRows = await cRes.json();
        if (Array.isArray(cRows) && cRows.length > 0) {
          vendorId = cRows[0].vendor_id;
          const vRes = await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(vendorId!)}&select=*,vendor_profiles(*)`, {
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          });
          if (vRes.ok) {
            const rows = await vRes.json();
            if (Array.isArray(rows) && rows.length > 0) existingVendor = rows[0];
          }
        }
      }
    }

    if (!vendorId) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "Vendor account could not be resolved." } },
        { status: 404 }
      );
    }

    // 2. Prepare Vendor & Profile Updates
    const vendorUpdatePayload: any = {
      status: "active",
      publication_status: "published",
      onboarding_stage: "completed",
      profile_completion_percentage: 100,
      is_verified: true,
      is_kyc_verified: true,
      updated_at: new Date().toISOString(),
    };

    if (categoryId) {
      vendorUpdatePayload.category_id = categoryId;
    }

    // Update vendors table
    await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(vendorUpdatePayload),
    });

    // 3. Update vendor_profiles table
    const profileUpdatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.businessName) profileUpdatePayload.business_name = body.businessName.toString().trim();
    if (body.city) profileUpdatePayload.city = body.city.toString().trim();
    if (body.state) profileUpdatePayload.state = body.state.toString().trim();
    if (body.pincode) profileUpdatePayload.pincode = body.pincode.toString().trim();
    if (body.about) profileUpdatePayload.about = body.about.toString().trim();
    if (typeof body.startingPrice === "number" && !isNaN(body.startingPrice)) {
      profileUpdatePayload.starting_price = body.startingPrice;
    }

    // Ensure cover_media_id is set if available from vendor_gallery
    const currentProfile = Array.isArray(existingVendor?.vendor_profiles) && existingVendor.vendor_profiles.length > 0
      ? existingVendor.vendor_profiles[0]
      : {};

    if (!currentProfile.cover_media_id) {
      const gRes = await fetch(`${url}/rest/v1/vendor_gallery?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.desc&limit=1&select=media_id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (gRes.ok) {
        const gRows = await gRes.json();
        if (Array.isArray(gRows) && gRows.length > 0 && gRows[0].media_id) {
          profileUpdatePayload.cover_media_id = gRows[0].media_id;
        }
      }
    }

    // Execute vendor_profiles PATCH
    await fetch(`${url}/rest/v1/vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(profileUpdatePayload),
    });

    // 4. Mark profile version published
    await fetch(`${url}/rest/v1/vendor_profile_versions?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
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
    }).catch(() => null);

    // 5. Revalidate cache tags and public listing routes
    try {
      revalidatePath("/vendors");
      revalidatePath("/categories");
      revalidatePath("/makeup");
      revalidatePath("/makeup-artists");
      revalidatePath("/venues");
      revalidatePath("/photographers");
      revalidatePath("/api/boutiques");
      revalidatePath("/api/v1/public/vendors");
    } catch (_) {}

    const resolvedSlug = profileUpdatePayload.slug || currentProfile.slug || vendorId;

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: "Vendor profile published successfully! Your page is now live.",
        data: {
          vendorId,
          slug: resolvedSlug,
          status: "active",
          publicationStatus: "published",
          profileCompletionPercentage: 100,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[VENDOR_PUBLISH_ROUTE_ERROR]:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}


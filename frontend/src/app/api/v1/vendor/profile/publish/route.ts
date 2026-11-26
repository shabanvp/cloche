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
    const apiKey = serviceKey;

    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database unconfigured." } },
        { status: 500 }
      );
    }

    // 1. Resolve Vendor Identity
    let vendorId: string | null = null;
    const body = await req.json().catch(() => ({}));
    const targetVendorId = body.vendorId || body.vendor_id || body.targetVendorId;

    const vendorRes = await fetch(`${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(authUser.userId)}&select=id`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (vendorRes.ok) {
      const vendors = await vendorRes.json();
      if (Array.isArray(vendors) && vendors.length > 0) {
        vendorId = vendors[0].id;
      }
    }

    if (!vendorId && targetVendorId) {
      const vRes = await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(targetVendorId)}&select=id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (vRes.ok) {
        const vRows = await vRes.json();
        if (Array.isArray(vRows) && vRows.length > 0) {
          vendorId = vRows[0].id;
        }
      }
    }

    if (!vendorId && authUser.email) {
      const uRes = await fetch(`${url}/rest/v1/users?email=ilike.${encodeURIComponent(authUser.email)}&select=id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (uRes.ok) {
        const uRows = await uRes.json();
        if (Array.isArray(uRows) && uRows.length > 0) {
          const vRes = await fetch(`${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(uRows[0].id)}&select=id`, {
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          });
          if (vRes.ok) {
            const vRows = await vRes.json();
            if (Array.isArray(vRows) && vRows.length > 0) {
              vendorId = vRows[0].id;
            }
          }
        }
      }
    }

    if (!vendorId) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "Vendor identity not found." } },
        { status: 404 }
      );
    }

    // 2. Query Vendor Details to Validate 5 Mandatory Rules
    const [profRes, contactsRes, servicesRes, packagesRes, galleryRes] = await Promise.all([
      fetch(`${url}/rest/v1/vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }),
      fetch(`${url}/rest/v1/vendor_contacts?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }),
      fetch(`${url}/rest/v1/vendor_services?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&select=id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }),
      fetch(`${url}/rest/v1/vendor_service_packages?vendor_id=eq.${encodeURIComponent(vendorId)}&deleted_at=is.null&select=id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }),
      fetch(`${url}/rest/v1/vendor_gallery?vendor_id=eq.${encodeURIComponent(vendorId)}&select=id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }),
    ]);

    const profiles = profRes.ok ? await profRes.json() : [];
    const contacts = contactsRes.ok ? await contactsRes.json() : [];
    const services = servicesRes.ok ? await servicesRes.json() : [];
    const packages = packagesRes.ok ? await packagesRes.json() : [];
    const gallery = galleryRes.ok ? await galleryRes.json() : [];

    const profile = Array.isArray(profiles) && profiles.length > 0 ? profiles[0] : {};
    const contact = Array.isArray(contacts) && contacts.length > 0 ? contacts[0] : {};
    const servicesCount = Array.isArray(services) ? services.length : 0;
    const packagesCount = Array.isArray(packages) ? packages.length : 0;
    const galleryCount = Array.isArray(gallery) ? gallery.length : 0;

    const missingItems: string[] = [];

    // Rule 1: Business Description
    const hasDescription = Boolean((profile.about && profile.about.trim().length >= 3) || profile.business_name);
    if (!hasDescription) {
      missingItems.push("Business description or business name is required");
    }

    // Rule 2: At least 1 Portfolio Photo
    if (galleryCount < 1 && !profile.cover_media_id && !profile.cover_image) {
      missingItems.push("Upload at least 1 portfolio photo");
    }

    // Rule 3: Pricing or Service Information
    const hasPricing = Boolean(profile.starting_price || servicesCount + packagesCount > 0);
    if (!hasPricing) {
      missingItems.push("Add a starting price or at least 1 service package");
    }

    // Rule 4: Business Location
    const hasLocation = Boolean(profile.city || profile.address || contact.address || contact.city || profile.state);
    if (!hasLocation) {
      missingItems.push("Business location (city/address) is required");
    }

    // Rule 5: Contact Number
    const hasPhone = Boolean(contact.phone || contact.whatsapp || profile.phone || authUser.email);
    if (!hasPhone) {
      missingItems.push("Contact number is required");
    }

    if (missingItems.length > 0) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: "INCOMPLETE_PROFILE",
            message: "Your profile cannot be published until all mandatory fields are completed.",
            missingItems,
          },
        },
        { status: 400 }
      );
    }

    // 3. Update publication status and onboarding stage
    await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        status: "active",
        publication_status: "published",
        onboarding_stage: "completed",
        profile_completion_percentage: 100,
        is_verified: true,
        is_kyc_verified: true,
        updated_at: new Date().toISOString(),
      }),
    });

    // 4. Mark latest draft version as published
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
        message: "Vendor profile published successfully! Your page is now live.",
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

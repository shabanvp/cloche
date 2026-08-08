import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";

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
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;

    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;

    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database unconfigured." } },
        { status: 500 }
      );
    }

    const vendorRes = await fetch(
      `${url}/rest/v1/vendors?id=eq.${encodeURIComponent(auth.vendorId)}&select=*,vendor_profiles(*,logo_media:media!logo_media_id(cdn_url),cover_media:media!cover_media_id(cdn_url)),vendor_contacts(*),vendor_addresses(*),vendor_categories(id,name,slug),vendor_social_links(*)`,
      { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } }
    );

    const vendors = vendorRes.ok ? await vendorRes.json() : [];
    if (!Array.isArray(vendors) || vendors.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "VENDOR_NOT_FOUND", message: "No vendor record found for this account." } },
        { status: 404 }
      );
    }

    const vendor = vendors[0];
    const rawProfile = Array.isArray(vendor.vendor_profiles) && vendor.vendor_profiles.length > 0 ? vendor.vendor_profiles[0] : {};
    const contacts = Array.isArray(vendor.vendor_contacts) ? vendor.vendor_contacts : [];
    const addresses = Array.isArray(vendor.vendor_addresses) ? vendor.vendor_addresses : [];
    const category = vendor.vendor_categories || null;
    const socialLinks = Array.isArray(vendor.vendor_social_links) ? vendor.vendor_social_links : [];
    const categorySlug = category?.slug || vendor.category || "general";
    const extensionTable = getCategoryTable(categorySlug);

    let logoUrl = rawProfile.logo_media?.cdn_url || rawProfile.logo_url || "";
    let coverUrl = rawProfile.cover_media?.cdn_url || rawProfile.cover_image || "";

    if ((!logoUrl || !coverUrl) && vendor.id) {
      const mediaRes = await fetch(`${url}/rest/v1/media?vendor_id=eq.${encodeURIComponent(vendor.id)}&order=created_at.desc`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }).catch(() => null);

      if (mediaRes && mediaRes.ok) {
        const mediaList = await mediaRes.json();
        if (Array.isArray(mediaList)) {
          if (!logoUrl) {
            const logoRow = mediaList.find((m: any) => m.file_path?.includes("logos") || m.media_type === "logo");
            if (logoRow?.cdn_url) logoUrl = logoRow.cdn_url;
          }
          if (!coverUrl) {
            const coverRow = mediaList.find((m: any) => m.file_path?.includes("covers") || m.media_type === "cover");
            if (coverRow?.cdn_url) coverUrl = coverRow.cdn_url;
          }
        }
      }
    }

    console.log(`[IMAGE_FLOW] GET profile: Fetched logo URL for vendor ${vendor.id}:`, logoUrl);
    console.log(`[IMAGE_FLOW] GET profile: Fetched cover URL for vendor ${vendor.id}:`, coverUrl);

    const profile = {
      ...rawProfile,
      logo_url: logoUrl,
      cover_image: coverUrl,
    };

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

    const primaryContactName = contacts[0]?.contact_name || auth.user.fullName || "";
    const resolvedContacts = contacts.map((c: any) => ({
      ...c,
      contact_name: c.contact_name || primaryContactName,
    }));

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: {
          vendor: {
            id: vendor.id,
            vendorCode: vendor.vendor_code,
            boutique_name: profile?.business_name || vendor.boutique_name || vendor.name || auth.user.fullName || "",
            name: profile?.business_name || vendor.name || vendor.boutique_name || auth.user.fullName || "",
            owner_name: primaryContactName,
            ownerName: primaryContactName,
            status: vendor.status,
            publicationStatus: vendor.publication_status,
            onboardingStage: vendor.onboarding_stage,
            profileCompletionPercentage: vendor.profile_completion_percentage,
            isVerified: vendor.is_verified,
            isKycVerified: vendor.is_kyc_verified,
            category,
          },
          profile,
          contacts: resolvedContacts.length > 0 ? resolvedContacts : [{ contact_name: primaryContactName }],
          addresses,
          socialLinks,
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
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;

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

    // 1. Fetch authenticated vendor core record
    const vendorRes = await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(auth.vendorId)}&select=id,user_id,publication_status,category_id`, {
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
    let categorySlug = "general";
    if (vendor.category_id) {
      const categoryRes = await fetch(`${url}/rest/v1/vendor_categories?id=eq.${encodeURIComponent(vendor.category_id)}&select=slug`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }).catch(() => null);
      if (categoryRes && categoryRes.ok) {
        const categories = await categoryRes.json();
        if (Array.isArray(categories) && categories[0]?.slug) {
          categorySlug = categories[0].slug;
        }
      }
    }
    const extensionTable = getCategoryTable(categorySlug);

    // Handle logo & cover media inserts
    let logoMediaId: string | null = null;
    let coverMediaId: string | null = null;

    if (profile?.logo || profile?.logo_url) {
      const logoUrl = profile.logo || profile.logo_url;
      const mediaRes = await fetch(`${url}/rest/v1/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: vendor.user_id,
          vendor_id: vendorId,
          media_type: "image",
          bucket_name: "cloudinary",
          file_path: `cloche/vendors/logos/${vendorId}`,
          mime_type: "image/jpeg",
          file_size_bytes: 1024,
          cdn_url: logoUrl,
          original_name: "logo.jpg",
        }),
      }).catch(() => null);

      if (mediaRes && mediaRes.ok) {
        const mData = await mediaRes.json();
        if (Array.isArray(mData) && mData.length > 0) logoMediaId = mData[0].id;
      }
    }

    if (profile?.coverImage || profile?.cover_image) {
      const coverUrl = profile.coverImage || profile.cover_image;
      const mediaRes = await fetch(`${url}/rest/v1/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: vendor.user_id,
          vendor_id: vendorId,
          media_type: "image",
          bucket_name: "cloudinary",
          file_path: `cloche/vendors/covers/${vendorId}`,
          mime_type: "image/jpeg",
          file_size_bytes: 1024,
          cdn_url: coverUrl,
          original_name: "cover.jpg",
        }),
      }).catch(() => null);

      if (mediaRes && mediaRes.ok) {
        const mData = await mediaRes.json();
        if (Array.isArray(mData) && mData.length > 0) coverMediaId = mData[0].id;
      }
    }

    // 2. Update Vendor Profile in vendor_profiles table
    if (profile && typeof profile === "object") {
      const profilePayload: Record<string, any> = {
        business_name: profile.businessName || profile.business_name,
        tagline: profile.tagline || null,
        about: profile.about || profile.description || null,
        city: profile.city || "Kochi",
        state: profile.state || "Kerala",
        pincode: profile.pincode || null,
        starting_price: profile.startingPrice || profile.starting_price || null,
        updated_at: new Date().toISOString(),
      };

      if (logoMediaId) profilePayload.logo_media_id = logoMediaId;
      if (coverMediaId) profilePayload.cover_media_id = coverMediaId;
      if (profile.gstNumber || profile.gst_number) profilePayload.gst_number = profile.gstNumber || profile.gst_number;

      console.log(`[IMAGE_FLOW] PUT profile write: vendor_id=${vendorId}, logoMediaId=${logoMediaId}, coverMediaId=${coverMediaId}`);

      const patchRes = await fetch(`${url}/rest/v1/vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(profilePayload),
      });
      console.log(`[IMAGE_FLOW] PUT profile patch status:`, patchRes.status);
    }

    // 3. Upsert contact, address, and social details for the authenticated vendor
    if (contact && typeof contact === "object") {
      const contactPayload: Record<string, any> = {
        vendor_id: vendorId,
        phone: contact.phone || null,
        whatsapp: contact.whatsapp || contact.phone || null,
        email: contact.email || null,
        is_primary: true,
        updated_at: new Date().toISOString(),
      };
      const ownerVal = contact.contact_name || contact.contactName || contact.owner_name || contact.ownerName;
      if (ownerVal) contactPayload.contact_name = ownerVal;

      await fetch(`${url}/rest/v1/vendor_contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(contactPayload),
      }).catch(() => null);

      if (ownerVal) {
        await fetch(`${url}/rest/v1/vendor_contacts?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ contact_name: ownerVal }),
        }).catch(() => null);
      }
    }

    if (address && typeof address === "object") {
      await fetch(`${url}/rest/v1/vendor_addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          address_line1: address.addressLine1 || address.address || null,
          city: address.city || profile?.city || null,
          state: address.state || profile?.state || null,
          pincode: address.pincode || null,
          updated_at: new Date().toISOString(),
        }),
      }).catch(() => null);
    }

    const socialLinks = [
      { platform: "instagram", url: profile?.instagram || contact?.instagram },
      { platform: "website", url: profile?.website || contact?.website },
    ].filter((link) => link.url);

    for (const link of socialLinks) {
      await fetch(`${url}/rest/v1/vendor_social_links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          vendor_id: vendorId,
          platform: link.platform,
          url: link.url,
          updated_at: new Date().toISOString(),
        }),
      }).catch(() => null);
    }

    // 4. Upsert Category Specific Extension Details
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

    // 5. Create Draft Version Metadata in vendor_profile_versions
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
        created_by: auth.user.userId,
      }),
    });

    let versionId: string | null = null;
    if (verRes.ok) {
      const verRows = await verRes.json();
      if (Array.isArray(verRows) && verRows.length > 0) {
        versionId = verRows[0].id;
      }
    }

    // 6. Store Version Sections Payload
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

    // 7. Recalculate Profile Completion Percentage
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

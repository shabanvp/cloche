import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";

function getCategoryTable(categorySlug: string): string {
  const slug = (categorySlug || "").toLowerCase();
  if (slug.includes("venue")) return "venue_details";
  if (slug.includes("photo") || slug.includes("video")) return "photographer_details";
  if (slug.includes("makeup")) return "makeup_details";
  if (slug.includes("cater")) return "catering_details";
  if (slug.includes("decor") || slug.includes("planner")) return "decorator_details";
  if (slug.includes("bridal") || slug.includes("boutique") || slug.includes("groom") || slug.includes("wedding-story") || slug.includes("wedding-studio")) return "bridal_wear_details";
  if (slug.includes("jewel")) return "jewellery_details";
  if (slug.includes("mehendi") || slug.includes("mehndi")) return "mehndi_details";
  if (slug.includes("invite") || slug.includes("card") || slug.includes("e-invite") || slug.includes("digital-invitation")) return "invitation_details";
  if (slug.includes("entertain") || slug.includes("dhol") || slug.includes("choreo")) return "entertainment_details";
  return "category_extension_template";
}

export async function GET(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) {
      return NextResponse.json(
        {
          success: true,
          statusCode: 200,
          data: {
            vendor: null,
            profile: null,
            contacts: [],
            addresses: [],
            socialLinks: [],
            categoryDetails: null,
            versions: [],
          },
        },
        { status: 200 }
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
    let rawProfile = Array.isArray(vendor.vendor_profiles) && vendor.vendor_profiles.length > 0 ? vendor.vendor_profiles[0] : null;

    if ((!rawProfile || !rawProfile.business_name) && vendor.id) {
      const pDirectRes = await fetch(`${url}/rest/v1/vendor_profiles?vendor_id=eq.${encodeURIComponent(vendor.id)}&select=*`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }
      }).catch(() => null);
      if (pDirectRes && pDirectRes.ok) {
        const pRows = await pDirectRes.json();
        if (Array.isArray(pRows) && pRows.length > 0) {
          rawProfile = pRows[0];
        }
      }
    }
    if (!rawProfile) rawProfile = {};

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

    // Fetch vendor_gallery records for this vendor
    let galleryUrls: string[] = [];
    if (vendor.id) {
      const gRes = await fetch(`${url}/rest/v1/vendor_gallery?vendor_id=eq.${encodeURIComponent(vendor.id)}&order=sort_order.asc,created_at.desc&select=*,media(*)`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }).catch(() => null);
      if (gRes && gRes.ok) {
        const gRows = await gRes.json();
        if (Array.isArray(gRows)) {
          galleryUrls = gRows.map((g: any) => g.media?.cdn_url || g.media?.file_path).filter(Boolean);
        }
      }
    }

    const profile = {
      ...rawProfile,
      logo_url: logoUrl,
      cover_image: coverUrl,
      gallery_images: galleryUrls,
      galleryImages: galleryUrls,
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

    // 4. Fetch real subscription tier from vendor_subscriptions table
    let activePlan: { name: string; code: string; expiresAt?: string } | null = null;
    if (vendor.id) {
      const subRes = await fetch(
        `${url}/rest/v1/vendor_subscriptions?vendor_id=eq.${encodeURIComponent(vendor.id)}&status=eq.active&select=*,plan:subscription_plans(name,code)&order=created_at.desc&limit=1`,
        { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } }
      ).catch(() => null);
      if (subRes && subRes.ok) {
        const subs = await subRes.json();
        if (Array.isArray(subs) && subs.length > 0 && subs[0]?.plan) {
          activePlan = {
            name: subs[0].plan.name,
            code: subs[0].plan.code,
            expiresAt: subs[0].expires_at || subs[0].current_period_end,
          };
        }
      }
    }

    const primaryContactName = contacts[0]?.contact_name || auth.user.fullName || "";
    const resolvedContacts = contacts.map((c: any) => ({
      ...c,
      contact_name: c.contact_name || primaryContactName,
    }));

    const resolvedPlanName = activePlan ? activePlan.name : (vendor.is_verified ? "Verified Partner" : "Registered Partner");
    const resolvedPlanCode = activePlan ? activePlan.code : "free";

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: {
          vendor: {
            id: vendor.id,
            vendorCode: vendor.vendor_code,
            boutique_name: profile?.business_name || vendor.boutique_name || vendor.name || "",
            name: profile?.business_name || vendor.name || vendor.boutique_name || "",
            owner_name: primaryContactName,
            ownerName: primaryContactName,
            status: vendor.status,
            publicationStatus: vendor.publication_status,
            onboardingStage: vendor.onboarding_stage,
            profileCompletionPercentage: vendor.profile_completion_percentage,
            isVerified: vendor.is_verified,
            isKycVerified: vendor.is_kyc_verified,
            category,
            plan: resolvedPlanName,
            planCode: resolvedPlanCode,
            isSubscribed: Boolean(activePlan),
            subscription: activePlan,
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
    const rawProfile = body.profile || body;
    const profile = typeof rawProfile === "object" && rawProfile !== null ? rawProfile : {};
    const rawContact = body.contact || body;
    const contact = typeof rawContact === "object" && rawContact !== null ? rawContact : {};
    const rawAddress = body.address || body;
    const address = typeof rawAddress === "object" && rawAddress !== null ? rawAddress : {};
    const categoryDetails = body.categoryDetails;
    const changeSummary = body.changeSummary;

    const sfWH = profile.storefront?.workingHours || body.storefront?.workingHours || profile.workingHours || body.workingHours || {};
    const workingHoursVal =
      typeof profile.working_hours === "string" ? profile.working_hours :
      typeof profile.workingHours === "string" ? profile.workingHours :
      typeof body.working_hours === "string" ? body.working_hours :
      typeof body.workingHours === "string" ? body.workingHours :
      (sfWH.openingTime || sfWH.closingTime ? `${sfWH.openingTime || "10:00 AM"} - ${sfWH.closingTime || "08:00 PM"}` : null);

    const openingTimeVal = sfWH.openingTime || profile.opening_time || profile.openingTime || body.openingTime || null;
    const closingTimeVal = sfWH.closingTime || profile.closing_time || profile.closingTime || body.closingTime || null;
    const workingDaysVal = sfWH.workingDays || profile.working_days || profile.workingDays || body.workingDays || null;
    const weeklyOffVal = sfWH.weeklyOff || profile.weekly_off || profile.weeklyOff || body.weeklyOff || null;
    const holidayNoticeVal = sfWH.holidayNotice || profile.holiday_notice || profile.holidayNotice || body.holidayNotice || null;

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

    console.log("[RUNTIME_TRACE 3a] Backend Incoming profile.about:", profile.about);
    console.log("[RUNTIME_TRACE 3b] Backend Authenticated Vendor ID:", vendorId);
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

    // Handle logo & cover media inserts with strict URL validation
    let logoMediaId: string | null = null;
    let coverMediaId: string | null = null;
    const isHostedUrl = (urlStr: any) => typeof urlStr === "string" && (urlStr.startsWith("http://") || urlStr.startsWith("https://"));

    if (profile?.logo || profile?.logo_url) {
      const logoUrl = profile.logo || profile.logo_url;
      if (isHostedUrl(logoUrl)) {
        const uniqueLogoPath = `cloche/vendors/logos/${vendorId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
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
            file_path: uniqueLogoPath,
            mime_type: "image/jpeg",
            file_size_bytes: 1024,
            cdn_url: logoUrl,
            original_name: "logo.jpg",
          }),
        }).catch(() => null);

        if (mediaRes && mediaRes.ok) {
          const mData = await mediaRes.json();
          if (Array.isArray(mData) && mData.length > 0) logoMediaId = mData[0].id;
        } else if (mediaRes) {
          const errText = await mediaRes.text().catch(() => "");
          console.warn(`[IMAGE_FLOW] Logo media insert status ${mediaRes.status}:`, errText);
        }
      }
    }

    if (profile?.coverImage || profile?.cover_image) {
      const coverUrl = profile.coverImage || profile.cover_image;
      if (isHostedUrl(coverUrl)) {
        const uniqueCoverPath = `cloche/vendors/covers/${vendorId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
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
            file_path: uniqueCoverPath,
            mime_type: "image/jpeg",
            file_size_bytes: 1024,
            cdn_url: coverUrl,
            original_name: "cover.jpg",
          }),
        }).catch(() => null);

        if (mediaRes && mediaRes.ok) {
          const mData = await mediaRes.json();
          if (Array.isArray(mData) && mData.length > 0) coverMediaId = mData[0].id;
        } else if (mediaRes) {
          const errText = await mediaRes.text().catch(() => "");
          console.warn(`[IMAGE_FLOW] Cover media insert status ${mediaRes.status}:`, errText);
        }
      }
    }

    // Handle gallery media & vendor_gallery inserts
    const galleryArray = Array.isArray(profile?.galleryImages)
      ? profile.galleryImages
      : Array.isArray(profile?.gallery_images)
      ? profile.gallery_images
      : Array.isArray(body?.galleryImages)
      ? body.galleryImages
      : Array.isArray(body?.gallery_images)
      ? body.gallery_images
      : Array.isArray(body?.gallery)
      ? body.gallery
      : null;

    if (galleryArray && Array.isArray(galleryArray)) {
      const validGalleryUrls: string[] = galleryArray
        .map((item: any) => (typeof item === "string" ? item : item?.url || item?.image_url || item?.cdn_url || item?.image))
        .filter((u: any) => isHostedUrl(u));

      // Fetch existing gallery items for vendor to handle deletions and duplicates
      const existingGalleryRes = await fetch(
        `${url}/rest/v1/vendor_gallery?vendor_id=eq.${encodeURIComponent(vendorId)}&select=id,media_id,media!inner(id,cdn_url,file_path)`,
        { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } }
      ).catch(() => null);

      const existingGalleryItems: any[] = (existingGalleryRes && existingGalleryRes.ok) ? await existingGalleryRes.json() : [];
      const existingUrlToItemMap = new Map<string, any>();
      for (const item of existingGalleryItems) {
        const cdn = item.media?.cdn_url || item.media?.file_path;
        if (cdn) existingUrlToItemMap.set(cdn, item);
      }

      // Delete items no longer in validGalleryUrls
      for (const [existingUrl, item] of existingUrlToItemMap.entries()) {
        if (!validGalleryUrls.includes(existingUrl)) {
          await fetch(`${url}/rest/v1/vendor_gallery?id=eq.${encodeURIComponent(item.id)}`, {
            method: "DELETE",
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          }).catch(() => null);
        }
      }

      // Insert new gallery items into media & vendor_gallery
      for (let idx = 0; idx < validGalleryUrls.length; idx++) {
        const gUrl = validGalleryUrls[idx];
        if (!existingUrlToItemMap.has(gUrl)) {
          let mId: string | null = null;
          const checkMediaRes = await fetch(`${url}/rest/v1/media?vendor_id=eq.${encodeURIComponent(vendorId)}&cdn_url=eq.${encodeURIComponent(gUrl)}&select=id`, {
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          }).catch(() => null);

          if (checkMediaRes && checkMediaRes.ok) {
            const mRows = await checkMediaRes.json();
            if (Array.isArray(mRows) && mRows.length > 0) mId = mRows[0].id;
          }

          if (!mId) {
            const uniquePath = `cloche/vendors/gallery/${vendorId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            const newMediaRes = await fetch(`${url}/rest/v1/media`, {
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
                file_path: uniquePath,
                mime_type: "image/jpeg",
                file_size_bytes: 1024,
                cdn_url: gUrl,
                original_name: "gallery.jpg",
              }),
            }).catch(() => null);

            if (newMediaRes && newMediaRes.ok) {
              const mData = await newMediaRes.json();
              if (Array.isArray(mData) && mData.length > 0) mId = mData[0].id;
            }
          }

          if (mId) {
            await fetch(`${url}/rest/v1/vendor_gallery`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: apiKey,
                Authorization: `Bearer ${apiKey}`,
                Prefer: "return=representation",
              },
              body: JSON.stringify({
                vendor_id: vendorId,
                media_id: mId,
                caption: `Showcase Photo ${idx + 1}`,
                is_cover: false,
                sort_order: idx,
              }),
            }).catch(() => null);
          }
        }
      }
    }

    // 2. Update Vendor Profile in vendor_profiles table
    if (profile && typeof profile === "object") {
      const profilePayload: Record<string, any> = {
        business_name: profile.businessName || profile.business_name || profile.name || null,
        tagline: profile.tagline || null,
        about: profile.about || profile.description || null,
        city: profile.city || "Kochi",
        state: profile.state || "Kerala",
        pincode: profile.pincode || null,
        starting_price: profile.startingPrice || profile.starting_price || null,
        storefront: typeof profile.storefront === "object" ? JSON.stringify(profile.storefront) : typeof body.storefront === "object" ? JSON.stringify(body.storefront) : JSON.stringify(profile),
        updated_at: new Date().toISOString(),
      };

      if (logoMediaId) profilePayload.logo_media_id = logoMediaId;
      if (coverMediaId) profilePayload.cover_media_id = coverMediaId;
      console.log(`[IMAGE_FLOW] PUT profile write: vendor_id=${vendorId}, logoMediaId=${logoMediaId}, coverMediaId=${coverMediaId}`);

      // Check if profile row exists for this vendor
      const checkProfileRes = await fetch(
        `${url}/rest/v1/vendor_profiles?or=(vendor_id.eq.${encodeURIComponent(vendorId)},id.eq.${encodeURIComponent(vendorId)})&select=id,vendor_id`,
        { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } }
      ).catch(() => null);

      let existingProfileRow: any = null;
      if (checkProfileRes && checkProfileRes.ok) {
        const rows = await checkProfileRes.json();
        if (Array.isArray(rows) && rows.length > 0) {
          existingProfileRow = rows[0];
        }
      }

      let patchRes: Response | null = null;
      if (existingProfileRow) {
        const filter = existingProfileRow.vendor_id
          ? `vendor_id=eq.${encodeURIComponent(existingProfileRow.vendor_id)}`
          : `id=eq.${encodeURIComponent(existingProfileRow.id)}`;

        patchRes = await fetch(`${url}/rest/v1/vendor_profiles?${filter}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(profilePayload),
        });
      } else {
        // Upsert / Insert new profile row
        const newProfilePayload = {
          id: vendorId,
          vendor_id: vendorId,
          ...profilePayload,
        };
        patchRes = await fetch(`${url}/rest/v1/vendor_profiles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
            Prefer: "resolution=merge-duplicates",
          },
          body: JSON.stringify(newProfilePayload),
        });
      }

      if (!patchRes || !patchRes.ok) {
        const errorText = patchRes ? await patchRes.text() : 'Unknown Network Error';
        console.error('[IMAGE_FLOW] PUT profile patch/post failed:', patchRes?.status, errorText);
        return NextResponse.json({ success: false, statusCode: patchRes?.status || 500, error: { message: 'Database Save Failed: ' + errorText } }, { status: patchRes?.status || 500 });
      }

      // Read back updated row directly from Supabase DB to verify persistence
      const readbackRes = await fetch(`${url}/rest/v1/vendor_profiles?or=(vendor_id.eq.${encodeURIComponent(vendorId)},id.eq.${encodeURIComponent(vendorId)})&select=*`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }
      }).catch(() => null);
      if (readbackRes && readbackRes.ok) {
        const rbRows = await readbackRes.json();
        const rbRow = Array.isArray(rbRows) && rbRows.length > 0 ? rbRows[0] : null;
        console.log("[RUNTIME_TRACE 4] DB Readback vendor_profiles row about:", rbRow?.about, "business_name:", rbRow?.business_name);
      }

      console.log(`[IMAGE_FLOW] PUT profile patch/post status:`, patchRes?.status);
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
      { platform: "facebook", url: profile?.facebook || contact?.facebook },
      { platform: "youtube", url: profile?.youtube || contact?.youtube },
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
    const mergedCategoryDetails = {
      ...(categoryDetails || {}),
      ...(profile?.cuisineTypes || profile?.cuisine_types ? { cuisine_types: profile.cuisineTypes || profile.cuisine_types } : {}),
      ...(profile?.serviceTypes || profile?.service_types ? { service_types: profile.serviceTypes || profile.service_types } : {}),
      ...(profile?.serviceLocations || profile?.service_locations ? { service_locations: profile.serviceLocations || profile.service_locations } : {}),
      ...(profile?.guestCapacity || profile?.guest_capacity ? { guest_capacity: profile.guestCapacity || profile.guest_capacity } : {}),
      ...(profile?.cateringSpecialities || profile?.catering_specialities ? { catering_specialities: profile.cateringSpecialities || profile.catering_specialities } : {}),
      
      // Bridal / Groom Wear specific extension fields
      ...(profile?.rentalAvailable !== undefined || profile?.rental_available !== undefined ? { rental_available: Boolean(profile?.rentalAvailable ?? profile?.rental_available) } : {}),
      ...(profile?.customStitching !== undefined || profile?.custom_stitching !== undefined ? { custom_stitching: Boolean(profile?.customStitching ?? profile?.custom_stitching) } : {}),
      ...(profile?.outfitTypes || profile?.outfit_types ? { outfit_types: profile.outfitTypes || profile.outfit_types } : {}),
      ...(profile?.leadTimeWeeks || profile?.lead_time_weeks ? { lead_time_weeks: profile.leadTimeWeeks || profile.lead_time_weeks } : {}),
      ...(profile?.rentalDuration || profile?.rental_duration ? { rental_duration: profile.rentalDuration || profile.rental_duration } : {}),
      ...(profile?.securityDepositPolicy || profile?.security_deposit_policy ? { security_deposit_policy: profile.securityDepositPolicy || profile.security_deposit_policy } : {}),
      ...(profile?.damagePolicy || profile?.damage_policy ? { damage_policy: profile.damagePolicy || profile.damage_policy } : {}),
      ...(profile?.returnPolicy || profile?.return_policy ? { return_policy: profile.returnPolicy || profile.return_policy } : {}),
      ...(profile?.storeHighlights || profile?.store_highlights ? { store_highlights: profile.storeHighlights || profile.store_highlights } : {}),
      ...(profile?.featuredCollections || profile?.featured_collections ? { featured_collections: profile.featuredCollections || profile.featured_collections } : {}),
      
      ...(openingTimeVal ? { opening_time: openingTimeVal } : {}),
      ...(closingTimeVal ? { closing_time: closingTimeVal } : {}),
      ...(workingDaysVal ? { working_days: workingDaysVal } : {}),
      ...(weeklyOffVal ? { weekly_holidays: weeklyOffVal, weekly_off: weeklyOffVal } : {}),
      ...(holidayNoticeVal ? { public_holiday_availability: holidayNoticeVal, holiday_notice: holidayNoticeVal } : {}),

      // Venue specific extension fields
      ...(profile?.venueHighlights || profile?.venue_highlights || profile?.storeHighlights || profile?.store_highlights ? { venue_highlights: profile.venueHighlights || profile.venue_highlights || profile.storeHighlights || profile.store_highlights } : {}),
      ...(profile?.featuredHalls || profile?.featured_halls ? { featured_halls: profile.featuredHalls || profile.featured_halls } : {}),
      ...(profile?.facilities || profile?.venue_facilities ? { facilities: profile.facilities || profile.venue_facilities } : {}),
      ...(profile?.yearsInBusiness || profile?.years_in_business || profile?.yearStarted ? { years_in_business: profile.yearsInBusiness || profile.years_in_business || profile.yearStarted } : {}),
      ...(profile?.guestCapacity || profile?.guest_capacity ? { guest_capacity: profile.guestCapacity || profile.guest_capacity } : {}),
      ...(profile?.minGuestCapacity || profile?.min_guest_capacity ? { min_guest_capacity: profile.minGuestCapacity || profile.min_guest_capacity } : {}),
      ...(profile?.numberOfHalls || profile?.number_of_halls ? { number_of_halls: profile.numberOfHalls || profile.number_of_halls } : {}),
      ...(profile?.roomsCount || profile?.rooms_count || profile?.numberOfRooms ? { rooms_count: profile.roomsCount || profile.rooms_count || profile.numberOfRooms } : {}),
      ...(profile?.indoorCapacity || profile?.indoor_capacity ? { indoor_capacity: profile.indoorCapacity || profile.indoor_capacity } : {}),
      ...(profile?.outdoorCapacity || profile?.outdoor_capacity ? { outdoor_capacity: profile.outdoorCapacity || profile.outdoor_capacity } : {}),
      ...(profile?.diningCapacity || profile?.dining_capacity ? { dining_capacity: profile.diningCapacity || profile.dining_capacity } : {}),
      ...(profile?.parkingCapacity || profile?.parking_capacity ? { parking_capacity: profile.parkingCapacity || profile.parking_capacity } : {}),
      ...(profile?.venueType || profile?.venue_type ? { venue_type: profile.venueType || profile.venue_type } : {}),
      ...(profile?.hasIndoorSpace !== undefined ? { has_indoor_space: Boolean(profile.hasIndoorSpace) } : {}),
      ...(profile?.hasOutdoorSpace !== undefined ? { has_outdoor_space: Boolean(profile.hasOutdoorSpace) } : {}),
      ...(profile?.hasRooftopSpace !== undefined ? { has_rooftop_space: Boolean(profile.hasRooftopSpace) } : {}),
      ...(profile?.hasBridalRoom !== undefined ? { has_bridal_room: Boolean(profile.hasBridalRoom) } : {}),
      ...(profile?.hasGroomRoom !== undefined ? { has_groom_room: Boolean(profile.hasGroomRoom) } : {}),
      ...(profile?.vegPrice || profile?.veg_price ? { veg_price: profile.vegPrice || profile.veg_price } : {}),
      ...(profile?.nonVegPrice || profile?.non_veg_price ? { non_veg_price: profile.nonVegPrice || profile.non_veg_price } : {}),
      ...(profile?.decorStartingPrice || profile?.decor_starting_price ? { decor_starting_price: profile.decorStartingPrice || profile.decor_starting_price } : {}),
      ...(profile?.contactForPricing !== undefined ? { contact_for_pricing: Boolean(profile.contactForPricing) } : {}),
      ...(profile?.policySwitches || profile?.policy_switches ? { policy_switches: profile.policySwitches || profile.policy_switches } : {}),
      ...(profile?.faqs || profile?.faq_items ? { faqs: profile.faqs || profile.faq_items } : {}),
      ...(profile?.availabilityNote || profile?.availability_note ? { availability_note: profile.availabilityNote || profile.availability_note } : {}),
      ...(profile?.blockedDates || profile?.blocked_dates ? { blocked_dates: profile.blockedDates || profile.blocked_dates } : {}),
      ...(profile?.contactPreferences || profile?.contact_preferences ? { contact_preferences: profile.contactPreferences || profile.contact_preferences } : {}),
      ...(profile?.languagesSpoken || profile?.languages_spoken ? { languages_spoken: profile.languagesSpoken || profile.languages_spoken } : {}),
      ...(profile?.venueVisitTimings || profile?.venue_visit_timings ? { venue_visit_timings: profile.venueVisitTimings || profile.venue_visit_timings } : {}),
      ...(profile?.advanceAppointmentRequired !== undefined || profile?.advance_appointment_required !== undefined ? { advance_appointment_required: Boolean(profile?.advanceAppointmentRequired ?? profile?.advance_appointment_required) } : {}),
      ...(profile?.advanceBookingRequired || profile?.advance_booking_required ? { advance_booking_required: profile.advanceBookingRequired || profile.advance_booking_required } : {}),
      ...(profile?.advancePaymentPolicy || profile?.advance_payment_policy ? { advance_payment_policy: profile.advancePaymentPolicy || profile.advance_payment_policy } : {}),
      ...(profile?.cancellationPolicy || profile?.cancellation_policy ? { cancellation_policy: profile.cancellationPolicy || profile.cancellation_policy } : {}),
      ...(profile?.refundPolicy || profile?.refund_policy ? { refund_policy: profile.refundPolicy || profile.refund_policy } : {}),
      ...(profile?.overtimeCharges || profile?.overtime_charges ? { overtime_charges: profile.overtimeCharges || profile.overtime_charges } : {}),
      ...(profile?.decorationRules || profile?.decoration_rules || profile?.decorationPolicy ? { decoration_rules: profile.decorationRules || profile.decoration_rules || profile.decorationPolicy } : {}),
      ...(profile?.outsideCateringPolicy || profile?.outside_catering_policy ? { outside_catering_policy: profile.outsideCateringPolicy || profile.outside_catering_policy } : {}),
      ...(profile?.outsidePhotographyPolicy || profile?.outside_photography_policy ? { outside_photography_policy: profile.outsidePhotographyPolicy || profile.outside_photography_policy } : {}),
      ...(profile?.noiseRestrictions || profile?.noise_restrictions ? { noise_restrictions: profile.noiseRestrictions || profile.noise_restrictions } : {}),
      ...(profile?.alcoholPolicy || profile?.alcohol_policy ? { alcohol_policy: profile.alcoholPolicy || profile.alcohol_policy } : {}),
      ...(profile?.eventTimingRules || profile?.event_timing_rules ? { event_timing_rules: profile.eventTimingRules || profile.event_timing_rules } : {}),
      ...(profile?.hallImages || profile?.hall_images ? { hall_images: profile.hallImages || profile.hall_images } : {}),
    };

    if (Object.keys(mergedCategoryDetails).length > 0) {
      const extPayload = {
        vendor_id: vendorId,
        ...mergedCategoryDetails,
        updated_at: new Date().toISOString(),
      };

      // Check if extension row exists in Supabase for this vendor
      const checkExtRes = await fetch(
        `${url}/rest/v1/${extensionTable}?vendor_id=eq.${encodeURIComponent(vendorId)}&select=id,vendor_id`,
        { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } }
      ).catch(() => null);

      let extExists = false;
      if (checkExtRes && checkExtRes.ok) {
        const extRows = await checkExtRes.json();
        if (Array.isArray(extRows) && extRows.length > 0) extExists = true;
      }

      if (extExists) {
        await fetch(`${url}/rest/v1/${extensionTable}?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(extPayload),
        }).catch((err) => console.error(`[PUT profile] Patch ${extensionTable} failed:`, err));
      } else {
        await fetch(`${url}/rest/v1/${extensionTable}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(extPayload),
        }).catch((err) => console.error(`[PUT profile] Post ${extensionTable} failed:`, err));
      }
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

    const bNameVal = profile?.business_name || profile?.businessName || profile?.boutique_name || profile?.name;
    const descVal = profile?.about || profile?.description;
    const logoUrlVal = profile?.logo || profile?.logo_url;
    const coverUrlVal = profile?.coverImage || profile?.cover_image;

    const vendorPatchPayload: Record<string, any> = {
      profile_completion_percentage: finalCompletion,
      onboarding_stage: finalCompletion >= 80 ? "services_added" : "business_details_added",
      updated_at: new Date().toISOString(),
    };

    if (bNameVal) {
      vendorPatchPayload.name = bNameVal;
      vendorPatchPayload.boutique_name = bNameVal;
    }
    if (descVal) vendorPatchPayload.description = descVal;
    if (logoUrlVal) vendorPatchPayload.logo_url = logoUrlVal;
    if (coverUrlVal) vendorPatchPayload.cover_image = coverUrlVal;
    if (contact?.phone) vendorPatchPayload.phone = contact.phone;
    if (contact?.whatsapp) vendorPatchPayload.whatsapp = contact.whatsapp;
    if (contact?.email) vendorPatchPayload.email = contact.email;
    if (workingHoursVal) vendorPatchPayload.working_hours = workingHoursVal;

    await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(vendorId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(vendorPatchPayload),
    });

    // Clear Next.js cache to ensure public profiles update instantly across all categories
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");

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

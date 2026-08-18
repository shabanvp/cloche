import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";

function generateSlug(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return base ? `${base}-${randomSuffix}` : `vendor-${Date.now()}`;
}

const PRIMARY_CATEGORIES = [
  "Bridal Studio",
  "Groom Studio",
  "Wedding Studio",
  "Bridal Boutique",
  "Groom Wear",
  "Wedding Venue",
  "Photographer",
  "Videographer",
  "Makeup Artist",
  "Mehendi Artist",
  "Wedding Planner",
  "Decorator",
  "Caterer",
  "Jewellery Store",
  "Invitation Designer",
  "Cake Designer",
  "Entertainment",
  "Choreographer",
  "Car Rental",
  "Flower Decoration",
  "Rental Services",
  "Gift Store",
  "Honeymoon Planner",
  "Other",
];

export async function GET() {
  const { url, serviceKey, anonKey } = getSupabaseConfig();
  const apiKey = serviceKey || anonKey;

  try {
    if (url && apiKey) {
      const res = await fetch(`${url}/rest/v1/vendor_categories?is_active=eq.true&select=id,name,slug&order=name.asc`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        const categories: Array<{ id: string; name: string; slug: string }> = await res.json();
        const primarySet = new Set(PRIMARY_CATEGORIES);
        const filtered = categories.filter((c) => primarySet.has(c.name));

        const seen = new Set<string>();
        const uniquePrimary = filtered.filter((c) => {
          if (seen.has(c.name)) return false;
          seen.add(c.name);
          return true;
        });

        return NextResponse.json({ success: true, statusCode: 200, data: uniquePrimary });
      }
    }
  } catch (err: any) {}

  return NextResponse.json(
    { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: "Failed to fetch vendor categories." } },
    { status: 500 }
  );
}

export async function POST(req: Request) {
  const logPrefix = "[VENDOR_REGISTER_API]";
  let insertedUserId: string | null = null;
  let insertedUserRoleId: string | null = null;
  let insertedVendorId: string | null = null;
  let insertedProfileId: string | null = null;
  let insertedVersionId: string | null = null;

  const { url, serviceKey, anonKey } = getSupabaseConfig();
  const apiKey = serviceKey || anonKey;

  try {
    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database credentials unconfigured." } },
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let body: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = {
        boutique_name: formData.get("boutique_name") || formData.get("business_name") || formData.get("name"),
        owner_name: formData.get("owner_name") || formData.get("fullName"),
        category: formData.get("category_id") || formData.get("category"),
        category_id: formData.get("category_id") || formData.get("category"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
        address: formData.get("address"),
        city: formData.get("city"),
        district: formData.get("district"),
        state: formData.get("state"),
        pincode: formData.get("pincode"),
        website: formData.get("website"),
        instagram: formData.get("instagram"),
        description: formData.get("description"),
        gst_number: formData.get("gst_number"),
        logo: formData.get("logo"),
        cover: formData.get("cover"),
      };
    } else {
      body = await req.json();
    }

    const {
      boutique_name,
      owner_name,
      category,
      category_id,
      email,
      phone,
      password,
      address,
      city,
      district,
      state,
      pincode,
      website,
      instagram,
      facebook,
      description,
      logo_url,
      cover_image,
      logo,
      cover,
    } = body;

    const businessName = (boutique_name || "").toString().trim();
    const owner = (owner_name || "").toString().trim();
    const userEmail = (email || "").toString().trim().toLowerCase();
    const userPhone = (phone || "").toString().trim();
    const userPassword = (password || "").toString();

    if (!businessName || !userEmail || !userPassword) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: { code: "VALIDATION_ERROR", message: "Business name, email, and password are required." },
        },
        { status: 400 }
      );
    }

    // Helper Rollback Function
    const rollback = async (reason: string) => {
      console.warn(`${logPrefix} Initiating ROLLBACK due to: ${reason}`);
      if (insertedVersionId) {
        await fetch(`${url}/rest/v1/vendor_profile_versions?id=eq.${encodeURIComponent(insertedVersionId)}`, {
          method: "DELETE",
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        }).catch(() => null);
      }
      if (insertedProfileId) {
        await fetch(`${url}/rest/v1/vendor_profiles?id=eq.${encodeURIComponent(insertedProfileId)}`, {
          method: "DELETE",
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        }).catch(() => null);
      }
      if (insertedVendorId) {
        await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(insertedVendorId)}`, {
          method: "DELETE",
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        }).catch(() => null);
      }
      if (insertedUserRoleId) {
        await fetch(`${url}/rest/v1/user_roles?id=eq.${encodeURIComponent(insertedUserRoleId)}`, {
          method: "DELETE",
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        }).catch(() => null);
      }
      if (insertedUserId) {
        await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(insertedUserId)}`, {
          method: "DELETE",
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        }).catch(() => null);
      }
    };

    // Step 1: Check if user or vendor already exists for this email
    const checkEmailRes = await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(userEmail)}&select=id,is_verified,vendors(id),user_roles(roles(name))`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    let existingUser: any = null;

    if (checkEmailRes.ok) {
      const existingUsers = await checkEmailRes.json();
      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        existingUser = existingUsers[0];
        const hasVendorRecord = Array.isArray(existingUser.vendors) && existingUser.vendors.length > 0;
        const roles = Array.isArray(existingUser.user_roles)
          ? existingUser.user_roles.map((ur: any) => ur.roles?.name)
          : [];

        if (hasVendorRecord || roles.includes("vendor")) {
          return NextResponse.json(
            { success: false, statusCode: 409, error: { code: "VENDOR_EXISTS", message: "A vendor account with this email address already exists. Please log in to your vendor portal." } },
            { status: 409 }
          );
        }
      }
    }

    const passwordHash = hashPassword(userPassword);
    let targetUserId: string = "";

    if (existingUser) {
      targetUserId = existingUser.id;
      console.log(`${logPrefix} Reusing existing user record (${targetUserId}) for vendor registration...`);
      await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(targetUserId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          is_verified: true,
          is_active: true,
        }),
      });
    } else {
      console.log(`${logPrefix} Step 1: Inserting user record...`);
      const userInsertRes = await fetch(`${url}/rest/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          email: userEmail,
          password_hash: passwordHash,
          full_name: owner || businessName,
          name: owner || businessName,
          phone: userPhone || null,
          is_active: true,
          is_verified: true,
        }),
      });

      if (!userInsertRes.ok) {
        const errText = await userInsertRes.text();
        return NextResponse.json(
          { success: false, statusCode: 500, error: { code: "USER_CREATION_FAILED", message: errText } },
          { status: 500 }
        );
      }

      const newUsers = await userInsertRes.json();
      targetUserId = newUsers[0].id;
      insertedUserId = targetUserId;
    }

    // Step 2: Assign Vendor Role in user_roles
    console.log(`${logPrefix} Step 2: Assigning vendor role in user_roles...`);
    let roleId: string | null = null;
    const roleLookupRes = await fetch(`${url}/rest/v1/roles?name=eq.vendor&select=id`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (roleLookupRes.ok) {
      const roles = await roleLookupRes.json();
      if (Array.isArray(roles) && roles.length > 0) {
        roleId = roles[0].id;
      }
    }

    if (!roleId) {
      const createRoleRes = await fetch(`${url}/rest/v1/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ name: "vendor", description: "VENDOR role" }),
      });
      if (createRoleRes.ok) {
        const createdRoles = await createRoleRes.json();
        if (Array.isArray(createdRoles) && createdRoles.length > 0) {
          roleId = createdRoles[0].id;
        }
      }
    }

    if (roleId) {
      const userRoleRes = await fetch(`${url}/rest/v1/user_roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ user_id: targetUserId, role_id: roleId }),
      });

      if (userRoleRes.ok) {
        const insertedUserRoles = await userRoleRes.json();
        if (Array.isArray(insertedUserRoles) && insertedUserRoles.length > 0) {
          insertedUserRoleId = insertedUserRoles[0].id;
        }
      }
    }

    // Step 3: Exact lookup of vendor category_id from vendor_categories
    const submittedCategory = (category_id || category || "").toString().trim();

    if (!submittedCategory) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "INVALID_CATEGORY", message: "Vendor category is required." } },
        { status: 400 }
      );
    }

    let categoryId: string | null = null;
    let categoryName: string = "";

    const catRes = await fetch(
      `${url}/rest/v1/vendor_categories?or=(id.eq.${encodeURIComponent(submittedCategory)},slug.eq.${encodeURIComponent(submittedCategory)},name.eq.${encodeURIComponent(submittedCategory)})&select=id,name,slug&limit=1`,
      { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } }
    );

    if (catRes.ok) {
      const cats = await catRes.json();
      if (Array.isArray(cats) && cats.length > 0) {
        categoryId = cats[0].id;
        categoryName = cats[0].name;
      }
    }

    if (!categoryId) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: "INVALID_CATEGORY",
            message: `Selected vendor category "${submittedCategory}" does not exist in database.`,
          },
        },
        { status: 400 }
      );
    }

    // Step 4: Create Core Vendor Record in vendors table
    console.log(`${logPrefix} Step 4: Inserting vendor record...`);
    const vendorCode = `VND-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const vendorInsertRes = await fetch(`${url}/rest/v1/vendors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        vendor_code: vendorCode,
        user_id: targetUserId,
        category_id: categoryId,
        status: "active",
        publication_status: "published",
        onboarding_stage: "completed",
        profile_completion_percentage: 100,
        is_verified: true,
        is_kyc_verified: true,
      }),
    });

    if (!vendorInsertRes.ok) {
      const errText = await vendorInsertRes.text();
      console.error(`${logPrefix} FAILED to insert vendor: ${errText}`);
      await rollback(`vendor insert failed: ${errText}`);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "VENDOR_CREATION_FAILED", message: errText } },
        { status: 500 }
      );
    }

    const newVendors = await vendorInsertRes.json();
    const newVendor = newVendors[0];
    insertedVendorId = newVendor.id;

    // Step 5: Upload Registration Images to Cloudinary & Save to Media Table
    let logoMediaId: string | null = null;
    let coverMediaId: string | null = null;
    let finalLogoUrl = "";
    let finalCoverUrl = "";

    const logoInput = logo || logo_url || body.logo;
    if (logoInput) {
      if (typeof logoInput === "string" && logoInput.startsWith("http")) {
        finalLogoUrl = logoInput;
      } else if (typeof logoInput === "object" && logoInput !== null && "arrayBuffer" in logoInput && (logoInput as any).size > 0) {
        try {
          const { uploadImageToCloudinaryDetailed } = await import("@/lib/cloudinary");
          console.log(`${logPrefix} Uploading registration logo file to Cloudinary...`);
          const res = await uploadImageToCloudinaryDetailed(logoInput as any, "cloche/vendors/logos");
          if (res.secure_url && res.secure_url.startsWith("http")) {
            finalLogoUrl = res.secure_url;
            console.log(`${logPrefix} Registration logo Cloudinary URL: ${finalLogoUrl}`);
          }
        } catch (err) {
          console.error(`${logPrefix} Registration logo Cloudinary upload error:`, err);
        }
      }
    }

    const coverInput = cover || cover_image || body.cover;
    if (coverInput) {
      if (typeof coverInput === "string" && coverInput.startsWith("http")) {
        finalCoverUrl = coverInput;
      } else if (typeof coverInput === "object" && coverInput !== null && "arrayBuffer" in coverInput && (coverInput as any).size > 0) {
        try {
          const { uploadImageToCloudinaryDetailed } = await import("@/lib/cloudinary");
          console.log(`${logPrefix} Uploading registration cover file to Cloudinary...`);
          const res = await uploadImageToCloudinaryDetailed(coverInput as any, "cloche/vendors/covers");
          if (res.secure_url && res.secure_url.startsWith("http")) {
            finalCoverUrl = res.secure_url;
            console.log(`${logPrefix} Registration cover Cloudinary URL: ${finalCoverUrl}`);
          }
        } catch (err) {
          console.error(`${logPrefix} Registration cover Cloudinary upload error:`, err);
        }
      }
    }

    if (finalLogoUrl) {
      const uniqueLogoPath = `cloche/vendors/logos/${newVendor.id}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const mediaRes = await fetch(`${url}/rest/v1/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: targetUserId,
          vendor_id: newVendor.id,
          media_type: "image",
          bucket_name: "cloudinary",
          file_path: uniqueLogoPath,
          mime_type: "image/jpeg",
          file_size_bytes: 1024,
          cdn_url: finalLogoUrl,
          original_name: "logo.jpg",
        }),
      }).catch(() => null);

      if (mediaRes && mediaRes.ok) {
        const mData = await mediaRes.json();
        if (Array.isArray(mData) && mData.length > 0) logoMediaId = mData[0].id;
      } else if (mediaRes) {
        const errText = await mediaRes.text().catch(() => "");
        console.warn(`${logPrefix} Registration logo media insert status ${mediaRes.status}:`, errText);
      }
    }

    if (finalCoverUrl) {
      const uniqueCoverPath = `cloche/vendors/covers/${newVendor.id}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const mediaRes = await fetch(`${url}/rest/v1/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: targetUserId,
          vendor_id: newVendor.id,
          media_type: "image",
          bucket_name: "cloudinary",
          file_path: uniqueCoverPath,
          mime_type: "image/jpeg",
          file_size_bytes: 1024,
          cdn_url: finalCoverUrl,
          original_name: "cover.jpg",
        }),
      }).catch(() => null);

      if (mediaRes && mediaRes.ok) {
        const mData = await mediaRes.json();
        if (Array.isArray(mData) && mData.length > 0) coverMediaId = mData[0].id;
      } else if (mediaRes) {
        const errText = await mediaRes.text().catch(() => "");
        console.warn(`${logPrefix} Registration cover media insert status ${mediaRes.status}:`, errText);
      }
    }

    // Step 6: Create Vendor Profile in vendor_profiles table
    console.log(`${logPrefix} Step 6: Inserting vendor_profiles record...`);
    const profileSlug = generateSlug(businessName);
    const resolvedGstNumber = (body.gst_number || null)?.toString().trim() || null;

    const baseProfilePayload: Record<string, any> = {
      vendor_id: newVendor.id,
      business_name: businessName,
      slug: profileSlug,
      tagline: body.tagline || null,
      about: description || null,
      city: city || district || "Kochi",
      state: state || district || "Kerala",
      pincode: pincode || null,
      logo_media_id: logoMediaId,
      cover_media_id: coverMediaId,
      rating: 0.0,
      review_count: 0,
      starting_price: null,
    };

    if (resolvedGstNumber) {
      baseProfilePayload.gst_number = resolvedGstNumber;
    }

    let profileInsertRes = await fetch(`${url}/rest/v1/vendor_profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(baseProfilePayload),
    });

    if (!profileInsertRes.ok && resolvedGstNumber) {
      const errText = await profileInsertRes.clone().text();
      if (errText.includes("PGRST204") || errText.includes("gst_number")) {
        console.warn(`${logPrefix} Retrying vendor_profiles insert without gst_number column...`);
        delete baseProfilePayload.gst_number;
        profileInsertRes = await fetch(`${url}/rest/v1/vendor_profiles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify(baseProfilePayload),
        });
      }
    }

    if (!profileInsertRes.ok) {
      const errText = await profileInsertRes.text();
      console.error(`${logPrefix} FAILED to insert vendor_profiles: ${errText}`);
      await rollback(`vendor_profiles insert failed: ${errText}`);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "VENDOR_PROFILE_CREATION_FAILED", message: errText } },
        { status: 500 }
      );
    }

    const newProfiles = await profileInsertRes.json();
    insertedProfileId = newProfiles[0].id;

    // Step 7: Insert Contact in vendor_contacts
    await fetch(`${url}/rest/v1/vendor_contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        vendor_id: newVendor.id,
        contact_name: owner || businessName,
        phone: userPhone || null,
        whatsapp: userPhone || null,
        email: userEmail,
        is_primary: true,
      }),
    }).catch(() => null);

    // Step 8: Insert Address in vendor_addresses
    if (address || city || district || state || pincode) {
      await fetch(`${url}/rest/v1/vendor_addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          vendor_id: newVendor.id,
          address_line1: (address || "").toString().trim() || `${city || district || "City"}, ${state || "Kerala"}`,
          city: (city || district || "Kochi").toString().trim(),
          state: (state || district || "Kerala").toString().trim(),
          pincode: (pincode || "").toString().trim() || null,
        }),
      }).catch(() => null);
    }

    // Step 9: Insert Social Links in vendor_social_links
    const socialLinksToInsert = [
      { platform: "website", url: (website || "").toString().trim() },
      { platform: "instagram", url: (instagram || "").toString().trim() },
      { platform: "facebook", url: (facebook || "").toString().trim() },
    ].filter((item) => item.url);

    for (const item of socialLinksToInsert) {
      await fetch(`${url}/rest/v1/vendor_social_links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          vendor_id: newVendor.id,
          platform: item.platform,
          url: item.url,
        }),
      }).catch(() => null);
    }

    // Step 10: Create Initial Vendor Profile Version in vendor_profile_versions
    console.log(`${logPrefix} Step 10: Inserting initial active version in vendor_profile_versions...`);
    const versionInsertRes = await fetch(`${url}/rest/v1/vendor_profile_versions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        vendor_id: newVendor.id,
        version_number: 1,
        status: "published",
        change_summary: "Initial vendor registration profile",
        created_by: targetUserId,
      }),
    });

    if (!versionInsertRes.ok) {
      const errText = await versionInsertRes.text();
      console.error(`${logPrefix} FAILED to insert vendor_profile_versions: ${errText}`);
      await rollback(`vendor_profile_versions insert failed: ${errText}`);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "VENDOR_PROFILE_VERSION_FAILED", message: errText } },
        { status: 500 }
      );
    }

    const newVersions = await versionInsertRes.json();
    if (Array.isArray(newVersions) && newVersions.length > 0) {
      insertedVersionId = newVersions[0].id;
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Vendor account registered successfully! You can now log in to your vendor portal.",
        data: {
          vendor: {
            id: newVendor.id,
            vendorCode: newVendor.vendor_code,
            businessName,
            slug: profileSlug,
            category: categoryName,
            status: "active",
            onboardingStage: newVendor.onboarding_stage,
            profileCompletionPercentage: newVendor.profile_completion_percentage,
            profileId: insertedProfileId,
          },
          user: {
            id: targetUserId,
            email: userEmail,
            fullName: businessName,
            roles: ["vendor"],
            isVerified: true,
          },
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(`${logPrefix} CRITICAL UNHANDLED ERROR:`, err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

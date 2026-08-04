import { NextResponse } from "next/server";
import { hashPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";
import { sendVerificationMail } from "@/lib/email";

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

export async function POST(req: Request) {
  const logPrefix = "[VENDOR_REGISTER_API]";
  let insertedUserId: string | null = null;
  let insertedUserRoleId: string | null = null;
  let insertedSessionId: string | null = null;
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
        category: formData.get("category") || formData.get("category_id"),
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
      };
    } else {
      body = await req.json();
    }

    const {
      boutique_name,
      owner_name,
      category,
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
      description,
      gst_number,
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
      if (insertedSessionId) {
        await fetch(`${url}/rest/v1/sessions?id=eq.${encodeURIComponent(insertedSessionId)}`, {
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
    const verificationToken = crypto.randomUUID();
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    let targetUserId: string = "";

    if (existingUser) {
      // Single Gmail dual-role support: Reuse existing user record, update verification token and password
      targetUserId = existingUser.id;
      console.log(`${logPrefix} Reusing existing user record (${targetUserId}) for vendor account registration...`);

      await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(targetUserId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          verification_token: verificationToken,
          reset_token_expires_at: tokenExpiresAt,
          is_verified: false,
        }),
      });
    } else {
      // Create new User record
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
          verification_token: verificationToken,
          reset_token_expires_at: tokenExpiresAt,
          is_active: true,
          is_verified: false,
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

    // Step 3: Lookup vendor category_id
    let categoryId: string | null = null;
    const catName = category ? category.toString().trim() : "Bridal Boutique";
    const catLookupRes = await fetch(`${url}/rest/v1/vendor_categories?name=ilike.*${encodeURIComponent(catName)}*&select=id`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (catLookupRes.ok) {
      const cats = await catLookupRes.json();
      if (Array.isArray(cats) && cats.length > 0) {
        categoryId = cats[0].id;
      }
    }

    if (!categoryId) {
      const fallbackCatRes = await fetch(`${url}/rest/v1/vendor_categories?limit=1&select=id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      });
      if (fallbackCatRes.ok) {
        const fallbacks = await fallbackCatRes.json();
        if (Array.isArray(fallbacks) && fallbacks.length > 0) {
          categoryId = fallbacks[0].id;
        }
      }
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
        status: "pending",
        publication_status: "draft",
        onboarding_stage: "registration_started",
        profile_completion_percentage: 20,
        is_verified: false,
        is_kyc_verified: false,
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

    // Step 5: Create Vendor Profile in vendor_profiles table
    console.log(`${logPrefix} Step 5: Inserting vendor_profiles record...`);
    const profileSlug = generateSlug(businessName);
    const profileInsertRes = await fetch(`${url}/rest/v1/vendor_profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        vendor_id: newVendor.id,
        business_name: businessName,
        slug: profileSlug,
        tagline: body.tagline || null,
        about: description || null,
        city: city || "Kochi",
        state: state || "Kerala",
        pincode: pincode || null,
        rating: 0.0,
        review_count: 0,
        starting_price: null,
      }),
    });

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

    // Step 6: Create Initial Vendor Profile Version in vendor_profile_versions
    console.log(`${logPrefix} Step 6: Inserting initial draft version in vendor_profile_versions...`);
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
        status: "draft",
        change_summary: "Initial vendor registration draft profile",
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

    // Step 7: Dispatch Verification Email via Gmail SMTPS / Brevo API
    console.log(`${logPrefix} Step 7: Dispatching vendor verification email to ${userEmail}...`);
    const emailResult = await sendVerificationMail({
      email: userEmail,
      name: businessName,
      verificationToken,
      role: "vendor",
    });

    console.log(`${logPrefix} Verification email status for ${userEmail}: delivered=${emailResult.success}, method=${emailResult.method || "none"}, error=${emailResult.error || "none"}`);

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        requiresVerification: true,
        message: emailResult.success
          ? `Vendor registered successfully! A verification email has been sent to ${userEmail}. Please verify your email address to log in.`
          : `Vendor account created for ${userEmail}, but verification email delivery encountered an issue: ${emailResult.error || "SMTP not configured"}. You can resend the verification email from the login page.`,
        data: {
          vendor: {
            id: newVendor.id,
            vendorCode: newVendor.vendor_code,
            businessName,
            slug: profileSlug,
            category: catName,
            status: newVendor.status,
            onboardingStage: newVendor.onboarding_stage,
            profileCompletionPercentage: newVendor.profile_completion_percentage,
            profileId: insertedProfileId,
          },
          user: {
            id: targetUserId,
            email: userEmail,
            fullName: businessName,
            roles: ["vendor"],
            isVerified: false,
          },
          emailDelivery: {
            delivered: emailResult.success,
            method: emailResult.method || null,
            error: emailResult.error || null,
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

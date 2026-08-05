import { NextResponse } from "next/server";
import { getSupabaseConfig, signUpWithSupabaseAuth, deleteAdminSupabaseUser } from "@/lib/supabase";
import { sendVerificationMail } from "@/lib/email";

export async function POST(req: Request) {
  const logPrefix = "[VENDOR_REGISTER_API]";
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

    // Step 1: Create Supabase Auth user as single source of truth for auth
    console.log(`${logPrefix} Step 1: Creating Supabase Auth user for vendor ${userEmail}...`);
    const authResult = await signUpWithSupabaseAuth(
      userEmail,
      userPassword,
      { full_name: owner || businessName, business_name: businessName, role: "vendor" },
      "https://cloche-six.vercel.app/auth/callback"
    );

    if (authResult.error || !authResult.user) {
      const errMsg = authResult.error?.message || "Vendor registration failed.";
      console.warn(`${logPrefix} Supabase Auth signup rejected: ${errMsg}`);
      return NextResponse.json(
        {
          success: false,
          statusCode: errMsg.toLowerCase().includes("already registered") ? 409 : 400,
          error: {
            code: errMsg.toLowerCase().includes("already registered") ? "VENDOR_EXISTS" : "REGISTRATION_FAILED",
            message: errMsg.toLowerCase().includes("already registered")
              ? "A vendor account with this email address already exists. Please log in to your vendor portal."
              : errMsg,
          },
        },
        { status: errMsg.toLowerCase().includes("already registered") ? 409 : 400 }
      );
    }

    const authUserId = authResult.user.id;
    console.log(`${logPrefix} Step 1 Success: Supabase Auth user created (${authUserId}).`);

    // Step 2: Execute atomic custom table database insert via register_vendor_atomic RPC function
    console.log(`${logPrefix} Step 2: Executing register_vendor_atomic RPC transaction...`);
    const rpcRes = await fetch(`${url}/rest/v1/rpc/register_vendor_atomic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        p_supabase_user_id: authUserId,
        p_email: userEmail,
        p_owner_name: owner || businessName,
        p_phone: userPhone,
        p_business_name: businessName,
        p_category_name: (category || "").toString().trim() || "Bridal Boutique",
        p_city: (city || "").toString().trim() || "Kochi",
        p_state: (state || "").toString().trim() || "Kerala",
        p_pincode: (pincode || "").toString().trim() || null,
        p_address: (address || "").toString().trim() || null,
        p_website: (website || "").toString().trim() || null,
        p_instagram: (instagram || "").toString().trim() || null,
        p_description: (description || "").toString().trim() || null,
        p_gst_number: (gst_number || "").toString().trim() || null,
      }),
    });

    if (!rpcRes.ok) {
      const errText = await rpcRes.text();
      console.error(`${logPrefix} RPC transaction failed: ${errText}. Initiating Auth user deletion...`);

      // Clean up Supabase Auth user on custom database failure to prevent orphan accounts
      await deleteAdminSupabaseUser(authUserId);

      return NextResponse.json(
        {
          success: false,
          statusCode: 500,
          error: { code: "CUSTOM_DB_INSERT_FAILED", message: `Vendor registration database error: ${errText}` },
        },
        { status: 500 }
      );
    }

    const rpcData = await rpcRes.json();
    console.log(`${logPrefix} Step 2 Success: Vendor records inserted atomically.`, rpcData);

    // Step 3: Dispatch Verification Email via Brevo to ensure 100% delivery to user's Gmail inbox
    const verificationToken = crypto.randomUUID();
<<<<<<< HEAD
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
=======
    await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(rpcData.user_id)}`, {
      method: "PATCH",
>>>>>>> 5459a180e0e4596c825ad85553c5c6fc9fb463df
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
<<<<<<< HEAD
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

    // Step 1: Update user record with verified status
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
    }
=======
      body: JSON.stringify({ verification_token: verificationToken }),
    }).catch(() => null);

    await sendVerificationMail({
      email: userEmail,
      name: businessName,
      verificationToken,
      role: "vendor",
    });
>>>>>>> 5459a180e0e4596c825ad85553c5c6fc9fb463df

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
<<<<<<< HEAD
        message: "Vendor account registered successfully! You can now log in to your vendor portal.",
        data: {
          vendor: {
            id: newVendor.id,
            vendorCode: newVendor.vendor_code,
            businessName,
            slug: profileSlug,
            category: catName,
            status: "active",
            onboardingStage: newVendor.onboarding_stage,
            profileCompletionPercentage: newVendor.profile_completion_percentage,
            profileId: insertedProfileId,
=======
        message: "Vendor registered successfully! A confirmation email has been sent to your email inbox. Please click the link to verify before logging in.",
        data: {
          vendor: {
            id: rpcData.vendor_id,
            vendorCode: rpcData.vendor_code,
            businessName: rpcData.business_name,
            slug: rpcData.slug,
            profileId: rpcData.profile_id,
>>>>>>> 5459a180e0e4596c825ad85553c5c6fc9fb463df
          },
          user: {
            id: rpcData.user_id,
            supabaseUserId: authUserId,
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

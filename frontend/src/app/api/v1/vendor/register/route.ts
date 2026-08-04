import { NextResponse } from "next/server";
import { hashPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
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
      console.error(`${logPrefix} Database credentials unconfigured.`);
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

    // Helper Rollback function
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

    // Step 1: Check if user already exists
    const checkEmailRes = await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(userEmail)}&select=id`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (checkEmailRes.ok) {
      const existing = await checkEmailRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          { success: false, statusCode: 409, error: { code: "EMAIL_EXISTS", message: "An account with this email address already exists." } },
          { status: 409 }
        );
      }
    }

    // Step 2: Create User Record
    console.log(`${logPrefix} Step 1: Inserting user record...`);
    const passwordHash = hashPassword(userPassword);
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
        is_verified: false,
      }),
    });

    if (!userInsertRes.ok) {
      const errText = await userInsertRes.text();
      console.error(`${logPrefix} FAILED to insert user: ${errText}`);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "USER_CREATION_FAILED", message: errText } },
        { status: 500 }
      );
    }

    const newUsers = await userInsertRes.json();
    const newUser = newUsers[0];
    insertedUserId = newUser.id;

    // Step 3: Assign Vendor Role in user_roles
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
      console.log(`${logPrefix} Creating vendor role in roles table...`);
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

    if (!roleId) {
      await rollback("Failed to resolve vendor role ID");
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "ROLE_LOOKUP_FAILED", message: "Failed to resolve vendor role." } },
        { status: 500 }
      );
    }

    const userRoleRes = await fetch(`${url}/rest/v1/user_roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ user_id: newUser.id, role_id: roleId }),
    });

    if (!userRoleRes.ok) {
      const errText = await userRoleRes.text();
      console.error(`${logPrefix} FAILED to insert user_roles: ${errText}`);
      await rollback(`user_roles insert failed: ${errText}`);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "USER_ROLE_CREATION_FAILED", message: errText } },
        { status: 500 }
      );
    }

    const insertedUserRoles = await userRoleRes.json();
    if (Array.isArray(insertedUserRoles) && insertedUserRoles.length > 0) {
      insertedUserRoleId = insertedUserRoles[0].id;
    }

    // Step 4: Issue JWT Token & Create Active Session
    console.log(`${logPrefix} Step 3: Creating session record...`);
    const token = signJwtToken({
      userId: newUser.id,
      email: newUser.email,
      fullName: businessName,
      roles: ["vendor"],
    });

    const tokenHash = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const userAgent = req.headers.get("user-agent") || "Web Browser";
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const sessionRes = await fetch(`${url}/rest/v1/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: newUser.id,
        token_hash: tokenHash,
        user_agent: userAgent,
        ip_address: ipAddress,
        expires_at: expiresAt,
      }),
    });

    if (!sessionRes.ok) {
      const errText = await sessionRes.text();
      console.error(`${logPrefix} FAILED to insert session: ${errText}`);
      await rollback(`session insert failed: ${errText}`);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SESSION_CREATION_FAILED", message: errText } },
        { status: 500 }
      );
    }

    const insertedSessions = await sessionRes.json();
    if (Array.isArray(insertedSessions) && insertedSessions.length > 0) {
      insertedSessionId = insertedSessions[0].id;
    }

    // Step 5: Lookup vendor category_id
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

    // Step 6: Create Core Vendor Record in vendors table
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
        user_id: newUser.id,
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
    console.log(`${logPrefix} SUCCESS: Created vendor record with ID: ${insertedVendorId}`);

    // Step 7: Create Vendor Profile in vendor_profiles table
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
    const newProfile = newProfiles[0];
    insertedProfileId = newProfile.id;
    console.log(`${logPrefix} SUCCESS: Created vendor_profiles record with ID: ${insertedProfileId}`);

    // Step 8: Create Initial Vendor Profile Version in vendor_profile_versions
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
        created_by: newUser.id,
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
    console.log(`${logPrefix} SUCCESS: Created initial vendor_profile_versions record.`);

    // Step 9: Create vendor_contacts record
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
        email: userEmail,
        is_primary: true,
      }),
    }).catch(() => null);

    // Step 10: Create vendor_addresses record
    await fetch(`${url}/rest/v1/vendor_addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        vendor_id: newVendor.id,
        address_line1: address || "Main Street",
        city: city || "Kochi",
        state: state || "Kerala",
        pincode: pincode || null,
      }),
    }).catch(() => null);

    // Return Success Response & Set Cookies
    const response = NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Vendor registered successfully. Welcome to Cloche!",
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
            id: newUser.id,
            email: newUser.email,
            fullName: businessName,
            roles: ["vendor"],
          },
          token,
        },
      },
      { status: 201 }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set({
      name: "user_role",
      value: "vendor",
      path: "/",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error(`${logPrefix} CRITICAL UNHANDLED ERROR:`, err);
    if (insertedUserId) {
      try {
        if (insertedVersionId) {
          await fetch(`${url}/rest/v1/vendor_profile_versions?id=eq.${encodeURIComponent(insertedVersionId)}`, {
            method: "DELETE",
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          });
        }
        if (insertedProfileId) {
          await fetch(`${url}/rest/v1/vendor_profiles?id=eq.${encodeURIComponent(insertedProfileId)}`, {
            method: "DELETE",
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          });
        }
        if (insertedVendorId) {
          await fetch(`${url}/rest/v1/vendors?id=eq.${encodeURIComponent(insertedVendorId)}`, {
            method: "DELETE",
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          });
        }
        if (insertedSessionId) {
          await fetch(`${url}/rest/v1/sessions?id=eq.${encodeURIComponent(insertedSessionId)}`, {
            method: "DELETE",
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          });
        }
        if (insertedUserRoleId) {
          await fetch(`${url}/rest/v1/user_roles?id=eq.${encodeURIComponent(insertedUserRoleId)}`, {
            method: "DELETE",
            headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          });
        }
        await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(insertedUserId)}`, {
          method: "DELETE",
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        });
      } catch (e) {}
    }

    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

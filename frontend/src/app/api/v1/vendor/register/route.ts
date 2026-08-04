import { NextResponse } from "next/server";
import { hashPassword, signJwtToken, hashSessionToken, AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
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

    const { url, anonKey } = getSupabaseConfig();
    if (!url || !anonKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database unconfigured." } },
        { status: 500 }
      );
    }

    // 1. Check if user already exists
    const checkRes = await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(userEmail)}&select=id`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          { success: false, statusCode: 409, error: { code: "EMAIL_EXISTS", message: "An account with this email address already exists." } },
          { status: 409 }
        );
      }
    }

    // 2. Create User record
    const passwordHash = hashPassword(userPassword);
    const userInsertRes = await fetch(`${url}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
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
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "USER_CREATION_FAILED", message: errText } },
        { status: 500 }
      );
    }

    const newUsers = await userInsertRes.json();
    const newUser = newUsers[0];

    // 3. Assign Vendor Role in user_roles
    const roleLookupRes = await fetch(`${url}/rest/v1/roles?name=eq.vendor&select=id`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    if (roleLookupRes.ok) {
      const roles = await roleLookupRes.json();
      if (Array.isArray(roles) && roles.length > 0) {
        await fetch(`${url}/rest/v1/user_roles`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: anonKey, Authorization: `Bearer ${anonKey}` },
          body: JSON.stringify({ user_id: newUser.id, role_id: roles[0].id }),
        });
      }
    }

    // 4. Lookup category_id
    let categoryId: string | null = null;
    const catName = category ? category.toString().trim() : "Bridal Boutique";
    const catLookupRes = await fetch(`${url}/rest/v1/vendor_categories?name=ilike.*${encodeURIComponent(catName)}*&select=id`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    if (catLookupRes.ok) {
      const cats = await catLookupRes.json();
      if (Array.isArray(cats) && cats.length > 0) {
        categoryId = cats[0].id;
      }
    }

    if (!categoryId) {
      // Fallback to first category
      const fallbackCatRes = await fetch(`${url}/rest/v1/vendor_categories?limit=1&select=id`, {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      });
      if (fallbackCatRes.ok) {
        const fallbacks = await fallbackCatRes.json();
        if (Array.isArray(fallbacks) && fallbacks.length > 0) {
          categoryId = fallbacks[0].id;
        }
      }
    }

    // 5. Create core identity record in vendors table
    const vendorCode = `VND-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const vendorInsertRes = await fetch(`${url}/rest/v1/vendors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
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
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "VENDOR_CREATION_FAILED", message: errText } },
        { status: 500 }
      );
    }

    const newVendors = await vendorInsertRes.json();
    const newVendor = newVendors[0];

    // 6. Create initial draft vendor profile
    await fetch(`${url}/rest/v1/vendor_profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        vendor_id: newVendor.id,
        business_name: businessName,
        description: description || null,
        address: address || null,
        city: city || "Kochi",
        district: district || "Ernakulam",
        state: state || "Kerala",
        pincode: pincode || null,
        phone: userPhone || null,
        email: userEmail,
        website: website || null,
        instagram_handle: instagram ? instagram.replace(/^@/, "") : null,
        gst_number: gst_number || null,
        rating: 5.0,
        review_count: 0,
      }),
    });

    // 7. Issue JWT token & session
    const token = signJwtToken({
      userId: newUser.id,
      email: newUser.email,
      fullName: businessName,
      roles: ["vendor"],
    });

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
            category: catName,
            status: newVendor.status,
            onboardingStage: newVendor.onboarding_stage,
            profileCompletionPercentage: newVendor.profile_completion_percentage,
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

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

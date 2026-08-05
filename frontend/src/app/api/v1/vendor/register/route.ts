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
    await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(rpcData.user_id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ verification_token: verificationToken }),
    }).catch(() => null);

    await sendVerificationMail({
      email: userEmail,
      name: businessName,
      verificationToken,
      role: "vendor",
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Vendor registered successfully! A confirmation email has been sent to your email inbox. Please click the link to verify before logging in.",
        data: {
          vendor: {
            id: rpcData.vendor_id,
            vendorCode: rpcData.vendor_code,
            businessName: rpcData.business_name,
            slug: rpcData.slug,
            profileId: rpcData.profile_id,
          },
          user: {
            id: rpcData.user_id,
            supabaseUserId: authUserId,
            email: userEmail,
            fullName: businessName,
            roles: ["vendor"],
            isVerified: false,
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

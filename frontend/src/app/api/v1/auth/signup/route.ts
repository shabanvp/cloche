import { NextResponse } from "next/server";
import { getSupabaseConfig, getSupabaseConfigError, signUpWithSupabaseAuth, deleteAdminSupabaseUser } from "@/lib/supabase";
import { sendVerificationMail } from "@/lib/email";

export async function POST(req: Request) {
  const logPrefix = "[AUTH_SIGNUP_API]";

  try {
    const body = await req.json();
    const { email, password, fullName, phone } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: { code: "VALIDATION_ERROR", message: "Email, password, and full name are required." },
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone ? phone.trim() : null;

    const { url, serviceKey } = getSupabaseConfig();
    const configError = getSupabaseConfigError({ anon: true, serviceRole: true });
    const apiKey = serviceKey;

    if (configError || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 503, error: { code: "CONFIG_ERROR", message: configError || "Missing SUPABASE_SERVICE_ROLE_KEY." } },
        { status: 503 }
      );
    }

    // Step 1: Create Supabase Auth user as single source of truth for auth
    console.log(`${logPrefix} Step 1: Creating Supabase Auth user for ${cleanEmail}...`);
    const authResult = await signUpWithSupabaseAuth(
      cleanEmail,
      password,
      { full_name: cleanName, role: "customer" },
      "https://cloche-six.vercel.app/auth/callback"
    );

    if (authResult.error || !authResult.user) {
      const errMsg = authResult.error?.message || "User creation failed.";
      console.warn(`${logPrefix} Supabase Auth signup rejected: ${errMsg}`);
      return NextResponse.json(
        {
          success: false,
          statusCode: errMsg.toLowerCase().includes("already registered") ? 409 : 400,
          error: {
            code: errMsg.toLowerCase().includes("already registered") ? "EMAIL_EXISTS" : "SIGNUP_FAILED",
            message: errMsg.toLowerCase().includes("already registered")
              ? "An account with this email address already exists. Please log in instead."
              : errMsg,
          },
        },
        { status: errMsg.toLowerCase().includes("already registered") ? 409 : 400 }
      );
    }

    const authUserId = authResult.user.id;
    console.log(`${logPrefix} Step 1 Success: Supabase Auth user created (${authUserId}).`);

    // Step 2: Execute atomic custom table database insert via RPC function
    console.log(`${logPrefix} Step 2: Executing register_customer_atomic RPC transaction...`);
    const rpcRes = await fetch(`${url}/rest/v1/rpc/register_customer_atomic`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        p_supabase_user_id: authUserId,
        p_email: cleanEmail,
        p_full_name: cleanName,
        p_phone: cleanPhone,
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
          error: { code: "CUSTOM_DB_INSERT_FAILED", message: `Database setup error: ${errText}` },
        },
        { status: 500 }
      );
    }

    const rpcData = await rpcRes.json();
    console.log(`${logPrefix} Step 2 Success: Custom DB records inserted atomically.`, rpcData);

    // Step 3: Dispatch Verification Email via Brevo to ensure 100% delivery to user's Gmail inbox
    const verificationToken = crypto.randomUUID();
    await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(rpcData.user_id || authUserId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ verification_token: verificationToken }),
    }).catch(() => null);

    await sendVerificationMail({
      email: cleanEmail,
      name: cleanName,
      verificationToken,
      role: "customer",
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Account created successfully! A confirmation email has been sent to your email inbox. Please click the link in the email to activate your account.",
        data: {
          user: {
            id: rpcData.user_id || authUserId,
            supabaseUserId: authUserId,
            email: cleanEmail,
            fullName: cleanName,
            isVerified: false,
          },
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(`${logPrefix} CRITICAL ERROR:`, err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

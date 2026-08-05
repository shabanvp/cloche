import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase";
import { sendVerificationMail } from "@/lib/email";

export async function POST(req: Request) {
  const logPrefix = "[RESEND_VERIFICATION_API]";

  try {
    const body = await req.json();
    const { email, role = "customer" } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Email address is required." } },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;

    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database credentials unconfigured." } },
        { status: 500 }
      );
    }

    // 1. Fetch user by email
    const userRes = await fetch(
      `${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,email,full_name,name,is_verified,verification_token`,
      {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
      }
    );

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "USER_NOT_FOUND", message: "No account found with this email address." } },
        { status: 404 }
      );
    }

    const users = await userRes.json();
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "USER_NOT_FOUND", message: "No account found with this email address. Please sign up first." } },
        { status: 404 }
      );
    }

    const user = users[0];

    // 2. Check if already verified
    if (user.is_verified === true) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: { code: "ALREADY_VERIFIED", message: "This email address is already verified. Please log in directly." },
        },
        { status: 400 }
      );
    }

    // 3. Generate new verification token and update database
    const verificationToken = crypto.randomUUID();
    console.log(`${logPrefix} Generating new verification token for ${cleanEmail}...`);

    await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(user.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        verification_token: verificationToken,
      }),
    });

    // 4. Dispatch verification email via Brevo
    const userName = user.full_name || user.name || cleanEmail.split("@")[0];
    await sendVerificationMail({
      email: cleanEmail,
      name: userName,
      verificationToken,
      role,
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: `A new verification email has been sent to ${cleanEmail}. Please check your inbox and verify to activate your account.`,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(`${logPrefix} Error resending verification email:`, err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

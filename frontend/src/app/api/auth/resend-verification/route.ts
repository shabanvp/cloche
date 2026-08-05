<<<<<<< HEAD
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase";
import { sendVendorVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  const logPrefix = "[RESEND_VERIFICATION_API]";

  try {
    const body = await req.json().catch(() => ({}));
    const { email, role = "vendor" } = body;

    const cleanEmail = (email || "").toString().trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "A valid email address is required." } },
        { status: 400 }
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

    // 1. Look up user by email
    const userRes = await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}&select=id,full_name,name,is_verified,verification_token`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "DATABASE_ERROR", message: "Failed to query user record." } },
        { status: 500 }
      );
    }

    const users = await userRes.json();
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        {
          success: true,
          statusCode: 200,
          message: "If an account exists with this email address, a verification link has been sent.",
        },
        { status: 200 }
      );
    }

    const user = users[0];

    if (user.is_verified) {
      return NextResponse.json(
        {
          success: true,
          isAlreadyVerified: true,
          message: "Your email address is already verified. You can log in directly to your vendor portal.",
        },
        { status: 200 }
      );
    }

    // 2. Generate new token & 24-hour expiration
    const newToken = crypto.randomUUID();
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Update user record with new token and expiration
    await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(user.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        verification_token: newToken,
        reset_token_expires_at: newExpiresAt,
      }),
    });

    // Update boutiques record if applicable
    await fetch(`${url}/rest/v1/boutiques?email=ilike.${encodeURIComponent(cleanEmail)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        verification_token: newToken,
      }),
    });

    // 3. Dispatch verification email
    const appUrl = (
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.FRONTEND_BASE_URL ||
      "https://cloche.in"
    ).trim().replace(/\/+$/, "");

    const verificationUrl = `${appUrl}/verify-email?token=${encodeURIComponent(newToken)}&type=${encodeURIComponent(role)}`;
    const vendorName = user.full_name || user.name || "Vendor";

    console.log(`${logPrefix} Resending verification email to ${cleanEmail} (Token: ${newToken})`);

    const emailResult = await sendVendorVerificationEmail(cleanEmail, vendorName, newToken, verificationUrl);

    console.log(`${logPrefix} Resend email status for ${cleanEmail}: delivered=${emailResult.success}, method=${emailResult.method || "none"}, err=${emailResult.error || "none"}`);

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: emailResult.success
          ? `A new verification link has been sent to ${cleanEmail}. Please check your Gmail inbox.`
          : `Generated a new verification token for ${cleanEmail}! Note: SMTP credentials (GMAIL_APP_PASSWORD) are not set in environment variables. Set GMAIL_APP_PASSWORD in .env.local to send live emails, or click the direct verification button below.`,
        data: {
          email: cleanEmail,
          emailSent: emailResult.success,
          verificationUrl,
          error: emailResult.error || null,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(`${logPrefix} Exception in resend-verification:`, err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
=======
import { POST as handleResendVerification } from "../../v1/auth/resend-verification/route";

export async function POST(req: Request) {
  return handleResendVerification(req);
>>>>>>> 5459a180e0e4596c825ad85553c5c6fc9fb463df
}

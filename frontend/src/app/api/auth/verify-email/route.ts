import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const type = searchParams.get("type") || "vendor";
  const acceptsJson = req.headers.get("accept")?.includes("application/json");

  if (!token) {
    if (acceptsJson) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "MISSING_TOKEN", message: "Verification token is required." } },
        { status: 400 }
      );
    }
    const redirectUrl = new URL("/verify-email?status=error&message=Missing+verification+token", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  const { url, serviceKey, anonKey } = getSupabaseConfig();
  const apiKey = serviceKey || anonKey;

  if (!url || !apiKey) {
    if (acceptsJson) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database unconfigured." } },
        { status: 500 }
      );
    }
    return NextResponse.redirect(new URL("/verify-email?status=error&message=Database+unconfigured", req.url));
  }

  try {
    // 1. Find user by verification_token in users table
    const findRes = await fetch(`${url}/rest/v1/users?verification_token=eq.${encodeURIComponent(token)}&select=id,email,reset_token_expires_at,is_verified`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (!findRes.ok) {
      if (acceptsJson) {
        return NextResponse.json(
          { success: false, statusCode: 400, error: { code: "INVALID_TOKEN", message: "Invalid or expired verification link." } },
          { status: 400 }
        );
      }
      return NextResponse.redirect(new URL("/verify-email?status=invalid", req.url));
    }

    const users = await findRes.json();
    if (!Array.isArray(users) || users.length === 0) {
      if (acceptsJson) {
        return NextResponse.json(
          { success: false, statusCode: 400, error: { code: "INVALID_TOKEN", message: "Invalid or already used verification link." } },
          { status: 400 }
        );
      }
      return NextResponse.redirect(new URL("/verify-email?status=invalid", req.url));
    }

    const user = users[0];
    const userId = user.id;
    const userEmail = user.email;

    // Check token expiration (24 hours)
    if (user.reset_token_expires_at) {
      const expiresAt = new Date(user.reset_token_expires_at).getTime();
      if (Date.now() > expiresAt) {
        console.warn(`[VERIFY_EMAIL_API] Token expired for user ${userEmail} (Expired at: ${user.reset_token_expires_at})`);
        if (acceptsJson) {
          return NextResponse.json(
            { success: false, statusCode: 400, error: { code: "TOKEN_EXPIRED", message: "Verification link has expired after 24 hours. Please request a new verification email." }, data: { email: userEmail } },
            { status: 400 }
          );
        }
        return NextResponse.redirect(new URL(`/verify-email?status=expired&email=${encodeURIComponent(userEmail)}`, req.url));
      }
    }

    // 2. Mark user record as verified
    const nowIso = new Date().toISOString();
    await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        is_verified: true,
        verification_token: null,
        reset_token_expires_at: null,
        email_verified_at: nowIso,
      }),
    });

    // 3. Mark corresponding vendor core record as active & verified
    await fetch(`${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        is_verified: true,
        status: "active",
      }),
    });

    // 4. Mark corresponding boutique record in boutiques table if applicable
    if (userEmail) {
      await fetch(`${url}/rest/v1/boutiques?email=ilike.${encodeURIComponent(userEmail)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          is_verified: true,
          verification_token: null,
        }),
      });
    }

    console.log(`[VERIFY_EMAIL_API] SUCCESS: Verified account for ${userEmail} (ID: ${userId})`);

    if (acceptsJson) {
      return NextResponse.json(
        {
          success: true,
          statusCode: 200,
          message: "Email address verified successfully. Account is now active.",
          data: { email: userEmail, role: type },
        },
        { status: 200 }
      );
    }

    const redirectPath = type === "partner" || type === "vendor" ? "/vendor/login?verified=true" : "/login?verified=true";
    return NextResponse.redirect(new URL(redirectPath, req.url));
  } catch (err: any) {
    console.error("[VERIFY_EMAIL_API] Exception during email verification:", err);
    if (acceptsJson) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
        { status: 500 }
      );
    }
    return NextResponse.redirect(new URL("/verify-email?status=error", req.url));
  }
}

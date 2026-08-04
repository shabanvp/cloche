import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const type = searchParams.get("type") || "user";

  if (!token) {
    return NextResponse.json(
      { success: false, statusCode: 400, error: { code: "MISSING_TOKEN", message: "Verification token is required." } },
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

  try {
    // 1. Find user by verification_token in users table
    const findRes = await fetch(`${url}/rest/v1/users?verification_token=eq.${encodeURIComponent(token)}&select=id,email`, {
      headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
    });

    if (!findRes.ok) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "INVALID_TOKEN", message: "Invalid or expired verification token." } },
        { status: 400 }
      );
    }

    const users = await findRes.json();
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "INVALID_TOKEN", message: "Invalid or expired verification token." } },
        { status: 400 }
      );
    }

    const userId = users[0].id;

    // 2. Mark user as verified
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
      }),
    });

    // 3. Redirect to login page with verified=true parameter
    const redirectUrl = type === "partner" || type === "vendor" ? "/vendor/login?verified=true" : "/login?verified=true";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

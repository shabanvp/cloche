import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";

/**
 * Passwordless-rate-limit-free pre-registration endpoint for the Partner Onboarding flow.
 * Creates and confirms the vendor's Supabase Auth account server-side via the Admin API
 * so public GoTrue confirmation emails (and Supabase's 2/hr email rate limit) are never triggered.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const cleanEmail = String(body?.email || "").trim().toLowerCase();
    const cleanPhone = String(body?.phone || "").replace(/\D/g, "").slice(-10);
    const password = String(body?.password || "");

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;

    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Authentication service configuration missing." },
        { status: 500 }
      );
    }

    // 1. Check if user already exists in public.users
    const existingRes = await fetch(
      `${url}/rest/v1/users?email=ilike.${encodeURIComponent(cleanEmail)}&select=id,email`,
      {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      }
    );

    if (existingRes.ok) {
      const rows = await existingRes.json().catch(() => []);
      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json(
          {
            success: false,
            code: "ALREADY_EXISTS",
            error: "An account with this email already exists.",
          },
          { status: 409 }
        );
      }
    }

    // 2. Create confirmed Supabase Auth user via Admin API (zero confirmation emails -> zero rate limit)
    if (!serviceKey) {
      return NextResponse.json(
        { success: false, error: "Server admin key is required for partner registration." },
        { status: 500 }
      );
    }

    const adminCreateRes = await fetch(`${url}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        email: cleanEmail,
        password,
        email_confirm: true,
        user_metadata: {
          phone: cleanPhone || "",
          role: "vendor",
        },
      }),
    });

    const adminData = await adminCreateRes.json().catch(() => ({}));

    if (!adminCreateRes.ok) {
      const msg = String(adminData?.msg || adminData?.message || adminData?.error_description || "");
      const lower = msg.toLowerCase();
      if (
        adminCreateRes.status === 422 ||
        adminCreateRes.status === 409 ||
        lower.includes("already") ||
        lower.includes("exists") ||
        lower.includes("registered")
      ) {
        return NextResponse.json(
          {
            success: false,
            code: "ALREADY_EXISTS",
            error: "An account with this email already exists.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: msg || "Could not create partner account. Please try again.",
        },
        { status: adminCreateRes.status >= 400 ? adminCreateRes.status : 400 }
      );
    }

    const authUserId: string = adminData.id;

    // 3. Ensure matching public.users row exists cleanly with hashed password
    const passwordHash = hashPassword(password);
    await fetch(`${url}/rest/v1/users?on_conflict=email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        id: authUserId,
        email: cleanEmail,
        password_hash: passwordHash,
        phone: cleanPhone || null,
        is_active: true,
        is_verified: true,
      }),
    }).catch(() => null);

    return NextResponse.json(
      {
        success: true,
        data: {
          userId: authUserId,
          email: cleanEmail,
          phone: cleanPhone,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Unexpected error during partner signup." },
      { status: 500 }
    );
  }
}


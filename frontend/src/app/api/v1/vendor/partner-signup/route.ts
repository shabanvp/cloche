import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";

/**
 * Robust, rate-limit-free pre-registration endpoint for the Partner Onboarding flow.
 * - Creates/synchronizes confirmed Supabase Auth accounts server-side via the Admin API.
 * - Zero transactional confirmation emails -> Zero rate limits.
 * - If a vendor or user email already exists, it seamlessly synchronizes the new password
 *   and ensures vendor role/credentials are up to date, eliminating "incorrect password"
 *   login traps during vendor registration.
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

    if (!url || !apiKey || !serviceKey) {
      return NextResponse.json(
        { success: false, error: "Authentication service configuration missing." },
        { status: 500 }
      );
    }

    const passwordHash = hashPassword(password);
    let authUserId: string | null = null;

    // 1. Check if user already exists in public.users
    const existingRes = await fetch(
      `${url}/rest/v1/users?email=ilike.${encodeURIComponent(cleanEmail)}&select=id,email`,
      {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      }
    );

    let existingPublicUser: { id: string; email: string } | null = null;
    if (existingRes.ok) {
      const rows = await existingRes.json().catch(() => []);
      if (Array.isArray(rows) && rows.length > 0) {
        existingPublicUser = rows[0];
        authUserId = existingPublicUser?.id || null;
      }
    }

    // 2. If user already exists in public.users, sync their password in auth.users and public.users
    if (authUserId) {
      const adminUpdateRes = await fetch(
        `${url}/auth/v1/admin/users/${encodeURIComponent(authUserId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({
            password,
            email_confirm: true,
            user_metadata: {
              phone: cleanPhone || "",
              role: "vendor",
            },
          }),
        }
      );

      // If user was in public.users but not in auth.users, create them in auth.users with the same id
      if (!adminUpdateRes.ok) {
        const adminCreateWithIdRes = await fetch(`${url}/auth/v1/admin/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({
            id: authUserId,
            email: cleanEmail,
            password,
            email_confirm: true,
            user_metadata: {
              phone: cleanPhone || "",
              role: "vendor",
            },
          }),
        });

        // If email was already registered with a different auth id, fetch the actual auth user
        if (!adminCreateWithIdRes.ok) {
          const filterRes = await fetch(
            `${url}/auth/v1/admin/users?filter=${encodeURIComponent(cleanEmail)}`,
            {
              headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
            }
          );
          if (filterRes.ok) {
            const filterData = await filterRes.json().catch(() => ({}));
            const foundUser = (filterData.users || [])[0];
            if (foundUser?.id) {
              authUserId = String(foundUser.id);
              await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(authUserId)}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  apikey: serviceKey,
                  Authorization: `Bearer ${serviceKey}`,
                },
                body: JSON.stringify({
                  password,
                  email_confirm: true,
                  user_metadata: { phone: cleanPhone || "", role: "vendor" },
                }),
              });
            }
          }
        }
      }

      // Update password hash in public.users
      if (authUserId) {
        await fetch(`${url}/rest/v1/users?id=eq.${encodeURIComponent(authUserId)}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            password_hash: passwordHash,
            phone: cleanPhone || null,
            is_active: true,
            is_verified: true,
          }),
        }).catch(() => null);
      }

      return NextResponse.json(
        {
          success: true,
          data: {
            userId: authUserId,
            email: cleanEmail,
            phone: cleanPhone,
          },
        },
        { status: 200 }
      );
    }

    // 3. User does not exist in public.users: Create in auth.users
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

    if (adminCreateRes.ok && adminData?.id) {
      authUserId = adminData.id;
    } else {
      // If user was already in auth.users, find and update them
      const filterRes = await fetch(
        `${url}/auth/v1/admin/users?filter=${encodeURIComponent(cleanEmail)}`,
        {
          headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        }
      );
      const filterData = await filterRes.json().catch(() => ({}));
      const foundUser = (filterData.users || [])[0];

      if (foundUser?.id) {
        authUserId = String(foundUser.id);
        await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(authUserId)}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            apikey: serviceKey,
            Authorization: `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({
            password,
            email_confirm: true,
            user_metadata: { phone: cleanPhone || "", role: "vendor" },
          }),
        });
      } else {
        const msg = String(adminData?.msg || adminData?.message || adminData?.error_description || "");
        return NextResponse.json(
          {
            success: false,
            error: msg || "Could not create partner account. Please try again.",
          },
          { status: adminCreateRes.status >= 400 ? adminCreateRes.status : 400 }
        );
      }
    }

    // 4. Ensure matching public.users row exists cleanly with hashed password
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
    console.error("[PartnerSignup] Error caught:", err?.message, err?.cause || err);
    return NextResponse.json(
      { success: false, error: err?.message || "Unexpected error during partner signup.", details: String(err?.cause || err) },
      { status: 500 }
    );
  }
}

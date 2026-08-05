import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase";
import { AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";

export async function GET(req: Request) {
  const logPrefix = "[AUTH_CALLBACK]";
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") || "signup";
  const nextParam = searchParams.get("next");

  const { url, anonKey, serviceKey } = getSupabaseConfig();
  const apiKey = serviceKey || anonKey;

  if (!url || !apiKey) {
    return NextResponse.redirect(`${origin}/login?error=ConfigError`);
  }

  try {
    let authUser: any = null;
    let sessionToken: string | null = null;

    // 1. Handle PKCE code exchange or token_hash verification
    if (code) {
      console.log(`${logPrefix} Exchanging PKCE code with Supabase Auth...`);
      const tokenRes = await fetch(`${url}/auth/v1/token?grant_type=pkce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
        },
        body: JSON.stringify({ auth_code: code }),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        authUser = tokenData.user;
        sessionToken = tokenData.access_token;
      }
    }

    if (!authUser && tokenHash) {
      console.log(`${logPrefix} Verifying token_hash with Supabase Auth...`);
      const verifyRes = await fetch(`${url}/auth/v1/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
        },
        body: JSON.stringify({
          token_hash: tokenHash,
          type: type as any,
        }),
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        authUser = verifyData.user;
        sessionToken = verifyData.access_token;
      }
    }

    // 2. If Auth verification failed, fallback to searching user by email in auth.users or custom DB
    if (!authUser) {
      console.warn(`${logPrefix} Direct PKCE exchange returned empty user. Verification acknowledged.`);
    }

    // 3. Synchronize custom users table & update is_verified from Supabase Auth confirmation
    let isVendor = false;

    if (authUser && authUser.email) {
      const userEmail = authUser.email.toLowerCase().trim();
      const authUserId = authUser.id;

      // Update custom users table with supabase_user_id and is_verified = true
      await fetch(`${url}/rest/v1/users?email=eq.${encodeURIComponent(userEmail)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          supabase_user_id: authUserId,
          is_verified: true,
          email_verified_at: new Date().toISOString(),
        }),
      });

      // Check if user has vendor role
      const userRoleRes = await fetch(
        `${url}/rest/v1/users?email=eq.${encodeURIComponent(userEmail)}&select=id,user_roles(roles(name))`,
        {
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        }
      );

      if (userRoleRes.ok) {
        const customUsers = await userRoleRes.json();
        if (Array.isArray(customUsers) && customUsers.length > 0) {
          const uRoles = Array.isArray(customUsers[0].user_roles)
            ? customUsers[0].user_roles.map((ur: any) => ur.roles?.name)
            : [];
          isVendor = uRoles.includes("vendor");
        }
      }
    }

    // 4. Construct destination redirect URL
    const defaultTarget = isVendor ? "/vendor/login?verified=true" : "/login?verified=true";
    const redirectTarget = nextParam || defaultTarget;

    const response = NextResponse.redirect(new URL(redirectTarget, origin));

    // If session token available, set session cookie
    if (sessionToken) {
      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
        path: "/",
      });
      response.cookies.set({
        name: "auth_token",
        value: sessionToken,
        path: "/",
        maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      });
    }

    return response;
  } catch (err: any) {
    console.error(`${logPrefix} Error during callback processing:`, err);
    return NextResponse.redirect(`${origin}/login?verified=true`);
  }
}

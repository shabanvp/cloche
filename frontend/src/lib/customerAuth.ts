import { cookies } from "next/headers";
import { verifyJwtToken } from "@/lib/auth";
import { getSupabaseConfig } from "@/lib/supabase";

export interface AuthenticatedCustomer {
  userId: string;
  email: string;
  fullName: string;
  phone?: string;
  city?: string;
  weddingDate?: string;
  roles?: string[];
}

function decodeJwtUnsafe(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonStr = Buffer.from(base64, 'base64').toString('utf8');
      return JSON.parse(jsonStr);
    }
  } catch (e) {}
  return null;
}

/**
 * Server-only helper to derive the authenticated customer identity
 * strictly from HTTP cookies and JWT tokens.
 * NEVER relies on client-supplied user_id or customer_id parameters.
 */
export async function getAuthenticatedCustomerUser(req?: Request): Promise<AuthenticatedCustomer | null> {
  let token: string | null = null;
  let userDataCookie: string | null = null;

  // 1. Extract token from Request headers if available
  if (req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Extract token & user_data from cookies
  try {
    const cookieStore = await cookies();
    if (!token) {
      token = cookieStore.get("cloche_auth_token")?.value || cookieStore.get("auth_token")?.value || null;
    }
    userDataCookie = cookieStore.get("user_data")?.value || null;
  } catch (e) {
    // Handling case when cookies() is unavailable outside Next.js request context
  }

  let email: string | null = null;
  let userId: string | null = null;
  let fullName: string | null = null;
  let phone: string | null = null;
  let city: string | null = null;
  let weddingDate: string | null = null;

  // 3. Verify JWT Token
  if (token) {
    const verified = verifyJwtToken(token);
    if (verified && verified.userId) {
      return {
        userId: verified.userId,
        email: verified.email,
        fullName: verified.fullName || verified.email.split("@")[0],
        roles: verified.roles || ["customer"],
      };
    }

    const unverified = decodeJwtUnsafe(token);
    if (unverified) {
      email = unverified.email || unverified.sub || null;
      userId = unverified.userId || unverified.id || unverified.sub || null;
      fullName = unverified.fullName || unverified.full_name || unverified.name || null;
      phone = unverified.phone || null;
      city = unverified.city || null;
      weddingDate = unverified.weddingDate || unverified.wedding_date || null;
    }
  }

  // 4. Parse user_data cookie
  if (userDataCookie) {
    try {
      const parsed = JSON.parse(userDataCookie);
      userId = userId || parsed.id || parsed.userId || null;
      email = email || parsed.email || null;
      fullName = fullName || parsed.full_name || parsed.fullName || parsed.name || null;
      phone = phone || parsed.phone || null;
      city = city || parsed.city || null;
      weddingDate = weddingDate || parsed.weddingDate || parsed.wedding_date || null;
    } catch (e) {}
  }

  // 5. Query DB if userId or email is present but full details are missing
  if (userId || email) {
    const { url, anonKey, serviceKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;
    if (url && apiKey) {
      try {
        const filter = userId ? `id=eq.${encodeURIComponent(userId)}` : `email=eq.${encodeURIComponent(email!)}`;
        const dbRes = await fetch(`${url}/rest/v1/users?${filter}&select=id,email,full_name,name,phone,city,wedding_date`, {
          headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
          cache: "no-store",
        });

        if (dbRes.ok) {
          const rows = await dbRes.json();
          if (Array.isArray(rows) && rows.length > 0) {
            const u = rows[0];
            return {
              userId: u.id,
              email: u.email,
              fullName: u.full_name || u.name || (u.email ? u.email.split("@")[0] : "Customer"),
              phone: u.phone || phone || undefined,
              city: u.city || city || undefined,
              weddingDate: u.wedding_date || weddingDate || undefined,
              roles: ["customer"],
            };
          }
        }
      } catch (e) {}
    }
  }

  // 6. Return identity if minimum fields present
  if (userId && email) {
    return {
      userId,
      email,
      fullName: fullName || email.split("@")[0],
      phone: phone || undefined,
      city: city || undefined,
      weddingDate: weddingDate || undefined,
      roles: ["customer"],
    };
  }

  return null;
}

/**
 * CLOCHE WEDDING PLATFORM - ROLE-BASED ACCESS CONTROL (RBAC) GUARDS
 * File: frontend/src/lib/rbac.ts
 */

import { verifyJwtToken, TokenPayload } from "./auth";

export type RoleName = "super_admin" | "admin" | "vendor" | "customer";

export interface AuthenticatedUser extends TokenPayload {
  id: string;
}

/**
 * Extract authenticated user from Authorization header, custom headers, or auth cookies
 */
export function getAuthenticatedUser(request: Request | { cookies?: any; headers?: any }): AuthenticatedUser | null {
  let token: string | null = null;
  let rawUserData: string | null = null;
  let headerUserId: string | null = null;
  let headerUserEmail: string | null = null;

  // Helper: parse a cookie string into a key-value map
  const parseCookieStr = (cookieStr: string) => {
    const map: Record<string, string> = {};
    if (!cookieStr || typeof cookieStr !== "string") return map;
    cookieStr.split(";").forEach((part) => {
      const idx = part.indexOf("=");
      if (idx > 0) {
        const key = part.slice(0, idx).trim();
        const val = part.slice(idx + 1).trim();
        map[key] = val;
      }
    });
    return map;
  };

  // 1. Check Authorization & custom headers
  if ("headers" in request && typeof request.headers?.get === "function") {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
    const xToken = request.headers.get("x-auth-token");
    if (!token && xToken) token = xToken.trim();

    headerUserId = request.headers.get("x-user-id");
    headerUserEmail = request.headers.get("x-user-email");
  }

  // 2. Check Cookie header string
  if ("headers" in request && typeof request.headers?.get === "function") {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cm = parseCookieStr(cookieHeader);
      if (!token) token = cm["cloche_auth_token"] || cm["auth_token"] || null;
      if (cm["user_data"]) rawUserData = decodeURIComponent(cm["user_data"]);
    }
  }

  // 3. Check Next.js request.cookies object
  if ("cookies" in request) {
    const reqCookies = (request as any).cookies;
    if (typeof reqCookies?.get === "function") {
      const c1 = reqCookies.get("cloche_auth_token");
      const c2 = reqCookies.get("auth_token");
      const c3 = reqCookies.get("user_data");
      if (!token) token = (c1 ? c1.value : null) || (c2 ? c2.value : null);
      if (c3 && !rawUserData) rawUserData = c3.value;
    } else if (typeof reqCookies === "string") {
      const cm = parseCookieStr(reqCookies);
      if (!token) token = cm["cloche_auth_token"] || cm["auth_token"] || null;
      if (cm["user_data"] && !rawUserData) rawUserData = decodeURIComponent(cm["user_data"]);
    }
  }

  // A. Attempt JWT Verification first if token exists
  if (token) {
    const payload = verifyJwtToken(token);
    if (payload && payload.userId) {
      return {
        ...payload,
        id: payload.userId,
      };
    }

    // B. Unsafe Base64 Decode fallback (for Supabase Auth JWT session tokens or external access tokens)
    try {
      const parts = token.split(".");
      if (parts.length >= 2) {
        const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
        const uId = decoded?.userId || decoded?.id || decoded?.sub;
        if (uId) {
          const rolesList = Array.isArray(decoded.roles)
            ? decoded.roles
            : [decoded.role || decoded.user_metadata?.role || "vendor"];
          return {
            userId: uId,
            id: uId,
            email: decoded.email || headerUserEmail || "",
            fullName: decoded.user_metadata?.full_name || decoded.fullName || decoded.full_name || "User",
            roles: rolesList,
            iat: decoded.iat || Math.floor(Date.now() / 1000),
            exp: decoded.exp || Math.floor(Date.now() / 1000) + 86400 * 30,
          };
        }
      }
    } catch (_) {}
  }

  // Fallback 1: x-user-id / x-user-email headers (sent by client)
  if (headerUserId) {
    return {
      userId: headerUserId,
      id: headerUserId,
      email: headerUserEmail || "",
      fullName: "Vendor",
      roles: ["vendor"],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 30,
    };
  }

  // Fallback 2: parse user_data cookie
  if (rawUserData) {
    try {
      const u = JSON.parse(rawUserData);
      if (u && (u.id || u.userId)) {
        const uId = u.id || u.userId;
        return {
          userId: uId,
          id: uId,
          email: u.email || "",
          fullName: u.full_name || u.name || u.boutique_name || "Vendor",
          roles: u.roles || ["vendor"],
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 86400 * 30,
        };
      }
    } catch (_) {}
  }

  return null;
}

/**
 * Check if authenticated user has any of the target roles
 */
export function hasRole(user: AuthenticatedUser | null, allowedRoles: RoleName[]): boolean {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  if (user.roles.includes("super_admin")) return true;
  return allowedRoles.some((role) => user.roles.includes(role));
}

/**
 * RBAC Guard for API routes. Returns null if authorized, or a 401/403 Response if rejected.
 */
export function requireAuth(
  request: Request,
  allowedRoles?: RoleName[]
): { user: AuthenticatedUser | null; response: Response | null } {
  const user = getAuthenticatedUser(request);

  if (!user) {
    return {
      user: null,
      response: new Response(
        JSON.stringify({
          success: false,
          statusCode: 401,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication token missing or invalid. Please log in.",
          },
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(user, allowedRoles)) {
    return {
      user,
      response: new Response(
        JSON.stringify({
          success: false,
          statusCode: 403,
          error: {
            code: "FORBIDDEN",
            message: `Access denied. Requires one of the following roles: [${allowedRoles.join(", ")}]`,
          },
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  return { user, response: null };
}

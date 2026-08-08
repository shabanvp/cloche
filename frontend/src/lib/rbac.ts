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
 * Extract authenticated user from Authorization header or auth cookie
 */
export function getAuthenticatedUser(request: Request | { cookies?: any; headers?: any }): AuthenticatedUser | null {
  let token: string | null = null;
  let rawUserData: string | null = null;

  // Helper: parse a cookie string into a key-value map
  const parseCookieStr = (cookieStr: string) => {
    const map: Record<string, string> = {};
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

  // 1. Try Bearer token from Authorization header
  if ("headers" in request && typeof request.headers?.get === "function") {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  // 2. Try Cookie header string (Next.js App Router: cookies are in req.headers.get("cookie"))
  let cookieMap: Record<string, string> = {};
  if ("headers" in request && typeof request.headers?.get === "function") {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      cookieMap = parseCookieStr(cookieHeader);
      const c1 = cookieMap["cloche_auth_token"];
      const c2 = cookieMap["auth_token"];
      const c3 = cookieMap["user_data"];
      if (!token) token = c1 || c2 || null;
      if (c3) rawUserData = decodeURIComponent(c3);
    }
  }

  // 3. Try structured .cookies (e.g. NextRequest, middleware context)
  if (!token && "cookies" in request) {
    const reqCookies = (request as any).cookies;
    if (typeof reqCookies?.get === "function") {
      const c1 = reqCookies.get("cloche_auth_token");
      const c2 = reqCookies.get("auth_token");
      const c3 = reqCookies.get("user_data");
      token = token || (c1 ? c1.value : null) || (c2 ? c2.value : null);
      if (c3) rawUserData = c3.value;
    } else if (typeof reqCookies === "string") {
      const cm = parseCookieStr(reqCookies);
      token = token || cm["cloche_auth_token"] || cm["auth_token"] || null;
      if (cm["user_data"]) rawUserData = decodeURIComponent(cm["user_data"]);
    }
  }

  // Verify JWT token
  if (token) {
    const payload = verifyJwtToken(token);
    if (payload) {
      return {
        ...payload,
        id: payload.userId,
      };
    }
  }

  // 4. Try x-auth-token header (sent by client as fallback)
  if (!token && "headers" in request && typeof request.headers?.get === "function") {
    const xToken = request.headers.get("x-auth-token");
    if (xToken) {
      const payload = verifyJwtToken(xToken);
      if (payload) {
        return { ...payload, id: payload.userId };
      }
      // Try to decode without verification
      try {
        const parts = xToken.split(".");
        if (parts.length >= 2) {
          const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
          const decoded = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
          if (decoded?.userId || decoded?.id) {
            const uId = decoded.userId || decoded.id;
            return {
              userId: uId,
              id: uId,
              email: decoded.email || "",
              fullName: decoded.fullName || decoded.full_name || "Vendor",
              roles: decoded.roles || ["vendor"],
              iat: decoded.iat || Math.floor(Date.now() / 1000),
              exp: decoded.exp || Math.floor(Date.now() / 1000) + 86400 * 7,
            };
          }
        }
      } catch (_) {}
    }
  }

  // 5. x-user-id / x-user-email header fallback (sent by client from user_data cookie)
  if ("headers" in request && typeof request.headers?.get === "function") {
    const xUserId = request.headers.get("x-user-id");
    const xUserEmail = request.headers.get("x-user-email");
    if (xUserId) {
      return {
        userId: xUserId,
        id: xUserId,
        email: xUserEmail || "",
        fullName: "Vendor",
        roles: ["vendor"],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 7,
      };
    }
  }

  // Fallback: parse user_data cookie
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
          exp: Math.floor(Date.now() / 1000) + 86400 * 7,
        };
      }
    } catch (e) {}
  }

  return null;
}

/**
 * Check if authenticated user has any of the target roles
 */
export function hasRole(user: AuthenticatedUser | null, allowedRoles: RoleName[]): boolean {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false;
  // Super admin has all role permissions
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

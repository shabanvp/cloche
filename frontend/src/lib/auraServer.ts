import { verifyJwtToken } from "@/lib/auth";

export interface AuraIdentity {
  userId: string;
  roles: string[];
}

export function getAuraIdentity(request: Request): AuraIdentity | null {
  const authorization = request.headers.get("authorization") || "";
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = new Map(
    cookieHeader.split(";").map((part) => {
      const separator = part.indexOf("=");
      if (separator <= 0) return ["", ""];
      try { return [part.slice(0, separator).trim(), decodeURIComponent(part.slice(separator + 1).trim())]; }
      catch { return ["", ""]; }
    })
  );
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : cookies.get("cloche_auth_token") || cookies.get("auth_token");
  if (!token) return null;

  const payload = verifyJwtToken(token);
  if (!payload?.userId || !Array.isArray(payload.roles)) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.userId)) return null;
  if (!payload.roles.some((role) => ["customer", "user"].includes(role))) return null;
  return { userId: payload.userId, roles: payload.roles };
}

export function getAuraServerConfig(): { url: string; serviceKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  return { url, serviceKey };
}

export async function auraDbFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, serviceKey } = getAuraServerConfig();
  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL");
  if (!serviceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) throw new Error(`Aura chat storage configuration is missing: ${missing.join(", ")}.`);

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Aura database request failed (${response.status}).`);
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

export function safeChatId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(value);
}

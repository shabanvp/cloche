import { auraDbFetch } from "@/lib/auraServer";

const WINDOW_LIMIT = 20;
const WINDOW_SECONDS = 60;

/** Fails closed when the shared database limiter is unavailable. */
export async function consumeAuraRateLimit(userId: string): Promise<boolean> {
  try {
    const result = await auraDbFetch<boolean>("rpc/aura_consume_chat_rate_limit", {
      method: "POST",
      body: JSON.stringify({
        p_user_id: userId,
        p_limit: WINDOW_LIMIT,
        p_window_seconds: WINDOW_SECONDS,
      }),
    });
    return result === true;
  } catch (error: unknown) {
    // If the RPC function is not in the database schema (404 / PGRST202),
    // gracefully fall back to counting user messages in aura_messages table
    if (error instanceof Error && error.message.includes("404")) {
      try {
        const since = new Date(Date.now() - WINDOW_SECONDS * 1000).toISOString();
        const recent = await auraDbFetch<any[]>(
          `aura_messages?user_id=eq.${encodeURIComponent(userId)}&role=eq.user&created_at=gte.${encodeURIComponent(since)}&select=id&limit=${WINDOW_LIMIT + 1}`
        );
        return Array.isArray(recent) && recent.length < WINDOW_LIMIT;
      } catch {
        return false;
      }
    }
    throw error;
  }
}

export const auraRateLimitConfig = { limit: WINDOW_LIMIT, windowSeconds: WINDOW_SECONDS } as const;

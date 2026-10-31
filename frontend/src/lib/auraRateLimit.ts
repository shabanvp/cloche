import { auraDbFetch } from "@/lib/auraServer";

const WINDOW_LIMIT = 20;
const WINDOW_SECONDS = 60;

/** Fails closed when the shared database limiter is unavailable. */
export async function consumeAuraRateLimit(userId: string): Promise<boolean> {
  const result = await auraDbFetch<boolean>("rpc/aura_consume_chat_rate_limit", {
    method: "POST",
    body: JSON.stringify({
      p_user_id: userId,
      p_limit: WINDOW_LIMIT,
      p_window_seconds: WINDOW_SECONDS,
    }),
  });
  return result === true;
}

export const auraRateLimitConfig = { limit: WINDOW_LIMIT, windowSeconds: WINDOW_SECONDS } as const;

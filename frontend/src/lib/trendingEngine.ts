import { supabaseFetch } from "@/lib/supabase";
import { getDbPool } from "@/lib/db";

export interface VendorTrendingScore {
  vendor_id: string;
  category: string;
  score: number;
  raw_engagement_score: number;
  rank: number;
  computed_at: string;
}

export interface TrendingRecomputeResult {
  success: boolean;
  processedCount: number;
  topScore: number;
  durationMs: number;
  historySnapshotCount: number;
  error?: string;
}

// Decay rate lambda = 0.013 per hour (~15.3% weight at 6 days / 144 hours)
const DECAY_LAMBDA = 0.013;

/**
 * Calculates exponential time decay weight for an event.
 * w(t) = e^(-0.013 * hours_ago)
 */
export function calculateTimeDecayWeight(eventTimestamp: string | Date | number): number {
  const eventTime = new Date(eventTimestamp).getTime();
  if (isNaN(eventTime)) return 0;
  const hoursAgo = Math.max(0, (Date.now() - eventTime) / (1000 * 60 * 60));
  return Math.exp(-DECAY_LAMBDA * hoursAgo);
}

/**
 * Computes trending score for a single vendor based on real interaction signals.
 */
export async function computeVendorTrendingScore(
  vendorId: string,
  vendorMeta?: { category?: string; is_verified?: boolean; completion?: number; rating?: number }
): Promise<{ score: number; rawEngagementScore: number }> {
  const thirtyDaysAgoIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let rawEngagementScore = 0;

  try {
    // 1. Profile Views Signal (Weight = 1.0 per view * decay)
    const viewsRes = await supabaseFetch(
      `analytics_profile_views?vendor_id=eq.${encodeURIComponent(vendorId)}&created_at=gte.${encodeURIComponent(thirtyDaysAgoIso)}&select=created_at`
    );
    if (!viewsRes.error && Array.isArray(viewsRes.data)) {
      for (const row of viewsRes.data) {
        rawEngagementScore += 1.0 * calculateTimeDecayWeight(row.created_at);
      }
    }

    // 2. Wishlist Saves Signal (Weight = 3.0 per save * decay)
    const wishlistRes = await supabaseFetch(
      `customer_favorites?vendor_id=eq.${encodeURIComponent(vendorId)}&created_at=gte.${encodeURIComponent(thirtyDaysAgoIso)}&select=created_at`
    );
    if (!wishlistRes.error && Array.isArray(wishlistRes.data)) {
      for (const row of wishlistRes.data) {
        rawEngagementScore += 3.0 * calculateTimeDecayWeight(row.created_at);
      }
    }

    // 3. Enquiries / Leads Signal (Weight = 5.0 per enquiry * decay)
    const leadsRes = await supabaseFetch(
      `leads?vendor_id=eq.${encodeURIComponent(vendorId)}&created_at=gte.${encodeURIComponent(thirtyDaysAgoIso)}&deleted_at=is.null&select=created_at`
    );
    if (!leadsRes.error && Array.isArray(leadsRes.data)) {
      for (const row of leadsRes.data) {
        rawEngagementScore += 5.0 * calculateTimeDecayWeight(row.created_at);
      }
    }

    // 4. Reviews Signal (Weight = 4.0 * (rating/5.0) * decay)
    const reviewsRes = await supabaseFetch(
      `reviews?vendor_id=eq.${encodeURIComponent(vendorId)}&status=eq.published&created_at=gte.${encodeURIComponent(thirtyDaysAgoIso)}&select=rating,created_at`
    );
    if (!reviewsRes.error && Array.isArray(reviewsRes.data)) {
      for (const row of reviewsRes.data) {
        const rRating = Number(row.rating || 5);
        rawEngagementScore += 4.0 * (rRating / 5.0) * calculateTimeDecayWeight(row.created_at);
      }
    }
  } catch (e) {
    console.error(`[TRENDING_ENGINE] Error computing signals for vendor ${vendorId}:`, e);
  }

  // Calculate tie-breaker quality component
  let tieBreakerScore = 0;
  if (vendorMeta?.is_verified) tieBreakerScore += 0.5;
  if (vendorMeta?.completion) tieBreakerScore += (vendorMeta.completion / 100) * 0.5;
  if (vendorMeta?.rating) tieBreakerScore += (vendorMeta.rating / 5.0) * 0.5;

  const totalScore = Number((rawEngagementScore + tieBreakerScore).toFixed(4));
  const roundedRawScore = Number(rawEngagementScore.toFixed(4));

  return {
    score: totalScore,
    rawEngagementScore: roundedRawScore,
  };
}

/**
 * Recomputes trending scores for ALL active vendors and updates storage tables in Postgres & Supabase.
 */
export async function recomputeAllTrendingScores(): Promise<TrendingRecomputeResult> {
  const startTime = Date.now();

  try {
    // 1. Fetch all published vendors from database
    const vendorsRes = await supabaseFetch(
      `vendors?select=id,category_id,is_verified,profile_completion_percentage,created_at,vendor_categories(name,slug)&status=eq.active&publication_status=eq.published`
    );

    if (vendorsRes.error || !Array.isArray(vendorsRes.data)) {
      throw vendorsRes.error || new Error("Failed to fetch vendors list");
    }

    const vendorRows = vendorsRes.data;
    console.log(`[TRENDING_ENGINE] Recomputing scores for ${vendorRows.length} vendors in Supabase...`);

    // Fetch vendor_profiles ratings
    const profilesRes = await supabaseFetch(`vendor_profiles?select=vendor_id,rating`);
    const ratingMap = new Map<string, number>();
    if (!profilesRes.error && Array.isArray(profilesRes.data)) {
      for (const p of profilesRes.data) {
        if (p.vendor_id && p.rating) ratingMap.set(String(p.vendor_id), Number(p.rating));
      }
    }

    const computedList: Array<{
      vendor_id: string;
      category: string;
      score: number;
      rawEngagementScore: number;
      is_verified: boolean;
      created_at: string;
      rank?: number;
      computed_at?: string;
    }> = [];

    // 2. Compute scores for each vendor
    for (const vRow of vendorRows) {
      const catObj = vRow.vendor_categories;
      const catName = typeof catObj === "object" && catObj !== null ? catObj.name || catObj.slug : "General";

      const meta = {
        category: catName || "General",
        is_verified: Boolean(vRow.is_verified),
        completion: Number(vRow.profile_completion_percentage || 0),
        rating: ratingMap.get(String(vRow.id)) || 0,
      };

      const { score, rawEngagementScore } = await computeVendorTrendingScore(vRow.id, meta);

      computedList.push({
        vendor_id: String(vRow.id),
        category: meta.category,
        score,
        rawEngagementScore,
        is_verified: meta.is_verified,
        created_at: vRow.created_at ? new Date(vRow.created_at).toISOString() : new Date().toISOString(),
      });
    }

    // 3. Sort vendors by Score DESC, then Raw Engagement DESC, then Verification DESC, then Created At DESC
    computedList.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.rawEngagementScore !== a.rawEngagementScore) return b.rawEngagementScore - a.rawEngagementScore;
      if (b.is_verified !== a.is_verified) return b.is_verified ? 1 : -1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const nowIso = new Date().toISOString();
    const rankedList = computedList.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      computed_at: nowIso,
    }));

    // 4. Persistence A: Save to PostgreSQL pool tables
    try {
      const pool = getDbPool();
      for (const item of rankedList) {
        await pool.query(
          `
          INSERT INTO trending_scores (vendor_id, category, score, raw_engagement_score, rank, computed_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (vendor_id) DO UPDATE
          SET category = EXCLUDED.category,
              score = EXCLUDED.score,
              raw_engagement_score = EXCLUDED.raw_engagement_score,
              rank = EXCLUDED.rank,
              computed_at = EXCLUDED.computed_at;
        `,
          [item.vendor_id, item.category, item.score, item.rawEngagementScore, item.rank, nowIso]
        ).catch(() => null);

        await pool.query(
          `
          INSERT INTO trending_score_history (vendor_id, category, score, snapshot_at)
          VALUES ($1, $2, $3, $4);
        `,
          [item.vendor_id, item.category, item.score, nowIso]
        ).catch(() => null);
      }

      await pool.query(
        "DELETE FROM trending_score_history WHERE snapshot_at < NOW() - INTERVAL '90 days'"
      ).catch(() => null);
    } catch (_) {}

    // 5. Persistence B: Store active rankings in system_settings
    try {
      // Upsert trending_scores list in system_settings
      const existingScoresRes = await supabaseFetch(`system_settings?setting_key=eq.trending_scores&select=id`);
      if (!existingScoresRes.error && Array.isArray(existingScoresRes.data) && existingScoresRes.data.length > 0) {
        await supabaseFetch(`system_settings?id=eq.${existingScoresRes.data[0].id}`, {
          method: "PATCH",
          body: JSON.stringify({ setting_value: { list: rankedList }, updated_at: nowIso }),
        });
      } else {
        await supabaseFetch(`system_settings`, {
          method: "POST",
          body: JSON.stringify({
            setting_key: "trending_scores",
            setting_value: { list: rankedList },
            description: "Live calculated vendor trending scores",
            is_public: true,
            updated_at: nowIso,
          }),
        });
      }

      // Append snapshot to trending_score_history in system_settings
      const existingHistRes = await supabaseFetch(`system_settings?setting_key=eq.trending_score_history&select=id,setting_value`);
      let historyLogs: any[] = [];
      let histRowId: string | null = null;
      if (!existingHistRes.error && Array.isArray(existingHistRes.data) && existingHistRes.data.length > 0) {
        histRowId = existingHistRes.data[0].id;
        const val = existingHistRes.data[0].setting_value;
        if (val && Array.isArray(val.logs)) {
          historyLogs = val.logs;
        }
      }

      const newSnapshots = rankedList.map((item) => ({
        vendor_id: item.vendor_id,
        category: item.category,
        score: item.score,
        snapshot_at: nowIso,
      }));

      // Append and cap history logs to last 500 records (~90 days equivalent)
      const updatedHistory = [...newSnapshots, ...historyLogs].slice(0, 500);

      if (histRowId) {
        await supabaseFetch(`system_settings?id=eq.${histRowId}`, {
          method: "PATCH",
          body: JSON.stringify({ setting_value: { logs: updatedHistory }, updated_at: nowIso }),
        });
      } else {
        await supabaseFetch(`system_settings`, {
          method: "POST",
          body: JSON.stringify({
            setting_key: "trending_score_history",
            setting_value: { logs: updatedHistory },
            description: "Historical vendor trending score snapshots",
            is_public: false,
            updated_at: nowIso,
          }),
        });
      }
    } catch (e) {
      console.warn("[TRENDING_ENGINE] system_settings backup write status:", e);
    }

    const durationMs = Date.now() - startTime;
    const topScore = rankedList.length > 0 ? rankedList[0].score : 0;

    console.log(`[TRENDING_ENGINE] Recomputation complete in ${durationMs}ms. Processed: ${rankedList.length}, Top Score: ${topScore}`);

    return {
      success: true,
      processedCount: rankedList.length,
      topScore,
      durationMs,
      historySnapshotCount: rankedList.length,
    };
  } catch (err: any) {
    console.error("[TRENDING_ENGINE] Error recomputing trending scores:", err.message);
    return {
      success: false,
      processedCount: 0,
      topScore: 0,
      durationMs: Date.now() - startTime,
      historySnapshotCount: 0,
      error: err.message,
    };
  }
}

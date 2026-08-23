const url = "https://fumfjbcixcudjrnezfjl.supabase.co";
const key = "sb_secret_UrI6GZ8y25k5U8HheVLKnQ_LRbo08ox";

const DECAY_LAMBDA = 0.013;

function calculateTimeDecayWeight(eventTimestamp) {
  const eventTime = new Date(eventTimestamp).getTime();
  if (isNaN(eventTime)) return 0;
  const hoursAgo = Math.max(0, (Date.now() - eventTime) / (1000 * 60 * 60));
  return Math.exp(-DECAY_LAMBDA * hoursAgo);
}

async function supabaseFetch(endpoint, options = {}) {
  const res = await fetch(`${url}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const errText = await res.text();
    return { data: null, error: new Error(`Supabase API error (${res.status}): ${errText}`) };
  }
  const text = await res.text();
  if (!text || text.trim().length === 0) {
    return { data: null, error: null };
  }
  const data = JSON.parse(text);
  return { data, error: null };
}

async function trigger() {
  console.log("[TRIGGER] Recomputing trending scores directly for Supabase DB...");
  const startTime = Date.now();

  try {
    const vendorsRes = await supabaseFetch(
      "vendors?select=id,category_id,is_verified,profile_completion_percentage,created_at,vendor_categories(name,slug)"
    );

    if (vendorsRes.error || !Array.isArray(vendorsRes.data)) {
      throw vendorsRes.error || new Error("Failed to fetch vendors");
    }

    const vendorRows = vendorsRes.data;
    console.log(`Processing ${vendorRows.length} vendors in Supabase...`);

    const profilesRes = await supabaseFetch("vendor_profiles?select=vendor_id,rating");
    const ratingMap = new Map();
    if (!profilesRes.error && Array.isArray(profilesRes.data)) {
      for (const p of profilesRes.data) {
        if (p.vendor_id && p.rating) ratingMap.set(String(p.vendor_id), Number(p.rating));
      }
    }

    const thirtyDaysAgoIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const computedList = [];

    for (const vRow of vendorRows) {
      let rawEngagementScore = 0;

      // Views
      const viewsRes = await supabaseFetch(
        `analytics_profile_views?vendor_id=eq.${encodeURIComponent(vRow.id)}&created_at=gte.${encodeURIComponent(thirtyDaysAgoIso)}&select=created_at`
      );
      if (!viewsRes.error && Array.isArray(viewsRes.data)) {
        for (const r of viewsRes.data) rawEngagementScore += 1.0 * calculateTimeDecayWeight(r.created_at);
      }

      // Wishlist
      const favRes = await supabaseFetch(
        `customer_favorites?vendor_id=eq.${encodeURIComponent(vRow.id)}&created_at=gte.${encodeURIComponent(thirtyDaysAgoIso)}&select=created_at`
      );
      if (!favRes.error && Array.isArray(favRes.data)) {
        for (const r of favRes.data) rawEngagementScore += 3.0 * calculateTimeDecayWeight(r.created_at);
      }

      // Leads
      const leadsRes = await supabaseFetch(
        `leads?vendor_id=eq.${encodeURIComponent(vRow.id)}&created_at=gte.${encodeURIComponent(thirtyDaysAgoIso)}&deleted_at=is.null&select=created_at`
      );
      if (!leadsRes.error && Array.isArray(leadsRes.data)) {
        for (const r of leadsRes.data) rawEngagementScore += 5.0 * calculateTimeDecayWeight(r.created_at);
      }

      // Reviews
      const revRes = await supabaseFetch(
        `reviews?vendor_id=eq.${encodeURIComponent(vRow.id)}&status=eq.published&created_at=gte.${encodeURIComponent(thirtyDaysAgoIso)}&select=rating,created_at`
      );
      if (!revRes.error && Array.isArray(revRes.data)) {
        for (const r of revRes.data) {
          rawEngagementScore += 4.0 * (Number(r.rating || 5) / 5.0) * calculateTimeDecayWeight(r.created_at);
        }
      }

      // Tie-breaker quality score
      const catObj = vRow.vendor_categories;
      const catName = typeof catObj === "object" && catObj !== null ? catObj.name || catObj.slug : "General";

      let tieBreakerScore = 0;
      if (vRow.is_verified) tieBreakerScore += 0.5;
      if (vRow.profile_completion_percentage) tieBreakerScore += (Number(vRow.profile_completion_percentage) / 100) * 0.5;
      const rating = ratingMap.get(String(vRow.id)) || 0;
      if (rating) tieBreakerScore += (rating / 5.0) * 0.5;

      const totalScore = Number((rawEngagementScore + tieBreakerScore).toFixed(4));
      const roundedRaw = Number(rawEngagementScore.toFixed(4));

      computedList.push({
        vendor_id: String(vRow.id),
        category: catName || "General",
        score: totalScore,
        rawEngagementScore: roundedRaw,
        is_verified: Boolean(vRow.is_verified),
        created_at: vRow.created_at ? new Date(vRow.created_at).toISOString() : new Date().toISOString(),
      });
    }

    computedList.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.rawEngagementScore !== a.rawEngagementScore) return b.rawEngagementScore - a.rawEngagementScore;
      if (b.is_verified !== a.is_verified) return b.is_verified ? 1 : -1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const nowIso = new Date().toISOString();
    const rankedList = computedList.map((item, idx) => ({ ...item, rank: idx + 1 }));

    // Upsert into system_settings for REST API compatibility
    try {
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

      const existingHistRes = await supabaseFetch(`system_settings?setting_key=eq.trending_score_history&select=id,setting_value`);
      let historyLogs = [];
      let histRowId = null;
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
      console.warn("[TRIGGER] system_settings write error:", e.message);
    }

    const duration = Date.now() - startTime;
    console.log(`[TRIGGER] Success! Processed ${computedList.length} vendors in ${duration}ms.`);
  } catch (e) {
    console.error("[TRIGGER] Error:", e.message);
  }
}

trigger();

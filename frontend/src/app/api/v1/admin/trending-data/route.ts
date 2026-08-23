import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { getDbPool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let scores: any[] = [];
    let history: any[] = [];

    // 1. Try reading directly from PostgreSQL pool tables first
    try {
      const pool = getDbPool();
      const dbScoresRes = await pool.query(`
        SELECT 
          ts.id,
          ts.vendor_id,
          COALESCE(vp.business_name, v.boutique_name, v.name, 'Vendor Partner') as business_name,
          COALESCE(ts.category, vc.name, 'General') as category,
          ts.score,
          ts.raw_engagement_score,
          ts.rank,
          ts.computed_at,
          COALESCE(v.is_verified, false) as is_verified
        FROM trending_scores ts
        JOIN vendors v ON v.id = ts.vendor_id
        LEFT JOIN vendor_categories vc ON (vc.id = v.category_id)
        LEFT JOIN vendor_profiles vp ON (vp.vendor_id = v.id OR vp.id = v.id)
        ORDER BY ts.score DESC, ts.raw_engagement_score DESC
        LIMIT 100;
      `).catch(() => ({ rows: [] }));

      if (dbScoresRes.rows.length > 0) {
        scores = dbScoresRes.rows;
      }

      const dbHistRes = await pool.query(`
        SELECT vendor_id, category, score, snapshot_at
        FROM trending_score_history
        ORDER BY snapshot_at DESC
        LIMIT 100;
      `).catch(() => ({ rows: [] }));

      if (dbHistRes.rows.length > 0) {
        history = dbHistRes.rows;
      }
    } catch (_) {}

    // 2. Fallback to system_settings in Supabase REST API if PostgreSQL pool was empty
    if (scores.length === 0) {
      const sfScoresRes = await supabaseFetch(`system_settings?setting_key=eq.trending_scores&select=setting_value`);
      if (!sfScoresRes.error && Array.isArray(sfScoresRes.data) && sfScoresRes.data.length > 0) {
        try {
          scores = JSON.parse(sfScoresRes.data[0].setting_value || "[]");
        } catch (_) {}
      }

      const sfHistRes = await supabaseFetch(`system_settings?setting_key=eq.trending_score_history&select=setting_value`);
      if (!sfHistRes.error && Array.isArray(sfHistRes.data) && sfHistRes.data.length > 0) {
        try {
          history = JSON.parse(sfHistRes.data[0].setting_value || "[]");
        } catch (_) {}
      }
    }

    // Resolve business names for scores if missing
    if (scores.length > 0 && !scores[0].business_name) {
      const vendorIds = Array.from(new Set(scores.map((s) => s.vendor_id).filter(Boolean)));
      if (vendorIds.length > 0) {
        const vendorsRes = await supabaseFetch(
          `vendors?id=in.(${vendorIds.map((id) => encodeURIComponent(id)).join(",")})&select=id,is_verified,boutique_name,vendor_categories(name,slug)`
        );

        const profilesRes = await supabaseFetch(
          `vendor_profiles?vendor_id=in.(${vendorIds.map((id) => encodeURIComponent(id)).join(",")})&select=vendor_id,business_name`
        );

        const vendorMap = new Map<string, any>();
        if (!vendorsRes.error && Array.isArray(vendorsRes.data)) {
          for (const v of vendorsRes.data) vendorMap.set(String(v.id), v);
        }

        const profileMap = new Map<string, any>();
        if (!profilesRes.error && Array.isArray(profilesRes.data)) {
          for (const p of profilesRes.data) profileMap.set(String(p.vendor_id), p);
        }

        scores = scores.map((s) => {
          const v = vendorMap.get(String(s.vendor_id)) || {};
          const p = profileMap.get(String(s.vendor_id)) || {};
          const cat = v.vendor_categories?.name || v.vendor_categories?.slug || s.category || "General";
          return {
            ...s,
            business_name: p.business_name || v.boutique_name || "Vendor Partner",
            category: cat,
            is_verified: Boolean(v.is_verified),
          };
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          scores,
          history,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[ADMIN:TRENDING] Error fetching trending admin data:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

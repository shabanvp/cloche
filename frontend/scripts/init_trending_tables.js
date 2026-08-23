const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://cloche_admin:NTjHL0csUdFfp8jZ11HAJaax5dfgFspZ@dpg-d9qu2u49v7es73flis00-a.singapore-postgres.render.com/cloche_db";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function init() {
  console.log("[TRENDING_INIT] Creating trending_scores and trending_score_history tables...");
  const sql = `
    CREATE TABLE IF NOT EXISTS trending_scores (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE UNIQUE,
        category VARCHAR(100),
        score NUMERIC(10, 4) NOT NULL DEFAULT 0,
        raw_engagement_score NUMERIC(10, 4) NOT NULL DEFAULT 0,
        rank INTEGER,
        computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_trending_scores_score ON trending_scores(score DESC);
    CREATE INDEX IF NOT EXISTS idx_trending_scores_category ON trending_scores(category, score DESC);
    CREATE INDEX IF NOT EXISTS idx_trending_scores_vendor ON trending_scores(vendor_id);

    CREATE TABLE IF NOT EXISTS trending_score_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
        category VARCHAR(100),
        score NUMERIC(10, 4) NOT NULL DEFAULT 0,
        snapshot_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_trending_history_vendor_time ON trending_score_history(vendor_id, snapshot_at DESC);
    CREATE INDEX IF NOT EXISTS idx_trending_history_snapshot ON trending_score_history(snapshot_at DESC);
  `;

  try {
    await pool.query(sql);
    console.log("[TRENDING_INIT] Successfully initialized trending_scores & trending_score_history tables!");
  } catch (err) {
    console.error("[TRENDING_INIT] Database Error:", err.message);
  } finally {
    await pool.end();
  }
}

init();

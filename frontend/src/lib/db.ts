import { Pool, QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      "postgresql://cloche_admin:NTjHL0csUdFfp8jZ11HAJaax5dfgFspZ@dpg-d9qu2u49v7es73flis00-a.singapore-postgres.render.com/cloche_db";

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Ensure table exists on first connection
    initRealWeddingsTable(pool).catch((err) => {
      console.error("[DB] Failed to initialize real_wedding_stories table:", err);
    });
  }
  return pool;
}

async function initRealWeddingsTable(p: Pool) {
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS real_wedding_stories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        couple_names VARCHAR(255),
        city VARCHAR(100),
        wedding_date VARCHAR(100),
        style VARCHAR(100) DEFAULT 'Traditional Kerala',
        cover_image_url TEXT NOT NULL,
        gallery JSONB DEFAULT '[]'::jsonb,
        story_text TEXT NOT NULL,
        short_story TEXT,
        vendor_credits JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) DEFAULT 'pending_review',
        rejection_reason TEXT,
        submitted_by VARCHAR(255),
        submitter_name VARCHAR(255),
        submitter_email VARCHAR(255),
        submitted_at TIMESTAMPTZ DEFAULT NOW(),
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_trending BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_rws_status ON real_wedding_stories(status);
      CREATE INDEX IF NOT EXISTS idx_rws_slug ON real_wedding_stories(slug);
      CREATE INDEX IF NOT EXISTS idx_rws_created_at ON real_wedding_stories(created_at DESC);

      -- Ensure storefront configuration column on vendor_profiles
      ALTER TABLE vendor_profiles ADD COLUMN IF NOT EXISTS storefront JSONB DEFAULT '{}'::jsonb;
    `);
  } catch (err) {
    console.error("[DB] initDatabaseTables error:", err);
  }
}

export async function dbQuery<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const p = getDbPool();
  return p.query<T>(text, params);
}

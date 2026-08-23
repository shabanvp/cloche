-- Migration 20260823000001: Trending Scoring Engine Tables
-- Files: supabase/migrations/20260823000001_trending_engine_tables.sql

BEGIN;

-- 1. Trending Scores Table (One row per vendor, updated on each recalculation)
CREATE TABLE IF NOT EXISTS trending_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE UNIQUE,
    category VARCHAR(100),
    score NUMERIC(10, 4) NOT NULL DEFAULT 0,
    raw_engagement_score NUMERIC(10, 4) NOT NULL DEFAULT 0,
    rank INTEGER,
    computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for performance and ranking queries
CREATE INDEX IF NOT EXISTS idx_trending_scores_score ON trending_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_scores_category ON trending_scores(category, score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_scores_vendor ON trending_scores(vendor_id);

-- 2. Trending Score History Table (Historical snapshots for trend graphs & 90-day retention)
CREATE TABLE IF NOT EXISTS trending_score_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category VARCHAR(100),
    score NUMERIC(10, 4) NOT NULL DEFAULT 0,
    snapshot_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for historical trend queries
CREATE INDEX IF NOT EXISTS idx_trending_history_vendor_time ON trending_score_history(vendor_id, snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_trending_history_snapshot ON trending_score_history(snapshot_at DESC);

COMMIT;

-- Phase 2B Migration 19: Analytics & High-Volume Event Logging
-- File: supabase/migrations/20260805000019_analytics_create_event_tables.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Vendor Profile Views Analytics Table
CREATE TABLE IF NOT EXISTS analytics_profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    visitor_id VARCHAR(100),
    ip_hash VARCHAR(64),
    user_agent TEXT,
    device_type VARCHAR(30),
    referrer_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Search Impressions Analytics Table
CREATE TABLE IF NOT EXISTS analytics_search_impressions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    search_query VARCHAR(255),
    category_id UUID REFERENCES vendor_categories(id) ON DELETE SET NULL,
    city VARCHAR(100),
    rank_position INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Click & Interaction Events Table
CREATE TABLE IF NOT EXISTS analytics_click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('call_click', 'whatsapp_click', 'website_click', 'gallery_view', 'portfolio_click', 'package_click')),
    visitor_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Conversion Events Table
CREATE TABLE IF NOT EXISTS analytics_conversion_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    conversion_type VARCHAR(50) NOT NULL CHECK (conversion_type IN ('lead_submitted', 'quotation_requested', 'booking_confirmed')),
    reference_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Daily Aggregated Marketing Metrics Table
CREATE TABLE IF NOT EXISTS marketing_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    impressions_count INTEGER NOT NULL DEFAULT 0,
    profile_views_count INTEGER NOT NULL DEFAULT 0,
    clicks_count INTEGER NOT NULL DEFAULT 0,
    leads_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_vendor_metric_date UNIQUE (vendor_id, metric_date)
);

-- Indexes for high-throughput performance
CREATE INDEX IF NOT EXISTS idx_analytics_views_vendor_date ON analytics_profile_views(vendor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_impressions_vendor ON analytics_search_impressions(vendor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_clicks_vendor_type ON analytics_click_events(vendor_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_conversions_vendor ON analytics_conversion_events(vendor_id, conversion_type);
CREATE INDEX IF NOT EXISTS idx_marketing_metrics_vendor_date ON marketing_metrics(vendor_id, metric_date DESC);

COMMIT;

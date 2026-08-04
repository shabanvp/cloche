-- Phase 2B Migration 22: Global Search & Performance Indexes
-- File: database/migrations/20260805000022_indexes_create_global.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Composite B-Tree Indexes for High-Performance Search
CREATE INDEX IF NOT EXISTS idx_vendor_search_composite ON vendor_profiles(city, rating DESC, review_count DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_starting_price ON vendor_profiles(starting_price);
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendors_active_pub ON vendors(status, publication_status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_media_vendor_type ON media(vendor_id, media_type) WHERE deleted_at IS NULL;

COMMIT;

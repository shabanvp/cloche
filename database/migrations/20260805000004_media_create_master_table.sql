-- Phase 2B Migration 04: Master Media Table
-- File: database/migrations/20260805000004_media_create_master_table.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Master Media Entity Table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    vendor_id UUID,
    media_type VARCHAR(30) NOT NULL CHECK (media_type IN ('image', 'video', 'document', 'audio')),
    bucket_name VARCHAR(100) NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    cdn_url TEXT NOT NULL,
    thumbnail_url TEXT,
    medium_url TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_user_id ON media(user_id);
CREATE INDEX IF NOT EXISTS idx_media_vendor_id ON media(vendor_id);
CREATE INDEX IF NOT EXISTS idx_media_bucket_path ON media(bucket_name, file_path);

COMMIT;

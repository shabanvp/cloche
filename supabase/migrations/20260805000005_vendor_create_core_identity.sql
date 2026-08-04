-- Phase 2B Migration 05: Vendor Core Identity & Categories
-- File: supabase/migrations/20260805000005_vendor_create_core_identity.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Vendor Categories Registry Table
CREATE TABLE IF NOT EXISTS vendor_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Vendor Core Identity Table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_code VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES vendor_categories(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
    publication_status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'under_review', 'published', 'changes_requested')),
    onboarding_stage VARCHAR(50) NOT NULL DEFAULT 'registration_started',
    profile_completion_percentage INTEGER NOT NULL DEFAULT 10,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_kyc_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add Foreign Key from media(vendor_id) to vendors(id)
ALTER TABLE media 
    ADD CONSTRAINT fk_media_vendor 
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category_status ON vendors(category_id, status);
CREATE INDEX IF NOT EXISTS idx_vendors_code ON vendors(vendor_code);

COMMIT;

-- Phase 2B Migration 07: Vendor Profile Versioning
-- File: database/migrations/20260805000007_vendor_create_profile_versioning.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Vendor Profile Versions Metadata Table
CREATE TABLE IF NOT EXISTS vendor_profile_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'published', 'archived', 'rejected')),
    change_summary VARCHAR(255),
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    reviewed_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_vendor_profile_version UNIQUE (vendor_id, version_number)
);

-- 2. Vendor Profile Version Sections Payload Table
CREATE TABLE IF NOT EXISTS vendor_profile_version_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID NOT NULL REFERENCES vendor_profile_versions(id) ON DELETE CASCADE,
    section_name VARCHAR(50) NOT NULL CHECK (section_name IN ('basic_info', 'services', 'packages', 'portfolio', 'faqs', 'category_details')),
    section_payload JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_version_section UNIQUE (version_id, section_name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_version_vendor_status ON vendor_profile_versions(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_version_sections_version ON vendor_profile_version_sections(version_id);

COMMIT;

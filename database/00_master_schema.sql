BEGIN;

-- CLOCHE WEDDING PLATFORM - MASTER PRODUCTION DATABASE SCHEMA
-- Generated for PostgreSQL 16 & Supabase SQL Editor
-- Contains all 25 sequential migration steps in exact execution order.

--------------------------------------------------------------------
-- [MIGRATION 1/25]: 20260805000001_config_create_taxonomies.sql
--------------------------------------------------------------------

-- Phase 2B Migration 01: Configuration & Taxonomy Tables
-- File: database/migrations/20260805000001_config_create_taxonomies.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Countries Configuration Table
CREATE TABLE IF NOT EXISTS config_countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    iso_code VARCHAR(10) NOT NULL UNIQUE,
    phone_code VARCHAR(10),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. States Configuration Table
CREATE TABLE IF NOT EXISTS config_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id UUID NOT NULL REFERENCES config_countries(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_config_states_country_name UNIQUE (country_id, name)
);

-- 3. Cities Configuration Table
CREATE TABLE IF NOT EXISTS config_cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID NOT NULL REFERENCES config_states(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_config_cities_state_name UNIQUE (state_id, name)
);

-- 4. Languages Configuration Table
CREATE TABLE IF NOT EXISTS config_languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Currencies Configuration Table
CREATE TABLE IF NOT EXISTS config_currencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL UNIQUE,
    symbol VARCHAR(10) NOT NULL,
    name VARCHAR(50) NOT NULL,
    exchange_rate NUMERIC(12, 4) NOT NULL DEFAULT 1.0000,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Amenities Configuration Table
CREATE TABLE IF NOT EXISTS config_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    category VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Photography Styles Configuration Table
CREATE TABLE IF NOT EXISTS config_photography_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Makeup Brands Configuration Table
CREATE TABLE IF NOT EXISTS config_makeup_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Cuisines Configuration Table
CREATE TABLE IF NOT EXISTS config_cuisines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL DEFAULT 'veg' CHECK (type IN ('veg', 'non-veg', 'both')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Service Types Configuration Table
CREATE TABLE IF NOT EXISTS config_service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Package Types Configuration Table
CREATE TABLE IF NOT EXISTS config_package_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Wedding Styles Configuration Table
CREATE TABLE IF NOT EXISTS config_wedding_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

--------------------------------------------------------------------
-- [MIGRATION 2/25]: 20260805000002_auth_create_users.sql
--------------------------------------------------------------------

-- Phase 2B Migration 02: Authentication & Core Users
-- File: database/migrations/20260805000002_auth_create_users.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Core Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(150),
    name VARCHAR(150),
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires_at TIMESTAMPTZ,
    phone VARCHAR(20) UNIQUE,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Trigger Function to Sync name and full_name fields bidirectionally
CREATE OR REPLACE FUNCTION sync_user_name_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.full_name IS NULL OR NEW.full_name = '' THEN
        NEW.full_name := COALESCE(NEW.name, '');
    END IF;
    IF NEW.name IS NULL OR NEW.name = '' THEN
        NEW.name := COALESCE(NEW.full_name, '');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_user_name_fields ON users;
CREATE TRIGGER trigger_sync_user_name_fields
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION sync_user_name_fields();

-- 2. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address VARCHAR(45),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);

--------------------------------------------------------------------
-- [MIGRATION 3/25]: 20260805000003_auth_create_roles_permissions.sql
--------------------------------------------------------------------

-- Phase 2B Migration 03: Roles & Permissions
-- File: database/migrations/20260805000003_auth_create_roles_permissions.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. User Roles Bridge Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- 4. Role Permissions Bridge Table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

--------------------------------------------------------------------
-- [MIGRATION 4/25]: 20260805000004_media_create_master_table.sql
--------------------------------------------------------------------

-- Phase 2B Migration 04: Master Media Table
-- File: database/migrations/20260805000004_media_create_master_table.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

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

--------------------------------------------------------------------
-- [MIGRATION 5/25]: 20260805000005_vendor_create_core_identity.sql
--------------------------------------------------------------------

-- Phase 2B Migration 05: Vendor Core Identity & Categories
-- File: database/migrations/20260805000005_vendor_create_core_identity.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

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

-- Add Foreign Key from media(vendor_id) to vendors(id) idempotently
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_media_vendor'
    ) THEN 
        ALTER TABLE media 
            ADD CONSTRAINT fk_media_vendor 
            FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category_status ON vendors(category_id, status);
CREATE INDEX IF NOT EXISTS idx_vendors_code ON vendors(vendor_code);

--------------------------------------------------------------------
-- [MIGRATION 6/25]: 20260805000006_vendor_create_profiles.sql
--------------------------------------------------------------------

-- Phase 2B Migration 06: Vendor Profiles & Contact Info
-- File: database/migrations/20260805000006_vendor_create_profiles.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Editable Vendor Profiles Table (1:1 with vendors)
CREATE TABLE IF NOT EXISTS vendor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL UNIQUE REFERENCES vendors(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    tagline VARCHAR(255),
    about TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    review_count INTEGER NOT NULL DEFAULT 0,
    starting_price NUMERIC(12, 2),
    logo_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    cover_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Vendor Contacts Table
CREATE TABLE IF NOT EXISTS vendor_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    contact_name VARCHAR(150),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Vendor Social Links Table
CREATE TABLE IF NOT EXISTS vendor_social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_vendor_social_platform UNIQUE (vendor_id, platform)
);

-- 4. Vendor Business Hours Table
CREATE TABLE IF NOT EXISTS vendor_business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    day_of_week VARCHAR(15) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_vendor_day UNIQUE (vendor_id, day_of_week)
);

-- 5. Vendor Addresses Table
CREATE TABLE IF NOT EXISTS vendor_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_slug ON vendor_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_city_rating ON vendor_profiles(city, rating DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_contacts_vendor ON vendor_contacts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_addresses_vendor ON vendor_addresses(vendor_id);

--------------------------------------------------------------------
-- [MIGRATION 7/25]: 20260805000007_vendor_create_profile_versioning.sql
--------------------------------------------------------------------

-- Phase 2B Migration 07: Vendor Profile Versioning
-- File: database/migrations/20260805000007_vendor_create_profile_versioning.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

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

--------------------------------------------------------------------
-- [MIGRATION 8/25]: 20260805000008_vendor_create_category_extensions.sql
--------------------------------------------------------------------

-- Phase 2B Migration 08: Category Extension Tables
-- File: database/migrations/20260805000008_vendor_create_category_extensions.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Venue Details (1:1 with vendors)
CREATE TABLE IF NOT EXISTS venue_details (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    max_capacity INTEGER,
    guest_rooms INTEGER,
    veg_plate_price NUMERIC(12, 2),
    non_veg_plate_price NUMERIC(12, 2),
    rental_cost NUMERIC(12, 2),
    parking_capacity INTEGER,
    decor_policy VARCHAR(100),
    alcohol_policy VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Photographer Details (1:1 with vendors)
CREATE TABLE IF NOT EXISTS photographer_details (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    candid_photography BOOLEAN NOT NULL DEFAULT true,
    cinematic_video BOOLEAN NOT NULL DEFAULT true,
    drone_coverage BOOLEAN NOT NULL DEFAULT false,
    delivery_days INTEGER NOT NULL DEFAULT 30,
    album_pages INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Makeup Details (1:1 with vendors)
CREATE TABLE IF NOT EXISTS makeup_details (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    hd_makeup_available BOOLEAN NOT NULL DEFAULT true,
    airbrush_available BOOLEAN NOT NULL DEFAULT true,
    trial_makeup_offered BOOLEAN NOT NULL DEFAULT true,
    trial_price NUMERIC(12, 2),
    brands_used TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Catering Details (1:1 with vendors)
CREATE TABLE IF NOT EXISTS catering_details (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    min_cater_capacity INTEGER,
    max_cater_capacity INTEGER,
    cuisines_offered TEXT[],
    live_counters_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Decorator Details (1:1 with vendors)
CREATE TABLE IF NOT EXISTS decorator_details (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    themes_offered TEXT[],
    floral_decor BOOLEAN NOT NULL DEFAULT true,
    lighting_setup BOOLEAN NOT NULL DEFAULT true,
    stage_mandap_setup BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Bridal Wear Details (1:1 with vendors)
CREATE TABLE IF NOT EXISTS bridal_wear_details (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    outfit_types TEXT[],
    rental_available BOOLEAN NOT NULL DEFAULT false,
    custom_stitching BOOLEAN NOT NULL DEFAULT true,
    lead_time_weeks INTEGER NOT NULL DEFAULT 4,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Jewellery Details (1:1 with vendors)
CREATE TABLE IF NOT EXISTS jewellery_details (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    jewellery_types TEXT[],
    rental_available BOOLEAN NOT NULL DEFAULT false,
    precious_stones BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Mehndi Details (1:1 with vendors)
CREATE TABLE IF NOT EXISTS mehndi_details (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    mehandi_styles TEXT[],
    bridal_package_price NUMERIC(12, 2),
    guest_capacity_per_hour INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Invitation Details (1:1 with vendors)
CREATE TABLE IF NOT EXISTS invitation_details (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    card_types TEXT[],
    digital_invites BOOLEAN NOT NULL DEFAULT true,
    boxed_invites BOOLEAN NOT NULL DEFAULT false,
    min_order_quantity INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Entertainment Details (1:1 with vendors)
CREATE TABLE IF NOT EXISTS entertainment_details (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    performance_type VARCHAR(100),
    duration_hours INTEGER,
    sound_system_included BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Generic Category Extension Template (1:1 with vendors for dynamic categories)
CREATE TABLE IF NOT EXISTS category_extension_template (
    vendor_id UUID PRIMARY KEY REFERENCES vendors(id) ON DELETE CASCADE,
    custom_attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_venue_capacity ON venue_details(max_capacity, veg_plate_price);
CREATE INDEX IF NOT EXISTS idx_makeup_trial ON makeup_details(hd_makeup_available, trial_makeup_offered);
CREATE INDEX IF NOT EXISTS idx_photographer_candid ON photographer_details(candid_photography, drone_coverage);
CREATE INDEX IF NOT EXISTS idx_cat_extension_jsonb ON category_extension_template USING GIN (custom_attributes);

--------------------------------------------------------------------
-- [MIGRATION 9/25]: 20260805000009_vendor_create_services_pricing.sql
--------------------------------------------------------------------

-- Phase 2B Migration 09: Vendor Content & Catalog Services
-- File: database/migrations/20260805000009_vendor_create_services_pricing.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Vendor Gallery Table
CREATE TABLE IF NOT EXISTS vendor_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    caption VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_cover BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Vendor Videos Table
CREATE TABLE IF NOT EXISTS vendor_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    platform VARCHAR(50) NOT NULL DEFAULT 'youtube' CHECK (platform IN ('youtube', 'vimeo', 'instagram', 'custom')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Vendor Portfolio Albums Table
CREATE TABLE IF NOT EXISTS vendor_portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    cover_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    event_date DATE,
    location VARCHAR(200),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Vendor Services Catalog Table
CREATE TABLE IF NOT EXISTS vendor_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    service_type_id UUID REFERENCES config_service_types(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2),
    price_unit VARCHAR(50) NOT NULL DEFAULT 'per event',
    is_popular BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Vendor Packages Table
CREATE TABLE IF NOT EXISTS vendor_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    package_type_id UUID REFERENCES config_package_types(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    description TEXT,
    features TEXT[],
    is_popular BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Vendor FAQs Table
CREATE TABLE IF NOT EXISTS vendor_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Vendor Verification & KYC Documents Table
CREATE TABLE IF NOT EXISTS vendor_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('kyc', 'gst_certificate', 'business_license', 'contract', 'other')),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendor_gallery_vendor ON vendor_gallery(vendor_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_vendor_videos_vendor ON vendor_videos(vendor_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_vendor_portfolio_vendor ON vendor_portfolio(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_services_vendor ON vendor_services(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_packages_vendor ON vendor_packages(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_faqs_vendor ON vendor_faqs(vendor_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_vendor_documents_vendor ON vendor_documents(vendor_id, document_type);

--------------------------------------------------------------------
-- [MIGRATION 10/25]: 20260805000010_customer_create_activity_tables.sql
--------------------------------------------------------------------

-- Phase 2B Migration 10: Customer Activity & Shortlists
-- File: database/migrations/20260805000010_customer_create_activity_tables.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. User Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL DEFAULT 'My Wedding Wishlist',
    description TEXT,
    is_private BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Saved Vendors Junction Table
CREATE TABLE IF NOT EXISTS saved_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_saved_vendor UNIQUE (user_id, vendor_id)
);

-- 3. Search History Table
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES vendor_categories(id) ON DELETE SET NULL,
    city VARCHAR(100),
    filters_applied JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. User Preferences & Wedding Parameters Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    wedding_date DATE,
    estimated_budget NUMERIC(12, 2),
    preferred_city VARCHAR(100),
    guest_count INTEGER,
    style_preferences TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_vendors_user ON saved_vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_vendors_vendor ON saved_vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences(user_id);

--------------------------------------------------------------------
-- [MIGRATION 11/25]: 20260805000011_lead_create_management.sql
--------------------------------------------------------------------

-- Phase 2B Migration 11: Lead Management & Inquiries
-- File: database/migrations/20260805000011_lead_create_management.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Customer Quote Inquiries / Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    event_date DATE NOT NULL,
    guest_count INTEGER,
    estimated_budget NUMERIC(12, 2),
    message TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'declined')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. Vendor Internal Lead Notes Table
CREATE TABLE IF NOT EXISTS lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Lead Timeline Activities Table
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_vendor_status ON leads(vendor_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_customer ON leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);

--------------------------------------------------------------------
-- [MIGRATION 12/25]: 20260805000012_lead_create_quotations.sql
--------------------------------------------------------------------

-- Phase 2B Migration 12: Quotations & Price Proposals
-- File: database/migrations/20260805000012_lead_create_quotations.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Vendor Quotations Table
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    quotation_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    final_amount NUMERIC(12, 2) NOT NULL,
    valid_until DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Itemized Quotation Line Items Table
CREATE TABLE IF NOT EXISTS quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotations_lead ON quotations(lead_id);
CREATE INDEX IF NOT EXISTS idx_quotations_vendor ON quotations(vendor_id);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation ON quotation_items(quotation_id);

--------------------------------------------------------------------
-- [MIGRATION 13/25]: 20260805000013_booking_create_lifecycle.sql
--------------------------------------------------------------------

-- Phase 2B Migration 13: Booking Lifecycle & Timeline
-- File: database/migrations/20260805000013_booking_create_lifecycle.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Master Event Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    booking_number VARCHAR(50) NOT NULL UNIQUE,
    event_date DATE NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    advance_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Booking Milestone Timeline Table
CREATE TABLE IF NOT EXISTS booking_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    milestone_name VARCHAR(150) NOT NULL,
    due_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Booking Status Change Logs Table
CREATE TABLE IF NOT EXISTS booking_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Booking Milestone & Deposit Payments Table
CREATE TABLE IF NOT EXISTS booking_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    payment_type VARCHAR(30) NOT NULL CHECK (payment_type IN ('advance', 'milestone', 'final_balance', 'refund')),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    transaction_reference VARCHAR(255),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_vendor_date ON bookings(vendor_id, event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_timeline_booking ON booking_timeline(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_payments_booking ON booking_payments(booking_id);

--------------------------------------------------------------------
-- [MIGRATION 14/25]: 20260805000014_review_create_feedback.sql
--------------------------------------------------------------------

-- Phase 2B Migration 14: Reviews & Customer Feedback
-- File: database/migrations/20260805000014_review_create_feedback.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Customer Ratings & Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    review_text TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'flagged', 'hidden')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Review Photos & Media Table
CREATE TABLE IF NOT EXISTS review_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    caption VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Public Vendor Replies Table (1:1 with reviews)
CREATE TABLE IF NOT EXISTS vendor_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL UNIQUE REFERENCES reviews(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    reply_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_vendor_published ON reviews(vendor_id, rating DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_review_images_review ON review_images(review_id);
CREATE INDEX IF NOT EXISTS idx_vendor_replies_review ON vendor_replies(review_id);

--------------------------------------------------------------------
-- [MIGRATION 15/25]: 20260805000015_marketing_create_promotions.sql
--------------------------------------------------------------------

-- Phase 2B Migration 15: Marketing & Promotions Engine
-- File: database/migrations/20260805000015_marketing_create_promotions.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Featured Vendor Placements Table
CREATE TABLE IF NOT EXISTS featured_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    placement_slot VARCHAR(50) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Sponsored Keyword & Category Bidding Table
CREATE TABLE IF NOT EXISTS sponsored_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    target_category_id UUID REFERENCES vendor_categories(id) ON DELETE CASCADE,
    target_city VARCHAR(100),
    bid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    daily_budget NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50) NOT NULL CHECK (campaign_type IN ('email', 'sms', 'whatsapp', 'push', 'banner')),
    target_audience JSONB,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'completed', 'cancelled')),
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Coupons & Discount Code Engine Table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value NUMERIC(12, 2) NOT NULL,
    min_booking_amount NUMERIC(12, 2) DEFAULT 0.00,
    max_discount_amount NUMERIC(12, 2),
    usage_limit INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. User Referral Program Table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES users(id) ON DELETE SET NULL,
    referral_code VARCHAR(50) NOT NULL UNIQUE,
    reward_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (reward_status IN ('pending', 'rewarded', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Vendor QR Code Generators Table
CREATE TABLE IF NOT EXISTS qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    qr_code_url TEXT NOT NULL,
    target_url TEXT NOT NULL,
    scan_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Promotion Event History Table
CREATE TABLE IF NOT EXISTS promotion_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    promotion_type VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_featured_vendors_active ON featured_vendors(vendor_id, is_active);
CREATE INDEX IF NOT EXISTS idx_sponsored_listings_target ON sponsored_listings(target_category_id, target_city, is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_vendor ON qr_codes(vendor_id);

--------------------------------------------------------------------
-- [MIGRATION 16/25]: 20260805000016_payment_create_ledger.sql
--------------------------------------------------------------------

-- Phase 2B Migration 16: Payments Ledger & Escrow
-- File: database/migrations/20260805000016_payment_create_ledger.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Master Payment Transactions Ledger Table
CREATE TABLE IF NOT EXISTS payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_gateway VARCHAR(50) NOT NULL CHECK (payment_gateway IN ('razorpay', 'stripe', 'paypal', 'bank_transfer')),
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Customer Refunds Table
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_record_id UUID NOT NULL REFERENCES payment_records(id) ON DELETE CASCADE,
    refund_amount NUMERIC(12, 2) NOT NULL,
    reason TEXT,
    gateway_refund_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Escrow Deposit Accounts Table (1:1 with bookings)
CREATE TABLE IF NOT EXISTS escrow_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    held_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    released_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'partially_released', 'fully_released', 'disputed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Vendor Bank Payout Disbursements Table
CREATE TABLE IF NOT EXISTS vendor_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    payout_number VARCHAR(50) NOT NULL UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    bank_account_last4 VARCHAR(10),
    status VARCHAR(30) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Platform Commission Accounting Ledger Table
CREATE TABLE IF NOT EXISTS commission_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    booking_amount NUMERIC(12, 2) NOT NULL,
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    commission_amount NUMERIC(12, 2) NOT NULL,
    vendor_payout_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_records_txn ON payment_records(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_user ON payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_booking ON payment_records(booking_id);
CREATE INDEX IF NOT EXISTS idx_escrow_booking ON escrow_accounts(booking_id);
CREATE INDEX IF NOT EXISTS idx_vendor_payouts_vendor ON vendor_payouts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_commission_vendor ON commission_ledger(vendor_id);

--------------------------------------------------------------------
-- [MIGRATION 17/25]: 20260805000017_subscription_create_billing.sql
--------------------------------------------------------------------

-- Phase 2B Migration 17: Vendor Subscriptions & Invoicing
-- File: database/migrations/20260805000017_subscription_create_billing.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Subscription Plans Master Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE CHECK (code IN ('free', 'silver', 'gold', 'platinum')),
    monthly_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    annual_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    featured_listings_count INTEGER NOT NULL DEFAULT 0,
    lead_quota_per_month INTEGER NOT NULL DEFAULT 10,
    features TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Vendor Subscriptions Subscriptions Table
CREATE TABLE IF NOT EXISTS vendor_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Invoices & Billing Receipts Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    subscription_id UUID REFERENCES vendor_subscriptions(id) ON DELETE SET NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL,
    pdf_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'paid', 'void')),
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Subscription Transactions Link Table
CREATE TABLE IF NOT EXISTS subscription_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES vendor_subscriptions(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
    payment_record_id UUID REFERENCES payment_records(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscription_plans_code ON subscription_plans(code);
CREATE INDEX IF NOT EXISTS idx_vendor_subs_vendor ON vendor_subscriptions(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_vendor ON invoices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_sub_txns_subscription ON subscription_transactions(subscription_id);

--------------------------------------------------------------------
-- [MIGRATION 18/25]: 20260805000018_notification_create_engine.sql
--------------------------------------------------------------------

-- Phase 2B Migration 18: Notification Service Engine
-- File: database/migrations/20260805000018_notification_create_engine.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Notification Templates Registry Table
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    channel VARCHAR(30) NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'push', 'in_app')),
    subject VARCHAR(255),
    body_template TEXT NOT NULL,
    variables TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Async Notification Queue Processing Table
CREATE TABLE IF NOT EXISTS notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES notification_templates(id) ON DELETE SET NULL,
    recipient_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'push', 'in_app')),
    destination VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
    error_message TEXT,
    attempts INTEGER NOT NULL DEFAULT 0,
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. In-App & Sent Notification History Table
CREATE TABLE IF NOT EXISTS notification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    metadata JSONB,
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. User Notification Preference Settings Table (1:1 with users)
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    sms_notifications BOOLEAN NOT NULL DEFAULT true,
    whatsapp_notifications BOOLEAN NOT NULL DEFAULT true,
    push_notifications BOOLEAN NOT NULL DEFAULT true,
    marketing_emails BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notif_templates_code ON notification_templates(code);
CREATE INDEX IF NOT EXISTS idx_notif_queue_status_sched ON notification_queue(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_notif_history_user ON notification_history(recipient_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_pref_user ON user_notification_preferences(user_id);

--------------------------------------------------------------------
-- [MIGRATION 19/25]: 20260805000019_analytics_create_event_tables.sql
--------------------------------------------------------------------

-- Phase 2B Migration 19: Analytics & High-Volume Event Logging
-- File: database/migrations/20260805000019_analytics_create_event_tables.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

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

--------------------------------------------------------------------
-- [MIGRATION 20/25]: 20260805000020_admin_create_system_logs.sql
--------------------------------------------------------------------

-- Phase 2B Migration 20: Admin Governance & Audit Logs
-- File: database/migrations/20260805000020_admin_create_system_logs.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Admin Actions Log Table
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. System Entity Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_name VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. System Configuration Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(setting_key);

--------------------------------------------------------------------
-- [MIGRATION 21/25]: 20260805000021_admin_create_feature_flags.sql
--------------------------------------------------------------------

-- Phase 2B Migration 21: Feature Flags Engine
-- File: database/migrations/20260805000021_admin_create_feature_flags.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Feature Flags Registry Table
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_key VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    rules JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(flag_key);

--------------------------------------------------------------------
-- [MIGRATION 22/25]: 20260805000022_indexes_create_global.sql
--------------------------------------------------------------------

-- Phase 2B Migration 22: Global Search & Performance Indexes
-- File: database/migrations/20260805000022_indexes_create_global.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Composite B-Tree Indexes for High-Performance Search
CREATE INDEX IF NOT EXISTS idx_vendor_search_composite ON vendor_profiles(city, rating DESC, review_count DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_starting_price ON vendor_profiles(starting_price);
CREATE INDEX IF NOT EXISTS idx_users_email_active ON users(email) WHERE is_active = true AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendors_active_pub ON vendors(status, publication_status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_media_vendor_type ON media(vendor_id, media_type) WHERE deleted_at IS NULL;

--------------------------------------------------------------------
-- [MIGRATION 23/25]: 20260805000023_triggers_create_timestamp_functions.sql
--------------------------------------------------------------------

-- Phase 2B Migration 23: Database Functions & Timestamp Triggers
-- File: database/migrations/20260805000023_triggers_create_timestamp_functions.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Standard Auto-Updating Timestamp Function
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attach Triggers to Core Tables
DROP TRIGGER IF EXISTS trigger_update_users_timestamp ON users;
CREATE TRIGGER trigger_update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_vendors_timestamp ON vendors;
CREATE TRIGGER trigger_update_vendors_timestamp
    BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_vendor_profiles_timestamp ON vendor_profiles;
CREATE TRIGGER trigger_update_vendor_profiles_timestamp
    BEFORE UPDATE ON vendor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_leads_timestamp ON leads;
CREATE TRIGGER trigger_update_leads_timestamp
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_bookings_timestamp ON bookings;
CREATE TRIGGER trigger_update_bookings_timestamp
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_reviews_timestamp ON reviews;
CREATE TRIGGER trigger_update_reviews_timestamp
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_media_timestamp ON media;
CREATE TRIGGER trigger_update_media_timestamp
    BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

--------------------------------------------------------------------
-- [MIGRATION 24/25]: 20260805000024_rls_create_security_policies.sql
--------------------------------------------------------------------

-- Phase 2B Migration 24: Row-Level Security Policies
-- File: database/migrations/20260805000024_rls_create_security_policies.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Enable Row-Level Security on Core Tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profile_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 2. Users Table RLS Policies
DROP POLICY IF EXISTS users_select_own ON users;
CREATE POLICY users_select_own ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users
    FOR UPDATE USING (auth.uid() = id);

-- 3. Vendors & Vendor Profiles RLS Policies (Public Active Read; Owner Update)
DROP POLICY IF EXISTS vendors_select_active ON vendors;
CREATE POLICY vendors_select_active ON vendors
    FOR SELECT USING (status = 'active' OR auth.uid() = user_id);

DROP POLICY IF EXISTS vendors_update_owner ON vendors;
CREATE POLICY vendors_update_owner ON vendors
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS vendor_profiles_select_public ON vendor_profiles;
CREATE POLICY vendor_profiles_select_public ON vendor_profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS vendor_profiles_update_owner ON vendor_profiles;
CREATE POLICY vendor_profiles_update_owner ON vendor_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = vendor_profiles.vendor_id 
              AND vendors.user_id = auth.uid()
        )
    );

-- 4. Leads RLS Policies (Customer Read Own; Vendor Read Assigned)
DROP POLICY IF EXISTS leads_select_owner ON leads;
CREATE POLICY leads_select_owner ON leads
    FOR SELECT USING (
        auth.uid() = customer_id 
        OR EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = leads.vendor_id 
              AND vendors.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS leads_insert_authenticated ON leads;
CREATE POLICY leads_insert_authenticated ON leads
    FOR INSERT WITH CHECK (true);

-- 5. Bookings RLS Policies
DROP POLICY IF EXISTS bookings_select_owner ON bookings;
CREATE POLICY bookings_select_owner ON bookings
    FOR SELECT USING (
        auth.uid() = customer_id 
        OR EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = bookings.vendor_id 
              AND vendors.user_id = auth.uid()
        )
    );

-- 6. Reviews RLS Policies (Public Read Published; Insert Customer)
DROP POLICY IF EXISTS reviews_select_published ON reviews;
CREATE POLICY reviews_select_published ON reviews
    FOR SELECT USING (status = 'published' OR auth.uid() = customer_id);

DROP POLICY IF EXISTS reviews_insert_customer ON reviews;
CREATE POLICY reviews_insert_customer ON reviews
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

--------------------------------------------------------------------
-- [MIGRATION 25/25]: 20260805000025_seed_insert_default_data.sql
--------------------------------------------------------------------

-- Phase 2B Migration 25: Master Seed Data Ingestion
-- File: database/migrations/20260805000025_seed_insert_default_data.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

-- 1. Seed Roles
INSERT INTO roles (name, description) VALUES
    ('super_admin', 'Full system access and platform management'),
    ('admin', 'Content moderation, vendor verification, and support management'),
    ('vendor', 'Registered business profile owner'),
    ('customer', 'Registered wedding planning user')
ON CONFLICT (name) DO NOTHING;

-- 2. Seed Default Feature Flags
INSERT INTO feature_flags (flag_key, description, is_enabled) VALUES
    ('enable_genie_ai_assistant', 'Cloche Genie AI Planning Assistant', true),
    ('enable_instant_booking', 'Direct customer instant booking confirmation', false),
    ('enable_whatsapp_notifications', 'Automated WhatsApp lead & booking alerts', true),
    ('enable_sponsored_listings', 'Vendor sponsored ad search placements', true)
ON CONFLICT (flag_key) DO NOTHING;

-- 3. Seed Master Categories (12 Standard Categories)
INSERT INTO vendor_categories (name, slug, description, icon_name) VALUES
    ('Wedding Venues', 'venues', 'Banquet halls, luxury resorts, beach lawns, and heritage palaces', 'Building'),
    ('Bridal Makeup & Hair', 'makeup', 'HD makeup, airbrush artists, saree draping, and bridal styling', 'Sparkles'),
    ('Wedding Photographers', 'photographers', 'Candid photography, cinematic films, pre-wedding shoots, and drone coverage', 'Camera'),
    ('Catering Services', 'catering', 'Multi-cuisine buffets, live counters, custom menus, and beverage services', 'Utensils'),
    ('Wedding Decorators', 'decorators', 'Floral mandaps, stage lighting, theme decor, and entrance concepts', 'Flower2'),
    ('Bridal Wear & Lehengas', 'bridal-wear', 'Designer lehengas, bridal gowns, sarees, and custom stitching', 'Shirt'),
    ('Jewellery & Accessories', 'jewellery', 'Kundan, Polki, gold sets, diamond jewellery, and bridal accessories', 'Gem'),
    ('Mehndi Artists', 'mehndi', 'Bridal henna, Arabic designs, Rajasthani patterns, and guest booking', 'Palette'),
    ('Invitation & Cards', 'invitations', 'Digital video invites, traditional printed cards, and luxury boxed gifts', 'Mail'),
    ('Wedding Entertainment', 'entertainment', 'DJ setups, live bands, sangeet choreographers, and celebrity performances', 'Music'),
    ('DJs & Live Bands', 'djs-bands', 'Professional wedding DJs, live acoustic bands, and sound setups', 'Disc'),
    ('Wedding Planners', 'planners', 'Full event execution, budget allocation, vendor coordination, and hospitality', 'Calendar')
ON CONFLICT (name) DO NOTHING;

-- 4. Seed Default Subscription Plans
INSERT INTO subscription_plans (name, code, monthly_price, annual_price, featured_listings_count, lead_quota_per_month) VALUES
    ('Free Tier', 'free', 0.00, 0.00, 0, 5),
    ('Silver Vendor', 'silver', 1999.00, 19990.00, 1, 30),
    ('Gold Partner', 'gold', 4999.00, 49990.00, 3, 100),
    ('Platinum Luxury', 'platinum', 9999.00, 99990.00, 10, 500)
ON CONFLICT (name) DO NOTHING;

-- 5. Seed System Default Settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
    ('platform_commission_rate', '{"percentage": 10}'::jsonb, 'Default platform commission fee on bookings', false),
    ('platform_currency', '{"code": "INR", "symbol": "₹"}'::jsonb, 'Default platform operating currency', true),
    ('support_contact', '{"email": "support@cloche.wedding", "phone": "+91 9876543210"}'::jsonb, 'Platform customer support contact info', true)
ON CONFLICT (setting_key) DO NOTHING;

-- 6. Boutiques Backward Compatibility View for Legacy Backend & PostgREST
DROP VIEW IF EXISTS public.boutiques CASCADE;

CREATE OR REPLACE VIEW public.boutiques AS
SELECT 
    v.id AS id,
    v.user_id AS user_id,
    v.vendor_code AS vendor_code,
    COALESCE(vp.business_name, u.full_name, 'Vendor') AS boutique_name,
    COALESCE(vp.business_name, u.full_name, 'Vendor') AS name,
    COALESCE(u.full_name, vp.business_name) AS owner_name,
    u.email AS email,
    u.phone AS phone,
    vc.name AS category,
    v.category_id AS category_id,
    COALESCE(vp.city, 'Kochi') AS city,
    COALESCE(vp.city, 'Ernakulam') AS district,
    COALESCE(vp.state, 'Kerala') AS state,
    vp.pincode AS pincode,
    COALESCE(vp.rating, 5.0) AS rating,
    COALESCE(vp.review_count, 0) AS review_count,
    vp.starting_price AS starting_price,
    COALESCE(vp.slug, LOWER(REPLACE(v.vendor_code, '-', ''))) AS slug,
    v.status AS status,
    v.publication_status AS publication_status,
    'early_partner'::VARCHAR AS plan,
    true AS is_featured,
    v.is_verified AS is_verified,
    v.created_at AS created_at,
    v.updated_at AS updated_at
FROM public.vendors v
LEFT JOIN public.users u ON u.id = v.user_id
LEFT JOIN public.vendor_profiles vp ON vp.vendor_id = v.id
LEFT JOIN public.vendor_categories vc ON vc.id = v.category_id;

GRANT SELECT ON public.boutiques TO anon, authenticated, service_role;

COMMIT;

-- Notify Supabase PostgREST to reload schema cache immediately
NOTIFY pgrst, 'reload schema';


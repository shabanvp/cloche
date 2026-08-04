-- Phase 2B Migration 08: Category Extension Tables
-- File: database/migrations/20260805000008_vendor_create_category_extensions.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

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

COMMIT;

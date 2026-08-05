-- Phase 2B Migration 28: Multi-Category Services, Packages & Catalog Inventory
-- File: database/migrations/20260805000028_vendor_create_catalog_inventory.sql

BEGIN;

-- 1. Vendor Services Table (Category-Aware Services)
CREATE TABLE IF NOT EXISTS vendor_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category_id UUID REFERENCES vendor_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    pricing_type VARCHAR(50) NOT NULL DEFAULT 'starting_from',
    duration INTEGER,
    status VARCHAR(30) NOT NULL DEFAULT 'published',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Ensure columns exist if table was previously created in earlier migration
ALTER TABLE public.vendor_services ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES vendor_categories(id) ON DELETE RESTRICT;
ALTER TABLE public.vendor_services ADD COLUMN IF NOT EXISTS base_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00;
ALTER TABLE public.vendor_services ADD COLUMN IF NOT EXISTS pricing_type VARCHAR(50) NOT NULL DEFAULT 'starting_from';
ALTER TABLE public.vendor_services ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE public.vendor_services ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'published';
ALTER TABLE public.vendor_services ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.vendor_services ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.vendor_services ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Vendor Service Images Gallery Table
CREATE TABLE IF NOT EXISTS vendor_service_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES vendor_services(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Vendor Service Packages Table
CREATE TABLE IF NOT EXISTS vendor_service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category_id UUID REFERENCES vendor_categories(id) ON DELETE RESTRICT,
    service_id UUID REFERENCES vendor_services(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_price NUMERIC(12, 2),
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'published',
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Ensure columns exist if table was previously created in earlier migration
ALTER TABLE public.vendor_service_packages ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES vendor_categories(id) ON DELETE RESTRICT;
ALTER TABLE public.vendor_service_packages ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES vendor_services(id) ON DELETE SET NULL;
ALTER TABLE public.vendor_service_packages ADD COLUMN IF NOT EXISTS tagline VARCHAR(255);
ALTER TABLE public.vendor_service_packages ADD COLUMN IF NOT EXISTS discount_price NUMERIC(12, 2);
ALTER TABLE public.vendor_service_packages ADD COLUMN IF NOT EXISTS features JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.vendor_service_packages ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'published';
ALTER TABLE public.vendor_service_packages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 4. Vendor Catalog Inventory Items Table (Physical & Rental Products)
CREATE TABLE IF NOT EXISTS vendor_catalog_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category_id UUID REFERENCES vendor_categories(id) ON DELETE RESTRICT,
    category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    price_unit VARCHAR(50) NOT NULL DEFAULT 'item',
    sku VARCHAR(100),
    stock_quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'published',
    is_available BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.vendor_catalog_items ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES vendor_categories(id) ON DELETE RESTRICT;
ALTER TABLE public.vendor_catalog_items ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE public.vendor_catalog_items ADD COLUMN IF NOT EXISTS sku VARCHAR(100);
ALTER TABLE public.vendor_catalog_items ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.vendor_catalog_items ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'published';
ALTER TABLE public.vendor_catalog_items ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 5. Vendor Catalog Item Images Gallery Table
CREATE TABLE IF NOT EXISTS vendor_catalog_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    catalog_item_id UUID NOT NULL REFERENCES vendor_catalog_items(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance B-Tree Indexes
CREATE INDEX IF NOT EXISTS idx_vendor_services_v_c_s ON vendor_services(vendor_id, category_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendor_service_images_s ON vendor_service_images(service_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_vendor_packages_v_c_s ON vendor_service_packages(vendor_id, category_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendor_catalog_items_v_c_sku ON vendor_catalog_items(vendor_id, category_id, sku) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendor_catalog_images_c ON vendor_catalog_images(catalog_item_id, sort_order);

-- Permissions for PostgREST Roles
GRANT SELECT, INSERT, UPDATE, DELETE ON vendor_services TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON vendor_service_images TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON vendor_service_packages TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON vendor_catalog_items TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON vendor_catalog_images TO anon, authenticated, service_role;

COMMIT;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';

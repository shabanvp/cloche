-- Phase 2B Migration 01: Configuration & Taxonomy Tables
-- File: supabase/migrations/20260805000001_config_create_taxonomies.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

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

COMMIT;

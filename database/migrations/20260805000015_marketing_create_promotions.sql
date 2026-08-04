-- Phase 2B Migration 15: Marketing & Promotions Engine
-- File: database/migrations/20260805000015_marketing_create_promotions.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

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

COMMIT;
